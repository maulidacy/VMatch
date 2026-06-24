"use client";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  Gift,
  MessageCircle,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  VendorActionButton,
  VendorListRow,
  VendorProgressBar,
  VendorSectionCard,
  VendorStatusBadge,
} from "./shared";
import { useQuery } from "@/lib/hooks/use-query";
import { getProjects, getProgressLogs, getVendorBonuses } from "@/lib/api/projects";
import { getNotifications } from "@/lib/api/notifications";
import type { VendorPageId } from "../types";

export function DashboardView({
  onChangePage,
  vendorId,
}: {
  onChangePage: (page: VendorPageId) => void;
  vendorId: string;
}) {
  const { data: dbProjects } = useQuery(() => getProjects(), [], { cacheKey: `vendor_projects_${vendorId}` });
  const { data: allLogs } = useQuery(() => getProgressLogs(""), [], { enabled: false }); // Wait, actually I need to fetch vendor projects, then logs
  const { data: rawBonuses } = useQuery(() => getVendorBonuses(vendorId), [vendorId], { cacheKey: `vendor_bonuses_${vendorId}` });
  const dbBonuses = rawBonuses || [];

  const vendorProjects = (dbProjects || []).filter((p) => p.vendor_id === vendorId).map(p => ({
    id: p.id,
    name: p.title,
    status: p.status === "Berjalan" ? "Aktif" : p.status,
    deadline: p.estimated_finish || "-",
    nextTask: p.next_task || "-",
    progress: p.progress,
    type: p.project_type,
    location: p.location || "-",
    vmNotes: p.admin_note,
  }));

  const activeProjects = vendorProjects.filter(
    (project) => project.status !== "Selesai",
  );

  const mainProject = activeProjects[0];
  const { data: rawProjectLogs } = useQuery(() => getProgressLogs(mainProject?.id || ""), [mainProject?.id], { enabled: !!mainProject?.id });
  const mainProjectLogs = rawProjectLogs || [];
  const latestLog = mainProjectLogs[0];
  const mainBonus = dbBonuses[0];

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            VMatch Vendor
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Dashboard
          </h1>

          <p className="mt-2 max-w-[680px] text-[14px] leading-7 text-[#7B756E]">
            Pantau tugas utama, deadline, log progress, bonus, dan payout proyek
            dalam satu halaman.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <VendorActionButton
            icon={FileText}
            label="Isi Log"
            primary
            onClick={() => onChangePage("progress-log")}
          />

          <VendorActionButton
            icon={ClipboardList}
            label="Lihat Brief"
            onClick={() => onChangePage("brief")}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <SimpleStatCard
          icon={FolderKanban}
          label="Proyek Aktif"
          value={String(activeProjects.length)}
          description="Sedang berjalan"
        />

        <SimpleStatCard
          icon={CalendarDays}
          label="Deadline"
          value={mainProject ? mainProject.deadline : "-"}
          description={mainProject ? mainProject.name : "Belum ada proyek"}
        />

        <SimpleStatCard
          icon={FileText}
          label="Log Terakhir"
          value={latestLog ? `${latestLog.progress_percent}%` : "0%"}
          description={latestLog ? mainProject.name : "Belum ada log"}
        />

        <SimpleStatCard
          icon={Gift}
          label="Bonus"
          value={mainBonus ? mainBonus.status : "-"}
          description={mainBonus ? mainBonus.amount : "Belum tersedia"}
          highlight
        />

        <SimpleStatCard
          icon={Wallet}
          label="Payout"
          value="3"
          description="Milestone tercatat"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.8fr]">
        <div className="space-y-5">
          {mainProject ? (
            <VendorSectionCard>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <VendorStatusBadge status={mainProject.status} />

                    <span className="rounded-full bg-[#FCFBF9] px-3 py-1 text-[11px] font-semibold text-[#7B756E]">
                      Deadline {mainProject.deadline}
                    </span>
                  </div>

                  <span className="text-[12px] text-[#7B756E]">
                    {mainProject.type} • {mainProject.location}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725F54]">
                    Tugas Utama
                  </p>

                  <h2 className="mt-2 text-[19px] font-semibold leading-7 text-[#31332C]">
                    {mainProject.name}
                  </h2>

                  <p className="mt-2 text-[14px] leading-7 text-[#7B756E]">
                    {mainProject.nextTask}
                  </p>
                </div>

                <VendorProgressBar value={mainProject.progress} />

                {mainProject.vmNotes && (
                  <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                      Catatan VMatch
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                      {mainProject.vmNotes}
                    </p>
                  </div>
                )}
              </div>
            </VendorSectionCard>
          ) : (
            <VendorSectionCard>
              <p className="py-4 text-center text-[14px] text-[#7B756E]">
                Belum ada proyek aktif saat ini.
              </p>
            </VendorSectionCard>
          )}

          <VendorSectionCard
            title="Proyek yang Perlu Dipantau"
            description="Fokus pada proyek aktif dan tugas berikutnya."
            action={
              <button
                type="button"
                onClick={() => onChangePage("projects")}
                className="text-[12px] font-semibold text-[#725F54] transition hover:text-[#5A4A42]"
              >
                Lihat Semua
              </button>
            }
          >
            <div className="grid gap-3">
              {activeProjects.slice(0, 3).map((project) => (
                <VendorListRow
                  key={project.id}
                  icon={FolderKanban}
                  title={project.name}
                  description={project.nextTask}
                  meta={`Deadline ${project.deadline}`}
                  status={project.status}
                  action={
                    <VendorActionButton
                      label="Detail"
                      onClick={() => onChangePage("projects")}
                    />
                  }
                />
              ))}
            </div>
          </VendorSectionCard>
        </div>

        <div className="space-y-5">
          <VendorSectionCard title="Log Terakhir">
            {latestLog ? (
              <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <VendorStatusBadge status={latestLog.status} />

                  <span className="text-[12px] text-[#7B756E]">
                    {latestLog.log_date}
                  </span>
                </div>

                <h3 className="mt-3 text-[14px] font-semibold text-[#31332C]">
                  {mainProject.name}
                </h3>

                <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-[#7B756E]">
                  {latestLog.work_summary}
                </p>

                <div className="mt-4">
                  <VendorProgressBar
                    value={latestLog.progress_percent}
                    label="Progress dilaporkan"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#7B756E]">
                Belum ada log progress.
              </p>
            )}
          </VendorSectionCard>

          {mainBonus && (
            <VendorSectionCard title="Bonus">
              <div className="rounded-xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
                <div className="flex items-center justify-between gap-3">
                  <VendorStatusBadge status={mainBonus.status} />

                  <span className="shrink-0 text-[13px] font-semibold text-[#725F54]">
                    {mainBonus.amount}
                  </span>
                </div>

                <p className="mt-3 text-[13px] leading-6 text-[#6F6860]">
                  {mainBonus.reason}
                </p>

                <button
                  type="button"
                  onClick={() => onChangePage("payment-bonus")}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#D9C8BA] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                  <CheckCircle2 size={14} />
                  Cek Bonus
                </button>
              </div>
            </VendorSectionCard>
          )}

          <VendorSectionCard title="Update Terbaru">
            <div className="space-y-3">
              <p className="text-[13px] text-[#7B756E]">Tidak ada update terbaru.</p>
            </div>
          </VendorSectionCard>
        </div>
      </section>
    </div>
  );
}

function SimpleStatCard({
  icon: Icon,
  label,
  value,
  description,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-[0_6px_18px_rgba(49,51,44,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(49,51,44,0.06)] ${
        highlight ? "border-[#D9C8BA]" : "border-[#E8E2D9]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={16} />
        </div>

        <p className="max-w-[116px] text-right font-serif text-[19px] leading-[1.1] text-[#31332C] sm:text-[21px]">
          {value}
        </p>
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}