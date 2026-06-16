import type { LucideIcon } from "lucide-react";
import type { Meeting } from "../types";

export const fieldClass =
  "h-11 w-full rounded-xl border border-[#E8E2D9] bg-[#F8F6F2] px-4 text-[13px] text-[#3D3530] outline-none transition focus:border-[#6B5B52]";

export const textareaClass =
  "w-full rounded-xl border border-[#E8E2D9] bg-[#F8F6F2] p-4 text-[13px] text-[#3D3530] outline-none transition focus:border-[#6B5B52]";

export function QuickCard({
  icon: Icon,
  label,
  value,
  onClick,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-4 text-center transition-all duration-300 active:scale-[0.98] sm:p-5 ${
        accent
          ? "border-[#6B5B52] bg-[#6B5B52] text-white hover:bg-[#5A4A42]"
          : "border-[#E8E2D9] bg-white hover:border-[#D4C9BD] hover:shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="flex min-h-[128px] flex-col items-center justify-center sm:min-h-[138px]">
        <div
          className={`grid h-11 w-11 place-items-center rounded-2xl transition duration-300 group-hover:-translate-y-1 ${
            accent ? "bg-white/15 text-white" : "bg-[#F5F0EA] text-[#6B5B52]"
          }`}
        >
          <Icon size={18} />
        </div>

        <p
          className={`mt-4 font-serif text-[30px] leading-none sm:text-[34px] ${
            accent ? "text-white" : "text-[#3D3530]"
          }`}
        >
          {value}
        </p>

        <p
          className={`mt-2 text-[12px] font-medium leading-5 sm:text-[13px] ${
            accent ? "text-white/80" : "text-[#8B8179]"
          }`}
        >
          {label}
        </p>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-4 bottom-3 h-px scale-x-0 transition duration-300 group-hover:scale-x-100 ${
          accent ? "bg-white/25" : "bg-[#6B5B52]/25"
        }`}
      />
    </button>
  );
}

export function StatusPill({ status }: { status: string }) {
  const color =
    status.includes("Selesai") || status.includes("Lunas")
      ? "bg-emerald-50 text-emerald-700"
      : status.includes("Menunggu") || status.includes("Request")
        ? "bg-amber-50 text-amber-700"
        : "bg-[#F5F0EA] text-[#6B5B52]";

  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>
      {status}
    </span>
  );
}

export function MeetingStatusPill({ status }: { status: Meeting["status"] }) {
  const map = {
    requested: { label: "Menunggu Konfirmasi", color: "bg-amber-50 text-amber-700" },
    confirmed: { label: "Dikonfirmasi", color: "bg-emerald-50 text-emerald-700" },
    done: { label: "Selesai", color: "bg-[#F0EBE4] text-[#6B5B52]" },
    cancelled: { label: "Dibatalkan", color: "bg-red-50 text-red-700" },
  };

  const item = map[status];

  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.color}`}>
      {item.label}
    </span>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-medium text-[#6B5B52]">{label}</span>
      {children}
    </label>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)] sm:p-6">
      <h2 className="text-[16px] font-semibold text-[#3D3530]">{title}</h2>
      {description && <p className="mt-1 text-[13px] leading-6 text-[#7A7067]">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}