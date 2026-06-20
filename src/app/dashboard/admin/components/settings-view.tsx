"use client";

import {
  Bell,
  ChevronDown,
  Clock,
  Database,
  KeyRound,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { AdminSectionCard } from "./shared";

type SettingTab = "Profil" | "Keamanan" | "Notifikasi" | "Sistem";

type SettingTabItem = {
  id: SettingTab;
  title: string;
  description: string;
  icon: LucideIcon;
};

const settingTabs: SettingTabItem[] = [
  {
    id: "Profil",
    title: "Profil",
    description: "Data admin dan identitas akun.",
    icon: UserRound,
  },
  {
    id: "Keamanan",
    title: "Keamanan",
    description: "Password dan akses akun admin.",
    icon: ShieldCheck,
  },
  {
    id: "Notifikasi",
    title: "Notifikasi",
    description: "Preferensi notifikasi dashboard.",
    icon: Bell,
  },
  {
    id: "Sistem",
    title: "Sistem",
    description: "Backup, registrasi, dan maintenance.",
    icon: Database,
  },
];

const inputClass =
  "h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingTab>("Profil");

  const [adminName, setAdminName] = useState("Admin VMatch");
  const [adminEmail, setAdminEmail] = useState("admin@vmatch.id");
  const [adminRole, setAdminRole] = useState("Super Admin");
  const [adminPhone, setAdminPhone] = useState("0812-0000-0000");
  const [profileNote, setProfileNote] = useState(
    "Akun ini digunakan untuk mengelola operasional utama VMatch, mulai dari request proyek, vendor partner, konsultasi, hingga pembayaran.",
  );

  const [projectNotification, setProjectNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);
  const [vendorNotification, setVendorNotification] = useState(true);
  const [systemNotification, setSystemNotification] = useState(false);

  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(true);

  const activeTabData =
    settingTabs.find((item) => item.id === activeTab) ?? settingTabs[0];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Pengaturan
          </h1>

          <p className="mt-2 max-w-[760px] text-[12px] leading-6 text-[#7B756E] sm:text-[13px]">
            Atur profil admin, keamanan akun, preferensi notifikasi, dan
            konfigurasi sistem dashboard VMatch.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42] sm:w-fit"
        >
          <Save size={16} />
          Simpan Perubahan
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="relative xl:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as SettingTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {settingTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.title}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
            />
          </div>

          <AdminSectionCard title="Menu Pengaturan">
            <div className="grid gap-2">
              {settingTabs.map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#D9C8BA] bg-[#FFFDF9]"
                        : "border-[#E8E2D9] bg-[#FCFBF9] hover:border-[#725F54] hover:bg-[#F4EEE8]"
                    }`}
                  >
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                        active
                          ? "border-[#725F54] bg-[#725F54] text-white"
                          : "border-[#E8E2D9] bg-white text-[#725F54]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#31332C]">
                        {tab.title}
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </AdminSectionCard>
        </div>

        <div className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
                <activeTabData.icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Pengaturan Aktif
                </p>

                <h2 className="mt-1 font-serif text-[26px] leading-tight text-[#31332C]">
                  {activeTabData.title}
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  {activeTabData.description}
                </p>
              </div>
            </div>
          </section>

          {activeTab === "Profil" && (
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <AdminSectionCard title="Profil Admin">
                <div className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <SettingField label="Nama Admin">
                      <input
                        value={adminName}
                        onChange={(event) => setAdminName(event.target.value)}
                        className={inputClass}
                      />
                    </SettingField>

                    <SettingField label="Email">
                      <input
                        value={adminEmail}
                        onChange={(event) => setAdminEmail(event.target.value)}
                        className={inputClass}
                      />
                    </SettingField>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <SettingField label="Role">
                      <input
                        value={adminRole}
                        onChange={(event) => setAdminRole(event.target.value)}
                        className={inputClass}
                      />
                    </SettingField>

                    <SettingField label="Nomor Telepon">
                      <input
                        value={adminPhone}
                        onChange={(event) => setAdminPhone(event.target.value)}
                        className={inputClass}
                      />
                    </SettingField>
                  </div>

                  <SettingField label="Catatan Profil">
                    <textarea
                      rows={5}
                      value={profileNote}
                      onChange={(event) => setProfileNote(event.target.value)}
                      className={`${inputClass} h-auto resize-none py-3 leading-6`}
                    />
                  </SettingField>
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Ringkasan Akun">
                <div className="space-y-3">
                  <ProfileSummaryItem
                    icon={UserRound}
                    label="Nama"
                    value={adminName}
                  />

                  <ProfileSummaryItem icon={Mail} label="Email" value={adminEmail} />

                  <ProfileSummaryItem
                    icon={ShieldCheck}
                    label="Role"
                    value={adminRole}
                  />

                  <ProfileSummaryItem
                    icon={Clock}
                    label="Login Terakhir"
                    value="Hari ini, 10.30 WIB"
                  />
                </div>
              </AdminSectionCard>
            </section>
          )}

          {activeTab === "Keamanan" && (
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <AdminSectionCard title="Keamanan Akun">
                <div className="space-y-4">
                  <SettingField label="Password Lama">
                    <input
                      type="password"
                      placeholder="Masukkan password lama"
                      className={inputClass}
                    />
                  </SettingField>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <SettingField label="Password Baru">
                      <input
                        type="password"
                        placeholder="Masukkan password baru"
                        className={inputClass}
                      />
                    </SettingField>

                    <SettingField label="Konfirmasi Password">
                      <input
                        type="password"
                        placeholder="Ulangi password baru"
                        className={inputClass}
                      />
                    </SettingField>
                  </div>

                  <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                    <p className="text-[13px] font-semibold text-[#31332C]">
                      Tips keamanan
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                      Gunakan password yang kuat, hindari memakai password yang
                      sama dengan akun lain, dan aktifkan verifikasi tambahan
                      bila sudah tersedia.
                    </p>
                  </div>
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Akses Admin">
                <div className="space-y-3">
                  <SecurityItem
                    icon={Lock}
                    title="Login Admin"
                    description="Akses dashboard hanya untuk role admin."
                    status="Aktif"
                  />

                  <SecurityItem
                    icon={KeyRound}
                    title="Reset Password"
                    description="Reset password melalui email admin."
                    status="Tersedia"
                  />

                  <SecurityItem
                    icon={Users}
                    title="Role Management"
                    description="Pengaturan multi admin dapat ditambahkan nanti."
                    status="Roadmap"
                  />
                </div>
              </AdminSectionCard>
            </section>
          )}

          {activeTab === "Notifikasi" && (
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <AdminSectionCard title="Preferensi Notifikasi">
                <div className="space-y-3">
                  <SettingToggle
                    icon={Bell}
                    title="Request Proyek"
                    description="Notifikasi saat customer mengajukan proyek baru."
                    checked={projectNotification}
                    onChange={() => setProjectNotification((value) => !value)}
                  />

                  <SettingToggle
                    icon={Wallet}
                    title="Pembayaran"
                    description="Notifikasi invoice, pembayaran, dan jatuh tempo."
                    checked={paymentNotification}
                    onChange={() => setPaymentNotification((value) => !value)}
                  />

                  <SettingToggle
                    icon={Users}
                    title="Vendor Partner"
                    description="Notifikasi evaluasi vendor dan update proyek."
                    checked={vendorNotification}
                    onChange={() => setVendorNotification((value) => !value)}
                  />

                  <SettingToggle
                    icon={Database}
                    title="Sistem"
                    description="Notifikasi backup, maintenance, dan pembaruan sistem."
                    checked={systemNotification}
                    onChange={() => setSystemNotification((value) => !value)}
                  />
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Channel Notifikasi">
                <div className="space-y-3">
                  <ChannelItem
                    icon={Bell}
                    title="Dashboard"
                    description="Notifikasi tampil di menu Notifikasi admin."
                    active
                  />

                  <ChannelItem
                    icon={Mail}
                    title="Email"
                    description="Ringkasan penting dikirim ke email admin."
                    active
                  />

                  <ChannelItem
                    icon={Clock}
                    title="Daily Summary"
                    description="Ringkasan aktivitas harian admin."
                    active={false}
                  />
                </div>
              </AdminSectionCard>
            </section>
          )}

          {activeTab === "Sistem" && (
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <AdminSectionCard title="Konfigurasi Sistem">
                <div className="space-y-3">
                  <SettingToggle
                    icon={Database}
                    title="Auto Backup"
                    description="Backup data dashboard secara otomatis setiap hari."
                    checked={autoBackup}
                    onChange={() => setAutoBackup((value) => !value)}
                  />

                  <SettingToggle
                    icon={SlidersHorizontal}
                    title="Public Registration"
                    description="Izinkan customer baru mendaftar melalui halaman publik."
                    checked={publicRegistration}
                    onChange={() => setPublicRegistration((value) => !value)}
                  />

                  <SettingToggle
                    icon={Lock}
                    title="Maintenance Mode"
                    description="Nonaktifkan akses sementara untuk proses maintenance."
                    checked={maintenanceMode}
                    onChange={() => setMaintenanceMode((value) => !value)}
                  />
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Status Sistem">
                <div className="space-y-3">
                  <SystemStatusItem
                    label="Database"
                    value="Normal"
                    description="Koneksi database berjalan."
                  />

                  <SystemStatusItem
                    label="Storage"
                    value="Normal"
                    description="Penyimpanan file tersedia."
                  />

                  <SystemStatusItem
                    label="API"
                    value="Normal"
                    description="Endpoint utama aktif."
                  />

                  <SystemStatusItem
                    label="Backup"
                    value={autoBackup ? "Aktif" : "Nonaktif"}
                    description="Status backup otomatis."
                  />
                </div>
              </AdminSectionCard>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function SettingField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </span>

      <div className="mt-3">{children}</div>
    </label>
  );
}

function ProfileSummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
          {label}
        </p>

        <p className="mt-1 break-words text-[13px] font-semibold leading-5 text-[#31332C]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SecurityItem({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

            <span className="shrink-0 rounded-full border border-[#D9C8BA] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#725F54]">
              {status}
            </span>
          </div>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
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
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      </div>

      <span
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#725F54]" : "bg-[#D9C8BA]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function ChannelItem({
  icon: Icon,
  title,
  description,
  active,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
          active
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : "border-[#E8E2D9] bg-white text-[#9A8F86]"
        }`}
      >
        {active ? "Aktif" : "Nonaktif"}
      </span>
    </div>
  );
}

function SystemStatusItem({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#31332C]">{label}</p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            value === "Normal" || value === "Aktif"
              ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
              : "border-[#E8E2D9] bg-white text-[#9A8F86]"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
