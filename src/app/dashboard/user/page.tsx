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
  Images,
  LogOut,
  MessageSquare,
  PenTool,
  Plus,
  Ruler,
  Search,
  Send,
  Video,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
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

  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-[#FCFBF9]">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full px-3 pb-3 pt-3 sm:px-4 lg:px-5">
        <section className="mx-auto flex w-full max-w-[1600px] flex-col">
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
          <Link
            href="/login"
            aria-label="Keluar"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F5EFE5]/18 bg-[#F5EFE5]/8 text-[#F5EFE5] transition-colors hover:bg-[#F5EFE5] hover:text-[#31332C] lg:hidden"
          >
            <LogOut size={17} />
          </Link>
        </div>

        <nav className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
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
      <div className="flex items-end justify-between gap-4 border-b border-[#DED6CA] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B5B52]">Project hub</p>
          <h1 className="mt-1 font-serif text-[30px] leading-8 text-[#31332C]">Pilih dashboard proyek</h1>
        </div>
        <button
          type="button"
          onClick={onCreateProject}
          className="inline-flex h-11 items-center gap-2 bg-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
        >
          <Plus size={16} />
          Tambah project
        </button>
      </div>

      <div className="grid justify-start gap-3 p-3 sm:grid-cols-[repeat(auto-fill,minmax(220px,240px))]">
          {projects.map((project) => (
            <article key={project.id} className="flex aspect-square w-full max-w-[260px] flex-col border border-[#DED6CA] bg-[#FCFBF9] p-3">
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
                    <p className="truncate text-[12px] leading-5 text-[#31332C]">{project.consultationDate}</p>
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
      <div className="grid shrink-0 gap-3 lg:grid-cols-[minmax(270px,380px)_1fr_auto]">
        <article className="flex items-center gap-3 border border-[#DED6CA] bg-white p-3">
          <button type="button" onClick={onBack} className="grid h-11 w-11 shrink-0 place-items-center border border-[#DED6CA] text-[#31332C] transition-colors hover:border-[#31332C]">
            <ArrowLeft size={17} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">Dashboard proyek</p>
            <h1 className="mt-1 truncate font-serif text-[25px] font-medium leading-none text-[#31332C]">{project.title}</h1>
            <p className="mt-2 text-[13px] leading-5 text-[#797C73]">{project.location}</p>
          </div>
        </article>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="border border-[#DED6CA] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#797C73]">{item.label}</p>
                  <Icon className="shrink-0 text-[#6B5B52]" size={18} />
                </div>
                <p className="mt-3 truncate font-serif text-[20px] leading-6 text-[#31332C]">{item.value}</p>
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
          <div className="flex items-end justify-between gap-4 border-b border-[#DED6CA] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B5B52]">Project timeline</p>
              <h2 className="mt-1 font-serif text-[29px] font-medium leading-8 text-[#31332C]">{project.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("meet")}
              className="hidden h-11 items-center gap-2 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5] sm:inline-flex"
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
                      <div className="relative overflow-hidden bg-[#DED6CA]">
                        <Image src={item.image} alt={`Progress ${item.title}`} fill className="object-cover" sizes="260px" />
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
                <p className="mt-2 font-serif text-[24px] leading-7 text-[#31332C]">{project.consultationDate}</p>
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
          </article>
        </aside>
      </div>
    </div>
  );
}

function BriefTab({ onCreateProject }: { onCreateProject: (project: ClientProject) => void }) {
  const [property, setProperty] = useState("Apartemen");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [projectStart, setProjectStart] = useState("");
  const [projectEnd, setProjectEnd] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const submitBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const count = Date.now().toString().slice(-4);
    onCreateProject({
      id: `project-${count}`,
      title: `Project ${count} - ${property}`,
      property,
      location: location || "Lokasi belum diisi",
      budget: budget || "Budget belum diisi",
      projectStart: projectStart || "Start belum diisi",
      projectEnd: projectEnd || "End belum diisi",
      duration: duration || "Durasi belum diisi",
      status: "Brief baru",
      submittedAt: "3 Mei 2026",
      image: property === "Rumah tapak" ? "/inspirations/rumah-hero.webp" : "/inspirations/apartment-hero.webp",
      progressReports: [
        {
          id: `report-${count}-brief`,
          title: "Request projek",
          description: "Brief baru sudah masuk. Admin akan review kebutuhan dan menyiapkan langkah berikutnya.",
          date: "3 Mei 2026",
          status: "Saat ini",
          image: property === "Rumah tapak" ? "/inspirations/rumah-hero.webp" : "/inspirations/apartment-hero.webp",
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
    <div className="grid gap-3 fade-in lg:grid-cols-[1fr_360px]">
      <section className="border border-[#DED6CA] bg-white p-4 sm:p-5 lg:p-6">
        <div className="mb-4 border-b border-[#DED6CA] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Pengajuan proyek</p>
          <h2 className="mt-1 font-serif text-[29px] font-medium leading-8 text-[#31332C]">Kuesioner detail proyek</h2>
        </div>

        <form onSubmit={submitBrief} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tipe properti">
              <select className="field-control" value={property} onChange={(event) => setProperty(event.target.value)}>
                <option>Apartemen</option>
                <option>Rumah tapak</option>
                <option>Kantor / ruko</option>
                <option>Hotel / komersial</option>
              </select>
            </Field>
            <Field label="Lokasi proyek">
              <input className="field-control" value={location} onChange={(event) => setLocation(event.target.value)} type="text" placeholder="Jakarta Selatan" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Estimasi budget">
              <input className="field-control" value={budget} onChange={(event) => setBudget(event.target.value)} type="text" placeholder="Rp 100-140 jt" />
            </Field>
            <Field label="Start project">
              <input className="field-control" value={projectStart} onChange={(event) => setProjectStart(event.target.value)} type="text" placeholder="Mei 2026" />
            </Field>
            <Field label="End project">
              <input className="field-control" value={projectEnd} onChange={(event) => setProjectEnd(event.target.value)} type="text" placeholder="Agustus 2026" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <Field label="Estimasi durasi">
              <input className="field-control" value={duration} onChange={(event) => setDuration(event.target.value)} type="text" placeholder="3 bulan" />
            </Field>
            <div className="border border-[#DED6CA] bg-[#FCFBF9] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Rentang proyek</p>
              <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
                Isi perkiraan start dan end agar tim bisa menyusun jadwal konsultasi, RAB, produksi, dan instalasi dengan jelas.
              </p>
            </div>
          </div>

          <Field label="Kebutuhan desain dan referensi tone">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field-control min-h-32 resize-none"
              placeholder="Contoh: dominan walnut, storage tertutup, ruang tamu lebih terang, dan kitchen set mudah dibersihkan."
            />
          </Field>

          <div className="grid shrink-0 gap-3 sm:grid-cols-2">
            <button
              type="submit"
              className="inline-flex h-12 min-w-0 items-center justify-center bg-[#31332C] px-5 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
            >
              Submit permintaan
            </button>
            <button
              type="button"
              className="inline-flex h-12 min-w-0 items-center justify-center border border-[#DED6CA] px-5 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C]"
            >
              Simpan draft
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Form tanpa foto</p>
          <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
            Pengajuan awal cukup brief teks: tipe properti, lokasi, budget, rentang waktu, dan kebutuhan desain.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];

  return (
    <div className="grid h-[calc(100dvh-128px)] min-h-[620px] w-full gap-3 overflow-hidden fade-in lg:grid-cols-[240px_1fr]">
      <aside className="grid min-h-0 grid-rows-[auto_1fr] overflow-hidden border border-[#DED6CA] bg-white">
        <div className="border-b border-[#DED6CA] bg-[#FCFBF9] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">History AI</p>
          <h2 className="mt-1 font-serif text-[20px] leading-6 text-[#31332C]">Percakapan</h2>
        </div>
        <div className="grid content-start gap-2 overflow-hidden p-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveConversationId(conversation.id)}
              className={`border p-2 text-left transition-colors ${
                activeConversationId === conversation.id ? "border-[#31332C] bg-[#31332C] text-[#F5EFE5]" : "border-[#DED6CA] bg-[#FCFBF9] text-[#31332C] hover:border-[#31332C]"
              }`}
            >
              <p className="truncate font-serif text-[16px] leading-5">{conversation.title}</p>
              <p className={`mt-1 text-[11px] ${activeConversationId === conversation.id ? "text-[#F5EFE5]/70" : "text-[#797C73]"}`}>{conversation.meta}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="grid min-h-0 grid-rows-[auto_1fr_auto] overflow-hidden border border-[#DED6CA] bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#DED6CA] bg-[#FCFBF9] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#6B5B52] text-white">
              <Bot size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-serif text-[25px] leading-7 text-[#31332C]">{activeConversation.title}</h2>
              <p className="text-[12px] text-[#797C73]">AI brainstorming interior</p>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 gap-3 overflow-y-auto p-4">
          {activeConversation.messages.map((message, index) => (
            <ChatBubble key={`${message.from}-${index}`} from={message.from}>
              {message.text}
            </ChatBubble>
          ))}
        </div>

        <div className="border-t border-[#DED6CA] bg-white p-3">
          <div className="flex items-center gap-2 border border-[#DED6CA] bg-[#FCFBF9] p-2">
            <input
              type="text"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px] outline-none"
              placeholder="Tanya tentang furnitur minimalis..."
            />
            <button className="grid h-10 w-10 shrink-0 place-items-center bg-[#31332C] text-[#F5EFE5] transition-colors hover:bg-[#191A17]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MeetTab({ project, onSelectProject }: { project: ClientProject | null; onSelectProject: () => void }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-3 fade-in lg:grid-cols-[1fr_320px]">
      <section className="border border-[#DED6CA] bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-[#DED6CA] pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Konsultasi</p>
            <h2 className="mt-1 font-serif text-[29px] leading-8 text-[#31332C]">Pilih jadwal Google Meet</h2>
          </div>
          <p className="w-fit border border-[#DED6CA] bg-[#FCFBF9] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
            3 slot tersedia
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="border border-[#DED6CA] bg-[#FCFBF9] p-4">
            <h3 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
              <Calendar size={17} />
              Pilih tanggal
            </h3>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"].map((day) => (
                <span key={day} className="text-[11px] font-semibold text-[#797C73]">{day}</span>
              ))}
              {Array.from({ length: 30 }).map((_, index) => (
                <button
                  key={index}
                  className={`aspect-square text-[12px] font-medium transition-colors ${
                    index === 15 ? "bg-[#31332C] text-[#F5EFE5]" : index < 12 ? "text-[#DED6CA]" : "bg-white text-[#31332C] hover:bg-[#DED6CA]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </article>

          <article className="flex flex-col border border-[#DED6CA] bg-[#FCFBF9] p-4">
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">Pilih waktu WIB</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {["10:00 - 11:00", "13:00 - 14:00", "15:00 - 16:00", "19:00 - 20:00"].map((time, index) => (
                <button
                  key={time}
                  className={`border px-3 py-3 text-[12px] font-semibold transition-colors ${
                    index === 1 ? "border-[#31332C] bg-[#31332C] text-[#F5EFE5]" : "border-[#DED6CA] bg-white text-[#31332C] hover:border-[#31332C]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="mt-auto h-11 bg-[#6B5B52] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#31332C]">
              Kunci jadwal
            </button>
          </article>
        </div>
      </section>

      <aside className="border border-[#DED6CA] bg-[#31332C] p-5 text-[#F5EFE5]">
        <Video size={25} />
        <h3 className="mt-4 font-serif text-[25px] leading-7">{project ? project.title : "Belum pilih project"}</h3>
        <p className="mt-3 text-[12px] leading-5 text-[#F5EFE5]/78">
          {project
            ? "Setelah jadwal dikunci, link Google Meet akan dikirim ke email dan WhatsApp. Mohon cek inbox, spam, dan chat WA sebelum sesi dimulai."
            : "Pilih project dari Overview agar jadwal masuk ke dashboard yang benar."}
        </p>
        {!project && (
          <button type="button" onClick={onSelectProject} className="mt-5 h-10 border border-[#F5EFE5]/25 px-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
            Pilih project
          </button>
        )}
      </aside>
    </div>
  );
}

function DocsTab({ project }: { project: ClientProject | null }) {
  const docs = [
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
          <button className="inline-flex h-11 w-fit items-center gap-2 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]">
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
              <button className="inline-flex h-10 items-center justify-center gap-2 border border-[#DED6CA] bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C]">
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
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Katalog</p>
            <h2 className="mt-1 font-serif text-[29px] leading-8 text-[#31332C]">
              {selectedCatalog ? catalogCategories.find((item) => item.key === selectedCatalog)?.label : "Pilih kategori katalog"}
            </h2>
          </div>
          {selectedCatalog ? (
            <button type="button" onClick={() => setSelectedCatalog(null)} className="h-11 border border-[#31332C] px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
              Kembali kategori
            </button>
          ) : (
            <div className="flex h-11 items-center gap-2 border border-[#DED6CA] bg-[#FCFBF9] px-4">
              <Search size={16} className="text-[#6B5B52]" />
              <input type="text" className="min-w-0 bg-transparent text-[13px] outline-none placeholder:text-[#797C73]" placeholder="Cari gaya atau ruang" />
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
                  <h3 className="mt-1 font-serif text-[26px] leading-8 text-[#31332C]">{category.label}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
                    Buka kumpulan referensi, area, dan mood visual untuk kategori {category.label}.
                  </p>
                </div>
                <span className="hidden border border-[#DED6CA] bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] sm:inline-flex">
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
