"use client";

import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Inbox,
  Link2,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  StickyNote,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getAllNotifications } from "@/lib/api/notifications";
import type { Notification as DBNotification } from "@/lib/supabase/types";
import type { AdminPageId } from "../types";

type NotificationCategory =
  | "Proyek"
  | "Konsultasi"
  | "RAB"
  | "Pembayaran"
  | "Vendor"
  | "Customer"
  | "Promo"
  | "Sistem";

type NotificationPriority = "Normal" | "Penting" | "Urgent";
type NotificationStatus =
  | "Belum Dibaca"
  | "Sudah Dibaca"
  | "Ditindaklanjuti"
  | "Diarsipkan";
type NotificationTab =
  | "Semua"
  | "Belum Dibaca"
  | "Proyek"
  | "Konsultasi"
  | "RAB"
  | "Pembayaran"
  | "Promo"
  | "Sistem"
  | "Arsip";

type AdminNotification = {
  id: string;
  title: string;
  shortDescription: string;
  systemMessage: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  date: string;
  time: string;
  relatedPageLabel: string;
  relatedPageId: AdminPageId;
  primaryActionLabel: string;
  sourceInfo: string;
  reason: string;
  requiredAction: string;
  adminNote: string;
};

const notificationTabs: NotificationTab[] = [
  "Semua",
  "Belum Dibaca",
  "Proyek",
  "Konsultasi",
  "RAB",
  "Pembayaran",
  "Promo",
  "Sistem",
  "Arsip",
];

const statusOptions: NotificationStatus[] = [
  "Belum Dibaca",
  "Sudah Dibaca",
  "Ditindaklanjuti",
  "Diarsipkan",
];

function isNotificationMatchTab(item: AdminNotification, activeTab: NotificationTab) {
  if (activeTab === "Semua") return true;
  if (activeTab === "Belum Dibaca") return item.status === "Belum Dibaca";
  if (activeTab === "Arsip") return item.status === "Diarsipkan";
  return item.category === activeTab;
}

function mapDbToAdminNotification(n: DBNotification): AdminNotification {
  const categoryMap: Record<string, NotificationCategory> = {
    Proyek: "Proyek",
    Konsultasi: "Konsultasi",
    RAB: "RAB",
    Pembayaran: "Pembayaran",
    Promo: "Promo",
    Vendor: "Vendor",
    Customer: "Customer",
    Sistem: "Sistem",
  };
  const pageMap: Record<string, AdminPageId> = {
    Proyek: "active-projects",
    Konsultasi: "consultations",
    RAB: "rab-builder",
    Pembayaran: "payments",
    Promo: "promo",
    Vendor: "vendors",
    Customer: "customers",
    Sistem: "notifications",
  };
  const createdAt = new Date(n.created_at);

  return {
    id: n.id,
    title: n.title,
    shortDescription: n.description || "Notifikasi sistem.",
    systemMessage: n.description || "Tidak ada detail tambahan.",
    category: categoryMap[n.category] || "Sistem",
    priority: (n.priority as NotificationPriority) || "Normal",
    status: n.is_read ? "Sudah Dibaca" : "Belum Dibaca",
    date: createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: createdAt.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    relatedPageLabel: n.category || "Sistem",
    relatedPageId: pageMap[n.category] || "notifications",
    primaryActionLabel: "Buka Halaman Terkait",
    sourceInfo: `Sumber kategori ${n.category}`,
    reason: n.description || "Notifikasi dibuat oleh sistem VMatch.",
    requiredAction: n.admin_note || "Tinjau dan tindak lanjuti jika diperlukan.",
    adminNote: n.admin_note || "",
  };
}

export function AdminNotificationView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const rows = await getAllNotifications();
      setNotifications(rows.map(mapDbToAdminNotification));
    } catch (error) {
      toast.error("Gagal memuat notifikasi dari server.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchTab = isNotificationMatchTab(item, activeTab);
      const matchKeyword =
        normalizedKeyword.length === 0 ||
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.shortDescription.toLowerCase().includes(normalizedKeyword) ||
        item.category.toLowerCase().includes(normalizedKeyword) ||
        item.priority.toLowerCase().includes(normalizedKeyword) ||
        item.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, notifications]);

  const selectedNotification = useMemo(
    () =>
      selectedNotificationId
        ? notifications.find((item) => item.id === selectedNotificationId) ?? null
        : null,
    [notifications, selectedNotificationId],
  );

  const updateNotification = (
    id: string,
    updater: (item: AdminNotification) => AdminNotification,
  ) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? updater(item) : item)),
    );
  };

  const openDetail = (notification: AdminNotification) => {
    setSelectedNotificationId(notification.id);
    setAdminNoteDraft(notification.adminNote);
    setIsNoteSaved(false);

    if (notification.status === "Belum Dibaca") {
      updateNotification(notification.id, (item) => ({ ...item, status: "Sudah Dibaca" }));
    }
  };

  if (selectedNotification) {
    const liveNotification =
      notifications.find((item) => item.id === selectedNotification.id) ?? selectedNotification;

    return (
      <NotificationDetailView
        notification={liveNotification}
        adminNoteDraft={adminNoteDraft}
        isNoteSaved={isNoteSaved}
        onBack={() => {
          setSelectedNotificationId(null);
          setAdminNoteDraft("");
          setIsNoteSaved(false);
        }}
        onStatusChange={(status) => {
          updateNotification(liveNotification.id, (item) => ({ ...item, status }));
          setIsNoteSaved(false);
        }}
        onAdminNoteChange={(value) => {
          setAdminNoteDraft(value);
          setIsNoteSaved(false);
        }}
        onSaveAdminNote={() => {
          updateNotification(liveNotification.id, (item) => ({
            ...item,
            adminNote: adminNoteDraft,
            requiredAction: adminNoteDraft || item.requiredAction,
          }));
          setIsNoteSaved(true);
        }}
        onPrimaryAction={() => onChangePage?.(liveNotification.relatedPageId)}
        onMarkFollowedUp={() =>
          updateNotification(liveNotification.id, (item) => ({
            ...item,
            status: "Ditindaklanjuti",
          }))
        }
        onArchive={() =>
          updateNotification(liveNotification.id, (item) => ({
            ...item,
            status: "Diarsipkan",
          }))
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[860px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Notifikasi Admin
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Notification Center
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Pantau aktivitas penting dari request proyek, konsultasi, RAB, pembayaran,
            promo, dan sistem.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari judul, kategori, prioritas, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as NotificationTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {notificationTabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
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
              {notificationTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold transition ${
                      active ? "bg-[#725F54] text-white shadow-sm" : "text-[#6F6860] hover:bg-white"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <NotificationInfoTile
          icon={Bell}
          label="Total Notifikasi"
          value={String(notifications.length)}
          description="Semua kategori"
        />
        <NotificationInfoTile
          icon={Inbox}
          label="Belum Dibaca"
          value={String(notifications.filter((item) => item.status === "Belum Dibaca").length)}
          description="Perlu ditinjau"
        />
        <NotificationInfoTile
          icon={CheckCircle2}
          label="Ditindaklanjuti"
          value={String(
            notifications.filter((item) => item.status === "Ditindaklanjuti").length,
          )}
          description="Sudah diproses"
        />
        <NotificationInfoTile
          icon={Archive}
          label="Arsip"
          value={String(notifications.filter((item) => item.status === "Diarsipkan").length)}
          description="Tidak aktif"
        />
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 sm:p-5">
        {isLoading ? (
          <div className="py-16 text-center text-[13px] text-[#7B756E]">Memuat notifikasi...</div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyNotificationState />
        ) : (
          <div className="grid gap-3">
            {filteredNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openDetail(notification)}
                className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-3 text-[11px] font-semibold text-[#725F54]">
                        <NotificationCategoryIcon category={notification.category} />
                        {notification.category}
                      </span>
                      <NotificationPriorityBadge priority={notification.priority} />
                      <NotificationStatusBadge status={notification.status} />
                    </div>

                    <h2 className="mt-3 text-[16px] font-semibold text-[#31332C]">
                      {notification.title}
                    </h2>

                    <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                      {notification.shortDescription}
                    </p>
                  </div>

                  <div className="shrink-0 text-[12px] text-[#7B756E] lg:text-right">
                    <p>{notification.date}</p>
                    <p className="mt-1">{notification.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function NotificationView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  return <AdminNotificationView onChangePage={onChangePage} />;
}

function NotificationDetailView({
  notification,
  adminNoteDraft,
  isNoteSaved,
  onBack,
  onStatusChange,
  onAdminNoteChange,
  onSaveAdminNote,
  onPrimaryAction,
  onMarkFollowedUp,
  onArchive,
}: {
  notification: AdminNotification;
  adminNoteDraft: string;
  isNoteSaved: boolean;
  onBack: () => void;
  onStatusChange: (status: NotificationStatus) => void;
  onAdminNoteChange: (value: string) => void;
  onSaveAdminNote: () => void;
  onPrimaryAction: () => void;
  onMarkFollowedUp: () => void;
  onArchive: () => void;
}) {
  const isAdminNoteChanged = adminNoteDraft !== notification.adminNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar notifikasi
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-3 text-[11px] font-semibold text-[#725F54]">
                <NotificationCategoryIcon category={notification.category} />
                {notification.category}
              </span>

              <NotificationPriorityBadge priority={notification.priority} />
              <NotificationStatusBadge status={notification.status} />
            </div>

            <h1 className="mt-3 max-w-[820px] font-serif text-[32px] leading-tight text-[#31332C] sm:text-[42px]">
              {notification.title}
            </h1>

            <p className="mt-3 max-w-[860px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              {notification.shortDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Notifikasi
            </label>

            <div className="relative mt-3">
              <select
                value={notification.status}
                onChange={(event) => onStatusChange(event.target.value as NotificationStatus)}
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
            <NotificationInfoTile
              icon={CalendarDays}
              label="Tanggal & Waktu"
              value={notification.date}
              description={notification.time}
            />
            <NotificationInfoTile
              icon={Inbox}
              label="Kategori"
              value={notification.category}
              description="Jenis aktivitas"
            />
            <NotificationInfoTile
              icon={Link2}
              label="Halaman Terkait"
              value={notification.relatedPageLabel}
              description="Tujuan tindak lanjut"
            />
            <NotificationInfoTile
              icon={Bell}
              label="Prioritas"
              value={notification.priority}
              description="Tingkat perhatian"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailSection title="Pesan Sistem" description="Pesan asli dari sistem.">
            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <p className="text-[13px] leading-7 text-[#31332C]">{notification.systemMessage}</p>
            </div>
          </DetailSection>

          <DetailSection
            title="Detail Aktivitas"
            description="Sumber, alasan muncul, dan tindakan yang disarankan."
            withRightBorder={false}
          >
            <div className="space-y-3">
              <ActivityInfo title="Sumber informasi" description={notification.sourceInfo} />
              <ActivityInfo title="Alasan notifikasi muncul" description={notification.reason} />
              <ActivityInfo
                title="Tindakan yang perlu dilakukan"
                description={notification.requiredAction}
              />
            </div>
          </DetailSection>
        </div>

        <div className="border-t border-[#E8E2D9] p-5 sm:p-6">
          <AdminNoteBox
            value={adminNoteDraft}
            isSaved={isNoteSaved}
            isChanged={isAdminNoteChanged}
            onChange={onAdminNoteChange}
            onSave={onSaveAdminNote}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Link2 size={15} />
          {notification.primaryActionLabel}
        </button>

        <button
          type="button"
          onClick={onMarkFollowedUp}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          <CheckCircle2 size={15} />
          Tandai Selesai
        </button>

        <button
          type="button"
          onClick={onArchive}
          className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] sm:col-span-1"
        >
          <Archive size={15} />
          Arsipkan
        </button>
      </div>
    </div>
  );
}

function EmptyNotificationState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#FCFBF9] text-[#725F54]">
        <Bell size={20} />
      </div>
      <p className="mt-4 text-[14px] font-semibold text-[#31332C]">Tidak ada notifikasi.</p>
      <p className="mt-1 text-[13px] text-[#7B756E]">
        Coba ubah filter atau tunggu aktivitas baru dari sistem.
      </p>
    </div>
  );
}

function NotificationInfoTile({
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
        <Icon size={17} />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B756E]">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-semibold text-[#31332C]">{value}</p>
      <p className="mt-1 text-[12px] text-[#7B756E]">{description}</p>
    </div>
  );
}

function AdminNoteBox({
  value,
  isSaved,
  isChanged,
  onChange,
  onSave,
}: {
  value: string;
  isSaved: boolean;
  isChanged: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Catatan Admin
          </p>
          <p className="mt-1 text-[12px] text-[#7B756E]">
            Catatan ini tersimpan di state halaman admin.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[11px] font-semibold text-[#4F7A5F]">
            <CheckCircle2 size={13} />
            Tersimpan
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder="Tambahkan catatan tindak lanjut admin..."
        className="w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={!isChanged}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
            isChanged
              ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
              : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
          }`}
        >
          <StickyNote size={14} />
          Simpan Catatan
        </button>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
  withRightBorder = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  withRightBorder?: boolean;
}) {
  return (
    <div className={`p-5 sm:p-6 ${withRightBorder ? "xl:border-r xl:border-[#E8E2D9]" : ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {title}
      </p>
      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActivityInfo({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <p className="text-[12px] font-semibold text-[#31332C]">{title}</p>
      <p className="mt-1 text-[13px] leading-6 text-[#6F6860]">{description}</p>
    </div>
  );
}

function NotificationCategoryIcon({ category }: { category: NotificationCategory }) {
  const iconMap: Record<NotificationCategory, LucideIcon> = {
    Proyek: Bell,
    Konsultasi: MessageCircle,
    RAB: StickyNote,
    Pembayaran: Clock,
    Vendor: Users,
    Customer: Users,
    Promo: Megaphone,
    Sistem: Settings,
  };
  const Icon = iconMap[category];
  return <Icon size={13} />;
}

function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const classMap: Record<NotificationStatus, string> = {
    "Belum Dibaca": "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]",
    "Sudah Dibaca": "border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]",
    Ditindaklanjuti: "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]",
    Diarsipkan: "border-[#E8E2D9] bg-white text-[#7B756E]",
  };
  return <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${classMap[status]}`}>{status}</span>;
}

function NotificationPriorityBadge({ priority }: { priority: NotificationPriority }) {
  const config: Record<
    NotificationPriority,
    { icon: LucideIcon; className: string }
  > = {
    Normal: { icon: ShieldCheck, className: "border-[#E8E2D9] bg-white text-[#725F54]" },
    Penting: { icon: Clock, className: "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]" },
    Urgent: {
      icon: AlertTriangle,
      className: "border-[#F0C7C1] bg-[#FFF3F1] text-[#B0493A]",
    },
  };
  const { icon: Icon, className } = config[priority];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${className}`}>
      <Icon size={13} />
      {priority}
    </span>
  );
}
