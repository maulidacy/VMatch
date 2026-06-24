"use client";

import { ArrowLeft, ImageIcon, Save } from "lucide-react";
import { useState } from "react";
import { createPromo } from "@/lib/api/promos";

import { AdminSectionCard } from "./shared";
import {
  inputClass,
  PromoField,
  type PromoCampaign,
} from "./promo-campaign-view";

type NewPromoForm = {
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaTarget: string;
  startDate: string;
  endDate: string;
};

const emptyForm: NewPromoForm = {
  title: "",
  description: "",
  imageUrl: "/inspirations/rumah-ruang-tamu.webp",
  ctaLabel: "Ajukan Proyek",
  ctaTarget: "/dashboard/user",
  startDate: "",
  endDate: "",
};

export function PromoCreateView({
  nextPromoNumber,
  onCancel,
  onCreate,
}: {
  nextPromoNumber: number;
  onCancel: () => void;
  onCreate: (promo: PromoCampaign) => void;
}) {
  const [form, setForm] = useState<NewPromoForm>(emptyForm);

  const updateForm = (field: keyof NewPromoForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const draftPromo: PromoCampaign = {
      id: `promo-${nextPromoNumber}`,
      title: form.title.trim() || "Promo Baru",
      description:
        form.description.trim() ||
        "Tulis deskripsi promo yang akan ditampilkan pada popup landing page.",
      imageUrl: form.imageUrl.trim() || "/inspirations/rumah-ruang-tamu.webp",
      ctaLabel: form.ctaLabel.trim() || "Ajukan Proyek",
      ctaTarget: form.ctaTarget.trim() || "/dashboard/user",
      startDate: form.startDate.trim() || "Tanggal mulai",
      endDate: form.endDate.trim() || "Tanggal selesai",
      status: "Draft",
      createdBy: "Marketing Admin",
      createdAt: "Hari ini",
    };

    try {
      const savedPromo = await createPromo({
        title: draftPromo.title,
        description: draftPromo.description,
        image_url: draftPromo.imageUrl,
        cta_label: draftPromo.ctaLabel,
        cta_url: draftPromo.ctaTarget,
        start_date: draftPromo.startDate || null,
        end_date: draftPromo.endDate || null,
        status: "Draft",
      });

      onCreate({
        ...draftPromo,
        id: savedPromo.id,
        createdAt: new Date(savedPromo.created_at).toLocaleDateString("id-ID"),
      });
    } catch {
      // silent
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Promo & Campaign
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Tambah Promo Baru
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Isi informasi promo terlebih dahulu. Promo baru akan tersimpan
            sebagai Draft dan belum tampil di landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </section>

      <AdminSectionCard
        title="Informasi Promo"
        description="Gunakan judul dan deskripsi yang singkat agar mudah dipahami customer."
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4">
            <PromoField label="Judul Promo">
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Contoh: Promo Interior Awal Bulan"
                className={inputClass}
              />
            </PromoField>

            <PromoField label="Deskripsi Promo">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Tulis deskripsi promo yang singkat dan jelas."
                rows={4}
                className={`${inputClass} h-auto resize-none py-3 leading-6`}
              />
            </PromoField>

            <div className="grid gap-4 sm:grid-cols-2">
              <PromoField label="Tanggal Mulai">
                <input
                  value={form.startDate}
                  onChange={(event) =>
                    updateForm("startDate", event.target.value)
                  }
                  placeholder="1 Juli 2026"
                  className={inputClass}
                />
              </PromoField>

              <PromoField label="Tanggal Selesai">
                <input
                  value={form.endDate}
                  onChange={(event) => updateForm("endDate", event.target.value)}
                  placeholder="15 Juli 2026"
                  className={inputClass}
                />
              </PromoField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PromoField label="CTA Label">
                <input
                  value={form.ctaLabel}
                  onChange={(event) => updateForm("ctaLabel", event.target.value)}
                  placeholder="Ajukan Proyek"
                  className={inputClass}
                />
              </PromoField>

              <PromoField label="CTA Target">
                <input
                  value={form.ctaTarget}
                  onChange={(event) =>
                    updateForm("ctaTarget", event.target.value)
                  }
                  placeholder="/dashboard/user"
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
                  value={form.imageUrl}
                  onChange={(event) => updateForm("imageUrl", event.target.value)}
                  placeholder="/inspirations/rumah-ruang-tamu.webp"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </PromoField>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <p className="text-[13px] font-semibold text-[#31332C]">
              Alur publish promo
            </p>

            <p className="mt-2 text-[12px] leading-6 text-[#7B756E]">
              Promo yang baru dibuat akan masuk ke tab Menunggu sebagai Draft.
              Setelah dicek, admin bisa memilih promo tersebut lalu klik
              Aktifkan.
            </p>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                <Save size={15} />
                Simpan sebagai Draft
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}
