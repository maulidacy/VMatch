"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowUp, Bot, ImageOff, Loader2, MessageSquare, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import {
  addChatMessage,
  createChatSession,
  deleteChatSession,
  getChatMessages,
  getChatSessions,
  updateChatSessionTitle,
} from "@/lib/api/chat";
import { uploadFileToStorage } from "@/lib/api/storage";
import type { ChatMessage as DBChatMessage, ChatSession } from "@/lib/supabase/types";
import { Markdown } from "./chat-markdown";

type ChatImage = {
  src: string;
  label: string;
};

type ChatGeneration = {
  id: string;
  prompt: string;
  caption: string;
  status: "pending" | "done" | "error";
  src?: string;
};

type ChatMessage = {
  id: string;
  from: "ai" | "user";
  text: string;
  images?: ChatImage[];
  generations?: ChatGeneration[];
};


const IMAGE_MARKER_GLOBAL = /\[IMAGE:\s*[^\]]+\]/g;

// ---- Parsing helpers (pure) -------------------------------------------------

function parseAiContent(text: string): {
  cleanText: string;
  images: ChatImage[];
  generations: { prompt: string; caption: string }[];
} {
  const images: ChatImage[] = [];
  const generations: { prompt: string; caption: string }[] = [];
  let cleanText = text;

  // Gambar hasil generate yang sudah tersimpan: [GENIMG:url|caption]
  cleanText = cleanText.replace(/\[GENIMG:([^\]|]+)\|([^\]]+)\]/g, (_, src: string, label: string) => {
    images.push({ src: src.trim(), label: label.trim() });
    return "";
  });

  // Backward-compat: gambar inspirasi lokal lama [IMG:/path|Label]
  cleanText = cleanText.replace(/\[IMG:(\/[^\]|]+)\|([^\]]+)\]/g, (_, src: string, label: string) => {
    images.push({ src: src.trim(), label: label.trim() });
    return "";
  });

  // Permintaan generate gambar dari AI: [IMAGE: english prompt | caption indo]
  cleanText = cleanText.replace(/\[IMAGE:\s*([^\]]+)\]/g, (_, body: string) => {
    const idx = body.indexOf("|");
    const prompt = (idx >= 0 ? body.slice(0, idx) : body).trim();
    const caption = (idx >= 0 ? body.slice(idx + 1) : "").trim() || "Visualisasi VMatch AI";
    if (prompt) generations.push({ prompt, caption });
    return "";
  });

  // Buang penanda yang belum lengkap saat streaming (mis. "[IMAGE: ...." belum ada "]").
  cleanText = cleanText.replace(/\[(?:IMAGE|GENIMG|IMG):[^\]]*$/i, "");

  // Buang emoji liar (kalau ada).
  cleanText = cleanText.replace(
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    "",
  );

  return { cleanText: cleanText.trim(), images, generations };
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(meta)?.[1] ?? "image/png";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// ---- Component --------------------------------------------------------------

export function AiChatView({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);
  // Saat true, effect pemuat pesan tidak boleh menimpa pesan optimistik
  // yang sedang dikirim (mencegah jawaban AI terhapus saat sesi baru dibuat).
  const suppressLoadRef = useRef(false);

  const hasMessages = messages.length > 0;

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [activeSessionId, sessions],
  );

  const createMessageId = (prefix: "user" | "ai") => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };

  const mapDbMessage = (message: DBChatMessage): ChatMessage => {
    if (message.role !== "assistant") {
      return { id: message.id, from: "user", text: message.content };
    }

    const parsed = parseAiContent(message.content);
    return {
      id: message.id,
      from: "ai",
      text: parsed.cleanText || message.content,
      images: parsed.images.length > 0 ? parsed.images : undefined,
    };
  };

  const loadSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const rows = await getChatSessions(userId);
      setSessions(rows);

      if (rows.length > 0) {
        const nextSessionId =
          activeSessionId && rows.some((item) => item.id === activeSessionId)
            ? activeSessionId
            : rows[0].id;
        setActiveSessionId(nextSessionId);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {
      setSessions([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    // Initial load on mount / user change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const loadMessages = async () => {
      // Jangan muat ulang dari DB saat sedang mengirim — pesan optimistik
      // (termasuk jawaban AI yang sedang di-stream) tidak boleh ditimpa.
      if (suppressLoadRef.current) return;

      if (!activeSessionId) {
        setMessages([]);
        return;
      }

      try {
        const rows = await getChatMessages(activeSessionId);
        setMessages(rows.map(mapDbMessage));
      } catch {
        setMessages([]);
      }
    };

    loadMessages();
  }, [activeSessionId]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 116)}px`;
  }, [input]);

  // ---- Message state updaters ----------------------------------------------

  const patchMessage = (messageId: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === messageId ? { ...message, ...patch } : message)),
    );
  };

  const patchGeneration = (
    messageId: string,
    generationId: string,
    patch: Partial<ChatGeneration>,
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId || !message.generations) return message;
        return {
          ...message,
          generations: message.generations.map((generation) =>
            generation.id === generationId ? { ...generation, ...patch } : generation,
          ),
        };
      }),
    );
  };

  const updateStreamingText = (messageId: string, rawText: string) => {
    const { cleanText, images } = parseAiContent(rawText);
    patchMessage(messageId, {
      from: "ai",
      text: cleanText || rawText,
      images: images.length > 0 ? images : undefined,
    });
  };

  // ---- Response readers -----------------------------------------------------

  const readJsonResponse = async (response: Response) => {
    const data = await response.json();
    return String(
      data.content ??
        data.message ??
        data.reply ??
        data.text ??
        "Maaf, saya belum mendapatkan jawaban dari sistem.",
    );
  };

  const readStreamResponse = async (response: Response, messageId: string) => {
    const reader = response.body?.getReader();
    if (!reader) {
      const text = await response.text();
      updateStreamingText(messageId, text);
      return text;
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const line = block.replace(/^data:\s?/, "").trim();
        if (!line || line === "[DONE]") continue;

        try {
          const json = JSON.parse(line);
          const content = json.content ?? json.message ?? json.reply ?? "";
          if (content) {
            fullText += content;
            updateStreamingText(messageId, fullText);
          }
        } catch {
          // abaikan fragmen non-JSON
        }
      }
    }

    return fullText;
  };

  // ---- Image generation -----------------------------------------------------

  const requestImage = async (prompt: string): Promise<string> => {
    const response = await fetch("/api/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`Image API error ${response.status}`);

    const data = await response.json();
    if (!data?.image) throw new Error("No image returned");
    return data.image as string;
  };

  const persistImage = async (dataUrl: string, sessionId: string): Promise<string> => {
    const blob = dataUrlToBlob(dataUrl);
    const ext = blob.type.includes("jpeg") || blob.type.includes("jpg") ? "jpg" : "png";
    const file = new File([blob], `${crypto.randomUUID()}.${ext}`, { type: blob.type });
    const path = `chat-images/${sessionId}/${file.name}`;
    return uploadFileToStorage("vmatch-files", path, file);
  };

  // ---- Finalize assistant message (parse + generate + persist) -------------

  const finalizeAssistantMessage = async (
    messageId: string,
    rawText: string,
    sessionId: string,
  ) => {
    const parsed = parseAiContent(rawText);

    const generations: ChatGeneration[] = parsed.generations.map((generation, index) => ({
      id: `${messageId}-gen-${index}`,
      prompt: generation.prompt,
      caption: generation.caption,
      status: "pending",
    }));

    patchMessage(messageId, {
      from: "ai",
      text: parsed.cleanText || rawText,
      images: parsed.images.length > 0 ? parsed.images : undefined,
      generations: generations.length > 0 ? generations : undefined,
    });

    let persistContent = rawText;

    if (generations.length > 0) {
      const generation = generations[0];
      try {
        const dataUrl = await requestImage(generation.prompt);
        // Tampilkan langsung dari data URL supaya cepat terlihat.
        patchGeneration(messageId, generation.id, { status: "done", src: dataUrl });

        let storedUrl = dataUrl;
        try {
          storedUrl = await persistImage(dataUrl, sessionId);
          patchGeneration(messageId, generation.id, { src: storedUrl });
        } catch (uploadError) {
          // Upload gagal -> tetap simpan data URL agar tidak hilang saat reload.
          console.warn("Chat image upload failed, falling back to data URL.", uploadError);
        }

        persistContent = rawText.replace(
          IMAGE_MARKER_GLOBAL,
          `[GENIMG:${storedUrl}|${generation.caption}]`,
        );
      } catch (generationError) {
        console.error("Image generation failed:", generationError);
        patchGeneration(messageId, generation.id, { status: "error" });
        persistContent = rawText.replace(IMAGE_MARKER_GLOBAL, "").trim();
      }
    }

    await addChatMessage(sessionId, "assistant", persistContent).catch(() => null);
  };

  // ---- Session helpers ------------------------------------------------------

  const ensureSession = async (message: string) => {
    if (activeSession) return activeSession;
    const session = await createChatSession(userId, message.slice(0, 60) || "Percakapan Baru");
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
    return session;
  };

  // ---- Send -----------------------------------------------------------------

  const sendMessage = async (value?: string) => {
    const message = (value ?? input).trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      from: "user",
      text: message,
    };

    const aiPlaceholder: ChatMessage = {
      id: createMessageId("ai"),
      from: "ai",
      text: "",
    };

    const nextMessages = [...messages, userMessage];
    const isFirstMessage = messages.length === 0;

    // Cegah effect [activeSessionId] menimpa pesan optimistik selama proses kirim.
    suppressLoadRef.current = true;

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    setInput("");
    setIsLoading(true);

    try {
      const session = await ensureSession(message);
      await addChatMessage(session.id, "user", message);

      const chatHistory = nextMessages.map((item) => ({
        role: item.from === "ai" ? "assistant" : "user",
        content: item.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get("content-type") ?? "";
      let fullText = "";

      if (contentType.includes("application/json")) {
        fullText = await readJsonResponse(response);
        updateStreamingText(aiPlaceholder.id, fullText);
      } else {
        fullText = await readStreamResponse(response, aiPlaceholder.id);
      }

      if (!fullText.trim()) {
        fullText = "Maaf, saya belum mendapatkan jawaban dari sistem.";
        updateStreamingText(aiPlaceholder.id, fullText);
      }

      await finalizeAssistantMessage(aiPlaceholder.id, fullText, session.id);

      if (isFirstMessage) {
        await updateChatSessionTitle(session.id, message.slice(0, 60)).catch(() => null);
      }
    } catch {
      const fallback =
        "Maaf, terjadi gangguan koneksi. Coba kirim ulang pesan dalam beberapa saat.";
      patchMessage(aiPlaceholder.id, { from: "ai", text: fallback });
      if (activeSessionId) {
        await addChatMessage(activeSessionId, "assistant", fallback).catch(() => null);
      }
    } finally {
      setIsLoading(false);
      await loadSessions();
      // Selesai kirim — izinkan lagi pemuatan pesan dari DB saat ganti sesi.
      suppressLoadRef.current = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ---- Render ---------------------------------------------------------------

  return (
    <div className="grid min-h-0 flex-1 bg-[#F8F6F2] lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border-b border-[#E8E2D9] bg-white lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-[#E8E2D9] p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A7067]">
              Riwayat Chat
            </p>
            <p className="mt-1 text-[13px] text-[#6B5B52]">Session tersimpan</p>
          </div>

          <button
            type="button"
            onClick={async () => {
              const session = await createChatSession(userId, "Percakapan Baru");
              setSessions((current) => [session, ...current]);
              setActiveSessionId(session.id);
              setMessages([]);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3 text-[12px] font-semibold text-[#6B5B52] transition hover:bg-white"
          >
            <Plus size={14} />
            Baru
          </button>
        </div>

        <div className="max-h-[240px] overflow-y-auto p-3 lg:max-h-none lg:h-[calc(100vh-220px)]">
          {isLoadingHistory ? (
            <div className="py-8 text-center text-[13px] text-[#8B8179]">Memuat riwayat...</div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-4 text-center">
              <MessageSquare size={18} className="mx-auto text-[#6B5B52]" />
              <p className="mt-3 text-[13px] font-semibold text-[#3D3530]">Belum ada chat</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const active = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    className={`flex items-start gap-2 rounded-2xl border p-3 ${
                      active ? "border-[#D9C8BA] bg-[#FFFDF9]" : "border-[#E8E2D9] bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSessionId(session.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-[13px] font-semibold text-[#3D3530]">
                        {session.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8B8179]">
                        {new Date(session.updated_at).toLocaleDateString("id-ID")}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await deleteChatSession(session.id).catch(() => null);
                        const remaining = sessions.filter((item) => item.id !== session.id);
                        setSessions(remaining);
                        if (activeSessionId === session.id) {
                          setActiveSessionId(remaining[0]?.id ?? null);
                          if (remaining.length === 0) setMessages([]);
                        }
                      }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8B8179] transition hover:bg-[#F5F0EA] hover:text-[#6B5B52]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        {!hasMessages ? (
          <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-[820px]">
              <div className="mx-auto max-w-[620px] text-center">
                <h1 className="font-serif text-[30px] leading-tight text-[#2F2925] sm:text-[40px] lg:text-[44px]">
                  Halo, adakah yang bisa dibantu?
                </h1>
              </div>

              <div className="mx-auto mt-7 w-full max-w-[810px]">
                <ChatInputBox
                  input={input}
                  setInput={setInput}
                  isLoading={isLoading}
                  onSend={() => sendMessage()}
                  onKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  variant="large"
                />
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-[760px] space-y-5">
                <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-[#E8E2D9] bg-white/95 px-3 py-3 shadow-[0_8px_24px_rgba(49,51,44,0.035)] backdrop-blur-xl sm:mx-0 sm:px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#6B5B52] text-white">
                      <Bot size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h1 className="truncate text-[14px] font-semibold text-[#3D3530]">
                        {activeSession?.title || "VMatch AI"}
                      </h1>
                    </div>

                    <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#F5F0EA] px-3 py-1 text-[11px] font-medium text-[#6B5B52] sm:inline-flex">
                      <Sparkles size={12} />
                      AI aktif
                    </span>
                  </div>
                </div>

                <div className="space-y-5 pb-2">
                  {messages.map((message, index) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      isLoading={isLoading && index === messages.length - 1}
                    />
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </section>

            <section className="shrink-0 border-t border-[#E8E2D9] bg-[#F8F6F2]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-[760px]">
                <ChatInputBox
                  input={input}
                  setInput={setInput}
                  isLoading={isLoading}
                  onSend={() => sendMessage()}
                  onKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  variant="compact"
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function ChatInputBox({
  input,
  setInput,
  isLoading,
  onSend,
  onKeyDown,
  textareaRef,
  variant,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  variant: "large" | "compact";
}) {
  const isLarge = variant === "large";

  return (
    <div
      className={`border border-[#E8E2D9] bg-white text-left ${
        isLarge
          ? "rounded-3xl p-4 shadow-[0_18px_45px_rgba(49,51,44,0.07)]"
          : "rounded-2xl p-3 shadow-[0_10px_28px_rgba(49,51,44,0.055)]"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={onKeyDown}
        rows={isLarge ? 2 : 1}
        placeholder="Tanya soal desain, budget, atau minta visualisasi..."
        disabled={isLoading}
        className={`w-full resize-none bg-transparent px-1 text-[#3D3530] outline-none placeholder:text-[#B8B2AA] disabled:opacity-60 ${
          isLarge
            ? "max-h-[116px] min-h-[52px] text-[15px] leading-7 sm:text-[16px]"
            : "max-h-[104px] min-h-[42px] text-[14px] leading-6 sm:text-[15px]"
        }`}
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-[#B8B2AA]">VMatch AI</span>

        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={`grid shrink-0 place-items-center rounded-xl bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:cursor-not-allowed disabled:bg-[#D6D0CA] disabled:text-white ${
            isLarge ? "h-10 w-10" : "h-9 w-9"
          }`}
          aria-label="Kirim pesan"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
        </button>
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center text-[13px] font-medium sm:text-[14px]">
      <motion.span
        initial={{ backgroundPosition: "-200% center" }}
        animate={{ backgroundPosition: "200% center" }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(110deg, #A8A199 0%, #3D3530 50%, #A8A199 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Thinking
      </motion.span>
    </div>
  );
}

function GeneratingImageCard({ caption }: { caption: string }) {
  return (
    <div className="mt-3 w-full max-w-[340px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#EFE8E0]">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.65) 50%, transparent 80%)",
          }}
          animate={{ x: ["-130%", "130%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2.5 text-[#6B5B52]">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/70 shadow-[0_8px_20px_rgba(107,91,82,0.18)]"
            >
              <Wand2 size={20} />
            </motion.div>
            <span className="text-[12px] font-semibold">Membuat visualisasi...</span>
            <span className="text-[10.5px] text-[#8B8179]">Gemini sedang menggambar</span>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-[#8B8179]">{caption}</p>
    </div>
  );
}

function GenerationBlock({ generation }: { generation: ChatGeneration }) {
  if (generation.status === "pending") {
    return <GeneratingImageCard caption={generation.caption} />;
  }

  if (generation.status === "error") {
    return (
      <div className="mt-3 flex w-full max-w-[340px] items-center gap-2.5 rounded-2xl border border-dashed border-[#E0D6CB] bg-[#FAF6F1] px-4 py-3 text-[12px] text-[#8B8179]">
        <ImageOff size={16} className="shrink-0" />
        <span>Maaf, visualisasi gagal dibuat. Coba minta lagi ya.</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-3 w-full max-w-[340px]"
    >
      <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#F5F0EA] shadow-[0_10px_28px_rgba(49,51,44,0.08)]">
        <img src={generation.src} alt={generation.caption} className="h-auto w-full object-cover" />
      </div>
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8B8179]">
        <Sparkles size={11} />
        {generation.caption}
      </p>
    </motion.div>
  );
}

function ChatBubble({ message, isLoading }: { message: ChatMessage; isLoading: boolean }) {
  if (message.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-2xl rounded-br-md bg-[#6B5B52] px-4 py-2.5 text-[14px] leading-6 text-white shadow-[0_8px_24px_rgba(107,91,82,0.14)] sm:max-w-[68%]">
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      </div>
    );
  }

  const showThinking = !message.text && isLoading;

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white sm:h-9 sm:w-9">
        <Bot size={15} />
      </div>

      <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border border-[#E8E2D9] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(49,51,44,0.035)] sm:max-w-[76%]">
        {showThinking ? <ThinkingIndicator /> : message.text ? <Markdown content={message.text} /> : null}

        {message.images && message.images.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {message.images.map((image) => (
              <div key={`${image.src}-${image.label}`} className="shrink-0">
                <div className="h-[120px] w-[170px] overflow-hidden rounded-xl border border-[#E8E2D9] bg-[#F5F0EA] sm:h-[140px] sm:w-[200px]">
                  <img src={image.src} alt={image.label} className="h-full w-full object-cover" />
                </div>
                <p className="mt-1.5 text-[11px] text-[#8B8179]">{image.label}</p>
              </div>
            ))}
          </div>
        )}

        {message.generations?.map((generation) => (
          <GenerationBlock key={generation.id} generation={generation} />
        ))}
      </div>
    </div>
  );
}
