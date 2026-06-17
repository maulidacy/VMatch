"use client";

import { Lock, Save } from "lucide-react";
import { useState } from "react";

import { fieldClass, FormField, SectionCard } from "./shared";

export function SettingsView() {
    return (
        <div className="w-full space-y-6">
            <section className="pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B8179]">
                    Account Settings
                </p>

                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#3D3530] sm:text-[42px]">
                    Pengaturan
                </h1>

                <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7A7067]">
                    Kelola informasi profil, alamat proyek, preferensi notifikasi, dan keamanan
                    akun customer VMatch.
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