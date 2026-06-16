"use client";

import {
    Bell,
    CalendarDays,
    Check,
    CheckCircle2,
    CreditCard,
    FileText,
    FolderKanban,
    Layers,
    PencilLine,
    ShieldCheck,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type NotificationType =
    | "project"
    | "payment"
    | "consultation"
    | "material"
    | "revision"
    | "document"
    | "qc"
    | "warranty"
    | "system";

type NotificationFilter =
    | "semua"
    | "unread"
    | "project"
    | "payment"
    | "consultation";

type NotificationPageTarget = "dashboard" | "proyek" | "konsultasi";

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    time: string;
    href: string;
    priority: "normal" | "high";
    targetPage: NotificationPageTarget;
    targetTab?: string;
};

const notificationFilters: { id: NotificationFilter; label: string }[] = [
    { id: "semua", label: "Semua" },
    { id: "unread", label: "Belum Dibaca" },
    { id: "project", label: "Proyek" },
    { id: "payment", label: "Pembayaran" },
    { id: "consultation", label: "Konsultasi" },
];

const mockNotifications: NotificationItem[] = [
    {
        id: "n-1",
        title: "Invoice menunggu pembayaran",
        message: "Pembayaran tahap 2 untuk Kitchen Set Minimalis sudah tersedia.",
        type: "payment",
        read: false,
        time: "10 menit lalu",
        href: "/dashboard/user/proyek-saya/project-1?tab=tagihan",
        priority: "high",
        targetPage: "proyek",
        targetTab: "tagihan",
    },
    {
        id: "n-2",
        title: "Progress proyek diperbarui",
        message: "Vendor telah menyelesaikan tahap produksi kabinet.",
        type: "project",
        read: false,
        time: "1 jam lalu",
        href: "/dashboard/user/proyek-saya/project-1?tab=progress",
        priority: "high",
        targetPage: "proyek",
        targetTab: "progress",
    },
    {
        id: "n-3",
        title: "Jadwal konsultasi dikonfirmasi",
        message: "Google Meet untuk konsultasi material sudah tersedia.",
        type: "consultation",
        read: false,
        time: "2 jam lalu",
        href: "/dashboard/user/konsultasi",
        priority: "normal",
        targetPage: "konsultasi",
    },
    {
        id: "n-4",
        title: "Material menunggu persetujuan",
        message: "Tim VMatch mengirim rekomendasi material untuk kamu review.",
        type: "material",
        read: true,
        time: "Kemarin",
        href: "/dashboard/user/proyek-saya/project-1?tab=material",
        priority: "normal",
        targetPage: "proyek",
        targetTab: "material",
    },
    {
        id: "n-5",
        title: "QC siap direview",
        message: "Hasil akhir proyek sudah masuk tahap QC & Serah Terima.",
        type: "qc",
        read: true,
        time: "2 hari lalu",
        href: "/dashboard/user/proyek-saya/project-1?tab=qc",
        priority: "normal",
        targetPage: "proyek",
        targetTab: "qc",
    },
    {
        id: "n-6",
        title: "Dokumen solusi tersedia",
        message: "Dokumen solusi awal proyek sudah bisa kamu lihat.",
        type: "document",
        read: true,
        time: "3 hari lalu",
        href: "/dashboard/user/proyek-saya/project-1?tab=dokumen",
        priority: "normal",
        targetPage: "proyek",
        targetTab: "dokumen",
    },
    {
        id: "n-7",
        title: "Revisi sedang direview",
        message: "Pengajuan revisi material sedang ditinjau oleh tim VMatch.",
        type: "revision",
        read: true,
        time: "4 hari lalu",
        href: "/dashboard/user/proyek-saya/project-1?tab=revisi",
        priority: "normal",
        targetPage: "proyek",
        targetTab: "revisi",
    },
];

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
    material: {
        label: "Material",
        icon: Layers,
    },
    revision: {
        label: "Revisi",
        icon: PencilLine,
    },
    document: {
        label: "Dokumen",
        icon: FileText,
    },
    qc: {
        label: "QC",
        icon: CheckCircle2,
    },
    warranty: {
        label: "Garansi",
        icon: ShieldCheck,
    },
    system: {
        label: "Sistem",
        icon: Bell,
    },
};

export function NotificationBell({
    onNavigate,
}: {
    onNavigate?: (page: NotificationPageTarget) => void;
}) {
    const panelRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] =
        useState<NotificationFilter>("semua");
    const [notifications, setNotifications] =
        useState<NotificationItem[]>(mockNotifications);

    const unreadCount = useMemo(() => {
        return notifications.filter((item) => !item.read).length;
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        if (activeFilter === "semua") return notifications;

        if (activeFilter === "unread") {
            return notifications.filter((item) => !item.read);
        }

        return notifications.filter((item) => item.type === activeFilter);
    }, [activeFilter, notifications]);

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

    const handleNotificationClick = (item: NotificationItem) => {
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
                <section className="fixed inset-x-3 top-[72px] z-50 max-h-[calc(100dvh-96px)] overflow-hidden rounded-2xl border border-[#E4D8CD] bg-white shadow-[0_24px_70px_rgba(49,51,44,0.18)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[410px]">
                    <div className="border-b border-[#E8E2D9] p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-serif text-[28px] leading-tight text-[#31332C]">
                                    Notifikasi
                                </h2>

                                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                    Update terbaru dari proyek VMatch kamu.
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

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="inline-flex w-fit rounded-full bg-[#FCFBF9] px-3 py-1.5 text-[11px] font-semibold text-[#725F54]">
                                {unreadCount} belum dibaca
                            </span>

                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0}
                                className="inline-flex h-8 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-3 text-[11px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check size={13} />
                                Tandai semua dibaca
                            </button>
                        </div>

                        <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {notificationFilters.map((filter) => {
                                const active = activeFilter === filter.id;

                                return (
                                    <button
                                        key={filter.id}
                                        type="button"
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`h-8 shrink-0 rounded-xl px-3 text-[11px] font-semibold transition ${active
                                                ? "bg-[#725F54] text-white"
                                                : "bg-[#FCFBF9] text-[#725F54] hover:bg-[#F4EEE8]"
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((item) => (
                                <NotificationListItem
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleNotificationClick(item)}
                                />
                            ))
                        ) : (
                            <NotificationEmptyState
                                title={
                                    notifications.length === 0
                                        ? "Belum ada notifikasi."
                                        : "Tidak ada notifikasi pada kategori ini."
                                }
                                description={
                                    notifications.length === 0
                                        ? "Update proyek, pembayaran, konsultasi, dan dokumen akan muncul di sini."
                                        : "Coba pilih filter lain untuk melihat update terbaru."
                                }
                            />
                        )}
                    </div>

                    <div className="border-t border-[#E8E2D9] p-3">
                        <button
                            type="button"
                            onClick={() => setActiveFilter("semua")}
                            className="h-10 w-full rounded-xl text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                        >
                            Lihat semua notifikasi
                        </button>
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
            className={`flex w-full gap-3 border-b border-[#E8E2D9] p-4 text-left transition hover:bg-[#FCFBF9] ${item.read ? "bg-white" : "bg-[#FCFBF9]"
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
                    <p className="line-clamp-1 text-[13px] font-semibold text-[#31332C]">
                        {item.title}
                    </p>

                    <span className="shrink-0 text-[10px] text-[#7B756E]">
                        {item.time}
                    </span>
                </div>

                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                    {item.message}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#E4D8CD] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#725F54]">
                        {config.label}
                    </span>

                    {item.priority === "high" && (
                        <span className="rounded-full bg-[#725F54] px-2.5 py-1 text-[10px] font-semibold text-white">
                            Penting
                        </span>
                    )}
                </div>
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