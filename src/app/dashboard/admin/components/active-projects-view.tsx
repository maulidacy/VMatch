"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Hammer,
  MapPin,
  PackageCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type ProjectStatus =
  | "Berjalan"
  | "Menunggu Vendor"
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

const initialProjects: ActiveProject[] = [
  {
    id: "project-1",
    title: "Kitchen Set Minimalis",
    customerName: "Alya Putri",
    vendorName: "Kayu Rapi Interior",
    location: "Semarang",
    budget: "Rp23.500.000",
    projectType: "Kitchen Set",
    startDate: "3 Juli 2026",
    targetDate: "25 Juli 2026",
    status: "Berjalan",
    progress: 45,
    currentStage: "Produksi kabinet",
    nextTask: "Update foto progres produksi",
    adminNote: "Pastikan ukuran kabinet atas sesuai hasil survey terakhir.",
    description:
      "Proyek kitchen set minimalis untuk area dapur kecil dengan kabinet bawah, kabinet atas, dan finishing HPL warna natural.",
  },
  {
    id: "project-2",
    title: "Wardrobe Kamar Utama",
    customerName: "Bima Santoso",
    vendorName: "Mitra Interior Jogja",
    location: "Yogyakarta",
    budget: "Rp16.000.000",
    projectType: "Wardrobe",
    startDate: "5 Juli 2026",
    targetDate: "28 Juli 2026",
    status: "Butuh Review",
    progress: 30,
    currentStage: "Review desain final",
    nextTask: "Admin cek revisi desain dari vendor",
    adminNote: "Customer meminta tambahan area gantung baju panjang.",
    description:
      "Wardrobe built-in full plafon dengan pintu sliding, area gantung, rak lipat, dan storage tambahan.",
  },
  {
    id: "project-3",
    title: "Ruang Kerja Rumah",
    customerName: "Nadia Rahma",
    vendorName: "Studio Ruang Karya",
    location: "Solo",
    budget: "Rp10.500.000",
    projectType: "Ruang Kerja",
    startDate: "1 Juli 2026",
    targetDate: "18 Juli 2026",
    status: "QC",
    progress: 82,
    currentStage: "Quality control",
    nextTask: "Cek hasil pemasangan dan finishing",
    adminNote: "Periksa area rak dan meja sebelum serah terima.",
    description:
      "Pembuatan ruang kerja sederhana dengan meja custom, rak buku, storage kecil, dan konsep Scandinavian.",
  },
  {
    id: "project-4",
    title: "Backdrop TV Ruang Keluarga",
    customerName: "Raka Pratama",
    vendorName: "Warm Living Interior",
    location: "Semarang",
    budget: "Rp13.800.000",
    projectType: "Backdrop TV",
    startDate: "15 Juni 2026",
    targetDate: "10 Juli 2026",
    status: "Selesai",
    progress: 100,
    currentStage: "Selesai",
    nextTask: "Garansi dan dokumentasi akhir",
    adminNote: "Dokumentasi akhir sudah diterima.",
    description:
      "Backdrop TV ruang keluarga dengan kabinet bawah, panel dinding, dan aksen warna coklat muda.",
  },
];

export function ActiveProjectsView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [projects, setProjects] = useState<ActiveProject[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<ProjectTab>("Semua");
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjects[0]?.id ?? "",
  );

  const selectedProject = useMemo(() => {
    return (
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0]
    );
  }, [projects, selectedProjectId]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Berjalan") {
        return (
          project.status === "Berjalan" ||
          project.status === "Menunggu Vendor"
        );
      }
      if (activeTab === "Review") {
        return project.status === "Butuh Review" || project.status === "QC";
      }

      return project.status === "Selesai";
    });
  }, [activeTab, projects]);

  const runningCount = projects.filter(
    (project) =>
      project.status === "Berjalan" || project.status === "Menunggu Vendor",
  ).length;

  const reviewCount = projects.filter(
    (project) => project.status === "Butuh Review" || project.status === "QC",
  ).length;

  const finishedCount = projects.filter(
    (project) => project.status === "Selesai",
  ).length;

  const updateSelectedProject = (
    field: keyof ActiveProject,
    value: string | number | ProjectStatus,
  ) => {
    if (!selectedProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );
  };

  const updateStatus = (status: ProjectStatus) => {
    updateSelectedProject("status", status);

    if (status === "Selesai") {
      updateSelectedProject("progress", 100);
    }
  };

  if (!selectedProject) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Manajemen Proyek
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Proyek Aktif
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Pantau proyek yang sedang berjalan, koordinasi vendor, progress
            pengerjaan, tahap QC, dan status penyelesaian proyek customer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangePage?.("requests")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          Dari Request Proyek
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <ProjectMiniStat
          icon={Hammer}
          label="Total Proyek"
          value={`${projects.length}`}
          description="Proyek aktif dan selesai"
        />

        <ProjectMiniStat
          icon={Users}
          label="Berjalan"
          value={`${runningCount}`}
          description="Sedang dikerjakan vendor"
        />

        <ProjectMiniStat
          icon={ClipboardCheck}
          label="Butuh Review"
          value={`${reviewCount}`}
          description="Perlu dicek admin"
        />

        <ProjectMiniStat
          icon={CheckCircle2}
          label="Selesai"
          value={`${finishedCount}`}
          description="Proyek selesai"
        />
      </section>

      <AdminSectionCard title="Daftar Proyek">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-4 gap-2">
            {projectTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-11 items-center justify-center rounded-xl px-2 text-[11px] font-semibold transition sm:text-[13px] ${
                    active
                      ? "bg-[#725F54] text-white shadow-sm"
                      : "text-[#6F6860] hover:bg-[#F8F6F2]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedProject.id === project.id}
                onClick={() => setSelectedProjectId(project.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada proyek pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Proyek akan muncul sesuai status pengerjaannya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Proyek"
          action={<ProjectStatusBadge status={selectedProject.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Proyek Customer
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedProject.title}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                {selectedProject.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold text-[#31332C]">
                    Progress Proyek
                  </p>

                  <p className="mt-1 text-[11px] text-[#7B756E]">
                    Tahap saat ini: {selectedProject.currentStage}
                  </p>
                </div>

                <p className="font-serif text-[28px] leading-none text-[#725F54]">
                  {selectedProject.progress}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                <div
                  className="h-full rounded-full bg-[#725F54]"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile
                icon={UserRound}
                label="Customer"
                value={selectedProject.customerName}
                description={selectedProject.projectType}
              />

              <InfoTile
                icon={Users}
                label="Vendor"
                value={selectedProject.vendorName}
                description="Vendor partner"
              />

              <InfoTile
                icon={MapPin}
                label="Lokasi"
                value={selectedProject.location}
                description="Area proyek"
              />

              <InfoTile
                icon={Wallet}
                label="Nilai Proyek"
                value={selectedProject.budget}
                description="Estimasi/RAB"
              />

              <InfoTile
                icon={CalendarDays}
                label="Mulai"
                value={selectedProject.startDate}
                description="Tanggal mulai"
              />

              <InfoTile
                icon={PackageCheck}
                label="Target"
                value={selectedProject.targetDate}
                description="Target selesai"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Tugas Terdekat
                </p>

                <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                  {selectedProject.nextTask}
                </p>
              </div>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedProject.adminNote}
                  onChange={(event) =>
                    updateSelectedProject("adminNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Proyek">
            <div className="space-y-3">
              <ActionButton
                icon={FileText}
                title="Buka Brief"
                description="Lihat brief dan dokumen kerja."
                onClick={() => onChangePage?.("documents")}
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
          </AdminSectionCard>

          <AdminSectionCard title="Ubah Status">
            <div className="grid gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateStatus(status)}
                  className={`flex h-10 items-center justify-between rounded-xl border px-3 text-left text-[12px] font-semibold transition ${
                    selectedProject.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedProject.status === status && (
                    <CheckCircle2 size={15} />
                  )}
                </button>
              ))}
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: ProjectStatus[] = [
  "Berjalan",
  "Menunggu Vendor",
  "Butuh Review",
  "QC",
  "Selesai",
];

function ProjectCard({
  project,
  selected,
  onClick,
}: {
  project: ActiveProject;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[#D9C8BA] bg-[#FFFDF9]"
          : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {project.title}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {project.customerName} • {project.location}
          </p>
        </div>

        <ProjectStatusBadge status={project.status} />
      </div>

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

      <p className="mt-3 line-clamp-1 text-[12px] text-[#7B756E]">
        {project.currentStage}
      </p>
    </button>
  );
}

function ProjectMiniStat({
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
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={17} strokeWidth={2} />
        </div>

        <p className="min-w-0 truncate text-right font-serif text-[25px] leading-none text-[#31332C]">
          {value}
        </p>
      </div>

      <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-1 truncate text-[13px] font-semibold text-[#31332C]">
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
      className="flex w-full items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div>
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
      : status === "Menunggu Vendor" ||
          status === "Butuh Review" ||
          status === "QC"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}