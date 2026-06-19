"use client";

import NextImage from "next/image";
import {
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  Eye,
  ImageIcon,
  Link2,
  Megaphone,
  Power,
  PowerOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AdminSectionCard } from "./shared";
import { PromoCreateView } from "./promo-create-view";

export type PromoStatus =
  | "Draft"
  | "Aktif"
  | "Dijadwalkan"
  | "Berakhir"
  | "Nonaktif";

export type PromoCampaign = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaTarget: string;
  startDate: string;
  endDate: string;
  status: PromoStatus;
  createdBy: string;
  createdAt: string;
};

type PromoTab = "Semua" | "Aktif" | "Menunggu" | "Selesai";

const promoTabs: PromoTab[] = ["Semua", "Aktif", "Menunggu", "Selesai"];

const initialPromos: PromoCampaign[] = [
  {
    id: "promo-1",
    title: "Interior Awal Bulan",
    description:
      "Ajukan proyek interior baru dan dapatkan potongan biaya konsultasi bersama tim VMatch.",
    imageUrl: "/inspirations/rumah-ruang-tamu.webp",
    ctaLabel: "Ajukan Proyek",
    ctaTarget: "/dashboard/user",
    startDate: "1 Juli 2026",
    endDate: "15 Juli 2026",
    status: "Aktif",
    createdBy: "Marketing Admin",
    createdAt: "28 Juni 2026",
  },
  {
    id: "promo-2",
    title: "Gratis Konsultasi Ruang Kerja",
    description:
      "Promo konsultasi untuk customer yang ingin membuat ruang kerja minimalis di rumah.",
    imageUrl: "/inspirations/apartment-living-area.webp",
    ctaLabel: "Daftar Konsultasi",
    ctaTarget: "/register",
    startDate: "16 Juli 2026",
    endDate: "31 Juli 2026",
    status: "Dijadwalkan",
    createdBy: "Marketing Admin",
    createdAt: "30 Juni 2026",
  },
  {
    id: "promo-3",
    title: "Campaign Kitchen Set",
    description:
      "Campaign khusus pengajuan proyek kitchen set dengan estimasi awal lebih cepat.",
    imageUrl: "/inspirations/rumah-ruang-tamu.webp",
    ctaLabel: "Lihat Layanan",
    ctaTarget: "/#services",
    startDate: "10 Juni 2026",
    endDate: "25 Juni 2026",
    status: "Nonaktif",
    createdBy: "Admin VMatch",
    createdAt: "8 Juni 2026",
  },
];

export function PromoCampaignView() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [activeTab, setActiveTab] = useState<PromoTab>("Semua");
  const [promos, setPromos] = useState<PromoCampaign[]>(initialPromos);
  const [selectedPromoId, setSelectedPromoId] = useState(
    initialPromos[0]?.id ?? "",
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedPromo = useMemo(() => {
    return promos.find((promo) => promo.id === selectedPromoId) ?? promos[0];
  }, [promos, selectedPromoId]);

  const activePromo = promos.find((promo) => promo.status === "Aktif");

  const filteredPromos = useMemo(() => {
    return promos.filter((promo) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Aktif") return promo.status === "Aktif";

      if (activeTab === "Menunggu") {
        return promo.status === "Draft" || promo.status === "Dijadwalkan";
      }

      return promo.status === "Nonaktif" || promo.status === "Berakhir";
    });
  }, [activeTab, promos]);

  const tabCounts = useMemo(() => {
    return {
      Semua: promos.length,
      Aktif: promos.filter((promo) => promo.status === "Aktif").length,
      Menunggu: promos.filter(
        (promo) => promo.status === "Draft" || promo.status === "Dijadwalkan",
      ).length,
      Selesai: promos.filter(
        (promo) => promo.status === "Nonaktif" || promo.status === "Berakhir",
      ).length,
    };
  }, [promos]);

  const handleSelectPromo = (promoId: string) => {
    setSelectedPromoId(promoId);
    setPreviewOpen(false);
  };

  const updateSelectedPromo = (
    field: keyof PromoCampaign,
    value: string | PromoStatus,
  ) => {
    if (!selectedPromo) return;

    setPromos((current) =>
      current.map((promo) =>
        promo.id === selectedPromo.id ? { ...promo, [field]: value } : promo,
      ),
    );
  };

  const handleCreatePromo = (newPromo: PromoCampaign) => {
    setPromos((current) => [newPromo, ...current]);
    setSelectedPromoId(newPromo.id);
    setActiveTab("Menunggu");
    setPreviewOpen(false);
    setViewMode("list");
  };

  const activatePromo = () => {
    if (!selectedPromo) return;

    setPromos((current) =>
      current.map((promo) => ({
        ...promo,
        status: promo.id === selectedPromo.id ? "Aktif" : "Nonaktif",
      })),
    );

    setActiveTab("Aktif");
  };

  const deactivatePromo = () => {
    if (!selectedPromo) return;

    setPromos((current) =>
      current.map((promo) =>
        promo.id === selectedPromo.id ? { ...promo, status: "Nonaktif" } : promo,
      ),
    );

    setActiveTab("Selesai");
  };

  if (viewMode === "create") {
    return (
      <PromoCreateView
        nextPromoNumber={promos.length + 1}
        onCancel={() => setViewMode("list")}
        onCreate={handleCreatePromo}
      />
    );
  }

  if (!selectedPromo) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Marketing & Campaign
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Promo & Campaign
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola promo landing page, atur periode, CTA, gambar campaign, dan
            status popup yang tampil untuk customer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewMode("create")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Megaphone size={16} />
          Tambah Promo
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <PromoMiniStat
          label="Total Promo"
          value={`${promos.length}`}
          description="Campaign tersimpan"
          icon={BadgePercent}
        />

        <PromoMiniStat
          label="Promo Aktif"
          value={activePromo ? "1" : "0"}
          description={activePromo?.title ?? "Belum ada promo aktif"}
          icon={CheckCircle2}
        />

        <PromoMiniStat
          label="Menunggu"
          value={`${tabCounts.Menunggu}`}
          description="Draft atau dijadwalkan"
          icon={CalendarDays}
        />

        <PromoMiniStat
          label="Landing Popup"
          value={activePromo ? "Aktif" : "Off"}
          description="Tampil di landing page"
          icon={Power}
        />
      </section>

      <AdminSectionCard title="Daftar Promo">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-4 gap-2">
            {promoTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[12px] font-semibold transition sm:text-[13px] ${
                    active
                      ? "bg-[#725F54] text-white shadow-sm"
                      : "text-[#6F6860] hover:bg-[#F8F6F2]"
                  }`}
                >
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredPromos.length > 0 ? (
            filteredPromos.map((promo) => (
              <PromoListCard
                key={promo.id}
                promo={promo}
                selected={selectedPromo.id === promo.id}
                onClick={() => handleSelectPromo(promo.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada promo pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Gunakan tombol Tambah Promo untuk membuat promo baru.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Promo"
          action={<PromoStatusBadge status={selectedPromo.status} />}
        >
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div>
              <div className="relative h-[260px] overflow-hidden rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9]">
                <NextImage
                  src={selectedPromo.imageUrl}
                  alt={selectedPromo.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="rounded-xl bg-white/90 px-3 py-2 text-[12px] font-semibold text-[#725F54] shadow-sm">
                    Preview Gambar Promo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen((value) => !value)}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                <Eye size={15} />
                {previewOpen ? "Tutup Preview" : "Preview Popup"}
              </button>
            </div>

            <div className="grid gap-4">
              <PromoField label="Judul Promo">
                <input
                  value={selectedPromo.title}
                  onChange={(event) =>
                    updateSelectedPromo("title", event.target.value)
                  }
                  className={inputClass}
                />
              </PromoField>

              <PromoField label="Deskripsi">
                <textarea
                  value={selectedPromo.description}
                  onChange={(event) =>
                    updateSelectedPromo("description", event.target.value)
                  }
                  rows={4}
                  className={`${inputClass} h-auto resize-none py-3 leading-6`}
                />
              </PromoField>

              <div className="grid gap-4 sm:grid-cols-2">
                <PromoField label="Tanggal Mulai">
                  <input
                    value={selectedPromo.startDate}
                    onChange={(event) =>
                      updateSelectedPromo("startDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </PromoField>

                <PromoField label="Tanggal Selesai">
                  <input
                    value={selectedPromo.endDate}
                    onChange={(event) =>
                      updateSelectedPromo("endDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </PromoField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PromoField label="CTA Label">
                  <input
                    value={selectedPromo.ctaLabel}
                    onChange={(event) =>
                      updateSelectedPromo("ctaLabel", event.target.value)
                    }
                    className={inputClass}
                  />
                </PromoField>

                <PromoField label="CTA Target">
                  <input
                    value={selectedPromo.ctaTarget}
                    onChange={(event) =>
                      updateSelectedPromo("ctaTarget", event.target.value)
                    }
                    className={inputClass}
                  />
                </PromoField>
              </div>

              <PromoField label="URL Gambar Promo">
                <div className="relative">
                  <ImageIcon
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#725F54]"
                  />

                  <input
                    value={selectedPromo.imageUrl}
                    onChange={(event) =>
                      updateSelectedPromo("imageUrl", event.target.value)
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </PromoField>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Kontrol Publish">
            <div>
              <p className="text-[13px] font-semibold text-[#31332C]">
                Status sekarang:{" "}
                <span className="text-[#725F54]">{selectedPromo.status}</span>
              </p>

              <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                Jika promo ini diaktifkan, promo lain otomatis dibuat nonaktif
                pada mock data.
              </p>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={activatePromo}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                  <Power className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                  <span>Aktifkan</span>
                </button>

                <button
                  type="button"
                  onClick={deactivatePromo}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                  <PowerOff
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={2}
                  />
                  <span>Nonaktifkan</span>
                </button>
              </div>
            </div>
          </AdminSectionCard>

          {previewOpen && <PromoPopupPreview promo={selectedPromo} />}
        </div>
      </section>
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-[#E4D8CD] bg-white px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10";

export function PromoField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </span>

      {children}
    </label>
  );
}

function PromoListCard({
  promo,
  selected,
  onClick,
}: {
  promo: PromoCampaign;
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
        <p className="min-w-0 truncate text-[14px] font-semibold text-[#31332C]">
          {promo.title}
        </p>

        <PromoStatusBadge status={promo.status} />
      </div>

      <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {promo.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#9A8F86]">
        <CalendarDays size={13} />
        <span className="truncate">
          {promo.startDate} - {promo.endDate}
        </span>
      </div>
    </button>
  );
}

function PromoStatusBadge({ status }: { status: PromoStatus }) {
  const style =
    status === "Aktif"
      ? "border-[#D8C7B6] bg-[#FCFBF9] text-[#725F54]"
      : status === "Dijadwalkan"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : status === "Draft"
          ? "border-[#E8E2D9] bg-white text-[#7B756E]"
          : status === "Berakhir"
            ? "border-[#E8E2D9] bg-[#F8F6F2] text-[#7B756E]"
            : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function PromoMiniStat({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
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

function PromoPopupPreview({ promo }: { promo: PromoCampaign }) {
  return (
    <AdminSectionCard
      title="Preview Popup"
      description="Tampilan simulasi popup promo sebelum ditampilkan ke landing page."
    >
      <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[20px] border border-[#E4D8CD] bg-[#31332C] shadow-[0_24px_60px_rgba(49,51,44,0.16)]">
        <div className="relative h-[420px]">
          <NextImage
            src={promo.imageUrl}
            alt={promo.title}
            fill
            sizes="440px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/10" />

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
            <BadgePercent size={13} />
            Promo VMatch
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-fit rounded-[16px] bg-white/94 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                Campaign
              </p>

              <p className="mt-1 font-serif text-[28px] leading-none text-[#31332C]">
                Diskon 30%
              </p>
            </div>

            <h3 className="mt-4 font-serif text-[32px] leading-tight text-white">
              {promo.title}
            </h3>

            <p className="mt-2 text-[12px] leading-6 text-white/82">
              {promo.description}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-[16px] border border-white/18 bg-white/12 px-4 py-3 text-[12px] text-white/86 backdrop-blur-md">
              <CalendarDays size={15} />

              <span>
                {promo.startDate} - {promo.endDate}
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                className="h-10 rounded-xl border border-white/35 bg-white/12 px-4 text-[12px] font-semibold text-white backdrop-blur-md"
              >
                Nanti saja
              </button>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[12px] font-semibold text-[#725F54]"
              >
                {promo.ctaLabel}
                <Link2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}