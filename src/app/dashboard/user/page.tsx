"use client";

import {
  Bell,
  Bookmark,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  FolderOpen,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Pencil,
  RefreshCcw,
  Send,
  Star,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CatalogDesign } from "./components/catalog-design";

type PageId =
  | "dashboard"
  | "catalog"
  | "ai-ide"
  | "konsultasi"
  | "ajukan"
  | "request"
  | "solusi"
  | "proyek"
  | "revisi"
  | "files"
  | "notifikasi"
  | "review"
  | "profil";

type MenuItem = {
  id: PageId;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog", label: "Katalog Desain", icon: ImageIcon },
  { id: "ai-ide", label: "AI Ide", icon: BrainCircuit },
  { id: "konsultasi", label: "Konsultasi", icon: CalendarDays },
  { id: "ajukan", label: "Ajukan Proyek", icon: Pencil },
  { id: "request", label: "Request Saya", icon: ClipboardList },
  { id: "solusi", label: "Solusi Proyek", icon: FileText },
  { id: "proyek", label: "Proyek Saya", icon: Home },
  { id: "revisi", label: "Revisi", icon: MessageSquareText },
  { id: "files", label: "File Proyek", icon: FolderOpen },
  { id: "notifikasi", label: "Notifikasi", icon: Bell },
  { id: "review", label: "Review", icon: Star },
  { id: "profil", label: "Profil", icon: UserRound },
];

const stats = [
  { label: "Proyek Aktif", value: "1", note: "Kitchen Set Walnut" },
  { label: "Request Diproses", value: "2", note: "Sedang dianalisis" },
  { label: "Solusi Menunggu", value: "1", note: "Perlu persetujuan" },
  { label: "Revisi Ditangani", value: "1", note: "Diproses VMatch" },
];

const requests = [
  {
    name: "Kitchen Set Walnut",
    type: "Kitchen Set",
    date: "15 Mei 2026",
    location: "Bandung",
    budget: "Rp85–115 jt",
    status: "Solusi Dikirim",
  },
  {
    name: "Wardrobe Minimalis",
    type: "Wardrobe",
    date: "12 Mei 2026",
    location: "Semarang",
    budget: "Rp45–70 jt",
    status: "Sedang Dianalisis VMatch",
  },
];

const projects = [
  {
    name: "Kitchen Set Walnut",
    type: "Kitchen Set",
    location: "Bandung",
    start: "Mei 2026",
    end: "Juli 2026",
    status: "Produksi",
    progress: 68,
  },
  {
    name: "Japandi Living Room",
    type: "Ruang Tamu",
    location: "Jakarta Selatan",
    start: "Juni 2026",
    end: "Agustus 2026",
    status: "Perencanaan",
    progress: 24,
  },
];

const timeline = [
  {
    title: "Request Diterima",
    date: "15 Mei 2026",
    status: "Selesai",
    note: "Request proyek sudah diterima oleh tim VMatch.",
  },
  {
    title: "Perencanaan",
    date: "16 Mei 2026",
    status: "Selesai",
    note: "Tim menyusun kebutuhan ruang, budget, dan konsep awal.",
  },
  {
    title: "Koordinasi Vendor Partner",
    date: "18 Mei 2026",
    status: "Berjalan",
    note: "VMatch mengoordinasikan partner internal yang sesuai kebutuhan proyek.",
  },
  {
    title: "Produksi",
    date: "24 Mei 2026",
    status: "Berjalan",
    note: "Modul utama sedang masuk proses produksi.",
  },
  {
    title: "Finishing",
    date: "Menunggu",
    status: "Menunggu",
    note: "Tahap finishing akan diperbarui setelah produksi selesai.",
  },
];

const files = [
  { name: "RAB Kitchen Set Walnut.pdf", type: "RAB / Estimasi Biaya", date: "15 Mei 2026" },
  { name: "Referensi Japandi.png", type: "Referensi Desain", date: "14 Mei 2026" },
  { name: "Foto Progress Minggu 1.jpg", type: "Foto Progress", date: "18 Mei 2026" },
];

const notifications = [
  { title: "Solusi proyek sudah tersedia", date: "15 Mei 2026", status: "Belum dibaca" },
  { title: "Progress proyek diperbarui", date: "18 Mei 2026", status: "Sudah dibaca" },
  { title: "File RAB baru ditambahkan", date: "15 Mei 2026", status: "Sudah dibaca" },
];

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
    <main className="min-h-[100dvh] bg-white text-[#31332c]">
      <Sidebar
        activePage={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangePage={changePage}
      />

      <section className="min-h-[100dvh] lg:pl-[290px]">
        <Header title={activeMenu.label} onOpenMenu={() => setIsSidebarOpen(true)} />

        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          {activePage === "dashboard" && <DashboardPage onChangePage={changePage} />}
          {activePage === "catalog" && <CatalogDesign onChangePage={changePage} />}
          {activePage === "ai-ide" && <AiIdeaPage onChangePage={changePage} />}
          {activePage === "konsultasi" && <ConsultationPage />}
          {activePage === "ajukan" && <SubmitProjectPage />}
          {activePage === "request" && <RequestsPage />}
          {activePage === "solusi" && <SolutionPage />}
          {activePage === "proyek" && <ProjectsPage />}
          {activePage === "revisi" && <RevisionPage />}
          {activePage === "files" && <FilesPage />}
          {activePage === "notifikasi" && <NotificationsPage />}
          {activePage === "review" && <ReviewPage />}
          {activePage === "profil" && <ProfilePage />}
        </div>
      </section>
    </main>
  );
}

function Sidebar({
  activePage,
  isOpen,
  onClose,
  onChangePage,
}: {
  activePage: PageId;
  isOpen: boolean;
  onClose: () => void;
  onChangePage: (page: PageId) => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[290px] flex-col bg-[#6B5B52] text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="font-serif text-[32px] italic leading-none text-white">
            VMatch
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Customer Dashboard
          </p>
          <p className="mt-2 text-[13px] leading-6 text-white/70">
            Ajukan request, lihat solusi, pantau progress, dan simpan file proyek.
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePage(item.id)}
                className={`flex h-12 w-full items-center gap-3 px-4 text-left text-[13px] font-medium transition ${active ? "bg-white text-[#6B5B52]" : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/login"
            className="flex h-11 items-center justify-center gap-2 bg-[#F5F1EC] text-[13px] font-semibold text-[#6b5b52] transition hover:bg-[#31332c] hover:text-white"
          >
            <LogOut size={16} />
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}

function Header({
  title,
  onOpenMenu,
}: {
  title: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DED4] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-10 w-10 place-items-center border border-[#ded6ca] bg-white text-[#6B5B52] transition hover:bg-[#f7f4ef] lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8b8179]">
            Dashboard / {title}
          </p>
        </div>

        <button
          className="grid h-10 w-10 place-items-center border border-[#ded6ca] bg-white text-[#6b5b52] transition hover:bg-[#f7f4ef]"
          aria-label="Notifikasi"
        >
          <Bell size={18} />
        </button>

        <div className="hidden h-10 items-center gap-3 border border-[#ded6ca] bg-white pl-1 pr-4 sm:flex">
          <div className="grid h-8 w-8 place-items-center bg-[#31332c] text-white">
            <UserRound size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none text-[#31332c]">
              Customer
            </p>
            <p className="mt-1 text-[11px] leading-none text-[#797c73]">
              VMatch Client
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardPage({ onChangePage }: { onChangePage: (page: PageId) => void }) {
  return (
    <div className="space-y-8">
      <PageTitle
        label="VMatch Customer"
        title="Dashboard"
        subtitle="Pantau request, solusi, progress, revisi, dan file proyek dalam satu tempat."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="border border-[#ded6ca] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] text-[#797c73]">{item.label}</p>
            <h2 className="mt-3 font-serif text-[42px] leading-none">{item.value}</h2>
            <p className="mt-5 text-[12px] font-medium text-[#6b5b52]">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Panel title="Status proyek terbaru" subtitle="Tracking proyek berjalan.">
          {projects.slice(0, 1).map((project) => (
            <div key={project.name} className="border border-[#ded6ca] bg-[#f7f4ef] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[30px] leading-tight">{project.name}</h3>
                  <p className="mt-2 text-[14px] text-[#797c73]">
                    {project.type} • {project.location}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <ProgressBar value={project.progress} />

              <button
                type="button"
                onClick={() => onChangePage("proyek")}
                className="mt-5 h-11 bg-[#31332c] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Lihat Detail Proyek
              </button>
            </div>
          ))}
        </Panel>

        <Panel title="Update terbaru" subtitle="Notifikasi dan aktivitas dari VMatch.">
          <div className="space-y-3">
            {notifications.map((item) => (
              <article key={item.title} className="border border-[#ded6ca] bg-[#f7f4ef] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.title}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-[12px] text-[#797c73]">{item.date}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="border border-[#ded6ca] bg-[#6B5B52] p-6 text-white">
        <h2 className="font-serif text-[34px] leading-tight">
          Punya kebutuhan interior baru?
        </h2>
        <p className="mt-3 max-w-[720px] text-[14px] leading-7 text-white/75">
          Ceritakan kebutuhan ruang kamu. VMatch akan membantu menganalisis request,
          menyusun solusi, dan mengelola proses proyek sampai selesai.
        </p>
        <button
          type="button"
          onClick={() => onChangePage("ajukan")}
          className="mt-5 h-11 bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]"
        >
          Ajukan Proyek Baru
        </button>
      </section>
    </div>
  );
}

function AiIdeaPage({ onChangePage }: { onChangePage: (page: PageId) => void }) {
  const quickPrompts = [
    "Saya ingin kitchen set minimalis dengan budget 10 juta",
    "Bantu buat ide kamar tidur kecil agar lebih rapi",
    "Ruang tamu 3x4 ingin terlihat terang dan luas",
    "Rekomendasi warna untuk interior Japandi",
    "Material apa yang cocok untuk wardrobe sederhana?",
  ];

  const messages = [
    {
      from: "ai",
      text: "Halo, saya AI Ide VMatch. Ceritakan kebutuhan ruang kamu, lalu saya bantu buat gambaran awal konsep interior sebelum kamu mengajukan request proyek.",
    },
    {
      from: "user",
      text: "Ruang tamu 3x4 ingin terlihat terang, luas, dan tetap hangat.",
    },
    {
      from: "ai",
      text: "Baik. Untuk ruang tamu 3x4, konsep yang cocok adalah modern Japandi dengan warna terang, furniture ramping, storage tertutup, dan pencahayaan hangat agar ruang terasa lebih lega.",
    },
  ];

  const savedIdeas = [
    {
      title: "Ruang Tamu 3x4 Terang",
      type: "Ruang Tamu",
      date: "15 Mei 2026",
      status: "Draft Ide",
    },
    {
      title: "Kitchen Set Minimalis 10 Juta",
      type: "Kitchen Set",
      date: "12 Mei 2026",
      status: "Sudah Dijadikan Request",
    },
  ];

  return (
    <div className="grid min-h-[calc(100dvh-112px)] gap-5 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
      <aside className="hidden border border-[#ded6ca] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)] xl:block">
        <div className="border-b border-[#ded6ca] bg-[#f7f4ef] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
            History AI
          </p>
          <h2 className="mt-2 font-serif text-[26px] leading-tight">
            Percakapan
          </h2>
        </div>

        <div className="grid gap-2 p-3">
          {[
            ["Ruang tamu 3x4", "Draft ide"],
            ["Kitchen set 10 juta", "Referensi budget"],
            ["Wardrobe sederhana", "Material umum"],
          ].map(([title, meta], index) => (
            <button
              key={title}
              className={`border p-3 text-left transition ${index === 0
                ? "border-[#31332c] bg-[#31332c] text-white"
                : "border-[#ded6ca] bg-[#f7f4ef] text-[#31332c] hover:border-[#6b5b52]"
                }`}
            >
              <p className="truncate font-serif text-[18px] leading-6">
                {title}
              </p>
              <p
                className={`mt-1 text-[11px] ${index === 0 ? "text-white/70" : "text-[#797c73]"
                  }`}
              >
                {meta}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[620px] flex-col border border-[#ded6ca] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#ded6ca] bg-[#f7f4ef] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
                AI Ide Interior
              </p>
              <h1 className="mt-2 font-serif text-[32px] leading-tight">
                Ruang tamu 3x4
              </h1>
              <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#797c73]">
                Chatbot ini hanya membantu membuat gambaran awal berbasis teks.
                Solusi final tetap akan disusun dan divalidasi oleh tim VMatch.
              </p>
            </div>

            <StatusBadge status="Draft Ide" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-5">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isUser = message.from === "user";

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] border px-4 py-3 text-[14px] leading-7 ${isUser
                      ? "border-[#31332c] bg-[#31332c] text-white"
                      : "border-[#ded6ca] bg-[#f7f4ef] text-[#31332c]"
                      }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border border-[#ded6ca] bg-[#f7f4ef] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b5b52]">
              Quick prompt
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="border border-[#ded6ca] bg-white px-3 py-2 text-left text-[12px] text-[#6b5b52] transition hover:border-[#6b5b52]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#ded6ca] bg-white p-3 sm:p-4">
          <div className="flex items-end gap-2 border border-[#ded6ca] bg-[#f7f4ef] p-2">
            <textarea
              rows={1}
              placeholder="Tulis kebutuhan ruang kamu..."
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-[14px] leading-6 outline-none placeholder:text-[#8b8179]"
            />
            <button className="grid h-10 w-10 shrink-0 place-items-center bg-[#31332c] text-white transition hover:bg-[#191a17]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <section className="border border-[#ded6ca] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
            Ringkasan AI
          </p>
          <h2 className="mt-2 font-serif text-[28px] leading-tight">
            Hasil ide awal
          </h2>

          <div className="mt-5 space-y-3">
            <AiSummaryItem
              title="Rekomendasi konsep"
              text="Modern Japandi dengan warna terang, furniture ramping, dan storage tertutup."
            />
            <AiSummaryItem
              title="Saran warna"
              text="Warm white, beige, light wood, dan aksen hitam tipis."
            />
            <AiSummaryItem
              title="Saran furniture"
              text="Sofa slim, meja kecil, rak dinding ringan, dan kabinet rendah tertutup."
            />
            <AiSummaryItem
              title="Layout sederhana"
              text="Sofa menempel ke dinding, area tengah dibuat kosong, storage di sisi TV."
            />
            <AiSummaryItem
              title="Material umum"
              text="HPL light wood, fabric netral, finishing matte, dan lampu warm white."
            />
            <AiSummaryItem
              title="Estimasi kasar"
              text="Budget Rp8–18 juta, durasi sekitar 2–4 minggu tergantung scope."
            />
          </div>

          <div className="mt-5 border border-[#ded6ca] bg-[#f7f4ef] p-4">
            <h3 className="font-serif text-[22px]">Catatan penting</h3>
            <p className="mt-2 text-[13px] leading-6 text-[#797c73]">
              Hasil AI Ide hanya sebagai gambaran awal. Solusi final akan
              disusun dan divalidasi oleh tim VMatch setelah request proyek
              diajukan.
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              onClick={() => onChangePage("ajukan")}
              className="flex h-11 items-center justify-center gap-2 bg-[#31332c] px-4 text-[12px] font-semibold text-white transition hover:bg-[#191a17]"
            >
              <Send size={15} />
              Jadikan Request Proyek
            </button>
            <button className="flex h-11 items-center justify-center gap-2 border border-[#31332c] px-4 text-[12px] font-semibold text-[#31332c] transition hover:bg-[#31332c] hover:text-white">
              <Bookmark size={15} />
              Simpan Ide
            </button>
            <button className="flex h-11 items-center justify-center gap-2 border border-[#ded6ca] px-4 text-[12px] font-semibold text-[#6b5b52] transition hover:border-[#6b5b52]">
              <RefreshCcw size={15} />
              Generate Ulang
            </button>
            <button className="flex h-11 items-center justify-center gap-2 border border-[#ded6ca] px-4 text-[12px] font-semibold text-[#6b5b52] transition hover:border-[#6b5b52]">
              <Pencil size={15} />
              Edit Kebutuhan
            </button>
          </div>
        </section>

        <section className="border border-[#ded6ca] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
            Ide tersimpan
          </p>

          <div className="mt-4 space-y-3">
            {savedIdeas.map((idea) => (
              <article key={idea.title} className="border border-[#ded6ca] bg-[#f7f4ef] p-4">
                <h3 className="font-serif text-[20px] leading-6">
                  {idea.title}
                </h3>
                <p className="mt-1 text-[12px] text-[#797c73]">
                  {idea.type} • {idea.date}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={idea.status} />
                  <button className="border border-[#31332c] px-3 py-1.5 text-[11px] font-semibold text-[#31332c]">
                    Lihat detail
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function AiSummaryItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-[#ded6ca] bg-[#f7f4ef] p-3">
      <p className="font-serif text-[19px] leading-6 text-[#31332c]">
        {title}
      </p>
      <p className="mt-1 text-[13px] leading-6 text-[#797c73]">
        {text}
      </p>
    </div>
  );
}

function ConsultationPage() {
  const slots = ["09:00 WIB", "10:30 WIB", "13:00 WIB", "14:30 WIB", "16:00 WIB"];

  const histories = [
    {
      project: "Kitchen Set Walnut",
      date: "18 Mei 2026",
      time: "13:00 WIB",
      status: "Terkonfirmasi",
      meet: "Google Meet tersedia",
    },
    {
      project: "Wardrobe Minimalis",
      date: "12 Mei 2026",
      time: "10:30 WIB",
      status: "Selesai",
      meet: "Sesi selesai",
    },
    {
      project: "Japandi Living Room",
      date: "20 Mei 2026",
      time: "14:30 WIB",
      status: "Menunggu Konfirmasi",
      meet: "Menunggu konfirmasi tim",
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        label="Konsultasi"
        title="Jadwalkan Konsultasi"
        subtitle="Pilih request atau proyek yang ingin dikonsultasikan dengan tim VMatch untuk memperjelas kebutuhan sebelum solusi proyek disusun."
      />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)]">
        <Panel
          title="Ajukan jadwal konsultasi"
          subtitle="Jadwal akan dikonfirmasi oleh tim VMatch melalui email atau WhatsApp."
        >
          <div className="grid gap-5">
            <Field label="Pilih request / proyek">
              <select className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 text-[14px] outline-none focus:border-[#6b5b52]">
                <option>Kitchen Set Walnut</option>
                <option>Wardrobe Minimalis</option>
                <option>Japandi Living Room</option>
              </select>
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Tanggal konsultasi">
                <input
                  type="date"
                  className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 text-[14px] outline-none focus:border-[#6b5b52]"
                />
              </Field>

              <Field label="Status jadwal">
                <div className="flex h-12 items-center border border-[#ded6ca] bg-[#f7f4ef] px-4">
                  <StatusBadge status="Menunggu Konfirmasi" />
                </div>
              </Field>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#6b5b52]">
                Pilih slot waktu WIB
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {slots.map((slot, index) => (
                  <button
                    key={slot}
                    type="button"
                    className={`h-11 border px-4 text-[13px] font-semibold transition ${index === 2
                      ? "border-[#31332c] bg-[#31332c] text-white"
                      : "border-[#ded6ca] bg-[#f7f4ef] text-[#6b5b52] hover:border-[#6b5b52]"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-[#ded6ca] bg-[#f7f4ef] p-4">
              <h3 className="font-serif text-[23px] leading-7 text-[#31332c]">
                Informasi konsultasi
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-[#797c73]">
                Konsultasi dilakukan dengan tim VMatch, bukan vendor. Sesi ini
                digunakan untuk memperjelas kebutuhan, prioritas ruang, budget,
                referensi desain, dan timeline sebelum solusi proyek disusun.
              </p>
            </div>

            <button className="h-12 bg-[#31332c] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#191a17]">
              Ajukan Jadwal Konsultasi
            </button>
          </div>
        </Panel>

        <aside className="space-y-5">
          <section className="border border-[#ded6ca] bg-[#6B5B52] p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
              Status Meet
            </p>
            <h2 className="mt-2 font-serif text-[30px] leading-tight">
              Google Meet muncul setelah dikonfirmasi
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-white/75">
              Link Google Meet akan tersedia setelah jadwal disetujui dan
              dikirim oleh tim VMatch melalui email atau WhatsApp.
            </p>
          </section>

          <section className="border border-[#ded6ca] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
              Ringkasan Jadwal
            </p>

            <div className="mt-4 space-y-3">
              <SummaryRow label="Request" value="Kitchen Set Walnut" />
              <SummaryRow label="Tanggal" value="Belum dipilih" />
              <SummaryRow label="Slot" value="13:00 WIB" />
              <SummaryRow label="Status" value="Menunggu Konfirmasi" />
            </div>
          </section>
        </aside>
      </section>

      <Panel
        title="Riwayat konsultasi"
        subtitle="Daftar sesi konsultasi yang pernah diajukan atau sudah dilakukan."
      >
        <DataTable
          headers={["Request / Proyek", "Tanggal", "Waktu", "Status", "Google Meet"]}
          rows={histories.map((item) => [
            item.project,
            item.date,
            item.time,
            <StatusBadge key={item.project} status={item.status} />,
            item.meet,
          ])}
        />
      </Panel>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eee8df] pb-3 last:border-b-0 last:pb-0">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8b8179]">
        {label}
      </p>
      <p className="text-right text-[13px] font-medium text-[#31332c]">
        {value}
      </p>
    </div>
  );
}

function SubmitProjectPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Request Proyek" title="Ajukan Proyek" subtitle="Ceritakan kebutuhan interior kamu agar tim VMatch dapat menganalisis dan menyusun solusi." />

      <Panel title="Form kebutuhan proyek">
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Jenis proyek">
              <select className="h-12 appearance-none border border-[#ded6ca] bg-[#f7f4ef] px-4 pr-12 outline-none">
                <option>Kitchen Set</option>
                <option>Wardrobe</option>
                <option>Kamar Tidur</option>
                <option>Ruang Kerja</option>
                <option>Ruang Tamu</option>
                <option>Storage</option>
                <option>Lainnya</option>
              </select>
            </Field>
            <Field label="Lokasi proyek">
              <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" placeholder="Contoh: Semarang" />
            </Field>
            <Field label="Ukuran ruangan">
              <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" placeholder="Contoh: 3 x 4 meter" />
            </Field>
            <Field label="Estimasi budget">
              <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" placeholder="Contoh: Rp80–120 juta" />
            </Field>
          </div>

          <Field label="Referensi desain / catatan tambahan">
            <textarea
              className="min-h-36 border border-[#ded6ca] bg-[#f7f4ef] p-4 outline-none"
              placeholder="Ceritakan kebutuhan, preferensi warna, material, atau masalah ruang."
            />
          </Field>

          <div className="border border-[#ded6ca] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b5b52]">
              Rencana Waktu Pengerjaan
            </p>

            <p className="mt-2 text-[13px] leading-6 text-[#797c73]">
              Jadwal ini adalah preferensi awal dari customer, bukan jadwal final.
              Estimasi durasi dan jadwal final akan disusun oleh tim VMatch setelah
              kebutuhan proyek dianalisis.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Target mulai pengerjaan">
                <SelectInput>
                  <option>Secepatnya</option>
                  <option>Minggu depan</option>
                  <option>Bulan depan</option>
                  <option>Pilih tanggal sendiri</option>
                </SelectInput>
              </Field>

              <Field label="Target selesai">
                <SelectInput>
                  <option>Fleksibel</option>
                  <option>Dalam 2 minggu</option>
                  <option>Dalam 1 bulan</option>
                  <option>Dalam 2-3 bulan</option>
                  <option>Pilih tanggal sendiri</option>
                </SelectInput>
              </Field>

              <Field label="Urgensi proyek">
                <SelectInput>
                  <option>Tidak urgent</option>
                  <option>Cukup urgent</option>
                  <option>Sangat urgent</option>
                </SelectInput>
              </Field>

              <Field label="Catatan jadwal tambahan">
                <input
                  className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none"
                  placeholder="Contoh: ingin selesai sebelum Lebaran / sebelum pindahan"
                />
              </Field>
            </div>
          </div>

          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-[#ded6ca] bg-[#f7f4ef] p-5 text-center">
            <Upload className="text-[#6b5b52]" />
            <span className="mt-3 text-[14px] font-medium">Upload gambar/file referensi</span>
            <span className="text-[12px] text-[#797c73]">Opsional, JPG/PNG/PDF.</span>
            <input type="file" className="sr-only" />
          </label>

          <div className="grid gap-3 sm:grid-cols-[auto_auto]">
            <button
              type="button"
              className="h-12 border border-[#31332c] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#31332c] transition hover:bg-[#f7f4ef]"
            >
              Simpan Draft
            </button>

            <button
              type="submit"
              className="h-12 bg-[#31332c] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#191a17]"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function RequestsPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Request" title="Request Saya" subtitle="Daftar request proyek yang pernah kamu ajukan." />
      <DataTable
        headers={["Request", "Jenis", "Tanggal", "Lokasi", "Budget", "Status", "Aksi"]}
        rows={requests.map((item) => [
          item.name,
          item.type,
          item.date,
          item.location,
          item.budget,
          <StatusBadge key={item.name} status={item.status} />,
          <ActionButton key={`btn-${item.name}`}>Detail</ActionButton>,
        ])}
      />
    </div>
  );
}

function SolutionPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Proposal" title="Solusi Proyek" subtitle="Solusi yang disiapkan oleh tim VMatch berdasarkan request kamu." />

      <Panel title="Kitchen Set Walnut" subtitle="Status: Solusi Dikirim">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Ringkasan kebutuhan" text="Kitchen set compact, banyak storage, mudah dibersihkan, dan tampilan hangat." />
          <InfoCard title="Rekomendasi konsep" text="Modern warm minimal dengan kabinet tertutup dan aksen walnut." />
          <InfoCard title="Estimasi budget" text="Rp85–115 juta, menyesuaikan material final dan ukuran aktual." />
          <InfoCard title="Estimasi waktu" text="6–8 minggu setelah solusi disetujui dan produksi dijadwalkan." />
          <InfoCard title="Rekomendasi material" text="HPL walnut, solid surface, engsel soft-close, dan finishing matte." />
          <InfoCard title="Catatan VMatch" text="Tim akan validasi ukuran ruang sebelum RAB final dan produksi." />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="h-11 bg-[#31332c] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
            Setujui Solusi
          </button>
          <button className="h-11 border border-[#31332c] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332c]">
            Ajukan Revisi
          </button>
        </div>
      </Panel>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Project Tracking" title="Proyek Saya" subtitle="Pantau progress proyek yang sedang berjalan atau sudah selesai." />
      <DataTable
        headers={["Proyek", "Jenis", "Lokasi", "Mulai", "Estimasi Selesai", "Status", "Progress"]}
        rows={projects.map((item) => [
          item.name,
          item.type,
          item.location,
          item.start,
          item.end,
          <StatusBadge key={item.name} status={item.status} />,
          <ProgressBar key={`progress-${item.name}`} value={item.progress} />,
        ])}
      />

      <Panel title="Timeline Progress" subtitle="Tracking proyek seperti paket.">
        <Timeline />
      </Panel>
    </div>
  );
}

function RevisionPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Masukan" title="Revisi" subtitle="Ajukan revisi atau masukan agar tercatat rapi." />

      <Panel title="Ajukan revisi">
        <div className="grid gap-4">
          <Field label="Pilih proyek">
            <SelectInput>
              <option>Kitchen Set Walnut</option>
              <option>Japandi Living Room</option>
            </SelectInput>
          </Field>
          <Field label="Isi revisi/masukan">
            <textarea className="min-h-32 border border-[#ded6ca] bg-[#f7f4ef] p-4 outline-none" placeholder="Tulis revisi atau masukan kamu." />
          </Field>
          <button className="h-11 bg-[#31332c] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
            Kirim Revisi
          </button>
        </div>
      </Panel>

      <Panel title="Daftar revisi">
        <DataTable
          headers={["Tanggal", "Isi Revisi", "Status", "Catatan VMatch"]}
          rows={[
            ["15 Mei 2026", "Handle kabinet dibuat hidden.", <StatusBadge key="r1" status="Diproses" />, "Tim sedang menyesuaikan desain."],
            ["12 Mei 2026", "Warna dibuat lebih terang.", <StatusBadge key="r2" status="Selesai" />, "Sudah diperbarui pada proposal."],
          ]}
        />
      </Panel>
    </div>
  );
}

function FilesPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Dokumen" title="File Proyek" subtitle="Dokumen penting proyek, file desain, invoice, dan foto progress." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <article key={file.name} className="border border-[#ded6ca] bg-[#f7f4ef] p-5">
            <FileText className="text-[#6b5b52]" />
            <h3 className="mt-4 font-medium">{file.name}</h3>
            <p className="mt-2 text-[13px] text-[#797c73]">{file.type}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[12px] text-[#797c73]">{file.date}</span>
              <button className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#31332c]">
                <Download size={14} />
                Lihat
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function NotificationsPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Update" title="Notifikasi" subtitle="Informasi terbaru dari VMatch terkait request dan proyek kamu." />
      <Panel title="Notifikasi terbaru">
        <div className="space-y-3">
          {notifications.map((item) => (
            <article key={item.title} className="border border-[#ded6ca] bg-[#f7f4ef] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.title}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-[12px] text-[#797c73]">{item.date}</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ReviewPage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Feedback" title="Review" subtitle="Berikan feedback setelah proyek selesai." />
      <Panel title="Kirim feedback">
        <div className="grid gap-4">
          <Field label="Rating">
            <SelectInput>
              <option>5 - Sangat puas</option>
              <option>4 - Puas</option>
              <option>3 - Cukup</option>
            </SelectInput>
          </Field>
          <Field label="Komentar">
            <textarea className="min-h-32 border border-[#ded6ca] bg-[#f7f4ef] p-4 outline-none" placeholder="Tulis pengalaman kamu selama proyek." />
          </Field>
          <button className="h-11 bg-[#31332c] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
            Kirim Feedback
          </button>
        </div>
      </Panel>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageTitle label="Akun" title="Profil Saya" subtitle="Kelola informasi akun customer." />
      <Panel title="Data profil">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama">
            <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" defaultValue="Customer VMatch" />
          </Field>
          <Field label="Email">
            <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" defaultValue="customer@email.com" />
          </Field>
          <Field label="Nomor HP">
            <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" defaultValue="0812xxxx" />
          </Field>
          <Field label="Alamat / lokasi">
            <input className="h-12 border border-[#ded6ca] bg-[#f7f4ef] px-4 outline-none" defaultValue="Semarang" />
          </Field>
        </div>
      </Panel>
    </div>
  );
}

function PageTitle({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">
        {label}
      </p>
      <h1 className="mt-3 font-serif text-[42px] leading-tight text-[#31332c] sm:text-[56px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#797c73]">
        {subtitle}
      </p>
    </section>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#ded6ca] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:p-6">
      <h2 className="font-serif text-[32px] leading-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-[14px] leading-6 text-[#797c73]">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-semibold text-[#6b5b52]">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="border border-[#ded6ca] bg-[#f7f4ef] p-5">
      <h3 className="font-serif text-[24px] leading-7">{title}</h3>
      <p className="mt-2 text-[14px] leading-7 text-[#797c73]">{text}</p>
    </article>
  );
}

function Timeline() {
  return (
    <div className="space-y-0">
      {timeline.map((item, index) => (
        <div key={item.title} className="grid grid-cols-[28px_1fr] gap-4">
          <div className="relative flex justify-center">
            <span className="mt-1.5 h-4 w-4 bg-[#31332c]" />
            {index < timeline.length - 1 && (
              <span className="absolute top-7 h-[calc(100%-8px)] w-px bg-[#ded6ca]" />
            )}
          </div>
          <div className="pb-7">
            <div className="border border-[#ded6ca] bg-[#f7f4ef] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-[24px]">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-[12px] font-medium text-[#6b5b52]">{item.date}</p>
              <p className="mt-3 text-[14px] leading-6 text-[#797c73]">{item.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden border border-[#ded6ca] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse bg-white text-left text-[14px]">
          <thead className="bg-[#f7f4ef] text-[11px] uppercase tracking-[0.14em] text-[#6b5b52]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[#ded6ca]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 bg-[#f7f4ef] p-3 lg:hidden">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="bg-white p-4">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex justify-between gap-4 border-b border-[#f0ebe4] py-2 last:border-b-0">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b8179]">
                  {headers[cellIndex]}
                </span>
                <span className="text-right text-[13px]">{cell}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status.includes("Selesai") || status.includes("Disetujui") || status.includes("Sudah")
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : status.includes("Menunggu") || status.includes("Draft")
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : "border-[#ded6ca] bg-[#f7f4ef] text-[#6b5b52]";

  return (
    <span className={`inline-flex border px-3 py-1 text-[11px] font-semibold ${style}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-5">
      <div className="h-2 overflow-hidden bg-[#eee8df]">
        <div className="h-full bg-[#31332c]" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-[12px] font-medium text-[#6b5b52]">{value}% selesai</p>
    </div>
  );
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-10 bg-[#31332c] px-4 text-[12px] font-semibold text-white transition hover:bg-[#191a17]">
      {children}
    </button>
  );
}

function SelectInput({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        className={`h-12 w-full appearance-none border border-[#ded6ca] bg-[#f7f4ef] px-4 pr-12 text-[14px] outline-none focus:border-[#6b5b52] ${className}`}
      >
        {children}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8179]"
      />
    </div>
  );
}