"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileCheck2,
  ImageIcon,
  MapPin,
  PackageCheck,
  Save,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProjects, updateProject, getQcChecklist, upsertQcChecklist, getProgressLogs } from "@/lib/api/projects";
import type { Project as DBProject, QcChecklist as DBQcChecklist, ProgressLog as DBProgressLog } from "@/lib/supabase/types";
import { toast } from "sonner";

type ProgressStatus =
  | "Berjalan"
  | "Menunggu Update"
  | "Butuh QC"
  | "Ada Kendala"
  | "Selesai";

type ProgressTab = "Semua" | "Berjalan" | "QC" | "Kendala" | "Selesai";

type ProgressLog = {
  id: string;
  projectTitle: string;
  customerName: string;
  vendorName: string;
  location: string;
  projectType: string;
  status: ProgressStatus;
  progress: number;
  currentStage: string;
  nextAction: string;
  updatedAt: string;
  adminNote: string;
  vendorNote: string;
  qcSummary: string;
  photos: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
  timeline: {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "update" | "qc" | "issue" | "done";
  }[];
  qcChecklist: {
    id: string;
    label: string;
    checked: boolean;
  }[];
};

const progressTabs: ProgressTab[] = [
  "Semua",
  "Berjalan",
  "QC",
  "Kendala",
  "Selesai",
];

const statusOptions: ProgressStatus[] = [
  "Berjalan",
  "Menunggu Update",
  "Butuh QC",
  "Ada Kendala",
  "Selesai",
];

const initialLogs: ProgressLog[] = [];

function mapDbToLocalLog(p: DBProject): ProgressLog {
  return {
    id: p.id,
    projectTitle: p.title,
    customerName: p.customer?.full_name || "Customer",
    vendorName: p.vendor?.full_name || "-",
    location: p.location || "-",
    projectType: p.project_type || "-",
    status: (p.status as ProgressStatus) || "Berjalan",
    progress: p.progress,
    currentStage: p.current_stage || "-",
    nextAction: p.next_task || "-",
    updatedAt: new Date(p.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    adminNote: p.admin_note || "",
    vendorNote: "",
    qcSummary: "",
    photos: [],
    timeline: [],
    qcChecklist: [],
  };
}

export function ProgressQcView() {
  const [logs, setLogs] = useState<ProgressLog[]>(initialLogs);
  const [activeTab, setActiveTab] = useState<ProgressTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isAdminNoteSaved, setIsAdminNoteSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadLogs = useCallback(async () => {
    try {
      const data = await getProjects();
      setLogs(data.map(mapDbToLocalLog));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return logs.filter((log) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Berjalan" &&
          ["Berjalan", "Menunggu Update"].includes(log.status)) ||
        (activeTab === "QC" && log.status === "Butuh QC") ||
        (activeTab === "Kendala" && log.status === "Ada Kendala") ||
        (activeTab === "Selesai" && log.status === "Selesai");

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        log.projectTitle.toLowerCase().includes(normalizedKeyword) ||
        log.customerName.toLowerCase().includes(normalizedKeyword) ||
        log.vendorName.toLowerCase().includes(normalizedKeyword) ||
        log.location.toLowerCase().includes(normalizedKeyword) ||
        log.projectType.toLowerCase().includes(normalizedKeyword) ||
        log.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, logs]);

  const selectedLog = useMemo(() => {
    if (!selectedLogId) return null;

    return logs.find((log) => log.id === selectedLogId) ?? null;
  }, [logs, selectedLogId]);

  const openDetail = async (log: ProgressLog) => {
    setSelectedLogId(log.id);
    setAdminNoteDraft(log.adminNote);
    setIsAdminNoteSaved(false);

    try {
      const [qc, pLogs] = await Promise.all([
        getQcChecklist(log.id).catch(() => null),
        getProgressLogs(log.id).catch(() => [] as DBProgressLog[])
      ]);
      
      const newPhotos = pLogs
        .filter(l => l.photo_path)
        .map(l => ({
          id: l.id,
          title: l.photo_label || "Foto Progress",
          description: l.work_summary || "Tidak ada deskripsi",
          date: new Date(l.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          path: l.photo_path
        }));

      const newTimeline = pLogs.map(l => ({
        id: l.id,
        title: l.status,
        description: l.work_summary || "Update progress",
        time: new Date(l.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        type: l.status === "Ada Kendala" ? "issue" : (l.progress_percent >= 100 ? "done" : "update") as "update" | "qc" | "issue" | "done"
      }));

      updateLog(log.id, (l) => ({
        ...l,
        photos: newPhotos as any[], // Casting to bypass strict type for now as we added 'path'
        timeline: newTimeline,
        qcChecklist: (qc?.items as any[])?.map((item, index) => ({
          id: `qc-${index}`,
          label: item.label,
          checked: item.completed,
        })) || l.qcChecklist,
      }));
    } catch {
      // silent
    }
  };

  const closeDetail = () => {
    setSelectedLogId(null);
    setAdminNoteDraft("");
    setIsAdminNoteSaved(false);
  };

  const updateLog = (
    id: string,
    updater: (log: ProgressLog) => ProgressLog,
  ) => {
    setLogs((current) =>
      current.map((log) =>
        log.id === id
          ? {
            ...updater(log),
            updatedAt: "Baru saja",
          }
          : log,
      ),
    );
  };

  const updateChecklist = async (id: string, checkId: string) => {
    if (submitting) return;
    const log = logs.find((l) => l.id === id);
    if (!log) return;

    const newChecklist = log.qcChecklist.map((item) =>
      item.id === checkId
        ? {
          ...item,
          checked: !item.checked,
        }
        : item,
    );

    try {
      setSubmitting(true);
      await upsertQcChecklist({
        project_id: id,
        items: newChecklist.map((c) => ({
          label: c.label,
          completed: c.checked,
        })),
      });
      updateLog(id, (l) => ({
        ...l,
        qcChecklist: newChecklist,
      }));
    } catch {
      toast.error("Gagal menyimpan checklist QC.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: ProgressStatus) => {
    if (submitting) return;
    const log = logs.find((l) => l.id === id);
    if (!log) return;

    const newProgress = status === "Selesai" ? 100 : log.progress;
    const newStage = status === "Selesai" ? "Selesai" : log.currentStage;

    try {
      setSubmitting(true);
      await updateProject(id, {
        status,
        progress: newProgress,
        current_stage: newStage,
      });

      updateLog(id, (l) => ({
        ...l,
        status,
        progress: newProgress,
        currentStage: newStage,
      }));

      if (status === "Selesai") {
        setActiveTab("Selesai");
      } else if (status === "Butuh QC") {
        setActiveTab("QC");
      } else if (status === "Ada Kendala") {
        setActiveTab("Kendala");
      } else {
        setActiveTab("Berjalan");
      }

      toast.success(`Status berhasil diubah menjadi ${status}`);
    } catch {
      toast.error("Gagal mengubah status proyek.");
    } finally {
      setSubmitting(false);
    }
  };

  const saveAdminNote = async () => {
    if (!selectedLog || submitting) return;

    try {
      setSubmitting(true);
      await updateProject(selectedLog.id, {
        admin_note: adminNoteDraft,
      });

      updateLog(selectedLog.id, (log) => ({
        ...log,
        adminNote: adminNoteDraft,
      }));

      setIsAdminNoteSaved(true);
      toast.success("Catatan admin berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan catatan admin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedLog) {
    return (
      <ProgressDetailPage
        log={selectedLog}
        adminNoteDraft={adminNoteDraft}
        isAdminNoteSaved={isAdminNoteSaved}
        submitting={submitting}
        onBack={closeDetail}
        onChangeAdminNote={(value) => {
          setAdminNoteDraft(value);
          setIsAdminNoteSaved(false);
        }}
        onSaveAdminNote={saveAdminNote}
        onStatusChange={(status) => updateStatus(selectedLog.id, status)}
        onChecklistToggle={(checkId) => updateChecklist(selectedLog.id, checkId)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Progress & QC
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Daftar Progress
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Pantau update pengerjaan dari vendor, dokumentasi foto, riwayat
            progress, kendala lapangan, dan checklist quality control sebelum
            proyek diselesaikan.
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
              placeholder="Cari progress, proyek, customer, vendor, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) =>
                setActiveTab(event.target.value as ProgressTab)
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {progressTabs.map((tab) => (
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
              {progressTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold transition ${active
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
        {filteredLogs.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredLogs.map((log) => (
              <ProgressCard
                key={log.id}
                log={log}
                onClick={() => openDetail(log)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Progress tidak ditemukan.
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

function ProgressDetailPage({
  log,
  adminNoteDraft,
  isAdminNoteSaved,
  submitting = false,
  onBack,
  onChangeAdminNote,
  onSaveAdminNote,
  onStatusChange,
  onChecklistToggle,
}: {
  log: ProgressLog;
  adminNoteDraft: string;
  isAdminNoteSaved: boolean;
  submitting?: boolean;
  onBack: () => void;
  onChangeAdminNote: (value: string) => void;
  onSaveAdminNote: () => void;
  onStatusChange: (status: ProgressStatus) => void;
  onChecklistToggle: (checkId: string) => void;
}) {
  const isAdminNoteChanged = adminNoteDraft !== log.adminNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar progress
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                {log.projectType}
              </p>

              <ProgressStatusBadge status={log.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {log.projectTitle}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              Pantau dokumentasi vendor, riwayat update, catatan kendala, dan
              checklist QC sebelum proyek masuk tahap berikutnya.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Progress
            </label>

            <div className="relative mt-3">
              <select
                value={log.status}
                disabled={submitting}
                onChange={(event) =>
                  onStatusChange(event.target.value as ProgressStatus)
                }
                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10 disabled:opacity-50"
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
                    Progress Pengerjaan
                  </p>

                  <p className="mt-1 text-[11px] text-[#7B756E]">
                    Tahap saat ini: {log.currentStage}
                  </p>
                </div>

                <p className="shrink-0 font-serif text-[28px] leading-none text-[#725F54]">
                  {log.progress}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                <div
                  className="h-full rounded-full bg-[#725F54]"
                  style={{ width: `${log.progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Tindak Lanjut
              </p>

              <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                {log.nextAction}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoTile
              icon={UserRound}
              label="Customer"
              value={log.customerName}
              description={log.projectType}
            />

            <InfoTile
              icon={Users}
              label="Vendor"
              value={log.vendorName}
              description="Vendor partner"
            />

            <InfoTile
              icon={MapPin}
              label="Lokasi"
              value={log.location}
              description="Area pengerjaan"
            />

            <InfoTile
              icon={PackageCheck}
              label="Tahap"
              value={log.currentStage}
              description="Progress berjalan"
            />

            <InfoTile
              icon={Clock}
              label="Update"
              value={log.updatedAt}
              description="Terakhir diperbarui"
            />

            <InfoTile
              icon={Camera}
              label="Dokumentasi"
              value={`${log.photos.length} foto`}
              description="Foto progress"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Dokumentasi Progress"
            description="Foto atau catatan visual yang dikirim vendor."
          >
            <div className="grid gap-3">
              {log.photos.map((photo: any) => (
                <div
                  key={photo.id}
                  className="flex min-w-0 gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                >
                  {photo.path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vmatch-files/${photo.path}`}
                      alt={photo.title}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-[#E8E2D9]"
                    />
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                      <ImageIcon size={17} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#31332C]">
                      {photo.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                      {photo.description}
                    </p>

                    <p className="mt-1 text-[11px] text-[#9A8F86]">
                      {photo.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock
            title="Riwayat Update"
            description="Perubahan dan catatan progress terbaru."
            withRightBorder={false}
          >
            <div className="space-y-2.5">
              {log.timeline.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-semibold text-[#31332C]">
                      {item.title}
                    </p>

                    <TimelineTypeBadge type={item.type} />
                  </div>

                  <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                    {item.description}
                  </p>

                  <p className="mt-2 text-[11px] text-[#9A8F86]">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </DetailBlock>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Catatan Admin"
            description="Catatan internal admin untuk review progress dan QC."
            badge={isAdminNoteSaved ? "Tersimpan" : undefined}
          >
            <textarea
              value={adminNoteDraft}
              onChange={(event) => onChangeAdminNote(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onSaveAdminNote}
                disabled={submitting || !isAdminNoteChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isAdminNoteChanged && !submitting
                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                  }`}
              >
                <Save size={14} />
                {submitting ? "Menyimpan..." : "Simpan Catatan"}
              </button>
            </div>
          </DetailBlock>

          <DetailBlock
            title="Catatan Vendor"
            description="Informasi progress atau kendala dari vendor."
            withRightBorder={false}
          >
            <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3">
              <p className="text-[13px] leading-7 text-[#31332C]">
                {log.vendorNote}
              </p>
            </div>
          </DetailBlock>
        </div>

        <div className="border-t border-[#E8E2D9] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Checklist QC
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            Tandai poin quality control yang sudah sesuai sebelum proyek dinyatakan selesai.
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {log.qcChecklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChecklistToggle(item.id)}
                disabled={submitting}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition disabled:opacity-70 ${item.checked
                    ? "border-[#725F54] bg-[#F4EEE8]"
                    : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
                  }`}
              >
                <div
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${item.checked
                      ? "border-[#725F54] bg-[#725F54] text-white"
                      : "border-[#D9C8BA] bg-white text-transparent"
                    }`}
                >
                  <CheckCircle2 size={14} />
                </div>

                <span className="text-[12px] leading-5 text-[#31332C]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>


      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onStatusChange("Butuh QC")}
          disabled={submitting}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition disabled:opacity-50 ${log.status === "Butuh QC"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <ClipboardCheck size={15} />
          {submitting && log.status !== "Butuh QC" ? "Memproses..." : "Butuh QC"}
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Ada Kendala")}
          disabled={submitting}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition disabled:opacity-50 ${log.status === "Ada Kendala"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <AlertTriangle size={15} />
          Kendala
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Selesai")}
          disabled={submitting}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition disabled:opacity-50 sm:col-span-1 ${log.status === "Selesai"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <FileCheck2 size={15} />
          QC Selesai
        </button>
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  description,
  children,
  badge,
  withRightBorder = true,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
  withRightBorder?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 lg:border-b-0 ${withRightBorder ? "lg:border-r" : ""
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

function ProgressCard({
  log,
  onClick,
}: {
  log: ProgressLog;
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
            {log.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {log.vendorName} • {log.location}
          </p>
        </div>

        <ProgressStatusBadge status={log.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {log.nextAction}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-[#7B756E]">
            Progress
          </span>

          <span className="text-[11px] font-semibold text-[#725F54]">
            {log.progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
          <div
            className="h-full rounded-full bg-[#725F54]"
            style={{ width: `${log.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[12px] text-[#7B756E]">
          {log.currentStage}
        </p>

        <span className="shrink-0 rounded-full bg-[#F5F0EA] px-3 py-1 text-[11px] font-semibold text-[#725F54]">
          {log.projectType}
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

function TimelineTypeBadge({
  type,
}: {
  type: "update" | "qc" | "issue" | "done";
}) {
  const label =
    type === "update"
      ? "Update"
      : type === "qc"
        ? "QC"
        : type === "issue"
          ? "Kendala"
          : "Selesai";

  const style =
    type === "done"
      ? "bg-[#F5FAF6] text-[#4F7A5F]"
      : type === "issue"
        ? "bg-[#FFF8ED] text-[#8A5A24]"
        : "bg-white text-[#725F54] ring-1 ring-[#E8E2D9]";

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${style}`}
    >
      {label}
    </span>
  );
}

function ProgressStatusBadge({ status }: { status: ProgressStatus }) {
  const style =
    status === "Berjalan"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Butuh QC" || status === "Menunggu Update"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : status === "Ada Kendala"
          ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
          : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
