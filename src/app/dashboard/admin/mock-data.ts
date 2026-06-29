import {
  BadgePercent,
  Banknote,
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
      {
        id: "vendor-bonus",
        label: "Bonus Vendor",
        description: "Bonus dan insentif vendor",
        icon: Banknote,
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
