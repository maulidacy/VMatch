"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Paperclip,
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

type AdminBriefFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  url: string;
};

const adminBriefFiles: Record<string, AdminBriefFile[]> = {
  "brief-1": [
    {
      id: "file-1",
      name: "Project Brief - Wardrobe Kamar Utama.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "Admin VMatch",
      uploadedAt: "28 Juni 2026",
      description:
        "Dokumen utama berisi scope pekerjaan, ukuran, material, timeline, dan standar hasil akhir.",
      url: "#",
    },
    {
      id: "file-2",
      name: "Referensi Desain Wardrobe.png",
      type: "Gambar",
      size: "840 KB",
      uploadedBy: "Admin VMatch",
      uploadedAt: "28 Juni 2026",
      description:
        "Gambar referensi desain yang sudah disetujui customer dan VMatch.",
      url: "#",
    },
  ],
  "brief-2": [
    {
      id: "file-3",
      name: "Project Brief - Kitchen Set Minimalis.pdf",
      type: "PDF",
      size: "3.1 MB",
      uploadedBy: "Admin VMatch",
      uploadedAt: "29 Juni 2026",
      description:
        "Dokumen pekerjaan kitchen set, pembagian area, material, dan catatan instalasi.",
      url: "#",
    },
  ],
};

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

  const selectedBriefFiles = selectedBrief
    ? adminBriefFiles[selectedBrief.id] ?? []
    : [];

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
          Buka file brief dari admin, cek material, timeline, dan standar QC
          sebelum pekerjaan dimulai.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr]">
        <div
          className={`space-y-4 ${isMobileDetailOpen ? "hidden lg:block" : "block"
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
          className={`min-w-0 ${isMobileDetailOpen ? "block" : "hidden lg:block"
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
                          Dokumen dari Admin
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

              <section className="space-y-5">
                <VendorSectionCard
                  title="File Brief"
                  description="Dokumen resmi sebagai acuan vendor dalam mengerjakan proyek."
                >
                  {selectedBriefFiles.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedBriefFiles.map((file) => (
                        <AdminBriefFileCard key={file.id} file={file} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center">
                      <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-[#725F54]">
                        <Paperclip size={18} />
                      </div>

                      <p className="mt-3 text-[13px] font-semibold text-[#31332C]">
                        File brief belum tersedia
                      </p>

                      <p className="mx-auto mt-1 max-w-[320px] text-[12px] leading-5 text-[#7B756E]">
                        Admin VMatch belum mengirim dokumen brief untuk proyek ini.
                      </p>
                    </div>
                  )}
                </VendorSectionCard>

                <VendorSectionCard
                  title="Acuan Pekerjaan"
                  description="Ringkasan material, timeline, dan standar pengecekan proyek sebagai panduan vendor sebelum mulai bekerja."
                >
                  <div className="space-y-4">
                    <section className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Material Disetujui
                          </p>

                          <p className="mt-1 max-w-[620px] text-[12px] leading-5 text-[#7B756E]">
                            Material berikut menjadi acuan utama vendor dalam pengerjaan proyek.
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                          {selectedBrief.materialApproved.length} material
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedBrief.materialApproved.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium leading-5 text-[#725F54]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <section className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                              Timeline Target
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                              Tahapan pengerjaan yang perlu diikuti vendor.
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                            {selectedBrief.timeline.length} tahap
                          </span>
                        </div>

                        <div className="mt-4 space-y-2.5">
                          {selectedBrief.timeline.map((item, index) => (
                            <div
                              key={`${item.label}-${item.date}`}
                              className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-white p-3"
                            >
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#FCFBF9] text-[11px] font-semibold text-[#725F54]">
                                {index + 1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold leading-5 text-[#31332C]">
                                  {item.label}
                                </p>

                                <p className="mt-0.5 text-[11px] leading-5 text-[#7B756E]">
                                  {item.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                              Standar QC
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                              Poin pengecekan sebelum hasil disetujui VMatch.
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                            QC
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2.5">
                          {selectedBrief.qcChecklist.map((item) => (
                            <VendorChecklistItem
                              key={item}
                              label={item}
                              completed={selectedStatus === "Sudah Dibaca"}
                            />
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </VendorSectionCard>
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
          description="Pastikan kamu sudah membaca file brief, material, timeline, dan standar QC sebelum mulai bekerja."
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
      className={`w-full rounded-2xl border p-4 text-left transition hover:bg-[#FCFBF9] ${active
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
        File brief dan rencana kerja dari admin VMatch.
      </p>
    </button>
  );
}

function AdminBriefFileCard({ file }: { file: AdminBriefFile }) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <FileText size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-semibold leading-6 text-[#31332C]">
              {file.name}
            </h3>

            <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-semibold text-[#725F54]">
              {file.type}
            </span>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[#A19B95]">
            Dikirim oleh {file.uploadedBy} • {file.uploadedAt} • {file.size}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#E8E2D9] pt-4">
        <a
          href={file.url}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          <Eye size={14} />
          Lihat
        </a>

        <a
          href={file.url}
          download
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-3 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Download size={14} />
          Unduh
        </a>
      </div>
    </div>
  );
}