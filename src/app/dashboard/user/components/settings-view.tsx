"use client";

import { CheckCircle2, Lock, LogOut, Save } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/api/profiles";
import type { Profile } from "@/lib/supabase/types";

import { fieldClass, FormField, SectionCard } from "./shared";

export function SettingsView({ userId, profile }: { userId: string; profile: Profile }) {
    const router = useRouter();
    const [fullName, setFullName] = useState(profile.full_name || "");
    const [phone, setPhone] = useState(profile.phone || "");
    const [address, setAddress] = useState(profile.address || "");
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState("");

    // Password change
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile(userId, {
                full_name: fullName,
                phone,
                address,
            });
            setNotice("Profil berhasil disimpan.");
            setTimeout(() => setNotice(""), 3000);
        } catch {
            setNotice("Gagal menyimpan profil.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordError("");
        if (newPassword.length < 6) {
            setPasswordError("Password minimal 6 karakter.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Konfirmasi password tidak cocok.");
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setPasswordError("Gagal update password. Silakan coba lagi.");
        } else {
            setNewPassword("");
            setConfirmPassword("");
            setNotice("Password berhasil diperbarui.");
            setTimeout(() => setNotice(""), 3000);
        }
    };

    return (
        <div className="w-full space-y-6">
            {notice && (
                <div className="fixed right-5 top-20 z-50 flex max-w-[340px] items-start gap-3 rounded-2xl border border-[#D4C9BD] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#6B5B52]" />
                    <p className="flex-1 text-[13px] leading-6 text-[#3D3530]">{notice}</p>
                </div>
            )}

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
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nama lengkap"
                        />
                    </FormField>

                    <FormField label="Email">
                        <input
                            className={`${fieldClass} cursor-not-allowed bg-[#F0EBE4] text-[#8B8179]`}
                            value={profile.id ? "" : ""}
                            defaultValue={profile.full_name ? `${profile.full_name.toLowerCase().replace(/\s/g, "")}@email.com` : ""}
                            disabled
                        />
                    </FormField>

                    <FormField label="Nomor WhatsApp">
                        <input
                            className={fieldClass}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                        />
                    </FormField>

                    <FormField label="Kota / Alamat">
                        <input
                            className={fieldClass}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Contoh: Semarang, Jawa Tengah"
                        />
                    </FormField>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B5B52] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42] disabled:opacity-60"
                    >
                        <Save size={15} />
                        {isSaving ? "Menyimpan..." : "Simpan Profil"}
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
                {passwordError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                        {passwordError}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Password baru">
                        <input
                            type="password"
                            className={fieldClass}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Masukkan password baru"
                        />
                    </FormField>

                    <FormField label="Konfirmasi password baru">
                        <input
                            type="password"
                            className={fieldClass}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <p className="text-[13px] font-semibold text-[#3D3530]">Tips keamanan</p>
                            <p className="mt-1 text-[13px] leading-6 text-[#7A7067]">
                                Gunakan password yang berbeda dari akun lain dan jangan bagikan
                                akses akun kepada pihak luar.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={handleUpdatePassword}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D3530] px-5 text-[12px] font-semibold text-white transition hover:bg-[#2C2C2C]"
                    >
                        <Lock size={15} />
                        Update Password
                    </button>
                </div>
            </SectionCard>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#6B5B52] transition hover:bg-[#FCFBF9]"
                >
                    <LogOut size={15} />
                    Keluar dari Akun
                </button>
            </div>
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
                <p className="text-[13px] font-semibold text-[#3D3530]">{title}</p>
                <p className="mt-1 text-[12px] leading-5 text-[#7A7067]">{desc}</p>
            </div>

            <button
                type="button"
                onClick={() => setEnabled((v) => !v)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-[#6B5B52]" : "bg-[#D8D0C7]"}`}
                aria-label={enabled ? "Nonaktifkan" : "Aktifkan"}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"}`}
                />
            </button>
        </div>
    );
}
