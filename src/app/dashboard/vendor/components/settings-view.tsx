"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  Save,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { vendorProfile } from "../mock-data";
import {
  VendorActionButton,
  VendorField,
  VendorSectionCard,
  VendorStatusBadge,
  vendorFieldClass,
  vendorTextareaClass,
} from "./shared";

export function SettingsView() {
  const [form, setForm] = useState({
    name: vendorProfile.name,
    email: vendorProfile.email,
    phone: vendorProfile.phone,
    serviceArea: vendorProfile.serviceArea,
    skill: vendorProfile.skill,
    bankName: vendorProfile.bankName,
    bankAccount: vendorProfile.bankAccount,
    notificationWhatsapp: true,
    notificationEmail: true,
    notificationProject: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Vendor Settings
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Pengaturan
          </h1>

          <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#7B756E]">
            Kelola profil vendor, area layanan, rekening payout, dan notifikasi
            proyek.
          </p>
        </div>

        <VendorActionButton
          icon={Save}
          label={saved ? "Tersimpan" : "Simpan"}
          primary
          onClick={handleSave}
        />
      </section>

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
          <CheckCircle2 size={18} className="shrink-0 text-[#725F54]" />

          <p className="text-[13px] font-medium text-[#6F6860]">
            Perubahan berhasil disimpan pada prototype.
          </p>
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <VendorSectionCard
            title="Profil Vendor"
            description="Data dasar untuk komunikasi dan pencocokan proyek."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <VendorField label="Nama Vendor">
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className={vendorFieldClass}
                  placeholder="Nama vendor"
                />
              </VendorField>

              <VendorField label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  className={vendorFieldClass}
                  placeholder="vendor@email.com"
                />
              </VendorField>

              <VendorField label="Nomor WhatsApp">
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  className={vendorFieldClass}
                  placeholder="0812xxxxxxx"
                />
              </VendorField>

              <VendorField label="Area Layanan">
                <input
                  type="text"
                  value={form.serviceArea}
                  onChange={(event) =>
                    handleChange("serviceArea", event.target.value)
                  }
                  className={vendorFieldClass}
                  placeholder="Contoh: Semarang, Kudus, Demak"
                />
              </VendorField>
            </div>

            <div className="mt-4">
              <VendorField label="Keahlian Utama">
                <textarea
                  value={form.skill}
                  onChange={(event) =>
                    handleChange("skill", event.target.value)
                  }
                  className={vendorTextareaClass}
                  rows={3}
                  placeholder="Contoh: kitchen set, wardrobe custom, finishing HPL"
                />
              </VendorField>
            </div>
          </VendorSectionCard>

          <VendorSectionCard
            title="Rekening Payout"
            description="Dipakai untuk proses pencairan pembayaran vendor."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <VendorField label="Nama Bank">
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(event) =>
                    handleChange("bankName", event.target.value)
                  }
                  className={vendorFieldClass}
                  placeholder="Contoh: BCA"
                />
              </VendorField>

              <VendorField label="Nomor Rekening">
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(event) =>
                    handleChange("bankAccount", event.target.value)
                  }
                  className={vendorFieldClass}
                  placeholder="Nomor rekening"
                />
              </VendorField>
            </div>
          </VendorSectionCard>

          <VendorSectionCard
            title="Notifikasi"
            description="Pilih update yang ingin diterima vendor."
          >
            <div className="grid gap-3">
              <NotificationToggle
                icon={Phone}
                title="WhatsApp"
                description="Update cepat terkait deadline dan progress."
                checked={form.notificationWhatsapp}
                onChange={(value) =>
                  handleChange("notificationWhatsapp", value)
                }
              />

              <NotificationToggle
                icon={Bell}
                title="Email"
                description="Ringkasan brief, dokumen, dan pembayaran."
                checked={form.notificationEmail}
                onChange={(value) => handleChange("notificationEmail", value)}
              />

              <NotificationToggle
                icon={Wrench}
                title="Update Proyek"
                description="Perubahan status proyek dan hasil QC."
                checked={form.notificationProject}
                onChange={(value) => handleChange("notificationProject", value)}
              />
            </div>
          </VendorSectionCard>
        </div>

        <div className="space-y-5">
          <VendorSectionCard title="Status Vendor">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                    Kemitraan
                  </p>

                  <p className="mt-1 text-[13px] text-[#7B756E]">
                    Status akun vendor saat ini.
                  </p>
                </div>

                <VendorStatusBadge status="Aktif" />
              </div>

              <div className="space-y-3">
                <CompletenessItem
                  icon={Building2}
                  title="Profil"
                  completed={Boolean(form.name && form.email && form.phone)}
                />

                <CompletenessItem
                  icon={MapPin}
                  title="Area Layanan"
                  completed={Boolean(form.serviceArea)}
                />

                <CompletenessItem
                  icon={Wrench}
                  title="Keahlian"
                  completed={Boolean(form.skill)}
                />

                <CompletenessItem
                  icon={CreditCard}
                  title="Rekening"
                  completed={Boolean(form.bankName && form.bankAccount)}
                />
              </div>
            </div>
          </VendorSectionCard>
        </div>
      </section>
    </div>
  );
}

function NotificationToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#E8E2D9] bg-white p-4 text-left transition hover:bg-[#FCFBF9]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={15} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#31332C]">
            {title}
          </p>

          <p className="mt-0.5 line-clamp-1 text-[11px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${
          checked ? "bg-[#725F54]" : "bg-[#D8CEC3]"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

function CompletenessItem({
  icon: Icon,
  title,
  completed,
}: {
  icon: LucideIcon;
  title: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-white p-3">
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          completed
            ? "bg-[#725F54] text-white"
            : "border border-[#E8E2D9] bg-[#FCFBF9] text-[#B5AAA0]"
        }`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-[#31332C]">{title}</p>

        <p className="text-[11px] text-[#7B756E]">
          {completed ? "Lengkap" : "Belum lengkap"}
        </p>
      </div>

      {completed && (
        <CheckCircle2 size={14} className="shrink-0 text-[#725F54]" />
      )}
    </div>
  );
}