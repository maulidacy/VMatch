"use client";

import {
  Bell,
  CalendarDays,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Send,
  Settings,
  Upload,
  UserRound,
  Users2,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageId = "dashboard" | "proyek" | "customer" | "vendor" | "settings";

type MenuItem = { id: PageId; label: string; icon: LucideIcon };

type TimelineEntry = {
  title: string;
  date: string;
  description: string;
  image?: string;
  done: boolean;
};

type AdminProject = {
  id: string;
  name: string;
  customer: string;
  type: string;
  location: string;
  budget: string;
  status: string;
  progress: number;
  timeline: TimelineEntry[];
  meetingRequests: { date: string; time: string; status: string }[];
  revisions: { date: string; text: string; status: string }[];
  files: { name: string; type: string; date: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyek", label: "Proyek", icon: FolderOpen },
  { id: "customer", label: "Customer", icon: Users2 },
  { id: "vendor", label: "Vendor", icon: Wrench },
  { id: "settings", label: "Settings", icon: Settings },
];

const adminProjects: AdminProject[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    customer: "Mira H.",
    type: "Kitchen Set",
    location: "Bandung",
    budget: "Rp95 jt",
    status: "Produksi",
    progress: 68,
    timeline: [
      { title: "Request diterima", date: "15 Mei 2026", description: "Brief customer sudah masuk.", done: true },
      { title: "Analisis & solusi", date: "16 Mei 2026", description: "RAB dan konsep sudah dikirim.", done: true },
      { title: "Koordinasi vendor", date: "18 Mei 2026", description: "Aruna Woodwork ditugaskan.", image: "/figma/hero-kitchen.webp", done: true },
      { title: "Produksi", date: "24 Mei 2026", description: "Modul utama sedang diproduksi.", image: "/figma/benefits-kitchen.webp", done: false },
      { title: "Finishing", date: "Estimasi Juli 2026", description: "Instalasi di lokasi.", done: false },
    ],
    meetingRequests: [
      { date: "22 Mei 2026", time: "13:00 WIB", status: "Terkonfirmasi" },
    ],
    revisions: [
      { date: "15 Mei 2026", text: "Handle kabinet dibuat hidden.", status: "Diproses" },
    ],
    files: [
      { name: "RAB Kitchen Set Walnut.pdf", type: "RAB", date: "15 Mei 2026" },
      { name: "Foto Progress Minggu 1.jpg", type: "Progress", date: "18 Mei 2026" },
    ],
  },
  {
    id: "2",
    name: "Wardrobe Minimalis",
    customer: "Kevin A.",
    type: "Wardrobe",
    location: "Tangerang",
    budget: "Rp180–230 jt",
    status: "Request Masuk",
    progress: 5,
    timeline: [
      { title: "Request diterima", date: "14 Mei 2026", description: "Menunggu analisis.", done: true },
    ],
    meetingRequests: [],
    revisions: [],
    files: [
      { name: "Referensi Wardrobe.png", type: "Referensi", date: "14 Mei 2026" },
    ],
  },
  {
    id: "3",
    name: "Japandi Living Room",
    customer: "Nadya P.",
    type: "Living Room",
    location: "Jakarta Selatan",
    budget: "Rp125 jt",
    status: "Perencanaan",
    progress: 24,
    timeline: [
      { title: "Request diterima", date: "13 Mei 2026", description: "Brief sudah masuk.", done: true },
      { title: "Analisis kebutuhan", date: "15 Mei 2026", description: "Sedang menyusun solusi.", done: false },
    ],
    meetingRequests: [
      { date: "20 Mei 2026", time: "14:30 WIB", status: "Menunggu Konfirmasi" },
    ],
    revisions: [
      { date: "15 Mei 2026", text: "Warna storage dibuat lebih terang.", status: "Masuk" },
    ],
    files: [],
  },
];

const customers = [
  { name: "Nadya P.", email: "nadya@email.com", phone: "0812xxxx", location: "Jakarta Selatan", projects: 2, status: "Aktif" },
  { name: "Kevin A.", email: "kevin@email.com", phone: "0857xxxx", location: "Tangerang", projects: 1, status: "Aktif" },
  { name: "Mira H.", email: "mira@email.com", phone: "0821xxxx", location: "Bandung", projects: 3, status: "Prioritas" },
  { name: "PT Ruang Karya", email: "info@ruangkarya.id", phone: "021-xxxx", location: "Jakarta Pusat", projects: 1, status: "Aktif" },
];

const vendors = [
  { name: "Aruna Woodwork", skill: "Kitchen Set, Wardrobe", location: "Semarang", activeProjects: 2, rating: "4.8", status: "Aktif" },
  { name: "Karya Panel Studio", skill: "Wardrobe, Storage", location: "Bandung", activeProjects: 1, rating: "4.7", status: "Aktif" },
  { name: "Linea Interior", skill: "Backdrop TV, Living Room", location: "Jakarta", activeProjects: 3, rating: "4.9", status: "Aktif" },
];

// ─── Main ────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
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
          <Link href="/" className="font-serif text-[24px] italic text-white">
            VMatch
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white lg:hidden"
            aria-label="Tutup"
          >
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
          <Link
            href="/login"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white/8 text-[12.5px] font-medium text-white/60 transition-colors hover:bg-white/12 hover:text-white"
          >
            <LogOut size={15} />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Content */}
      <section className="min-h-[100dvh] lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-[#e6e1da]/60 bg-[#FCFBF9]/90 px-5 backdrop-blur-xl sm:px-7">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#e6e1da] text-[#6b5b52] transition hover:bg-[#f7f4ef] lg:hidden"
            aria-label="Menu"
          >
            <Menu size={17} />
          </button>
          <p className="flex-1 text-[12px] font-medium uppercase tracking-[0.12em] text-[#8b8179]">
            {activeMenu.label}
          </p>
          <button className="grid h-9 w-9 place-items-center rounded-full text-[#6b5b52] transition hover:bg-[#f7f4ef]" aria-label="Notifikasi">
            <Bell size={18} />
          </button>
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#6b5b52] text-white">
              <UserRound size={14} />
            </div>
            <span className="text-[13px] font-medium text-[#31332c]">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-7">
          {activePage === "dashboard" && <AdminDashboardView onChangePage={changePage} />}
          {activePage === "proyek" && <AdminProyekView />}
          {activePage === "customer" && <AdminCustomerView />}
          {activePage === "vendor" && <AdminVendorView />}
          {activePage === "settings" && <AdminSettingsView />}
        </div>
      </section>
    </main>
  );
}

// ─── Admin Dashboard Overview ────────────────────────────────────────────────

function AdminDashboardView({ onChangePage }: { onChangePage: (p: PageId) => void }) {
  const activeCount = adminProjects.filter((p) => !p.status.includes("Selesai")).length;
  const requestCount = adminProjects.filter((p) => p.status === "Request Masuk").length;
  const meetingCount = adminProjects.reduce((acc, p) => acc + p.meetingRequests.length, 0);
  const revisionCount = adminProjects.reduce((acc, p) => acc + p.revisions.filter((r) => r.status === "Masuk").length, 0);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Admin Panel</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Dashboard</h1>
        <p className="mt-3 max-w-[600px] text-[15px] leading-7 text-[#797c73]">
          Overview semua aktivitas — proyek, request, meeting, dan revisi customer.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Proyek Aktif" value={String(activeCount)} note={`${adminProjects.filter((p) => p.status === "Produksi").length} dalam produksi`} />
        <StatCard label="Request Masuk" value={String(requestCount)} note="Perlu analisis" />
        <StatCard label="Meeting Request" value={String(meetingCount)} note="Jadwal konsultasi" />
        <StatCard label="Revisi Masuk" value={String(revisionCount)} note="Perlu ditangani" />
      </section>

      {/* Recent projects */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[24px] italic">Proyek terbaru</h2>
          <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6b5b52] transition hover:text-[#5a4a42]">
            Lihat semua →
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {adminProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onChangePage("proyek")}
              className="group cursor-pointer border border-[#e6e1da] bg-white p-5 transition-all duration-300 hover:border-[#6b5b52]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[18px] italic leading-tight">{project.name}</h3>
                  <p className="mt-1 text-[13px] text-[#8b8179]">{project.customer} · {project.type} · {project.budget}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={project.status} />
                  <span className="text-[12px] font-semibold text-[#31332c]">{project.progress}%</span>
                  <ChevronRight size={16} className="text-[#ded6ca] transition-transform group-hover:translate-x-0.5 group-hover:text-[#6b5b52]" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Meeting requests */}
      {meetingCount > 0 && (
        <section>
          <h2 className="font-serif text-[24px] italic">Meeting request</h2>
          <div className="mt-4 space-y-2">
            {adminProjects
              .filter((p) => p.meetingRequests.length > 0)
              .flatMap((project) =>
                project.meetingRequests.map((meeting, i) => (
                  <div key={`${project.id}-${i}`} className="flex items-center justify-between border border-[#e6e1da] bg-white p-4">
                    <div>
                      <p className="text-[14px] font-medium">{project.customer} — {project.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#8b8179]">
                        <CalendarDays size={13} />
                        {meeting.date}, {meeting.time}
                      </p>
                    </div>
                    <StatusPill status={meeting.status} />
                  </div>
                )),
              )}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Admin Proyek ────────────────────────────────────────────────────────────

type AdminFilterTab = "semua" | "request" | "berjalan" | "selesai";

function AdminProyekView() {
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [activeFilter, setActiveFilter] = useState<AdminFilterTab>("semua");

  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "request": return adminProjects.filter((p) => p.status === "Request Masuk");
      case "berjalan": return adminProjects.filter((p) => ["Perencanaan", "Produksi", "Koordinasi Vendor"].includes(p.status));
      case "selesai": return adminProjects.filter((p) => p.status === "Selesai");
      default: return adminProjects;
    }
  }, [activeFilter]);

  const filterTabs: { id: AdminFilterTab; label: string; count: number }[] = [
    { id: "semua", label: "Semua", count: adminProjects.length },
    { id: "request", label: "Request", count: adminProjects.filter((p) => p.status === "Request Masuk").length },
    { id: "berjalan", label: "Berjalan", count: adminProjects.filter((p) => ["Perencanaan", "Produksi", "Koordinasi Vendor"].includes(p.status)).length },
    { id: "selesai", label: "Selesai", count: adminProjects.filter((p) => p.status === "Selesai").length },
  ];

  if (selectedProject) {
    return <AdminProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Kelola Proyek</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Proyek</h1>
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
            <span className={`ml-1.5 text-[11px] ${activeFilter === tab.id ? "text-[#6b5b52]" : "text-[#b8b2aa]"}`}>{tab.count}</span>
            {activeFilter === tab.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6b5b52]" />}
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
                    <StatusPill status={project.status} />
                  </div>
                  <p className="mt-1 text-[13px] text-[#8b8179]">{project.customer} · {project.type} · {project.location} · {project.budget}</p>
                </div>
                <div className="flex items-center gap-4">
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

function AdminProjectDetail({ project, onBack }: { project: AdminProject; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"timeline" | "meeting" | "revisi" | "files">("timeline");

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
            <p className="mt-2 text-[14px] text-[#8b8179]">{project.customer} · {project.type} · {project.location} · {project.budget}</p>
          </div>
          <StatusPill status={project.status} />
        </div>
      </section>

      {/* Progress */}
      <section className="border border-[#e6e1da] bg-white p-5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-[#8b8179]">Progress</span>
          <span className="font-semibold text-[#31332c]">{project.progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden bg-[#eee8df]">
          <div className="h-full bg-[#6b5b52] transition-all duration-700" style={{ width: `${project.progress}%` }} />
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e6e1da]">
        {([
          { id: "timeline" as const, label: "Timeline", count: project.timeline.length },
          { id: "meeting" as const, label: "Meeting", count: project.meetingRequests.length },
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

      {/* Timeline tab */}
      {activeTab === "timeline" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#8b8179]">Update progress ke customer.</p>
            <button className="flex h-9 items-center gap-1.5 border border-[#6b5b52]/30 px-3 text-[12px] font-semibold text-[#6b5b52] transition hover:bg-[#f7f4ef]">
              <Plus size={14} />
              Tambah Update
            </button>
          </div>

          <div className="mt-5 space-y-0">
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

          <label className="mt-2 flex cursor-pointer items-center gap-2 border border-dashed border-[#ded6ca] bg-[#FCFBF9] px-4 py-3 text-[12px] font-medium text-[#8b8179] transition hover:border-[#6b5b52] hover:text-[#6b5b52]">
            <Upload size={15} />
            Upload foto progress
            <input type="file" className="sr-only" />
          </label>
        </section>
      )}

      {/* Meeting tab */}
      {activeTab === "meeting" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          {project.meetingRequests.length === 0 ? (
            <p className="text-[13px] text-[#8b8179]">Belum ada request meeting dari customer.</p>
          ) : (
            <div className="space-y-3">
              {project.meetingRequests.map((m, i) => (
                <div key={i} className="flex items-center justify-between border border-[#e6e1da] bg-[#f7f4ef] p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center bg-white text-[#6b5b52]">
                      <CalendarDays size={17} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium">{m.date}, {m.time}</p>
                      <p className="mt-0.5 text-[12px] text-[#8b8179]">Diminta oleh {project.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={m.status} />
                    {m.status.includes("Menunggu") && (
                      <button className="h-8 bg-[#6b5b52] px-3 text-[11px] font-semibold text-white transition hover:bg-[#5a4a42]">
                        Konfirmasi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Revisi tab */}
      {activeTab === "revisi" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          {project.revisions.length === 0 ? (
            <p className="text-[13px] text-[#8b8179]">Belum ada revisi dari customer.</p>
          ) : (
            <div className="space-y-2">
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
          )}
          <div className="mt-4 flex gap-2">
            <input placeholder="Balas revisi customer..." className="field-control flex-1" />
            <button className="grid h-[42px] w-[42px] shrink-0 place-items-center bg-[#6b5b52] text-white transition hover:bg-[#5a4a42]">
              <Send size={15} />
            </button>
          </div>
        </section>
      )}

      {/* Files tab */}
      {activeTab === "files" && (
        <section className="border border-[#e6e1da] bg-white p-6">
          {project.files.length === 0 ? (
            <p className="text-[13px] text-[#8b8179]">Belum ada file.</p>
          ) : (
            <div className="space-y-2">
              {project.files.map((file) => (
                <div key={file.name} className="flex items-center justify-between border border-[#e6e1da] bg-[#f7f4ef] px-4 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-[#31332c]">{file.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#8b8179]">{file.type} · {file.date}</p>
                  </div>
                  <button className="text-[12px] font-semibold text-[#6b5b52]">Download</button>
                </div>
              ))}
            </div>
          )}
          <label className="mt-4 flex cursor-pointer items-center gap-2 border border-dashed border-[#ded6ca] bg-[#FCFBF9] px-4 py-3 text-[12px] font-medium text-[#8b8179] transition hover:border-[#6b5b52] hover:text-[#6b5b52]">
            <Upload size={15} />
            Upload file (RAB, invoice, desain, dll)
            <input type="file" className="sr-only" />
          </label>
        </section>
      )}
    </div>
  );
}

// ─── Admin Customer ──────────────────────────────────────────────────────────

function AdminCustomerView() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Data</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Customer</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#797c73]">Daftar customer VMatch dan riwayat proyek mereka.</p>
      </section>

      <div className="space-y-3">
        {customers.map((c) => (
          <article key={c.name} className="border border-[#e6e1da] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center bg-[#f7f4ef] text-[#6b5b52]">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#31332c]">{c.name}</p>
                  <p className="mt-0.5 text-[12px] text-[#8b8179]">{c.email} · {c.phone} · {c.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold">{c.projects} proyek</p>
                <StatusPill status={c.status} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Vendor ────────────────────────────────────────────────────────────

function AdminVendorView() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Partner</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Vendor</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#797c73]">Partner internal VMatch untuk eksekusi proyek.</p>
      </section>

      <div className="space-y-3">
        {vendors.map((v) => (
          <article key={v.name} className="border border-[#e6e1da] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center bg-[#f7f4ef] text-[#6b5b52]">
                  <Wrench size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#31332c]">{v.name}</p>
                  <p className="mt-0.5 text-[12px] text-[#8b8179]">{v.skill} · {v.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold">{v.activeProjects} proyek aktif</p>
                <p className="mt-0.5 text-[12px] text-[#8b8179]">Rating {v.rating}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Settings ──────────────────────────────────────────────────────────

function AdminSettingsView() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">Pengaturan</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Settings</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#797c73]">Kelola informasi admin dan preferensi.</p>
      </section>

      {/* Profile */}
      <section className="border border-[#e6e1da] bg-white p-6">
        <h2 className="font-serif text-[24px] italic">Profil Admin</h2>
        <p className="mt-1 text-[13px] text-[#8b8179]">Informasi akun admin VMatch.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Username">
            <input className="field-control" defaultValue="admin_vmatch" />
          </FormField>
          <FormField label="Nama lengkap">
            <input className="field-control" defaultValue="Admin VMatch" />
          </FormField>
          <FormField label="Email (tidak bisa diubah)">
            <input className="field-control cursor-not-allowed bg-[#f7f4ef] text-[#8b8179]" defaultValue="admin@vmatch.id" disabled />
          </FormField>
          <FormField label="Nomor HP">
            <input className="field-control" defaultValue="0812xxxx" />
          </FormField>
          <FormField label="Role (tidak bisa diubah)">
            <input className="field-control cursor-not-allowed bg-[#f7f4ef] text-[#8b8179]" defaultValue="Super Admin" disabled />
          </FormField>
          <FormField label="Lokasi / Kota">
            <input className="field-control" defaultValue="Semarang" />
          </FormField>
          <FormField label="Nomor WhatsApp (untuk customer)">
            <input className="field-control" defaultValue="6281234567890" placeholder="Format: 6281234567890 (tanpa +)" />
          </FormField>
        </div>

        <FormField label="Bio / Deskripsi">
          <textarea className="field-control mt-4 min-h-[80px] resize-none" defaultValue="Admin VMatch — mengelola proyek interior customer dari request hingga selesai." />
        </FormField>

        <button className="mt-5 h-11 bg-[#6b5b52] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#5a4a42]">
          Simpan Perubahan
        </button>
      </section>

      {/* Preferences */}
      <section className="border border-[#e6e1da] bg-white p-6">
        <h2 className="font-serif text-[24px] italic">Preferensi Notifikasi</h2>
        <p className="mt-1 text-[13px] text-[#8b8179]">Atur kapan kamu menerima notifikasi.</p>

        <div className="mt-5 space-y-3">
          <ToggleRow label="Request baru masuk" desc="Email saat customer submit request proyek" defaultOn />
          <ToggleRow label="Meeting request" desc="Email saat customer ajukan jadwal konsultasi" defaultOn />
          <ToggleRow label="Revisi dari customer" desc="Email saat customer kirim revisi atau catatan" defaultOn />
          <ToggleRow label="Reminder deadline" desc="Notifikasi H-3 sebelum deadline proyek" defaultOn />
          <ToggleRow label="Weekly summary" desc="Ringkasan mingguan semua aktivitas proyek" defaultOn={false} />
        </div>
      </section>

      {/* Danger zone */}
      <section className="border border-red-200 bg-red-50/50 p-6">
        <h2 className="font-serif text-[24px] italic text-red-900">Zona Berbahaya</h2>
        <p className="mt-1 text-[13px] text-red-700/70">Aksi ini tidak bisa dibatalkan.</p>
        <button className="mt-4 h-10 border border-red-300 px-5 text-[12px] font-semibold text-red-700 transition hover:bg-red-100">
          Hapus Akun Admin
        </button>
      </section>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border border-[#e6e1da] bg-white p-5">
      <p className="text-[12px] font-medium text-[#8b8179]">{label}</p>
      <p className="mt-2 font-serif text-[36px] leading-none text-[#31332c]">{value}</p>
      <p className="mt-3 text-[12px] font-medium text-[#6b5b52]">{note}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status.includes("Selesai") || status.includes("Terkonfirmasi") || status.includes("Aktif") || status.includes("Prioritas")
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
