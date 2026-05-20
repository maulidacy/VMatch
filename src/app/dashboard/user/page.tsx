"use client";

import {
  Bell,
  Bot,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Send,
  Settings,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogDesign } from "./components/catalog-design";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageId = "dashboard" | "katalog" | "ai" | "proyek" | "settings";

type MenuItem = { id: PageId; label: string; icon: LucideIcon };

type ProjectStatus = "request" | "planning" | "production" | "revision" | "done";

type TimelineEntry = {
  title: string;
  date: string;
  description: string;
  image?: string;
  done: boolean;
};

type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  status: ProjectStatus;
  statusLabel: string;
  progress: number;
  timeline: TimelineEntry[];
  nextMeeting?: string;
  revisions: { date: string; text: string; status: string }[];
  files: { name: string; type: string; date: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "katalog", label: "Katalog Desain", icon: ImageIcon },
  { id: "ai", label: "VMatch Helper", icon: Bot },
  { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

const projects: Project[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    type: "Kitchen Set",
    location: "Bandung",
    status: "production",
    statusLabel: "Produksi",
    progress: 68,
    nextMeeting: "22 Mei 2026, 13:00 WIB",
    timeline: [
      { title: "Request diterima", date: "15 Mei 2026", description: "Tim VMatch sudah menerima brief kamu.", done: true },
      { title: "Perencanaan & solusi", date: "16 Mei 2026", description: "Konsep, material, dan RAB sudah disusun.", done: true },
      { title: "Koordinasi vendor", date: "18 Mei 2026", description: "Partner produksi sudah ditentukan.", image: "/figma/hero-kitchen.webp", done: true },
      { title: "Produksi", date: "24 Mei 2026", description: "Modul utama sedang diproduksi. Estimasi selesai minggu ke-3 Juni.", image: "/figma/benefits-kitchen.webp", done: false },
      { title: "Finishing & instalasi", date: "Estimasi Juli 2026", description: "Pemasangan di lokasi.", done: false },
    ],
    revisions: [
      { date: "15 Mei 2026", text: "Handle kabinet dibuat hidden, warna lebih terang.", status: "Diproses" },
    ],
    files: [
      { name: "RAB Kitchen Set Walnut.pdf", type: "RAB", date: "15 Mei 2026" },
      { name: "Referensi Japandi.png", type: "Referensi", date: "14 Mei 2026" },
      { name: "Foto Progress Minggu 1.jpg", type: "Progress", date: "18 Mei 2026" },
    ],
  },
  {
    id: "2",
    name: "Wardrobe Minimalis",
    type: "Wardrobe",
    location: "Semarang",
    status: "request",
    statusLabel: "Menunggu Solusi",
    progress: 10,
    timeline: [
      { title: "Request diterima", date: "12 Mei 2026", description: "Brief sudah masuk, menunggu analisis tim.", done: true },
      { title: "Analisis kebutuhan", date: "Menunggu", description: "Tim akan menyusun solusi.", done: false },
    ],
    revisions: [],
    files: [
      { name: "Referensi Wardrobe.png", type: "Referensi", date: "12 Mei 2026" },
    ],
  },
  {
    id: "3",
    name: "Backdrop TV Modern",
    type: "Backdrop TV",
    location: "Jakarta",
    status: "done",
    statusLabel: "Selesai",
    progress: 100,
    timeline: [
      { title: "Request diterima", date: "1 Mar 2026", description: "Brief sudah masuk.", done: true },
      { title: "Produksi & instalasi", date: "15 Mar 2026", description: "Selesai dipasang.", done: true },
    ],
    revisions: [],
    files: [
      { name: "Invoice Final.pdf", type: "Invoice", date: "20 Mar 2026" },
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

export default function UserDashboardPage() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeMenu = useMemo(
    () => menuItems.find((item) => item.id === activePage) ?? menuItems[0],
    [activePage],
  );

  const changePage = (page: PageId) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  return (
    <main className="min-h-[100dvh] bg-[#F8F6F2] text-[#2C2C2C]">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[250px] flex-col border-r border-[#E8E2D9] bg-[#FEFDFB] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="font-serif text-[22px] italic text-[#3D3530]">VMatch</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="grid h-7 w-7 place-items-center rounded-full text-[#8B8179] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Tutup">
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changePage(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#6B5B52]/10 text-[#6B5B52]" : "text-[#7A7067] hover:bg-[#F5F0EA] hover:text-[#3D3530]"}`}
              >
                <Icon size={17} strokeWidth={active ? 2 : 1.6} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-[#E8E2D9] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white">
              <UserRound size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#3D3530]">Customer</p>
              <p className="truncate text-[11px] text-[#8B8179]">customer@email.com</p>
            </div>
          </div>
          <Link href="/login" className="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg text-[12px] font-medium text-[#8B8179] transition-colors hover:bg-[#F5F0EA] hover:text-[#6B5B52]">
            <LogOut size={14} />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Content */}
      <section className="flex min-h-[100dvh] flex-col lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Menu">
            <Menu size={18} />
          </button>
          <p className="flex-1 text-[13px] font-medium text-[#7A7067]">{activeMenu.label}</p>
          <button className="grid h-8 w-8 place-items-center rounded-full text-[#7A7067] transition hover:bg-[#F0EBE4]" aria-label="Notifikasi">
            <Bell size={17} />
          </button>
        </header>

        {/* Page content */}
        {activePage === "ai" ? (
          <AiChatView />
        ) : (
          <div className="w-full px-5 py-6 sm:px-6 lg:px-8">
            {activePage === "dashboard" && <DashboardView onChangePage={changePage} />}
            {activePage === "katalog" && <CatalogDesign onChangePage={changePage as (page: string) => void} />}
            {activePage === "proyek" && <ProyekView />}
            {activePage === "settings" && <SettingsView />}
          </div>
        )}
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20VMatch%2C%20saya%20ingin%20follow%20up%20proyek%20saya."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
        aria-label="Chat via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}

// ─── Dashboard Overview ──────────────────────────────────────────────────────

function DashboardView({ onChangePage }: { onChangePage: (p: PageId) => void }) {
  const activeProjects = projects.filter((p) => p.status !== "done");

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">
          Selamat datang
        </h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">
          Pantau proyek, jelajahi katalog, atau mulai konsultasi AI.
        </p>
      </div>

      {/* Quick access cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickCard icon={FolderOpen} label="Proyek Aktif" value={String(activeProjects.length)} onClick={() => onChangePage("proyek")} />
        <QuickCard icon={ImageIcon} label="Katalog Desain" value="Jelajahi" onClick={() => onChangePage("katalog")} />
        <QuickCard icon={Bot} label="VMatch Helper" value="Tanya AI" onClick={() => onChangePage("ai")} />
        <QuickCard icon={Plus} label="Proyek Baru" value="Ajukan" onClick={() => onChangePage("proyek")} accent />
      </div>

      {/* Active projects */}
      {activeProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Proyek Aktif</h2>
            <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
              Lihat semua →
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {activeProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => onChangePage("proyek")}
                className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all duration-200 hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                      <StatusPill status={project.statusLabel} />
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.type} · {project.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden w-20 sm:block">
                      <div className="h-1.5 rounded-full bg-[#EDE8E1]">
                        <div className="h-full rounded-full bg-[#6B5B52] transition-all" style={{ width: `${project.progress}%` }} />
                      </div>
                      <p className="mt-1 text-right text-[11px] text-[#8B8179]">{project.progress}%</p>
                    </div>
                    <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
                  </div>
                </div>
                {project.nextMeeting && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#8B8179]">
                    <CalendarDays size={12} />
                    Meeting: {project.nextMeeting}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent activity */}
      <section>
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Aktivitas Terbaru</h2>
        <div className="mt-3 rounded-xl border border-[#E8E2D9] bg-white">
          {projects
            .flatMap((p) => p.timeline.filter((t) => t.done).map((t) => ({ ...t, project: p.name })))
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 4)
            .map((activity, i, arr) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F0EBE4]" : ""}`}>
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6B5B52]" />
                <div>
                  <p className="text-[13px] font-medium text-[#3D3530]">{activity.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#8B8179]">{activity.project} · {activity.date}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

// ─── AI Chat (VMatch Helper) ─────────────────────────────────────────────────

type ChatMessage = {
  from: "ai" | "user";
  text: string;
  images?: { src: string; label: string }[];
  quickReplies?: string[];
};

// Parse markdown-like formatting to JSX
function FormatText({ text }: { text: string }) {
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2.5">
      {paragraphs.map((para, pi) => {
        // Check if it's a numbered list
        const listItems = para.split(/\n/).filter(Boolean);
        const isNumberedList = listItems.length > 1 && listItems.every((l) => /^\d+[\.\)]/.test(l.trim()));
        const isBulletList = listItems.length > 1 && listItems.every((l) => /^[-•*]/.test(l.trim()));

        if (isNumberedList || isBulletList) {
          return (
            <ol key={pi} className={`space-y-1.5 pl-1 ${isNumberedList ? "list-none" : "list-none"}`}>
              {listItems.map((item, li) => {
                const cleaned = item.replace(/^\d+[\.\)]\s*|^[-•*]\s*/, "");
                return (
                  <li key={li} className="flex gap-2 text-[14px] leading-relaxed">
                    <span className="mt-0.5 shrink-0 text-[#6B5B52] font-medium">{isNumberedList ? `${li + 1}.` : "•"}</span>
                    <span><InlineFormat text={cleaned} /></span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Single line items split by \n
        const lines = para.split(/\n/);
        if (lines.length > 1) {
          return (
            <div key={pi} className="space-y-1">
              {lines.map((line, li) => (
                <p key={li} className="text-[14px] leading-relaxed"><InlineFormat text={line} /></p>
              ))}
            </div>
          );
        }

        return <p key={pi} className="text-[14px] leading-relaxed"><InlineFormat text={para} /></p>;
      })}
    </div>
  );
}

function InlineFormat({ text }: { text: string }) {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-[#3D3530]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// Extract quick-reply suggestions from AI text
function extractQuickReplies(text: string): string[] {
  const replies: string[] = [];
  // Match numbered questions like "1. **Ukuran ruang** – ..."
  const matches = text.match(/\d+[\.\)]\s*\*\*([^*]+)\*\*/g);
  if (matches && matches.length >= 2) {
    matches.slice(0, 4).forEach((m) => {
      const label = m.replace(/^\d+[\.\)]\s*\*\*/, "").replace(/\*\*$/, "").trim();
      if (label.length < 30) replies.push(label);
    });
  }
  return replies;
}

function AiChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const parseAiContent = (text: string): { cleanText: string; images: { src: string; label: string }[] } => {
    const images: { src: string; label: string }[] = [];
    const cleanText = text.replace(/\[IMG:(\/[^\]|]+)\|([^\]]+)\]/g, (_, src, label) => {
      images.push({ src, label });
      return "";
    }).trim();
    return { cleanText, images };
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const chatHistory = [
        ...messages.map((m) => ({
          role: m.from === "ai" ? "assistant" : "user",
          content: m.text,
        })),
        { role: "user", content: userMessage },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      setMessages((prev) => [...prev, { from: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.replace(/^data: /, "").trim();
          if (!trimmed || trimmed === "[DONE]") continue;
          try {
            const json = JSON.parse(trimmed);
            if (json.content) {
              fullText += json.content;
              const { cleanText, images } = parseAiContent(fullText);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { from: "ai", text: cleanText || fullText, images: images.length > 0 ? images : undefined };
                return updated;
              });
            }
          } catch {
            // Skip
          }
        }
      }

      const { cleanText, images } = parseAiContent(fullText);
      const quickReplies = extractQuickReplies(cleanText || fullText);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: "ai",
          text: cleanText || fullText,
          images: images.length > 0 ? images : undefined,
          quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        };
        return updated;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Maaf, terjadi gangguan koneksi. Coba lagi dalam beberapa saat." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => sendMessage(input.trim());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickReply = (reply: string) => {
    // Remove quick replies from last message when user picks one
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].quickReplies) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], quickReplies: undefined };
      }
      return updated;
    });
    sendMessage(reply);
  };

  // Input component (reused in both states)
  const InputBar = (
    <div className="flex items-center gap-2 rounded-2xl border border-[#E8E2D9] bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow focus-within:border-[#6B5B52] focus-within:shadow-[0_4px_20px_rgba(107,91,82,0.08)]">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tulis pertanyaan kamu..."
        disabled={isLoading}
        className="min-w-0 flex-1 bg-transparent py-1 text-[14px] text-[#3D3530] outline-none disabled:opacity-50 placeholder:text-[#B8B2AA]"
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:opacity-30"
      >
        <Send size={14} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {!hasMessages ? (
        /* Empty state — centered */
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#6B5B52] text-white">
            <Bot size={22} />
          </div>
          <h2 className="mt-4 text-center font-serif text-[24px] text-[#3D3530]">
            Ada yang bisa dibantu?
          </h2>
          <p className="mt-2 max-w-[420px] text-center text-[13px] leading-5 text-[#8B8179]">
            Konsultasi desain interior, material, budget, atau cari inspirasi.
          </p>
          <div className="mt-8 w-full max-w-[560px]">{InputBar}</div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6">
            <div className="mx-auto max-w-[680px] py-6">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-5 ${msg.from === "user" ? "flex justify-end" : ""}`}>
                  {msg.from === "user" ? (
                    <div className="rounded-2xl rounded-br-sm bg-[#6B5B52] px-4 py-2.5 text-[14px] leading-relaxed text-white">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="flex gap-2.5">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#6B5B52] text-white">
                        <Bot size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* AI text content */}
                        {msg.text ? (
                          <div className="text-[#3D3530]">
                            <FormatText text={msg.text} />
                          </div>
                        ) : isLoading && i === messages.length - 1 ? (
                          /* Shimmer loading */
                          <div className="flex items-center gap-2 py-1">
                            <div className="shimmer-bar h-2 w-16 rounded-full" />
                            <div className="shimmer-bar h-2 w-24 rounded-full" style={{ animationDelay: "0.15s" }} />
                            <div className="shimmer-bar h-2 w-12 rounded-full" style={{ animationDelay: "0.3s" }} />
                          </div>
                        ) : null}

                        {/* Images */}
                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-3 flex gap-2.5 overflow-x-auto">
                            {msg.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="shrink-0">
                                <div className="h-[130px] w-[185px] overflow-hidden rounded-xl border border-[#E8E2D9]">
                                  <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                                </div>
                                <p className="mt-1.5 text-[11px] text-[#8B8179]">{img.label}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick reply buttons */}
                        {msg.quickReplies && !isLoading && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.quickReplies.map((reply, ri) => (
                              <button
                                key={ri}
                                onClick={() => handleQuickReply(reply)}
                                className="rounded-lg border border-[#E8E2D9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:border-[#6B5B52] hover:bg-[#F5F0EA]"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bottom */}
          <div className="shrink-0 px-5 pb-4 pt-2 sm:px-6">
            <div className="mx-auto max-w-[680px]">{InputBar}</div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Proyek ──────────────────────────────────────────────────────────────────

type FilterTab = "semua" | "request" | "berjalan" | "selesai";

function ProyekView() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("semua");

  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "request": return projects.filter((p) => p.status === "request");
      case "berjalan": return projects.filter((p) => ["planning", "production", "revision"].includes(p.status));
      case "selesai": return projects.filter((p) => p.status === "done");
      default: return projects;
    }
  }, [activeFilter]);

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "semua", label: "Semua", count: projects.length },
    { id: "request", label: "Request", count: projects.filter((p) => p.status === "request").length },
    { id: "berjalan", label: "Berjalan", count: projects.filter((p) => ["planning", "production", "revision"].includes(p.status)).length },
    { id: "selesai", label: "Selesai", count: projects.filter((p) => p.status === "done").length },
  ];

  if (showNewForm) return <NewProjectForm onBack={() => setShowNewForm(false)} />;
  if (selectedProject) return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Proyek Saya</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Ajukan Proyek</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeFilter === tab.id ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067] hover:text-[#3D3530]"}`}
          >
            {tab.label} <span className="ml-1 text-[11px] opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D4C9BD] py-12 text-center">
          <p className="text-[14px] text-[#8B8179]">Tidak ada proyek di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all duration-200 hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                    <StatusPill status={project.statusLabel} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.type} · {project.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-20 sm:block">
                    <div className="h-1.5 rounded-full bg-[#EDE8E1]">
                      <div className="h-full rounded-full bg-[#6B5B52]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[11px] text-[#8B8179]">{project.progress}%</p>
                  </div>
                  <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"timeline" | "files">("timeline");
  const [feedbackTarget, setFeedbackTarget] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
        <ChevronRight size={14} className="rotate-180" />
        Kembali
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] leading-tight text-[#3D3530] sm:text-[32px]">{project.name}</h1>
          <p className="mt-1 text-[13px] text-[#8B8179]">{project.type} · {project.location}</p>
        </div>
        <StatusPill status={project.statusLabel} />
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#7A7067]">Progress</span>
          <span className="font-semibold text-[#3D3530]">{project.progress}%</span>
        </div>
        <div className="mt-2.5 h-2 rounded-full bg-[#EDE8E1]">
          <div className="h-full rounded-full bg-[#6B5B52] transition-all duration-700" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Meeting */}
      {project.nextMeeting && (
        <div className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-white p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
            <CalendarDays size={16} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[#3D3530]">Meeting terjadwal</p>
            <p className="text-[12px] text-[#8B8179]">{project.nextMeeting}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {([
          { id: "timeline" as const, label: "Timeline & Catatan" },
          { id: "files" as const, label: "File" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeTab === tab.id ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067] hover:text-[#3D3530]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        {activeTab === "timeline" && (
          <div className="space-y-0">
            {project.timeline.map((entry, i) => {
              const entryRevisions = project.revisions.filter((r) => r.date === entry.date);
              return (
                <div key={entry.title} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-3 w-3 rounded-full border-2 ${entry.done ? "border-[#6B5B52] bg-[#6B5B52]" : "border-[#D4C9BD] bg-white"}`} />
                    {i < project.timeline.length - 1 && <div className="w-px flex-1 bg-[#E8E2D9]" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-[#3D3530]">{entry.title}</p>
                        <p className="text-[11px] text-[#8B8179]">{entry.date}</p>
                      </div>
                      {entry.done && (
                        <button
                          onClick={() => setFeedbackTarget(entry.title)}
                          className="flex shrink-0 items-center gap-1 rounded-md border border-[#E8E2D9] px-2 py-1 text-[11px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]"
                        >
                          <Plus size={11} />
                          Catatan
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">{entry.description}</p>
                    {entry.image && (
                      <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-[#F0EBE4]">
                        <img src={entry.image} alt={entry.title} className="h-full w-full object-cover" />
                      </div>
                    )}

                    {/* Catatan/revisi terkait entry ini */}
                    {entryRevisions.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {entryRevisions.map((r, ri) => (
                          <div key={ri} className="rounded-lg border border-[#EDE5D8] bg-[#FDF8F0] px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[12px] text-[#5A4A42]">{r.text}</p>
                              <StatusPill status={r.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "files" && (
          <div>
            {project.files.length > 0 ? (
              <div className="space-y-2">
                {project.files.map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FileText size={15} className="text-[#6B5B52]" />
                      <div>
                        <p className="text-[13px] font-medium text-[#3D3530]">{file.name}</p>
                        <p className="text-[11px] text-[#8B8179]">{file.type} · {file.date}</p>
                      </div>
                    </div>
                    <button className="text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">Download</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#8B8179]">Belum ada file.</p>
            )}
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
              <Upload size={14} />
              Upload file referensi
              <input type="file" className="sr-only" />
            </label>
          </div>
        )}
      </div>

      {/* Feedback modal */}
      {feedbackTarget && (
        <FeedbackModal
          targetTitle={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
        />
      )}
    </div>
  );
}

function FeedbackModal({ targetTitle, onClose }: { targetTitle: string; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#3D3530]">Kirim Catatan</h3>
            <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full text-[#8B8179] transition hover:bg-[#F0EBE4]">
              <X size={14} />
            </button>
          </div>
          <p className="mt-1.5 text-[12px] text-[#8B8179]">
            Untuk tahap: <span className="font-medium text-[#3D3530]">{targetTitle}</span>
          </p>
          <textarea
            rows={4}
            autoFocus
            placeholder="Tulis catatan, revisi, atau feedback kamu di sini..."
            className="mt-4 w-full resize-none rounded-lg border border-[#E8E2D9] bg-[#F8F6F2] p-3 text-[13px] leading-6 outline-none transition focus:border-[#6B5B52] focus:bg-white placeholder:text-[#B8B2AA]"
          />
          <div className="mt-4 flex items-center justify-end gap-2">
            <button onClick={onClose} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067] transition hover:bg-[#F0EBE4]">
              Batal
            </button>
            <button onClick={onClose} className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
              Kirim
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function NewProjectForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
        <ChevronRight size={14} className="rotate-180" />
        Kembali
      </button>

      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Ajukan Proyek</h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">
          Isi form selengkap mungkin agar tim VMatch bisa menyusun solusi yang tepat.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold ${s <= step ? "bg-[#6B5B52] text-white" : "bg-[#EDE8E1] text-[#8B8179]"}`}>
              {s}
            </div>
            {s < totalSteps && (
              <div className={`h-px w-5 sm:w-8 ${s < step ? "bg-[#6B5B52]" : "bg-[#E8E2D9]"}`} />
            )}
          </div>
        ))}
        <span className="ml-3 text-[12px] text-[#8B8179]">
          {step === 1 && "Info Dasar"}
          {step === 2 && "Detail Ruangan"}
          {step === 3 && "Preferensi & Gaya"}
          {step === 4 && "Timeline & Referensi"}
        </span>
      </div>

      {/* Form steps */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        {step === 1 && (
          <div>
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Informasi dasar proyek</h2>
            <p className="mt-1 text-[12px] text-[#8B8179]">Jenis proyek dan lokasi pengerjaan.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <FormField label="Jenis proyek *">
                <select className="field-control"><option value="">Pilih jenis proyek</option><option>Kitchen Set</option><option>Wardrobe / Lemari</option><option>Ruang Tamu</option><option>Kamar Tidur</option><option>Backdrop TV</option><option>Full Interior</option><option>Lainnya</option></select>
              </FormField>
              <FormField label="Tipe properti *">
                <select className="field-control"><option value="">Pilih tipe properti</option><option>Rumah</option><option>Apartemen</option><option>Kantor</option><option>Kos-kosan</option><option>Hotel</option><option>Lainnya</option></select>
              </FormField>
              <FormField label="Kota / Lokasi *">
                <input className="field-control" placeholder="Contoh: Bandung, Jawa Barat" />
              </FormField>
              <FormField label="Status properti">
                <select className="field-control"><option>Sudah ditempati</option><option>Baru / belum ditempati</option><option>Sedang renovasi</option></select>
              </FormField>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Detail ruangan</h2>
            <p className="mt-1 text-[12px] text-[#8B8179]">Ukuran, kondisi, dan kebutuhan spesifik.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <FormField label="Ukuran ruangan *">
                <input className="field-control" placeholder="Contoh: 3 x 4 meter" />
              </FormField>
              <FormField label="Tinggi plafon">
                <input className="field-control" placeholder="Contoh: 2.8 meter" />
              </FormField>
              <FormField label="Kondisi ruangan">
                <select className="field-control"><option>Kosong</option><option>Ada furniture lama</option><option>Sebagian sudah ada</option></select>
              </FormField>
              <FormField label="Akses lokasi">
                <select className="field-control"><option>Mudah (jalan lebar)</option><option>Sedang (gang kecil)</option><option>Apartemen (lift barang)</option></select>
              </FormField>
            </div>
            <div className="mt-3.5">
              <FormField label="Masalah yang ingin diselesaikan">
                <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Ruangan sempit tapi butuh banyak storage..." />
              </FormField>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Preferensi & gaya desain</h2>
            <p className="mt-1 text-[12px] text-[#8B8179]">Bantu kami memahami selera kamu.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <FormField label="Gaya desain">
                <select className="field-control"><option value="">Pilih gaya</option><option>Modern Minimalis</option><option>Japandi</option><option>Scandinavian</option><option>Industrial</option><option>Classic / Luxury</option><option>Belum tahu</option></select>
              </FormField>
              <FormField label="Material">
                <select className="field-control"><option value="">Pilih material</option><option>HPL</option><option>Veneer kayu asli</option><option>Solid wood</option><option>Kombinasi</option><option>Belum tahu</option></select>
              </FormField>
              <FormField label="Estimasi budget *">
                <select className="field-control"><option value="">Pilih range</option><option>Di bawah Rp30 juta</option><option>Rp30–60 juta</option><option>Rp60–100 juta</option><option>Rp100–150 juta</option><option>Di atas Rp150 juta</option></select>
              </FormField>
              <FormField label="Prioritas utama">
                <select className="field-control"><option value="">Apa yang paling penting?</option><option>Harga terjangkau</option><option>Kualitas premium</option><option>Desain unik</option><option>Kecepatan</option><option>Storage maksimal</option></select>
              </FormField>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Timeline & referensi</h2>
            <p className="mt-1 text-[12px] text-[#8B8179]">Kapan ingin dimulai dan referensi visual.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <FormField label="Target mulai">
                <select className="field-control"><option>Secepatnya</option><option>1–2 minggu lagi</option><option>1 bulan lagi</option><option>Fleksibel</option></select>
              </FormField>
              <FormField label="Deadline">
                <select className="field-control"><option>Fleksibel</option><option>Dalam 1 bulan</option><option>Dalam 2 bulan</option><option>Dalam 3 bulan</option></select>
              </FormField>
            </div>
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-[#6B5B52]">Upload referensi visual</p>
              <label className="mt-2 flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] p-6 text-center transition hover:border-[#6B5B52]">
                <Upload size={20} className="text-[#8B8179]" />
                <span className="mt-2 text-[12px] font-medium text-[#3D3530]">Klik untuk upload</span>
                <span className="mt-0.5 text-[11px] text-[#8B8179]">JPG, PNG, PDF — maks 10MB</span>
                <input type="file" multiple className="sr-only" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step === 1 ? onBack() : setStep(step - 1)}
          className="h-9 rounded-lg border border-[#E8E2D9] px-5 text-[12px] font-medium text-[#3D3530] transition hover:bg-[#F0EBE4]"
        >
          {step === 1 ? "Batal" : "← Sebelumnya"}
        </button>
        {step < totalSteps ? (
          <button onClick={() => setStep(step + 1)} className="h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
            Selanjutnya →
          </button>
        ) : (
          <button className="h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
            Submit Request
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsView() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Pengaturan</h1>

      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Profil</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Informasi dasar akun kamu.</p>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <FormField label="Username"><input className="field-control" defaultValue="customer_vmatch" /></FormField>
          <FormField label="Nama lengkap"><input className="field-control" defaultValue="Customer VMatch" /></FormField>
          <FormField label="Email"><input className="field-control cursor-not-allowed bg-[#F5F0EA] text-[#8B8179]" defaultValue="customer@email.com" disabled /></FormField>
          <FormField label="Nomor HP"><input className="field-control" defaultValue="0812xxxx" /></FormField>
        </div>
        <button className="mt-4 h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          Simpan
        </button>
      </div>

      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi</h2>
        <div className="mt-4 space-y-2">
          <ToggleRow label="Email update proyek" desc="Terima update progress via email" defaultOn />
          <ToggleRow label="Reminder WhatsApp" desc="Reminder meeting via WA" defaultOn />
          <ToggleRow label="Newsletter" desc="Tips interior & promo" defaultOn={false} />
        </div>
      </div>

      <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
        <h2 className="text-[15px] font-semibold text-red-800">Zona Berbahaya</h2>
        <p className="mt-1 text-[12px] text-red-600/70">Aksi ini tidak bisa dibatalkan.</p>
        <button className="mt-3 h-8 rounded-lg border border-red-200 px-4 text-[12px] font-medium text-red-700 transition hover:bg-red-100">
          Hapus Akun
        </button>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function QuickCard({ icon: Icon, label, value, onClick, accent }: { icon: LucideIcon; label: string; value: string; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${accent ? "border-[#6B5B52]/20 bg-[#6B5B52] text-white hover:bg-[#5A4A42]" : "border-[#E8E2D9] bg-white hover:border-[#D4C9BD]"}`}
    >
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-white/15" : "bg-[#F5F0EA] text-[#6B5B52]"}`}>
        <Icon size={16} />
      </div>
      <p className={`mt-3 text-[18px] font-semibold leading-none ${accent ? "" : "text-[#3D3530]"}`}>{value}</p>
      <p className={`mt-1 text-[12px] ${accent ? "text-white/70" : "text-[#8B8179]"}`}>{label}</p>
    </button>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
          <Icon size={16} />
        </div>
        <p className="text-[12px] font-medium text-[#8B8179]">{label}</p>
      </div>
      <p className="mt-2.5 text-[28px] font-semibold leading-none text-[#3D3530]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status.includes("Selesai") || status.includes("Done") || status.includes("Terkonfirmasi")
      ? "bg-emerald-50 text-emerald-700"
      : status.includes("Menunggu") || status.includes("Request") || status.includes("Masuk")
        ? "bg-amber-50 text-amber-700"
        : "bg-[#F5F0EA] text-[#6B5B52]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>
      {status}
    </span>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-medium text-[#6B5B52]">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({ label, desc, defaultOn = true }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-[#F8F6F2] p-3.5">
      <div>
        <p className="text-[13px] font-medium text-[#3D3530]">{label}</p>
        <p className="text-[11px] text-[#8B8179]">{desc}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultOn} className="h-4 w-4 accent-[#6B5B52]" />
    </label>
  );
}
