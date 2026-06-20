import type { LucideIcon } from "lucide-react";

export type VendorPageId =
  | "dashboard"
  | "projects"
  | "brief"
  | "progress-log"
  | "payment-bonus"
  | "settings";

export type VendorMenuItem = {
  id: VendorPageId;
  label: string;
  icon: LucideIcon;
};

export type VendorProjectStatus =
  | "Menunggu Brief"
  | "Siap Dikerjakan"
  | "Sedang Dikerjakan"
  | "Butuh Update"
  | "Menunggu QC"
  | "Selesai";

export type VendorBonusStatus =
  | "Berpotensi Aktif"
  | "Menunggu QC"
  | "Bonus Aktif"
  | "Belum Memenuhi Syarat"
  | "Sudah Dibayarkan";

export type VendorPaymentStatus =
  | "Menunggu Milestone"
  | "Diproses"
  | "Dibayarkan"
  | "Ditahan Sementara";

export type ProgressLogStatus =
  | "Sesuai Jadwal"
  | "Ada Kendala"
  | "Tidak Ada Pekerjaan Hari Ini";

export type WorkPlanStatus =
  | "Belum Dibaca"
  | "Sudah Dibaca"
  | "Butuh Diskusi"
  | "Estimasi Disiapkan"
  | "Estimasi Dikirim";

export type VendorProfile = {
  name: string;
  email: string;
  phone: string;
  serviceArea: string;
  skill: string;
  bankName: string;
  bankAccount: string;
};

export type FieldTeamMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
};

export type VendorProject = {
  id: string;
  name: string;
  type: string;
  location: string;
  status: VendorProjectStatus;
  progress: number;
  deadline: string;
  startDate: string;
  customerBrief: string;
  vmNotes: string;
  material: string;
  nextTask: string;
  bonusStatus: VendorBonusStatus;
  fieldTeam: FieldTeamMember[];
};

export type WorkBrief = {
  id: string;
  projectId: string;
  projectName: string;
  scope: string[];
  materialApproved: string[];
  timeline: {
    label: string;
    date: string;
  }[];
  qcChecklist: string[];
  notes: string;
  status: WorkPlanStatus;
};

export type ProgressLog = {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  status: ProgressLogStatus;
  progressPercent: number;
  workSummary: string;
  issue: string;
  nextPlan: string;
  photoLabel: string;
};

export type PaymentMilestone = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  amount: string;
  status: VendorPaymentStatus;
  dueInfo: string;
};

export type BonusInfo = {
  projectId: string;
  projectName: string;
  status: VendorBonusStatus;
  amount: string;
  reason: string;
  requirements: {
    label: string;
    completed: boolean;
  }[];
};

export type VendorEstimateStatus =
  | "Belum Dibuat"
  | "Draft Estimasi"
  | "Estimasi Dikirim";

export type VendorEstimate = {
  id: string;
  briefId: string;
  projectName: string;
  estimatedCost: string;
  estimatedDuration: string;
  suggestedMaterial: string;
  vendorNote: string;
  status: VendorEstimateStatus;
  sentAt?: string;
};
