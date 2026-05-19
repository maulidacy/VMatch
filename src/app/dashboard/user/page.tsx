"use client";

import {
  Bell,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Paperclip,
  Plus,
  Send,
  Settings,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
  { id: "ai", label: "AI Chat", icon: BrainCircuit },
  { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings },
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
    <main className="min-h-[100dvh] bg-[#FCFBF9] text-[#31332c]">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[260px] flex-col bg-[#31332c] text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[72px] items-center justify-between px-6">
          <Link href="/" className="font-serif text-[24px] italic text-white">VMatch</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white lg:hidden" aria-label="Tutup">
            <X size={15} />
          </button>
        </div>

        <nav className="sidebar-nav flex-1 space-y-1 overflow-y-auto px-3 pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changePage(item.id)}
                className={`flex h-11 w-full items-center gap-3 rounded-lg px-4 text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#6b5b52] text-white" : "text-white/60 hover:bg-white/8 hover:text-white/90"}`}
              >
                <Icon size={17} strokeWidth={active ? 2 : 1.7} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3">
          <Link href="/login" className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white/8 text-[12.5px] font-medium text-white/60 transition-colors hover:bg-white/12 hover:text-white">
            <LogOut size={15} />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Content */}
      <section className="flex min-h-[100dvh] flex-col lg:pl-[260px]">
        {/* Header — always visible */}
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-3 border-b border-[#e6e1da]/60 bg-[#FCFBF9]/90 px-5 backdrop-blur-xl sm:px-7">
          <button onClick={() => setIsSidebarOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#e6e1da] text-[#6b5b52] transition hover:bg-[#f7f4ef] lg:hidden" aria-label="Menu">
            <Menu size={17} />
          </button>
          <p className="flex-1 text-[12px] font-medium uppercase tracking-[0.12em] text-[#8b8179]">{activeMenu.label}</p>
          <button className="grid h-9 w-9 place-items-center rounded-full text-[#6b5b52] transition hover:bg-[#f7f4ef]" aria-label="Notifikasi">
            <Bell size={18} />
          </button>
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#6b5b52] text-white">
              <UserRound size={14} />
            </div>
            <span className="text-[13px] font-medium text-[#31332c]">Customer</span>
          </div>
        </header>

        {/* Page content — AI chat uses flex-1, others scroll normally */}
        {activePage === "ai" ? (
          <AiChatView />
        ) : (
          <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-7">
            {activePage === "dashboard" && <DashboardView onChangePage={changePage} />}
            {activePage === "katalog" && <CatalogDesign onChangePage={changePage as (page: string) => void} />}
            {activePage === "proyek" && <ProyekView />}
            {activePage === "settings" && <SettingsView />}
          </div>
        )}
      </section>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20VMatch%2C%20saya%20ingin%20follow%20up%20proyek%20saya."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)]"
        aria-label="Chat via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function DashboardView({ onChangePage }: { onChangePage: (p: PageId) => void }) {
  const activeProjects = projects.filter((p) => p.status !== "done");
  const recentActivity = projects
    .flatMap((p) => p.timeline.filter((t) => t.done).map((t) => ({ ...t, project: p.name })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Customer Dashboard</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Selamat datang</h1>
        <p className="mt-3 max-w-[600px] text-[15px] leading-7 text-[#797c73]">
          Pantau proyek interior kamu, lihat progress, dan kelola semua kebutuhan dari satu tempat.
        </p>
      </section>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FolderOpen} label="Proyek Aktif" value={String(activeProjects.length)} />
        <StatCard icon={Clock} label="Menunggu Solusi" value={String(projects.filter((p) => p.status === "request").length)} />
        <StatCard icon={CalendarDays} label="Meeting Terjadwal" value={String(projects.filter((p) => p.nextMeeting).length)} />
      </section>

      {/* Active projects */}
      {activeProjects.length === 0 ? (
        <section className="border border-dashed border-[#ded6ca] bg-white p-12 text-center">
          <FolderOpen className="mx-auto text-[#ded6ca]" size={40} />
          <p className="mt-4 font-serif text-[22px] italic text-[#31332c]">Belum ada proyek aktif</p>
          <p className="mt-2 text-[14px] text-[#797c73]">Ajukan proyek baru untuk memulai.</p>
          <button onClick={() => onChangePage("proyek")} className="mt-6 inline-flex h-11 items-center gap-2 bg-[#6b5b52] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]">
            <Plus size={15} />
            Ajukan Proyek
          </button>
        </section>
      ) : (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[24px] italic text-[#31332c]">Proyek aktif</h2>
            <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6b5b52] transition hover:text-[#5a4a42]">
              Lihat semua →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activeProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => onChangePage("proyek")}
                className="group cursor-pointer border border-[#e6e1da] bg-white p-5 transition-all duration-300 hover:border-[#6b5b52]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[20px] italic leading-tight">{project.name}</h3>
                    <p className="mt-1 text-[13px] text-[#8b8179]">{project.type} · {project.location}</p>
                  </div>
                  <StatusPill status={project.statusLabel} />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#8b8179]">Progress</span>
                    <span className="font-semibold text-[#31332c]">{project.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden bg-[#eee8df]">
                    <div className="h-full bg-[#6b5b52] transition-all duration-700" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                {project.nextMeeting && (
                  <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#8b8179]">
                    <CalendarDays size={13} />
                    Meeting: {project.nextMeeting}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <section>
          <h2 className="font-serif text-[24px] italic text-[#31332c]">Aktivitas terbaru</h2>
          <div className="mt-4 space-y-2">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[#eee8df] pb-3 last:border-b-0">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6b5b52]" />
                <div>
                  <p className="text-[13px] font-medium text-[#31332c]">{activity.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#8b8179]">{activity.project} · {activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── AI Chat (full height, only chat scrolls) ────────────────────────────────

function AiChatView() {
  const [messages] = useState<{ from: "ai" | "user"; text: string }[]>([
    { from: "ai", text: "Halo! Saya AI VMatch. Ceritakan kebutuhan interior kamu — saya bantu brainstorming konsep, material, estimasi budget, atau apapun sebelum kamu ajukan proyek." },
  ]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat messages — this is the only scrollable area */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-7">
        <div className="mx-auto max-w-[800px] space-y-4 py-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              {msg.from === "ai" && (
                <div className="mr-3 mt-1 grid h-7 w-7 shrink-0 place-items-center bg-[#6b5b52] text-white">
                  <BrainCircuit size={14} />
                </div>
              )}
              <div className={`max-w-[75%] px-5 py-4 text-[14px] leading-7 ${msg.from === "user" ? "bg-[#31332c] text-white" : "border border-[#e6e1da] bg-white text-[#31332c]"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input — fixed at bottom */}
      <div className="shrink-0 border-t border-[#e6e1da] bg-white px-5 py-4 sm:px-7">
        <div className="mx-auto flex max-w-[800px] items-end gap-2">
          <button className="grid h-10 w-10 shrink-0 place-items-center text-[#8b8179] transition hover:text-[#6b5b52]" aria-label="Lampirkan file">
            <Paperclip size={18} />
          </button>
          <textarea
            rows={1}
            placeholder="Tulis kebutuhan interior kamu..."
            className="max-h-32 min-h-[40px] flex-1 resize-none border border-[#e6e1da] bg-[#FCFBF9] px-4 py-2.5 text-[14px] leading-6 outline-none transition focus:border-[#6b5b52] placeholder:text-[#b8b2aa]"
          />
          <button className="grid h-10 w-10 shrink-0 place-items-center bg-[#6b5b52] text-white transition hover:bg-[#5a4a42]">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Proyek (with filter tabs) ───────────────────────────────────────────────

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
    <div className="space-y-6">
      {/* Header */}
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Proyek</p>
          <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Proyek Saya</h1>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex h-11 items-center gap-2 bg-[#6b5b52] px-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Ajukan Proyek</span>
        </button>
      </section>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-[#e6e1da]">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`relative px-4 py-3 text-[13px] font-medium transition-colors ${activeFilter === tab.id ? "text-[#6b5b52]" : "text-[#8b8179] hover:text-[#31332c]"}`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[11px] ${activeFilter === tab.id ? "text-[#6b5b52]" : "text-[#b8b2aa]"}`}>
              {tab.count}
            </span>
            {activeFilter === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6b5b52]" />
            )}
          </button>
        ))}
      </div>

      {/* Project list */}
      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[14px] text-[#8b8179]">Tidak ada proyek di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer border border-[#e6e1da] bg-white p-5 transition-all duration-300 hover:border-[#6b5b52]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-[18px] italic leading-tight">{project.name}</h3>
                    <StatusPill status={project.statusLabel} />
                  </div>
                  <p className="mt-1 text-[13px] text-[#8b8179]">{project.type} · {project.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Mini progress */}
                  <div className="hidden w-[100px] sm:block">
                    <div className="h-1.5 overflow-hidden bg-[#eee8df]">
                      <div className="h-full bg-[#6b5b52]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[11px] text-[#8b8179]">{project.progress}%</p>
                  </div>
                  <ChevronRight size={16} className="text-[#ded6ca] transition-transform group-hover:translate-x-0.5 group-hover:text-[#6b5b52]" />
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
  const [activeTab, setActiveTab] = useState<"timeline" | "revisi" | "files">("timeline");

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[#6b5b52] transition hover:text-[#5a4a42]">
          <ChevronRight size={14} className="rotate-180" />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-[32px] leading-tight sm:text-[42px]">{project.name}</h1>
            <p className="mt-2 text-[14px] text-[#8b8179]">{project.type} · {project.location}</p>
          </div>
          <StatusPill status={project.statusLabel} />
        </div>
      </section>

      {/* Progress */}
      <section className="border border-[#e6e1da] bg-white p-5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-[#8b8179]">Progress keseluruhan</span>
          <span className="font-semibold text-[#31332c]">{project.progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden bg-[#eee8df]">
          <div className="h-full bg-[#6b5b52] transition-all duration-700" style={{ width: `${project.progress}%` }} />
        </div>
      </section>

      {/* Meeting */}
      {project.nextMeeting && (
        <section className="flex items-center justify-between border border-[#e6e1da] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center bg-[#f7f4ef] text-[#6b5b52]">
              <CalendarDays size={17} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#31332c]">Meeting terjadwal</p>
              <p className="mt-0.5 text-[12px] text-[#8b8179]">{project.nextMeeting}</p>
            </div>
          </div>
          <button className="h-9 border border-[#6b5b52]/30 px-4 text-[12px] font-semibold text-[#6b5b52] transition hover:bg-[#f7f4ef]">
            Ubah Jadwal
          </button>
        </section>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e6e1da]">
        {([
          { id: "timeline" as const, label: "Timeline", count: project.timeline.length },
          { id: "revisi" as const, label: "Revisi", count: project.revisions.length },
          { id: "files" as const, label: "File", count: project.files.length },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-[13px] font-medium transition-colors ${activeTab === tab.id ? "text-[#6b5b52]" : "text-[#8b8179] hover:text-[#31332c]"}`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[11px] ${activeTab === tab.id ? "text-[#6b5b52]" : "text-[#b8b2aa]"}`}>{tab.count}</span>
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6b5b52]" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "timeline" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <div className="space-y-0">
            {project.timeline.map((entry, i) => (
              <div key={entry.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`mt-1.5 h-3.5 w-3.5 rounded-full border-[2.5px] ${entry.done ? "border-[#6b5b52] bg-[#6b5b52]" : "border-[#ded6ca] bg-white"}`} />
                  {i < project.timeline.length - 1 && <div className="w-px flex-1 bg-[#e6e1da]" />}
                </div>
                <div className="pb-6">
                  <p className="text-[14px] font-semibold leading-tight text-[#31332c]">{entry.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#8b8179]">{entry.date}</p>
                  <p className="mt-1.5 text-[13px] leading-6 text-[#797c73]">{entry.description}</p>
                  {entry.image && (
                    <div className="mt-3 h-[160px] w-[220px] overflow-hidden bg-[#f7f4ef]">
                      <img src={entry.image} alt={entry.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "revisi" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <div className="flex gap-2">
            <textarea rows={2} placeholder="Tulis revisi atau catatan..." className="flex-1 resize-none border border-[#e6e1da] bg-[#FCFBF9] p-3 text-[13px] outline-none transition focus:border-[#6b5b52]" />
            <button className="self-end grid h-10 w-10 shrink-0 place-items-center bg-[#6b5b52] text-white transition hover:bg-[#5a4a42]">
              <Send size={15} />
            </button>
          </div>
          {project.revisions.length > 0 ? (
            <div className="mt-4 space-y-2">
              {project.revisions.map((r, i) => (
                <div key={i} className="border border-[#e6e1da] bg-[#f7f4ef] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-medium text-[#31332c]">{r.text}</p>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-1 text-[12px] text-[#8b8179]">{r.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-[#8b8179]">Belum ada revisi untuk proyek ini.</p>
          )}
        </section>
      )}

      {activeTab === "files" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          {project.files.length > 0 ? (
            <div className="space-y-2">
              {project.files.map((file) => (
                <div key={file.name} className="flex items-center justify-between border border-[#e6e1da] bg-[#f7f4ef] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-[#6b5b52]" />
                    <div>
                      <p className="text-[13px] font-medium text-[#31332c]">{file.name}</p>
                      <p className="mt-0.5 text-[11px] text-[#8b8179]">{file.type} · {file.date}</p>
                    </div>
                  </div>
                  <button className="text-[12px] font-semibold text-[#6b5b52] transition hover:text-[#5a4a42]">Download</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#8b8179]">Belum ada file untuk proyek ini.</p>
          )}
          <label className="mt-4 flex cursor-pointer items-center gap-2 border border-dashed border-[#ded6ca] bg-[#FCFBF9] px-4 py-3 text-[12px] font-medium text-[#8b8179] transition hover:border-[#6b5b52] hover:text-[#6b5b52]">
            <Upload size={15} />
            Upload file referensi
            <input type="file" className="sr-only" />
          </label>
        </section>
      )}
    </div>
  );
}

function NewProjectForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="space-y-6">
      <section>
        <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[#6b5b52] transition hover:text-[#5a4a42]">
          <ChevronRight size={14} className="rotate-180" />
          Kembali
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Request Baru</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Ajukan Proyek</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#797c73]">
          Isi form selengkap mungkin agar tim VMatch bisa menyusun solusi yang tepat untuk kebutuhan kamu.
        </p>
      </section>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`grid h-7 w-7 place-items-center text-[11px] font-semibold ${s <= step ? "bg-[#6b5b52] text-white" : "border border-[#e6e1da] bg-white text-[#8b8179]"}`}>
              {s}
            </div>
            {s < totalSteps && (
              <div className={`h-px w-6 sm:w-10 ${s < step ? "bg-[#6b5b52]" : "bg-[#e6e1da]"}`} />
            )}
          </div>
        ))}
        <span className="ml-3 text-[12px] text-[#8b8179]">
          {step === 1 && "Info Dasar"}
          {step === 2 && "Detail Ruangan"}
          {step === 3 && "Preferensi & Gaya"}
          {step === 4 && "Timeline & Referensi"}
        </span>
      </div>

      {/* Step 1: Info Dasar */}
      {step === 1 && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <h2 className="font-serif text-[22px] italic">Informasi dasar proyek</h2>
          <p className="mt-1 text-[13px] text-[#8b8179]">Jenis proyek dan lokasi pengerjaan.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField label="Jenis proyek *">
              <select className="field-control">
                <option value="">Pilih jenis proyek</option>
                <option>Kitchen Set</option>
                <option>Wardrobe / Lemari</option>
                <option>Ruang Tamu / Living Room</option>
                <option>Ruang Kerja / Home Office</option>
                <option>Kamar Tidur</option>
                <option>Kamar Mandi / Vanity</option>
                <option>Storage / Rak</option>
                <option>Backdrop TV</option>
                <option>Full Interior (1 ruangan)</option>
                <option>Full Interior (1 unit/rumah)</option>
                <option>Lainnya</option>
              </select>
            </FormField>
            <FormField label="Tipe properti *">
              <select className="field-control">
                <option value="">Pilih tipe properti</option>
                <option>Rumah</option>
                <option>Apartemen</option>
                <option>Kantor</option>
                <option>Kos-kosan / Boarding House</option>
                <option>Hotel</option>
                <option>Ruko / Komersial</option>
                <option>Lainnya</option>
              </select>
            </FormField>
            <FormField label="Kota / Lokasi proyek *">
              <input className="field-control" placeholder="Contoh: Bandung, Jawa Barat" />
            </FormField>
            <FormField label="Alamat lengkap (opsional)">
              <input className="field-control" placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan" />
            </FormField>
            <FormField label="Status properti">
              <select className="field-control">
                <option>Sudah ditempati</option>
                <option>Baru / belum ditempati</option>
                <option>Sedang renovasi</option>
                <option>Masih dalam pembangunan</option>
              </select>
            </FormField>
            <FormField label="Lantai (jika apartemen/gedung)">
              <input className="field-control" placeholder="Contoh: Lantai 12" />
            </FormField>
          </div>
        </section>
      )}

      {/* Step 2: Detail Ruangan */}
      {step === 2 && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <h2 className="font-serif text-[22px] italic">Detail ruangan</h2>
          <p className="mt-1 text-[13px] text-[#8b8179]">Ukuran, kondisi, dan kebutuhan spesifik ruangan.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField label="Ukuran ruangan *">
              <input className="field-control" placeholder="Contoh: 3 x 4 meter / 12 m²" />
            </FormField>
            <FormField label="Tinggi plafon">
              <input className="field-control" placeholder="Contoh: 2.8 meter" />
            </FormField>
            <FormField label="Kondisi ruangan saat ini">
              <select className="field-control">
                <option>Kosong (belum ada furniture)</option>
                <option>Ada furniture lama (mau diganti)</option>
                <option>Sebagian sudah ada (mau tambah)</option>
                <option>Perlu bongkar dulu</option>
              </select>
            </FormField>
            <FormField label="Akses lokasi">
              <select className="field-control">
                <option>Mudah (jalan lebar, bisa truk)</option>
                <option>Sedang (gang kecil, bisa mobil)</option>
                <option>Sulit (perlu angkut manual)</option>
                <option>Apartemen (perlu lift barang)</option>
              </select>
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="Masalah ruangan yang ingin diselesaikan">
              <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Ruangan sempit tapi butuh banyak storage, pencahayaan kurang, layout tidak efisien, dll." />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="Kebutuhan khusus / fitur yang diinginkan">
              <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Soft-close semua laci, hidden handle, built-in lighting, charging station, pull-out table, dll." />
            </FormField>
          </div>
        </section>
      )}

      {/* Step 3: Preferensi & Gaya */}
      {step === 3 && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <h2 className="font-serif text-[22px] italic">Preferensi & gaya desain</h2>
          <p className="mt-1 text-[13px] text-[#8b8179]">Bantu kami memahami selera dan preferensi kamu.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField label="Gaya desain yang disukai">
              <select className="field-control">
                <option value="">Pilih gaya</option>
                <option>Modern Minimalis</option>
                <option>Japandi</option>
                <option>Scandinavian</option>
                <option>Industrial</option>
                <option>Classic / Luxury</option>
                <option>Mid-Century Modern</option>
                <option>Rustic / Natural</option>
                <option>Belum tahu / minta saran</option>
              </select>
            </FormField>
            <FormField label="Warna yang disukai">
              <input className="field-control" placeholder="Contoh: Putih, kayu natural, hitam aksen" />
            </FormField>
            <FormField label="Material yang disukai">
              <select className="field-control">
                <option value="">Pilih material</option>
                <option>HPL (budget-friendly)</option>
                <option>Veneer kayu asli</option>
                <option>Solid wood</option>
                <option>Kombinasi HPL + Veneer</option>
                <option>Belum tahu / minta saran</option>
              </select>
            </FormField>
            <FormField label="Finishing yang disukai">
              <select className="field-control">
                <option value="">Pilih finishing</option>
                <option>Matte / Doff</option>
                <option>Glossy</option>
                <option>Semi-gloss / Satin</option>
                <option>Tekstur kayu natural</option>
                <option>Belum tahu / minta saran</option>
              </select>
            </FormField>
            <FormField label="Estimasi budget *">
              <select className="field-control">
                <option value="">Pilih range budget</option>
                <option>Di bawah Rp30 juta</option>
                <option>Rp30–60 juta</option>
                <option>Rp60–100 juta</option>
                <option>Rp100–150 juta</option>
                <option>Rp150–250 juta</option>
                <option>Di atas Rp250 juta</option>
                <option>Fleksibel / minta estimasi</option>
              </select>
            </FormField>
            <FormField label="Prioritas utama">
              <select className="field-control">
                <option value="">Apa yang paling penting?</option>
                <option>Harga terjangkau</option>
                <option>Kualitas material premium</option>
                <option>Desain unik / custom</option>
                <option>Kecepatan pengerjaan</option>
                <option>Fungsionalitas / storage maksimal</option>
              </select>
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="Catatan tambahan tentang gaya / preferensi">
              <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Saya suka interior hotel-hotel Bali, ingin nuansa hangat tapi tetap clean. Tidak suka warna terlalu gelap." />
            </FormField>
          </div>
        </section>
      )}

      {/* Step 4: Timeline & Referensi */}
      {step === 4 && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <h2 className="font-serif text-[22px] italic">Timeline & referensi</h2>
          <p className="mt-1 text-[13px] text-[#8b8179]">Kapan ingin dimulai dan referensi visual.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField label="Target mulai pengerjaan">
              <select className="field-control">
                <option>Secepatnya</option>
                <option>1–2 minggu lagi</option>
                <option>1 bulan lagi</option>
                <option>2–3 bulan lagi</option>
                <option>Belum pasti / fleksibel</option>
              </select>
            </FormField>
            <FormField label="Deadline / target selesai">
              <select className="field-control">
                <option>Fleksibel</option>
                <option>Dalam 1 bulan</option>
                <option>Dalam 2 bulan</option>
                <option>Dalam 3 bulan</option>
                <option>Ada tanggal spesifik</option>
              </select>
            </FormField>
            <FormField label="Urgensi proyek">
              <select className="field-control">
                <option>Tidak urgent (bisa tunggu)</option>
                <option>Cukup urgent</option>
                <option>Sangat urgent (butuh cepat)</option>
              </select>
            </FormField>
            <FormField label="Catatan deadline (opsional)">
              <input className="field-control" placeholder="Contoh: Harus selesai sebelum Lebaran" />
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="Apakah ingin konsultasi dulu sebelum mulai?">
              <select className="field-control">
                <option>Ya, saya ingin meeting/konsultasi dulu</option>
                <option>Tidak perlu, langsung proses saja</option>
                <option>Tergantung solusi yang ditawarkan</option>
              </select>
            </FormField>
          </div>

          <div className="mt-5">
            <p className="text-[12px] font-semibold text-[#6b5b52]">Upload referensi visual</p>
            <p className="mt-1 text-[12px] text-[#8b8179]">Foto inspirasi, screenshot Pinterest, denah ruangan, atau foto kondisi ruangan saat ini.</p>
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#ded6ca] bg-[#FCFBF9] p-8 text-center transition hover:border-[#6b5b52]">
              <Upload size={24} className="text-[#8b8179]" />
              <span className="mt-3 text-[13px] font-medium text-[#31332c]">Klik untuk upload file</span>
              <span className="mt-1 text-[12px] text-[#8b8179]">JPG, PNG, PDF — maks 10MB per file (bisa multiple)</span>
              <input type="file" multiple className="sr-only" />
            </label>
          </div>

          <div className="mt-5">
            <FormField label="Link referensi (Pinterest, Instagram, dll)">
              <input className="field-control" placeholder="Contoh: https://pin.it/xxxxx atau https://instagram.com/p/xxxxx" />
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="Ada hal lain yang ingin disampaikan?">
              <textarea rows={3} className="field-control resize-none" placeholder="Tulis apapun yang belum tercakup di form ini — pertanyaan, kekhawatiran, atau detail tambahan." />
            </FormField>
          </div>
        </section>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step === 1 ? onBack() : setStep(step - 1)}
          className="h-11 border border-[#e6e1da] px-6 text-[12px] font-semibold text-[#31332c] transition hover:bg-[#f7f4ef]"
        >
          {step === 1 ? "Batal" : "← Sebelumnya"}
        </button>

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            className="h-11 bg-[#6b5b52] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]"
          >
            Selanjutnya →
          </button>
        ) : (
          <button className="h-11 bg-[#6b5b52] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]">
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
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Pengaturan</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Settings</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#797c73]">Kelola informasi akun dan preferensi kamu.</p>
      </section>

      <section className="border border-[#e6e1da] bg-white p-6">
        <h2 className="font-serif text-[24px] italic">Profil</h2>
        <p className="mt-1 text-[13px] text-[#8b8179]">Informasi dasar akun kamu.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Username">
            <input className="field-control" defaultValue="customer_vmatch" />
          </FormField>
          <FormField label="Nama lengkap">
            <input className="field-control" defaultValue="Customer VMatch" />
          </FormField>
          <FormField label="Email (tidak bisa diubah)">
            <input className="field-control cursor-not-allowed bg-[#f7f4ef] text-[#8b8179]" defaultValue="customer@email.com" disabled />
          </FormField>
          <FormField label="Nomor HP">
            <input className="field-control" defaultValue="0812xxxx" />
          </FormField>
          <FormField label="Lokasi / Kota">
            <input className="field-control" defaultValue="Semarang" />
          </FormField>
          <FormField label="Tipe properti">
            <select className="field-control">
              <option>Rumah</option>
              <option>Apartemen</option>
              <option>Kantor</option>
              <option>Kos-kosan</option>
              <option>Lainnya</option>
            </select>
          </FormField>
        </div>
        <FormField label="Bio / Deskripsi">
          <textarea className="field-control mt-4 min-h-[80px] resize-none" placeholder="Ceritakan sedikit tentang kebutuhan interior kamu secara umum..." />
        </FormField>
        <button className="mt-5 h-11 bg-[#6b5b52] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]">
          Simpan Perubahan
        </button>
      </section>

      <section className="border border-[#e6e1da] bg-white p-6">
        <h2 className="font-serif text-[24px] italic">Preferensi</h2>
        <p className="mt-1 text-[13px] text-[#8b8179]">Atur notifikasi dan preferensi komunikasi.</p>
        <div className="mt-5 space-y-3">
          <ToggleRow label="Notifikasi email" desc="Terima update proyek via email" defaultOn />
          <ToggleRow label="Notifikasi WhatsApp" desc="Terima reminder meeting via WA" defaultOn />
          <ToggleRow label="Newsletter" desc="Tips interior & promo dari VMatch" defaultOn={false} />
        </div>
      </section>

      {/* Contact admin */}
      <section className="border border-[#e6e1da] bg-white p-6">
        <h2 className="font-serif text-[24px] italic">Kontak Admin VMatch</h2>
        <p className="mt-1 text-[13px] text-[#8b8179]">Hubungi admin langsung via WhatsApp untuk follow up proyek.</p>
        <div className="mt-4 flex items-center gap-4 border border-[#e6e1da] bg-[#f7f4ef] p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#31332c]">+62 812-3456-7890</p>
            <p className="mt-0.5 text-[12px] text-[#8b8179]">Admin VMatch — Senin–Sabtu, 09:00–18:00 WIB</p>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20VMatch%2C%20saya%20ingin%20follow%20up%20proyek%20saya."
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 bg-[#25D366] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1da851] flex items-center gap-1.5"
          >
            Chat Sekarang
          </a>
        </div>
      </section>

      <section className="border border-red-200 bg-red-50/50 p-6">
        <h2 className="font-serif text-[24px] italic text-red-900">Zona Berbahaya</h2>
        <p className="mt-1 text-[13px] text-red-700/70">Aksi ini tidak bisa dibatalkan.</p>
        <button className="mt-4 h-10 border border-red-300 px-5 text-[12px] font-semibold text-red-700 transition hover:bg-red-100">
          Hapus Akun
        </button>
      </section>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border border-[#e6e1da] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center bg-[#f7f4ef] text-[#6b5b52]">
          <Icon size={17} />
        </div>
        <p className="text-[12px] font-medium text-[#8b8179]">{label}</p>
      </div>
      <p className="mt-3 font-serif text-[36px] leading-none text-[#31332c]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status.includes("Selesai") || status.includes("Done") || status.includes("Terkonfirmasi")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status.includes("Menunggu") || status.includes("Request") || status.includes("Masuk")
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-[#e6e1da] bg-[#f7f4ef] text-[#6b5b52]";

  return (
    <span className={`inline-flex border px-3 py-1 text-[11px] font-semibold ${color}`}>
      {status}
    </span>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-[#6b5b52]">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({ label, desc, defaultOn = true }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between border border-[#e6e1da] bg-[#FCFBF9] p-4">
      <div>
        <p className="text-[13px] font-medium text-[#31332c]">{label}</p>
        <p className="mt-0.5 text-[12px] text-[#8b8179]">{desc}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultOn} className="h-4 w-4 accent-[#6b5b52]" />
    </label>
  );
}
