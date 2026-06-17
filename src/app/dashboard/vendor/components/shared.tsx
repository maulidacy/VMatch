"use client";

import type { ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ProgressLogStatus,
  VendorBonusStatus,
  VendorPaymentStatus,
  VendorProjectStatus,
  WorkPlanStatus,
} from "../types";

type StatusLabel =
  | VendorProjectStatus
  | VendorBonusStatus
  | VendorPaymentStatus
  | ProgressLogStatus
  | WorkPlanStatus
  | "Aktif"
  | "Selesai"
  | "Butuh Perhatian"
  | "Tersedia"
  | "Belum Tersedia";

export function VendorPageHeading({
  eyebrow = "Vendor Panel",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(49,51,44,0.03)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            {eyebrow}
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

export function VendorSectionCard({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(49,51,44,0.03)] sm:p-6 ${className}`}
    >
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="font-serif text-[28px] leading-tight text-[#31332C] sm:text-[32px]">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-1 max-w-[720px] text-[13px] leading-6 text-[#7B756E]">
                {description}
              </p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
}

export function VendorInfoCard({
  icon: Icon,
  label,
  value,
  description,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-[0_8px_28px_rgba(49,51,44,0.03)] sm:p-5 ${
        highlight
          ? "border-[#D9C8BA] bg-[#FFFDF9]"
          : "border-[#E8E2D9] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={17} />
        </div>

        <p className="font-serif text-[34px] leading-none text-[#31332C]">
          {value}
        </p>
      </div>

      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
        {label}
      </p>

      {description ? (
        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function VendorStatusBadge({ status }: { status: StatusLabel | string }) {
  const statusStyle = getStatusStyle(status);

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyle}`}
    >
      {status}
    </span>
  );
}

export function VendorProgressBar({
  value,
  label = "Progress",
}: {
  value: number;
  label?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[#7B756E]">{label}</span>
        <span className="font-semibold text-[#31332C]">{value}%</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EFE8DF]">
        <div
          className="h-full rounded-full bg-[#725F54] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function VendorActionButton({
  icon: Icon,
  label,
  onClick,
  href,
  primary = false,
  disabled = false,
}: {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
}) {
  const className = `inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
    primary
      ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
      : "border border-[#E4D8CD] bg-white text-[#725F54] hover:bg-[#FCFBF9]"
  } disabled:cursor-not-allowed disabled:opacity-50`;

  if (href) {
    return (
      <a href={href} className={className}>
        {Icon ? <Icon size={14} /> : null}
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {Icon ? <Icon size={14} /> : null}
      {label}
    </button>
  );
}

export function VendorDetailRow({
  label,
  value,
  description,
  highlight = false,
}: {
  label: string;
  value: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-[#D9C8BA] bg-[#FFFDF9]"
          : "border-[#EFE7DD] bg-[#FCFBF9]"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-2 text-[13px] font-semibold leading-6 text-[#31332C]">
        {value}
      </p>

      {description ? (
        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function VendorListRow({
  icon: Icon,
  title,
  description,
  meta,
  status,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  meta?: string;
  status?: string;
  action?: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#D9C8BA] hover:bg-[#FFFDF9]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          {Icon ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
              <Icon size={17} />
            </div>
          ) : null}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {status ? <VendorStatusBadge status={status} /> : null}
              {meta ? (
                <span className="text-[12px] text-[#7B756E]">{meta}</span>
              ) : null}
            </div>

            <h3 className="mt-2 text-[14px] font-semibold leading-6 text-[#31332C]">
              {title}
            </h3>

            {description ? (
              <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </article>
  );
}

export function VendorEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-dashed border-[#D9C8BA] bg-white p-8 text-center">
      {Icon ? (
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={22} />
        </div>
      ) : null}

      <h3 className="mt-4 text-[15px] font-semibold text-[#31332C]">
        {title}
      </h3>

      {description ? (
        <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-6 text-[#7B756E]">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}

export function VendorModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <section className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-[#E4D8CD] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:max-w-[620px] sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-[30px] leading-tight text-[#31332C]">
              {title}
            </h2>

            {description ? (
              <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#7B756E] transition hover:bg-[#FCFBF9] hover:text-[#31332C]"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}

export function VendorModalActions({
  onClose,
  onSubmit,
  submitLabel,
}: {
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        Batal
      </button>

      <button
        type="button"
        onClick={onSubmit}
        className="h-11 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
      >
        {submitLabel}
      </button>
    </div>
  );
}

export function VendorField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-[#725F54]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function VendorChecklistItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
          completed ? "bg-[#725F54] text-white" : "bg-white text-[#B5AAA0]"
        }`}
      >
        <CheckCircle2 size={14} />
      </span>

      <p className="text-[13px] font-medium leading-5 text-[#31332C]">
        {label}
      </p>
    </div>
  );
}

export function VendorMockPhoto({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-center">
      <div>
        <p className="text-[12px] font-semibold text-[#31332C]">{label}</p>
        <p className="mt-1 text-[11px] text-[#7B756E]">
          Mock foto progress
        </p>
      </div>
    </div>
  );
}

export const vendorFieldClass =
  "h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]";

export const vendorTextareaClass =
  "w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-4 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54]";

function getStatusStyle(status: string) {
  if (
    status === "Sedang Dikerjakan" ||
    status === "Sesuai Jadwal" ||
    status === "Berpotensi Aktif" ||
    status === "Sudah Dibaca" ||
    status === "Aktif"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    status === "Menunggu Brief" ||
    status === "Menunggu Milestone" ||
    status === "Menunggu QC" ||
    status === "Belum Dibaca" ||
    status === "Belum Tersedia"
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    status === "Butuh Update" ||
    status === "Ada Kendala" ||
    status === "Butuh Diskusi" ||
    status === "Ditahan Sementara" ||
    status === "Belum Memenuhi Syarat"
  ) {
    return "bg-red-50 text-red-700";
  }

  if (
    status === "Selesai" ||
    status === "Bonus Aktif" ||
    status === "Dibayarkan" ||
    status === "Sudah Dibayarkan" ||
    status === "Tersedia" ||
    status === "Disetujui"
  ) {
    return "bg-[#FCFBF9] text-[#725F54]";
  }

  if (status === "Diproses" || status === "Tidak Ada Pekerjaan Hari Ini") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-[#FCFBF9] text-[#725F54]";
}