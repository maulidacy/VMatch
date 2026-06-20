"use client";

import Image from "next/image";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

type ChatMessage = {
  id: string;
  from: "ai" | "user";
  text: string;
  images?: {
    src: string;
    label: string;
  }[];
};

const quickPrompts = [
  "Budget kamar tidur",
  "Interior apartemen studio",
  "Wardrobe custom",
  "Kitchen set minimalis",
];

export function AiChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);

  const hasMessages = messages.length > 0;

  const createMessageId = (prefix: "user" | "ai") => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      116,
    )}px`;
  }, [input]);

  const parseAiContent = (
    text: string,
  ): {
    cleanText: string;
    images: { src: string; label: string }[];
  } => {
    const images: { src: string; label: string }[] = [];

    let cleanText = text.replace(
      /\[IMG:(\/[^\]|]+)\|([^\]]+)\]/g,
      (_, src, label) => {
        images.push({ src, label });
        return "";
      },
    );

    cleanText = cleanText.replace(
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    );

    return {
      cleanText: cleanText.trim(),
      images,
    };
  };

  const updateLastAiMessage = (text: string) => {
    const { cleanText, images } = parseAiContent(text);

    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;

      if (lastIndex < 0) return prev;

      updated[lastIndex] = {
        ...updated[lastIndex],
        from: "ai",
        text: cleanText || text,
        images: images.length > 0 ? images : undefined,
      };

      return updated;
    });
  };

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

  const readStreamResponse = async (response: Response) => {
    const reader = response.body?.getReader();

    if (!reader) {
      const text = await response.text();
      updateLastAiMessage(text || "Maaf, respons AI kosong.");
      return;
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
            updateLastAiMessage(fullText);
          }
        } catch {
          fullText += line;
          updateLastAiMessage(fullText);
        }
      }
    }

    const remaining = buffer.replace(/^data:\s?/, "").trim();

    if (!fullText.trim() && remaining && remaining !== "[DONE]") {
      try {
        const json = JSON.parse(remaining);
        updateLastAiMessage(
          String(json.content ?? json.message ?? json.reply ?? remaining),
        );
      } catch {
        updateLastAiMessage(remaining);
      }
    }
  };

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

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = nextMessages.map((item) => ({
        role: item.from === "ai" ? "assistant" : "user",
        content: item.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const content = await readJsonResponse(response);
        updateLastAiMessage(content);
        return;
      }

      await readStreamResponse(response);
    } catch {
      updateLastAiMessage(
        "Maaf, terjadi gangguan koneksi. Coba kirim ulang pesan dalam beberapa saat.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F6F2]">
      {!hasMessages ? (
        <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-[820px]">
            <div className="mx-auto max-w-[620px] text-center">
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-[#E8E2D9] bg-white text-[#6B5B52] shadow-[0_10px_26px_rgba(49,51,44,0.05)]">
                <Bot size={22} />
              </div>

              <h1 className="font-serif text-[30px] leading-tight text-[#2F2925] sm:text-[40px] lg:text-[44px]">
                Ada yang bisa dibantu?
              </h1>

              <p className="mx-auto mt-3 max-w-[540px] text-[13px] leading-6 text-[#7A7067] sm:text-[14px]">
                Tanyakan kebutuhan interior, estimasi budget, gaya desain, atau
                persiapan sebelum konsultasi bersama tim VMatch.
              </p>
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

            <QuickPromptList
              prompts={quickPrompts}
              isLoading={isLoading}
              onSelect={sendMessage}
              className="mx-auto mt-5 max-w-[680px] justify-center"
            />
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
                      VMatch AI
                    </h1>

                    <p className="truncate text-[11px] text-[#8B8179] sm:text-[12px]">
                      Smart assistant untuk brief awal interior customer
                    </p>
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
              <QuickPromptList
                prompts={quickPrompts}
                isLoading={isLoading}
                onSelect={sendMessage}
                className="mb-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                compact
              />

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
  );
}

function QuickPromptList({
  prompts,
  isLoading,
  onSelect,
  className = "",
  compact = false,
}: {
  prompts: string[];
  isLoading: boolean;
  onSelect: (prompt: string) => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex gap-2.5 ${compact ? "flex-nowrap" : "flex-wrap"} ${className}`}
    >
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={isLoading}
          className="shrink-0 rounded-full border border-[#E8E2D9] bg-white px-4 py-2 text-[12px] font-medium text-[#6B5B52] shadow-[0_6px_18px_rgba(49,51,44,0.025)] transition hover:border-[#6B5B52] hover:bg-[#FCFBF9] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
        >
          {prompt}
        </button>
      ))}
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
        placeholder="Tanya soal desain interior..."
        disabled={isLoading}
        className={`w-full resize-none bg-transparent px-1 text-[#3D3530] outline-none placeholder:text-[#B8B2AA] disabled:opacity-60 ${
          isLarge
            ? "max-h-[116px] min-h-[52px] text-[15px] leading-7 sm:text-[16px]"
            : "max-h-[104px] min-h-[42px] text-[14px] leading-6 sm:text-[15px]"
        }`}
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-[#B8B2AA]">
          VMatch AI
        </span>

        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={`grid shrink-0 place-items-center rounded-xl bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:cursor-not-allowed disabled:bg-[#D6D0CA] disabled:text-white ${
            isLarge ? "h-10 w-10" : "h-9 w-9"
          }`}
          aria-label="Kirim pesan"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  isLoading,
}: {
  message: ChatMessage;
  isLoading: boolean;
}) {
  if (message.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-2xl rounded-br-md bg-[#6B5B52] px-4 py-2.5 text-[14px] leading-6 text-white shadow-[0_8px_24px_rgba(107,91,82,0.14)] sm:max-w-[68%]">
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white sm:h-9 sm:w-9">
        <Bot size={15} />
      </div>

      <div className="min-w-0 max-w-[86%] rounded-2xl rounded-tl-md border border-[#E8E2D9] bg-white px-4 py-2.5 text-[14px] leading-6 text-[#3D3530] shadow-[0_8px_24px_rgba(49,51,44,0.035)] sm:max-w-[72%]">
        {message.text ? (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-[13px] text-[#8B8179] sm:text-[14px]">
            <Loader2 size={15} className="animate-spin" />
            <span>VMatch AI sedang menyusun jawaban...</span>
          </div>
        ) : null}

        {message.images && message.images.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {message.images.map((image) => (
              <div key={`${image.src}-${image.label}`} className="shrink-0">
                <div className="h-[120px] w-[170px] overflow-hidden rounded-xl border border-[#E8E2D9] bg-[#F5F0EA] sm:h-[140px] sm:w-[200px]">
                  <Image
                    src={image.src}
                    alt={image.label}
                    width={200}
                    height={140}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="mt-1.5 text-[11px] text-[#8B8179]">
                  {image.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
