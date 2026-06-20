"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock,
  LineChart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";

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

type CategoryData = {
  name: string;
  requests: number;
  revenue: string;
};

type VendorPerformance = {
  name: string;
  projects: number;
  completion: number;
};

const periodOptions: PeriodFilter[] = ["7 Hari", "30 Hari", "3 Bulan", "1 Tahun"];

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 35, label: "Rp35 Juta" },
  { month: "Feb", revenue: 42, label: "Rp42 Juta" },
  { month: "Mar", revenue: 38, label: "Rp38 Juta" },
  { month: "Apr", revenue: 56, label: "Rp56 Juta" },
  { month: "Mei", revenue: 64, label: "Rp64 Juta" },
  { month: "Jun", revenue: 72, label: "Rp72 Juta" },
];

const projectStatusData: ProjectData[] = [
  { label: "Request Baru", value: 12, total: 30 },
  { label: "Konsultasi", value: 8, total: 30 },
  { label: "Proyek Aktif", value: 7, total: 30 },
  { label: "QC & Selesai", value: 3, total: 30 },
];

const sourceData: SourceData[] = [
  { source: "Landing Page", value: 42, label: "42%" },
  { source: "Instagram", value: 28, label: "28%" },
  { source: "Referral", value: 18, label: "18%" },
  { source: "Katalog Desain", value: 12, label: "12%" },
];

const topCategories: CategoryData[] = [
  { name: "Kitchen Set", requests: 18, revenue: "Rp128 Juta" },
  { name: "Wardrobe", requests: 14, revenue: "Rp86 Juta" },
  { name: "Ruang Kerja", requests: 9, revenue: "Rp48 Juta" },
  { name: "Backdrop TV", requests: 7, revenue: "Rp41 Juta" },
];

const vendorPerformance: VendorPerformance[] = [
  { name: "Kayu Rapi Interior", projects: 18, completion: 92 },
  { name: "Studio Ruang Karya", projects: 21, completion: 96 },
  { name: "Mitra Interior Jogja", projects: 12, completion: 84 },
];

export function AnalyticsView() {
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
    <div className="space-y-5">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Analytics
          </h1>

          <p className="mt-2 max-w-[760px] text-[12px] leading-6 text-[#7B756E] sm:text-[13px]">
            Pantau performa VMatch dari request proyek, customer, revenue,
            konversi, kategori populer, dan performa vendor partner.
          </p>
        </div>

        <div className="relative sm:hidden">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as PeriodFilter)}
            className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
          >
            {periodOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
          />
        </div>

        <div className="hidden grid-cols-4 gap-1.5 rounded-2xl border border-[#E8E2D9] bg-white p-1.5 sm:grid">
          {periodOptions.map((item) => {
            const active = period === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`h-10 rounded-xl px-3 text-[12px] font-semibold transition ${active
                  ? "bg-[#725F54] text-white shadow-sm"
                  : "text-[#6F6860] hover:bg-[#F8F6F2]"
                  }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <AdminSectionCard title="Revenue Bulanan">
          <div className="space-y-5">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="font-serif text-[26px] leading-none text-[#31332C] sm:text-[28px]">
                  Rp72 Juta
                </p>

                <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
                  Revenue bulan ini naik dibanding bulan sebelumnya.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1.5 text-[12px] font-semibold text-[#4F7A5F]">
                <TrendingUp size={14} />
                +18% growth
              </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9]">
              <div className="grid h-[220px] grid-cols-6 items-end gap-2 px-3 pb-4 pt-5 sm:h-[260px] sm:gap-3 sm:px-4">
                {revenueData.map((item) => {
                  const height = Math.max((item.revenue / maxRevenue) * 100, 16);

                  return (
                    <div
                      key={item.month}
                      className="flex min-w-0 flex-col items-center gap-2"
                    >
                      <div className="flex h-[145px] w-full items-end sm:h-[180px]">
                        <div
                          className="w-full rounded-t-xl bg-[#725F54] transition hover:bg-[#5A4A42] sm:rounded-t-2xl"
                          style={{ height: `${height}%` }}
                          title={item.label}
                        />
                      </div>

                      <div className="min-w-0 text-center">
                        <p className="text-[10px] font-semibold text-[#31332C] sm:text-[11px]">
                          {item.month}
                        </p>

                        <p className="mt-0.5 hidden text-[10px] text-[#9A8F86] sm:block">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Status Proyek">
          <ProgressList data={projectStatusData} />
        </AdminSectionCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminSectionCard title="Sumber Customer">
          <ProgressList
            data={sourceData.map((item) => ({
              label: item.source,
              value: item.value,
              total: 100,
            }))}
            suffix="%"
          />
        </AdminSectionCard>

        <AdminSectionCard title="Kategori Populer">
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
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

        <AdminSectionCard title="Insight Utama">
          <div className="space-y-3">
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
          </div>
        </AdminSectionCard>
      </section>

      <AdminSectionCard title="Performa Vendor Partner">
        <div className="grid gap-3 md:grid-cols-3">
          {vendorPerformance.map((vendor) => (
            <div
              key={vendor.name}
              className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#31332C]">
                    {vendor.name}
                  </p>

                  <p className="mt-1 text-[12px] text-[#7B756E]">
                    {vendor.projects} proyek selesai
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
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
    </div>
  );
}

function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  const Icon = metric.icon;

  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={18} strokeWidth={2} />
        </div>

        <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#4F7A5F]">
          {metric.change}
        </span>
      </div>

      <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {metric.label}
      </p>

      <p className="mt-2 truncate font-serif text-[30px] leading-none text-[#31332C]">
        {metric.value}
      </p>

      <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {metric.description}
      </p>
    </div>
  );
}

function ProgressList({
  data,
  suffix,
}: {
  data: ProjectData[];
  suffix?: string;
}) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percent = Math.round((item.value / item.total) * 100);

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-[13px] font-semibold text-[#31332C]">
                {item.label}
              </p>

              <p className="shrink-0 text-[12px] font-semibold text-[#725F54]">
                {suffix ? `${item.value}${suffix}` : item.value}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
              <div
                className="h-full rounded-full bg-[#725F54]"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="mt-2 text-[11px] text-[#7B756E]">
              {percent}% dari total data.
            </p>
          </div>
        );
      })}
    </div>
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
      <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
        <Icon size={17} />
      </div>

      <p className="mt-3 text-[13px] font-semibold text-[#31332C]">{title}</p>

      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}
