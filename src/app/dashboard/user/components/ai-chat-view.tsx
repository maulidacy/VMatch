"use client";

import {
    Bookmark,
    Bot,
    Clock,
    FileText,
    Plus,
    Send,
    Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

type ChatMessage = {
    id: string;
    from: "ai" | "user";
    text: string;
};

type ChatHistoryItem = {
    id: string;
    title: string;
    time: string;
};

const initialMessages: ChatMessage[] = [
    {
        id: "m1",
        from: "ai",
        text:
            "Halo, saya VMatch AI. Ceritakan kebutuhan interior kamu, misalnya jenis ruangan, ukuran, budget, gaya desain, dan masalah yang ingin diselesaikan. Saya akan bantu menyusun brief awal sebelum dianalisis tim VMatch.",
    },
];

const chatHistories: ChatHistoryItem[] = [
    {
        id: "h1",
        title: "Kitchen set minimalis",
        time: "Hari ini",
    },
    {
        id: "h2",
        title: "Wardrobe kamar utama",
        time: "Kemarin",
    },
    {
        id: "h3",
        title: "Ruang tamu Japandi",
        time: "2 hari lalu",
    },
];

const quickPrompts = [
    "Bantu susun brief kitchen set minimalis budget 80 juta",
    "Saya ingin wardrobe custom untuk kamar kecil",
    "Rekomendasikan gaya Japandi untuk ruang tamu",
    "Apa saja yang perlu saya siapkan sebelum konsultasi?",
];

const savedBriefs = [
    {
        title: "Brief Kitchen Set",
        desc: "Modern minimalis, storage maksimal, budget Rp60–100 juta.",
    },
    {
        title: "Brief Wardrobe",
        desc: "Lemari kamar utama dengan finishing netral dan soft-close.",
    },
];

export function AiChatView() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = (value?: string) => {
        const message = (value ?? input).trim();

        if (!message || isTyping) return;

        setMessages((prev) => [
            ...prev,
            {
                id: `u-${prev.length + 1}`,
                from: "user",
                text: message,
            },
        ]);

        setInput("");
        setIsTyping(true);

        window.setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${prev.length + 1}`,
                    from: "ai",
                    text: createMockResponse(message),
                },
            ]);

            setIsTyping(false);
        }, 700);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex min-h-0 flex-1 overflow-hidden bg-[#F8F6F2]">
            <aside className="hidden w-[280px] shrink-0 border-r border-[#E8E2D9] bg-[#FEFDFB] p-4 lg:block">
                <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6B5B52] text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    <Plus size={15} />
                    Chat Baru
                </button>

                <div className="mt-5">
                    <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B8179]">
                        Riwayat
                    </p>

                    <div className="mt-3 space-y-1.5">
                        {chatHistories.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-[#F5F0EA]"
                            >
                                <p className="truncate text-[13px] font-semibold text-[#3D3530]">
                                    {item.title}
                                </p>
                                <p className="mt-0.5 text-[11px] text-[#8B8179]">
                                    {item.time}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#F8F6F2] p-4">
                    <div className="flex items-center gap-2 text-[#6B5B52]">
                        <Sparkles size={15} />
                        <p className="text-[12px] font-semibold">Catatan</p>
                    </div>

                    <p className="mt-2 text-[12px] leading-5 text-[#7A7067]">
                        Hasil VMatch AI hanya gambaran awal. Solusi final tetap divalidasi
                        oleh tim VMatch.
                    </p>
                </div>
            </aside>

            <section className="flex min-w-0 flex-1 flex-col">
                <div className="border-b border-[#E8E2D9] bg-[#F8F6F2]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                    <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6B5B52] text-white">
                                <Bot size={18} />
                            </div>

                            <div>
                                <h1 className="text-[15px] font-semibold text-[#3D3530]">
                                    VMatch AI
                                </h1>
                                <p className="text-[12px] text-[#8B8179]">
                                    Smart Brief Builder untuk kebutuhan interior
                                </p>
                            </div>
                        </div>

                        <span className="hidden rounded-full bg-[#F5F0EA] px-3 py-1 text-[11px] font-medium text-[#6B5B52] sm:inline-flex">
                            Frontend Mock
                        </span>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                    <div className="mx-auto grid max-w-[900px] gap-6 lg:grid-cols-[1fr_260px]">
                        <div className="min-w-0 space-y-5">
                            {messages.map((message) => (
                                <ChatBubble key={message.id} message={message} />
                            ))}

                            {isTyping && (
                                <div className="flex items-start gap-3">
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white">
                                        <Bot size={14} />
                                    </div>

                                    <div className="rounded-2xl bg-white px-4 py-3 text-[13px] text-[#8B8179] shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
                                        VMatch AI sedang menyusun brief...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <aside className="hidden space-y-4 lg:block">
                            <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
                                <p className="text-[13px] font-semibold text-[#3D3530]">
                                    Brief Tersimpan
                                </p>

                                <div className="mt-3 space-y-2">
                                    {savedBriefs.map((brief) => (
                                        <div key={brief.title} className="rounded-xl bg-[#F8F6F2] p-3">
                                            <div className="flex items-center gap-2 text-[#6B5B52]">
                                                <Bookmark size={14} />
                                                <p className="text-[12px] font-semibold">{brief.title}</p>
                                            </div>

                                            <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">
                                                {brief.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
                                <p className="text-[13px] font-semibold text-[#3D3530]">
                                    Alur Setelah Brief
                                </p>

                                <div className="mt-3 space-y-3">
                                    <StepItem icon={FileText} text="Brief awal disusun" />
                                    <StepItem icon={Clock} text="Tim VMatch validasi" />
                                    <StepItem icon={Sparkles} text="Solusi final dibuat" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                <div className="shrink-0 border-t border-[#E8E2D9] bg-[#F8F6F2]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                    <div className="mx-auto max-w-[900px]">
                        <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => sendMessage(prompt)}
                                    className="shrink-0 rounded-full border border-[#E8E2D9] bg-white px-3.5 py-2 text-[12px] font-medium text-[#7A7067] transition hover:border-[#6B5B52] hover:text-[#6B5B52]"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-3 shadow-[0_-2px_18px_rgba(0,0,0,0.03)]">
                            <textarea
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={2}
                                placeholder="Ceritakan kebutuhan interior kamu..."
                                className="max-h-[120px] min-h-[48px] w-full resize-none bg-transparent px-2 text-[14px] leading-6 text-[#3D3530] outline-none placeholder:text-[#B8B2AA]"
                            />

                            <div className="mt-2 flex items-center justify-between gap-3">
                                <p className="text-[11px] text-[#B8B2AA]">
                                    Tekan Enter untuk kirim, Shift + Enter untuk baris baru
                                </p>

                                <button
                                    type="button"
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isTyping}
                                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Kirim pesan"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ChatBubble({ message }: { message: ChatMessage }) {
    if (message.from === "user") {
        return (
            <div className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-br-md bg-[#6B5B52] px-4 py-3 text-[14px] leading-7 text-white">
                    {message.text}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white">
                <Bot size={14} />
            </div>

            <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14px] leading-7 text-[#3D3530] shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
}

function StepItem({
    icon: Icon,
    text,
}: {
    icon: typeof FileText;
    text: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F5F0EA] text-[#6B5B52]">
                <Icon size={14} />
            </div>

            <p className="text-[12px] font-medium text-[#7A7067]">{text}</p>
        </div>
    );
}

function createMockResponse(message: string) {
    const lower = message.toLowerCase();

    if (lower.includes("budget") || lower.includes("biaya")) {
        return `Berikut gambaran awal berdasarkan kebutuhan kamu:

1. Rekomendasi konsep:
Modern minimalis dengan fokus pada fungsi dan efisiensi ruang.

2. Estimasi budget:
Budget bisa dibagi menjadi material, hardware, finishing, produksi, instalasi, dan cadangan revisi.

3. Catatan penting:
Estimasi final tetap perlu divalidasi oleh tim VMatch setelah ukuran, material, dan kondisi lokasi dicek.

4. Langkah berikutnya:
Kamu bisa lanjut membuat request proyek agar tim VMatch menyusun solusi dan estimasi yang lebih akurat.`;
    }

    if (lower.includes("japandi") || lower.includes("minimalis")) {
        return `Saya sarankan arah desain berikut:

1. Konsep:
Japandi / modern minimalis dengan warna netral, kayu natural, dan bentuk furniture yang sederhana.

2. Warna:
Putih hangat, beige, greige, cokelat muda, dan aksen kayu walnut atau oak.

3. Material:
HPL motif kayu, hardware soft-close, dan finishing matte agar terlihat bersih.

4. Catatan:
Desain ini cocok untuk ruangan kecil karena membuat ruang terasa lebih terang, rapi, dan lega.`;
    }

    return `Saya bantu susun brief awal ya:

1. Kebutuhan utama:
Interior dibuat lebih rapi, fungsional, dan sesuai budget.

2. Data yang sebaiknya dilengkapi:
Jenis ruangan, ukuran, lokasi, style desain, budget, target waktu, serta referensi visual.

3. Rekomendasi awal:
Gunakan konsep yang sederhana dulu, lalu tim VMatch dapat membantu menyesuaikan material, layout, dan estimasi biaya.

4. Langkah berikutnya:
Setelah brief cukup jelas, kamu bisa ajukan request proyek agar tim VMatch melakukan analisis lanjutan.`;
}