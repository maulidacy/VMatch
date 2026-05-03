"use client";

import {
  Activity,
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  FolderOpen,
  HelpCircle,
  ImagePlus,
  Images,
  LogOut,
  Menu,
  MessageSquare,
  PenTool,
  Plus,
  Ruler,
  Search,
  Send,
  Video,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { inspirations, projects as featuredProjects } from "@/lib/home-content";

type TabId = "overview" | "brief" | "meet" | "ai" | "docs" | "catalog";
type CatalogKey = "featured" | "rumah" | "apartment" | "hotel" | "kos-boarding-house";

type DashboardTab = {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

type ClientProject = {
  id: string;
  title: string;
  property: string;
  location: string;
  budget: string;
  projectStart: string;
  projectEnd: string;
  duration: string;
  status: string;
  submittedAt: string;
  image: string;
  consultationDate?: string;
  /** Object URL preview dari foto referensi yang diunggah saat submit brief */
  referencePhotoUrl?: string;
  /** Nama file dokumen rencana / denah yang dilampirkan klien */
  planDocumentName?: string;
  progressReports: ClientProgressReport[];
};

type ClientProgressReport = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "Selesai" | "Saat ini" | "Menunggu";
  image: string;
  percent: string;
};

type Conversation = {
  id: string;
  title: string;
  meta: string;
  messages: { from: "bot" | "user"; text: string }[];
};

const tabs: DashboardTab[] = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: Activity },
  { id: "brief", label: "Ajukan Proyek", shortLabel: "Ajukan", icon: PenTool },
  { id: "meet", label: "Konsultasi", shortLabel: "Meet", icon: Video },
  { id: "ai", label: "AI Ide", shortLabel: "AI", icon: Bot },
  { id: "docs", label: "Dokumen", shortLabel: "Docs", icon: FileText },
  { id: "catalog", label: "Katalog", shortLabel: "Katalog", icon: Images },
];

const initialProjects: ClientProject[] = [
  {
    id: "project-a",
    title: "Project A - Apartment living",
    property: "Apartemen 2BR",
    location: "Jakarta Selatan",
    budget: "Rp 100-140 jt",
    projectStart: "Mei 2026",
    projectEnd: "Agustus 2026",
    duration: "3 bulan",
    status: "Produksi 50%",
    submittedAt: "2 Mei 2026",
    image: "/figma/project-walnut.webp",
    consultationDate: "16 Mei 2026, 13:00 WIB",
    progressReports: [
      {
        id: "report-brief",
        title: "Request projek",
        description: "Brief client diterima dan masuk pipeline admin untuk review awal.",
        date: "2 Mei 2026",
        status: "Selesai",
        image: "/inspirations/apartment-living-area.webp",
        percent: "10%",
      },
      {
        id: "report-review",
        title: "Review brief",
        description: "Scope ruang, budget, dan rentang pengerjaan sudah dirapikan setelah diskusi internal.",
        date: "4 Mei 2026",
        status: "Selesai",
        image: "/figma/process-bg.webp",
        percent: "20%",
      },
      {
        id: "report-meet",
        title: "Konsultasi",
        description: "Google Meet selesai, prioritas material dan kebutuhan storage sudah dikunci.",
        date: "16 Mei 2026",
        status: "Selesai",
        image: "/figma/inspiration-living.webp",
        percent: "35%",
      },
      {
        id: "report-production",
        title: "Progres pengerjaan",
        description: "Admin mengunggah laporan mingguan: modul utama sudah masuk produksi sekitar separuh pekerjaan.",
        date: "24 Mei 2026",
        status: "Saat ini",
        image: "/figma/benefits-kitchen.webp",
        percent: "50%",
      },
      {
        id: "report-install",
        title: "Instalasi",
        description: "Jadwal pemasangan akan dikonfirmasi setelah produksi selesai dan barang siap kirim.",
        date: "Menunggu",
        status: "Menunggu",
        image: "/figma/project-walnut.webp",
        percent: "80%",
      },
      {
        id: "report-done",
        title: "Selesai",
        description: "Serah terima project, dokumentasi final, dan catatan maintenance.",
        date: "Menunggu",
        status: "Menunggu",
        image: "/figma/project-library.webp",
        percent: "100%",
      },
    ],
  },
];

const conversations: Conversation[] = [
  {
    id: "living",
    title: "Ruang tamu 3x4",
    meta: "2 pesan",
    messages: [
      { from: "bot", text: "Mari bahas penataan ruang, dekorasi fungsional, atau kalkulasi anggaran awal." },
      { from: "user", text: "Ruang tamu 3x4 meter, ingin warna light wood dan suasana terang." },
      { from: "bot", text: "Pakai sofa ramping, storage tertutup, dan satu aksen kayu. Japandi atau Scandi-minimalist cocok." },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen set compact",
    meta: "Draft ide",
    messages: [
      { from: "bot", text: "Untuk kitchen compact, prioritaskan alur kompor, sink, dan prep area." },
      { from: "user", text: "Saya ingin top table kuat dan kabinet tidak cepat lembap." },
      { from: "bot", text: "Gunakan finishing HPL tahan lembap dan top table solid surface atau quartz sesuai budget." },
    ],
  },
  {
    id: "bedroom",
    title: "Bedroom storage",
    meta: "Referensi",
    messages: [
      { from: "bot", text: "Storage kamar tidur bisa digabung dengan headboard agar ruangan tetap lapang." },
      { from: "user", text: "Saya butuh wardrobe tinggi tapi tetap ringan dilihat." },
      { from: "bot", text: "Pakai warna panel terang, handle tipis, dan cermin vertikal sebagai aksen." },
    ],
  },
];

const catalogCategories = [
  { key: "apartment", label: "Apartemen", image: "/inspirations/apartment-hero.webp" },
  { key: "rumah", label: "Rumah", image: "/inspirations/rumah-hero.webp" },
  { key: "hotel", label: "Hotel", image: "/inspirations/hotel-hero.webp" },
  { key: "kos-boarding-house", label: "Kos / Boarding", image: "/inspirations/boarding-hero.webp" },
  { key: "featured", label: "Project Featured", image: "/figma/project-loft.webp" },
] satisfies { key: CatalogKey; label: string; image: string }[];

const TEAM_WHATSAPP_NUMBER = "6281234567890";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [clientProjects, setClientProjects] = useState<ClientProject[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const selectedProject = clientProjects.find((project) => project.id === selectedProjectId) ?? null;

  const openBrief = () => {
    setSelectedProjectId(null);
    setActiveTab("brief");
  };

  const createProject = (project: ClientProject) => {
    setClientProjects((current) => [project, ...current]);
    setSelectedProjectId(project.id);
    setActiveTab("overview");
  };

  const openMeetForProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab("meet");
  };

  const isMeetTab = activeTab === "meet";
  const isAiTab = activeTab === "ai";

  return (
    <main
      className={
        isMeetTab
          ? "flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden bg-[#FCFBF9]"
          : "flex h-[100dvh] min-h-0 w-full max-h-[100dvh] max-w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#FCFBF9]"
      }
    >
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className={
          isMeetTab
            ? "w-full max-w-full overflow-x-hidden px-3 pb-3 pt-3 sm:px-4 lg:px-5"
            : isAiTab
              ? "flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden overflow-y-hidden px-0 pb-0 pt-0 lg:px-5 lg:pb-3 lg:pt-3"
              : "flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 pb-3 pt-3 [-webkit-overflow-scrolling:touch] sm:px-4 lg:px-5"
        }
      >
        <section
          className={`mx-auto flex w-full max-w-[1600px] flex-col ${isMeetTab ? "pb-1" : isAiTab ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1"}`}
        >
          {activeTab === "overview" && (
            selectedProject ? (
              <ProjectDetail project={selectedProject} onBack={() => setSelectedProjectId(null)} setActiveTab={setActiveTab} />
            ) : (
              <ProjectHub
                projects={clientProjects}
                onOpenProject={setSelectedProjectId}
                onCreateProject={openBrief}
                onScheduleMeet={openMeetForProject}
              />
            )
          )}
          {activeTab === "brief" && <BriefTab onCreateProject={createProject} />}
          {activeTab === "meet" && <MeetTab project={selectedProject} onSelectProject={() => setActiveTab("overview")} />}
          {activeTab === "ai" && <AiTab />}
          {activeTab === "docs" && <DocsTab project={selectedProject} />}
          {activeTab === "catalog" && <CatalogTab />}
        </section>
      </div>
    </main>
  );
}

function DashboardHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="shrink-0 rounded-b-[28px] bg-[#191A17] px-4 py-3 text-[#F5EFE5] shadow-[0_16px_40px_rgba(25,26,23,0.16)] sm:px-5 lg:rounded-b-[36px] lg:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-[#F5EFE5] px-5 font-serif text-[25px] font-medium italic leading-none text-[#31332C] transition-colors hover:bg-white sm:h-14 sm:px-7 sm:text-[29px]"
          >
            VMatch
            <span className="ml-3 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">
              Client
            </span>
          </Link>
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F5EFE5]/18 bg-[#F5EFE5]/8 text-[#F5EFE5] transition-colors hover:bg-[#F5EFE5] hover:text-[#31332C] lg:hidden"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="hidden min-w-0 items-center gap-2 lg:flex lg:justify-end">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition-all sm:h-11 sm:px-5 ${
                  isActive
                    ? "border-[#F5EFE5] bg-[#F5EFE5] text-[#31332C]"
                    : "border-[#F5EFE5]/18 bg-[#F5EFE5]/8 text-[#F5EFE5]/76 hover:bg-[#F5EFE5]/14 hover:text-[#F5EFE5]"
                }`}
              >
                <Icon size={15} />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
          <Link
            href="/login"
            aria-label="Keluar"
            className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F5EFE5]/18 bg-[#F5EFE5]/8 text-[#F5EFE5] transition-colors hover:bg-[#F5EFE5] hover:text-[#31332C] lg:grid"
          >
            <LogOut size={17} />
          </Link>
        </nav>
      </div>

      <div
        className={`mx-auto grid w-full max-w-[1600px] overflow-hidden border-t border-[#F5EFE5]/12 transition-all duration-300 ease-out lg:hidden ${
          isMobileMenuOpen
            ? "mt-3 max-h-[560px] translate-y-0 pb-4 pt-3 opacity-100"
            : "mt-0 max-h-0 -translate-y-1 pb-0 pt-0 opacity-0"
        }`}
      >
        <div className="grid gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={`mobile-${tab.id}`}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`inline-flex h-12 w-full items-center justify-between gap-3 border px-4 text-left text-[12px] font-semibold transition-all ${
                  isActive
                    ? "border-[#F5EFE5] bg-[#F5EFE5] text-[#31332C]"
                    : "border-[#F5EFE5]/18 bg-[#F5EFE5]/8 text-[#F5EFE5]/80 hover:bg-[#F5EFE5]/14 hover:text-[#F5EFE5]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={15} />
                  {tab.label}
                </span>
              </button>
            );
          })}

          <Link
            href="/login"
            aria-label="Keluar"
            className="inline-flex h-12 w-full items-center justify-between border border-[#F5EFE5]/18 bg-[#F5EFE5]/8 px-4 text-[12px] font-semibold text-[#F5EFE5] transition-colors hover:bg-[#F5EFE5] hover:text-[#31332C]"
          >
            <span>Keluar</span>
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProjectHub({
  projects,
  onOpenProject,
  onCreateProject,
  onScheduleMeet,
}: {
  projects: ClientProject[];
  onOpenProject: (id: string) => void;
  onCreateProject: () => void;
  onScheduleMeet: (id: string) => void;
}) {
  return (
    <section className="border border-[#DED6CA] bg-white fade-in">
      <div className="flex flex-col gap-3 border-b border-[#DED6CA] p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B5B52]">Project hub</p>
          <h1 className="mt-1 font-serif text-[26px] leading-8 text-[#31332C] sm:text-[30px]">Pilih dashboard proyek</h1>
        </div>
        <button
          type="button"
          onClick={onCreateProject}
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 bg-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17] sm:w-auto"
        >
          <Plus size={16} />
          Tambah project
        </button>
      </div>

      <div className="grid grid-cols-1 justify-items-stretch gap-4 p-4 sm:grid-cols-[repeat(auto-fill,minmax(300px,340px))] sm:justify-start">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex aspect-square w-full max-w-full flex-col border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:max-w-none"
            >
              <button type="button" onClick={() => onOpenProject(project.id)} className="block w-full min-w-0 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Brief pengajuan</p>
                <h2 className="mt-1 line-clamp-2 font-serif text-[21px] leading-6 text-[#31332C]">{project.title}</h2>
                <div className="mt-3 grid gap-1 text-[12px] leading-5 text-[#797C73]">
                  <span className="truncate">{project.property}</span>
                  <span className="truncate">{project.location}</span>
                  <span className="truncate">{project.budget}</span>
                  <span className="truncate">{project.projectStart} - {project.projectEnd}</span>
                </div>
              </button>

              <div className="mt-auto border-t border-[#DED6CA] pt-3">
                {project.consultationDate ? (
                  <div className="border border-[#DED6CA] bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Jadwal meet</p>
                    <p className="break-words text-[12px] leading-5 text-[#31332C]">{project.consultationDate}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onScheduleMeet(project.id)}
                    className="h-9 w-full border border-[#31332C] bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]"
                  >
                    + Tambah jadwal meet
                  </button>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52]">
                  Status sekarang: {project.status}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenProject(project.id)}
                  className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#31332C] underline underline-offset-4"
                >
                  Lihat detail
                </button>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function AutoFitText({
  as: Tag = "p",
  children,
  className = "",
  minPx,
  maxPx,
}: {
  as?: "h1" | "h2" | "p";
  children: React.ReactNode;
  className?: string;
  minPx: number;
  maxPx: number;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const fit = () => {
      el.style.fontSize = `${maxPx}px`;
      if (el.scrollWidth <= el.clientWidth) {
        return;
      }

      let lo = minPx;
      let hi = maxPx;
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}px`;
        if (el.scrollWidth <= el.clientWidth) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      el.style.fontSize = `${lo}px`;
    };

    fit();
    const parent = el.parentElement;
    if (!parent) {
      return;
    }
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [children, minPx, maxPx]);

  return (
    <Tag ref={ref} className={`min-w-0 whitespace-nowrap ${className}`} style={{ fontSize: maxPx }}>
      {children}
    </Tag>
  );
}

function ProjectDetail({
  project,
  onBack,
  setActiveTab,
}: {
  project: ClientProject;
  onBack: () => void;
  setActiveTab: (tab: TabId) => void;
}) {
  const currentTimelineRef = useRef<HTMLElement | null>(null);
  const followUpWaLink = buildWhatsAppFollowUpLink(project);
  const summaryCards = [
    { label: "Tipe properti", value: project.property, icon: Ruler },
    { label: "Estimasi biaya", value: project.budget, icon: Wallet },
    { label: "Status", value: project.status, icon: MessageSquare },
    { label: "Rentang project", value: `${project.projectStart} - ${project.projectEnd}`, icon: Calendar },
    { label: "Durasi proyek", value: project.duration, icon: Calendar },
  ];

  useEffect(() => {
    currentTimelineRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [project.id]);

  const reports = project.progressReports;

  return (
    <div className="flex flex-col gap-3 fade-in">
      <div className="grid shrink-0 gap-3 lg:grid-cols-[minmax(270px,380px)_minmax(0,1fr)_auto]">
        <article className="flex items-center gap-3 border border-[#DED6CA] bg-white p-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 shrink-0 place-items-center border border-[#DED6CA] text-[#31332C] transition-colors hover:border-[#31332C]">
            <ArrowLeft size={17} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">Dashboard proyek</p>
            <AutoFitText
              as="h1"
              minPx={13}
              maxPx={25}
              className="mt-1 font-serif font-medium leading-none text-[#31332C]"
            >
              {project.title}
            </AutoFitText>
            <p className="mt-2 text-[13px] leading-5 text-[#797C73]">{project.location}</p>
          </div>
        </article>

        <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="min-w-0 border border-[#DED6CA] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#797C73]">{item.label}</p>
                  <Icon className="shrink-0 text-[#6B5B52]" size={18} />
                </div>
                <AutoFitText minPx={11} maxPx={20} className="mt-3 font-serif leading-6 text-[#31332C]">
                  {item.value}
                </AutoFitText>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("brief")}
          className="inline-flex h-full min-h-14 items-center justify-center gap-3 bg-[#31332C] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17] lg:min-w-[170px]"
        >
          <Plus size={18} />
          Project baru
        </button>
      </div>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="relative min-w-0 border border-[#DED6CA] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#DED6CA] p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0 pr-0 sm:pr-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B5B52]">Project timeline</p>
              <AutoFitText as="h2" minPx={14} maxPx={29} className="mt-1 font-serif font-medium leading-8 text-[#31332C]">
                {project.title}
              </AutoFitText>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("meet")}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5] sm:w-auto"
            >
              <Video size={15} />
              Jadwalkan
            </button>
          </div>

          <div className="max-w-full overflow-x-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex w-max gap-4 pt-10">
              <div className="absolute left-0 right-0 top-[61px] h-px bg-[#DED6CA]" />
              {reports.map((item, index) => {
                const isCurrent = item.status === "Saat ini";
                const isDone = item.status === "Selesai";
                return (
                  <article
                    key={item.id}
                    ref={isCurrent ? currentTimelineRef : undefined}
                    className="relative z-10 w-[230px] shrink-0 sm:w-[255px]"
                  >
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-full border text-[12px] font-semibold ${
                        isCurrent
                          ? "border-[#31332C] bg-[#31332C] text-[#F5EFE5]"
                          : isDone
                            ? "border-[#6B5B52] bg-[#6B5B52] text-white"
                            : "border-[#DED6CA] bg-[#FCFBF9] text-[#797C73]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : String(index + 1).padStart(2, "0")}
                    </div>
                    <div
                      className={`mt-4 grid min-h-[310px] grid-rows-[128px_1fr_auto] border ${
                      isCurrent ? "border-[#31332C] bg-white" : "border-[#DED6CA] bg-[#FCFBF9]"
                    }`}
                  >
                      <div className="relative h-32 w-full overflow-hidden bg-[#DED6CA]">
                        {item.image.startsWith("blob:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={`Progress ${item.title}`} className="h-full w-full object-cover" />
                        ) : (
                          <Image src={item.image} alt={`Progress ${item.title}`} fill className="object-cover" sizes="260px" />
                        )}
                      </div>
                      <div className="min-w-0 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">{item.status}</p>
                          <span className="shrink-0 border border-[#DED6CA] bg-white px-2 py-1 text-[10px] font-semibold text-[#31332C]">
                            {item.percent}
                          </span>
                        </div>
                        <h3 className="mt-2 font-serif text-[20px] leading-6 text-[#31332C]">{item.title}</h3>
                        <p className="mt-2 line-clamp-3 text-[11px] leading-4 text-[#797C73]">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#DED6CA] px-3 py-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#797C73]">
                          {item.date}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">
                          Laporan admin
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="grid gap-3">
          <article className="border border-[#DED6CA] bg-[#31332C] p-4 text-[#F5EFE5]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE5]/70">Catatan tim</p>
            <h2 className="mt-2 font-serif text-[24px] leading-7">Prioritas minggu ini</h2>
            <p className="mt-3 text-[12px] leading-5 text-[#F5EFE5]/78">
              Finalkan kebutuhan storage, ukuran kitchen set, dan preferensi finishing sebelum RAB dikirim.
            </p>
          </article>

          <article className="grid gap-4 border border-[#DED6CA] bg-white p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">Konsultasi</p>
              <h3 className="mt-2 font-serif text-[22px] leading-7 text-[#31332C]">{project.property}</h3>
            </div>
            {project.consultationDate ? (
              <div className="mt-4 grid place-items-center border border-[#DED6CA] bg-[#FCFBF9] p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Jadwal meet</p>
                <p className="mt-2 max-w-full break-words font-serif text-[22px] leading-7 text-[#31332C] sm:text-[24px]">
                  {project.consultationDate}
                </p>
                <p className="mt-3 text-[12px] leading-5 text-[#797C73]">
                  Link Google Meet akan dikirim lewat email dan WhatsApp. Mohon cek inbox, spam, dan chat WA sebelum jadwal dimulai.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid place-items-center border border-dashed border-[#DED6CA] bg-[#FCFBF9] p-4 text-center">
                <p className="text-[13px] leading-5 text-[#797C73]">Belum ada jadwal konsultasi untuk project ini.</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setActiveTab("meet")}
              className="mt-4 h-10 border border-[#31332C] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]"
            >
              + Tambah jadwal meet
            </button>
            <a
              href={followUpWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#6B5B52] bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52] transition-colors hover:bg-[#6B5B52] hover:text-white"
            >
              <MessageSquare size={14} />
              Follow up WA
            </a>
          </article>
        </aside>
      </div>
    </div>
  );
}

function parseIsoDateLocal(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return null;
  }
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatBriefDateId(iso: string): string {
  const parsed = parseIsoDateLocal(iso);
  if (!parsed) {
    return "";
  }
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
}

function BriefTab({ onCreateProject }: { onCreateProject: (project: ClientProject) => void }) {
  const [property, setProperty] = useState("Apartemen");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [dateError, setDateError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<{ url: string; name: string } | null>(null);
  const [planDocument, setPlanDocument] = useState<{ name: string } | null>(null);

  const defaultProjectImage =
    property === "Rumah tapak" ? "/inspirations/rumah-hero.webp" : "/inspirations/apartment-hero.webp";

  const handleReferencePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    setPhotoPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.url);
      }
      return { url: URL.createObjectURL(file), name: file.name };
    });
  };

  const clearReferencePhoto = () => {
    setPhotoPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  };

  const handlePlanDocument = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    setPlanDocument({ name: file.name });
  };

  const submitBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (projectStartDate && projectEndDate && projectStartDate > projectEndDate) {
      setDateError("Tanggal selesai harus sama atau setelah tanggal mulai.");
      return;
    }
    setDateError("");

    const count = Date.now().toString().slice(-4);
    const startLabel = formatBriefDateId(projectStartDate) || "Start belum diisi";
    const endLabel = formatBriefDateId(projectEndDate) || "End belum diisi";
    const coverImage = photoPreview?.url ?? defaultProjectImage;

    onCreateProject({
      id: `project-${count}`,
      title: `Project ${count} - ${property}`,
      property,
      location: location || "Lokasi belum diisi",
      budget: budget || "Budget belum diisi",
      projectStart: startLabel,
      projectEnd: endLabel,
      duration: duration || "Durasi belum diisi",
      status: "Brief baru",
      submittedAt: "3 Mei 2026",
      image: coverImage,
      referencePhotoUrl: photoPreview?.url,
      planDocumentName: planDocument?.name,
      progressReports: [
        {
          id: `report-${count}-brief`,
          title: "Request projek",
          description: "Brief baru sudah masuk. Admin akan review kebutuhan dan menyiapkan langkah berikutnya.",
          date: "3 Mei 2026",
          status: "Saat ini",
          image: coverImage,
          percent: "10%",
        },
        {
          id: `report-${count}-review`,
          title: "Review brief",
          description: "Admin akan merapikan scope dan menyesuaikan timeline setelah brief lengkap.",
          date: "Menunggu",
          status: "Menunggu",
          image: "/figma/process-bg.webp",
          percent: "20%",
        },
        {
          id: `report-${count}-meet`,
          title: "Konsultasi",
          description: "Jadwal Google Meet akan muncul setelah client memilih slot konsultasi.",
          date: "Menunggu",
          status: "Menunggu",
          image: "/figma/inspiration-living.webp",
          percent: "35%",
        },
        {
          id: `report-${count}-progress`,
          title: "Progres pengerjaan",
          description: "Laporan mingguan dari admin akan tampil di sini beserta foto progress.",
          date: "Menunggu",
          status: "Menunggu",
          image: "/figma/benefits-kitchen.webp",
          percent: "50%",
        },
      ],
    });
  };

  return (
    <div className="grid gap-4 fade-in lg:grid-cols-[1fr_360px] lg:items-start">
      <section className="border border-[#DED6CA] bg-white">
        <div className="border-b border-[#DED6CA] bg-[#FCFBF9] px-4 py-5 sm:px-6 sm:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Pengajuan proyek</p>
          <h2 className="mt-1 font-serif text-[24px] font-medium leading-7 text-[#31332C] sm:text-[29px] sm:leading-8">
            Kuesioner detail proyek
          </h2>
        </div>

        <form onSubmit={submitBrief} className="grid gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:pb-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Tipe properti">
              <select className="field-control bg-white" value={property} onChange={(event) => setProperty(event.target.value)}>
                <option>Apartemen</option>
                <option>Rumah tapak</option>
                <option>Kantor / ruko</option>
                <option>Hotel / komersial</option>
              </select>
            </Field>
            <Field label="Lokasi proyek">
              <input
                className="field-control bg-white"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                placeholder="Contoh: Jakarta Selatan"
                autoComplete="address-level2"
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Estimasi budget">
              <input
                className="field-control bg-white"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                type="text"
                placeholder="Rp 100-140 jt"
              />
            </Field>
            <Field label="Estimasi durasi">
              <input
                className="field-control bg-white"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                type="text"
                placeholder="Contoh: 3 bulan"
              />
            </Field>
          </div>

          <div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Mulai proyek">
                <input
                  className="field-control bg-white"
                  value={projectStartDate}
                  onChange={(event) => {
                    setProjectStartDate(event.target.value);
                    setDateError("");
                  }}
                  type="date"
                  required
                  max={projectEndDate || undefined}
                />
              </Field>
              <Field label="Selesai proyek (perkiraan)">
                <input
                  className="field-control bg-white"
                  value={projectEndDate}
                  onChange={(event) => {
                    setProjectEndDate(event.target.value);
                    setDateError("");
                  }}
                  type="date"
                  required
                  min={projectStartDate || undefined}
                />
              </Field>
            </div>
            {dateError ? (
              <p className="mt-3 text-[13px] text-red-700" role="alert">
                {dateError}
              </p>
            ) : (
              <p className="mt-3 border-l-2 border-[#6B5B52] pl-3 text-[12px] leading-relaxed text-[#797C73]">
                Pilih tanggal lewat kalender. Tim memakai rentang ini untuk jadwal konsultasi, RAB, produksi, dan instalasi.
              </p>
            )}
          </div>

          <Field label="Kebutuhan desain dan referensi tone">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field-control min-h-[140px] resize-y bg-white"
              placeholder="Contoh: dominan walnut, storage tertutup, ruang tamu lebih terang, dan kitchen set mudah dibersihkan."
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="min-w-0">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
                Foto referensi ruang <span className="font-normal normal-case text-[#797C73]">(opsional)</span>
              </span>
              <div className="relative border border-dashed border-[#DED6CA] bg-[#FCFBF9]">
                {photoPreview ? (
                  <div className="grid gap-2 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL dari unggahan lokal */}
                    <img src={photoPreview.url} alt={`Preview ${photoPreview.name}`} className="mx-auto max-h-44 w-full object-contain" />
                    <p className="truncate text-center text-[11px] text-[#797C73]">{photoPreview.name}</p>
                    <button
                      type="button"
                      onClick={clearReferencePhoto}
                      className="justify-self-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#31332C] underline underline-offset-4"
                    >
                      Hapus foto
                    </button>
                  </div>
                ) : null}
                <label
                  className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 p-4 transition-colors hover:bg-white/60 ${photoPreview ? "sr-only" : ""}`}
                >
                  <ImagePlus className="text-[#6B5B52]" size={26} strokeWidth={1.5} aria-hidden />
                  <span className="text-center text-[12px] leading-snug text-[#797C73]">
                    Unggah foto kondisi ruang, referensi mood, atau sketsa. JPG, PNG, WebP — maks. 25 MB.
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/*" className="sr-only" onChange={handleReferencePhoto} />
                </label>
              </div>
            </div>
            <div className="min-w-0">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
                Dokumen rencana / denah <span className="font-normal normal-case text-[#797C73]">(opsional)</span>
              </span>
              <div className="relative flex min-h-[140px] flex-col border border-dashed border-[#DED6CA] bg-[#FCFBF9]">
                {planDocument ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                    <FileText className="text-[#6B5B52]" size={26} strokeWidth={1.5} aria-hidden />
                    <p className="min-w-0 break-words text-[13px] font-medium text-[#31332C]">{planDocument.name}</p>
                    <button
                      type="button"
                      onClick={() => setPlanDocument(null)}
                      className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#31332C] underline underline-offset-4"
                    >
                      Hapus dokumen
                    </button>
                  </div>
                ) : (
                  <label className="flex min-h-[140px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 p-4 transition-colors hover:bg-white/60">
                    <FileText className="text-[#6B5B52]" size={26} strokeWidth={1.5} aria-hidden />
                    <span className="text-center text-[12px] leading-snug text-[#797C73]">
                      PDF atau Word jika kamu sudah punya denah, layout, atau brief tertulis. Maks. 25 MB.
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only"
                      onChange={handlePlanDocument}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse gap-3 border-t border-[#DED6CA] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-[2px] sm:static sm:z-auto sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-0 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center border border-[#DED6CA] bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C] sm:w-auto sm:min-w-[160px]"
            >
              Simpan draft
            </button>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center bg-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17] sm:w-auto sm:min-w-[200px]"
            >
              Submit permintaan
            </button>
          </div>
        </form>
      </section>

      <aside className="grid gap-3">
        <div className="border border-[#DED6CA] bg-[#31332C] p-5 text-[#F5EFE5]">
          <HelpCircle size={24} />
          <h3 className="mt-4 font-serif text-[25px] leading-7">Brief menjadi project card</h3>
          <p className="mt-3 text-[12px] leading-5 text-[#F5EFE5]/78">
            Setelah submit, project baru muncul di halaman awal. Setiap project punya dashboard dan timeline sendiri.
          </p>
        </div>

        <div className="border border-[#DED6CA] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Lampiran opsional</p>
          <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
            Foto referensi dan dokumen rencana membantu tim memahami ruang lebih cepat. Tanpa lampiran, brief teks tetap bisa
            diproses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-[#DED6CA] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#797C73]">SLA respon</p>
            <p className="mt-2 font-serif text-[22px] text-[#31332C]">1 hari</p>
          </div>
          <div className="border border-[#DED6CA] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#797C73]">File maks.</p>
            <p className="mt-2 font-serif text-[22px] text-[#31332C]">25 MB</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function AiTab() {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsHistoryOpen(false);
  };

  const historyList = (
    <div className="grid gap-2">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => handleConversationSelect(conversation.id)}
          className={`border p-2 text-left transition-colors ${
            activeConversationId === conversation.id ? "border-[#31332C] bg-[#31332C] text-[#F5EFE5]" : "border-[#DED6CA] bg-[#FCFBF9] text-[#31332C] hover:border-[#31332C]"
          }`}
        >
          <p className="truncate font-serif text-[16px] leading-5">{conversation.title}</p>
          <p className={`mt-1 text-[11px] ${activeConversationId === conversation.id ? "text-[#F5EFE5]/70" : "text-[#797C73]"}`}>{conversation.meta}</p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden fade-in lg:flex-row">
      <aside className="hidden max-h-[min(220px,38dvh)] shrink-0 flex-col overflow-hidden border border-[#DED6CA] bg-white lg:flex lg:max-h-none lg:w-[240px] lg:shrink-0">
        <div className="shrink-0 border-b border-[#DED6CA] bg-[#FCFBF9] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">History AI</p>
          <h2 className="mt-1 font-serif text-[20px] leading-6 text-[#31332C]">Percakapan</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-gutter:stable]">
          {historyList}
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 lg:hidden ${isHistoryOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Tutup panel history"
          onClick={() => setIsHistoryOpen(false)}
          className={`absolute inset-0 bg-[#191A17]/45 transition-opacity ${isHistoryOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[280px] max-w-[82vw] flex-col border-r border-[#DED6CA] bg-white transition-transform duration-300 ease-out ${
            isHistoryOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#DED6CA] bg-[#FCFBF9] p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">History AI</p>
              <h2 className="mt-1 font-serif text-[20px] leading-6 text-[#31332C]">Percakapan</h2>
            </div>
            <button
              type="button"
              aria-label="Tutup history chat"
              onClick={() => setIsHistoryOpen(false)}
              className="grid h-9 w-9 shrink-0 place-items-center border border-[#DED6CA] bg-white text-[#31332C]"
            >
              <X size={16} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-gutter:stable]">{historyList}</div>
        </aside>
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#FCFBF9] lg:border lg:border-[#DED6CA] lg:bg-white">
        <div className="shrink-0 px-4 pb-3 pt-4 lg:border-b lg:border-[#DED6CA] lg:bg-[#FCFBF9] lg:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Buka history chat"
              onClick={() => setIsHistoryOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center border border-[#DED6CA] bg-white text-[#31332C] lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#6B5B52] text-white">
              <Bot size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-serif text-[25px] leading-7 text-[#31332C]">{activeConversation.title}</h2>
              <p className="text-[12px] text-[#797C73]">AI brainstorming interior</p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-2 [scrollbar-gutter:stable] lg:p-4">
          <div className="grid gap-3">
            {activeConversation.messages.map((message, index) => (
              <ChatBubble key={`${message.from}-${index}`} from={message.from}>
                {message.text}
              </ChatBubble>
            ))}
          </div>
        </div>

        <div className="shrink-0 px-4 pb-4 pt-2 lg:border-t lg:border-[#DED6CA] lg:bg-white lg:p-3">
          <div className="flex items-center gap-2 border border-[#DED6CA] bg-white p-2 lg:bg-[#FCFBF9]">
            <input
              type="text"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px] outline-none"
              placeholder="Tanya tentang furnitur minimalis..."
            />
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center bg-[#31332C] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MeetTab({ project, onSelectProject }: { project: ClientProject | null; onSelectProject: () => void }) {
  const followUpWaLink = buildWhatsAppFollowUpLink(project);

  return (
    <div className="fade-in flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-start">
      <aside className="flex shrink-0 flex-col border border-[#DED6CA] bg-white lg:w-[280px]">
        <div className="shrink-0 border-b border-[#DED6CA] bg-[#FCFBF9] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">Konsultasi</p>
          <h2 className="mt-1 font-serif text-[24px] leading-7 text-[#31332C]">Jadwal kamu</h2>
        </div>
        <div className="p-3">
          <div className="grid gap-3">
            {!project ? (
              <div className="border border-dashed border-[#DED6CA] bg-[#FCFBF9] p-3">
                <p className="text-[12px] leading-relaxed text-[#797C73]">Pilih project dari Overview untuk melihat jadwal.</p>
                <button
                  type="button"
                  onClick={onSelectProject}
                  className="mt-3 h-9 w-full border border-[#31332C] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]"
                >
                  Pilih project
                </button>
              </div>
            ) : (
              <>
                <div className="border border-[#DED6CA] bg-[#FCFBF9] p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52]">Project</p>
                  <p className="mt-1 font-serif text-[16px] leading-snug text-[#31332C]">{project.title}</p>
                </div>
                {project.consultationDate ? (
                  <div className="border border-[#DED6CA] bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">Terkonfirmasi</p>
                    <p className="mt-2 flex items-start gap-2 font-serif text-[17px] leading-snug text-[#31332C]">
                      <Calendar size={18} className="mt-0.5 shrink-0 text-[#6B5B52]" aria-hidden />
                      <span className="min-w-0 break-words">{project.consultationDate}</span>
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#797C73]">
                      Link Meet dikirim ke email dan WhatsApp.
                    </p>
                    <a
                      href={followUpWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 border border-[#6B5B52] bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52] transition-colors hover:bg-[#6B5B52] hover:text-white"
                    >
                      <MessageSquare size={14} />
                      Follow up WA
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#DED6CA] bg-[#FCFBF9] p-3">
                    <p className="text-[12px] font-medium text-[#31332C]">Belum ada jadwal</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#797C73]">
                      Tentukan tanggal dan waktu di panel kanan.
                    </p>
                    <a
                      href={followUpWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 border border-[#6B5B52] bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52] transition-colors hover:bg-[#6B5B52] hover:text-white"
                    >
                      <MessageSquare size={14} />
                      Follow up WA
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 border-t border-[#DED6CA] bg-[#FCFBF9] p-2">
          <p className="text-[10px] leading-snug text-[#797C73]">
            Slot bisa berubah. Sudah terkonfirmasi? Tidak perlu kunci ulang.
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col border border-[#DED6CA] bg-white">
        <div className="shrink-0 border-b border-[#DED6CA] bg-[#FCFBF9] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#6B5B52] text-white">
              <Calendar size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-[22px] leading-7 text-[#31332C] sm:text-[25px]">Pilih jadwal konsultasi</h2>
              <p className="text-[12px] text-[#797C73]">Google Meet — tanggal dan waktu WIB</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <p className="mb-4 border border-[#DED6CA] bg-[#FCFBF9] px-3 py-2.5 text-[13px] leading-relaxed text-[#797C73]">
            <span className="font-semibold text-[#31332C]">Belum menentukan jadwal konsultasi.</span> Pilih tanggal lalu slot
            waktu; tim mengonfirmasi lewat email dan WhatsApp.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-5">
            <article className="min-w-0 border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:p-5">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">Pilih tanggal</h3>
              <div className="w-full">
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"].map((day) => (
                    <span key={day} className="py-1 text-[11px] font-semibold text-[#797C73]">
                      {day}
                    </span>
                  ))}
                  {Array.from({ length: 30 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`h-10 rounded-sm text-[12px] font-medium transition-colors sm:h-11 ${
                        index === 15
                          ? "bg-[#31332C] text-[#F5EFE5]"
                          : index < 12
                            ? "text-[#DED6CA]"
                            : "bg-white text-[#31332C] hover:bg-[#DED6CA]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            <article className="min-w-0 border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:p-5">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">Pilih waktu WIB</h3>
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
                {["10:00 - 11:00", "13:00 - 14:00", "15:00 - 16:00", "19:00 - 20:00"].map((time, index) => (
                  <button
                    key={time}
                    type="button"
                    className={`border px-3 py-3 text-[12px] font-semibold transition-colors ${
                      index === 1
                        ? "border-[#31332C] bg-[#31332C] text-[#F5EFE5]"
                        : "border-[#DED6CA] bg-white text-[#31332C] hover:border-[#31332C]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#DED6CA] bg-white p-3">
          <button
            type="button"
            className="h-11 w-full bg-[#31332C] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
          >
            Kunci jadwal
          </button>
        </div>
      </section>
    </div>
  );
}

function DocsTab({ project }: { project: ClientProject | null }) {
  const clientPlanDoc =
    project?.planDocumentName != null
      ? [{ title: "Dokumen rencana klien", meta: project.planDocumentName, type: "Unggahan" }]
      : [];

  const docs = [
    ...clientPlanDoc,
    { title: "Brief proyek", meta: project ? project.submittedAt : "Pilih project dahulu", type: "PDF" },
    { title: "Estimasi RAB awal", meta: "Draft internal", type: "XLS" },
    { title: "Referensi material", meta: "Untuk konsultasi", type: "PDF" },
  ];

  return (
    <div className="fade-in">
      <section className="border border-[#DED6CA] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#DED6CA] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Dokumen</p>
            <h2 className="mt-1 font-serif text-[29px] leading-8 text-[#31332C]">{project ? project.title : "RAB dan file proyek"}</h2>
          </div>
          <button className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5] sm:w-fit">
            <FolderOpen size={16} />
            Semua file
          </button>
        </div>
        <div className="grid gap-3">
          {docs.map((doc) => (
            <article key={doc.title} className="flex flex-col gap-3 border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#6B5B52] text-white">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-[22px] leading-7 text-[#31332C]">{doc.title}</h3>
                  <p className="text-[13px] text-[#797C73]">{doc.meta}</p>
                </div>
              </div>
              <button className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[#DED6CA] bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C] sm:w-auto sm:shrink-0">
                <Download size={15} />
                {doc.type}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CatalogTab() {
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogKey | null>(null);
  const activeInspiration = selectedCatalog ? inspirations.find((item) => item.slug === selectedCatalog) : null;
  const catalogDetail =
    selectedCatalog === "featured"
      ? featuredProjects.slice(0, 8).map((project) => ({ title: project.title, copy: project.location, image: project.image }))
      : activeInspiration?.areas.map((area) => ({ title: area.title, copy: area.description, image: area.image })) ?? [];

  return (
    <div className="fade-in">
      <section className="grid border border-[#DED6CA] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#DED6CA] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Katalog</p>
            <h2 className="mt-1 font-serif text-[26px] leading-8 text-[#31332C] sm:text-[29px]">
              {selectedCatalog ? catalogCategories.find((item) => item.key === selectedCatalog)?.label : "Pilih kategori katalog"}
            </h2>
          </div>
          {selectedCatalog ? (
            <button
              type="button"
              onClick={() => setSelectedCatalog(null)}
              className="h-11 w-full shrink-0 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] lg:w-auto"
            >
              Kembali kategori
            </button>
          ) : (
            <div className="flex h-11 min-h-11 items-center gap-2 border border-[#DED6CA] bg-[#FCFBF9] px-3 sm:px-4">
              <Search size={16} className="shrink-0 text-[#6B5B52]" />
              <input
                type="text"
                className="min-h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#797C73] sm:text-[13px]"
                placeholder="Cari gaya atau ruang"
              />
            </div>
          )}
        </div>

        {!selectedCatalog ? (
          <div className="grid gap-3">
            {catalogCategories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setSelectedCatalog(category.key)}
                className="group grid gap-4 border border-[#DED6CA] bg-[#FCFBF9] p-3 text-left transition-colors hover:border-[#31332C] sm:grid-cols-[220px_1fr_auto] sm:items-center"
              >
                <div className="relative h-36 overflow-hidden bg-[#DED6CA] sm:h-28">
                  <Image src={category.image} alt={category.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="280px" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6B5B52]">Kategori</p>
                  <h3 className="mt-1 font-serif text-[24px] leading-8 text-[#31332C] sm:text-[26px]">{category.label}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
                    Buka kumpulan referensi, area, dan mood visual untuk kategori {category.label}.
                  </p>
                </div>
                <span className="inline-flex h-11 items-center justify-center border border-[#DED6CA] bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] sm:h-auto sm:py-3">
                  Lihat katalog
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {catalogDetail.slice(0, 8).map((item) => (
              <article key={item.title} className="grid min-h-[280px] grid-rows-[1fr_auto] overflow-hidden border border-[#DED6CA] bg-[#FCFBF9]">
                <div className="relative min-h-0 overflow-hidden bg-[#DED6CA]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className={`object-cover ${item.image.className ?? ""}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="truncate font-serif text-[21px] leading-6 text-[#31332C]">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#797C73]">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">{label}</span>
      {children}
    </label>
  );
}

function ChatBubble({ from, children }: { from: "bot" | "user"; children: React.ReactNode }) {
  const isUser = from === "user";

  return (
    <div className={`flex min-h-0 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[76%] self-center px-5 py-4 text-[14px] leading-6 ${
          isUser ? "bg-[#31332C] text-[#F5EFE5]" : "bg-[#FCFBF9] text-[#31332C]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function buildWhatsAppFollowUpLink(project: ClientProject | null): string {
  const projectLabel = project?.title ?? "project saya";
  const message = `Halo tim VMatch, saya mau follow up update untuk ${projectLabel}.`;
  return `https://wa.me/${TEAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
