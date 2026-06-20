import type { LucideIcon } from "lucide-react";

export type AdminPageId =
  | "dashboard"
  | "promo"
  | "requests"
  | "active-projects"
  | "brief-documents"
  | "progress-qc"
  | "payments"
  | "rab-builder"
  | "consultations"
  | "vendors"
  | "customers"
  | "analytics"
  | "notifications"
  | "settings";

export type AdminMenuItem = {
  id: AdminPageId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type AdminMenuGroup = {
  title: string;
  items: AdminMenuItem[];
};

export type AdminSummaryCard = {
  id: string;
  label: string;
  value: string;
  description: string;
  status: "normal" | "attention" | "success";
  icon: LucideIcon;
};

export type AdminPriorityTask = {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: "Baru" | "Butuh Review" | "Menunggu" | "Prioritas";
};

export type AdminActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "request" | "project" | "payment" | "promo" | "qc";
};

export type AdminPromoPreview = {
  id: string;
  title: string;
  description: string;
  period: string;
  status: "Aktif" | "Draft" | "Nonaktif";
};