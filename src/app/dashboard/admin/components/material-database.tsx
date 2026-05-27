"use client";

import { ChevronRight, Package, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

type Material = {
  id: string;
  name: string;
  code: string;
  supplier: string;
  price: number;
  unit: string;
  leadTime: string;
  category: string;
  priceHistory: { date: string; price: number }[];
};

type Supplier = {
  id: string;
  name: string;
  contact: string;
  specialization: string;
  rating: number;
  totalOrders: number;
  location: string;
};

const materials: Material[] = [
  { id: "1", name: "HPL Walnut W-2204", code: "HPL-W2204", supplier: "PT Taco Laminasi", price: 480000, unit: "lembar", leadTime: "3-5 hari", category: "HPL", priceHistory: [{ date: "Jan 2026", price: 450000 }, { date: "Mar 2026", price: 460000 }, { date: "Mei 2026", price: 480000 }] },
  { id: "2", name: "HPL Putih Doff", code: "HPL-PD01", supplier: "PT Taco Laminasi", price: 420000, unit: "lembar", leadTime: "3-5 hari", category: "HPL", priceHistory: [{ date: "Jan 2026", price: 400000 }, { date: "Mar 2026", price: 410000 }, { date: "Mei 2026", price: 420000 }] },
  { id: "3", name: "Multiplex 18mm", code: "MP-18", supplier: "CV Kayu Jaya", price: 380000, unit: "lembar", leadTime: "1-2 hari", category: "Kayu", priceHistory: [{ date: "Jan 2026", price: 360000 }, { date: "Mar 2026", price: 370000 }, { date: "Mei 2026", price: 380000 }] },
  { id: "4", name: "Quartz Countertop (Putih)", code: "QZ-W01", supplier: "PT Stone Indo", price: 2200000, unit: "meter", leadTime: "7-10 hari", category: "Countertop", priceHistory: [{ date: "Jan 2026", price: 2100000 }, { date: "Mar 2026", price: 2150000 }, { date: "Mei 2026", price: 2200000 }] },
  { id: "5", name: "Engsel Blum Clip-top", code: "HW-BL01", supplier: "PT Hardware Indo", price: 185000, unit: "pcs", leadTime: "5-7 hari", category: "Hardware", priceHistory: [{ date: "Jan 2026", price: 180000 }, { date: "Mar 2026", price: 185000 }, { date: "Mei 2026", price: 185000 }] },
  { id: "6", name: "Rel Laci Tandem Blum", code: "HW-BL02", supplier: "PT Hardware Indo", price: 450000, unit: "set", leadTime: "5-7 hari", category: "Hardware", priceHistory: [{ date: "Jan 2026", price: 430000 }, { date: "Mar 2026", price: 440000 }, { date: "Mei 2026", price: 450000 }] },
  { id: "7", name: "LED Strip 12V (Warm)", code: "LED-W12", supplier: "Toko Listrik Jaya", price: 150000, unit: "meter", leadTime: "1-2 hari", category: "Elektrikal", priceHistory: [{ date: "Jan 2026", price: 155000 }, { date: "Mar 2026", price: 150000 }, { date: "Mei 2026", price: 150000 }] },
  { id: "8", name: "Sliding Door Rail System", code: "SD-RS01", supplier: "PT Hardware Indo", price: 4800000, unit: "set", leadTime: "7-14 hari", category: "Hardware", priceHistory: [{ date: "Jan 2026", price: 4500000 }, { date: "Mar 2026", price: 4600000 }, { date: "Mei 2026", price: 4800000 }] },
];

const suppliers: Supplier[] = [
  { id: "1", name: "PT Taco Laminasi", contact: "021-5551234", specialization: "HPL, Veneer, Edging", rating: 4.8, totalOrders: 45, location: "Jakarta" },
  { id: "2", name: "CV Kayu Jaya", contact: "024-7771234", specialization: "Multiplex, MDF, Blockboard", rating: 4.6, totalOrders: 38, location: "Semarang" },
  { id: "3", name: "PT Stone Indo", contact: "021-5559876", specialization: "Granit, Quartz, Marble", rating: 4.7, totalOrders: 12, location: "Jakarta" },
  { id: "4", name: "PT Hardware Indo", contact: "031-8881234", specialization: "Engsel, Rel, Handle, Fitting", rating: 4.9, totalOrders: 52, location: "Surabaya" },
  { id: "5", name: "Toko Listrik Jaya", contact: "024-6661234", specialization: "LED, Kabel, Switch", rating: 4.5, totalOrders: 20, location: "Semarang" },
];

export function MaterialDatabase() {
  const [activeTab, setActiveTab] = useState<"material" | "supplier">("material");
  const [search, setSearch] = useState("");

  const filteredMaterials = materials.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Material & Supplier</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Database material dan supplier internal VMatch.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[#F0EBE4] p-1">
        <button onClick={() => setActiveTab("material")} className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeTab === "material" ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067]"}`}>Material ({materials.length})</button>
        <button onClick={() => setActiveTab("supplier")} className={`flex-1 rounded-md px-3 py-2 text-[12px] font-medium transition-all ${activeTab === "supplier" ? "bg-white text-[#3D3530] shadow-sm" : "text-[#7A7067]"}`}>Supplier ({suppliers.length})</button>
      </div>

      {activeTab === "material" && (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8179]" />
              <input className="field-control pl-9" placeholder="Cari material..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="flex h-[38px] items-center gap-1.5 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white"><Plus size={13} /> Tambah</button>
          </div>
          <div className="space-y-2">
            {filteredMaterials.map((m) => {
              const lastPrice = m.priceHistory[m.priceHistory.length - 2]?.price ?? m.price;
              const priceChange = m.price - lastPrice;
              return (
                <div key={m.id} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><Package size={16} /></div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#3D3530]">{m.name}</p>
                        <p className="text-[11px] text-[#8B8179]">{m.code} · {m.supplier} · Lead time: {m.leadTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-[#3D3530]">Rp{m.price.toLocaleString("id-ID")}/{m.unit}</p>
                      {priceChange !== 0 && (
                        <p className={`flex items-center justify-end gap-0.5 text-[11px] ${priceChange > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          {priceChange > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {priceChange > 0 ? "+" : ""}Rp{priceChange.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "supplier" && (
        <div className="space-y-2.5">
          {suppliers.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#E8E2D9] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{s.name}</p>
                  <p className="text-[12px] text-[#8B8179]">{s.specialization} · {s.location} · {s.contact}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium text-[#3D3530]">⭐ {s.rating}</p>
                  <p className="text-[11px] text-[#8B8179]">{s.totalOrders} order</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
