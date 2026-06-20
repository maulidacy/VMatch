import {
  BadgePercent,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  Hammer,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

import type {
  AdminActivity,
  AdminMenuGroup,
  AdminPriorityTask,
  AdminPromoPreview,
  AdminSummaryCard,
} from "./types";

export const adminMenuGroups: AdminMenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        description: "Ringkasan operasional VMatch",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Manajemen Proyek",
    items: [
      {
        id: "requests",
        label: "Request Proyek",
        description: "Pengajuan proyek dari customer",
        icon: ClipboardList,
      },
      {
        id: "active-projects",
        label: "Proyek Aktif",
        description: "Monitoring proyek berjalan",
        icon: FolderKanban,
      },
      {
        id: "brief-documents",
        label: "Brief & Dokumen",
        description: "File kerja dan dokumen proyek",
        icon: FileText,
      },
      {
        id: "progress-qc",
        label: "Progress & QC",
        description: "Log vendor dan quality control",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Relasi Pengguna",
    items: [
      {
        id: "customers",
        label: "Customer",
        description: "Data dan histori customer",
        icon: Users,
      },
      {
        id: "vendors",
        label: "Vendor Partner",
        description: "Data vendor kerja sama",
        icon: Hammer,
      },
      {
        id: "consultations",
        label: "Konsultasi",
        description: "Jadwal dan catatan konsultasi",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Keuangan & Perencanaan",
    items: [
      {
        id: "rab-builder",
        label: "RAB Builder",
        description: "Estimasi biaya proyek",
        icon: BriefcaseBusiness,
      },
      {
        id: "payments",
        label: "Invoice & Pembayaran",
        description: "Invoice, payout, dan bonus",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Marketing & Insight",
    items: [
      {
        id: "promo",
        label: "Promo & Campaign",
        description: "Popup promo landing page",
        icon: BadgePercent,
      },
      {
        id: "analytics",
        label: "Analytics",
        description: "Insight operasional VMatch",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        id: "notifications",
        label: "Notifikasi",
        description: "Update untuk customer dan vendor",
        icon: Bell,
      },
      {
        id: "settings",
        label: "Pengaturan",
        description: "Konfigurasi dashboard",
        icon: Settings,
      },
    ],
  },
];

export const adminSummaryCards: AdminSummaryCard[] = [
  {
    id: "summary-1",
    label: "Request Baru",
    value: "8",
    description: "Perlu direview admin",
    status: "attention",
    icon: ClipboardList,
  },
  {
    id: "summary-2",
    label: "Proyek Aktif",
    value: "14",
    description: "Sedang berjalan",
    status: "normal",
    icon: FolderKanban,
  },
  {
    id: "summary-3",
    label: "Butuh QC",
    value: "3",
    description: "Menunggu pengecekan",
    status: "attention",
    icon: ClipboardCheck,
  },
  {
    id: "summary-4",
    label: "Pembayaran",
    value: "5",
    description: "Menunggu verifikasi",
    status: "attention",
    icon: WalletCards,
  },
];

export const adminPriorityTasks: AdminPriorityTask[] = [
  {
    id: "task-1",
    title: "Review request Kitchen Set Minimalis",
    description: "Customer sudah mengirim ukuran ruang dan referensi desain.",
    meta: "Masuk 20 menit lalu",
    status: "Baru",
  },
  {
    id: "task-2",
    title: "QC Wardrobe Kamar Utama",
    description: "Vendor sudah menandai pekerjaan selesai dan siap dicek.",
    meta: "Deadline hari ini",
    status: "Prioritas",
  },
  {
    id: "task-3",
    title: "Verifikasi pembayaran customer",
    description: "Invoice tahap produksi menunggu konfirmasi finance.",
    meta: "Rp7.500.000",
    status: "Butuh Review",
  },
];

export const adminActivities: AdminActivity[] = [
  {
    id: "activity-1",
    title: "Vendor mengirim log progress",
    description: "Progress produksi kabinet mencapai 65%.",
    time: "10 menit lalu",
    type: "project",
  },
  {
    id: "activity-2",
    title: "Promo landing page aktif",
    description: "Promo Interior Awal Bulan sedang tampil di landing page.",
    time: "1 jam lalu",
    type: "promo",
  },
  {
    id: "activity-3",
    title: "Request baru masuk",
    description: "Customer mengajukan proyek ruang kerja 2x3 meter.",
    time: "2 jam lalu",
    type: "request",
  },
  {
    id: "activity-4",
    title: "Pembayaran diverifikasi",
    description: "Invoice konsultasi awal telah dikonfirmasi.",
    time: "Kemarin",
    type: "payment",
  },
];

export const activePromoPreview: AdminPromoPreview = {
  id: "promo-1",
  title: "Promo Interior Awal Bulan",
  description: "Diskon 30% untuk biaya konsultasi awal.",
  period: "1 Juli 2026 - 15 Juli 2026",
  status: "Aktif",
};