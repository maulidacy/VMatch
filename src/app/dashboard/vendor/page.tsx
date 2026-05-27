"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FolderOpen,
  HardHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Upload,
  UserRound,
  Users2,
  X,
  Camera,
  FileText,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DailyLog } from "./components/daily-log";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageId = "dashboard" | "proyek" | "tukang" | "absensi" | "daily-log" | "settings";

type MenuItem = { id: PageId; label: string; icon: LucideIcon };

type VendorProject = {
  id: string;
  name: string;
  customer: string;
  type: string;
  location: string;
  status: string;
  progress: number;
  deadline: string;
  timeline: { title: string; date: string; description: string; image?: string; done: boolean; author: string }[];
  notes: string[];
};

type Worker = {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: "active" | "inactive";
};

type AttendanceRecord = {
  date: string;
  projectId: string;
  records: { workerId: string; present: boolean; note?: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
  { id: "daily-log", label: "Daily Log", icon: BookOpen },
  { id: "tukang", label: "Tim / Tukang", icon: Users2 },
  { id: "absensi", label: "Absensi", icon: ClipboardCheck },
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
    label: "Pekerjaan",
    items: [
      { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
      { id: "daily-log", label: "Daily Log", icon: BookOpen },
    ],
  },
  {
    label: "Tim",
    items: [
      { id: "tukang", label: "Tukang", icon: Users2 },
      { id: "absensi", label: "Absensi", icon: ClipboardCheck },
    ],
  },
  {
    label: "",
    items: [
      { id: "settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

const vendorProjects: VendorProject[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    customer: "Mira H.",
    type: "Kitchen Set",
    location: "Bandung",
    status: "Produksi",
    progress: 68,
    deadline: "15 Jul 2026",
    timeline: [
      { title: "Mulai produksi", date: "24 Mei 2026", description: "Modul bawah dan atas mulai dikerjakan.", author: "Vendor", done: true },
      { title: "Modul bawah selesai", date: "28 Mei 2026", description: "4 modul bawah sudah selesai finishing.", image: "/figma/benefits-kitchen.webp", author: "Vendor", done: true },
      { title: "Modul atas", date: "Sedang dikerjakan", description: "3 modul atas sedang dalam proses.", author: "Vendor", done: false },
    ],
    notes: ["Handle pakai push-to-open, bukan handle biasa", "Warna HPL: Walnut W-2204", "LED strip di bawah kabinet atas"],
  },
  {
    id: "2",
    name: "Wardrobe Built-in Apartemen",
    customer: "Kevin A.",
    type: "Wardrobe",
    location: "Tangerang",
    status: "Menunggu DP",
    progress: 0,
    deadline: "TBD",
    timeline: [],
    notes: ["Akses via lift barang, koordinasi dengan building management"],
  },
];

const workers: Worker[] = [
  { id: "1", name: "Pak Joko", phone: "0812xxxx", specialization: "Kayu", status: "active" },
  { id: "2", name: "Mas Andi", phone: "0857xxxx", specialization: "Cat & Finishing", status: "active" },
  { id: "3", name: "Pak Budi", phone: "0878xxxx", specialization: "Kayu", status: "active" },
  { id: "4", name: "Mas Rudi", phone: "0813xxxx", specialization: "Listrik", status: "active" },
  { id: "5", name: "Pak Slamet", phone: "0856xxxx", specialization: "Umum", status: "inactive" },
];

// Mock attendance for current month
const generateAttendance = (): { date: string; workers: { id: string; present: boolean }[] }[] => {
  const records = [];
  for (let day = 1; day <= 27; day++) {
    const dateStr = `${day} Mei 2026`;
    const dayOfWeek = new Date(2026, 4, day).getDay();
    if (dayOfWeek === 0) continue; // Skip Sunday
    records.push({
      date: dateStr,
      workers: workers.filter(w => w.status === "active").map(w => ({
        id: w.id,
        present: Math.random() > 0.15, // 85% attendance rate
      })),
    });
  }
  return records;
};

const attendanceData = generateAttendance();

// ─── Main ────────────────────────────────────────────────────────────────────

export default function VendorDashboard() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeMenu = useMemo(() => menuItems.find((item) => item.id === activePage) ?? menuItems[0], [activePage]);

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
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B5B52]">Vendor Panel</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button key={item.id} onClick={() => changePage(item.id)} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${active ? "bg-[#6B5B52]/10 text-[#6B5B52]" : "text-[#7A7067] hover:bg-[#F5F0EA] hover:text-[#3D3530]"}`}>
                <Icon size={17} strokeWidth={active ? 2 : 1.6} />{item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-[#E8E2D9] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6B5B52] text-white"><HardHat size={14} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#3D3530]">Aruna Woodwork</p>
              <p className="truncate text-[11px] text-[#8B8179]">aruna@email.com</p>
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
          {activePage === "dashboard" && <VendorDashboardView onChangePage={changePage} />}
          {activePage === "proyek" && <VendorProyekView />}
          {activePage === "daily-log" && <DailyLog />}
          {activePage === "tukang" && <TukangView />}
          {activePage === "absensi" && <AbsensiView />}
          {activePage === "settings" && <VendorSettingsView />}
        </div>
      </section>
    </main>
  );
}

// ─── Vendor Dashboard Overview ───────────────────────────────────────────────

function VendorDashboardView({ onChangePage }: { onChangePage: (p: PageId) => void }) {
  const activeProjects = vendorProjects.filter(p => p.progress > 0 && p.progress < 100);
  const activeWorkers = workers.filter(w => w.status === "active");
  const todayAttendance = attendanceData[attendanceData.length - 1];
  const presentToday = todayAttendance?.workers.filter(w => w.present).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Dashboard Vendor</h1>
        <p className="mt-1.5 text-[14px] text-[#7A7067]">Kelola proyek, tim, dan absensi harian.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderOpen} label="Proyek Aktif" value={String(activeProjects.length)} onClick={() => onChangePage("proyek")} />
        <StatCard icon={Users2} label="Tukang Aktif" value={String(activeWorkers.length)} onClick={() => onChangePage("tukang")} />
        <StatCard icon={ClipboardCheck} label="Hadir Hari Ini" value={`${presentToday}/${activeWorkers.length}`} onClick={() => onChangePage("absensi")} />
        <StatCard icon={CalendarDays} label="Deadline Terdekat" value="15 Jul" onClick={() => onChangePage("proyek")} />
      </div>

      {/* Active projects */}
      <section>
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Proyek Aktif</h2>
        <div className="mt-3 space-y-2.5">
          {vendorProjects.map((project) => (
            <article key={project.id} onClick={() => onChangePage("proyek")} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                    <StatusPill status={project.status} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.type} · {project.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  {project.progress > 0 && (
                    <div className="hidden w-20 sm:block">
                      <div className="h-1.5 rounded-full bg-[#EDE8E1]"><div className="h-full rounded-full bg-[#6B5B52]" style={{ width: `${project.progress}%` }} /></div>
                      <p className="mt-1 text-right text-[11px] text-[#8B8179]">{project.progress}%</p>
                    </div>
                  )}
                  <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Notifikasi</h2>
        <div className="mt-3 rounded-xl border border-[#E8E2D9] bg-white">
          {[
            { text: "Proyek baru di-assign: Wardrobe Built-in Apartemen", sub: "Dari Admin · 26 Mei 2026" },
            { text: "Deadline reminder: Kitchen Set Walnut", sub: "15 Jul 2026 · 49 hari lagi" },
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

// ─── Vendor Proyek ───────────────────────────────────────────────────────────

function VendorProyekView() {
  const [selectedProject, setSelectedProject] = useState<VendorProject | null>(null);

  if (selectedProject) return <VendorProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Proyek Saya</h1>
      <p className="text-[14px] text-[#7A7067]">Proyek yang di-assign oleh admin VMatch ke workshop kamu.</p>

      <div className="space-y-2.5">
        {vendorProjects.map((project) => (
          <article key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition-all hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[14px] font-semibold text-[#3D3530]">{project.name}</h3>
                  <StatusPill status={project.status} />
                </div>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{project.customer} · {project.type} · Deadline: {project.deadline}</p>
              </div>
              <ChevronRight size={15} className="text-[#D4C9BD] transition group-hover:text-[#6B5B52]" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VendorProjectDetail({ project, onBack }: { project: VendorProject; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52] transition hover:text-[#5A4A42]">
        <ChevronRight size={14} className="rotate-180" /> Kembali
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] leading-tight text-[#3D3530] sm:text-[32px]">{project.name}</h1>
          <p className="mt-1 text-[13px] text-[#8B8179]">{project.customer} · {project.type} · {project.location}</p>
        </div>
        <StatusPill status={project.status} />
      </div>

      {/* Progress */}
      {project.progress > 0 && (
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#7A7067]">Progress</span>
            <span className="font-semibold text-[#3D3530]">{project.progress}%</span>
          </div>
          <div className="mt-2.5 h-2 rounded-full bg-[#EDE8E1]">
            <div className="h-full rounded-full bg-[#6B5B52]" style={{ width: `${project.progress}%` }} />
          </div>
          <p className="mt-2 text-[12px] text-[#8B8179]">Deadline: {project.deadline}</p>
        </div>
      )}

      {/* Notes from admin */}
      {project.notes.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="text-[13px] font-semibold text-amber-800">Catatan dari Admin</h3>
          <ul className="mt-2 space-y-1">
            {project.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-amber-700">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#3D3530]">Progress Update</h3>
          <button className="flex h-8 items-center gap-1.5 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
            <Plus size={13} /> Tambah Update
          </button>
        </div>

        {project.timeline.length > 0 ? (
          <div className="space-y-0">
            {project.timeline.map((entry, i) => (
              <div key={i} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div className={`mt-1 h-3 w-3 rounded-full border-2 ${entry.done ? "border-[#6B5B52] bg-[#6B5B52]" : "border-[#D4C9BD] bg-white"}`} />
                  {i < project.timeline.length - 1 && <div className="w-px flex-1 bg-[#E8E2D9]" />}
                </div>
                <div className="min-w-0 flex-1 pb-5">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#3D3530]">{entry.title}</p>
                    <span className="rounded bg-[#F0EBE4] px-1.5 py-0.5 text-[10px] font-medium text-[#6B5B52]">{entry.author}</span>
                  </div>
                  <p className="text-[11px] text-[#8B8179]">{entry.date}</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">{entry.description}</p>
                  {entry.image && <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-[#F0EBE4]"><img src={entry.image} alt={entry.title} className="h-full w-full object-cover" /></div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#8B8179]">Belum ada progress update. Mulai tambahkan saat produksi dimulai.</p>
        )}

        <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 text-[12px] font-medium text-[#8B8179] transition hover:border-[#6B5B52] hover:text-[#6B5B52]">
          <Camera size={14} /> Upload foto progress
          <input type="file" accept="image/*" className="sr-only" />
        </label>
      </div>
    </div>
  );
}

// ─── Tukang / Tim ────────────────────────────────────────────────────────────

function TukangView() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Tim / Tukang</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Kelola tukang yang bekerja di bawah workshop kamu.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Tambah Tukang
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#6B5B52]/20 bg-white p-5">
          <h3 className="text-[15px] font-semibold text-[#3D3530]">Daftarkan Tukang Baru</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Nama *"><input className="field-control" placeholder="Nama lengkap" /></FormField>
            <FormField label="No. WhatsApp *"><input className="field-control" placeholder="08xxxxxxxxxx" /></FormField>
            <FormField label="Keahlian *">
              <select className="field-control">
                <option value="">Pilih keahlian</option>
                <option>Kayu</option>
                <option>Cat & Finishing</option>
                <option>Listrik</option>
                <option>Plumbing</option>
                <option>Umum</option>
              </select>
            </FormField>
            <FormField label="Foto (opsional)">
              <input type="file" accept="image/*" className="field-control text-[12px]" />
            </FormField>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
            <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Simpan</button>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {workers.map((w) => (
          <div key={w.id} className="flex items-center justify-between rounded-xl border border-[#E8E2D9] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F5F0EA] text-[#6B5B52]">
                <UserRound size={18} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#3D3530]">{w.name}</p>
                <p className="text-[12px] text-[#8B8179]">{w.specialization} · {w.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${w.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {w.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
              <button className="text-[12px] font-medium text-[#6B5B52]">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Absensi ─────────────────────────────────────────────────────────────────

function AbsensiView() {
  const activeWorkers = workers.filter(w => w.status === "active");
  const [selectedDate] = useState("27 Mei 2026");

  // Calculate stats
  const totalDays = attendanceData.length;
  const avgAttendance = Math.round(
    attendanceData.reduce((acc, day) => {
      const present = day.workers.filter(w => w.present).length;
      return acc + (present / day.workers.length) * 100;
    }, 0) / totalDays
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Absensi Harian</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Catat kehadiran tukang per hari per proyek.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
          <p className="text-[11px] text-[#8B8179]">Rata-rata Kehadiran</p>
          <p className="mt-1 text-[24px] font-semibold text-[#3D3530]">{avgAttendance}%</p>
        </div>
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
          <p className="text-[11px] text-[#8B8179]">Total Hari Kerja (Mei)</p>
          <p className="mt-1 text-[24px] font-semibold text-[#3D3530]">{totalDays} hari</p>
        </div>
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
          <p className="text-[11px] text-[#8B8179]">Tukang Aktif</p>
          <p className="mt-1 text-[24px] font-semibold text-[#3D3530]">{activeWorkers.length} orang</p>
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#3D3530]">Kalender Kehadiran — Mei 2026</h3>
        <p className="mt-1 text-[12px] text-[#8B8179]">Hijau = semua hadir, Kuning = sebagian, Merah = banyak absen, Abu = libur</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-[#8B8179]">{d}</div>
          ))}
          {/* May 2026 starts on Friday (index 4) */}
          {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const dayOfWeek = new Date(2026, 4, day).getDay();
            const isSunday = dayOfWeek === 0;
            const record = attendanceData.find(r => r.date === `${day} Mei 2026`);
            let bgColor = "bg-gray-100"; // default: no data / holiday
            if (isSunday) {
              bgColor = "bg-gray-100";
            } else if (record) {
              const presentCount = record.workers.filter(w => w.present).length;
              const ratio = presentCount / record.workers.length;
              if (ratio >= 0.9) bgColor = "bg-emerald-200";
              else if (ratio >= 0.7) bgColor = "bg-amber-200";
              else bgColor = "bg-red-200";
            }
            return (
              <div key={day} className={`grid h-8 place-items-center rounded text-[11px] font-medium ${bgColor} ${day <= 27 ? "text-[#3D3530]" : "text-[#8B8179]"}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's attendance form */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#3D3530]">Absensi Hari Ini</h3>
            <p className="text-[12px] text-[#8B8179]">{selectedDate} · Kitchen Set Walnut</p>
          </div>
          <button className="h-8 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">Simpan Absensi</button>
        </div>
        <div className="mt-4 space-y-2">
          {activeWorkers.map((w) => (
            <label key={w.id} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] p-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#6B5B52]" />
                <div>
                  <p className="text-[13px] font-medium text-[#3D3530]">{w.name}</p>
                  <p className="text-[11px] text-[#8B8179]">{w.specialization}</p>
                </div>
              </div>
              <input className="h-7 w-32 rounded border border-[#E8E2D9] bg-white px-2 text-[11px] text-[#7A7067] outline-none" placeholder="Catatan (opsional)" />
            </label>
          ))}
        </div>
      </div>

      {/* Per-worker summary */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#3D3530]">Ringkasan Per Tukang (Mei 2026)</h3>
        <div className="mt-3 space-y-2">
          {activeWorkers.map((w) => {
            const workerDays = attendanceData.filter(d => d.workers.find(wr => wr.id === w.id && wr.present)).length;
            const percentage = Math.round((workerDays / totalDays) * 100);
            return (
              <div key={w.id} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-3 py-2.5">
                <div>
                  <p className="text-[13px] font-medium text-[#3D3530]">{w.name}</p>
                  <p className="text-[11px] text-[#8B8179]">{w.specialization} · {workerDays}/{totalDays} hari</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-[#EDE8E1]">
                    <div className={`h-full rounded-full ${percentage >= 85 ? "bg-emerald-500" : percentage >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[12px] font-medium text-[#3D3530]">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Settings ─────────────────────────────────────────────────────────

function VendorSettingsView() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Pengaturan</h1>
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#3D3530]">Profil Workshop</h2>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <FormField label="Nama usaha"><input className="field-control" defaultValue="Aruna Woodwork" /></FormField>
          <FormField label="Email"><input className="field-control" defaultValue="aruna@email.com" /></FormField>
          <FormField label="Nomor WhatsApp"><input className="field-control" defaultValue="081234567890" /></FormField>
          <FormField label="Alamat workshop"><input className="field-control" defaultValue="Semarang, Jawa Tengah" /></FormField>
          <FormField label="Keahlian utama">
            <input className="field-control" defaultValue="Kitchen Set, Wardrobe, Storage" />
          </FormField>
          <FormField label="Kapasitas proyek/bulan">
            <input className="field-control" defaultValue="3-4 proyek" />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Deskripsi workshop">
            <textarea rows={3} className="field-control resize-none" defaultValue="Workshop furniture custom dengan spesialisasi kitchen set dan wardrobe. Berpengalaman 8 tahun." />
          </FormField>
        </div>
        <button className="mt-4 h-9 rounded-lg bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">Simpan</button>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, onClick }: { icon: LucideIcon; label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-[#E8E2D9] bg-white p-4 text-left transition-all hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><Icon size={16} /></div>
        <p className="text-[12px] font-medium text-[#8B8179]">{label}</p>
      </div>
      <p className="mt-2.5 text-[24px] font-semibold leading-none text-[#3D3530]">{value}</p>
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status.includes("Selesai") ? "bg-emerald-50 text-emerald-700" : status.includes("Menunggu") ? "bg-amber-50 text-amber-700" : "bg-[#F5F0EA] text-[#6B5B52]";
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{status}</span>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">{label}</span>{children}</label>;
}
