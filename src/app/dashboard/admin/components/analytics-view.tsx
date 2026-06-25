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
import { useCallback, useEffect, useMemo, useState } from "react";
import { getConsultations } from "@/lib/api/consultations";
import { getInvoices, getProjectRequests, getProjects } from "@/lib/api/projects";
import { getCustomers, getVendors } from "@/lib/api/profiles";

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

type InsightItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const periodOptions: PeriodFilter[] = ["7 Hari", "30 Hari", "3 Bulan", "1 Tahun"];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatRupiah(value: number): string {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(0)} Jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)} Rb`;
  return `Rp${value}`;
}

function parseAmount(val?: string | null): number {
  return Number((val ?? "").replace(/[^\d]/g, "") || "0");
}

export function AnalyticsView() {
  const [period, setPeriod] = useState<PeriodFilter>("30 Hari");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<ProjectData[]>([]);
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryData[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [vendorPerf, setVendorPerf] = useState<VendorPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    revenue: "Rp0",
    requests: "0",
    customers: "0",
    conversion: "0%",
  });

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requests, projects, customers, consultations, invoices, vendors] = await Promise.all([
        getProjectRequests(),
        getProjects(),
        getCustomers(),
        getConsultations(),
        getInvoices(),
        getVendors(),
      ]);

      // ── Summary Metrics ──────────────────────────────────────
      const totalRevenue = invoices.reduce((sum, inv) => sum + parseAmount(inv.paid_amount), 0);
      const activeProjects = projects.filter((p) => p.status !== "Selesai").length;
      const finishedProjects = projects.filter((p) => p.status === "Selesai").length;
      const conversion = requests.length > 0 ? Math.round((projects.length / requests.length) * 100) : 0;

      setSummary({
        revenue: `Rp${new Intl.NumberFormat("id-ID").format(totalRevenue)}`,
        requests: String(requests.length),
        customers: String(customers.length),
        conversion: `${conversion}%`,
      });

      // ── Project Status ─────────────────────────────────────────
      setProjectStatusData([
        { label: "Request Baru", value: requests.length, total: Math.max(requests.length, 1) },
        { label: "Konsultasi", value: consultations.length, total: Math.max(requests.length, consultations.length, 1) },
        { label: "Proyek Aktif", value: activeProjects, total: Math.max(projects.length, 1) },
        { label: "QC & Selesai", value: finishedProjects, total: Math.max(projects.length, 1) },
      ]);

      // ── Revenue per Bulan (6 bulan terakhir dari invoices nyata) ──
      const now = new Date();
      const monthBuckets: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthBuckets[key] = 0;
      }

      for (const inv of invoices) {
        const dateStr = inv.paid_at || inv.issued_at;
        if (!dateStr) continue;
        const d = new Date(dateStr);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in monthBuckets) {
          monthBuckets[key] += parseAmount(inv.paid_amount);
        }
      }

      const revData: RevenueData[] = Object.entries(monthBuckets).map(([key, val]) => {
        const [year, monthIndex] = key.split("-").map(Number);
        return {
          month: MONTH_LABELS[monthIndex],
          revenue: val,
          label: formatRupiah(val),
        };
      });
      setRevenueData(revData);

      // ── Customer Sumber (dari profiles.source) ─────────────────
      const sourceCount: Record<string, number> = {};
      for (const c of customers) {
        const src = c.source?.trim() || "Lainnya";
        sourceCount[src] = (sourceCount[src] || 0) + 1;
      }
      const totalSources = customers.length || 1;
      const srcData: SourceData[] = Object.entries(sourceCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([source, count]) => ({
          source,
          value: Math.round((count / totalSources) * 100),
          label: `${Math.round((count / totalSources) * 100)}%`,
        }));
      setSourceData(srcData.length > 0 ? srcData : [{ source: "Belum ada data", value: 0, label: "0%" }]);

      // ── Kategori Populer (dari project_requests.project_type) ──
      const catCount: Record<string, number> = {};
      const catRevenue: Record<string, number> = {};
      for (const r of requests) {
        const cat = r.project_type || "Lainnya";
        catCount[cat] = (catCount[cat] || 0) + 1;
      }
      // Join revenue dari invoices → projects → project_requests
      for (const inv of invoices) {
        if (!inv.project_id) continue;
        const proj = projects.find((p) => p.id === inv.project_id);
        if (!proj) continue;
        const req = requests.find((r) => r.id === proj.request_id);
        const cat = req?.project_type || proj.project_type || "Lainnya";
        catRevenue[cat] = (catRevenue[cat] || 0) + parseAmount(inv.total_amount);
      }
      const cats: CategoryData[] = Object.entries(catCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([name, count]) => ({
          name,
          requests: count,
          revenue: formatRupiah(catRevenue[name] || 0),
        }));
      setTopCategories(cats.length > 0 ? cats : [{ name: "Belum ada data", requests: 0, revenue: "Rp0" }]);

      // ── Vendor Performance (dari projects nyata) ───────────────
      const realVendorPerf = vendors.slice(0, 3).map((vendor) => {
        const vendorProjects = projects.filter((p) => p.vendor_id === vendor.id);
        const completedProjects = vendorProjects.filter((p) => p.status === "Selesai").length;
        const completionRate = vendorProjects.length > 0 ? Math.round((completedProjects / vendorProjects.length) * 100) : 0;
        return {
          name: vendor.full_name || "Vendor Partner",
          projects: completedProjects,
          completion: completionRate,
        };
      });
      setVendorPerf(realVendorPerf);

      // ── Insight Dinamis ────────────────────────────────────────
      const generatedInsights: InsightItem[] = [];

      const bestCat = cats[0];
      if (bestCat && bestCat.requests > 0) {
        generatedInsights.push({
          icon: CheckCircle2,
          title: `Kategori terlaris: ${bestCat.name}`,
          description: `${bestCat.name} memiliki ${bestCat.requests} request dengan total ${bestCat.revenue}.`,
        });
      } else {
        generatedInsights.push({
          icon: CheckCircle2,
          title: "Belum ada request",
          description: "Belum ada request proyek masuk. Mulai kampanye untuk menarik customer.",
        });
      }

      const pendingRequests = requests.filter((r) => r.status === "Baru Masuk" || r.status === "Menunggu Review").length;
      if (pendingRequests > 0) {
        generatedInsights.push({
          icon: Clock,
          title: `${pendingRequests} request perlu follow up`,
          description: `Ada ${pendingRequests} request customer yang masih menunggu konfirmasi dari admin.`,
        });
      } else {
        generatedInsights.push({
          icon: Clock,
          title: "Semua request tertangani",
          description: "Tidak ada request yang menunggu review. Kerja bagus!",
        });
      }

      const recentRevenue = revData.slice(-2).map((r) => r.revenue);
      const trendUp = recentRevenue.length >= 2 && recentRevenue[1] >= recentRevenue[0];
      generatedInsights.push({
        icon: LineChart,
        title: trendUp ? "Tren revenue naik" : "Revenue perlu diperhatikan",
        description: trendUp
          ? `Revenue bulan ini lebih tinggi dari bulan sebelumnya. Pertahankan momentum!`
          : `Revenue bulan ini perlu ditingkatkan. Cek pipeline proyek aktif.`,
      });

      setInsights(generatedInsights);
    } catch {
      setRevenueData([]);
      setProjectStatusData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const metrics = useMemo<AnalyticsMetric[]>(
    () => [
      {
        id: "revenue",
        label: "Revenue",
        value: summary.revenue,
        change: "Live",
        description: `Total pendapatan terdaftar`,
        icon: Wallet,
      },
      {
        id: "requests",
        label: "Request Proyek",
        value: summary.requests,
        change: "Live",
        description: "Pengajuan customer masuk",
        icon: BriefcaseBusiness,
      },
      {
        id: "customers",
        label: "Customer",
        value: summary.customers,
        change: "Live",
        description: "Customer terdaftar",
        icon: Users,
      },
      {
        id: "conversion",
        label: "Conversion",
        value: summary.conversion,
        change: "Live",
        description: "Request menjadi proyek aktif",
        icon: TrendingUp,
      },
    ],
    [summary],
  );

  const maxRevenue = Math.max(...revenueData.map((item) => item.revenue), 1);

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Analytics
          </h1>

          <p className="mt-2 max-w-[760px] text-[12px] leading-6 text-[#7B756E] sm:text-[13px]">
            Pantau performa VMatch dari request proyek, customer, revenue,
            konversi, kategori populer, dan performa vendor partner. Semua data real-time dari database.
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

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#725F54] border-t-transparent" />
        </div>
      ) : (
        <>
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
                      {summary.revenue}
                    </p>

                    <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
                      Total pendapatan dari seluruh invoice terbayar.
                    </p>
                  </div>
                </div>

                {revenueData.length > 0 ? (
                  <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9]">
                    <div
                      className="grid h-[220px] items-end gap-2 px-3 pb-4 pt-5 sm:h-[260px] sm:gap-3 sm:px-4"
                      style={{ gridTemplateColumns: `repeat(${revenueData.length}, minmax(0, 1fr))` }}
                    >
                      {revenueData.map((item) => {
                        const height = Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 8 : 4);

                        return (
                          <div key={item.month} className="flex min-w-0 flex-col items-center gap-2">
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
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] py-8 text-center text-[13px] text-[#9A8F86]">
                    Belum ada data revenue.
                  </p>
                )}
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Status Proyek">
              <ProgressList data={projectStatusData} />
            </AdminSectionCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <AdminSectionCard title="Sumber Customer">
              {sourceData.length > 0 && sourceData[0].source !== "Belum ada data" ? (
                <ProgressList
                  data={sourceData.map((item) => ({
                    label: item.source,
                    value: item.value,
                    total: 100,
                  }))}
                  suffix="%"
                />
              ) : (
                <p className="py-4 text-center text-[13px] text-[#9A8F86]">
                  Belum ada data sumber customer. Isi kolom &quot;source&quot; pada profil customer.
                </p>
              )}
            </AdminSectionCard>

            <AdminSectionCard title="Kategori Populer">
              {topCategories.length > 0 && topCategories[0].name !== "Belum ada data" ? (
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
              ) : (
                <p className="py-4 text-center text-[13px] text-[#9A8F86]">Belum ada request proyek.</p>
              )}
            </AdminSectionCard>

            <AdminSectionCard title="Insight Utama">
              <div className="space-y-3">
                {insights.map((item, idx) => (
                  <InsightCard key={idx} icon={item.icon} title={item.title} description={item.description} />
                ))}
              </div>
            </AdminSectionCard>
          </section>

          <AdminSectionCard title="Performa Vendor Partner">
            {vendorPerf.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-3">
                {vendorPerf.map((vendor) => (
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
            ) : (
              <p className="py-4 text-center text-[13px] text-[#9A8F86]">Belum ada vendor partner terdaftar.</p>
            )}
          </AdminSectionCard>
        </>
      )}
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
        const percent = item.total > 0 ? Math.min(Math.round((item.value / item.total) * 100), 100) : 0;

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
