"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Inbox,
  MessageCircle,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type NotificationStatus = "Belum Dibaca" | "Dibaca" | "Diarsipkan";

type NotificationTab =
  | "Semua"
  | "Belum Dibaca"
  | "Proyek"
  | "Pembayaran"
  | "Sistem";

type NotificationCategory =
  | "Proyek"
  | "Pembayaran"
  | "Konsultasi"
  | "Vendor"
  | "Customer"
  | "Sistem";

type AdminNotification = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  status: NotificationStatus;
  priority: "Normal" | "Penting" | "Urgent";
  time: string;
  date: string;
  relatedPage: AdminPageId;
};

const notificationTabs: NotificationTab[] = [
  "Semua",
  "Belum Dibaca",
  "Proyek",
  "Pembayaran",
  "Sistem",
];

const initialNotifications: AdminNotification[] = [
  {
    id: "notif-1",
    title: "Request proyek baru masuk",
    message:
      "Alya Putri mengajukan request proyek Kitchen Set Minimalis dan menunggu review admin.",
    category: "Proyek",
    status: "Belum Dibaca",
    priority: "Penting",
    time: "10.30 WIB",
    date: "Hari ini",
    relatedPage: "requests",
  },
  {
    id: "notif-2",
    title: "Konsultasi menunggu konfirmasi",
    message:
      "Jadwal konsultasi Bima Santoso untuk proyek Wardrobe Kamar Utama perlu dikonfirmasi.",
    category: "Konsultasi",
    status: "Belum Dibaca",
    priority: "Normal",
    time: "09.15 WIB",
    date: "Hari ini",
    relatedPage: "consultations",
  },
  {
    id: "notif-3",
    title: "Pembayaran melewati jatuh tempo",
    message:
      "Invoice proyek Ruang Kerja Rumah melewati tanggal jatuh tempo dan perlu follow up customer.",
    category: "Pembayaran",
    status: "Belum Dibaca",
    priority: "Urgent",
    time: "Kemarin",
    date: "12 Juli 2026",
    relatedPage: "payments",
  },
  {
    id: "notif-4",
    title: "Vendor perlu evaluasi",
    message:
      "Mitra Interior Jogja memiliki proyek dengan revisi layout yang belum selesai dan perlu evaluasi admin.",
    category: "Vendor",
    status: "Dibaca",
    priority: "Penting",
    time: "Kemarin",
    date: "12 Juli 2026",
    relatedPage: "vendors",
  },
  {
    id: "notif-5",
    title: "QC proyek perlu dicek",
    message:
      "Proyek Ruang Kerja Rumah masuk tahap QC finishing dan menunggu pengecekan admin.",
    category: "Proyek",
    status: "Dibaca",
    priority: "Penting",
    time: "2 hari lalu",
    date: "11 Juli 2026",
    relatedPage: "progress-qc",
  },
  {
    id: "notif-6",
    title: "Customer baru terdaftar",
    message:
      "Customer baru melihat katalog desain dan belum mengajukan proyek. Bisa dilakukan follow up ringan.",
    category: "Customer",
    status: "Dibaca",
    priority: "Normal",
    time: "3 hari lalu",
    date: "10 Juli 2026",
    relatedPage: "customers",
  },
  {
    id: "notif-7",
    title: "Backup data berhasil",
    message:
      "Sistem berhasil melakukan backup data dashboard admin VMatch secara otomatis.",
    category: "Sistem",
    status: "Diarsipkan",
    priority: "Normal",
    time: "4 hari lalu",
    date: "9 Juli 2026",
    relatedPage: "analytics",
  },
];

export function NotificationView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [notifications, setNotifications] =
    useState<AdminNotification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationTab>("Semua");
  const [selectedNotificationId, setSelectedNotificationId] = useState(
    initialNotifications[0]?.id ?? "",
  );

  const selectedNotification = useMemo(() => {
    return (
      notifications.find((item) => item.id === selectedNotificationId) ??
      notifications[0]
    );
  }, [notifications, selectedNotificationId]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Belum Dibaca") return item.status === "Belum Dibaca";
      if (activeTab === "Proyek") return item.category === "Proyek";
      if (activeTab === "Pembayaran") return item.category === "Pembayaran";
      return item.category === "Sistem";
    });
  }, [activeTab, notifications]);

  const unreadCount = notifications.filter(
    (item) => item.status === "Belum Dibaca",
  ).length;

  const readCount = notifications.filter(
    (item) => item.status === "Dibaca",
  ).length;

  const archivedCount = notifications.filter(
    (item) => item.status === "Diarsipkan",
  ).length;

  const urgentCount = notifications.filter(
    (item) => item.priority === "Urgent",
  ).length;

  const updateSelectedNotification = (
    field: keyof AdminNotification,
    value: string | NotificationStatus,
  ) => {
    if (!selectedNotification) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === selectedNotification.id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const updateStatus = (status: NotificationStatus) => {
    updateSelectedNotification("status", status);

    if (status === "Belum Dibaca") setActiveTab("Belum Dibaca");
    if (status === "Diarsipkan") setActiveTab("Semua");
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        status: item.status === "Diarsipkan" ? item.status : "Dibaca",
      })),
    );
  };

  const deleteSelectedNotification = () => {
    if (!selectedNotification) return;

    const remaining = notifications.filter(
      (item) => item.id !== selectedNotification.id,
    );

    setNotifications(remaining);
    setSelectedNotificationId(remaining[0]?.id ?? "");
  };

  if (!selectedNotification) {
    return (
      <div className="space-y-6">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Pusat Aktivitas
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Notifikasi
          </h1>
        </section>

        <AdminSectionCard title="Daftar Notifikasi">
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Belum ada notifikasi.
            </p>

            <p className="mt-2 text-[13px] text-[#7B756E]">
              Semua notifikasi admin akan muncul di halaman ini.
            </p>
          </div>
        </AdminSectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Pusat Aktivitas
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Notifikasi
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Pantau notifikasi penting dari request proyek, konsultasi,
            pembayaran, vendor, customer, dan sistem VMatch.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <CheckCircle2 size={16} />
          Tandai Semua Dibaca
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <NotificationMiniStat
          icon={Bell}
          label="Total"
          value={`${notifications.length}`}
          description="Semua notifikasi"
        />

        <NotificationMiniStat
          icon={Clock}
          label="Belum Dibaca"
          value={`${unreadCount}`}
          description="Perlu dicek admin"
        />

        <NotificationMiniStat
          icon={CheckCircle2}
          label="Dibaca"
          value={`${readCount}`}
          description="Sudah ditinjau"
        />

        <NotificationMiniStat
          icon={AlertTriangle}
          label="Urgent"
          value={`${urgentCount}`}
          description="Prioritas tinggi"
        />
      </section>

      <AdminSectionCard title="Daftar Notifikasi">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {notificationTabs.map((tab) => {
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                selected={selectedNotification.id === item.id}
                onClick={() => setSelectedNotificationId(item.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Tidak ada notifikasi pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Notifikasi akan muncul sesuai kategori dan statusnya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Notifikasi"
          action={<NotificationStatusBadge status={selectedNotification.status} />}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                  <CategoryIcon category={selectedNotification.category} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <NotificationPriorityBadge
                      priority={selectedNotification.priority}
                    />

                    <span className="rounded-full border border-[#E8E2D9] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                      {selectedNotification.category}
                    </span>
                  </div>

                  <h2 className="mt-3 font-serif text-[30px] leading-tight text-[#31332C]">
                    {selectedNotification.title}
                  </h2>

                  <p className="mt-3 text-[14px] leading-7 text-[#6F6860]">
                    {selectedNotification.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile
                icon={CalendarDays}
                label="Tanggal"
                value={selectedNotification.date}
                description={selectedNotification.time}
              />

              <InfoTile
                icon={Inbox}
                label="Status"
                value={selectedNotification.status}
                description="Status notifikasi"
              />

              <InfoTile
                icon={ArrowRight}
                label="Halaman"
                value={selectedNotification.relatedPage}
                description="Tujuan navigasi"
              />
            </div>

            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Pesan Notifikasi
              </span>

              <textarea
                value={selectedNotification.message}
                onChange={(event) =>
                  updateSelectedNotification("message", event.target.value)
                }
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Notifikasi">
            <div className="space-y-3">
              <ActionButton
                icon={CheckCircle2}
                title="Tandai Dibaca"
                description="Ubah status notifikasi menjadi dibaca."
                onClick={() => updateStatus("Dibaca")}
              />

              <ActionButton
                icon={Inbox}
                title="Arsipkan"
                description="Simpan notifikasi ke arsip."
                onClick={() => updateStatus("Diarsipkan")}
              />

              <ActionButton
                icon={Trash2}
                title="Hapus"
                description="Hapus notifikasi dari daftar admin."
                onClick={deleteSelectedNotification}
              />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Navigasi Cepat">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => onChangePage?.(selectedNotification.relatedPage)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Buka Halaman Terkait
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("analytics")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Analytics
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Ringkasan">
            <div className="space-y-3 text-[12px] leading-6 text-[#7B756E]">
              <p>
                <span className="font-semibold text-[#31332C]">
                  {unreadCount}
                </span>{" "}
                notifikasi belum dibaca.
              </p>

              <p>
                <span className="font-semibold text-[#31332C]">
                  {archivedCount}
                </span>{" "}
                notifikasi sudah diarsipkan.
              </p>

              <p>
                <span className="font-semibold text-[#31332C]">
                  {urgentCount}
                </span>{" "}
                notifikasi memiliki prioritas urgent.
              </p>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

function NotificationCard({
  item,
  selected,
  onClick,
}: {
  item: AdminNotification;
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
          : item.status === "Belum Dibaca"
            ? "border-[#E8D6BE] bg-[#FFF8ED] hover:bg-white"
            : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
          <CategoryIcon category={item.category} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-1 text-[14px] font-semibold text-[#31332C]">
              {item.title}
            </p>

            <NotificationPriorityBadge priority={item.priority} />
          </div>

          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
            {item.message}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9A8F86]">
              {item.date} • {item.time}
            </span>

            <NotificationStatusBadge status={item.status} />
          </div>
        </div>
      </div>
    </button>
  );
}

function NotificationMiniStat({
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

function CategoryIcon({ category }: { category: NotificationCategory }) {
  if (category === "Pembayaran") return <CreditCard size={17} />;
  if (category === "Konsultasi") return <MessageCircle size={17} />;
  if (category === "Vendor") return <ShieldCheck size={17} />;
  if (category === "Customer") return <UserRound size={17} />;
  if (category === "Sistem") return <Bell size={17} />;

  return <Inbox size={17} />;
}

function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const style =
    status === "Belum Dibaca"
      ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
      : status === "Dibaca"
        ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
        : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function NotificationPriorityBadge({
  priority,
}: {
  priority: "Normal" | "Penting" | "Urgent";
}) {
  const style =
    priority === "Urgent"
      ? "bg-[#FFF3EF] text-[#9A4A32]"
      : priority === "Penting"
        ? "bg-[#FFF8ED] text-[#8A5A24]"
        : "bg-white text-[#7B756E]";

  return (
    <span
      className={`shrink-0 rounded-full border border-[#E8E2D9] px-2.5 py-1 text-[10px] font-semibold ${style}`}
    >
      {priority}
    </span>
  );
}