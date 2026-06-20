"use client";

import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
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
import { useMemo, useState, type ReactNode } from "react";

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


function isNotificationMatchTab(
  item: AdminNotification,
  activeTab: NotificationTab,
) {
  if (activeTab === "Semua") return true;
  if (activeTab === "Belum Dibaca") return item.status === "Belum Dibaca";
  if (activeTab === "Arsip") return item.status === "Diarsipkan";

  return item.category === activeTab;
}

const mockNotifications: AdminNotification[] = [
  {
    id: "notif-flow-brief-sent",
    title: "Brief berhasil dikirim ke vendor",
    shortDescription:
      "Brief Kitchen Set Modern Minimalis sudah dikirim ke vendor dan menunggu estimasi.",
    systemMessage:
      "Admin telah mengirim brief proyek Kitchen Set Modern Minimalis ke vendor terpilih. Vendor dapat membaca brief di Vendor Panel dan menyiapkan estimasi RAB untuk admin.",
    category: "Vendor",
    priority: "Penting",
    status: "Belum Dibaca",
    date: "Hari ini",
    time: "Baru saja",
    relatedPageLabel: "Request Proyek",
    relatedPageId: "requests",
    primaryActionLabel: "Buka Request",
    sourceInfo: "Notifikasi dibuat setelah admin mengirim brief ke vendor.",
    reason:
      "Admin perlu memantau apakah vendor sudah membaca brief dan mengirim estimasi RAB.",
    requiredAction:
      "Pantau status vendor. Jika vendor belum merespons, lakukan follow up melalui halaman Request Proyek atau Vendor Partner.",
    adminNote: "",
  },
  {
    id: "notif-flow-brief-read",
    title: "Vendor membaca brief proyek",
    shortDescription:
      "Vendor terpilih sudah membaca brief dan dapat mulai menyiapkan estimasi RAB.",
    systemMessage:
      "Vendor telah membuka dan menandai brief sebagai sudah dibaca. Tahap berikutnya adalah vendor menyiapkan estimasi RAB untuk direview admin.",
    category: "Vendor",
    priority: "Normal",
    status: "Sudah Dibaca",
    date: "Hari ini",
    time: "Baru saja",
    relatedPageLabel: "Vendor Partner",
    relatedPageId: "vendors",
    primaryActionLabel: "Buka Vendor",
    sourceInfo: "Notifikasi dibuat dari aktivitas vendor di Vendor Panel.",
    reason:
      "Aktivitas membaca brief menunjukkan vendor sudah menerima informasi proyek.",
    requiredAction:
      "Tunggu estimasi dari vendor atau lakukan follow up jika estimasi tidak dikirim sesuai waktu respon.",
    adminNote: "",
  },
  {
    id: "notif-flow-rab-review",
    title: "RAB perlu direview admin",
    shortDescription:
      "Estimasi vendor sudah masuk dan perlu direview sebelum dikirim ke customer.",
    systemMessage:
      "Vendor telah mengirim estimasi RAB. Admin perlu mengecek item pekerjaan, material, nominal, dan catatan vendor sebelum membuat RAB final untuk customer.",
    category: "RAB",
    priority: "Penting",
    status: "Belum Dibaca",
    date: "Hari ini",
    time: "Baru saja",
    relatedPageLabel: "RAB Builder",
    relatedPageId: "rab-builder",
    primaryActionLabel: "Review RAB",
    sourceInfo: "Notifikasi dibuat setelah vendor mengirim estimasi RAB.",
    reason:
      "Estimasi vendor belum boleh langsung diteruskan ke customer sebelum admin melakukan review.",
    requiredAction:
      "Buka RAB Builder, review estimasi vendor, sesuaikan catatan admin, lalu kirim RAB final ke customer.",
    adminNote: "",
  },
  {
    id: "notif-1",
    title: "Request proyek baru masuk",
    shortDescription:
      "Alya Putri mengajukan request Kitchen Set Minimalis dan menunggu review admin.",
    systemMessage:
      "Customer Alya Putri baru saja mengirim request proyek Kitchen Set Minimalis melalui dashboard user. Request ini perlu dicek agar admin dapat melanjutkan proses review kebutuhan dan menyiapkan tindak lanjut awal.",
    category: "Proyek",
    priority: "Penting",
    status: "Belum Dibaca",
    date: "Hari ini",
    time: "10.30 WIB",
    relatedPageLabel: "Request Proyek",
    relatedPageId: "requests",
    primaryActionLabel: "Buka Request",
    sourceInfo: "Notifikasi dibuat dari aktivitas pengajuan request proyek baru.",
    reason:
      "Request baru membutuhkan review admin sebelum bisa masuk ke tahap konsultasi, brief, atau pencocokan vendor.",
    requiredAction:
      "Cek detail request, validasi kebutuhan customer, lalu tentukan apakah request perlu konsultasi lanjutan atau langsung dibuatkan brief awal.",
    adminNote: "",
  },
  {
    id: "notif-2",
    title: "Konsultasi menunggu konfirmasi",
    shortDescription:
      "Jadwal konsultasi Bima Santoso untuk proyek Wardrobe Kamar Utama perlu dikonfirmasi.",
    systemMessage:
      "Customer Bima Santoso memiliki jadwal konsultasi yang belum dikonfirmasi. Admin perlu memastikan jadwal, metode konsultasi, dan link meeting agar customer mendapatkan kepastian waktu.",
    category: "Konsultasi",
    priority: "Normal",
    status: "Belum Dibaca",
    date: "Hari ini",
    time: "09.15 WIB",
    relatedPageLabel: "Konsultasi",
    relatedPageId: "consultations",
    primaryActionLabel: "Buka Konsultasi",
    sourceInfo: "Notifikasi dibuat dari jadwal konsultasi dengan status menunggu konfirmasi.",
    reason:
      "Jadwal konsultasi yang belum dikonfirmasi dapat memperlambat proses validasi kebutuhan customer.",
    requiredAction:
      "Buka halaman konsultasi, cek jadwal, pastikan metode meeting, lalu ubah status konsultasi sesuai hasil konfirmasi.",
    adminNote: "",
  },
  {
    id: "notif-3",
    title: "Vendor mengirim estimasi RAB",
    shortDescription:
      "Vendor partner mengirim estimasi RAB untuk proyek Wardrobe dan perlu direview admin.",
    systemMessage:
      "Vendor Mitra Interior Jogja telah mengirim estimasi RAB untuk proyek Wardrobe Kamar Utama. Estimasi perlu direview agar nominal, material, dan ruang lingkup pekerjaan sesuai dengan brief.",
    category: "RAB",
    priority: "Penting",
    status: "Belum Dibaca",
    date: "Hari ini",
    time: "08.40 WIB",
    relatedPageLabel: "RAB Builder",
    relatedPageId: "rab-builder",
    primaryActionLabel: "Review RAB",
    sourceInfo: "Notifikasi dibuat ketika vendor mengirim estimasi biaya proyek.",
    reason:
      "RAB perlu diverifikasi sebelum dikirim atau disetujui oleh customer.",
    requiredAction:
      "Review item pekerjaan, cek kesesuaian nominal, dan pastikan catatan material sudah sesuai brief proyek.",
    adminNote: "",
  },
  {
    id: "notif-4",
    title: "Pembayaran melewati jatuh tempo",
    shortDescription:
      "Invoice proyek Ruang Kerja Rumah melewati tanggal jatuh tempo dan perlu follow up.",
    systemMessage:
      "Invoice pelunasan proyek Ruang Kerja Rumah sudah melewati tanggal jatuh tempo. Admin perlu melakukan follow up agar proses serah terima proyek tidak tertunda.",
    category: "Pembayaran",
    priority: "Urgent",
    status: "Belum Dibaca",
    date: "Kemarin",
    time: "16.20 WIB",
    relatedPageLabel: "Invoice & Pembayaran",
    relatedPageId: "payments",
    primaryActionLabel: "Buka Invoice",
    sourceInfo: "Notifikasi dibuat dari invoice dengan status terlambat.",
    reason:
      "Pembayaran yang melewati jatuh tempo dapat menghambat penyelesaian administrasi dan serah terima proyek.",
    requiredAction:
      "Buka invoice, cek sisa tagihan, lalu lakukan follow up customer melalui kanal komunikasi yang tersedia.",
    adminNote: "",
  },
  {
    id: "notif-5",
    title: "Promo akan berakhir",
    shortDescription:
      "Campaign Interior Awal Bulan akan segera berakhir dan perlu dicek kembali.",
    systemMessage:
      "Promo Interior Awal Bulan mendekati tanggal akhir campaign. Admin dapat mengevaluasi performa promo dan menentukan apakah promo perlu diperpanjang, diganti, atau dinonaktifkan.",
    category: "Promo",
    priority: "Normal",
    status: "Sudah Dibaca",
    date: "Kemarin",
    time: "13.10 WIB",
    relatedPageLabel: "Promo & Campaign",
    relatedPageId: "promo",
    primaryActionLabel: "Kelola Promo",
    sourceInfo: "Notifikasi dibuat dari campaign promo yang mendekati tanggal selesai.",
    reason:
      "Promo yang hampir berakhir perlu dicek agar landing page tetap menampilkan campaign yang relevan.",
    requiredAction:
      "Buka halaman promo, cek tanggal campaign, lalu aktifkan, jadwalkan, atau nonaktifkan promo sesuai kebutuhan.",
    adminNote: "",
  },
  {
    id: "notif-6",
    title: "Vendor perlu evaluasi",
    shortDescription:
      "Mitra Interior Jogja memiliki revisi layout yang belum selesai dan perlu evaluasi admin.",
    systemMessage:
      "Salah satu vendor partner memiliki progres revisi yang lambat pada proyek aktif. Admin perlu mengevaluasi komunikasi vendor dan menentukan tindak lanjut agar proyek tetap berjalan.",
    category: "Vendor",
    priority: "Penting",
    status: "Sudah Dibaca",
    date: "2 hari lalu",
    time: "11.00 WIB",
    relatedPageLabel: "Vendor Partner",
    relatedPageId: "vendors",
    primaryActionLabel: "Buka Vendor",
    sourceInfo: "Notifikasi dibuat dari aktivitas vendor pada proyek aktif.",
    reason:
      "Respons vendor yang lambat dapat memengaruhi timeline proyek dan kepuasan customer.",
    requiredAction:
      "Buka data vendor, cek proyek aktif, lalu tentukan apakah vendor perlu follow up atau evaluasi status kerja sama.",
    adminNote: "",
  },
  {
    id: "notif-7",
    title: "Customer baru terdaftar",
    shortDescription:
      "Customer baru melihat katalog desain dan belum mengajukan proyek.",
    systemMessage:
      "Customer baru telah terdaftar dan mulai melihat katalog desain. Customer ini belum mengajukan request proyek sehingga dapat menjadi peluang follow up ringan.",
    category: "Customer",
    priority: "Normal",
    status: "Ditindaklanjuti",
    date: "3 hari lalu",
    time: "14.45 WIB",
    relatedPageLabel: "Customer",
    relatedPageId: "customers",
    primaryActionLabel: "Buka Customer",
    sourceInfo: "Notifikasi dibuat dari aktivitas customer baru pada katalog desain.",
    reason:
      "Customer baru yang sudah melihat katalog dapat menjadi calon pengguna yang perlu diarahkan ke request proyek.",
    requiredAction:
      "Cek data customer dan pertimbangkan follow up untuk membantu customer memilih layanan interior.",
    adminNote: "Sudah dicek, follow up ringan bisa dilakukan setelah customer aktif kembali.",
  },
  {
    id: "notif-8",
    title: "Backup sistem berhasil",
    shortDescription:
      "Sistem berhasil melakukan backup data dashboard admin VMatch secara otomatis.",
    systemMessage:
      "Backup data sistem berhasil dilakukan secara otomatis. Informasi ini bersifat sistem dan tidak memerlukan tindakan mendesak.",
    category: "Sistem",
    priority: "Normal",
    status: "Diarsipkan",
    date: "4 hari lalu",
    time: "06.00 WIB",
    relatedPageLabel: "Pengaturan",
    relatedPageId: "settings",
    primaryActionLabel: "Buka Pengaturan",
    sourceInfo: "Notifikasi dibuat dari proses sistem otomatis.",
    reason:
      "Sistem mencatat aktivitas backup sebagai informasi operasional.",
    requiredAction:
      "Tidak ada tindakan mendesak. Admin dapat membuka pengaturan jika ingin mengecek konfigurasi sistem.",
    adminNote: "",
  },
];

export function AdminNotificationView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [notifications, setNotifications] =
    useState<AdminNotification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<NotificationTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const filteredNotifications = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchTab = isNotificationMatchTab(item, activeTab);

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.shortDescription.toLowerCase().includes(normalizedKeyword) ||
        item.systemMessage.toLowerCase().includes(normalizedKeyword) ||
        item.category.toLowerCase().includes(normalizedKeyword) ||
        item.priority.toLowerCase().includes(normalizedKeyword) ||
        item.status.toLowerCase().includes(normalizedKeyword) ||
        item.relatedPageLabel.toLowerCase().includes(normalizedKeyword) ||
        item.relatedPageId.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, notifications]);

  const selectedNotification = useMemo(() => {
    if (!selectedNotificationId) return null;

    return (
      notifications.find((item) => item.id === selectedNotificationId) ?? null
    );
  }, [notifications, selectedNotificationId]);

  const summaryCounts = useMemo(() => {
    return {
      unread: notifications.filter((item) => item.status === "Belum Dibaca")
        .length,
      urgent: notifications.filter((item) => item.priority === "Urgent").length,
      followedUp: notifications.filter(
        (item) => item.status === "Ditindaklanjuti",
      ).length,
      archived: notifications.filter((item) => item.status === "Diarsipkan")
        .length,
    };
  }, [notifications]);

  const tabCounts = useMemo<Record<NotificationTab, number>>(() => {
    return {
      Semua: notifications.length,
      "Belum Dibaca": notifications.filter(
        (item) => item.status === "Belum Dibaca",
      ).length,
      Proyek: notifications.filter((item) => item.category === "Proyek").length,
      Konsultasi: notifications.filter((item) => item.category === "Konsultasi")
        .length,
      RAB: notifications.filter((item) => item.category === "RAB").length,
      Pembayaran: notifications.filter((item) => item.category === "Pembayaran")
        .length,
      Promo: notifications.filter((item) => item.category === "Promo").length,
      Sistem: notifications.filter((item) => item.category === "Sistem").length,
      Arsip: notifications.filter((item) => item.status === "Diarsipkan")
        .length,
    };
  }, [notifications]);

  const updateNotification = (
    id: string,
    updater: (item: AdminNotification) => AdminNotification,
  ) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? updater(item) : item)),
    );
  };

  const openDetail = (item: AdminNotification) => {
    setSelectedNotificationId(item.id);
    setAdminNoteDraft(item.adminNote);
    setIsNoteSaved(false);

    if (item.status === "Belum Dibaca") {
      updateNotification(item.id, (notification) => ({
        ...notification,
        status: "Sudah Dibaca",
      }));
    }
  };

  const closeDetail = () => {
    setSelectedNotificationId(null);
    setAdminNoteDraft("");
    setIsNoteSaved(false);
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        status: item.status === "Belum Dibaca" ? "Sudah Dibaca" : item.status,
      })),
    );

    if (activeTab === "Belum Dibaca") {
      setActiveTab("Semua");
    }
  };

  const updateStatus = (id: string, status: NotificationStatus) => {
    updateNotification(id, (item) => ({
      ...item,
      status,
    }));

    if (status === "Diarsipkan") {
      setActiveTab("Arsip");
    }
  };

  const saveAdminNote = () => {
    if (!selectedNotification) return;

    updateNotification(selectedNotification.id, (item) => ({
      ...item,
      adminNote: adminNoteDraft,
    }));

    setIsNoteSaved(true);
  };

  const handlePrimaryAction = (notification: AdminNotification) => {
    if (notification.status === "Belum Dibaca") {
      updateStatus(notification.id, "Sudah Dibaca");
    }

    onChangePage?.(notification.relatedPageId);
  };

  if (selectedNotification) {
    return (
      <NotificationDetailView
        notification={selectedNotification}
        adminNoteDraft={adminNoteDraft}
        isNoteSaved={isNoteSaved}
        onBack={closeDetail}
        onStatusChange={(status) =>
          updateStatus(selectedNotification.id, status)
        }
        onAdminNoteChange={(value) => {
          setAdminNoteDraft(value);
          setIsNoteSaved(false);
        }}
        onSaveAdminNote={saveAdminNote}
        onPrimaryAction={() => handlePrimaryAction(selectedNotification)}
        onMarkFollowedUp={() =>
          updateStatus(selectedNotification.id, "Ditindaklanjuti")
        }
        onArchive={() => updateStatus(selectedNotification.id, "Diarsipkan")}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[900px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
              NOTIFIKASI
            </p>

            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              Daftar Notifikasi
            </h1>

            <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
              Pantau aktivitas penting dari request proyek, konsultasi,
              pembayaran, vendor, customer, RAB, promo, dan sistem operasional
              VMatch.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={summaryCounts.unread === 0}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${summaryCounts.unread > 0
                ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
              }`}
          >
            <CheckCircle2 size={15} />
            Tandai Semua Dibaca
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <NotificationSummaryChip
          label="Belum Dibaca"
          value={summaryCounts.unread}
          icon={Clock}
        />

        <NotificationSummaryChip
          label="Urgent"
          value={summaryCounts.urgent}
          icon={AlertTriangle}
        />

        <NotificationSummaryChip
          label="Ditindaklanjuti"
          value={summaryCounts.followedUp}
          icon={CheckCircle2}
        />

        <NotificationSummaryChip
          label="Arsip"
          value={summaryCounts.archived}
          icon={Archive}
        />
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari notifikasi, kategori, status, prioritas, atau halaman..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <NotificationFilterTabs
            activeTab={activeTab}
            tabs={notificationTabs}
            counts={tabCounts}
            onChange={setActiveTab}
          />
        </div>
      </section>

      <section>
        {filteredNotifications.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {filteredNotifications.map((notification) => (
              <NotificationListCard
                key={notification.id}
                notification={notification}
                onClick={() => openDetail(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Notifikasi tidak ditemukan.
            </p>

            <p className="mt-2 text-[13px] text-[#7B756E]">
              Coba ubah filter atau kata pencarian.
            </p>
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
                onChange={(event) =>
                  onStatusChange(event.target.value as NotificationStatus)
                }
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
          <DetailSection
            title="Pesan Sistem"
            description="Pesan asli dari sistem. Bagian ini hanya untuk dibaca."
          >
            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <p className="text-[13px] leading-7 text-[#31332C]">
                {notification.systemMessage}
              </p>
            </div>
          </DetailSection>

          <DetailSection
            title="Detail Aktivitas"
            description="Sumber, alasan muncul, dan tindakan yang disarankan."
            withRightBorder={false}
          >
            <div className="space-y-3">
              <ActivityInfo
                title="Sumber informasi"
                description={notification.sourceInfo}
              />

              <ActivityInfo
                title="Alasan notifikasi muncul"
                description={notification.reason}
              />

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
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${notification.status === "Ditindaklanjuti"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <CheckCircle2 size={15} />
          Ditindaklanjuti
        </button>

        <button
          type="button"
          onClick={onArchive}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${notification.status === "Diarsipkan"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            }`}
        >
          <Archive size={15} />
          Arsipkan
        </button>
      </div>
    </div>
  );
}

function NotificationListCard({
  notification,
  onClick,
}: {
  notification: AdminNotification;
  onClick: () => void;
}) {
  const isUnread = notification.status === "Belum Dibaca";
  const isUrgent = notification.priority === "Urgent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-white ${isUrgent
          ? "border-[#E6C7BD] bg-[#FFF8ED]"
          : isUnread
            ? "border-[#E8D6BE] bg-[#FFF8ED]"
            : "border-[#E8E2D9] bg-white"
        }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54] ring-1 ring-[#E8E2D9]">
          <NotificationCategoryIcon category={notification.category} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-[#31332C]">
                {notification.title}
              </p>

              <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {notification.shortDescription}
              </p>
            </div>

            <NotificationPriorityBadge priority={notification.priority} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <NotificationStatusBadge status={notification.status} />

            <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#725F54]">
              {notification.category}
            </span>

            <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#7B756E]">
              {notification.relatedPageLabel}
            </span>
          </div>

          <p className="mt-3 text-[11px] text-[#9A8F86]">
            {notification.date} • {notification.time}
          </p>
        </div>
      </div>
    </button>
  );
}

function NotificationSummaryChip({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={17} strokeWidth={2.2} />
        </div>

        <p className="shrink-0 font-serif text-[28px] leading-none text-[#31332C]">
          {value}
        </p>
      </div>

      <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-[#7B756E]">
        Ringkasan notifikasi
      </p>
    </div>
  );
}

function NotificationFilterTabs({
  activeTab,
  tabs,
  counts,
  onChange,
}: {
  activeTab: NotificationTab;
  tabs: NotificationTab[];
  counts: Record<NotificationTab, number>;
  onChange: (tab: NotificationTab) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-1.5">
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 text-[12px] font-semibold transition ${active
                  ? "bg-[#725F54] text-white shadow-sm"
                  : "text-[#6F6860] hover:bg-white"
                }`}
            >
              <span>{tab}</span>

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/18 text-white" : "bg-white text-[#9A8F86]"
                  }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>
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
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#31332C]">
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Catatan Admin
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            Catatan internal admin. Bagian ini berbeda dari pesan sistem.
          </p>
        </div>

        {isSaved && (
          <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
            Tersimpan
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder="Tambahkan catatan tindak lanjut admin..."
        className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-white px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={!isChanged}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isChanged
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
    <div
      className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 ${withRightBorder ? "xl:border-r" : ""
        }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {title}
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActivityInfo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <p className="text-[12px] font-semibold text-[#31332C]">{title}</p>

      <p className="mt-1 text-[12px] leading-6 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}

function NotificationCategoryIcon({
  category,
}: {
  category: NotificationCategory;
}) {
  if (category === "Proyek") return <BriefcaseBusiness size={16} />;
  if (category === "Konsultasi") return <MessageCircle size={16} />;
  if (category === "RAB") return <FileText size={16} />;
  if (category === "Pembayaran") return <CreditCard size={16} />;
  if (category === "Vendor") return <ShieldCheck size={16} />;
  if (category === "Customer") return <Users size={16} />;
  if (category === "Promo") return <Megaphone size={16} />;
  if (category === "Sistem") return <Settings size={16} />;

  return <Bell size={16} />;
}

function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const style =
    status === "Belum Dibaca"
      ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
      : status === "Sudah Dibaca"
        ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
        : status === "Ditindaklanjuti"
          ? "border-[#D8C7B6] bg-[#FCFBF9] text-[#725F54]"
          : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}

function NotificationPriorityBadge({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const style =
    priority === "Urgent"
      ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
      : priority === "Penting"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {priority}
    </span>
  );
}
