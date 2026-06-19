"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  CreditCard,
  LineChart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type PeriodFilter = "7 Hari" | "30 Hari" | "3 Bulan" | "1 Tahun";

type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  description: string;
  icon: LucideIcon;
};

type RevenueData = {
  month: string;
  revenue: number;
  label: string;
};

type ProjectData = {
  label: string;
  value: number;
  total: number;
};

type SourceData = {
  source: string;
  value: number;
  label: string;
};

const periodOptions: PeriodFilter[] = ["7 Hari", "30 Hari", "3 Bulan", "1 Tahun"];

const revenueData: RevenueData[] = [
  {
    month: "Jan",
    revenue: 35,
    label: "Rp35 Juta",
  },
  {
    month: "Feb",
    revenue: 42,
    label: "Rp42 Juta",
  },
  {
    month: "Mar",
    revenue: 38,
    label: "Rp38 Juta",
  },
  {
    month: "Apr",
    revenue: 56,
    label: "Rp56 Juta",
  },
  {
    month: "Mei",
    revenue: 64,
    label: "Rp64 Juta",
  },
  {
    month: "Jun",
    revenue: 72,
    label: "Rp72 Juta",
  },
];

const projectStatusData: ProjectData[] = [
  {
    label: "Request Baru",
    value: 12,
    total: 30,
  },
  {
    label: "Konsultasi",
    value: 8,
    total: 30,
  },
  {
    label: "Proyek Aktif",
    value: 7,
    total: 30,
  },
  {
    label: "QC & Selesai",
    value: 3,
    total: 30,
  },
];

const sourceData: SourceData[] = [
  {
    source: "Landing Page",
    value: 42,
    label: "42%",
  },
  {
    source: "Instagram",
    value: 28,
    label: "28%",
  },
  {
    source: "Referral",
    value: 18,
    label: "18%",
  },
  {
    source: "Katalog Desain",
    value: 12,
    label: "12%",
  },
];

const topCategories = [
  {
    name: "Kitchen Set",
    requests: 18,
    revenue: "Rp128 Juta",
  },
  {
    name: "Wardrobe",
    requests: 14,
    revenue: "Rp86 Juta",
  },
  {
    name: "Ruang Kerja",
    requests: 9,
    revenue: "Rp48 Juta",
  },
  {
    name: "Backdrop TV",
    requests: 7,
    revenue: "Rp41 Juta",
  },
];

const vendorPerformance = [
  {
    name: "Kayu Rapi Interior",
    projects: 18,
    rating: "4.8",
    completion: 92,
  },
  {
    name: "Studio Ruang Karya",
    projects: 21,
    rating: "4.9",
    completion: 96,
  },
  {
    name: "Mitra Interior Jogja",
    projects: 12,
    rating: "4.6",
    completion: 84,
  },
];

export function AnalyticsView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [period, setPeriod] = useState<PeriodFilter>("30 Hari");

  const metrics = useMemo<AnalyticsMetric[]>(
    () => [
      {
        id: "revenue",
        label: "Revenue",
        value: "Rp72 Juta",
        change: "+18%",
        description: `Pendapatan dalam ${period.toLowerCase()}`,
        icon: Wallet,
      },
      {
        id: "requests",
        label: "Request Proyek",
        value: "30",
        change: "+12%",
        description: "Pengajuan customer masuk",
        icon: BriefcaseBusiness,
      },
      {
        id: "customers",
        label: "Customer Baru",
        value: "24",
        change: "+9%",
        description: "Customer baru terdaftar",
        icon: Users,
      },
      {
        id: "conversion",
        label: "Conversion",
        value: "38%",
        change: "+5%",
        description: "Request menjadi proyek aktif",
        icon: TrendingUp,
      },
    ],
    [period],
  );

  const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Insight Bisnis
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Analytics
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Pantau performa VMatch dari sisi request proyek, customer,
            revenue, konversi, kategori populer, dan performa vendor partner.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-[#E8E2D9] bg-white p-2">
          {periodOptions.map((item) => {
            const active = period === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`h-10 rounded-xl px-3 text-[11px] font-semibold transition sm:text-[12px] ${
                  active
                    ? "bg-[#725F54] text-white"
                    : "text-[#6F6860] hover:bg-[#F8F6F2]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <AdminSectionCard title="Revenue Bulanan">
          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[26px] font-serif leading-none text-[#31332C]">
                  Rp72 Juta
                </p>

                <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
                  Revenue bulan ini naik dibanding bulan sebelumnya.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1.5 text-[12px] font-semibold text-[#4F7A5F]">
                <TrendingUp size={14} />
                +18% growth
              </div>
            </div>

            <div className="flex h-[260px] items-end gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 pb-4 pt-6">
              {revenueData.map((item) => {
                const height = Math.max((item.revenue / maxRevenue) * 100, 16);

                return (
                  <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-[190px] w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-[#725F54]"
                        style={{ height: `${height}%` }}
                        title={item.label}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-[#31332C]">
                        {item.month}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9A8F86]">
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Status Proyek">
          <div className="space-y-4">
            {projectStatusData.map((item) => {
              const percent = Math.round((item.value / item.total) * 100);

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-[#31332C]">
                      {item.label}
                    </p>

                    <p className="text-[12px] font-semibold text-[#725F54]">
                      {item.value}
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                    <div
                      className="h-full rounded-full bg-[#725F54]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-[#7B756E]">
                    {percent}% dari total pipeline proyek.
                  </p>
                </div>
              );
            })}
          </div>
        </AdminSectionCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminSectionCard title="Sumber Customer">
          <div className="space-y-3">
            {sourceData.map((item) => (
              <div
                key={item.source}
                className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-[#31332C]">
                    {item.source}
                  </p>

                  <p className="text-[12px] font-semibold text-[#725F54]">
                    {item.label}
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div
                    className="h-full rounded-full bg-[#725F54]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Kategori Populer">
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[12px] font-semibold text-[#725F54] ring-1 ring-[#E8E2D9]">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#31332C]">
                    {category.name}
                  </p>

                  <p className="mt-1 text-[11px] text-[#7B756E]">
                    {category.requests} request proyek
                  </p>
                </div>

                <p className="shrink-0 text-right text-[12px] font-semibold text-[#725F54]">
                  {category.revenue}
                </p>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Quick Action">
          <div className="space-y-3">
            <QuickActionButton
              icon={BriefcaseBusiness}
              title="Lihat Request"
              description="Cek pipeline request proyek."
              onClick={() => onChangePage?.("requests")}
            />

            <QuickActionButton
              icon={Users}
              title="Lihat Customer"
              description="Pantau customer dan follow up."
              onClick={() => onChangePage?.("customers")}
            />

            <QuickActionButton
              icon={CreditCard}
              title="Lihat Pembayaran"
              description="Cek invoice dan status pembayaran."
              onClick={() => onChangePage?.("payments")}
            />
          </div>
        </AdminSectionCard>
      </section>

      <AdminSectionCard title="Performa Vendor Partner">
        <div className="grid gap-3 md:grid-cols-3">
          {vendorPerformance.map((vendor) => (
            <div
              key={vendor.name}
              className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#31332C]">
                    {vendor.name}
                  </p>

                  <p className="mt-1 text-[12px] text-[#7B756E]">
                    {vendor.projects} proyek selesai
                  </p>
                </div>

                <div className="rounded-full border border-[#D9C8BA] bg-white px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                  {vendor.rating}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-medium text-[#7B756E]">
                    Completion Rate
                  </p>

                  <p className="text-[11px] font-semibold text-[#725F54]">
                    {vendor.completion}%
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div
                    className="h-full rounded-full bg-[#725F54]"
                    style={{ width: `${vendor.completion}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 lg:grid-cols-3">
        <InsightCard
          icon={CheckCircle2}
          title="Kategori terbaik"
          description="Kitchen Set menjadi kategori dengan revenue tertinggi bulan ini."
        />

        <InsightCard
          icon={Clock}
          title="Perlu follow up"
          description="Beberapa request masih berada pada tahap konsultasi dan perlu dikonfirmasi admin."
        />

        <InsightCard
          icon={LineChart}
          title="Growth stabil"
          description="Revenue dan request proyek menunjukkan tren naik dalam beberapa bulan terakhir."
        />
      </section>
    </div>
  );
}

function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  const Icon = metric.icon;

  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={18} strokeWidth={2} />
        </div>

        <span className="rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#4F7A5F]">
          {metric.change}
        </span>
      </div>

      <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {metric.label}
      </p>

      <p className="mt-2 font-serif text-[30px] leading-none text-[#31332C]">
        {metric.value}
      </p>

      <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {metric.description}
      </p>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      </div>

      <ArrowRight className="ml-auto shrink-0 text-[#9A8F86]" size={14} />
    </button>
  );
}

function InsightCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
        <Icon size={18} />
      </div>

      <p className="mt-4 text-[14px] font-semibold text-[#31332C]">{title}</p>

      <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}