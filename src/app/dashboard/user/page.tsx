"use client";

import {
  Bell,
  Bot,
  CalendarDays,
  ChevronRight,
  CreditCard,
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Palette,
  RefreshCw,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogDesign } from "./components/catalog-design";
import { SelectionBoard } from "./components/selection-board";
import { WarrantyTracking } from "./components/warranty-tracking";
import { ChangeOrderView } from "./components/change-order";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageId = "dashboard" | "ajukan" | "proyek" | "meeting" | "pembayaran" | "selection" | "change-order" | "garansi" | "dokumen" | "katalog" | "ai" | "settings";

type MenuItem = { id: PageId; label: string; icon: LucideIcon };

type ProjectStage = "request" | "consultation" | "estimation" | "production" | "installation" | "done";

type TimelineEntry = {
  title: string;
  date: string;
  description: string;
  image?: string;
  done: boolean;
};

type Invoice = {
  id: string;
  projectName: string;
  description: string;
  amount: string;
  status: "pending" | "awaiting_verification" | "paid" | "rejected";
  dueDate: string;
  proofUrl?: string;
};

type Meeting = {
  id: string;
  projectName?: string;
  date: string;
  time: string;
  agenda: string;
  status: "requested" | "confirmed" | "done" | "cancelled";
  meetingUrl?: string;
  notes?: string;
};

type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  stage: ProjectStage;
  stageLabel: string;
  progress: number;
  timeline: TimelineEntry[];
  files: { name: string; type: string; date: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ajukan", label: "Ajukan Proyek", icon: Plus },
  { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
  { id: "meeting", label: "Konsultasi", icon: CalendarDays },
  { id: "pembayaran", label: "Pembayaran", icon: CreditCard },
  { id: "selection", label: "Pilihan Material", icon: Palette },
  { id: "change-order", label: "Change Order", icon: RefreshCw },
  { id: "garansi", label: "Garansi", icon: Shield },
  { id: "dokumen", label: "Dokumen", icon: FileText },
  { id: "katalog", label: "Katalog Desain", icon: ImageIcon },
  { id: "ai", label: "VMatch AI", icon: Bot },
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
    label: "Proyek",
    items: [
      { id: "ajukan", label: "Ajukan Proyek", icon: Plus },
      { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
      { id: "selection", label: "Pilihan Material", icon: Palette },
      { id: "change-order", label: "Change Order", icon: RefreshCw },
    ],
  },
  {
    label: "Transaksi",
    items: [
      { id: "meeting", label: "Konsultasi", icon: CalendarDays },
      { id: "pembayaran", label: "Pembayaran", icon: CreditCard },
      { id: "garansi", label: "Garansi", icon: Shield },
      { id: "dokumen", label: "Dokumen", icon: FileText },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { id: "katalog", label: "Katalog Desain", icon: ImageIcon },
      { id: "ai", label: "VMatch AI", icon: Bot },
      { id: "settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

const projects: Project[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    type: "Kitchen Set",
    location: "Bandung",
    stage: "production",
    stageLabel: "Produksi",
    progress: 68,
    timeline: [
      { title: "Request diterima", date: "15 Mei 2026", description: "Tim VMatch sudah menerima brief kamu.", done: true },
      { title: "Konsultasi & penyesuaian", date: "18 Mei 2026", description: "Meeting selesai, brief disesuaikan.", done: true },
      { title: "Estimasi & pembayaran DP", date: "20 Mei 2026", description: "DP 50% sudah dibayar.", done: true },
      { title: "Produksi", date: "24 Mei 2026", description: "Modul utama sedang diproduksi oleh vendor.", image: "/figma/benefits-kitchen.webp", done: false },
      { title: "Instalasi", date: "Estimasi Juli 2026", description: "Pemasangan di lokasi.", done: false },
      { title: "Selesai", date: "-", description: "Proyek selesai.", done: false },
    ],
    files: [
      { name: "RAB Kitchen Set Walnut.pdf", type: "RAB", date: "20 Mei 2026" },
      { name: "Foto Progress Minggu 1.jpg", type: "Progress", date: "26 Mei 2026" },
    ],
  },
  {
    id: "2",
    name: "Wardrobe Minimalis",
    type: "Wardrobe",
    location: "Semarang",
    stage: "consultation",
    stageLabel: "Konsultasi",
    progress: 20,
    timeline: [
      { title: "Request diterima", date: "12 Mei 2026", description: "Brief sudah masuk, menunggu jadwal meeting.", done: true },
      { title: "Konsultasi & penyesuaian", date: "Menunggu", description: "Jadwal meeting sedang diatur.", done: false },
    ],
    files: [
      { name: "Referensi Wardrobe.png", type: "Referensi", date: "12 Mei 2026" },
    ],
  },
  {
    id: "3",
    name: "Backdrop TV Modern",
    type: "Backdrop TV",
    location: "Jakarta",
    stage: "done",
    stageLabel: "Selesai",
    progress: 100,
    timeline: [
      { title: "Request diterima", date: "1 Mar 2026", description: "Brief sudah masuk.", done: true },
      { title: "Konsultasi & penyesuaian", date: "3 Mar 2026", description: "Meeting selesai.", done: true },
      { title: "Estimasi & pembayaran DP", date: "5 Mar 2026", description: "DP lunas.", done: true },
      { title: "Produksi", date: "8 Mar 2026", description: "Produksi selesai.", done: true },
      { title: "Instalasi", date: "15 Mar 2026", description: "Pemasangan selesai.", done: true },
      { title: "Selesai", date: "15 Mar 2026", description: "Proyek complete.", done: true },
    ],
    files: [
      { name: "Invoice Final.pdf", type: "Invoice", date: "20 Mar 2026" },
    ],
  },
];

const meetings: Meeting[] = [
  { id: "1", projectName: "Kitchen Set Walnut", date: "22 Mei 2026", time: "13:00 WIB", agenda: "Review progress produksi minggu ke-2", status: "confirmed", meetingUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "2", projectName: "Wardrobe Minimalis", date: "28 Mei 2026", time: "10:00 WIB", agenda: "Diskusi kebutuhan dan preferensi material", status: "requested" },
  { id: "3", date: "10 Mei 2026", time: "14:00 WIB", agenda: "Konsultasi umum tentang renovasi rumah", status: "done", notes: "Disarankan mulai dari kitchen set, budget Rp80-100jt. Akan dibuatkan brief setelah client siap." },
];

const invoices: Invoice[] = [
  { id: "1", projectName: "Kitchen Set Walnut", description: "DP 50% Kitchen Set Walnut", amount: "Rp47.500.000", status: "paid", dueDate: "20 Mei 2026" },
  { id: "2", projectName: "Kitchen Set Walnut", description: "Pelunasan 50% Kitchen Set Walnut", amount: "Rp47.500.000", status: "pending", dueDate: "15 Jul 2026" },
  { id: "3", projectName: "Backdrop TV Modern", description: "Full Payment Backdrop TV", amount: "Rp28.000.000", status: "paid", dueDate: "5 Mar 2026" },
];

// ─── Main ────────────────────────────────────────────────────────────────────

export default function UserDashboardPage() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeMenu = useMemo(
    () => menuGroups.flatMap(g => g.items).find((item) => item.id === activePage) ?? menuGroups[0].items[0],
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
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="font-serif text-[22px] italic text-[#3D3530]">VMatch</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="grid h-7 w-7 place-items-center rounded-full text-[#8B8179] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Tutup">
            <X size={14} />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 pt-2">
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
                    <button
                      key={item.id}
                      onClick={() => changePage(item.id)}
                      className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#6B5B52]/10 text-[#6B5B52]" : "text-[#7A7067] hover:bg-[#F5F0EA] hover:text-[#3D3530]"}`}
                    >
                      <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

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
      <section className={`flex flex-col lg:pl-[250px] ${activePage === "ai" ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]"}`}>
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden" aria-label="Menu">
            <Menu size={18} />
          </button>
          <p className="flex-1 text-[13px] font-medium text-[#7A7067]">{activeMenu.label}</p>
          <button className="grid h-8 w-8 place-items-center rounded-full text-[#7A7067] transition hover:bg-[#F0EBE4]" aria-label="Notifikasi">
            <Bell size={17} />
          </button>
        </header>

        {activePage === "ai" ? (
          <AiChatView />
        ) : (
          <div className="w-full px-5 py-6 sm:px-6 lg:px-8">
            {activePage === "dashboard" && <DashboardView onChangePage={changePage} />}
            {activePage === "ajukan" && <NewProjectForm />}
            {activePage === "proyek" && <ProyekView />}
            {activePage === "meeting" && <MeetingView />}
            {activePage === "pembayaran" && <PembayaranView />}
            {activePage === "selection" && <SelectionBoard />}
            {activePage === "change-order" && <ChangeOrderView />}
            {activePage === "garansi" && <WarrantyTracking />}
            {activePage === "dokumen" && <DokumenView />}
            {activePage === "katalog" && <CatalogDesign onChangePage={changePage as (page: string) => void} />}
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
  const activeProjects = projects.filter((p) => p.stage !== "done");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const upcomingMeetings = meetings.filter((m) => m.status === "confirmed" || m.status === "requested");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Selamat datang</h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">Pantau proyek, jadwal meeting, dan pembayaran kamu.</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickCard icon={FolderOpen} label="Proyek Aktif" value={String(activeProjects.length)} onClick={() => onChangePage("proyek")} />
        <QuickCard icon={CalendarDays} label="Meeting" value={String(upcomingMeetings.length)} onClick={() => onChangePage("meeting")} />
        <QuickCard icon={CreditCard} label="Invoice Pending" value={String(pendingInvoices.length)} onClick={() => onChangePage("pembayaran")} />
        <QuickCard icon={Plus} label="Proyek Baru" value="Ajukan" onClick={() => onChangePage("ajukan")} accent />
      </div>

      {/* Active projects */}
      {activeProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#3D3530]">Proyek Aktif</h2>
            <button onClick={() => onChangePage("proyek")} className="text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">Lihat semua →</button>
          </div>
          <div className="mt-3 space-y-2.5">
            {activeProjects.map((project) => (
              <article key={project.id} onClick={() => onChangePage("proyek")} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all duration-200 hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                      <StatusPill status={project.stageLabel} />
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
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Notifications / recent */}
      <section>
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi Terbaru</h2>
        <div className="mt-3 rounded-xl border border-[#E8E2D9] bg-white">
          {[
            { text: "Meeting dikonfirmasi: Kitchen Set Walnut", sub: "22 Mei 2026, 13:00 WIB", type: "meeting" },
            { text: "Progress update: Modul utama sedang diproduksi", sub: "Kitchen Set Walnut · 24 Mei 2026", type: "progress" },
            { text: "Invoice pelunasan dikirim", sub: "Kitchen Set Walnut · Rp47.5jt", type: "invoice" },
          ].map((notif, i, arr) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F0EBE4]" : ""}`}>
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6B5B52]" />
              <div>
                <p className="text-[13px] font-medium text-[#3D3530]">{notif.text}</p>
                <p className="mt-0.5 text-[11px] text-[#8B8179]">{notif.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Ajukan Proyek (Single Page Form) ────────────────────────────────────────

function NewProjectForm() {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Ajukan Proyek Baru</h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">Isi form selengkap mungkin agar tim VMatch bisa menyusun solusi yang tepat untuk kamu.</p>
      </div>

      {/* Section A — Informasi Proyek */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Informasi Proyek</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Jenis proyek dan lokasi pengerjaan.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Nama proyek *">
            <input className="field-control" placeholder="Contoh: Kitchen Set Dapur Utama" />
          </FormField>
          <FormField label="Jenis proyek *">
            <select className="field-control">
              <option value="">Pilih jenis proyek</option>
              <option>Kitchen Set</option>
              <option>Wardrobe / Lemari</option>
              <option>Ruang Tamu</option>
              <option>Kamar Tidur</option>
              <option>Backdrop TV</option>
              <option>Full Interior</option>
              <option>Lainnya</option>
            </select>
          </FormField>
          <FormField label="Tipe properti *">
            <select className="field-control">
              <option value="">Pilih tipe properti</option>
              <option>Rumah</option>
              <option>Apartemen</option>
              <option>Kantor</option>
              <option>Kos-kosan</option>
              <option>Hotel</option>
              <option>Lainnya</option>
            </select>
          </FormField>
          <FormField label="Kota / Lokasi *">
            <input className="field-control" placeholder="Contoh: Bandung, Jawa Barat" />
          </FormField>
          <FormField label="Status properti">
            <select className="field-control">
              <option>Sudah ditempati</option>
              <option>Baru / belum ditempati</option>
              <option>Sedang renovasi</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Section B — Detail Ruangan */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Detail Ruangan</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Ukuran, kondisi, dan kebutuhan spesifik ruangan.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Ukuran ruangan">
            <input className="field-control" placeholder="Contoh: 3 x 4 meter" />
          </FormField>
          <FormField label="Tinggi plafon">
            <input className="field-control" placeholder="Contoh: 2.8 meter" />
          </FormField>
          <FormField label="Kondisi ruangan">
            <select className="field-control">
              <option>Kosong</option>
              <option>Ada furniture lama</option>
              <option>Sebagian sudah ada</option>
            </select>
          </FormField>
          <FormField label="Akses lokasi">
            <select className="field-control">
              <option>Mudah (jalan lebar)</option>
              <option>Sedang (gang kecil)</option>
              <option>Apartemen (lift barang)</option>
            </select>
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Masalah yang ingin diselesaikan">
            <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Ruangan sempit tapi butuh banyak storage, ingin terlihat luas..." />
          </FormField>
        </div>
      </div>

      {/* Section C — Preferensi Desain */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Preferensi Desain</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Bantu kami memahami selera dan prioritas kamu.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Gaya desain">
            <select className="field-control">
              <option value="">Pilih gaya</option>
              <option>Modern Minimalis</option>
              <option>Japandi</option>
              <option>Scandinavian</option>
              <option>Industrial</option>
              <option>Classic / Luxury</option>
              <option>Belum tahu</option>
            </select>
          </FormField>
          <FormField label="Material preferensi">
            <select className="field-control">
              <option value="">Pilih material</option>
              <option>HPL</option>
              <option>Veneer kayu asli</option>
              <option>Solid wood</option>
              <option>Kombinasi</option>
              <option>Belum tahu</option>
            </select>
          </FormField>
          <FormField label="Warna dominan (opsional)">
            <input className="field-control" placeholder="Contoh: Putih, kayu muda, abu-abu" />
          </FormField>
          <FormField label="Prioritas utama">
            <select className="field-control">
              <option value="">Apa yang paling penting?</option>
              <option>Harga terjangkau</option>
              <option>Kualitas premium</option>
              <option>Desain unik</option>
              <option>Kecepatan pengerjaan</option>
              <option>Storage maksimal</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Section D — Budget & Timeline */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Budget & Timeline</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Estimasi budget dan kapan ingin dimulai.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Estimasi budget *">
            <select className="field-control">
              <option value="">Pilih range budget</option>
              <option>Di bawah Rp30 juta</option>
              <option>Rp30–60 juta</option>
              <option>Rp60–100 juta</option>
              <option>Rp100–150 juta</option>
              <option>Di atas Rp150 juta</option>
            </select>
          </FormField>
          <FormField label="Target mulai pengerjaan">
            <select className="field-control">
              <option>Secepatnya</option>
              <option>1–2 minggu lagi</option>
              <option>1 bulan lagi</option>
              <option>Fleksibel</option>
            </select>
          </FormField>
          <FormField label="Deadline selesai">
            <select className="field-control">
              <option>Fleksibel</option>
              <option>Dalam 1 bulan</option>
              <option>Dalam 2 bulan</option>
              <option>Dalam 3 bulan</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Section E — Referensi Visual */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Referensi Visual</h2>
        <p className="mt-1 text-[12px] text-[#8B8179]">Upload foto inspirasi atau referensi desain (opsional, maks 5 gambar).</p>
        <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#D4C9BD] bg-[#F8F6F2] p-8 text-center transition hover:border-[#6B5B52] hover:bg-[#F5F0EA]">
          <Camera size={24} className="text-[#8B8179]" />
          <span className="mt-2 text-[13px] font-medium text-[#3D3530]">Klik untuk upload gambar</span>
          <span className="mt-1 text-[11px] text-[#8B8179]">JPG, PNG, WEBP — maks 10MB per file</span>
          <input type="file" multiple accept="image/*" className="sr-only" />
        </label>
        <div className="mt-4">
          <FormField label="Catatan tambahan">
            <textarea rows={3} className="field-control resize-none" placeholder="Ada hal lain yang ingin disampaikan ke tim VMatch?" />
          </FormField>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button className="h-10 rounded-lg border border-[#E8E2D9] px-6 text-[13px] font-medium text-[#3D3530] transition hover:bg-[#F0EBE4]">
          Simpan Draft
        </button>
        <button className="h-10 rounded-lg bg-[#6B5B52] px-6 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]">
          Submit Proyek
        </button>
      </div>
    </div>
  );
}

// ─── Proyek Saya ─────────────────────────────────────────────────────────────

type FilterTab = "semua" | "aktif" | "selesai";

function ProyekView() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("semua");

  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "aktif": return projects.filter((p) => p.stage !== "done");
      case "selesai": return projects.filter((p) => p.stage === "done");
      default: return projects;
    }
  }, [activeFilter]);

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "semua", label: "Semua", count: projects.length },
    { id: "aktif", label: "Aktif", count: projects.filter((p) => p.stage !== "done").length },
    { id: "selesai", label: "Selesai", count: projects.filter((p) => p.stage === "done").length },
  ];

  if (selectedProject) return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Proyek Saya</h1>

      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        {filterTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeFilter === tab.id ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067] hover:text-[#3D3530]"}`}>
            {tab.label} <span className="ml-1 text-[11px] opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D4C9BD] py-12 text-center">
          <p className="text-[14px] text-[#8B8179]">Tidak ada proyek di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProjects.map((project) => (
            <article key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all duration-200 hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                    <StatusPill status={project.stageLabel} />
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
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
        <ChevronRight size={14} className="rotate-180" /> Kembali
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] leading-tight text-[#3D3530] sm:text-[32px]">{project.name}</h1>
          <p className="mt-1 text-[13px] text-[#8B8179]">{project.type} · {project.location}</p>
        </div>
        <StatusPill status={project.stageLabel} />
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#7A7067]">Progress</span>
          <span className="font-semibold text-[#3D3530]">{project.progress}%</span>
        </div>
        <div className="mt-2.5 h-2 rounded-full bg-[#EDE8E1]">
          <div className="h-full rounded-full bg-[#6B5B52] transition-all duration-700" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Timeline (progress only, no review buttons) */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-semibold text-[#3D3530]">Timeline Proyek</h3>
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
                {entry.image && (
                  <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-[#F0EBE4]">
                    <img src={entry.image} alt={entry.title} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="mb-3 text-[14px] font-semibold text-[#3D3530]">Dokumen & File</h3>
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
        ) : (
          <p className="text-[13px] text-[#8B8179]">Belum ada file.</p>
        )}
      </div>
    </div>
  );
}

// ─── Meeting / Konsultasi ────────────────────────────────────────────────────

function MeetingView() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Konsultasi</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Ajukan meeting kapan saja, sebelum atau sesudah membuat proyek.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} />
          <span className="hidden sm:inline">Ajukan Meeting</span>
        </button>
      </div>

      {/* New meeting form */}
      {showForm && (
        <div className="rounded-xl border border-[#6B5B52]/20 bg-white p-5">
          <h3 className="text-[15px] font-semibold text-[#3D3530]">Ajukan Meeting Baru</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Proyek terkait (opsional)">
              <select className="field-control">
                <option value="">Konsultasi Umum</option>
                {projects.filter(p => p.stage !== "done").map(p => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Tanggal *">
              <input type="date" className="field-control" />
            </FormField>
            <FormField label="Waktu *">
              <select className="field-control">
                <option>09:00 WIB</option>
                <option>10:00 WIB</option>
                <option>11:00 WIB</option>
                <option>13:00 WIB</option>
                <option>14:00 WIB</option>
                <option>15:00 WIB</option>
                <option>16:00 WIB</option>
              </select>
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Agenda / hal yang ingin dibahas *">
              <textarea rows={3} className="field-control resize-none" placeholder="Contoh: Diskusi kebutuhan kitchen set, konsultasi budget..." />
            </FormField>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067] transition hover:bg-[#F0EBE4]">Batal</button>
            <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">Kirim Request</button>
          </div>
        </div>
      )}

      {/* Meeting list */}
      <div className="space-y-2.5">
        {meetings.map((m) => (
          <div key={m.id} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#3D3530]">{m.projectName || "Konsultasi Umum"}</p>
                  <p className="text-[12px] text-[#8B8179]">{m.date}, {m.time}</p>
                  <p className="mt-1 text-[12px] text-[#7A7067]">{m.agenda}</p>
                  {m.meetingUrl && m.status === "confirmed" && (
                    <a href={m.meetingUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] hover:underline">
                      🔗 Join Google Meet
                    </a>
                  )}
                  {m.notes && (
                    <div className="mt-2 rounded-lg bg-[#F8F6F2] px-3 py-2">
                      <p className="text-[11px] font-medium text-[#6B5B52]">Catatan hasil meeting:</p>
                      <p className="mt-0.5 text-[12px] text-[#7A7067]">{m.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <MeetingStatusPill status={m.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pembayaran ──────────────────────────────────────────────────────────────

function PembayaranView() {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Pembayaran</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Invoice dari tim VMatch. Upload bukti pembayaran setelah transfer.</p>
      </div>

      <div className="space-y-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="rounded-xl border border-[#E8E2D9] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[#3D3530]">{inv.description}</p>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{inv.projectName} · Jatuh tempo: {inv.dueDate}</p>
              </div>
              <InvoiceStatusPill status={inv.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[20px] font-semibold text-[#3D3530]">{inv.amount}</p>
              {inv.status === "pending" && (
                <button onClick={() => setUploadingId(inv.id)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
                  <Upload size={14} />
                  Upload Bukti
                </button>
              )}
              {inv.status === "awaiting_verification" && (
                <span className="flex items-center gap-1.5 text-[12px] text-amber-600">
                  <Clock size={13} /> Menunggu verifikasi admin
                </span>
              )}
              {inv.status === "paid" && (
                <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                  <CheckCircle2 size={13} /> Lunas
                </span>
              )}
            </div>

            {/* Upload modal inline */}
            {uploadingId === inv.id && (
              <div className="mt-4 rounded-lg border border-[#E8E2D9] bg-[#F8F6F2] p-4">
                <p className="text-[13px] font-medium text-[#3D3530]">Upload bukti transfer</p>
                <label className="mt-3 flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-[#D4C9BD] bg-white p-6 transition hover:border-[#6B5B52]">
                  <Camera size={20} className="text-[#8B8179]" />
                  <span className="mt-2 text-[12px] font-medium text-[#3D3530]">Pilih foto bukti transfer</span>
                  <span className="mt-0.5 text-[11px] text-[#8B8179]">JPG, PNG — maks 5MB</span>
                  <input type="file" accept="image/*" className="sr-only" />
                </label>
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => setUploadingId(null)} className="h-8 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#7A7067]">Batal</button>
                  <button className="h-8 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white">Kirim Bukti</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dokumen ─────────────────────────────────────────────────────────────────

function DokumenView() {
  const allFiles = projects.flatMap((p) => p.files.map((f) => ({ ...f, projectName: p.name })));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Dokumen</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Semua file dan dokumen terkait proyek kamu.</p>
      </div>

      {allFiles.length > 0 ? (
        <div className="space-y-2">
          {allFiles.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-[#E8E2D9] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#6B5B52]" />
                <div>
                  <p className="text-[13px] font-medium text-[#3D3530]">{file.name}</p>
                  <p className="text-[11px] text-[#8B8179]">{file.projectName} · {file.type} · {file.date}</p>
                </div>
              </div>
              <button className="text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">Download</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D4C9BD] py-12 text-center">
          <p className="text-[14px] text-[#8B8179]">Belum ada dokumen.</p>
        </div>
      )}
    </div>
  );
}

// ─── AI Chat (VMatch Helper) ─────────────────────────────────────────────────

type ChatMessage = { from: "ai" | "user"; text: string; images?: { src: string; label: string }[] };

function AiChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => {
    const all = ["Kitchen set minimalis", "Budget kamar tidur", "Gaya Japandi", "Wardrobe custom", "Desain ruang tamu kecil", "Interior apartemen studio"];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 4);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const parseAiContent = (text: string): { cleanText: string; images: { src: string; label: string }[] } => {
    const images: { src: string; label: string }[] = [];
    let cleanText = text.replace(/\[IMG:(\/[^\]|]+)\|([^\]]+)\]/g, (_, src, label) => { images.push({ src, label }); return ""; });
    cleanText = cleanText.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    return { cleanText: cleanText.trim(), images };
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }, { from: "ai", text: "" }]);
    setIsLoading(true);
    try {
      const currentMessages = [...messages, { from: "user" as const, text: userMessage }];
      const chatHistory = currentMessages.map((m) => ({ role: m.from === "ai" ? "assistant" : "user", content: m.text }));
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: chatHistory }) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.replace(/^data: /, "").trim();
          if (!trimmed || trimmed === "[DONE]") continue;
          try { const json = JSON.parse(trimmed); if (json.content) { fullText += json.content; const { cleanText, images } = parseAiContent(fullText); setMessages((prev) => { const updated = [...prev]; updated[updated.length - 1] = { from: "ai", text: cleanText || fullText, images: images.length > 0 ? images : undefined }; return updated; }); } } catch { /* skip */ }
        }
      }
      const { cleanText, images } = parseAiContent(fullText);
      setMessages((prev) => { const updated = [...prev]; updated[updated.length - 1] = { from: "ai", text: cleanText || fullText, images: images.length > 0 ? images : undefined }; return updated; });
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "Maaf, terjadi gangguan koneksi. Coba lagi dalam beberapa saat." }]);
    } finally { setIsLoading(false); }
  };

  const handleSubmit = () => sendMessage(input.trim());
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <h1 className="text-center font-serif text-[28px] text-[#3D3530] sm:text-[32px]">Ada yang bisa dibantu?</h1>
          <div className="mt-6 w-full max-w-[600px]">
            <div className="rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Tanya soal desain interior..." disabled={isLoading} className="w-full bg-transparent px-5 pb-3 pt-4 text-[15px] text-[#3D3530] outline-none placeholder:text-[#B8B2AA]" />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-[11px] text-[#B8B2AA]">VMatch AI</span>
                <button onClick={handleSubmit} disabled={!input.trim() || isLoading} className="grid h-8 w-8 place-items-center rounded-lg bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:opacity-30"><Send size={14} /></button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (<button key={s} onClick={() => sendMessage(s)} className="rounded-full border border-[#E8E2D9] bg-white px-3.5 py-1.5 text-[12px] text-[#7A7067] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">{s}</button>))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[700px] px-5 py-6 sm:px-6">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-6 ${msg.from === "user" ? "flex justify-end" : ""}`}>
                  {msg.from === "user" ? (
                    <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[#6B5B52] px-4 py-2.5 text-[14px] leading-relaxed text-white break-words">{msg.text}</div>
                  ) : (
                    <div className="max-w-[90%]">
                      {msg.text ? <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#3D3530]">{msg.text}</p> : isLoading && i === messages.length - 1 ? <p className="text-[14px] text-[#8B8179] animate-pulse">Sedang menyusun jawaban...</p> : null}
                      {msg.images && msg.images.length > 0 && (<div className="mt-4 flex gap-3 overflow-x-auto">{msg.images.map((img, imgIdx) => (<div key={imgIdx} className="shrink-0"><div className="h-[140px] w-[200px] overflow-hidden rounded-xl border border-[#E8E2D9]"><img src={img.src} alt={img.label} className="h-full w-full object-cover" /></div><p className="mt-1.5 text-[11px] text-[#8B8179]">{img.label}</p></div>))}</div>)}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="shrink-0 px-5 pb-5 sm:px-6">
            <div className="mx-auto max-w-[700px]">
              <div className="rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_-2px_16px_rgba(0,0,0,0.03)]">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Tulis pesan..." disabled={isLoading} className="w-full bg-transparent px-5 pb-3 pt-4 text-[15px] text-[#3D3530] outline-none disabled:opacity-50 placeholder:text-[#B8B2AA]" />
                <div className="flex items-center justify-between px-5 pb-3">
                  <span className="text-[11px] text-[#B8B2AA]">VMatch AI</span>
                  <button onClick={handleSubmit} disabled={!input.trim() || isLoading} className="grid h-8 w-8 place-items-center rounded-lg bg-[#6B5B52] text-white transition hover:bg-[#5A4A42] disabled:opacity-30"><Send size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
          <FormField label="Nama lengkap"><input className="field-control" defaultValue="Customer VMatch" /></FormField>
          <FormField label="Email"><input className="field-control cursor-not-allowed bg-[#F5F0EA] text-[#8B8179]" defaultValue="customer@email.com" disabled /></FormField>
          <FormField label="Nomor WhatsApp *"><input className="field-control" defaultValue="081234567890" placeholder="Wajib diisi" /></FormField>
          <FormField label="Alamat"><input className="field-control" defaultValue="Bandung, Jawa Barat" /></FormField>
        </div>
        <button className="mt-4 h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">Simpan</button>
      </div>
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi</h2>
        <div className="mt-4 space-y-2">
          <ToggleRow label="Update proyek" desc="Notifikasi saat ada progress baru" defaultOn />
          <ToggleRow label="Meeting reminder" desc="Reminder H-1 sebelum meeting" defaultOn />
          <ToggleRow label="Invoice baru" desc="Notifikasi saat invoice dikirim" defaultOn />
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function QuickCard({ icon: Icon, label, value, onClick, accent }: { icon: LucideIcon; label: string; value: string; onClick: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${accent ? "border-[#6B5B52]/20 bg-[#6B5B52] text-white hover:bg-[#5A4A42]" : "border-[#E8E2D9] bg-white hover:border-[#D4C9BD]"}`}>
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-white/15" : "bg-[#F5F0EA] text-[#6B5B52]"}`}><Icon size={16} /></div>
      <p className={`mt-3 text-[18px] font-semibold leading-none ${accent ? "" : "text-[#3D3530]"}`}>{value}</p>
      <p className={`mt-1 text-[12px] ${accent ? "text-white/70" : "text-[#8B8179]"}`}>{label}</p>
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status.includes("Selesai") || status.includes("Lunas") ? "bg-emerald-50 text-emerald-700" : status.includes("Menunggu") || status.includes("Request") ? "bg-amber-50 text-amber-700" : "bg-[#F5F0EA] text-[#6B5B52]";
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{status}</span>;
}

function MeetingStatusPill({ status }: { status: Meeting["status"] }) {
  const map = { requested: { label: "Menunggu Konfirmasi", color: "bg-amber-50 text-amber-700" }, confirmed: { label: "Dikonfirmasi", color: "bg-emerald-50 text-emerald-700" }, done: { label: "Selesai", color: "bg-[#F0EBE4] text-[#6B5B52]" }, cancelled: { label: "Dibatalkan", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}

function InvoiceStatusPill({ status }: { status: Invoice["status"] }) {
  const map = { pending: { label: "Menunggu Pembayaran", color: "bg-amber-50 text-amber-700" }, awaiting_verification: { label: "Verifikasi Pending", color: "bg-blue-50 text-blue-700" }, paid: { label: "Lunas", color: "bg-emerald-50 text-emerald-700" }, rejected: { label: "Ditolak", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
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
