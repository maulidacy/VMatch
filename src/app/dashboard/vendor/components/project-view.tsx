"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  FolderKanban,
  MapPin,
  Phone,
  Wallet,
} from "lucide-react";

import type { VendorPageId, VendorProject } from "../types";
import { getMyProjects } from "@/lib/api/projects";
import { getFieldTeams } from "@/lib/api/projects";
import type { Project as DBProject, FieldTeam } from "@/lib/supabase/types";
import {
  VendorActionButton,
  VendorEmptyState,
  VendorProgressBar,
  VendorSectionCard,
  VendorStatusBadge,
} from "./shared";

type ProjectFilter = "all" | "active" | "waiting" | "done";

const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "active", label: "Aktif" },
  { id: "waiting", label: "Menunggu" },
  { id: "done", label: "Selesai" },
];

function mapDbToVendorProject(p: DBProject, fieldTeam: FieldTeam[]): VendorProject {
  const statusMap: Record<string, VendorProject["status"]> = {
    "Berjalan": "Sedang Dikerjakan",
    "Butuh Review": "Butuh Update",
    "QC": "Menunggu QC",
    "Selesai": "Selesai",
  };

  return {
    id: p.id,
    name: p.title,
    type: p.project_type,
    location: p.location || "-",
    status: statusMap[p.status] || "Menunggu Brief",
    progress: p.progress,
    deadline: p.estimated_finish || "Belum ditentukan",
    startDate: p.start_date || "Menunggu jadwal",
    customerBrief: p.description || "-",
    vmNotes: p.admin_note || "Belum ada catatan dari VMatch.",
    material: "-",
    nextTask: p.next_task || "Menunggu update dari VMatch.",
    bonusStatus: "Berpotensi Aktif",
    fieldTeam: fieldTeam.map(f => ({
      id: f.id,
      name: f.name,
      role: f.role || "-",
      phone: f.phone || "-",
    })),
  };
}

export function ProjectView({
  onChangePage,
  vendorId,
}: {
  onChangePage: (page: VendorPageId) => void;
  vendorId: string;
}) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const [vendorProjects, setVendorProjects] = useState<VendorProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const dbProjects = await getMyProjects(vendorId);
      const projectsWithTeams = await Promise.all(
        dbProjects.map(async (p) => {
          const team = await getFieldTeams(p.id);
          return mapDbToVendorProject(p, team);
        })
      );
      setVendorProjects(projectsWithTeams);
      if (projectsWithTeams.length > 0) {
        setSelectedProjectId(projectsWithTeams[0].id);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return vendorProjects.filter((project) => {
      if (activeFilter === "all") return true;

      if (activeFilter === "active") {
        return [
          "Siap Dikerjakan",
          "Sedang Dikerjakan",
          "Butuh Update",
          "Menunggu QC",
        ].includes(project.status);
      }

      if (activeFilter === "waiting") return project.status === "Menunggu Brief";

      return project.status === "Selesai";
    });
  }, [activeFilter]);

  const selectedProject = useMemo(() => {
    return (
      filteredProjects.find((project) => project.id === selectedProjectId) ??
      filteredProjects[0] ??
      null
    );
  }, [filteredProjects, selectedProjectId]);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setIsMobileDetailOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      <section className="pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
          Project Tracking
        </p>

        <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
          Proyek Saya
        </h1>

        <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#7B756E]">
          Pantau proyek yang diberikan VMatch, lihat deadline, progress, brief,
          dan tim lapangan dengan lebih ringkas.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr]">
        <div
          className={`space-y-4 ${isMobileDetailOpen ? "hidden lg:block" : "block"
            }`}
        >
          <div className="grid grid-cols-4 gap-1 rounded-2xl border border-[#E8E2D9] bg-white p-1.5">
            {projectFilters.map((filter) => {
              const active = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`h-9 rounded-xl px-2 text-[11px] font-semibold transition ${active
                      ? "bg-[#725F54] text-white"
                      : "text-[#725F54] hover:bg-[#FCFBF9]"
                    }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 lg:max-h-[calc(100dvh-190px)] lg:overflow-y-auto lg:pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectListCard
                  key={project.id}
                  project={project}
                  active={selectedProject?.id === project.id}
                  onClick={() => handleSelectProject(project.id)}
                />
              ))
            ) : (
              <VendorEmptyState
                icon={FolderKanban}
                title="Belum ada proyek"
                description="Tidak ada proyek yang sesuai filter."
              />
            )}
          </div>
        </div>

        <div
          className={`min-w-0 ${isMobileDetailOpen ? "block" : "hidden lg:block"
            }`}
        >
          {selectedProject ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileDetailOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]"
                  aria-label="Kembali ke daftar proyek"
                >
                  <ArrowLeft size={16} />
                </button>

                <p className="text-[13px] font-medium text-[#7B756E]">
                  Kembali ke daftar proyek
                </p>
              </div>

              <VendorSectionCard>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <VendorStatusBadge status={selectedProject.status} />

                        <span className="text-[12px] text-[#7B756E]">
                          {selectedProject.type}
                        </span>
                      </div>

                      <h2 className="mt-3 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[34px]">
                        {selectedProject.name}
                      </h2>

                      <p className="mt-2 flex items-center gap-1.5 text-[13px] leading-6 text-[#7B756E]">
                        <MapPin size={14} />
                        {selectedProject.location}
                      </p>
                    </div>

                    <div className="w-fit rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3 sm:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Progress
                      </p>

                      <p className="mt-1 font-serif text-[26px] leading-none text-[#31332C]">
                        {selectedProject.progress}%
                      </p>
                    </div>
                  </div>

                  <VendorProgressBar value={selectedProject.progress} />

                  <div className="grid gap-2 sm:grid-cols-3">
                    <VendorActionButton
                      icon={ClipboardList}
                      label="Brief"
                      primary
                      onClick={() => onChangePage("brief")}
                    />

                    <VendorActionButton
                      icon={FileText}
                      label="Log Progress"
                      onClick={() => onChangePage("progress-log")}
                    />

                    <VendorActionButton
                      icon={Wallet}
                      label="Pembayaran"
                      onClick={() => onChangePage("payment-bonus")}
                    />
                  </div>
                </div>
              </VendorSectionCard>

              <div className="grid gap-3 sm:grid-cols-2">
                <SimpleInfoCard
                  label="Tanggal Mulai"
                  value={selectedProject.startDate}
                  description="Awal pengerjaan proyek."
                />

                <SimpleInfoCard
                  label="Target Selesai"
                  value={selectedProject.deadline}
                  description="Acuan utama timeline."
                  highlight
                />
              </div>

              <section className="space-y-5">
                <VendorSectionCard title="Informasi Pekerjaan">
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Brief Customer
                      </p>

                      <p className="mt-2 whitespace-pre-line text-[13px] leading-7 text-[#6F6860]">
                        {selectedProject.customerBrief}
                      </p>
                    </div>

                    {selectedProject.vmNotes && (
                      <div className="border-t border-[#E8E2D9] pt-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                          Catatan VMatch
                        </p>

                        <p className="mt-2 text-[13px] leading-7 text-[#6F6860]">
                          {selectedProject.vmNotes}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-3 border-t border-[#E8E2D9] pt-5 sm:grid-cols-3">
                      <WorkSummary
                        label="Material"
                        value={selectedProject.material}
                      />

                      <WorkSummary
                        label="Tugas Terdekat"
                        value={selectedProject.nextTask}
                        accent
                      />

                      <WorkSummary
                        label="Status Bonus"
                        value={selectedProject.bonusStatus}
                      />
                    </div>
                  </div>
                </VendorSectionCard>

                <VendorSectionCard title="Tim Lapangan">
                  {selectedProject.fieldTeam.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedProject.fieldTeam.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8E2D9] bg-white p-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-[#31332C]">
                              {member.name}
                            </p>

                            <p className="mt-1 truncate text-[11px] text-[#7B756E]">
                              {member.role} • {member.phone}
                            </p>
                          </div>

                          <a
                            href={`tel:${member.phone}`}
                            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-3 text-[11px] font-semibold text-[#725F54] transition hover:bg-white"
                          >
                            <Phone size={12} />
                            Hubungi
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-center text-[12px] text-[#7B756E]">
                      Belum ada tim terdaftar.
                    </p>
                  )}
                </VendorSectionCard>
              </section>
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-8 text-center">
              <p className="text-[14px] text-[#7B756E]">
                Pilih proyek untuk melihat detail.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function WorkSummary({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7B756E]">
        {label}
      </p>

      <p
        className={`mt-2 text-[13px] leading-6 ${accent ? "font-semibold text-[#725F54]" : "font-medium text-[#31332C]"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProjectListCard({
  project,
  active,
  onClick,
}: {
  project: VendorProject;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition hover:bg-[#FCFBF9] ${active
          ? "border-[#D9C8BA] bg-[#FFFDF9] ring-1 ring-[#D9C8BA]"
          : "border-[#E8E2D9] bg-white"
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <VendorStatusBadge status={project.status} />

        <span className="shrink-0 text-[11px] text-[#7B756E]">
          {project.deadline}
        </span>
      </div>

      <h3 className="mt-3 truncate text-[14px] font-semibold text-[#31332C]">
        {project.name}
      </h3>

      <p className="mt-1 truncate text-[12px] text-[#7B756E]">
        {project.type} • {project.location}
      </p>

      <div className="mt-3">
        <VendorProgressBar value={project.progress} />
      </div>
    </button>
  );
}

function SimpleInfoCard({
  label,
  value,
  description,
  highlight,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 ${highlight ? "border-[#D9C8BA]" : "border-[#E8E2D9]"
        }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-2 text-[15px] font-semibold text-[#31332C]">
        {value}
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}
