import type { LucideIcon } from "lucide-react";

export function AdminSectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-[24px] leading-tight text-[#31332C]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const style =
    status === "Aktif"
      ? "border-[#D8C7B6] bg-[#FCFBF9] text-[#725F54]"
      : status === "Prioritas" || status === "Butuh Review" || status === "Baru"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

export function AdminIconBadge({
  icon: Icon,
  tone = "default",
}: {
  icon: LucideIcon;
  tone?: "default" | "attention" | "success";
}) {
  const style =
    tone === "attention"
      ? "bg-[#FFF8ED] text-[#8A5A24] ring-[#E8D6BE]"
      : tone === "success"
        ? "bg-[#F5FAF6] text-[#4F7A5F] ring-[#DCEBDD]"
        : "bg-[#FCFBF9] text-[#725F54] ring-[#E8E2D9]";

  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${style}`}
    >
      <Icon size={18} />
    </div>
  );
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-[#725F54]">
        <Icon size={22} />
      </div>

      <p className="mt-4 text-[14px] font-semibold text-[#31332C]">{title}</p>

      <p className="mx-auto mt-1 max-w-[320px] text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}