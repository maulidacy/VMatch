"use client";

import {
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  FileText,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Users2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AdminTabId = "board" | "todos" | "clients";
type ActivityStatus = "Berjalan" | "Selesai";
type Stage = "Request Projek" | "Review Brief" | "Konsultasi" | "Progres Pengerjaan" | "Selesai";

type AdminTab = {
  id: AdminTabId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

type ProgressActivity = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  status: ActivityStatus;
};

type ProjectCardData = {
  id: string;
  client: string;
  property: string;
  location: string;
  projectStart: string;
  projectEnd: string;
  duration: string;
  style: string;
  formNotes: string;
  stage: Stage;
  time: string;
  copy: string;
  image: string;
  request: string[];
  meet: string;
  budget: string;
  activities: ProgressActivity[];
};

type BriefUpdate = Pick<
  ProjectCardData,
  "property" | "location" | "budget" | "projectStart" | "projectEnd" | "duration" | "style" | "formNotes"
>;

const tabs: AdminTab[] = [
  { id: "board", label: "Proyek Aktif", shortLabel: "Proyek", icon: LayoutDashboard },
  { id: "todos", label: "Task List", shortLabel: "Task", icon: CheckSquare },
  { id: "clients", label: "Client Database", shortLabel: "Client", icon: Users2 },
];

const stages: Stage[] = ["Request Projek", "Review Brief", "Konsultasi", "Progres Pengerjaan", "Selesai"];

const initialProjects: ProjectCardData[] = [
  {
    id: "nadya",
    client: "Nadya P.",
    property: "Apartemen 2BR",
    location: "Jakarta Selatan",
    projectStart: "Mei 2026",
    projectEnd: "Agustus 2026",
    duration: "3 bulan",
    style: "Japandi light wood",
    formNotes: "Ruang tamu dibuat lebih terang, storage tertutup, dan pantry compact tetap mudah dibersihkan.",
    stage: "Request Projek",
    time: "Baru saja",
    copy: "Ingin gaya Japandi light wood. Butuh estimasi RAB awal dan kurasi vendor.",
    image: "/testimonials/client-1.webp",
    request: ["Living room terang", "Storage tertutup", "Dominan light wood", "Butuh estimasi RAB"],
    meet: "Belum mengajukan konsultasi",
    budget: "Rp 100-140 jt",
    activities: [
      {
        id: "nadya-1",
        title: "Brief masuk",
        description: "Foto ruang tamu, ukuran area, dan preferensi warna sudah diterima.",
        date: "3 Mei 2026",
        image: "/inspirations/apartment-living-area.webp",
        status: "Selesai",
      },
      {
        id: "nadya-2",
        title: "Kurasi referensi",
        description: "Tim menyiapkan moodboard awal untuk living dan pantry compact.",
        date: "4 Mei 2026",
        image: "/figma/project-walnut.webp",
        status: "Berjalan",
      },
    ],
  },
  {
    id: "kevin",
    client: "Kevin A.",
    property: "Rumah tapak",
    location: "Tangerang Selatan",
    projectStart: "Juni 2026",
    projectEnd: "Oktober 2026",
    duration: "4 bulan",
    style: "Modern warm minimal",
    formNotes: "Butuh storage tambahan kamar utama, kitchen set tahan lembap, dan opsi material yang tidak sulit dirawat.",
    stage: "Konsultasi",
    time: "Hari ini, 14:00",
    copy: "Google Meet untuk membahas prioritas storage dan batas anggaran produksi.",
    image: "/testimonials/client-2.webp",
    request: ["Tambah storage kamar", "Kitchen set mudah dibersihkan", "Material tahan lembap"],
    meet: "Hari ini, 14:00 WIB",
    budget: "Rp 180-230 jt",
    activities: [
      {
        id: "kevin-1",
        title: "Survey layout",
        description: "Area dapur dan kamar utama sudah dipetakan untuk kebutuhan storage.",
        date: "2 Mei 2026",
        image: "/inspirations/rumah-dapur.webp",
        status: "Selesai",
      },
      {
        id: "kevin-2",
        title: "Google Meet",
        description: "Menunggu diskusi prioritas material dan timeline produksi.",
        date: "3 Mei 2026",
        image: "/figma/process-bg.webp",
        status: "Berjalan",
      },
    ],
  },
  {
    id: "ruang-karya",
    client: "PT Ruang Karya",
    property: "Perkantoran",
    location: "Jakarta Pusat",
    projectStart: "Juli 2026",
    projectEnd: "November 2026",
    duration: "4 bulan",
    style: "Clean office",
    formNotes: "Revisi layout 18 meja kerja, pantry ringkas, ruang meeting akustik, dan sirkulasi team lebih lega.",
    stage: "Konsultasi",
    time: "Besok",
    copy: "Revisi layout meja co-working dan kebutuhan akustik ruang meeting.",
    image: "/testimonials/client-3.webp",
    request: ["Layout 18 meja kerja", "Ruang meeting akustik", "Pantry ringkas", "Revisi layout kedua"],
    meet: "Besok, 10:00 WIB",
    budget: "Rp 320-410 jt",
    activities: [
      {
        id: "rk-1",
        title: "Revisi layout",
        description: "Perubahan alur meja kerja dan area meeting sudah diterima.",
        date: "3 Mei 2026",
        image: "/inspirations/hotel-reception.webp",
        status: "Berjalan",
      },
    ],
  },
  {
    id: "mira",
    client: "Mira H.",
    property: "Kitchen set",
    location: "Bandung",
    projectStart: "Mei 2026",
    projectEnd: "Juli 2026",
    duration: "2 bulan",
    style: "Walnut compact",
    formNotes: "Kitchen set custom dengan finishing walnut, top table stone, dan jadwal produksi yang jelas.",
    stage: "Progres Pengerjaan",
    time: "2 hari lagi",
    copy: "Draft material sudah disetujui. Menunggu finalisasi jadwal produksi.",
    image: "/figma/philosophy-logo.webp",
    request: ["Kitchen set custom", "Finishing walnut", "Top table stone", "Jadwal produksi jelas"],
    meet: "Konsultasi selesai",
    budget: "Rp 85-115 jt",
    activities: [
      {
        id: "mira-1",
        title: "Draft RAB",
        description: "RAB awal dikirim dengan dua opsi finishing dan aksesoris kabinet.",
        date: "1 Mei 2026",
        image: "/inspirations/rumah-dapur.webp",
        status: "Selesai",
      },
      {
        id: "mira-2",
        title: "Finalisasi jadwal",
        description: "Menunggu konfirmasi slot produksi dari workshop partner.",
        date: "4 Mei 2026",
        image: "/figma/benefits-kitchen.webp",
        status: "Berjalan",
      },
    ],
  },
];

const tasks = [
  { title: "Kirim recap konsultasi Nadya", meta: "Hari ini", icon: MessageSquare },
  { title: "Cek ulang ukuran kitchen set Mira", meta: "Besok", icon: FileText },
  { title: "Konfirmasi slot meeting Kevin", meta: "14:00 WIB", icon: Video },
  { title: "Update database vendor Bandung", meta: "Minggu ini", icon: Users2 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("board");

  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-[#FCFBF9]">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full px-3 pb-3 pt-3 sm:px-4 lg:px-5">
        <section className="mx-auto flex w-full max-w-[1600px] flex-col">
          {activeTab === "board" && <BoardTab />}
          {activeTab === "todos" && <TasksTab />}
          {activeTab === "clients" && <ClientsTab />}
        </section>
      </div>
    </main>
  );
}

function DashboardHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: AdminTabId;
  setActiveTab: (tab: AdminTabId) => void;
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
              Team
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

function BoardTab() {
  const [adminProjects, setAdminProjects] = useState<ProjectCardData[]>(initialProjects);
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const detailProject = detailProjectId ? adminProjects.find((project) => project.id === detailProjectId) ?? null : null;

  useEffect(() => {
    if (!detailProject) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [detailProject]);

  const groupedProjects = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        cards: adminProjects.filter((project) => project.stage === stage),
      })),
    [adminProjects],
  );

  const updateProject = (projectId: string, updater: (project: ProjectCardData) => ProjectCardData) => {
    setAdminProjects((current) => current.map((project) => (project.id === projectId ? updater(project) : project)));
  };

  const moveProject = (projectId: string, stage: Stage) => {
    setAdminProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              stage,
              activities:
                stage === "Selesai"
                  ? project.activities.map((activity) => ({ ...activity, status: "Selesai" }))
                  : project.activities,
            }
          : project,
      ),
    );
  };

  const handleDrop = (event: DragEvent<HTMLElement>, stage: Stage) => {
    event.preventDefault();
    const projectId = event.dataTransfer.getData("text/plain") || draggedProjectId;
    if (projectId) {
      moveProject(projectId, stage);
    }
    setDraggedProjectId(null);
  };

  return (
    <div className="flex flex-col gap-3 fade-in">
      <div className="grid shrink-0 gap-3 lg:grid-cols-[1fr_auto]">
        <div className="border border-[#DED6CA] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Team dashboard</p>
          <h1 className="mt-1 font-serif text-[29px] font-medium leading-8 text-[#31332C]">Pipeline proyek aktif</h1>
          <p className="mt-2 max-w-[680px] text-[13px] leading-5 text-[#797C73]">
            Drag card antar kolom seperti Jira, lalu klik pelanggan untuk melihat brief, meet, dan progress.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-[#DED6CA] bg-white text-center lg:min-w-[420px]">
          <Metric value={adminProjects.length.toString()} label="Proyek" />
          <Metric value={adminProjects.filter((project) => project.meet.includes("WIB")).length.toString()} label="Meeting" />
          <Metric value={adminProjects.filter((project) => isProjectDone(project)).length.toString()} label="Selesai" />
        </div>
      </div>

      <div className="grid min-w-0 gap-3 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
          {groupedProjects.map((column) => (
            <section
              key={column.stage}
              className="flex min-h-[340px] min-w-0 flex-col border border-[#DED6CA] bg-[#FCFBF9]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, column.stage)}
            >
              <div className="flex min-w-0 items-center justify-between gap-2 border-b border-[#DED6CA] bg-white px-3 py-3">
                <h2 className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">{column.stage}</h2>
                <span className="grid h-7 min-w-7 place-items-center border border-[#DED6CA] px-2 text-[11px] font-semibold text-[#6B5B52]">
                  {column.cards.length}
                </span>
              </div>

              <div className="grid min-w-0 gap-2 p-2">
                {column.cards.length > 0 ? (
                  column.cards.map((card) => (
                    <ProjectCard
                      key={card.id}
                      card={card}
                      isSelected={detailProject?.id === card.id}
                      onOpen={() => setDetailProjectId(card.id)}
                      onDragStart={() => setDraggedProjectId(card.id)}
                    />
                  ))
                ) : (
                  <div className="grid min-h-32 place-items-center border border-dashed border-[#DED6CA] bg-white p-4 text-center">
                    <p className="text-[12px] leading-5 text-[#797C73]">Belum ada proyek di tahap ini.</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <BoardInsightPanel projects={adminProjects} onOpenProject={setDetailProjectId} />
      </div>

      {detailProject && (
        <ClientDetailPanel
          key={detailProject.id}
          project={detailProject}
          onClose={() => setDetailProjectId(null)}
          onSaveBrief={(brief) => updateProject(detailProject.id, (project) => ({ ...project, ...brief }))}
          onAddActivity={(activity) =>
            updateProject(detailProject.id, (project) => ({ ...project, activities: [activity, ...project.activities] }))
          }
          onCompleteActivity={(activityId) =>
            updateProject(detailProject.id, (project) => ({
              ...project,
              activities: project.activities.map((activity) =>
                activity.id === activityId ? { ...activity, status: "Selesai" } : activity,
              ),
            }))
          }
        />
      )}
    </div>
  );
}

function BoardInsightPanel({
  projects,
  onOpenProject,
}: {
  projects: ProjectCardData[];
  onOpenProject: (projectId: string) => void;
}) {
  const nextMeet = projects.find((project) => project.meet.includes("WIB"));
  const needsReview = projects.filter((project) => project.stage === "Request Projek" || project.stage === "Review Brief");
  const latestActivityProject = projects.find((project) => project.activities.some((activity) => activity.status === "Berjalan")) ?? projects[0];
  const latestActivity = latestActivityProject.activities.find((activity) => activity.status === "Berjalan") ?? latestActivityProject.activities[0];

  return (
    <aside className="grid content-start gap-3">
      <section className="border border-[#DED6CA] bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Fokus hari ini</p>
        <h2 className="mt-2 font-serif text-[22px] leading-6 text-[#31332C]">Ringkasan tim</h2>
        <div className="mt-3 grid grid-cols-3 border border-[#DED6CA] bg-[#FCFBF9] text-center">
          <SmallMetric value={projects.filter((project) => project.stage === "Request Projek").length.toString()} label="Request" />
          <SmallMetric value={projects.filter((project) => project.stage === "Konsultasi").length.toString()} label="Meet" />
          <SmallMetric value={projects.filter((project) => project.stage === "Progres Pengerjaan").length.toString()} label="Progress" />
        </div>
      </section>

      <section className="border border-[#DED6CA] bg-white p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Jadwal meet</p>
            <h3 className="mt-2 font-serif text-[20px] leading-6 text-[#31332C]">{nextMeet ? nextMeet.client : "Belum ada meet"}</h3>
          </div>
          <Video size={17} className="text-[#6B5B52]" />
        </div>
        <p className="mt-2 text-[12px] leading-5 text-[#797C73]">{nextMeet ? nextMeet.meet : "Tidak ada jadwal konsultasi yang perlu dikonfirmasi."}</p>
        {nextMeet && (
          <button
            type="button"
            onClick={() => onOpenProject(nextMeet.id)}
            className="mt-3 h-9 w-full border border-[#31332C] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]"
          >
            Buka detail
          </button>
        )}
      </section>

      <section className="border border-[#DED6CA] bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">Brief perlu dicek</p>
        <div className="mt-3 grid gap-2">
          {needsReview.length > 0 ? (
            needsReview.slice(0, 3).map((project) => (
              <button
                key={`review-${project.id}`}
                type="button"
                onClick={() => onOpenProject(project.id)}
                className="grid gap-1 border border-[#DED6CA] bg-[#FCFBF9] p-2 text-left transition-colors hover:border-[#31332C]"
              >
                <span className="truncate font-serif text-[18px] leading-5 text-[#31332C]">{project.client}</span>
                <span className="truncate text-[11px] text-[#797C73]">{project.property} - {project.budget}</span>
              </button>
            ))
          ) : (
            <p className="border border-dashed border-[#DED6CA] bg-[#FCFBF9] p-3 text-[12px] leading-5 text-[#797C73]">Tidak ada brief baru.</p>
          )}
        </div>
      </section>

      <section className="border border-[#DED6CA] bg-[#31332C] p-3 text-[#F5EFE5]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F5EFE5]/70">Progress aktif</p>
        <h3 className="mt-2 font-serif text-[21px] leading-6">{latestActivityProject.client}</h3>
        <p className="mt-2 text-[12px] leading-5 text-[#F5EFE5]/78">{latestActivity?.title ?? "Belum ada kegiatan"} - {latestActivity?.date ?? "Belum dijadwalkan"}</p>
        <button
          type="button"
          onClick={() => onOpenProject(latestActivityProject.id)}
          className="mt-3 h-9 w-full border border-[#F5EFE5]/30 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#F5EFE5] hover:text-[#31332C]"
        >
          Kelola progress
        </button>
      </section>
    </aside>
  );
}

function TasksTab() {
  return (
    <div className="fade-in">
      <section className="border border-[#DED6CA] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#DED6CA] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Task list</p>
            <h1 className="mt-1 font-serif text-[29px] leading-8 text-[#31332C]">Prioritas tim</h1>
          </div>
          <p className="w-fit border border-[#DED6CA] bg-[#FCFBF9] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
            {tasks.length} task
          </p>
        </div>

        <div className="grid gap-3">
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <article key={task.title} className="flex flex-col gap-3 border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#6B5B52] text-white">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-[22px] leading-7 text-[#31332C]">{task.title}</h2>
                    <p className="mt-1 flex items-center gap-2 text-[13px] text-[#797C73]">
                      <Clock size={14} />
                      {task.meta}
                    </p>
                  </div>
                </div>
                <button className="h-10 border border-[#DED6CA] bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C]">
                  Tandai selesai
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ClientsTab() {
  return (
    <div className="fade-in">
      <section className="border border-[#DED6CA] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#DED6CA] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5B52]">Client database</p>
            <h1 className="mt-1 font-serif text-[29px] leading-8 text-[#31332C]">Klien dan proyek</h1>
          </div>
          <div className="flex h-11 items-center gap-2 border border-[#DED6CA] bg-[#FCFBF9] px-4">
            <Search size={16} className="text-[#6B5B52]" />
            <input
              className="min-w-0 bg-transparent text-[13px] outline-none placeholder:text-[#797C73]"
              placeholder="Cari client"
              type="text"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {initialProjects.slice(0, 3).map((client) => (
            <article key={client.id} className="grid gap-4 border border-[#DED6CA] bg-[#FCFBF9] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[#DED6CA]">
                  <Image src={client.image} alt={`Foto ${client.client}`} fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-[24px] leading-7 text-[#31332C]">{client.client}</h2>
                  <p className="mt-1 text-[13px] text-[#797C73]">{client.property}</p>
                </div>
              </div>
              <span className="w-fit border border-[#DED6CA] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                {client.stage}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectCard({
  card,
  isSelected,
  onOpen,
  onDragStart,
}: {
  card: ProjectCardData;
  isSelected: boolean;
  onOpen: () => void;
  onDragStart: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", card.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      className={`min-w-0 cursor-grab border bg-white p-2 transition-colors active:cursor-grabbing hover:border-[#31332C] ${
        isSelected ? "border-[#31332C]" : "border-[#DED6CA]"
      }`}
    >
      <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 truncate border border-[#DED6CA] bg-[#FCFBF9] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52]">
          {card.property}
        </span>
        <span className="max-w-[64px] shrink-0 truncate text-right text-[10px] text-[#797C73]">{card.time}</span>
      </div>
      <div className="flex min-w-0 gap-2">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden bg-[#DED6CA]">
          <Image src={card.image} alt={`Foto ${card.client}`} fill className="object-cover" sizes="32px" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-serif text-[17px] leading-5 text-[#31332C]">{card.client}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#797C73]">{card.copy}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-2 h-8 w-full bg-[#31332C] px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
      >
        Buka detail
      </button>
    </article>
  );
}

function ClientDetailPanel({
  project,
  onClose,
  onSaveBrief,
  onAddActivity,
  onCompleteActivity,
}: {
  project: ProjectCardData;
  onClose: () => void;
  onSaveBrief: (brief: BriefUpdate) => void;
  onAddActivity: (activity: ProgressActivity) => void;
  onCompleteActivity: (activityId: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [briefDraft, setBriefDraft] = useState<BriefUpdate>(() => pickBrief(project));
  const projectDone = isProjectDone(project);
  const hasMeet = project.meet.includes("WIB");

  const saveBrief = () => {
    onSaveBrief(briefDraft);
    setIsEditingBrief(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[150px] z-40 bg-[#FCFBF9] px-3 pb-3 sm:top-[112px] lg:top-[88px]"
      role="dialog"
      aria-modal="true"
    >
      <section className="mx-auto grid h-full w-full max-w-[1600px] grid-rows-[auto_1fr] overflow-hidden border border-[#DED6CA] bg-white shadow-[0_18px_70px_rgba(25,26,23,0.16)]">
        <div className="border-b border-[#DED6CA] bg-[#FCFBF9] p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B5B52]">Detail pelanggan</p>
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="truncate font-serif text-[28px] leading-8 text-[#31332C]">{project.client}</h2>
                <span className="border border-[#DED6CA] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                  {project.stage}
                </span>
                <span className="border border-[#DED6CA] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                  {projectDone ? "Selesai" : "Aktif"}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-5 text-[#797C73]">
                {project.property} - {project.location} - {project.budget}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-full border border-[#31332C] bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5] sm:w-fit"
            >
              Tutup detail
            </button>
          </div>
        </div>

      <div className="grid min-h-0 gap-3 overflow-y-auto p-3 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid content-start gap-3">
        <section className="border border-[#DED6CA] bg-[#FCFBF9] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31332C]">Hasil form user</h3>
              <p className="mt-2 font-serif text-[22px] leading-7 text-[#31332C]">{isEditingBrief ? briefDraft.property : project.property}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingBrief((current) => !current)}
              className="shrink-0 border border-[#DED6CA] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C]"
            >
              {isEditingBrief ? "Batal" : "Edit brief"}
            </button>
          </div>
          {isEditingBrief ? (
            <div className="mt-3 grid gap-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <BriefField label="Tipe properti">
                  <input
                    value={briefDraft.property}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, property: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
                <BriefField label="Lokasi">
                  <input
                    value={briefDraft.location}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, location: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
                <BriefField label="Budget">
                  <input
                    value={briefDraft.budget}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, budget: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
                <BriefField label="Gaya">
                  <input
                    value={briefDraft.style}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, style: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <BriefField label="Start project">
                  <input
                    value={briefDraft.projectStart}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, projectStart: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
                <BriefField label="End project">
                  <input
                    value={briefDraft.projectEnd}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, projectEnd: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
                <BriefField label="Durasi">
                  <input
                    value={briefDraft.duration}
                    onChange={(event) => setBriefDraft((current) => ({ ...current, duration: event.target.value }))}
                    className="field-control bg-white"
                  />
                </BriefField>
              </div>
              <BriefField label="Catatan brief">
                <textarea
                  value={briefDraft.formNotes}
                  onChange={(event) => setBriefDraft((current) => ({ ...current, formNotes: event.target.value }))}
                  className="field-control min-h-24 resize-none bg-white"
                />
              </BriefField>
              <button
                type="button"
                onClick={saveBrief}
                className="h-10 bg-[#31332C] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
              >
                Simpan perubahan
              </button>
            </div>
          ) : (
            <>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <BriefItem label="Lokasi" value={project.location} />
                <BriefItem label="Start project" value={project.projectStart} />
                <BriefItem label="End project" value={project.projectEnd} />
                <BriefItem label="Durasi" value={project.duration} />
                <BriefItem label="Gaya" value={project.style} />
                <BriefItem label="Budget" value={project.budget} />
              </div>
              <p className="mt-3 border border-[#DED6CA] bg-white p-3 text-[12px] leading-5 text-[#797C73]">{project.formNotes}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.request.map((item) => (
                  <span key={item} className="border border-[#DED6CA] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B5B52]">
                    {item}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="border-t border-[#DED6CA] pt-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31332C]">History progress</h3>
          <div className="mt-3 grid gap-0">
            {project.activities.map((activity, index) => (
              <div key={`history-${activity.id}`} className="grid grid-cols-[20px_1fr] gap-3">
                <div className="relative flex justify-center">
                  <span className={`mt-1.5 h-3 w-3 rounded-full ${activity.status === "Selesai" ? "bg-[#6B5B52]" : "bg-[#31332C]"}`} />
                  {index < project.activities.length - 1 && <span className="absolute top-5 h-[calc(100%-4px)] w-px bg-[#DED6CA]" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-serif text-[18px] leading-6 text-[#31332C]">{activity.title}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52]">{activity.status}</span>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#797C73]">{activity.date}</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#797C73]">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>

        <div className="grid content-start gap-3">
        <section className="border border-[#DED6CA] bg-[#FCFBF9] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31332C]">Jadwal meet</h3>
              <p className="mt-2 flex items-start gap-2 text-[13px] leading-5 text-[#797C73]">
                <Calendar size={16} className="mt-0.5 shrink-0 text-[#6B5B52]" />
                {hasMeet ? project.meet : "User belum mengajukan meet"}
              </p>
            </div>
            <button className="h-9 shrink-0 border border-[#DED6CA] bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:border-[#31332C]">
              Update
            </button>
          </div>
        </section>

        {isAdding ? (
          <ActivityForm
            onCancel={() => setIsAdding(false)}
            onSubmit={(activity) => {
              onAddActivity(activity);
              setIsAdding(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="h-11 bg-[#31332C] px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
          >
            + Kegiatan
          </button>
        )}

        <section className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31332C]">Progress terbaru</h3>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#797C73]">Foto + update</span>
          </div>
          {project.activities.slice(0, 3).map((activity) => (
            <article key={activity.id} className="grid grid-cols-[92px_1fr] gap-3 border border-[#DED6CA] bg-[#FCFBF9] p-2">
              <ActivityPhoto image={activity.image} label={activity.title} />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-[20px] leading-6 text-[#31332C]">{activity.title}</h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">{activity.date}</p>
                  </div>
                  <span className="shrink-0 border border-[#DED6CA] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B5B52]">
                    {activity.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#797C73]">{activity.description}</p>
                {activity.status !== "Selesai" && (
                  <button
                    type="button"
                    onClick={() => onCompleteActivity(activity.id)}
                    className="mt-2 inline-flex h-8 items-center gap-2 border border-[#31332C] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-[#F5EFE5]"
                  >
                    <CheckCircle2 size={13} />
                    Selesai
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
        </div>
      </div>
      </section>
    </div>
  );
}

function ActivityForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (activity: ProgressActivity) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("2026-05-03");
  const [image, setImage] = useState("/figma/process-bg.webp");

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const submitActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      id: `activity-${Date.now()}`,
      title: title || "Kegiatan baru",
      description: description || "Deskripsi kegiatan belum diisi.",
      date: formatDate(date),
      image,
      status: "Berjalan",
    });
  };

  return (
    <form onSubmit={submitActivity} className="grid grid-cols-[92px_1fr] gap-3 border border-[#DED6CA] bg-[#FCFBF9] p-2">
      <label className="relative grid min-h-24 cursor-pointer place-items-center overflow-hidden border border-dashed border-[#DED6CA] bg-white text-[#6B5B52]">
        {image ? <ActivityPhoto image={image} label="Preview kegiatan" /> : <ImagePlus size={20} />}
        <input className="sr-only" type="file" accept="image/*" onChange={handleImage} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="border border-[#DED6CA] bg-white px-3 py-2 text-[12px] outline-none" placeholder="Judul kegiatan" />
        <input value={date} onChange={(event) => setDate(event.target.value)} className="border border-[#DED6CA] bg-white px-3 py-2 text-[12px] outline-none" type="date" />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="col-span-2 h-14 resize-none border border-[#DED6CA] bg-white px-3 py-2 text-[12px] outline-none"
          placeholder="Deskripsi progress"
        />
        <button type="button" onClick={onCancel} className="h-8 border border-[#DED6CA] bg-white text-[10px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
          Batal
        </button>
        <button type="submit" className="h-8 bg-[#31332C] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE5]">
          Simpan
        </button>
      </div>
    </form>
  );
}

function BriefItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#DED6CA] bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">{label}</p>
      <p className="mt-1 text-[12px] leading-5 text-[#31332C]">{value}</p>
    </div>
  );
}

function BriefField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">{label}</span>
      {children}
    </label>
  );
}

function pickBrief(project: ProjectCardData): BriefUpdate {
  return {
    property: project.property,
    location: project.location,
    budget: project.budget,
    projectStart: project.projectStart,
    projectEnd: project.projectEnd,
    duration: project.duration,
    style: project.style,
    formNotes: project.formNotes,
  };
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-[#DED6CA] px-4 py-5 last:border-r-0">
      <p className="font-serif text-[29px] leading-none text-[#31332C]">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#797C73]">{label}</p>
    </div>
  );
}

function SmallMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-[#DED6CA] px-2 py-3 last:border-r-0">
      <p className="font-serif text-[22px] leading-none text-[#31332C]">{value}</p>
      <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#797C73]">{label}</p>
    </div>
  );
}

function ActivityPhoto({ image, label }: { image: string; label: string }) {
  return (
    <div
      aria-label={label}
      className="h-full min-h-24 w-full bg-[#DED6CA] bg-cover bg-center"
      role="img"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
}

function isProjectDone(project: ProjectCardData) {
  return project.activities.length > 0 && project.activities.every((activity) => activity.status === "Selesai");
}

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
