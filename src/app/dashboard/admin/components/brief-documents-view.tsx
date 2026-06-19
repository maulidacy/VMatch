"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FolderOpen,
  Layers,
  MessageSquare,
  Package,
  PenLine,
  Ruler,
  Send,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type BriefStatus = "Draft" | "Siap Vendor" | "Revisi" | "Disetujui";

type BriefTab = "Semua" | "Draft" | "Siap Vendor" | "Revisi" | "Disetujui";

type BriefDocument = {
  id: string;
  projectTitle: string;
  customerName: string;
  vendorName: string;
  projectType: string;
  location: string;
  roomSize: string;
  budget: string;
  status: BriefStatus;
  createdAt: string;
  updatedAt: string;
  scope: string;
  materialNote: string;
  adminNote: string;
  vendorNote: string;
  timeline: {
    id: string;
    label: string;
    date: string;
  }[];
  materials: string[];
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
};

const briefTabs: BriefTab[] = [
  "Semua",
  "Draft",
  "Siap Vendor",
  "Revisi",
  "Disetujui",
];

const initialBriefs: BriefDocument[] = [
  {
    id: "brief-1",
    projectTitle: "Kitchen Set Minimalis",
    customerName: "Alya Putri",
    vendorName: "Kayu Rapi Interior",
    projectType: "Kitchen Set",
    location: "Semarang",
    roomSize: "2.5m x 2m",
    budget: "Rp23.500.000",
    status: "Draft",
    createdAt: "3 Juli 2026",
    updatedAt: "Hari ini",
    scope:
      "Pembuatan kitchen set minimalis untuk area dapur kecil, meliputi kabinet bawah, kabinet atas, area penyimpanan, dan finishing HPL warna natural.",
    materialNote:
      "Material utama multiplek 18mm, finishing HPL motif kayu muda, top table solid surface, dan aksesoris soft close.",
    adminNote:
      "Pastikan ukuran kabinet atas mengikuti hasil survey terakhir dan tidak menutup area ventilasi.",
    vendorNote:
      "Vendor perlu mengirimkan gambar kerja final sebelum masuk tahap produksi.",
    timeline: [
      {
        id: "tl-1",
        label: "Survey & final ukuran",
        date: "3 Juli 2026",
      },
      {
        id: "tl-2",
        label: "Produksi kabinet",
        date: "6 - 18 Juli 2026",
      },
      {
        id: "tl-3",
        label: "Instalasi",
        date: "22 Juli 2026",
      },
    ],
    materials: ["Multiplek 18mm", "HPL kayu muda", "Solid surface", "Soft close"],
    checklist: [
      {
        id: "check-1",
        label: "Kebutuhan customer sudah dirangkum",
        completed: true,
      },
      {
        id: "check-2",
        label: "Ukuran ruang sudah dicatat",
        completed: true,
      },
      {
        id: "check-3",
        label: "Material sudah disetujui",
        completed: false,
      },
      {
        id: "check-4",
        label: "Brief siap dikirim ke vendor",
        completed: false,
      },
    ],
  },
  {
    id: "brief-2",
    projectTitle: "Wardrobe Kamar Utama",
    customerName: "Bima Santoso",
    vendorName: "Mitra Interior Jogja",
    projectType: "Wardrobe",
    location: "Yogyakarta",
    roomSize: "3m x 3m",
    budget: "Rp16.000.000",
    status: "Siap Vendor",
    createdAt: "5 Juli 2026",
    updatedAt: "Kemarin",
    scope:
      "Pembuatan wardrobe built-in full plafon dengan pintu sliding, area gantung, rak lipat, dan storage tambahan.",
    materialNote:
      "Material multiplek 15mm, finishing HPL warna natural, rel sliding, dan handle minimalis.",
    adminNote:
      "Customer meminta tambahan area gantung baju panjang di sisi kiri wardrobe.",
    vendorNote:
      "Vendor diminta mengecek kembali layout bagian dalam sebelum produksi.",
    timeline: [
      {
        id: "tl-1",
        label: "Review brief",
        date: "5 Juli 2026",
      },
      {
        id: "tl-2",
        label: "Produksi",
        date: "8 - 20 Juli 2026",
      },
      {
        id: "tl-3",
        label: "Instalasi",
        date: "24 Juli 2026",
      },
    ],
    materials: ["Multiplek 15mm", "HPL natural", "Rel sliding", "Handle minimalis"],
    checklist: [
      {
        id: "check-1",
        label: "Kebutuhan customer sudah dirangkum",
        completed: true,
      },
      {
        id: "check-2",
        label: "Ukuran ruang sudah dicatat",
        completed: true,
      },
      {
        id: "check-3",
        label: "Material sudah disetujui",
        completed: true,
      },
      {
        id: "check-4",
        label: "Brief siap dikirim ke vendor",
        completed: true,
      },
    ],
  },
  {
    id: "brief-3",
    projectTitle: "Ruang Kerja Rumah",
    customerName: "Nadia Rahma",
    vendorName: "Studio Ruang Karya",
    projectType: "Ruang Kerja",
    location: "Solo",
    roomSize: "2m x 3m",
    budget: "Rp10.500.000",
    status: "Revisi",
    createdAt: "1 Juli 2026",
    updatedAt: "2 hari lalu",
    scope:
      "Pembuatan meja kerja custom, rak buku, dan storage kecil dengan konsep Scandinavian yang sederhana dan terang.",
    materialNote:
      "Material multiplek, finishing HPL putih doff, aksen kayu muda, dan ambalan sederhana.",
    adminNote:
      "Customer meminta storage tambahan di sisi kanan meja kerja.",
    vendorNote:
      "Vendor perlu mengirim revisi layout sebelum brief disetujui.",
    timeline: [
      {
        id: "tl-1",
        label: "Revisi desain",
        date: "2 Juli 2026",
      },
      {
        id: "tl-2",
        label: "Final brief",
        date: "4 Juli 2026",
      },
      {
        id: "tl-3",
        label: "Produksi",
        date: "6 - 15 Juli 2026",
      },
    ],
    materials: ["Multiplek", "HPL putih doff", "Aksen kayu", "Ambalan"],
    checklist: [
      {
        id: "check-1",
        label: "Kebutuhan customer sudah dirangkum",
        completed: true,
      },
      {
        id: "check-2",
        label: "Ukuran ruang sudah dicatat",
        completed: true,
      },
      {
        id: "check-3",
        label: "Material sudah disetujui",
        completed: false,
      },
      {
        id: "check-4",
        label: "Brief siap dikirim ke vendor",
        completed: false,
      },
    ],
  },
];

export function BriefDocumentsView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [briefs, setBriefs] = useState<BriefDocument[]>(initialBriefs);
  const [activeTab, setActiveTab] = useState<BriefTab>("Semua");
  const [selectedBriefId, setSelectedBriefId] = useState(
    initialBriefs[0]?.id ?? "",
  );

  const selectedBrief = useMemo(() => {
    return briefs.find((brief) => brief.id === selectedBriefId) ?? briefs[0];
  }, [briefs, selectedBriefId]);

  const filteredBriefs = useMemo(() => {
    return briefs.filter((brief) => {
      if (activeTab === "Semua") return true;
      return brief.status === activeTab;
    });
  }, [activeTab, briefs]);

  const draftCount = briefs.filter((brief) => brief.status === "Draft").length;
  const readyCount = briefs.filter(
    (brief) => brief.status === "Siap Vendor",
  ).length;
  const revisionCount = briefs.filter(
    (brief) => brief.status === "Revisi",
  ).length;

  const updateSelectedBrief = (
    field: keyof BriefDocument,
    value: string | BriefStatus,
  ) => {
    if (!selectedBrief) return;

    setBriefs((current) =>
      current.map((brief) =>
        brief.id === selectedBrief.id
          ? {
              ...brief,
              [field]: value,
              updatedAt: "Baru saja",
            }
          : brief,
      ),
    );
  };

  const updateChecklist = (checkId: string) => {
    if (!selectedBrief) return;

    setBriefs((current) =>
      current.map((brief) =>
        brief.id === selectedBrief.id
          ? {
              ...brief,
              updatedAt: "Baru saja",
              checklist: brief.checklist.map((item) =>
                item.id === checkId
                  ? {
                      ...item,
                      completed: !item.completed,
                    }
                  : item,
              ),
            }
          : brief,
      ),
    );
  };

  const updateStatus = (status: BriefStatus) => {
    updateSelectedBrief("status", status);
    setActiveTab(status);
  };

  if (!selectedBrief) {
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
            Brief & Dokumen
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola brief kerja, scope proyek, material, timeline, dan catatan
            admin sebelum dokumen dikirim ke vendor partner.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangePage?.("active-projects")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          Dari Proyek Aktif
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <BriefMiniStat
          icon={FolderOpen}
          label="Total Brief"
          value={`${briefs.length}`}
          description="Dokumen kerja tersimpan"
        />

        <BriefMiniStat
          icon={PenLine}
          label="Draft"
          value={`${draftCount}`}
          description="Masih disusun admin"
        />

        <BriefMiniStat
          icon={Send}
          label="Siap Vendor"
          value={`${readyCount}`}
          description="Siap dikirim ke vendor"
        />

        <BriefMiniStat
          icon={MessageSquare}
          label="Revisi"
          value={`${revisionCount}`}
          description="Perlu perbaikan brief"
        />
      </section>

      <AdminSectionCard title="Daftar Brief">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {briefTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-11 items-center justify-center rounded-xl px-2 text-[10px] font-semibold transition sm:text-[13px] ${
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
          {filteredBriefs.length > 0 ? (
            filteredBriefs.map((brief) => (
              <BriefCard
                key={brief.id}
                brief={brief}
                selected={selectedBrief.id === brief.id}
                onClick={() => setSelectedBriefId(brief.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada brief pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Brief proyek akan muncul sesuai status dokumennya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Brief"
          action={<BriefStatusBadge status={selectedBrief.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Dokumen Kerja Vendor
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedBrief.projectTitle}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                Brief ini menjadi acuan admin dan vendor untuk memahami scope,
                material, timeline, serta catatan penting sebelum pengerjaan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile
                icon={UserRound}
                label="Customer"
                value={selectedBrief.customerName}
                description={selectedBrief.projectType}
              />

              <InfoTile
                icon={Users}
                label="Vendor"
                value={selectedBrief.vendorName}
                description="Vendor partner"
              />

              <InfoTile
                icon={Ruler}
                label="Ukuran"
                value={selectedBrief.roomSize}
                description={selectedBrief.location}
              />

              <InfoTile
                icon={Package}
                label="Material"
                value={`${selectedBrief.materials.length} item`}
                description="Material acuan"
              />

              <InfoTile
                icon={CalendarDays}
                label="Update"
                value={selectedBrief.updatedAt}
                description={selectedBrief.createdAt}
              />

              <InfoTile
                icon={Layers}
                label="Budget"
                value={selectedBrief.budget}
                description="Estimasi proyek"
              />
            </div>

            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Scope Pekerjaan
              </span>

              <textarea
                value={selectedBrief.scope}
                onChange={(event) =>
                  updateSelectedBrief("scope", event.target.value)
                }
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Material Disetujui
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedBrief.materials.map((material) => (
                    <span
                      key={material}
                      className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                    >
                      {material}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
                  {selectedBrief.materialNote}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Timeline Kerja
                </p>

                <div className="mt-3 space-y-2.5">
                  {selectedBrief.timeline.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-white p-3"
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FCFBF9] text-[11px] font-semibold text-[#725F54]">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#31332C]">
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#7B756E]">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedBrief.adminNote}
                  onChange={(event) =>
                    updateSelectedBrief("adminNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Untuk Vendor
                </span>

                <textarea
                  value={selectedBrief.vendorNote}
                  onChange={(event) =>
                    updateSelectedBrief("vendorNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Checklist Brief">
            <div className="space-y-2.5">
              {selectedBrief.checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateChecklist(item.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    item.completed
                      ? "border-[#DCEBDD] bg-[#F5FAF6]"
                      : "border-[#E8E2D9] bg-white hover:bg-[#FCFBF9]"
                  }`}
                >
                  <div
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                      item.completed
                        ? "border-[#4F7A5F] bg-[#4F7A5F] text-white"
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
          </AdminSectionCard>

          <AdminSectionCard title="Aksi Dokumen">
            <div className="space-y-3">
              <ActionButton
                icon={Send}
                title="Kirim ke Vendor"
                description="Tandai brief siap dibaca vendor."
                onClick={() => updateStatus("Siap Vendor")}
              />

              <ActionButton
                icon={PenLine}
                title="Minta Revisi"
                description="Tandai brief perlu diperbaiki."
                onClick={() => updateStatus("Revisi")}
              />

              <ActionButton
                icon={CheckCircle2}
                title="Setujui Brief"
                description="Brief sudah siap menjadi acuan kerja."
                onClick={() => updateStatus("Disetujui")}
              />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Navigasi Cepat">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => onChangePage?.("active-projects")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Proyek Aktif
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("progress-qc")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Ke Progress & QC
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

function BriefCard({
  brief,
  selected,
  onClick,
}: {
  brief: BriefDocument;
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
            {brief.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {brief.customerName} • {brief.location}
          </p>
        </div>

        <BriefStatusBadge status={brief.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {brief.scope}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#9A8F86]">
        <CalendarDays size={13} />

        <span className="truncate">Update: {brief.updatedAt}</span>
      </div>
    </button>
  );
}

function BriefMiniStat({
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

function BriefStatusBadge({ status }: { status: BriefStatus }) {
  const style =
    status === "Siap Vendor"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Revisi"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : status === "Disetujui"
          ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
          : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}