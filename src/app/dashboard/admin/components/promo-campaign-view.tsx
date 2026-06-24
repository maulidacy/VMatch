"use client";

import NextImage from "next/image";
import {
  ArrowLeft,
  BadgePercent,
  CalendarDays,
  ChevronDown,
  Eye,
  ImageIcon,
  Link2,
  Megaphone,
  Power,
  PowerOff,
  Save,
  Search,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPromos } from "@/lib/api/promos";
import type { Promo as DBPromo } from "@/lib/supabase/types";

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

type PromoDraft = {
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaTarget: string;
  startDate: string;
  endDate: string;
};

const promoTabs: PromoTab[] = ["Semua", "Aktif", "Menunggu", "Selesai"];

const statusOptions: PromoStatus[] = [
  "Draft",
  "Aktif",
  "Dijadwalkan",
  "Berakhir",
  "Nonaktif",
];

const initialPromos: PromoCampaign[] = [];

function mapDbToLocalPromo(p: DBPromo): PromoCampaign {
  return {
    id: p.id,
    title: p.title,
    description: p.description || "",
    imageUrl: p.image_url || "",
    ctaLabel: p.cta_label || "",
    ctaTarget: p.cta_url || "",
    startDate: p.start_date || "-",
    endDate: p.end_date || "-",
    status: (p.status as PromoStatus) || "Draft",
    createdBy: p.created_by || "Admin",
    createdAt: new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
  };
}

function createDraft(promo: PromoCampaign): PromoDraft {
  return {
    title: promo.title,
    description: promo.description,
    imageUrl: promo.imageUrl,
    ctaLabel: promo.ctaLabel,
    ctaTarget: promo.ctaTarget,
    startDate: promo.startDate,
    endDate: promo.endDate,
  };
}

export function PromoCampaignView() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [activeTab, setActiveTab] = useState<PromoTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [promos, setPromos] = useState<PromoCampaign[]>(initialPromos);
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
  const [promoDraft, setPromoDraft] = useState<PromoDraft | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPromoSaved, setIsPromoSaved] = useState(false);

  const loadPromos = useCallback(async () => {
    try {
      const data = await getPromos();
      setPromos(data.map(mapDbToLocalPromo));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  const filteredPromos = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return promos.filter((promo) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Aktif" && promo.status === "Aktif") ||
        (activeTab === "Menunggu" &&
          (promo.status === "Draft" || promo.status === "Dijadwalkan")) ||
        (activeTab === "Selesai" &&
          (promo.status === "Nonaktif" || promo.status === "Berakhir"));

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        promo.title.toLowerCase().includes(normalizedKeyword) ||
        promo.description.toLowerCase().includes(normalizedKeyword) ||
        promo.ctaLabel.toLowerCase().includes(normalizedKeyword) ||
        promo.ctaTarget.toLowerCase().includes(normalizedKeyword) ||
        promo.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, promos]);

  const selectedPromo = useMemo(() => {
    if (!selectedPromoId) return null;

    return promos.find((promo) => promo.id === selectedPromoId) ?? null;
  }, [promos, selectedPromoId]);

  const activePromo = useMemo(
    () => promos.find((promo) => promo.status === "Aktif"),
    [promos],
  );

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

  const openDetail = (promo: PromoCampaign) => {
    setSelectedPromoId(promo.id);
    setPromoDraft(createDraft(promo));
    setPreviewOpen(false);
    setIsPromoSaved(false);
  };

  const closeDetail = () => {
    setSelectedPromoId(null);
    setPromoDraft(null);
    setPreviewOpen(false);
    setIsPromoSaved(false);
  };

  const handleCreatePromo = (newPromo: PromoCampaign) => {
    setPromos((current) => [newPromo, ...current]);
    setSelectedPromoId(newPromo.id);
    setPromoDraft(createDraft(newPromo));
    setActiveTab("Menunggu");
    setPreviewOpen(false);
    setIsPromoSaved(false);
    setViewMode("list");
  };

  const updateStatus = (id: string, status: PromoStatus) => {
    setPromos((current) =>
      current.map((promo) => {
        if (status === "Aktif") {
          return {
            ...promo,
            status: promo.id === id ? "Aktif" : "Nonaktif",
          };
        }

        return promo.id === id
          ? {
              ...promo,
              status,
            }
          : promo;
      }),
    );

    if (status === "Aktif") setActiveTab("Aktif");
    if (status === "Draft" || status === "Dijadwalkan") {
      setActiveTab("Menunggu");
    }
    if (status === "Nonaktif" || status === "Berakhir") {
      setActiveTab("Selesai");
    }
  };

  const savePromoChanges = () => {
    if (!selectedPromo || !promoDraft) return;

    setPromos((current) =>
      current.map((promo) =>
        promo.id === selectedPromo.id
          ? {
              ...promo,
              ...promoDraft,
            }
          : promo,
      ),
    );

    setIsPromoSaved(true);
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

  if (selectedPromo && promoDraft) {
    const previewPromo: PromoCampaign = {
      ...selectedPromo,
      ...promoDraft,
    };

    return (
      <PromoDetailPage
        promo={selectedPromo}
        promoDraft={promoDraft}
        previewPromo={previewPromo}
        previewOpen={previewOpen}
        isPromoSaved={isPromoSaved}
        onBack={closeDetail}
        onTogglePreview={() => setPreviewOpen((value) => !value)}
        onChangeDraft={(draft) => {
          setPromoDraft(draft);
          setIsPromoSaved(false);
        }}
        onSave={savePromoChanges}
        onStatusChange={(status) => updateStatus(selectedPromo.id, status)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[820px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
              Promo Campaign
            </p>

            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              Daftar Promo
            </h1>

            <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
              Kelola promo landing page, periode campaign, CTA, status popup,
              dan konten marketing yang ditampilkan kepada customer.
            </p>

            <p className="mt-2 text-[12px] leading-5 text-[#9A8F86]">
              {activePromo
                ? `Promo aktif saat ini: ${activePromo.title}`
                : "Belum ada promo aktif di landing page."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setViewMode("create")}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
          >
            <Megaphone size={15} />
            Tambah Promo
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari promo, deskripsi, CTA, target, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as PromoTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {promoTabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab} ({tabCounts[tab]})
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
              {promoTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[12px] font-semibold transition ${
                      active
                        ? "bg-[#725F54] text-white shadow-sm"
                        : "text-[#6F6860] hover:bg-white"
                    }`}
                  >
                    <span>{tab}</span>

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active
                          ? "bg-white/18 text-white"
                          : "bg-white text-[#9A8F86]"
                      }`}
                    >
                      {tabCounts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredPromos.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredPromos.map((promo) => (
              <PromoCard
                key={promo.id}
                promo={promo}
                onClick={() => openDetail(promo)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Promo tidak ditemukan.
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

function PromoDetailPage({
  promo,
  promoDraft,
  previewPromo,
  previewOpen,
  isPromoSaved,
  onBack,
  onTogglePreview,
  onChangeDraft,
  onSave,
  onStatusChange,
}: {
  promo: PromoCampaign;
  promoDraft: PromoDraft;
  previewPromo: PromoCampaign;
  previewOpen: boolean;
  isPromoSaved: boolean;
  onBack: () => void;
  onTogglePreview: () => void;
  onChangeDraft: (draft: PromoDraft) => void;
  onSave: () => void;
  onStatusChange: (status: PromoStatus) => void;
}) {
  const isPromoChanged =
    promoDraft.title !== promo.title ||
    promoDraft.description !== promo.description ||
    promoDraft.imageUrl !== promo.imageUrl ||
    promoDraft.ctaLabel !== promo.ctaLabel ||
    promoDraft.ctaTarget !== promo.ctaTarget ||
    promoDraft.startDate !== promo.startDate ||
    promoDraft.endDate !== promo.endDate;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar promo
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Marketing & Campaign
              </p>

              <PromoStatusBadge status={promo.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {promo.title}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              Promo dibuat oleh {promo.createdBy} pada {promo.createdAt}.
              Gunakan halaman ini untuk mengatur konten, periode, CTA, dan
              status popup landing page.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Promo
            </label>

            <div className="relative mt-3">
              <select
                value={promo.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as PromoStatus)
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              icon={CalendarDays}
              label="Mulai"
              value={promo.startDate}
              description="Tanggal mulai"
            />

            <InfoTile
              icon={CalendarDays}
              label="Selesai"
              value={promo.endDate}
              description="Tanggal akhir"
            />

            <InfoTile
              icon={Link2}
              label="CTA"
              value={promo.ctaLabel}
              description={promo.ctaTarget}
            />

            <InfoTile
              icon={BadgePercent}
              label="Status"
              value={promo.status}
              description="Popup landing"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 xl:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Gambar Promo
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
              Preview gambar yang akan tampil pada popup campaign.
            </p>

            <div className="relative mt-4 h-[260px] overflow-hidden rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9]">
              <NextImage
                src={previewPromo.imageUrl}
                alt={previewPromo.title}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
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
              onClick={onTogglePreview}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            >
              <Eye size={15} />
              {previewOpen ? "Tutup Preview" : "Preview Popup"}
            </button>
          </div>

          <div className="min-w-0 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Konten Promo
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  Atur judul, deskripsi, periode, CTA, dan gambar campaign.
                </p>
              </div>

              {isPromoSaved && (
                <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
                  Tersimpan
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-4">
              <PromoField label="Judul Promo">
                <input
                  value={promoDraft.title}
                  onChange={(event) =>
                    onChangeDraft({
                      ...promoDraft,
                      title: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </PromoField>

              <PromoField label="Deskripsi">
                <textarea
                  value={promoDraft.description}
                  onChange={(event) =>
                    onChangeDraft({
                      ...promoDraft,
                      description: event.target.value,
                    })
                  }
                  rows={4}
                  className={`${inputClass} h-auto resize-none py-3 leading-6`}
                />
              </PromoField>

              <div className="grid gap-4 sm:grid-cols-2">
                <PromoField label="Tanggal Mulai">
                  <input
                    value={promoDraft.startDate}
                    onChange={(event) =>
                      onChangeDraft({
                        ...promoDraft,
                        startDate: event.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </PromoField>

                <PromoField label="Tanggal Selesai">
                  <input
                    value={promoDraft.endDate}
                    onChange={(event) =>
                      onChangeDraft({
                        ...promoDraft,
                        endDate: event.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </PromoField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PromoField label="CTA Label">
                  <input
                    value={promoDraft.ctaLabel}
                    onChange={(event) =>
                      onChangeDraft({
                        ...promoDraft,
                        ctaLabel: event.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </PromoField>

                <PromoField label="CTA Target">
                  <input
                    value={promoDraft.ctaTarget}
                    onChange={(event) =>
                      onChangeDraft({
                        ...promoDraft,
                        ctaTarget: event.target.value,
                      })
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
                    value={promoDraft.imageUrl}
                    onChange={(event) =>
                      onChangeDraft({
                        ...promoDraft,
                        imageUrl: event.target.value,
                      })
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </PromoField>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!isPromoChanged}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                    isPromoChanged
                      ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                      : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                  }`}
                >
                  <Save size={14} />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>

        {previewOpen && (
          <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
            <PromoPopupPreview promo={previewPromo} />
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onStatusChange("Aktif")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            promo.status === "Aktif"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <Power className="h-[16px] w-[16px] shrink-0" strokeWidth={2} />
          Aktifkan
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Dijadwalkan")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            promo.status === "Dijadwalkan"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <Sparkles size={15} />
          Jadwalkan
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Nonaktif")}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${
            promo.status === "Nonaktif"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <PowerOff className="h-[16px] w-[16px] shrink-0" strokeWidth={2} />
          Nonaktifkan
        </button>
      </div>
    </div>
  );
}

function PromoCard({
  promo,
  onClick,
}: {
  promo: PromoCampaign;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
    >
      <div className="relative h-[150px] bg-[#FCFBF9]">
        <NextImage
          src={promo.imageUrl}
          alt={promo.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725F54]">
            {promo.ctaLabel}
          </span>

          <PromoStatusBadge status={promo.status} />
        </div>
      </div>

      <div className="p-4">
        <p className="truncate text-[14px] font-semibold text-[#31332C]">
          {promo.title}
        </p>

        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
          {promo.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#9A8F86]">
          <CalendarDays size={13} className="shrink-0" />

          <span className="truncate">
            {promo.startDate} - {promo.endDate}
          </span>
        </div>
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
  icon: typeof CalendarDays;
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

export const inputClass =
  "h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10";

export function PromoField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </span>

      {children}
    </label>
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
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}

function PromoPopupPreview({ promo }: { promo: PromoCampaign }) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
          Preview Popup
        </p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          Simulasi popup promo sebelum tampil di landing page.
        </p>
      </div>

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
    </div>
  );
}
