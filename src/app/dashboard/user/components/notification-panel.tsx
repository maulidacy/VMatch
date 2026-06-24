"use client";

import {
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  FolderKanban,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api/notifications";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Notification as DBNotification } from "@/lib/supabase/types";
import { toast } from "sonner";

type NotificationType = "project" | "payment" | "consultation" | "system";

type NotificationPageTarget = "dashboard" | "proyek" | "konsultasi";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  time: string;
  href: string;
  targetPage: NotificationPageTarget;
  targetTab?: string;
};

const mockNotifications: NotificationItem[] = [];

function mapDbNotification(n: DBNotification): NotificationItem {
  const categoryToType: Record<string, NotificationType> = {
    "Proyek": "project",
    "Pembayaran": "payment",
    "Konsultasi": "consultation",
    "RAB": "payment",
    "Vendor": "system",
    "Customer": "system",
    "Promo": "system",
    "Sistem": "system",
  };

  const categoryToPage: Record<string, NotificationPageTarget> = {
    "Proyek": "proyek",
    "Pembayaran": "proyek",
    "Konsultasi": "konsultasi",
    "RAB": "proyek",
  };

  return {
    id: n.id,
    title: n.title,
    message: n.description || "",
    type: categoryToType[n.category] || "system",
    read: n.is_read,
    time: formatTimeAgo(n.created_at),
    href: "#",
    targetPage: categoryToPage[n.category] || "proyek",
  };
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} jam lalu`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari lalu`;
}

const typeConfig: Record<
  NotificationType,
  {
    label: string;
    icon: LucideIcon;
  }
> = {
  project: {
    label: "Proyek",
    icon: FolderKanban,
  },
  payment: {
    label: "Pembayaran",
    icon: CreditCard,
  },
  consultation: {
    label: "Konsultasi",
    icon: CalendarDays,
  },
  system: {
    label: "Info",
    icon: Bell,
  },
};

export function NotificationBell({
  onNavigate,
}: {
  onNavigate?: (page: NotificationPageTarget) => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const dbNotifs = await getNotifications(user.id);
      setNotifications(dbNotifs.map(mapDbNotification));
    } catch (error) {
      toast.error("Gagal memuat notifikasi.");
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

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

  const handleMarkAllRead = async () => {
    if (!user) return;
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );
    try {
      await markAllNotificationsRead(user.id);
    } catch (error) {
      toast.error("Gagal menandai semua dibaca.");
      loadNotifications(); // rollback
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === item.id
          ? { ...notification, read: true }
          : notification,
      ),
    );

    try {
      await markNotificationRead(item.id);
    } catch (error) {
      toast.error("Gagal menandai notifikasi dibaca.");
      loadNotifications(); // rollback
    }

    setOpen(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "vmatch_notification_target",
        JSON.stringify({
          href: item.href,
          page: item.targetPage,
          tab: item.targetTab,
          type: item.type,
        }),
      );
    }

    if (onNavigate) {
      onNavigate(item.targetPage);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.assign(item.href);
    }
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
        <section className="fixed inset-x-3 top-[72px] z-50 max-h-[calc(100dvh-96px)] overflow-hidden rounded-2xl border border-[#E4D8CD] bg-white shadow-[0_24px_70px_rgba(49,51,44,0.18)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[390px]">
          <div className="border-b border-[#E8E2D9] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-[26px] leading-tight text-[#31332C]">
                  Notifikasi
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  Update penting terkait proyek dan konsultasi kamu.
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
  item: NotificationItem;
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