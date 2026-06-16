"use client";

import { Lock, Mail, MapPin, Save } from "lucide-react";
import type { ElementType } from "react";
import { useState } from "react";

import { fieldClass, FormField, SectionCard } from "./shared";

type IconComponent = ElementType<{
    size?: number;
    className?: string;
}>;

export function SettingsView() {
    return (
        <div className="w-full space-y-6">
            <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B8179]">
                    Account Settings
                </p>

                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#3D3530] sm:text-[42px]">
                    Pengaturan
                </h1>

                <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7A7067]">
                    Kelola informasi profil, kontak, alamat, preferensi notifikasi, dan
                    keamanan akun customer VMatch.
                </p>
            </section>

            <SectionCard
                title="Profil Customer"
                description="Informasi dasar yang digunakan oleh tim VMatch untuk menghubungi dan mengelola request proyek kamu."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nama lengkap">
                        <input
                            className={fieldClass}
                            defaultValue="Customer VMatch"
                            placeholder="Nama lengkap"
                        />
                    </FormField>

                    <FormField label="Email">
                        <input
                            className={`${fieldClass} cursor-not-allowed bg-[#F0EBE4] text-[#8B8179]`}
                            defaultValue="customer@email.com"
                            disabled
                        />
                    </FormField>

                    <FormField label="Nomor WhatsApp">
                        <input
                            className={fieldClass}
                            defaultValue="081234567890"
                            placeholder="Contoh: 081234567890"
                        />
                    </FormField>

                    <FormField label="Kota domisili">
                        <input
                            className={fieldClass}
                            defaultValue="Bandung, Jawa Barat"
                            placeholder="Contoh: Semarang, Jawa Tengah"
                        />
                    </FormField>
                </div>

                <div className="mt-4">
                    <FormField label="Alamat utama proyek">
                        <input
                            className={fieldClass}
                            defaultValue="Bandung, Jawa Barat"
                            placeholder="Alamat lengkap lokasi proyek"
                        />
                    </FormField>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                        <Save size={15} />
                        Simpan Profil
                    </button>
                </div>
            </SectionCard>

            <SectionCard
                title="Preferensi Kontak"
                description="Pilih jalur komunikasi utama untuk update proyek, konsultasi, invoice, dan informasi penting lainnya."
            >
                <div className="grid gap-3 md:grid-cols-3">
                    <ContactPreferenceCard
                        icon={WhatsAppIcon}
                        title="WhatsApp"
                        desc="Update cepat dan reminder konsultasi."
                        active
                    />

                    <ContactPreferenceCard
                        icon={Mail}
                        title="Email"
                        desc="Invoice, dokumen, dan ringkasan proyek."
                        active
                    />

                    <ContactPreferenceCard
                        icon={MapPin}
                        title="Alamat Proyek"
                        desc="Dipakai untuk kebutuhan survey dan instalasi."
                    />
                </div>
            </SectionCard>

            <SectionCard
                title="Notifikasi"
                description="Atur jenis notifikasi yang ingin kamu terima selama proses proyek berjalan."
            >
                <div className="space-y-3">
                    <ToggleRow
                        title="Update progress proyek"
                        desc="Kirim notifikasi ketika ada update produksi, instalasi, atau finishing."
                        defaultOn
                    />

                    <ToggleRow
                        title="Reminder konsultasi"
                        desc="Ingatkan jadwal konsultasi H-1 dan beberapa jam sebelum meeting."
                        defaultOn
                    />

                    <ToggleRow
                        title="Invoice dan pembayaran"
                        desc="Kirim notifikasi saat invoice baru tersedia atau pembayaran berhasil."
                        defaultOn
                    />

                    <ToggleRow
                        title="Revisi dan tambahan pekerjaan"
                        desc="Kirim notifikasi jika ada perubahan scope, biaya, atau timeline."
                    />
                </div>
            </SectionCard>

            <SectionCard
                title="Keamanan Akun"
                description="Kelola password dan keamanan dasar akun customer."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Password lama">
                        <input
                            type="password"
                            className={fieldClass}
                            placeholder="Masukkan password lama"
                        />
                    </FormField>

                    <FormField label="Password baru">
                        <input
                            type="password"
                            className={fieldClass}
                            placeholder="Masukkan password baru"
                        />
                    </FormField>

                    <FormField label="Konfirmasi password baru">
                        <input
                            type="password"
                            className={fieldClass}
                            placeholder="Ulangi password baru"
                        />
                    </FormField>
                </div>

                <div className="mt-5 rounded-2xl bg-[#F8F6F2] p-4">
                    <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#6B5B52]">
                            <Lock size={16} />
                        </div>

                        <div>
                            <p className="text-[13px] font-semibold text-[#3D3530]">
                                Tips keamanan
                            </p>

                            <p className="mt-1 text-[13px] leading-6 text-[#7A7067]">
                                Gunakan password yang berbeda dari akun lain dan jangan bagikan
                                akses akun kepada pihak luar. Tim VMatch tidak pernah meminta
                                password customer.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D3530] px-5 text-[12px] font-semibold text-white transition hover:bg-[#2C2C2C]"
                    >
                        <Lock size={15} />
                        Update Password
                    </button>
                </div>
            </SectionCard>
        </div>
    );
}

function ContactPreferenceCard({
    icon: Icon,
    title,
    desc,
    active,
}: {
    icon: IconComponent;
    title: string;
    desc: string;
    active?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border p-4 transition ${active
                    ? "border-[#6B5B52] bg-[#6B5B52] text-white"
                    : "border-[#E8E2D9] bg-[#F8F6F2] text-[#3D3530]"
                }`}
        >
            <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-white/15 text-white" : "bg-white text-[#6B5B52]"
                    }`}
            >
                <Icon size={20} />
            </div>

            <p className="mt-4 text-[14px] font-semibold">{title}</p>

            <p
                className={`mt-2 text-[13px] leading-6 ${active ? "text-white/75" : "text-[#7A7067]"
                    }`}
            >
                {desc}
            </p>

            <p
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${active ? "bg-white/15 text-white" : "bg-white text-[#8B8179]"
                    }`}
            >
                {active ? "Aktif" : "Opsional"}
            </p>
        </div>
    );
}

function WhatsAppIcon({
    size = 20,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 32 32"
            width={size}
            height={size}
            className={className}
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M16.02 3.2C9.05 3.2 3.38 8.79 3.38 15.67c0 2.2.59 4.35 1.71 6.24L3.2 28.8l7.08-1.84a12.8 12.8 0 0 0 5.74 1.36c6.97 0 12.64-5.59 12.64-12.47S22.99 3.2 16.02 3.2Zm0 22.96c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-4.2 1.09 1.12-4.06-.25-.39a10.26 10.26 0 0 1-1.61-5.49c0-5.69 4.71-10.31 10.49-10.31s10.49 4.62 10.49 10.31-4.71 10.49-10.49 10.49Zm5.74-7.72c-.31-.16-1.86-.91-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.24-.68.08-.31-.16-1.32-.48-2.52-1.53-.93-.82-1.56-1.84-1.74-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.31-.26-.61-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.21 2.23 3.36 5.41 4.71.76.32 1.35.51 1.81.65.76.24 1.45.21 2 .13.61-.09 1.86-.75 2.12-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.37Z" />
        </svg>
    );
}

function ToggleRow({
    title,
    desc,
    defaultOn,
}: {
    title: string;
    desc: string;
    defaultOn?: boolean;
}) {
    const [enabled, setEnabled] = useState(Boolean(defaultOn));

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8F6F2] p-4">
            <div>
                <p className="text-[13px] font-semibold text-[#3D3530]">
                    {title}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">
                    {desc}
                </p>
            </div>

            <button
                type="button"
                onClick={() => setEnabled((value) => !value)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-[#6B5B52]" : "bg-[#D8D0C7]"
                    }`}
                aria-label={enabled ? "Nonaktifkan notifikasi" : "Aktifkan notifikasi"}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    );
}