import {
  ClipboardList,
  FileText,
  FolderKanban,
  // LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import type {
  BonusInfo,
  PaymentMilestone,
  ProgressLog,
  VendorMenuItem,
  VendorProfile,
  VendorProject,
  WorkBrief,
} from "./types";

export const vendorMenuItems: VendorMenuItem[] = [
  /*{
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },*/
  {
    id: "projects",
    label: "Proyek Saya",
    icon: FolderKanban,
  },
  {
    id: "brief",
    label: "Brief & Rencana Kerja",
    icon: ClipboardList,
  },
  {
    id: "progress-log",
    label: "Log Progress",
    icon: FileText,
  },
  {
    id: "payment-bonus",
    label: "Pembayaran & Bonus",
    icon: Wallet,
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: Settings,
  },
];
