import type { LucideIcon } from "lucide-react";

export type PageId =
  | "dashboard"
  | "ajukan"
  | "proyek"
  | "konsultasi"
  | "inspirasi"
  | "ai"
  | "pengaturan";

export type MenuItem = {
  id: PageId;
  label: string;
  icon: LucideIcon;
};

export type ProjectStage =
  | "request"
  | "consultation"
  | "estimation"
  | "production"
  | "installation"
  | "done";

export type TimelineEntry = {
  title: string;
  date: string;
  description: string;
  image?: string;
  done: boolean;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  stage: ProjectStage;
  stageLabel: string;
  progress: number;
  lastUpdate: string;
  nextStep: string;
  timeline: TimelineEntry[];
  files: {
    name: string;
    type: string;
    date: string;
  }[];
};

export type Meeting = {
  id: string;
  projectName?: string;
  date: string;
  time: string;
  agenda: string;
  status: "requested" | "confirmed" | "done" | "cancelled";
  meetingUrl?: string;
  notes?: string;
};

export type Invoice = {
  id: string;
  projectName: string;
  description: string;
  amount: string;
  status: "pending" | "paid";
  dueDate: string;
};