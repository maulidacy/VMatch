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
import { useMemo, useState } from "react";

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

const initialLogs: ProgressLog[] = [
  {
    id: "progress-1",
    projectTitle: "Kitchen Set Minimalis",
    customerName: "Alya Putri",
    vendorName: "Kayu Rapi Interior",
    location: "Semarang",
    projectType: "Kitchen Set",
    status: "Berjalan",
    progress: 45,
    currentStage: "Produksi kabinet",
    nextAction: "Vendor perlu upload foto progres produksi terbaru.",
    updatedAt: "Hari ini, 10.30",
    adminNote:
      "Pastikan ukuran kabinet atas sesuai brief dan tidak menutup area ventilasi.",
    vendorNote:
      "Produksi kabinet bawah sudah mulai. Kabinet atas masuk proses pemotongan material.",
    qcSummary:
      "Belum masuk tahap QC akhir. Admin baru melakukan pengecekan awal berdasarkan foto produksi.",
    photos: [
      {
        id: "photo-1",
        title: "Produksi kabinet bawah",
        description: "Rangka kabinet bawah sudah mulai dirakit.",
        date: "Hari ini",
      },
      {
        id: "photo-2",
        title: "Material HPL",
        description: "Material finishing sudah diterima vendor.",
        date: "Kemarin",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Produksi dimulai",
        description: "Vendor mulai pemotongan material kabinet bawah.",
        time: "Hari ini, 08.30",
        type: "update",
      },
      {
        id: "tl-2",
        title: "Catatan admin",
        description: "Admin meminta vendor memastikan posisi ventilasi.",
        time: "Kemarin",
        type: "qc",
      },
    ],
    qcChecklist: [
      {
        id: "qc-1",
        label: "Ukuran sesuai brief",
        checked: true,
      },
      {
        id: "qc-2",
        label: "Material sesuai kesepakatan",
        checked: true,
      },
      {
        id: "qc-3",
        label: "Finishing rapi",
        checked: false,
      },
      {
        id: "qc-4",
        label: "Siap serah terima",
        checked: false,
      },
    ],
  },
  {
    id: "progress-2",
    projectTitle: "Wardrobe Kamar Utama",
    customerName: "Bima Santoso",
    vendorName: "Mitra Interior Jogja",
    location: "Yogyakarta",
    projectType: "Wardrobe",
    status: "Ada Kendala",
    progress: 35,
    currentStage: "Revisi layout dalam wardrobe",
    nextAction: "Admin perlu review revisi layout dari vendor.",
    updatedAt: "Kemarin",
    adminNote:
      "Customer meminta tambahan area gantung panjang. Vendor perlu menyesuaikan layout.",
    vendorNote:
      "Layout awal perlu penyesuaian karena area gantung tambahan mengurangi ruang rak.",
    qcSummary:
      "Belum masuk QC. Kendala saat ini ada pada revisi layout internal wardrobe.",
    photos: [
      {
        id: "photo-1",
        title: "Layout wardrobe",
        description: "Vendor mengirim layout alternatif untuk bagian dalam.",
        date: "Kemarin",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Kendala layout",
        description: "Ada perubahan kebutuhan customer pada area gantung.",
        time: "Kemarin",
        type: "issue",
      },
      {
        id: "tl-2",
        title: "Vendor kirim revisi",
        description: "Vendor mengirim opsi layout baru untuk dicek admin.",
        time: "Hari ini",
        type: "update",
      },
    ],
    qcChecklist: [
      {
        id: "qc-1",
        label: "Layout sesuai kebutuhan customer",
        checked: false,
      },
      {
        id: "qc-2",
        label: "Ukuran ruang sesuai hasil survey",
        checked: true,
      },
      {
        id: "qc-3",
        label: "Material sesuai brief",
        checked: true,
      },
      {
        id: "qc-4",
        label: "Siap produksi",
        checked: false,
      },
    ],
  },
  {
    id: "progress-3",
    projectTitle: "Ruang Kerja Rumah",
    customerName: "Nadia Rahma",
    vendorName: "Studio Ruang Karya",
    location: "Solo",
    projectType: "Ruang Kerja",
    status: "Butuh QC",
    progress: 82,
    currentStage: "Pemasangan dan finishing",
    nextAction: "Admin perlu cek hasil pemasangan dari foto vendor.",
    updatedAt: "Hari ini, 13.10",
    adminNote:
      "Cek kerapian bagian meja, ambalan, dan area storage sebelum serah terima.",
    vendorNote:
      "Pemasangan sudah selesai 80%. Finishing minor masih dilakukan.",
    qcSummary:
      "Butuh pengecekan kerapian finishing dan kesesuaian posisi storage kanan.",
    photos: [
      {
        id: "photo-1",
        title: "Pemasangan meja",
        description: "Meja kerja custom sudah terpasang.",
        date: "Hari ini",
      },
      {
        id: "photo-2",
        title: "Ambalan dinding",
        description: "Ambalan sudah dipasang sesuai gambar kerja.",
        date: "Hari ini",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Pemasangan selesai sebagian",
        description: "Meja dan ambalan utama sudah terpasang.",
        time: "Hari ini, 13.10",
        type: "update",
      },
      {
        id: "tl-2",
        title: "QC diperlukan",
        description: "Admin perlu mengecek finishing dan storage tambahan.",
        time: "Hari ini, 14.00",
        type: "qc",
      },
    ],
    qcChecklist: [
      {
        id: "qc-1",
        label: "Pemasangan sesuai brief",
        checked: true,
      },
      {
        id: "qc-2",
        label: "Finishing rapi",
        checked: false,
      },
      {
        id: "qc-3",
        label: "Storage tambahan sesuai revisi",
        checked: false,
      },
      {
        id: "qc-4",
        label: "Siap serah terima",
        checked: false,
      },
    ],
  },
  {
    id: "progress-4",
    projectTitle: "Backdrop TV Ruang Keluarga",
    customerName: "Raka Pratama",
    vendorName: "Warm Living Interior",
    location: "Semarang",
    projectType: "Backdrop TV",
    status: "Selesai",
    progress: 100,
    currentStage: "Selesai",
    nextAction: "Dokumentasi akhir dan garansi.",
    updatedAt: "3 hari lalu",
    adminNote: "Dokumentasi akhir sudah lengkap. Masuk periode garansi.",
    vendorNote: "Proyek sudah selesai dan diterima customer.",
    qcSummary:
      "QC akhir selesai. Hasil pemasangan sesuai brief dan diterima customer.",
    photos: [
      {
        id: "photo-1",
        title: "Hasil akhir",
        description: "Backdrop TV sudah selesai dipasang.",
        date: "3 hari lalu",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "QC akhir selesai",
        description: "Admin menyetujui hasil akhir proyek.",
        time: "3 hari lalu",
        type: "done",
      },
      {
        id: "tl-2",
        title: "Customer menerima hasil",
        description: "Customer menyetujui hasil pemasangan.",
        time: "3 hari lalu",
        type: "done",
      },
    ],
    qcChecklist: [
      {
        id: "qc-1",
        label: "Pemasangan sesuai brief",
        checked: true,
      },
      {
        id: "qc-2",
        label: "Finishing rapi",
        checked: true,
      },
      {
        id: "qc-3",
        label: "Dokumentasi akhir lengkap",
        checked: true,
      },
      {
        id: "qc-4",
        label: "Siap serah terima",
        checked: true,
      },
    ],
  },
];

export function ProgressQcView() {
  const [logs, setLogs] = useState<ProgressLog[]>(initialLogs);
  const [activeTab, setActiveTab] = useState<ProgressTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isAdminNoteSaved, setIsAdminNoteSaved] = useState(false);

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

  const openDetail = (log: ProgressLog) => {
    setSelectedLogId(log.id);
    setAdminNoteDraft(log.adminNote);
    setIsAdminNoteSaved(false);
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

  const updateChecklist = (id: string, checkId: string) => {
    updateLog(id, (log) => ({
      ...log,
      qcChecklist: log.qcChecklist.map((item) =>
        item.id === checkId
          ? {
            ...item,
            checked: !item.checked,
          }
          : item,
      ),
    }));
  };

  const updateStatus = (id: string, status: ProgressStatus) => {
    updateLog(id, (log) => ({
      ...log,
      status,
      progress: status === "Selesai" ? 100 : log.progress,
      currentStage: status === "Selesai" ? "Selesai" : log.currentStage,
    }));

    if (status === "Selesai") {
      setActiveTab("Selesai");
      return;
    }

    if (status === "Butuh QC") {
      setActiveTab("QC");
      return;
    }

    if (status === "Ada Kendala") {
      setActiveTab("Kendala");
      return;
    }

    setActiveTab("Berjalan");
  };

  const saveAdminNote = () => {
    if (!selectedLog) return;

    updateLog(selectedLog.id, (log) => ({
      ...log,
      adminNote: adminNoteDraft,
    }));

    setIsAdminNoteSaved(true);
  };

  if (selectedLog) {
    return (
      <ProgressDetailPage
        log={selectedLog}
        adminNoteDraft={adminNoteDraft}
        isAdminNoteSaved={isAdminNoteSaved}
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
  onBack,
  onChangeAdminNote,
  onSaveAdminNote,
  onStatusChange,
  onChecklistToggle,
}: {
  log: ProgressLog;
  adminNoteDraft: string;
  isAdminNoteSaved: boolean;
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
                onChange={(event) =>
                  onStatusChange(event.target.value as ProgressStatus)
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
              {log.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex min-w-0 gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                    <ImageIcon size={17} />
                  </div>

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
                disabled={!isAdminNoteChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isAdminNoteChanged
                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                  }`}
              >
                <Save size={14} />
                Simpan Catatan
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
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${item.checked
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
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${log.status === "Butuh QC"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <ClipboardCheck size={15} />
          Butuh QC
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Ada Kendala")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${log.status === "Ada Kendala"
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
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${log.status === "Selesai"
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
