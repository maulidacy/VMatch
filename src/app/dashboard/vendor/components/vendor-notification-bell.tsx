"use client";

import {
  Bell,
  Check,
  ClipboardList,
  FileText,
  FolderKanban,
  Gift,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { VendorPageId } from "../types";

type VendorNotificationType =
  | "project"
  | "brief"
  | "progress"
  | "payment"
  | "bonus"
  | "system";

type VendorNotificationItem = {
  id: string;
  title: string;
  message: string;
  type: VendorNotificationType;
  read: boolean;
  time: string;
  targetPage: VendorPageId;
};

const mockVendorNotifications: VendorNotificationItem[] = [
  {
    id: "vn-1",
    title: "Brief baru tersedia",
    message: "Brief Wardrobe Kamar Utama sudah bisa dibaca dan dikonfirmasi.",
    type: "brief",
    read: false,
    time: "10 menit lalu",
    targetPage: "brief",
  },
  {
    id: "vn-2",
    title: "Log progress belum dikirim",
    message: "Update pekerjaan hari ini belum dikirim untuk proyek aktif.",
    type: "progress",
    read: false,
    time: "1 jam lalu",
    targetPage: "progress-log",
  },
  {
    id: "vn-3",
    title: "Tahap pembayaran diperbarui",
    message: "Tahap Produksi sedang menunggu persetujuan dari VMatch.",
    type: "payment",
    read: false,
    time: "2 jam lalu",
    targetPage: "payment-bonus",
  },
  {
    id: "vn-4",
    title: "Progress masuk pengecekan",
    message: "Tim VMatch akan mengecek hasil pekerjaan terbaru.",
    type: "project",
    read: true,
    time: "Kemarin",
    targetPage: "projects",
  },
  {
    id: "vn-5",
    title: "Bonus masih berpotensi aktif",
    message: "Proyek masih memenuhi syarat bonus jika selesai sesuai timeline.",
    type: "bonus",
    read: true,
    time: "2 hari lalu",
    targetPage: "payment-bonus",
  },
];

const typeConfig: Record<
  VendorNotificationType,
  {
    label: string;
    icon: LucideIcon;
  }
> = {
  project: {
    label: "Proyek",
    icon: FolderKanban,
  },
  brief: {
    label: "Brief",
    icon: ClipboardList,
  },
  progress: {
    label: "Progress",
    icon: FileText,
  },
  payment: {
    label: "Pembayaran",
    icon: Wallet,
  },
  bonus: {
    label: "Bonus",
    icon: Gift,
  },
  system: {
    label: "Info",
    icon: Bell,
  },
};

export function VendorNotificationBell({
  onNavigate,
}: {
  onNavigate?: (page: VendorPageId) => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<VendorNotificationItem[]>(
    mockVendorNotifications,
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const visibleNotifications = useMemo(() => {
    if (!showUnreadOnly) return notifications;

    return notifications.filter((item) => !item.read);
  }, [notifications, showUnreadOnly]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;

      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  const handleNotificationClick = (item: VendorNotificationItem) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === item.id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );

    setOpen(false);
    onNavigate?.(item.targetPage);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-[#725F54] transition hover:bg-[#FCFBF9] hover:text-[#31332C]"
        aria-label="Buka notifikasi"
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 grid min-h-[17px] min-w-[17px] place-items-center rounded-full bg-[#725F54] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section className="fixed inset-x-3 top-[72px] z-50 max-h-[calc(100dvh-96px)] overflow-hidden rounded-2xl border border-[#E4D8CD] bg-white shadow-[0_24px_70px_rgba(49,51,44,0.18)] sm:absolute sm:inset-x-auto sm:right-2 sm:top-12 sm:w-[390px]">
          <div className="border-b border-[#E8E2D9] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-[26px] leading-tight text-[#31332C]">
                  Notifikasi
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  Update penting terkait proyek vendor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[#7B756E] transition hover:bg-[#FCFBF9] hover:text-[#31332C]"
                aria-label="Tutup notifikasi"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowUnreadOnly((value) => !value)}
                className={`h-8 rounded-full px-3 text-[11px] font-semibold transition ${
                  showUnreadOnly
                    ? "bg-[#725F54] text-white"
                    : "bg-[#FCFBF9] text-[#725F54] hover:bg-[#F4EEE8]"
                }`}
              >
                {showUnreadOnly
                  ? "Menampilkan belum dibaca"
                  : `${unreadCount} belum dibaca`}
              </button>

              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-[#E4D8CD] px-3 text-[11px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={13} />
                Tandai dibaca
              </button>
            </div>
          </div>

          <div className="max-h-[390px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((item) => (
                <NotificationListItem
                  key={item.id}
                  item={item}
                  onClick={() => handleNotificationClick(item)}
                />
              ))
            ) : (
              <NotificationEmptyState
                title="Tidak ada notifikasi."
                description="Semua update penting akan muncul di sini."
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function NotificationListItem({
  item,
  onClick,
}: {
  item: VendorNotificationItem;
  onClick: () => void;
}) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full gap-3 border-b border-[#E8E2D9] p-4 text-left transition hover:bg-[#FCFBF9] ${
        item.read ? "bg-white" : "bg-[#FCFBF9]"
      }`}
    >
      <div className="relative shrink-0">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E4D8CD]">
          <Icon size={17} />
        </div>

        {!item.read && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#725F54]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold text-[#31332C]">
            {item.title}
          </p>

          <span className="shrink-0 text-[10px] text-[#7B756E]">
            {item.time}
          </span>
        </div>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {item.message}
        </p>

        <span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#725F54] ring-1 ring-[#E4D8CD]">
          {config.label}
        </span>
      </div>
    </button>
  );
}

function NotificationEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54]">
        <Bell size={22} />
      </div>

      <p className="mt-4 text-[14px] font-semibold text-[#31332C]">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-[280px] text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}