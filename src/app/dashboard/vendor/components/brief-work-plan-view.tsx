"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileText,
  Timer,
} from "lucide-react";

import { workBriefs } from "../mock-data";
import type { VendorPageId, WorkBrief, WorkPlanStatus } from "../types";
import {
  VendorActionButton,
  VendorChecklistItem,
  VendorEmptyState,
  VendorModal,
  VendorModalActions,
  VendorSectionCard,
  VendorStatusBadge,
} from "./shared";

export function BriefWorkPlanView({
  onChangePage,
}: {
  onChangePage: (page: VendorPageId) => void;
}) {
  const [selectedBriefId, setSelectedBriefId] = useState(
    workBriefs[0]?.id ?? "",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const [briefStatuses, setBriefStatuses] = useState<
    Record<string, WorkPlanStatus>
  >(
    () =>
      Object.fromEntries(
        workBriefs.map((brief) => [brief.id, brief.status]),
      ) as Record<string, WorkPlanStatus>,
  );

  const selectedBrief = useMemo(() => {
    return workBriefs.find((brief) => brief.id === selectedBriefId) ?? null;
  }, [selectedBriefId]);

  const selectedStatus = selectedBrief
    ? briefStatuses[selectedBrief.id] ?? selectedBrief.status
    : "Belum Dibaca";

  const handleSelectBrief = (id: string) => {
    setSelectedBriefId(id);
    setIsMobileDetailOpen(true);
  };

  const handleMarkAsRead = () => {
    if (!selectedBrief) return;

    setBriefStatuses((current) => ({
      ...current,
      [selectedBrief.id]: "Sudah Dibaca",
    }));

    setConfirmOpen(false);
  };

  if (workBriefs.length === 0) {
    return (
      <div className="w-full space-y-6">
        <section className="pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Work Brief
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Brief & Rencana Kerja
          </h1>

          <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#7B756E]">
            Brief dari VMatch akan tampil ketika proyek sudah siap dikerjakan.
          </p>
        </section>

        <VendorSectionCard>
          <VendorEmptyState
            icon={ClipboardList}
            title="Belum ada brief kerja"
            description="Brief dan rencana kerja dari VMatch akan tampil di sini setelah proyek siap."
          />
        </VendorSectionCard>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
          Work Brief
        </p>

        <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
          Brief & Rencana Kerja
        </h1>

        <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
          Baca scope, material, timeline, dan standar QC sebelum pekerjaan
          dimulai.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr]">
        <div
          className={`space-y-4 ${
            isMobileDetailOpen ? "hidden lg:block" : "block"
          }`}
        >
          <div className="grid gap-3 lg:max-h-[calc(100dvh-190px)] lg:overflow-y-auto lg:pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {workBriefs.map((brief) => {
              const currentStatus = briefStatuses[brief.id] ?? brief.status;

              return (
                <BriefListCard
                  key={brief.id}
                  brief={brief}
                  status={currentStatus}
                  active={selectedBrief?.id === brief.id}
                  onClick={() => handleSelectBrief(brief.id)}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`min-w-0 ${
            isMobileDetailOpen ? "block" : "hidden lg:block"
          }`}
        >
          {selectedBrief ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileDetailOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]"
                  aria-label="Kembali ke daftar brief"
                >
                  <ArrowLeft size={16} />
                </button>

                <p className="text-[13px] font-medium text-[#7B756E]">
                  Kembali ke daftar brief
                </p>
              </div>

              <VendorSectionCard>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <VendorStatusBadge status={selectedStatus} />

                        <span className="rounded-full bg-[#FCFBF9] px-3 py-1 text-[11px] font-semibold text-[#7B756E]">
                          Rencana Kerja VMatch
                        </span>
                      </div>

                      <h2 className="mt-3 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[34px]">
                        {selectedBrief.projectName}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                      <VendorActionButton
                        icon={CheckCircle2}
                        label={
                          selectedStatus === "Sudah Dibaca"
                            ? "Sudah Dibaca"
                            : "Konfirmasi"
                        }
                        primary={selectedStatus !== "Sudah Dibaca"}
                        disabled={selectedStatus === "Sudah Dibaca"}
                        onClick={() => setConfirmOpen(true)}
                      />

                      <VendorActionButton
                        icon={FileText}
                        label="Isi Log"
                        onClick={() => onChangePage("progress-log")}
                      />
                    </div>
                  </div>

                  {selectedBrief.notes && (
                    <div className="rounded-xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Catatan VMatch
                      </p>

                      <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                        {selectedBrief.notes}
                      </p>
                    </div>
                  )}
                </div>
              </VendorSectionCard>

              <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <VendorSectionCard title="Scope Pekerjaan">
                    <div className="space-y-3">
                      {selectedBrief.scope.map((item, index) => (
                        <ScopeItem
                          key={`${item}-${index}`}
                          number={index + 1}
                          text={item}
                        />
                      ))}
                    </div>
                  </VendorSectionCard>

                  <VendorSectionCard title="Material Disetujui">
                    <div className="flex flex-wrap gap-2">
                      {selectedBrief.materialApproved.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </VendorSectionCard>

                  <VendorSectionCard title="Standar QC">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {selectedBrief.qcChecklist.map((item) => (
                        <VendorChecklistItem
                          key={item}
                          label={item}
                          completed={selectedStatus === "Sudah Dibaca"}
                        />
                      ))}
                    </div>
                  </VendorSectionCard>
                </div>

                <div className="space-y-5">
                  <VendorSectionCard title="Timeline Target">
                    <div className="space-y-3">
                      {selectedBrief.timeline.map((item, index) => (
                        <TimelineItem
                          key={`${item.label}-${item.date}`}
                          index={index + 1}
                          label={item.label}
                          date={item.date}
                        />
                      ))}
                    </div>
                  </VendorSectionCard>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-8 text-center">
              <p className="text-[14px] text-[#7B756E]">
                Pilih brief untuk melihat detail.
              </p>
            </div>
          )}
        </div>
      </section>

      {confirmOpen && selectedBrief && (
        <VendorModal
          title="Konfirmasi Brief"
          description="Pastikan kamu sudah memahami scope, timeline, material, dan standar QC sebelum mulai bekerja."
          onClose={() => setConfirmOpen(false)}
        >
          <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-[13px] leading-6 text-[#6F6860]">
            Brief{" "}
            <span className="font-semibold text-[#31332C]">
              {selectedBrief.projectName}
            </span>{" "}
            akan ditandai sebagai{" "}
            <span className="font-semibold text-[#725F54]">Sudah Dibaca</span>.
          </div>

          <VendorModalActions
            onClose={() => setConfirmOpen(false)}
            onSubmit={handleMarkAsRead}
            submitLabel="Ya, Saya Mengerti"
          />
        </VendorModal>
      )}
    </div>
  );
}

function BriefListCard({
  brief,
  status,
  active,
  onClick,
}: {
  brief: WorkBrief;
  status: WorkPlanStatus;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition hover:bg-[#FCFBF9] ${
        active
          ? "border-[#D9C8BA] bg-[#FFFDF9] ring-1 ring-[#D9C8BA]"
          : "border-[#E8E2D9] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <VendorStatusBadge status={status} />

        <span className="shrink-0 text-[11px] text-[#7B756E]">
          {brief.timeline[0]?.date ?? "TBA"}
        </span>
      </div>

      <h3 className="mt-3 truncate text-[14px] font-semibold text-[#31332C]">
        {brief.projectName}
      </h3>

      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {brief.scope[0]}
      </p>
    </button>
  );
}

function ScopeItem({
  number,
  text,
}: {
  number: number;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#725F54] text-[10px] font-bold text-white">
        {number}
      </span>

      <p className="text-[13px] leading-6 text-[#31332C]">{text}</p>
    </div>
  );
}

function TimelineItem({
  index,
  label,
  date,
}: {
  index: number;
  label: string;
  date: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#725F54]">
        <Timer size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium text-[#7B756E]">
          Tahap {index}
        </p>

        <p className="mt-0.5 text-[13px] font-semibold text-[#31332C]">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] text-[#7B756E]">{date}</p>
      </div>
    </div>
  );
}