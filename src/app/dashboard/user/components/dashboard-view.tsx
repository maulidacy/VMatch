"use client";

import { CalendarDays, ChevronRight, FileText, FolderOpen, Plus } from "lucide-react";
import { invoices, meetings, projects } from "../mock-data";
import type { PageId } from "../types";
import { QuickCard, StatusPill } from "./shared";

export function DashboardView({
  onChangePage,
}: {
  onChangePage: (page: PageId) => void;
}) {
  const activeProjects = projects.filter((p) => p.stage !== "done");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const nextMeeting = meetings.find((m) => m.status === "confirmed" || m.status === "requested");
  const mainProject = activeProjects[0];

  return (
    <div className="space-y-7">
      <section className="pb-2">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B8179]">
              VMatch Customer
            </p>

            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#3D3530] sm:text-[42px]">
              Selamat datang
            </h1>

            <p className="mt-2 max-w-[680px] text-[14px] leading-7 text-[#7A7067]">
              Pantau request, konsultasi, pembayaran, progress proyek, dan langkah
              berikutnya dalam satu dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChangePage("ajukan")}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[#6B5B52] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
          >
            <Plus size={16} />
            Ajukan Proyek Baru
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <QuickCard icon={FolderOpen} label="Proyek Aktif" value={String(activeProjects.length)} onClick={() => onChangePage("proyek")} />
        <QuickCard icon={CalendarDays} label="Konsultasi" value={String(meetings.length)} onClick={() => onChangePage("konsultasi")} />
        <QuickCard icon={FileText} label="Invoice Pending" value={String(pendingInvoices.length)} onClick={() => onChangePage("proyek")} />
        <QuickCard icon={Plus} label="Proyek Baru" value="Ajukan" onClick={() => onChangePage("ajukan")} accent />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B8179]">
                Langkah Berikutnya
              </p>

              <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#3D3530]">
                Review progress proyek
              </h2>
            </div>

            <StatusPill status="Prioritas" />
          </div>

          <p className="mt-3 text-[14px] leading-7 text-[#7A7067]">
            Proyek <span className="font-semibold text-[#3D3530]">Kitchen Set Walnut</span> sedang berada di tahap produksi.
            Kamu bisa melihat update progress, dokumen terbaru, dan status pembayaran dari halaman Proyek Saya.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChangePage("proyek")}
              className="h-11 rounded-xl bg-[#3D3530] px-4 text-[12px] font-semibold text-white transition hover:bg-[#2C2C2C]"
            >
              Lihat Proyek Saya
            </button>

            <button
              type="button"
              onClick={() => onChangePage("konsultasi")}
              className="h-11 rounded-xl border border-[#D4C9BD] px-4 text-[12px] font-semibold text-[#6B5B52] transition hover:bg-[#F5F0EA]"
            >
              Jadwalkan Konsultasi
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          <InfoMiniCard
            icon={FileText}
            title="Status pembayaran"
            text={
              pendingInvoices.length > 0
                ? `${pendingInvoices.length} invoice masih menunggu pembayaran.`
                : "Semua pembayaran saat ini sudah aman."
            }
          />

          <InfoMiniCard
            icon={CalendarDays}
            title="Konsultasi terdekat"
            text={
              nextMeeting
                ? `${nextMeeting.projectName || "Konsultasi Umum"} • ${nextMeeting.date}, ${nextMeeting.time}`
                : "Belum ada jadwal konsultasi aktif."
            }
          />
        </div>
      </section>

      {mainProject && (
        <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B8179]">
                Ringkasan Proyek Aktif
              </p>

              <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#3D3530]">
                {mainProject.name}
              </h2>

              <p className="mt-1 text-[13px] text-[#8B8179]">
                {mainProject.type} • {mainProject.location}
              </p>
            </div>

            <StatusPill status={mainProject.stageLabel} />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#7A7067]">Progress proyek</span>
              <span className="font-semibold text-[#3D3530]">{mainProject.progress}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDE8E1]">
              <div className="h-full rounded-full bg-[#6B5B52]" style={{ width: `${mainProject.progress}%` }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangePage("proyek")}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D4C9BD] px-4 text-[12px] font-semibold text-[#6B5B52] transition hover:bg-[#F5F0EA]"
          >
            Lihat detail proyek
            <ChevronRight size={14} />
          </button>
        </section>
      )}
    </div>
  );
}

function InfoMiniCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof FileText;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F5F0EA] text-[#6B5B52]">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#3D3530]">{title}</p>
          <p className="mt-1 text-[13px] leading-6 text-[#7A7067]">{text}</p>
        </div>
      </div>
    </div>
  );
}