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
  TrendingUp,
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
  { id: "settings", label: "Pengaturan", icon: Settings },
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

        {/* Badge */}
        <div className="mx-3 mb-2 rounded-lg bg-[#6B5B52]/8 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B5B52]">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
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

        {/* Admin info + logout */}
        <div className="border-t border-[#E8E2D9] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3D3530] text-white">
              <UserRound size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#3D3530]">Admin</p>
              <p className="truncate text-[11px] text-[#8B8179]">admin@vmatch.id</p>
            </div>
          </div>
          <Link href="/login" className="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg text-[12px] font-medium text-[#8B8179] transition-colors hover:bg-[#F5F0EA] hover:text-[#6B5B52]">
            <LogOut size={14} />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Content */}
      <section className="min-h-[100dvh] lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Menu">
            <Menu size={18} />
          </button>
          <p className="flex-1 text-[13px] font-medium text-[#7A7067]">{activeMenu.label}</p>
          <button className="grid h-8 w-8 place-items-center rounded-full text-[#7A7067] transition hover:bg-[#F0EBE4]" aria-label="Notifikasi">
            <Bell size={17} />
          </button>
        </header>

        {/* Page content */}
        <div className="w-full px-5 py-6 sm:px-6 lg:px-8">
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
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">
          Dashboard Admin
        </h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">
          Overview proyek, request, meeting, dan revisi customer.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderOpen} label="Proyek Aktif" value={String(activeCount)} note={`${adminProjects.filter((p) => p.status === "Produksi").length} produksi`} />
        <StatCard icon={TrendingUp} label="Request Masuk" value={String(requestCount)} note="Perlu analisis" />
        <StatCard icon={CalendarDays} label="Meeting" value={String(meetingCount)} note="Jadwal konsultasi" />
        <StatCard icon={Send} label="Revisi Masuk" value={String(revisionCount)} note="Perlu ditangani" />
      </div>

      {/* Recent projects */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#3D3530]">Proyek Terbaru</h2>
          <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
            Lihat semua →
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {adminProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onChangePage("proyek")}
              className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all duration-200 hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                    <StatusPill status={project.status} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.type} · {project.budget}</p>
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
      </section>

      {/* Meeting requests */}
      {meetingCount > 0 && (
        <section>
          <h2 className="text-[16px] font-semibold text-[#3D3530]">Meeting Request</h2>
          <div className="mt-3 space-y-2">
            {adminProjects
              .filter((p) => p.meetingRequests.length > 0)
              .flatMap((project) =>
                project.meetingRequests.map((meeting, i) => (
                  <div key={`${project.id}-${i}`} className="flex items-center justify-between rounded-xl border border-[#E8E2D9] bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
                        <CalendarDays size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#3D3530]">{project.customer} — {project.name}</p>
                        <p className="text-[12px] text-[#8B8179]">{meeting.date}, {meeting.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={meeting.status} />
                      {meeting.status.includes("Menunggu") && (
                        <button className="h-7 rounded-md bg-[#6B5B52] px-3 text-[11px] font-semibold text-white transition hover:bg-[#5A4A42]">
                          Konfirmasi
                        </button>
                      )}
                    </div>
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

  if (selectedProject) return <AdminProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Proyek</h1>

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
                    <StatusPill status={project.status} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.type} · {project.location} · {project.budget}</p>
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

function AdminProjectDetail({ project, onBack }: { project: AdminProject; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"timeline" | "meeting" | "files">("timeline");
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
          <p className="mt-1 text-[13px] text-[#8B8179]">{project.customer} · {project.type} · {project.location} · {project.budget}</p>
        </div>
        <StatusPill status={project.status} />
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

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {([
          { id: "timeline" as const, label: "Timeline & Catatan" },
          { id: "meeting" as const, label: "Meeting" },
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
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[12px] text-[#8B8179]">Update progress ke customer.</p>
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
                <Plus size={13} />
                Tambah Update
              </button>
            </div>
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
                            Balas
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">{entry.description}</p>
                      {entry.image && (
                        <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-[#F0EBE4]">
                          <img src={entry.image} alt={entry.title} className="h-full w-full object-cover" />
                        </div>
                      )}

                      {/* Catatan customer terkait entry ini */}
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
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
              <Upload size={14} />
              Upload foto progress
              <input type="file" className="sr-only" />
            </label>
          </div>
        )}

        {activeTab === "meeting" && (
          <div>
            {project.meetingRequests.length === 0 ? (
              <p className="text-[13px] text-[#8B8179]">Belum ada request meeting.</p>
            ) : (
              <div className="space-y-2.5">
                {project.meetingRequests.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#6B5B52]">
                        <CalendarDays size={15} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#3D3530]">{m.date}, {m.time}</p>
                        <p className="text-[11px] text-[#8B8179]">Diminta oleh {project.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={m.status} />
                      {m.status.includes("Menunggu") && (
                        <button className="h-7 rounded-md bg-[#6B5B52] px-3 text-[11px] font-semibold text-white transition hover:bg-[#5A4A42]">
                          Konfirmasi
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div>
            {project.files.length === 0 ? (
              <p className="text-[13px] text-[#8B8179]">Belum ada file.</p>
            ) : (
              <div className="space-y-2">
                {project.files.map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-3.5 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-[#3D3530]">{file.name}</p>
                      <p className="text-[11px] text-[#8B8179]">{file.type} · {file.date}</p>
                    </div>
                    <button className="text-[12px] font-medium text-[#6B5B52]">Download</button>
                  </div>
                ))}
              </div>
            )}
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
              <Upload size={14} />
              Upload file (RAB, invoice, desain)
              <input type="file" className="sr-only" />
            </label>
          </div>
        )}
      </div>

      {/* Feedback modal */}
      {feedbackTarget && (
        <AdminFeedbackModal
          targetTitle={feedbackTarget}
          customerName={project.customer}
          onClose={() => setFeedbackTarget(null)}
        />
      )}
    </div>
  );
}

function AdminFeedbackModal({ targetTitle, customerName, onClose }: { targetTitle: string; customerName: string; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#3D3530]">Balas Catatan</h3>
            <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full text-[#8B8179] transition hover:bg-[#F0EBE4]">
              <X size={14} />
            </button>
          </div>
          <p className="mt-1.5 text-[12px] text-[#8B8179]">
            Tahap: <span className="font-medium text-[#3D3530]">{targetTitle}</span> — {customerName}
          </p>
          <textarea
            rows={4}
            autoFocus
            placeholder="Tulis balasan atau update untuk customer..."
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

// ─── Admin Customer ──────────────────────────────────────────────────────────

function AdminCustomerView() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Customer</h1>
      <p className="text-[14px] text-[#7A7067]">Daftar customer VMatch dan riwayat proyek mereka.</p>

      <div className="space-y-2.5">
        {customers.map((c) => (
          <article key={c.name} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F0EA] text-[#6B5B52]">
                  <UserRound size={16} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{c.name}</p>
                  <p className="text-[12px] text-[#8B8179]">{c.email} · {c.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#3D3530]">{c.projects} proyek</span>
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
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Vendor</h1>
      <p className="text-[14px] text-[#7A7067]">Partner internal VMatch untuk eksekusi proyek.</p>

      <div className="space-y-2.5">
        {vendors.map((v) => (
          <article key={v.name} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F0EA] text-[#6B5B52]">
                  <Wrench size={16} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{v.name}</p>
                  <p className="text-[12px] text-[#8B8179]">{v.skill} · {v.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-[#3D3530]">{v.activeProjects} proyek aktif</p>
                <p className="text-[11px] text-[#8B8179]">Rating {v.rating}</p>
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
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Pengaturan</h1>

      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Profil Admin</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Informasi akun admin VMatch.</p>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <FormField label="Username"><input className="field-control" defaultValue="admin_vmatch" /></FormField>
          <FormField label="Nama lengkap"><input className="field-control" defaultValue="Admin VMatch" /></FormField>
          <FormField label="Email"><input className="field-control cursor-not-allowed bg-[#F5F0EA] text-[#8B8179]" defaultValue="admin@vmatch.id" disabled /></FormField>
          <FormField label="Nomor HP"><input className="field-control" defaultValue="0812xxxx" /></FormField>
          <FormField label="Role"><input className="field-control cursor-not-allowed bg-[#F5F0EA] text-[#8B8179]" defaultValue="Super Admin" disabled /></FormField>
          <FormField label="WhatsApp (untuk customer)"><input className="field-control" defaultValue="6281234567890" /></FormField>
        </div>
        <button className="mt-4 h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          Simpan
        </button>
      </div>

      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Atur kapan kamu menerima notifikasi.</p>
        <div className="mt-4 space-y-2">
          <ToggleRow label="Request baru masuk" desc="Email saat customer submit request" defaultOn />
          <ToggleRow label="Meeting request" desc="Email saat customer ajukan jadwal" defaultOn />
          <ToggleRow label="Revisi dari customer" desc="Email saat customer kirim revisi" defaultOn />
          <ToggleRow label="Reminder deadline" desc="Notifikasi H-3 sebelum deadline" defaultOn />
          <ToggleRow label="Weekly summary" desc="Ringkasan mingguan aktivitas" defaultOn={false} />
        </div>
      </div>

      <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
        <h2 className="text-[15px] font-semibold text-red-800">Zona Berbahaya</h2>
        <p className="mt-1 text-[12px] text-red-600/70">Aksi ini tidak bisa dibatalkan.</p>
        <button className="mt-3 h-8 rounded-lg border border-red-200 px-4 text-[12px] font-medium text-red-700 transition hover:bg-red-100">
          Hapus Akun Admin
        </button>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
          <Icon size={16} />
        </div>
        <p className="text-[12px] font-medium text-[#8B8179]">{label}</p>
      </div>
      <p className="mt-2.5 text-[28px] font-semibold leading-none text-[#3D3530]">{value}</p>
      <p className="mt-1.5 text-[11px] font-medium text-[#6B5B52]">{note}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status.includes("Selesai") || status.includes("Terkonfirmasi") || status.includes("Aktif") || status.includes("Prioritas")
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
