"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Paperclip,
  Save,
  Search,
  Send,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { workBriefs } from "../mock-data";
import type { VendorPageId, WorkBrief, WorkPlanStatus } from "../types";
import {
  VendorChecklistItem,
  VendorEmptyState,
  VendorModal,
  VendorModalActions,
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

type VendorEstimateDraft = {
  estimatedCost: string;
  estimatedDuration: string;
  suggestedMaterial: string;
  vendorNote: string;
};

const emptyEstimateDraft: VendorEstimateDraft = {
  estimatedCost: "",
  estimatedDuration: "",
  suggestedMaterial: "",
  vendorNote: "",
};


type BriefTab = "Semua" | "Belum Dibaca" | "Sudah Dibaca" | "Estimasi Dikirim";

const briefTabs: BriefTab[] = ["Semua", "Belum Dibaca", "Sudah Dibaca", "Estimasi Dikirim"];

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

const vendorBriefScopes: Record<string, string> = {
  "brief-1":
    "Pembuatan wardrobe built-in full plafon untuk kamar utama. Pekerjaan mencakup pintu sliding, area gantung, rak lipat, dan storage tambahan. Vendor mengikuti ukuran dan referensi desain yang sudah dikirim oleh admin VMatch.",
  "brief-2":
    "Pembuatan kitchen set minimalis untuk area dapur kecil. Pekerjaan mencakup kabinet bawah, kabinet atas, area penyimpanan, dan finishing HPL. Vendor perlu memastikan area instalasi sesuai hasil survey dan file brief dari admin.",
};

export function BriefWorkPlanView({
  onChangePage,
}: {
  onChangePage: (page: VendorPageId) => void;
}) {
  const [activeTab, setActiveTab] = useState<BriefTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [vendorNotes, setVendorNotes] = useState<Record<string, string>>({});
  const [vendorNoteDraft, setVendorNoteDraft] = useState("");
  const [isVendorNoteSaved, setIsVendorNoteSaved] = useState(false);

  const [estimateDrafts, setEstimateDrafts] = useState<
    Record<string, VendorEstimateDraft>
  >({});
  const [estimateSentBriefIds, setEstimateSentBriefIds] = useState<
    Record<string, boolean>
  >({});
  const [estimateFeedback, setEstimateFeedback] = useState("");

  const [briefStatuses, setBriefStatuses] = useState<
    Record<string, WorkPlanStatus>
  >(
    () =>
      Object.fromEntries(
        workBriefs.map((brief) => [brief.id, brief.status]),
      ) as Record<string, WorkPlanStatus>,
  );

  const filteredBriefs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return workBriefs.filter((brief) => {
      const currentStatus = briefStatuses[brief.id] ?? brief.status;

      const matchTab =
        activeTab === "Semua" || currentStatus === activeTab;

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        brief.projectName.toLowerCase().includes(normalizedKeyword) ||
        currentStatus.toLowerCase().includes(normalizedKeyword) ||
        brief.materialApproved.join(" ").toLowerCase().includes(normalizedKeyword) ||
        brief.timeline
          .map((item) => `${item.label} ${item.date}`)
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword) ||
        brief.qcChecklist.join(" ").toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, briefStatuses, keyword]);

  const selectedBrief = useMemo(() => {
    if (!selectedBriefId) return null;

    return workBriefs.find((brief) => brief.id === selectedBriefId) ?? null;
  }, [selectedBriefId]);

  const selectedStatus = selectedBrief
    ? briefStatuses[selectedBrief.id] ?? selectedBrief.status
    : "Belum Dibaca";

  const selectedBriefFiles = selectedBrief
    ? adminBriefFiles[selectedBrief.id] ?? []
    : [];

  const selectedBriefScope = selectedBrief
    ? vendorBriefScopes[selectedBrief.id] ?? ""
    : "";

  const isVendorNoteChanged = selectedBrief
    ? vendorNoteDraft !== (vendorNotes[selectedBrief.id] ?? "")
    : false;

  const currentEstimateDraft = selectedBrief
    ? estimateDrafts[selectedBrief.id] ?? emptyEstimateDraft
    : emptyEstimateDraft;

  const isEstimateSent = selectedBrief
    ? Boolean(estimateSentBriefIds[selectedBrief.id])
    : false;

  const isEstimateReady =
    currentEstimateDraft.estimatedCost.trim().length > 0 &&
    currentEstimateDraft.estimatedDuration.trim().length > 0 &&
    currentEstimateDraft.suggestedMaterial.trim().length > 0;

  const openDetail = (brief: WorkBrief) => {
    setSelectedBriefId(brief.id);
    setVendorNoteDraft(vendorNotes[brief.id] ?? "");
    setIsVendorNoteSaved(false);
    setEstimateFeedback("");
  };

  const closeDetail = () => {
    setSelectedBriefId(null);
    setVendorNoteDraft("");
    setIsVendorNoteSaved(false);
    setEstimateFeedback("");
    setConfirmOpen(false);
  };

  const handleMarkAsRead = () => {
    if (!selectedBrief) return;

    setBriefStatuses((current) => ({
      ...current,
      [selectedBrief.id]: "Sudah Dibaca",
    }));

    setConfirmOpen(false);
  };

  const saveVendorNote = () => {
    if (!selectedBrief) return;

    setVendorNotes((current) => ({
      ...current,
      [selectedBrief.id]: vendorNoteDraft,
    }));

    setIsVendorNoteSaved(true);
  };

  const updateEstimateDraft = (draft: VendorEstimateDraft) => {
    if (!selectedBrief) return;

    setEstimateDrafts((current) => ({
      ...current,
      [selectedBrief.id]: draft,
    }));

    setEstimateFeedback("");
  };

  const sendEstimateToAdmin = () => {
    if (!selectedBrief || !isEstimateReady) return;

    setEstimateDrafts((current) => ({
      ...current,
      [selectedBrief.id]: currentEstimateDraft,
    }));

    setEstimateSentBriefIds((current) => ({
      ...current,
      [selectedBrief.id]: true,
    }));

    setBriefStatuses((current) => ({
      ...current,
      [selectedBrief.id]: "Estimasi Dikirim",
    }));

    setEstimateFeedback(
      "Estimasi RAB berhasil dikirim ke admin untuk direview di RAB Builder.",
    );
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

        <section className="rounded-3xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
          <VendorEmptyState
            icon={ClipboardList}
            title="Belum ada brief kerja"
            description="Brief dan rencana kerja dari VMatch akan tampil di sini setelah proyek siap."
          />
        </section>
      </div>
    );
  }

  if (selectedBrief) {
    return (
      <div className="w-full space-y-5">
        <button
          type="button"
          onClick={closeDetail}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          <ArrowLeft size={15} />
          Kembali ke daftar brief
        </button>

        <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
          <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <VendorStatusBadge status={selectedStatus} />

                <span className="rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-1 text-[11px] font-semibold text-[#7B756E]">
                  Dokumen dari Admin
                </span>
              </div>

              <h1 className="mt-3 max-w-[780px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                {selectedBrief.projectName}
              </h1>

              <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                Baca brief, cek file, pahami scope, material, timeline, dan
                standar QC sebelum mulai mengerjakan proyek.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Status Brief
              </p>

              <p className="mt-2 text-[13px] font-semibold text-[#31332C]">
                {selectedStatus}
              </p>

              <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                Konfirmasi setelah file brief, material, timeline, dan QC sudah
                dibaca.
              </p>
            </div>
          </div>

          <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoTile
                icon={FileText}
                label="File Brief"
                value={`${selectedBriefFiles.length} file`}
                description="Dokumen resmi"
              />

              <InfoTile
                icon={ClipboardList}
                label="Material"
                value={`${selectedBrief.materialApproved.length} item`}
                description="Material disetujui"
              />

              <InfoTile
                icon={CalendarDays}
                label="Timeline"
                value={`${selectedBrief.timeline.length} tahap`}
                description={selectedBrief.timeline[0]?.date ?? "TBA"}
              />

              <InfoTile
                icon={ClipboardCheck}
                label="QC"
                value={`${selectedBrief.qcChecklist.length} poin`}
                description="Standar pengecekan"
              />
            </div>
          </div>

          {selectedBrief.notes && (
            <div className="border-t border-[#E8E2D9] bg-[#FFFDF9] p-5 sm:p-6">
              <div className="rounded-2xl border border-[#D9C8BA] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan VMatch
                </p>

                <p className="mt-2 text-[13px] leading-7 text-[#6F6860]">
                  {selectedBrief.notes}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <DetailSection
              title="Scope Pekerjaan"
              description="Ringkasan pekerjaan dari admin sebagai acuan vendor."
            >
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[13px] leading-7 text-[#31332C]">
                  {selectedBriefScope ||
                    "Scope pekerjaan belum tersedia. Vendor dapat membaca detail melalui file brief yang dikirim admin."}
                </p>
              </div>
            </DetailSection>

            <DetailSection
              title="Tanggapan Vendor"
              description="Catatan vendor jika ada bagian yang perlu dikonfirmasi ke admin."
              badge={isVendorNoteSaved ? "Tersimpan" : undefined}
              withRightBorder={false}
            >
              <div className="flex gap-3">
                <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54] sm:grid">
                  <MessageSquare size={17} />
                </div>

                <textarea
                  value={vendorNoteDraft}
                  onChange={(event) => {
                    setVendorNoteDraft(event.target.value);
                    setIsVendorNoteSaved(false);
                  }}
                  rows={5}
                  placeholder="Contoh: Vendor perlu konfirmasi ulang ukuran area kabinet atas sebelum produksi."
                  className="min-w-0 flex-1 resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={saveVendorNote}
                  disabled={!isVendorNoteChanged}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isVendorNoteChanged
                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                    }`}
                >
                  <Save size={14} />
                  Simpan Tanggapan
                </button>
              </div>
            </DetailSection>
          </div>

          <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  File Brief
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  Dokumen resmi sebagai acuan vendor dalam mengerjakan proyek.
                </p>
              </div>

              <span className="w-fit rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                {selectedBriefFiles.length} file
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {selectedBriefFiles.length > 0 ? (
                selectedBriefFiles.map((file) => (
                  <AdminBriefFileCard key={file.id} file={file} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-6 text-center">
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54]">
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
            </div>
          </div>

          <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <DetailSection
              title="Material Disetujui"
              description="Material utama yang menjadi acuan pengerjaan proyek."
            >
              <div className="flex flex-wrap gap-2">
                {selectedBrief.materialApproved.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-3 py-1.5 text-[12px] font-medium leading-5 text-[#725F54]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title="Timeline Target"
              description="Tahapan pengerjaan yang perlu diikuti vendor."
              withRightBorder={false}
            >
              <div className="space-y-2.5">
                {selectedBrief.timeline.map((item, index) => (
                  <div
                    key={`${item.label}-${item.date}`}
                    className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-semibold text-[#725F54] ring-1 ring-[#E8E2D9]">
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
            </DetailSection>
          </div>

          <VendorEstimateSection
            estimateDraft={currentEstimateDraft}
            isEstimateReady={isEstimateReady}
            isEstimateSent={isEstimateSent}
            feedbackMessage={estimateFeedback}
            onChangeEstimate={updateEstimateDraft}
            onSendEstimate={sendEstimateToAdmin}
          />

          <div className="border-t border-[#E8E2D9] p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Standar QC
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
              Poin pengecekan sebelum hasil pekerjaan disetujui VMatch.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {selectedBrief.qcChecklist.map((item) => (
                <VendorChecklistItem
                  key={item}
                  label={item}
                  completed={selectedStatus === "Sudah Dibaca"}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={selectedStatus === "Sudah Dibaca" || selectedStatus === "Estimasi Dikirim"}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${selectedStatus === "Sudah Dibaca" || selectedStatus === "Estimasi Dikirim"
              ? "cursor-not-allowed border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
              : "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
              }`}
          >
            <CheckCircle2 size={15} />
            {selectedStatus === "Sudah Dibaca" ? "Sudah Dibaca" : "Konfirmasi"}
          </button>

          <button
            type="button"
            onClick={sendEstimateToAdmin}
            disabled={!isEstimateReady || isEstimateSent}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
              isEstimateReady && !isEstimateSent
                ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
                : "cursor-not-allowed border-[#E8E2D9] bg-[#E8E2D9] text-[#9A8F86]"
            }`}
          >
            <Send size={15} />
            {isEstimateSent ? "Estimasi Terkirim" : "Kirim Estimasi"}
          </button>

          <button
            type="button"
            onClick={() => onChangePage("progress-log")}
            className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white sm:col-span-1"
          >
            <FileText size={15} />
            Isi Log
          </button>
        </div>

        {confirmOpen && (
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

  return (
    <div className="w-full space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
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
        </div>
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari brief, status, material, timeline, atau QC..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as BriefTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {briefTabs.map((tab) => (
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
              {briefTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[12px] font-semibold transition ${active
                      ? "bg-[#725F54] text-white shadow-sm"
                      : "text-[#6F6860] hover:bg-white"
                      }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredBriefs.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredBriefs.map((brief) => {
              const status = briefStatuses[brief.id] ?? brief.status;

              return (
                <BriefListCard
                  key={brief.id}
                  brief={brief}
                  status={status}
                  onClick={() => openDetail(brief)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Brief tidak ditemukan.
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


function VendorEstimateSection({
  estimateDraft,
  isEstimateReady,
  isEstimateSent,
  feedbackMessage,
  onChangeEstimate,
  onSendEstimate,
}: {
  estimateDraft: VendorEstimateDraft;
  isEstimateReady: boolean;
  isEstimateSent: boolean;
  feedbackMessage: string;
  onChangeEstimate: (draft: VendorEstimateDraft) => void;
  onSendEstimate: () => void;
}) {
  return (
    <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Estimasi RAB Vendor
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            Kirim estimasi awal ke admin. Nominal ini belum dikirim ke customer
            sebelum direview dan difinalisasi oleh admin VMatch.
          </p>
        </div>

        {isEstimateSent && (
          <span className="w-fit rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[11px] font-semibold text-[#4F7A5F]">
            Estimasi Dikirim
          </span>
        )}
      </div>

      {feedbackMessage && (
        <div className="mt-4 rounded-2xl border border-[#DCEBDD] bg-[#F5FAF6] px-4 py-3 text-[12px] font-semibold leading-5 text-[#4F7A5F]">
          {feedbackMessage}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <EstimateInput
          icon={Wallet}
          label="Estimasi Biaya"
          value={estimateDraft.estimatedCost}
          placeholder="Contoh: Rp23.500.000"
          onChange={(value) =>
            onChangeEstimate({
              ...estimateDraft,
              estimatedCost: value,
            })
          }
        />

        <EstimateInput
          icon={Clock3}
          label="Estimasi Durasi"
          value={estimateDraft.estimatedDuration}
          placeholder="Contoh: 14-21 hari"
          onChange={(value) =>
            onChangeEstimate({
              ...estimateDraft,
              estimatedDuration: value,
            })
          }
        />

        <EstimateInput
          icon={Calculator}
          label="Material Disarankan"
          value={estimateDraft.suggestedMaterial}
          placeholder="Contoh: Multiplek 18mm + HPL"
          onChange={(value) =>
            onChangeEstimate({
              ...estimateDraft,
              suggestedMaterial: value,
            })
          }
        />
      </div>

      <div className="mt-3">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
            Catatan Estimasi
          </span>

          <textarea
            value={estimateDraft.vendorNote}
            onChange={(event) =>
              onChangeEstimate({
                ...estimateDraft,
                vendorNote: event.target.value,
              })
            }
            rows={4}
            placeholder="Tambahkan catatan material, kondisi pekerjaan, kebutuhan survey, atau hal yang perlu direview admin."
            className="mt-2 w-full resize-none rounded-xl border border-[#E4D8CD] bg-white px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSendEstimate}
          disabled={!isEstimateReady || isEstimateSent}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
            isEstimateReady && !isEstimateSent
              ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
              : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
          }`}
        >
          <Send size={14} />
          {isEstimateSent ? "Estimasi Terkirim" : "Kirim Estimasi RAB"}
        </button>
      </div>
    </div>
  );
}

function EstimateInput({
  icon: Icon,
  label,
  value,
  placeholder,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
        {label}
      </span>

      <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3">
        <Icon size={15} className="shrink-0 text-[#725F54]" />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
        />
      </div>
    </label>
  );
}

function DetailSection({
  title,
  description,
  children,
  badge,
  withRightBorder = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
  withRightBorder?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 ${withRightBorder ? "xl:border-r" : ""
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {title}
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>

        {badge && (
          <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function BriefListCard({
  brief,
  status,
  onClick,
}: {
  brief: WorkBrief;
  status: WorkPlanStatus;
  onClick: () => void;
}) {
  const fileCount = adminBriefFiles[brief.id]?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-white ${status === "Belum Dibaca"
        ? "border-[#E8D6BE] bg-[#FFF8ED]"
        : "border-[#E8E2D9] bg-white"
        }`}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <VendorStatusBadge status={status} />

          <h3 className="mt-3 truncate text-[14px] font-semibold text-[#31332C]">
            {brief.projectName}
          </h3>
        </div>

        <span className="shrink-0 rounded-full border border-[#E8E2D9] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
          {fileCount} file
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        File brief dan rencana kerja dari admin VMatch.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#9A8F86]">
        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E8E2D9]">
          {brief.materialApproved.length} material
        </span>

        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E8E2D9]">
          {brief.timeline.length} tahap
        </span>

        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E8E2D9]">
          {brief.qcChecklist.length} QC
        </span>
      </div>
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

          <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
            {file.description}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#A19B95]">
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
