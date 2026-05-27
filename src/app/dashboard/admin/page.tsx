"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  FolderOpen,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Plus,
  Settings,
  TrendingUp,
  Upload,
  UserRound,
  Users2,
  Wrench,
  X,
  Clock,
  Eye,
  FileText,
  Camera,
  Calculator,
  Package,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RabBuilder } from "./components/rab-builder";
import { MaterialDatabase } from "./components/material-database";
import { AnalyticsDashboard } from "./components/analytics-dashboard";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageId = "dashboard" | "proyek" | "customer" | "vendor" | "invoice" | "meeting" | "rab" | "material" | "analytics" | "settings";

type MenuItem = { id: PageId; label: string; icon: LucideIcon };

type ProjectStage = "request" | "consultation" | "estimation" | "production" | "installation" | "done";

type AdminProject = {
  id: string;
  name: string;
  customer: string;
  customerEmail: string;
  stage: ProjectStage;
  stageLabel: string;
  progress: number;
  // Brief fields (editable by admin)
  brief: {
    projectType: string;
    propertyType: string;
    location: string;
    propertyStatus: string;
    roomSize: string;
    ceilingHeight: string;
    roomCondition: string;
    locationAccess: string;
    problem: string;
    style: string;
    material: string;
    color: string;
    priority: string;
    budget: string;
    targetStart: string;
    deadline: string;
    notes: string;
  };
  timeline: { title: string; date: string; description: string; image?: string; done: boolean }[];
  assignedVendor?: string;
  files: { name: string; type: string; date: string }[];
  revisionHistory: { date: string; changedBy: string; note: string; fields: string[] }[];
};

type AdminMeeting = {
  id: string;
  customer: string;
  projectName?: string;
  date: string;
  time: string;
  agenda: string;
  status: "requested" | "confirmed" | "done" | "cancelled";
  meetingUrl?: string;
  notes?: string;
};

type AdminInvoice = {
  id: string;
  projectName: string;
  customer: string;
  description: string;
  amount: string;
  status: "pending" | "awaiting_verification" | "paid" | "rejected";
  dueDate: string;
  proofUrl?: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyek", label: "Proyek", icon: FolderOpen },
  { id: "customer", label: "Customer", icon: Users2 },
  { id: "vendor", label: "Vendor", icon: Wrench },
  { id: "invoice", label: "Invoice", icon: CreditCard },
  { id: "meeting", label: "Meeting", icon: CalendarDays },
  { id: "rab", label: "RAB Builder", icon: Calculator },
  { id: "material", label: "Material & Supplier", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

type MenuGroup = { label: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    label: "",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manajemen",
    items: [
      { id: "proyek", label: "Proyek", icon: FolderOpen },
      { id: "customer", label: "Customer", icon: Users2 },
      { id: "vendor", label: "Vendor", icon: Wrench },
      { id: "meeting", label: "Meeting", icon: CalendarDays },
    ],
  },
  {
    label: "Keuangan",
    items: [
      { id: "invoice", label: "Invoice", icon: CreditCard },
      { id: "rab", label: "RAB Builder", icon: Calculator },
      { id: "material", label: "Material & Supplier", icon: Package },
    ],
  },
  {
    label: "Insight",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

const adminProjects: AdminProject[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    customer: "Mira H.",
    customerEmail: "mira@email.com",
    stage: "production",
    stageLabel: "Produksi",
    progress: 68,
    brief: {
      projectType: "Kitchen Set",
      propertyType: "Rumah",
      location: "Bandung, Jawa Barat",
      propertyStatus: "Sudah ditempati",
      roomSize: "3.5 x 4 meter",
      ceilingHeight: "2.8 meter",
      roomCondition: "Ada furniture lama",
      locationAccess: "Mudah (jalan lebar)",
      problem: "Kitchen set lama sudah rusak, butuh yang lebih modern dengan storage maksimal",
      style: "Japandi",
      material: "HPL",
      color: "Walnut, putih",
      priority: "Storage maksimal",
      budget: "Rp60–100 juta",
      targetStart: "Secepatnya",
      deadline: "Dalam 2 bulan",
      notes: "Handle hidden, push-to-open. LED strip di bawah kabinet atas.",
    },
    timeline: [
      { title: "Request diterima", date: "15 Mei 2026", description: "Brief customer sudah masuk.", done: true },
      { title: "Konsultasi selesai", date: "18 Mei 2026", description: "Meeting via Google Meet, brief disesuaikan.", done: true },
      { title: "DP dibayar", date: "20 Mei 2026", description: "DP 50% sudah diterima.", done: true },
      { title: "Produksi", date: "24 Mei 2026", description: "Aruna Woodwork mengerjakan modul utama.", image: "/figma/benefits-kitchen.webp", done: false },
    ],
    assignedVendor: "Aruna Woodwork",
    files: [
      { name: "RAB Kitchen Set Walnut.pdf", type: "RAB", date: "20 Mei 2026" },
      { name: "Foto Progress Minggu 1.jpg", type: "Progress", date: "26 Mei 2026" },
    ],
    revisionHistory: [
      { date: "18 Mei 2026", changedBy: "Admin", note: "Sesuai hasil meeting: handle hidden, warna walnut diperjelas", fields: ["notes", "color"] },
    ],
  },
  {
    id: "2",
    name: "Wardrobe Minimalis",
    customer: "Kevin A.",
    customerEmail: "kevin@email.com",
    stage: "consultation",
    stageLabel: "Konsultasi",
    progress: 15,
    brief: {
      projectType: "Wardrobe / Lemari",
      propertyType: "Apartemen",
      location: "Tangerang",
      propertyStatus: "Baru / belum ditempati",
      roomSize: "2.5 x 3 meter",
      ceilingHeight: "2.6 meter",
      roomCondition: "Kosong",
      locationAccess: "Apartemen (lift barang)",
      problem: "Butuh wardrobe built-in yang memaksimalkan ruang kecil",
      style: "Modern Minimalis",
      material: "HPL",
      color: "Putih, abu muda",
      priority: "Storage maksimal",
      budget: "Rp30–60 juta",
      targetStart: "1 bulan lagi",
      deadline: "Dalam 2 bulan",
      notes: "",
    },
    timeline: [
      { title: "Request diterima", date: "14 Mei 2026", description: "Menunggu jadwal meeting.", done: true },
    ],
    assignedVendor: undefined,
    files: [{ name: "Referensi Wardrobe.png", type: "Referensi", date: "14 Mei 2026" }],
    revisionHistory: [],
  },
  {
    id: "3",
    name: "Japandi Living Room",
    customer: "Nadya P.",
    customerEmail: "nadya@email.com",
    stage: "request",
    stageLabel: "Request Masuk",
    progress: 5,
    brief: {
      projectType: "Ruang Tamu",
      propertyType: "Rumah",
      location: "Jakarta Selatan",
      propertyStatus: "Sudah ditempati",
      roomSize: "5 x 6 meter",
      ceilingHeight: "3 meter",
      roomCondition: "Ada furniture lama",
      locationAccess: "Mudah (jalan lebar)",
      problem: "Ingin renovasi total ruang tamu jadi lebih modern dan nyaman",
      style: "Japandi",
      material: "Kombinasi",
      color: "Netral, kayu muda",
      priority: "Desain unik",
      budget: "Rp100–150 juta",
      targetStart: "1–2 minggu lagi",
      deadline: "Dalam 3 bulan",
      notes: "",
    },
    timeline: [
      { title: "Request diterima", date: "25 Mei 2026", description: "Brief baru masuk.", done: true },
    ],
    assignedVendor: undefined,
    files: [],
    revisionHistory: [],
  },
];

const adminMeetings: AdminMeeting[] = [
  { id: "1", customer: "Mira H.", projectName: "Kitchen Set Walnut", date: "22 Mei 2026", time: "13:00 WIB", agenda: "Review progress produksi", status: "confirmed", meetingUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "2", customer: "Kevin A.", projectName: "Wardrobe Minimalis", date: "28 Mei 2026", time: "10:00 WIB", agenda: "Diskusi kebutuhan dan material", status: "requested" },
  { id: "3", customer: "Nadya P.", date: "30 Mei 2026", time: "14:00 WIB", agenda: "Konsultasi umum renovasi rumah", status: "requested" },
];

const adminInvoices: AdminInvoice[] = [
  { id: "1", projectName: "Kitchen Set Walnut", customer: "Mira H.", description: "DP 50%", amount: "Rp47.500.000", status: "paid", dueDate: "20 Mei 2026" },
  { id: "2", projectName: "Kitchen Set Walnut", customer: "Mira H.", description: "Pelunasan 50%", amount: "Rp47.500.000", status: "pending", dueDate: "15 Jul 2026" },
];

const customers = [
  { name: "Nadya P.", email: "nadya@email.com", phone: "0812xxxx", location: "Jakarta Selatan", projects: 2, status: "Aktif" },
  { name: "Kevin A.", email: "kevin@email.com", phone: "0857xxxx", location: "Tangerang", projects: 1, status: "Aktif" },
  { name: "Mira H.", email: "mira@email.com", phone: "0821xxxx", location: "Bandung", projects: 3, status: "Prioritas" },
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

  const activeMenu = useMemo(() => menuGroups.flatMap(g => g.items).find((item) => item.id === activePage) ?? menuGroups[0].items[0], [activePage]);

  const changePage = (page: PageId) => { setActivePage(page); setIsSidebarOpen(false); };

  return (
    <main className="min-h-[100dvh] bg-[#F8F6F2] text-[#2C2C2C]">
      <div className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[250px] flex-col border-r border-[#E8E2D9] bg-[#FEFDFB] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="font-serif text-[22px] italic text-[#3D3530]">VMatch</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="grid h-7 w-7 place-items-center rounded-full text-[#8B8179] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Tutup"><X size={14} /></button>
        </div>
        <div className="mx-3 mb-2 rounded-lg bg-[#6B5B52]/8 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B5B52]">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3">
          {menuGroups.map((group) => (
            <div key={group.label || "main"}>
              {group.label && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B8B2AA]">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => changePage(item.id)} className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#6B5B52]/10 text-[#6B5B52]" : "text-[#7A7067] hover:bg-[#F5F0EA] hover:text-[#3D3530]"}`}>
                      <Icon size={16} strokeWidth={active ? 2 : 1.6} />{item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-[#E8E2D9] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3D3530] text-white"><UserRound size={14} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#3D3530]">Admin</p>
              <p className="truncate text-[11px] text-[#8B8179]">admin@vmatch.id</p>
            </div>
          </div>
          <Link href="/login" className="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg text-[12px] font-medium text-[#8B8179] transition-colors hover:bg-[#F5F0EA] hover:text-[#6B5B52]"><LogOut size={14} />Keluar</Link>
        </div>
      </aside>

      {/* Content */}
      <section className="min-h-[100dvh] lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Menu"><Menu size={18} /></button>
          <p className="flex-1 text-[13px] font-medium text-[#7A7067]">{activeMenu.label}</p>
          <button className="grid h-8 w-8 place-items-center rounded-full text-[#7A7067] transition hover:bg-[#F0EBE4]" aria-label="Notifikasi"><Bell size={17} /></button>
        </header>
        <div className="w-full px-5 py-6 sm:px-6 lg:px-8">
          {activePage === "dashboard" && <AdminDashboardView onChangePage={changePage} />}
          {activePage === "proyek" && <AdminProyekView />}
          {activePage === "customer" && <AdminCustomerView />}
          {activePage === "vendor" && <AdminVendorView />}
          {activePage === "invoice" && <AdminInvoiceView />}
          {activePage === "meeting" && <AdminMeetingView />}
          {activePage === "rab" && <RabBuilder />}
          {activePage === "material" && <MaterialDatabase />}
          {activePage === "analytics" && <AnalyticsDashboard />}
          {activePage === "settings" && <AdminSettingsView />}
        </div>
      </section>
    </main>
  );
}

// ─── Dashboard Overview ──────────────────────────────────────────────────────

function AdminDashboardView({ onChangePage }: { onChangePage: (p: PageId) => void }) {
  const requestCount = adminProjects.filter((p) => p.stage === "request").length;
  const activeCount = adminProjects.filter((p) => p.stage !== "done").length;
  const pendingMeetings = adminMeetings.filter((m) => m.status === "requested").length;
  const pendingInvoices = adminInvoices.filter((i) => i.status === "awaiting_verification").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Dashboard Admin</h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">Overview proyek, meeting, dan pembayaran.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderOpen} label="Proyek Aktif" value={String(activeCount)} note={`${requestCount} request baru`} />
        <StatCard icon={TrendingUp} label="Request Masuk" value={String(requestCount)} note="Perlu review" />
        <StatCard icon={CalendarDays} label="Meeting Pending" value={String(pendingMeetings)} note="Perlu konfirmasi" />
        <StatCard icon={CreditCard} label="Verifikasi Bayar" value={String(pendingInvoices)} note="Bukti masuk" />
      </div>

      {/* Recent projects */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#3D3530]">Proyek Terbaru</h2>
          <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6B5B52]">Lihat semua →</button>
        </div>
        <div className="mt-3 space-y-2.5">
          {adminProjects.slice(0, 3).map((project) => (
            <article key={project.id} onClick={() => onChangePage("proyek")} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                    <StatusPill status={project.stageLabel} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.brief.projectType} · {project.brief.budget}</p>
                </div>
                <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Admin Proyek ────────────────────────────────────────────────────────────

function AdminProyekView() {
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("semua");

  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "request": return adminProjects.filter((p) => p.stage === "request");
      case "berjalan": return adminProjects.filter((p) => !["request", "done"].includes(p.stage));
      case "selesai": return adminProjects.filter((p) => p.stage === "done");
      default: return adminProjects;
    }
  }, [activeFilter]);

  if (selectedProject) return <AdminProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Proyek</h1>
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {[{ id: "semua", label: "Semua" }, { id: "request", label: "Request" }, { id: "berjalan", label: "Berjalan" }, { id: "selesai", label: "Selesai" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeFilter === tab.id ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067] hover:text-[#3D3530]"}`}>{tab.label}</button>
        ))}
      </div>
      <div className="space-y-2.5">
        {filteredProjects.map((project) => (
          <article key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                  <StatusPill status={project.stageLabel} />
                </div>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.brief.projectType} · {project.brief.location} · {project.brief.budget}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-20 sm:block">
                  <div className="h-1.5 rounded-full bg-[#EDE8E1]"><div className="h-full rounded-full bg-[#6B5B52]" style={{ width: `${project.progress}%` }} /></div>
                  <p className="mt-1 text-right text-[11px] text-[#8B8179]">{project.progress}%</p>
                </div>
                <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminProjectDetail({ project, onBack }: { project: AdminProject; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"brief" | "timeline" | "files">("brief");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
        <ChevronRight size={14} className="rotate-180" /> Kembali
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] leading-tight text-[#3D3530] sm:text-[32px]">{project.name}</h1>
          <p className="mt-1 text-[13px] text-[#8B8179]">{project.customer} ({project.customerEmail})</p>
        </div>
        <StatusPill status={project.stageLabel} />
      </div>

      {/* Quick info */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#E8E2D9] bg-white p-3">
          <p className="text-[11px] text-[#8B8179]">Vendor</p>
          <p className="mt-0.5 text-[13px] font-medium text-[#3D3530]">{project.assignedVendor || "Belum di-assign"}</p>
        </div>
        <div className="rounded-lg border border-[#E8E2D9] bg-white p-3">
          <p className="text-[11px] text-[#8B8179]">Budget</p>
          <p className="mt-0.5 text-[13px] font-medium text-[#3D3530]">{project.brief.budget}</p>
        </div>
        <div className="rounded-lg border border-[#E8E2D9] bg-white p-3">
          <p className="text-[11px] text-[#8B8179]">Progress</p>
          <p className="mt-0.5 text-[13px] font-medium text-[#3D3530]">{project.progress}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
          <Wrench size={13} /> Assign Vendor
        </button>
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
          <CreditCard size={13} /> Kirim Invoice
        </button>
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
          <TrendingUp size={13} /> Update Stage
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {([{ id: "brief" as const, label: "Brief & Detail" }, { id: "timeline" as const, label: "Timeline" }, { id: "files" as const, label: "File" }]).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeTab === tab.id ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067] hover:text-[#3D3530]"}`}>{tab.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        {activeTab === "brief" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#3D3530]">Brief Customer</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="flex h-8 items-center gap-1.5 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
                <Edit3 size={13} /> {isEditing ? "Batal Edit" : "Edit Brief"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-[12px] text-amber-700">Mode edit aktif. Perubahan akan tercatat di revision history.</p>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <FormField label="Jenis proyek"><input className="field-control" defaultValue={project.brief.projectType} /></FormField>
                  <FormField label="Tipe properti"><input className="field-control" defaultValue={project.brief.propertyType} /></FormField>
                  <FormField label="Lokasi"><input className="field-control" defaultValue={project.brief.location} /></FormField>
                  <FormField label="Status properti"><input className="field-control" defaultValue={project.brief.propertyStatus} /></FormField>
                  <FormField label="Ukuran ruangan"><input className="field-control" defaultValue={project.brief.roomSize} /></FormField>
                  <FormField label="Tinggi plafon"><input className="field-control" defaultValue={project.brief.ceilingHeight} /></FormField>
                  <FormField label="Kondisi ruangan"><input className="field-control" defaultValue={project.brief.roomCondition} /></FormField>
                  <FormField label="Akses lokasi"><input className="field-control" defaultValue={project.brief.locationAccess} /></FormField>
                  <FormField label="Gaya desain"><input className="field-control" defaultValue={project.brief.style} /></FormField>
                  <FormField label="Material"><input className="field-control" defaultValue={project.brief.material} /></FormField>
                  <FormField label="Warna"><input className="field-control" defaultValue={project.brief.color} /></FormField>
                  <FormField label="Prioritas"><input className="field-control" defaultValue={project.brief.priority} /></FormField>
                  <FormField label="Budget"><input className="field-control" defaultValue={project.brief.budget} /></FormField>
                  <FormField label="Target mulai"><input className="field-control" defaultValue={project.brief.targetStart} /></FormField>
                </div>
                <FormField label="Masalah"><textarea rows={2} className="field-control resize-none" defaultValue={project.brief.problem} /></FormField>
                <FormField label="Catatan"><textarea rows={2} className="field-control resize-none" defaultValue={project.brief.notes} /></FormField>
                <FormField label="Catatan revisi (alasan perubahan) *"><textarea rows={2} className="field-control resize-none" placeholder="Contoh: Sesuai hasil meeting 22 Mei, client minta handle hidden..." /></FormField>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
                  <button onClick={() => setIsEditing(false)} className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Simpan Perubahan</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BriefField label="Jenis proyek" value={project.brief.projectType} />
                  <BriefField label="Tipe properti" value={project.brief.propertyType} />
                  <BriefField label="Lokasi" value={project.brief.location} />
                  <BriefField label="Status properti" value={project.brief.propertyStatus} />
                  <BriefField label="Ukuran ruangan" value={project.brief.roomSize} />
                  <BriefField label="Tinggi plafon" value={project.brief.ceilingHeight} />
                  <BriefField label="Kondisi ruangan" value={project.brief.roomCondition} />
                  <BriefField label="Akses lokasi" value={project.brief.locationAccess} />
                  <BriefField label="Gaya desain" value={project.brief.style} />
                  <BriefField label="Material" value={project.brief.material} />
                  <BriefField label="Warna" value={project.brief.color} />
                  <BriefField label="Prioritas" value={project.brief.priority} />
                  <BriefField label="Budget" value={project.brief.budget} />
                  <BriefField label="Target mulai" value={project.brief.targetStart} />
                  <BriefField label="Deadline" value={project.brief.deadline} />
                </div>
                {project.brief.problem && <div className="mt-3"><BriefField label="Masalah" value={project.brief.problem} /></div>}
                {project.brief.notes && <div className="mt-3"><BriefField label="Catatan" value={project.brief.notes} /></div>}

                {/* Revision history */}
                {project.revisionHistory.length > 0 && (
                  <div className="mt-5 border-t border-[#E8E2D9] pt-4">
                    <h4 className="text-[13px] font-semibold text-[#3D3530]">Riwayat Revisi</h4>
                    <div className="mt-2 space-y-2">
                      {project.revisionHistory.map((rev, i) => (
                        <div key={i} className="rounded-lg bg-[#F8F6F2] px-3 py-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] font-medium text-[#3D3530]">{rev.changedBy} — {rev.date}</p>
                            <span className="text-[11px] text-[#8B8179]">{rev.fields.join(", ")}</span>
                          </div>
                          <p className="mt-0.5 text-[12px] text-[#7A7067]">{rev.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#3D3530]">Timeline Progress</h3>
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
                <Plus size={13} /> Tambah Update
              </button>
            </div>
            <div className="space-y-0">
              {project.timeline.map((entry, i) => (
                <div key={entry.title} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-3 w-3 rounded-full border-2 ${entry.done ? "border-[#6B5B52] bg-[#6B5B52]" : "border-[#D4C9BD] bg-white"}`} />
                    {i < project.timeline.length - 1 && <div className="w-px flex-1 bg-[#E8E2D9]" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-5">
                    <p className="text-[13px] font-semibold text-[#3D3530]">{entry.title}</p>
                    <p className="text-[11px] text-[#8B8179]">{entry.date}</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">{entry.description}</p>
                    {entry.image && <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-[#F0EBE4]"><img src={entry.image} alt={entry.title} className="h-full w-full object-cover" /></div>}
                  </div>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
              <Upload size={14} /> Upload foto progress
              <input type="file" className="sr-only" />
            </label>
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
                    <button className="text-[12px] font-medium text-[#6B5B52]">Download</button>
                  </div>
                ))}
              </div>
            ) : <p className="text-[13px] text-[#8B8179]">Belum ada file.</p>}
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
              <Upload size={14} /> Upload file (RAB, kontrak, desain)
              <input type="file" className="sr-only" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Meeting ───────────────────────────────────────────────────────────

function AdminMeetingView() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Meeting</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Kelola request meeting dari customer.</p>
      </div>

      <div className="space-y-3">
        {adminMeetings.map((m) => (
          <div key={m.id} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><CalendarDays size={16} /></div>
                <div>
                  <p className="text-[13px] font-semibold text-[#3D3530]">{m.customer} — {m.projectName || "Konsultasi Umum"}</p>
                  <p className="text-[12px] text-[#8B8179]">{m.date}, {m.time}</p>
                  <p className="mt-1 text-[12px] text-[#7A7067]">Agenda: {m.agenda}</p>
                  {m.meetingUrl && <p className="mt-1 text-[12px] text-[#6B5B52]">🔗 {m.meetingUrl}</p>}
                </div>
              </div>
              <MeetingStatusPill status={m.status} />
            </div>
            {/* Actions */}
            {m.status === "requested" && (
              <div className="mt-3 flex items-center gap-2 border-t border-[#F0EBE4] pt-3">
                <button className="flex h-8 items-center gap-1.5 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
                  <CheckCircle2 size={13} /> Konfirmasi
                </button>
                <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#7A7067] transition hover:bg-[#F5F0EA]">
                  <Link2 size={13} /> Isi Link Meet
                </button>
                <button className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-[12px] font-medium text-red-600 transition hover:bg-red-50">
                  <X size={13} /> Batalkan
                </button>
              </div>
            )}
            {m.status === "confirmed" && (
              <div className="mt-3 flex items-center gap-2 border-t border-[#F0EBE4] pt-3">
                <button className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[12px] font-semibold text-white transition hover:bg-emerald-700">
                  <CheckCircle2 size={13} /> Tandai Selesai
                </button>
                <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#7A7067] transition hover:bg-[#F5F0EA]">
                  Isi Catatan Hasil
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Invoice ───────────────────────────────────────────────────────────

function AdminInvoiceView() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Invoice & Pembayaran</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Buat invoice dan verifikasi pembayaran customer.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Buat Invoice
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#6B5B52]/20 bg-white p-5">
          <h3 className="text-[15px] font-semibold text-[#3D3530]">Buat Invoice Baru</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Proyek *">
              <select className="field-control">
                <option value="">Pilih proyek</option>
                {adminProjects.map(p => <option key={p.id}>{p.name} — {p.customer}</option>)}
              </select>
            </FormField>
            <FormField label="Nominal *">
              <input className="field-control" placeholder="Contoh: 47500000" type="number" />
            </FormField>
            <FormField label="Deskripsi *">
              <input className="field-control" placeholder="Contoh: DP 50% Kitchen Set" />
            </FormField>
            <FormField label="Jatuh tempo *">
              <input type="date" className="field-control" />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Info rekening tujuan">
              <textarea rows={2} className="field-control resize-none" placeholder="BCA 1234567890 a.n. PT VMatch Interior" />
            </FormField>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
            <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Kirim Invoice</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {adminInvoices.map((inv) => (
          <div key={inv.id} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[#3D3530]">{inv.description}</p>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{inv.customer} · {inv.projectName} · Jatuh tempo: {inv.dueDate}</p>
              </div>
              <InvoiceStatusPill status={inv.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[18px] font-semibold text-[#3D3530]">{inv.amount}</p>
              {inv.status === "awaiting_verification" && (
                <div className="flex gap-2">
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52]"><Eye size={13} /> Lihat Bukti</button>
                  <button className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[12px] font-semibold text-white"><CheckCircle2 size={13} /> Approve</button>
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-[12px] font-medium text-red-600"><X size={13} /> Tolak</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Customer ──────────────────────────────────────────────────────────

function AdminCustomerView() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Customer</h1>
      <div className="space-y-2.5">
        {customers.map((c) => (
          <article key={c.name} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F0EA] text-[#6B5B52]"><UserRound size={16} /></div>
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{c.name}</p>
                  <p className="text-[12px] text-[#8B8179]">{c.email} · {c.phone} · {c.location}</p>
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Vendor</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Partner produksi VMatch.</p>
        </div>
        <button className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Tambah Vendor
        </button>
      </div>
      <div className="space-y-2.5">
        {vendors.map((v) => (
          <article key={v.name} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F0EA] text-[#6B5B52]"><Wrench size={16} /></div>
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{v.name}</p>
                  <p className="text-[12px] text-[#8B8179]">{v.skill} · {v.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-[#3D3530]">{v.activeProjects} proyek aktif</p>
                <p className="text-[11px] text-[#8B8179]">⭐ {v.rating}</p>
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
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <FormField label="Nama lengkap"><input className="field-control" defaultValue="Admin VMatch" /></FormField>
          <FormField label="Email"><input className="field-control cursor-not-allowed bg-[#F5F0EA] text-[#8B8179]" defaultValue="admin@vmatch.id" disabled /></FormField>
          <FormField label="Nomor HP"><input className="field-control" defaultValue="0812xxxx" /></FormField>
          <FormField label="WhatsApp bisnis"><input className="field-control" defaultValue="6281234567890" /></FormField>
        </div>
        <button className="mt-4 h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">Simpan</button>
      </div>
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi</h2>
        <div className="mt-4 space-y-2">
          <ToggleRow label="Request baru" desc="Notifikasi saat customer submit proyek" defaultOn />
          <ToggleRow label="Meeting request" desc="Notifikasi saat customer ajukan meeting" defaultOn />
          <ToggleRow label="Bukti bayar masuk" desc="Notifikasi saat customer upload bukti" defaultOn />
          <ToggleRow label="Progress vendor" desc="Notifikasi saat vendor update progress" defaultOn />
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><Icon size={16} /></div>
        <p className="text-[12px] font-medium text-[#8B8179]">{label}</p>
      </div>
      <p className="mt-2.5 text-[28px] font-semibold leading-none text-[#3D3530]">{value}</p>
      <p className="mt-1.5 text-[11px] font-medium text-[#6B5B52]">{note}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status.includes("Selesai") || status.includes("Aktif") || status.includes("Prioritas") ? "bg-emerald-50 text-emerald-700" : status.includes("Request") || status.includes("Menunggu") ? "bg-amber-50 text-amber-700" : "bg-[#F5F0EA] text-[#6B5B52]";
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{status}</span>;
}

function MeetingStatusPill({ status }: { status: AdminMeeting["status"] }) {
  const map = { requested: { label: "Menunggu Konfirmasi", color: "bg-amber-50 text-amber-700" }, confirmed: { label: "Dikonfirmasi", color: "bg-emerald-50 text-emerald-700" }, done: { label: "Selesai", color: "bg-[#F0EBE4] text-[#6B5B52]" }, cancelled: { label: "Dibatalkan", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}

function InvoiceStatusPill({ status }: { status: AdminInvoice["status"] }) {
  const map = { pending: { label: "Menunggu Bayar", color: "bg-amber-50 text-amber-700" }, awaiting_verification: { label: "Verifikasi", color: "bg-blue-50 text-blue-700" }, paid: { label: "Lunas", color: "bg-emerald-50 text-emerald-700" }, rejected: { label: "Ditolak", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}

function BriefField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F8F6F2] px-3 py-2">
      <p className="text-[11px] font-medium text-[#8B8179]">{label}</p>
      <p className="mt-0.5 text-[13px] text-[#3D3530]">{value}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">{label}</span>{children}</label>;
}

function ToggleRow({ label, desc, defaultOn = true }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-[#F8F6F2] p-3.5">
      <div><p className="text-[13px] font-medium text-[#3D3530]">{label}</p><p className="text-[11px] text-[#8B8179]">{desc}</p></div>
      <input type="checkbox" defaultChecked={defaultOn} className="h-4 w-4 accent-[#6B5B52]" />
    </label>
  );
}
