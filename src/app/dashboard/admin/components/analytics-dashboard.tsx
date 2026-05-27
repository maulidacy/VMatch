"use client";

import { BarChart3, DollarSign, TrendingUp, Users2, Clock, Star } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", value: 85000000 },
  { month: "Feb", value: 120000000 },
  { month: "Mar", value: 95000000 },
  { month: "Apr", value: 145000000 },
  { month: "Mei", value: 180000000 },
];

const projectStats = {
  totalProjects: 24,
  completedProjects: 18,
  avgDuration: "45 hari",
  conversionRate: "72%",
  avgProjectValue: "Rp87.5 jt",
  totalRevenue: "Rp625 jt",
};

const vendorPerformance = [
  { name: "Aruna Woodwork", projects: 8, onTime: 7, rating: 4.8, revenue: "Rp245 jt" },
  { name: "Linea Interior", projects: 6, onTime: 6, rating: 4.9, revenue: "Rp198 jt" },
  { name: "Karya Panel Studio", projects: 5, onTime: 4, rating: 4.7, revenue: "Rp142 jt" },
];

const topMaterials = [
  { name: "HPL Walnut W-2204", orders: 14, totalSpend: "Rp6.7 jt" },
  { name: "Multiplex 18mm", orders: 12, totalSpend: "Rp4.5 jt" },
  { name: "Engsel Blum Clip-top", orders: 10, totalSpend: "Rp1.8 jt" },
  { name: "Quartz Countertop", orders: 6, totalSpend: "Rp13.2 jt" },
  { name: "LED Strip 12V", orders: 8, totalSpend: "Rp1.2 jt" },
];

export function AnalyticsDashboard() {
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Analytics</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Performa bisnis VMatch dalam angka.</p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard icon={DollarSign} label="Total Revenue (2026)" value={projectStats.totalRevenue} change="+23% vs 2025" positive />
        <MetricCard icon={BarChart3} label="Rata-rata Nilai Proyek" value={projectStats.avgProjectValue} change="+12% vs Q1" positive />
        <MetricCard icon={TrendingUp} label="Conversion Rate" value={projectStats.conversionRate} change="Request → Deal" />
        <MetricCard icon={Users2} label="Total Proyek" value={String(projectStats.totalProjects)} change={`${projectStats.completedProjects} selesai`} />
        <MetricCard icon={Clock} label="Rata-rata Durasi" value={projectStats.avgDuration} change="Request → Selesai" />
        <MetricCard icon={Star} label="Rating Rata-rata" value="4.8/5" change="Dari 18 review" positive />
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[15px] font-semibold text-[#3D3530]">Revenue Bulanan (2026)</h3>
        <div className="mt-4 flex items-end gap-3 h-[160px]">
          {monthlyRevenue.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] font-medium text-[#3D3530]">Rp{(m.value / 1000000).toFixed(0)}jt</span>
              <div className="w-full rounded-t-md bg-[#6B5B52] transition-all" style={{ height: `${(m.value / maxRevenue) * 120}px` }} />
              <span className="text-[11px] text-[#8B8179]">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor performance */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[15px] font-semibold text-[#3D3530]">Performa Vendor</h3>
        <div className="mt-3 space-y-2">
          {vendorPerformance.map((v) => (
            <div key={v.name} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-4 py-3">
              <div>
                <p className="text-[13px] font-semibold text-[#3D3530]">{v.name}</p>
                <p className="text-[11px] text-[#8B8179]">{v.projects} proyek · {v.onTime}/{v.projects} on-time · ⭐ {v.rating}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-medium text-[#3D3530]">{v.revenue}</p>
                <div className="mt-0.5 h-1.5 w-16 rounded-full bg-[#EDE8E1]">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(v.onTime / v.projects) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top materials */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[15px] font-semibold text-[#3D3530]">Material Paling Sering Dipakai</h3>
        <div className="mt-3 space-y-2">
          {topMaterials.map((m, i) => (
            <div key={m.name} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#6B5B52] text-[10px] font-bold text-white">{i + 1}</span>
                <p className="text-[13px] font-medium text-[#3D3530]">{m.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-[#3D3530]">{m.totalSpend}</p>
                <p className="text-[11px] text-[#8B8179]">{m.orders}x order</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, change, positive }: { icon: typeof DollarSign; label: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><Icon size={16} /></div>
        <p className="text-[12px] font-medium text-[#8B8179]">{label}</p>
      </div>
      <p className="mt-2.5 text-[24px] font-semibold leading-none text-[#3D3530]">{value}</p>
      <p className={`mt-1.5 text-[11px] font-medium ${positive ? "text-emerald-600" : "text-[#6B5B52]"}`}>{change}</p>
    </div>
  );
}
