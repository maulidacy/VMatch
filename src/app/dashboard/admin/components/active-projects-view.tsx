"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  FileText,
  MapPin,
  PackageCheck,
  Save,
  Search,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { AdminPageId } from "../types";
import { getProjects } from "@/lib/api/projects";
import type { Project as DBProject } from "@/lib/supabase/types";

type ProjectStatus =
  | "Berjalan"
  | "Butuh Review"
  | "QC"
  | "Selesai";

type ProjectTab = "Semua" | "Berjalan" | "Review" | "Selesai";

type ActiveProject = {
  id: string;
  title: string;
  customerName: string;
  vendorName: string;
  location: string;
  budget: string;
  projectType: string;
  startDate: string;
  targetDate: string;
  status: ProjectStatus;
  progress: number;
  currentStage: string;
  nextTask: string;
  adminNote: string;
  description: string;
};

const projectTabs: ProjectTab[] = ["Semua", "Berjalan", "Review", "Selesai"];

const statusOptions: ProjectStatus[] = [
  "Berjalan",
  "Butuh Review",
  "QC",
  "Selesai",
];

const initialProjects: ActiveProject[] = [];

export function ActiveProjectsView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [activeTab, setActiveTab] = useState<ProjectTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      const dbProjects = await getProjects();
      const mapped: ActiveProject[] = dbProjects.map((p: DBProject) => ({
        id: p.id,
        title: p.title,
        customerName: p.customer?.full_name || "Customer",
        vendorName: p.vendor?.full_name || "Belum dipilih",
        location: p.location || "-",
        budget: p.estimated_cost || p.final_cost || "-",
        projectType: p.project_type,
        startDate: p.start_date || "-",
        targetDate: p.estimated_finish || "-",
        status: p.status as ProjectStatus,
        progress: p.progress,
        currentStage: p.current_stage || "-",
        nextTask: p.next_task || "-",
        adminNote: p.admin_note || "",
        description: p.description || "",
      }));
      setProjects(mapped);
    } catch { /* silent */ } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return projects.filter((project) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Berjalan" && project.status === "Berjalan") ||
        (activeTab === "Review" &&
          ["Butuh Review", "QC"].includes(project.status)) ||
        (activeTab === "Selesai" && project.status === "Selesai");

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        project.title.toLowerCase().includes(normalizedKeyword) ||
        project.customerName.toLowerCase().includes(normalizedKeyword) ||
        project.vendorName.toLowerCase().includes(normalizedKeyword) ||
        project.location.toLowerCase().includes(normalizedKeyword) ||
        project.projectType.toLowerCase().includes(normalizedKeyword) ||
        project.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, projects]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;

    return projects.find((project) => project.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  const updateProject = (
    id: string,
    field: keyof ActiveProject,
    value: string | number | ProjectStatus,
  ) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );
  };

  const updateStatus = (id: string, status: ProjectStatus) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
              progress: status === "Selesai" ? 100 : project.progress,
              currentStage: status === "Selesai" ? "Selesai" : project.currentStage,
            }
          : project,
      ),
    );
  };

  const openDetail = (project: ActiveProject) => {
    setSelectedProjectId(project.id);
    setAdminNoteDraft(project.adminNote);
    setIsNoteSaved(false);
  };

  const closeDetail = () => {
    setSelectedProjectId(null);
    setAdminNoteDraft("");
    setIsNoteSaved(false);
  };

  if (selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        adminNoteDraft={adminNoteDraft}
        isNoteSaved={isNoteSaved}
        onBack={closeDetail}
        onChangeNote={(value) => {
          setAdminNoteDraft(value);
          setIsNoteSaved(false);
        }}
        onSaveNote={() => {
          updateProject(selectedProject.id, "adminNote", adminNoteDraft);
          setIsNoteSaved(true);
        }}
        onUpdateStatus={(status) => updateStatus(selectedProject.id, status)}
        onChangePage={onChangePage}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Proyek Aktif
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Daftar Proyek
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Pantau proyek interior yang sudah benar-benar aktif setelah RAB final disetujui customer, termasuk progres pengerjaan, vendor partner, jadwal target, status proyek, dan tindak lanjut administrasi.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari proyek, customer, vendor, lokasi, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as ProjectTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {projectTabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
            />
          </div>

          <div className="hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-1.5 sm:block lg:col-span-2">
            <div className="flex gap-1.5 overflow-x-auto">
              {projectTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold transition ${
                      active
                        ? "bg-[#725F54] text-white shadow-sm"
                        : "text-[#6F6860] hover:bg-white"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredProjects.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => openDetail(project)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Proyek tidak ditemukan.
            </p>

            <p className="mt-2 text-[13px] text-[#7B756E]">
              Coba ubah filter atau kata pencarian.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectDetailPage({
  project,
  adminNoteDraft,
  isNoteSaved,
  onBack,
  onChangeNote,
  onSaveNote,
  onUpdateStatus,
  onChangePage,
}: {
  project: ActiveProject;
  adminNoteDraft: string;
  isNoteSaved: boolean;
  onBack: () => void;
  onChangeNote: (value: string) => void;
  onSaveNote: () => void;
  onUpdateStatus: (status: ProjectStatus) => void;
  onChangePage?: (page: AdminPageId) => void;
}) {
  const isAdminNoteChanged = adminNoteDraft !== project.adminNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar proyek
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                {project.projectType}
              </p>

              <ProjectStatusBadge status={project.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {project.title}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              {project.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Proyek
            </label>

            <div className="relative mt-3">
              <select
                value={project.status}
                onChange={(event) =>
                  onUpdateStatus(event.target.value as ProjectStatus)
                }
                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#31332C]">
                    Progress Proyek
                  </p>

                  <p className="mt-1 text-[11px] text-[#7B756E]">
                    Tahap saat ini: {project.currentStage}
                  </p>
                </div>

                <p className="shrink-0 font-serif text-[28px] leading-none text-[#725F54]">
                  {project.progress}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                <div
                  className="h-full rounded-full bg-[#725F54]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Tugas Terdekat
              </p>

              <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                {project.nextTask}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoTile
              icon={UserRound}
              label="Customer"
              value={project.customerName}
              description={project.projectType}
            />

            <InfoTile
              icon={Users}
              label="Vendor"
              value={project.vendorName}
              description="Vendor partner"
            />

            <InfoTile
              icon={MapPin}
              label="Lokasi"
              value={project.location}
              description="Area proyek"
            />

            <InfoTile
              icon={Wallet}
              label="Nilai Proyek"
              value={project.budget}
              description="Estimasi/RAB"
            />

            <InfoTile
              icon={CalendarDays}
              label="Mulai"
              value={project.startDate}
              description="Tanggal mulai"
            />

            <InfoTile
              icon={PackageCheck}
              label="Target"
              value={project.targetDate}
              description="Target selesai"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="border-b border-[#E8E2D9] p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Catatan Pekerjaan
            </p>

            <p className="mt-3 text-[13px] leading-7 text-[#6F6860]">
              Pantau update vendor pada halaman Progress & QC. Gunakan catatan
              ini untuk menandai hal penting dari sisi admin sebelum proses
              berlanjut ke tahap berikutnya.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Catatan Admin
              </p>

              {isNoteSaved && (
                <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
                  Tersimpan
                </span>
              )}
            </div>

            <textarea
              value={adminNoteDraft}
              onChange={(event) => onChangeNote(event.target.value)}
              rows={6}
              placeholder="Tambahkan catatan progress proyek..."
              className="mt-3 w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onSaveNote}
                disabled={!isAdminNoteChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                  isAdminNoteChanged
                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                }`}
              >
                <Save size={14} />
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Aksi Lanjutan
            </p>

            <p className="mt-1 text-[12px] text-[#7B756E]">
              Akses dokumen, progress, dan invoice yang terhubung dengan proyek.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <ActionButton
              icon={FileText}
              title="Buka Brief"
              description="Lihat brief dan dokumen kerja."
              onClick={() => onChangePage?.("brief-documents")}
            />

            <ActionButton
              icon={ClipboardCheck}
              title="Progress & QC"
              description="Cek log progress dan quality control."
              onClick={() => onChangePage?.("progress-qc")}
            />

            <ActionButton
              icon={Wallet}
              title="Invoice"
              description="Lihat invoice dan pembayaran proyek."
              onClick={() => onChangePage?.("payments")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ActiveProject;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {project.title}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {project.customerName} • {project.location}
          </p>
        </div>

        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {project.description}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-[#7B756E]">
            Progress
          </span>

          <span className="text-[11px] font-semibold text-[#725F54]">
            {project.progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
          <div
            className="h-full rounded-full bg-[#725F54]"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[12px] text-[#7B756E]">
          {project.currentStage}
        </p>

        <span className="shrink-0 rounded-full bg-[#F5F0EA] px-3 py-1 text-[11px] font-semibold text-[#725F54]">
          {project.projectType}
        </span>
      </div>
    </button>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#31332C]">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-[#7B756E]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-w-0 items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      </div>
    </button>
  );
}

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const style =
    status === "Berjalan"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Butuh Review" || status === "QC"
      ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
      : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
