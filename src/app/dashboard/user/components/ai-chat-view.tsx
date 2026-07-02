"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowUp, Bot, ImageOff, Loader2, MessageSquare, Plus, Sparkles, Trash2, Wand2, Maximize2, X, Download, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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

// (No client-side AI SDK declarations needed — image generation is server-side)

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

function getJakartaGreeting() {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const hourPart = parts.find((p) => p.type === "hour");

  if (!hourPart) return "Halo";

  const h = parseInt(hourPart.value, 10);

  if (h >= 4 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";

  return "Selamat Malam";
}

export function AiChatView({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [chatMode, setChatMode] = useState<"instant" | "reasoning">("instant");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);
  // Track activeSessionId synchronously to avoid stale-closure bugs in async flows.
  const activeSessionIdRef = useRef<string | null>(null);
  const greeting = useMemo(() => getJakartaGreeting(), []);
  // Saat true, effect pemuat pesan tidak boleh menimpa pesan optimistik
  // yang sedang dikirim (mencegah jawaban AI terhapus saat sesi baru dibuat).
  const suppressLoadRef = useRef(false);

  // Keep ref in sync with state for synchronous reads in async callbacks.
  const setActiveSessionIdSynced = (id: string | null) => {
    activeSessionIdRef.current = id;
    setActiveSessionId(id);
  };

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

  const loadSessions = async (keepActiveId?: string) => {
    try {
      setIsLoadingHistory(true);
      const rows = await getChatSessions(userId);
      setSessions(rows);

      const idToKeep = keepActiveId ?? activeSessionIdRef.current;
      if (idToKeep && rows.some((item) => item.id === idToKeep)) {
        // Session still exists — keep it active without resetting messages
      } else {
        setActiveSessionIdSynced(null);
        setMessages([]);
      }
    } catch {
      setSessions([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isLoading ? "auto" : "smooth" });
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

  // ---- Image generation (via server-side /api/ai/image — Alibaba Wanx) --------

  const requestImage = async (prompt: string): Promise<string> => {
    const res = await fetch("/api/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? `Image API error ${res.status}`);
    }

    const data = await res.json() as { imageUrl?: string };
    if (!data.imageUrl) throw new Error("Tidak ada URL gambar dari server.");
    return data.imageUrl;
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
    // Use ref for synchronous read — avoids stale closure when state hasn't re-rendered yet.
    const currentId = activeSessionIdRef.current;
    if (currentId) {
      const existing = sessions.find((s) => s.id === currentId);
      if (existing) return existing;
    }
    const session = await createChatSession(userId, message.slice(0, 60) || "Percakapan Baru");
    setSessions((current) => [session, ...current]);
    setActiveSessionIdSynced(session.id);
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
        body: JSON.stringify({ messages: chatHistory, mode: chatMode }),
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
      const currentId = activeSessionIdRef.current;
      if (currentId) {
        await addChatMessage(currentId, "assistant", fallback).catch(() => null);
      }
    } finally {
      setIsLoading(false);
      // Pass the session ID we just used so loadSessions knows what to keep active.
      await loadSessions(activeSessionIdRef.current ?? undefined);
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
    <div className={`grid min-h-0 flex-1 bg-[#F8F6F2] transition-all duration-300 ${isSidebarOpen ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "grid-cols-1"}`}>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
        />
      )}
      
      {isSidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#E8E2D9] bg-white shadow-xl lg:static lg:w-auto lg:border-b-0 lg:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A7067]">
                Riwayat Chat
              </p>
              <p className="mt-1 text-[13px] text-[#6B5B52]">Session tersimpan</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveSessionIdSynced(null);
                  setMessages([]);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-2.5 text-[12px] font-semibold text-[#6B5B52] transition hover:bg-white"
                title="Chat Baru"
              >
                <Plus size={14} />
                Baru
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#6B5B52] transition hover:bg-white"
                title="Tutup Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
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
                      className={`flex items-start gap-2 rounded-2xl border p-3 ${active ? "border-[#D9C8BA] bg-[#FFFDF9]" : "border-[#E8E2D9] bg-white"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSessionIdSynced(session.id)}
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
                          if (activeSessionIdRef.current === session.id) {
                            const nextId = remaining[0]?.id ?? null;
                            setActiveSessionIdSynced(nextId);
                            if (!nextId) setMessages([]);
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
      )}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {!isSidebarOpen && (
          <div className="absolute left-4 top-4 z-10">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#6B5B52] shadow-sm transition hover:bg-gray-50"
              title="Buka Sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          </div>
        )}
        {!hasMessages ? (
          <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-[820px]">
              <div className="mx-auto w-full text-center px-4">
                <h1 className="font-serif text-[24px] leading-tight text-[#2F2925] sm:text-[28px] lg:text-[34px]">
                  {greeting}, adakah yang bisa dibantu?
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
                  chatMode={chatMode}
                  setChatMode={setChatMode}
                />
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-[760px] space-y-5">
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

            <section className="shrink-0 bg-[#F8F6F2]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-[760px]">
                <ChatInputBox
                  input={input}
                  setInput={setInput}
                  isLoading={isLoading}
                  onSend={() => sendMessage()}
                  onKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  variant="compact"
                  chatMode={chatMode}
                  setChatMode={setChatMode}
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
  chatMode,
  setChatMode,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  variant: "large" | "compact";
  chatMode: "instant" | "reasoning";
  setChatMode: (mode: "instant" | "reasoning") => void;
}) {
  const isLarge = variant === "large";

  return (
    <div
      className={`border border-[#E8E2D9] bg-white text-left ${isLarge
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
        className={`w-full resize-none bg-transparent px-1 text-[#3D3530] outline-none placeholder:text-[#B8B2AA] disabled:opacity-60 ${isLarge
          ? "max-h-[116px] min-h-[52px] text-[15px] leading-7 sm:text-[16px]"
          : "max-h-[104px] min-h-[42px] text-[14px] leading-6 sm:text-[15px]"
          }`}
      />

      <div className="mt-3 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-[#FAF6F1] p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setChatMode("instant")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${chatMode === "instant"
              ? "bg-white text-[#3D3530] shadow-sm"
              : "text-[#8B8179] hover:text-[#6B5B52]"
              }`}
          >
            Instant
          </button>
          <button
            type="button"
            onClick={() => setChatMode("reasoning")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${chatMode === "reasoning"
              ? "bg-white text-[#3D3530] shadow-sm"
              : "text-[#8B8179] hover:text-[#6B5B52]"
              }`}
          >
            Reasoning
          </button>
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={`grid shrink-0 place-items-center rounded-xl bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:cursor-not-allowed disabled:bg-[#D6D0CA] disabled:text-white ${isLarge ? "h-10 w-10" : "h-9 w-9"
            }`}
          aria-label="Kirim pesan"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
        </button>
      </div>
    </div>
  );
}

function AsciiSpinner() {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Warna disesuaikan dengan tema (#8B8179 atau #6B5B52)
  return (
    <span className="mr-2 inline-block w-4 text-center font-mono text-[14px] font-bold text-[#6B5B52]">
      {frames[frameIndex]}
    </span>
  );
}

function ThinkingIndicator() {
  const texts = [
    "Memahami konteks...",
    "Mencari referensi terbaik...",
    "Menyusun kerangka rencana...",
    "Menganalisis gaya desain...",
    "Memfinalisasi jawaban...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center text-[13px] font-extrabold tracking-wide sm:text-[14px]">
      <AsciiSpinner />
      <motion.span
        initial={{ backgroundPosition: "200% center" }}
        animate={{ backgroundPosition: "-200% center" }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(110deg, #B8B2AA 0%, #5A4A42 40%, #1A1412 50%, #5A4A42 60%, #B8B2AA 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {texts[index]}
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
            <span className="text-[10.5px] text-[#8B8179]">AI sedang membuat gambar</span>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-[#8B8179]">{caption}</p>
    </div>
  );
}

function GenerationBlock({ generation }: { generation: ChatGeneration }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-3 w-full max-w-[340px]"
      >
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#F5F0EA] shadow-[0_10px_28px_rgba(49,51,44,0.08)]"
        >
          <img
            src={generation.src}
            alt={generation.caption}
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/10">
            <span className="rounded-full bg-black/50 p-2 text-white opacity-0 transition group-hover:opacity-100">
              <Maximize2 size={16} />
            </span>
          </div>
        </button>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8B8179]">
          <Sparkles size={11} />
          {generation.caption}
        </p>
      </motion.div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            className="absolute right-4 top-4 text-white/70 transition hover:text-white"
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Tutup preview"
          >
            <X size={28} />
          </button>

          <img
            src={generation.src}
            alt={generation.caption}
            className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <a
            href={generation.src}
            download={`VMatch-AI-${generation.caption.replace(/\s+/g, "-")}.png`}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-8 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#3D3530] shadow-xl transition hover:scale-105 hover:bg-gray-50"
          >
            <Download size={16} />
            Download Gambar
          </a>
        </div>
      )}
    </>
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
    <div className="flex w-full items-start gap-3">
      <div className="min-w-0 flex-1 text-[#3D3530] py-1">
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