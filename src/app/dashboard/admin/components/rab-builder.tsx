"use client";

import { Calculator, ChevronRight, FileText, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type RabItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
  markup: number;
};

type RabTemplate = {
  id: string;
  name: string;
  projectType: string;
  items: RabItem[];
  createdAt: string;
};

type Rab = {
  id: string;
  projectName: string;
  customer: string;
  status: "draft" | "sent" | "approved";
  items: RabItem[];
  taxPercent: number;
  createdAt: string;
};

// ─── Mock Data ───────────────────────────────────────────────────────────────

const templates: RabTemplate[] = [
  {
    id: "t1",
    name: "Kitchen Set Standard",
    projectType: "Kitchen Set",
    items: [
      { id: "1", name: "HPL Sheet (Walnut)", unit: "lembar", qty: 12, unitPrice: 450000, markup: 15 },
      { id: "2", name: "Multiplex 18mm", unit: "lembar", qty: 8, unitPrice: 380000, markup: 10 },
      { id: "3", name: "Hardware (Engsel, Rel)", unit: "set", qty: 1, unitPrice: 2500000, markup: 20 },
      { id: "4", name: "Countertop Granit", unit: "meter", qty: 4, unitPrice: 1800000, markup: 15 },
      { id: "5", name: "Jasa Produksi", unit: "proyek", qty: 1, unitPrice: 15000000, markup: 0 },
      { id: "6", name: "Jasa Instalasi", unit: "proyek", qty: 1, unitPrice: 5000000, markup: 0 },
    ],
    createdAt: "10 Mar 2026",
  },
  {
    id: "t2",
    name: "Wardrobe Built-in",
    projectType: "Wardrobe",
    items: [
      { id: "1", name: "HPL Sheet (Putih)", unit: "lembar", qty: 10, unitPrice: 420000, markup: 15 },
      { id: "2", name: "Multiplex 18mm", unit: "lembar", qty: 6, unitPrice: 380000, markup: 10 },
      { id: "3", name: "Sliding Door System", unit: "set", qty: 1, unitPrice: 4500000, markup: 20 },
      { id: "4", name: "LED Strip", unit: "meter", qty: 3, unitPrice: 150000, markup: 15 },
      { id: "5", name: "Jasa Produksi", unit: "proyek", qty: 1, unitPrice: 8000000, markup: 0 },
    ],
    createdAt: "15 Apr 2026",
  },
];

const existingRabs: Rab[] = [
  {
    id: "r1",
    projectName: "Kitchen Set Walnut",
    customer: "Mira H.",
    status: "approved",
    taxPercent: 11,
    items: [
      { id: "1", name: "HPL Sheet (Walnut W-2204)", unit: "lembar", qty: 14, unitPrice: 480000, markup: 15 },
      { id: "2", name: "Multiplex 18mm", unit: "lembar", qty: 10, unitPrice: 380000, markup: 10 },
      { id: "3", name: "Hardware Premium Set", unit: "set", qty: 1, unitPrice: 3200000, markup: 20 },
      { id: "4", name: "Quartz Countertop", unit: "meter", qty: 4.5, unitPrice: 2200000, markup: 15 },
      { id: "5", name: "LED Strip Under-cabinet", unit: "meter", qty: 6, unitPrice: 150000, markup: 15 },
      { id: "6", name: "Jasa Produksi", unit: "proyek", qty: 1, unitPrice: 18000000, markup: 0 },
      { id: "7", name: "Jasa Instalasi", unit: "proyek", qty: 1, unitPrice: 6000000, markup: 0 },
    ],
    createdAt: "18 Mei 2026",
  },
  {
    id: "r2",
    projectName: "Wardrobe Minimalis",
    customer: "Kevin A.",
    status: "draft",
    taxPercent: 11,
    items: [
      { id: "1", name: "HPL Sheet (Putih Doff)", unit: "lembar", qty: 10, unitPrice: 420000, markup: 15 },
      { id: "2", name: "Multiplex 18mm", unit: "lembar", qty: 7, unitPrice: 380000, markup: 10 },
      { id: "3", name: "Sliding Rail System", unit: "set", qty: 1, unitPrice: 4800000, markup: 20 },
    ],
    createdAt: "26 Mei 2026",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function RabBuilder() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedRab, setSelectedRab] = useState<Rab | null>(null);
  const [items, setItems] = useState<RabItem[]>([]);
  const [taxPercent, setTaxPercent] = useState(11);

  const openDetail = (rab: Rab) => { setSelectedRab(rab); setView("detail"); };
  const startCreate = (template?: RabTemplate) => {
    setItems(template ? template.items.map((item, i) => ({ ...item, id: String(i + 1) })) : []);
    setView("create");
  };

  if (view === "detail" && selectedRab) return <RabDetail rab={selectedRab} onBack={() => setView("list")} />;
  if (view === "create") return <RabCreateForm items={items} setItems={setItems} taxPercent={taxPercent} setTaxPercent={setTaxPercent} onBack={() => setView("list")} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">RAB Builder</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Buat dan kelola Rencana Anggaran Biaya untuk setiap proyek.</p>
        </div>
        <button onClick={() => startCreate()} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Buat RAB
        </button>
      </div>

      {/* Templates */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#3D3530]">Template RAB</h2>
        <p className="mt-0.5 text-[12px] text-[#8B8179]">Gunakan template untuk mempercepat pembuatan RAB.</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {templates.map((t) => (
            <button key={t.id} onClick={() => startCreate(t)} className="rounded-xl border border-[#E8E2D9] bg-white p-4 text-left transition hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]"><FileText size={15} /></div>
                <div>
                  <p className="text-[13px] font-semibold text-[#3D3530]">{t.name}</p>
                  <p className="text-[11px] text-[#8B8179]">{t.projectType} · {t.items.length} item · {t.createdAt}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Existing RABs */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#3D3530]">RAB Proyek</h2>
        <div className="mt-3 space-y-2.5">
          {existingRabs.map((rab) => {
            const subtotal = rab.items.reduce((acc, item) => acc + item.qty * item.unitPrice * (1 + item.markup / 100), 0);
            const tax = subtotal * (rab.taxPercent / 100);
            const total = subtotal + tax;
            return (
              <article key={rab.id} onClick={() => openDetail(rab)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[14px] font-semibold text-[#3D3530]">{rab.projectName}</h3>
                      <RabStatusPill status={rab.status} />
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#8B8179]">{rab.customer} · {rab.items.length} item · {rab.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[14px] font-semibold text-[#3D3530]">Rp{Math.round(total).toLocaleString("id-ID")}</p>
                    <ChevronRight size={15} className="text-[#D4C9BD] group-hover:text-[#6B5B52]" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RabDetail({ rab, onBack }: { rab: Rab; onBack: () => void }) {
  const subtotal = rab.items.reduce((acc, item) => acc + item.qty * item.unitPrice * (1 + item.markup / 100), 0);
  const tax = subtotal * (rab.taxPercent / 100);
  const total = subtotal + tax;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52]"><ChevronRight size={14} className="rotate-180" /> Kembali</button>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] leading-tight text-[#3D3530]">{rab.projectName}</h1>
          <p className="mt-1 text-[13px] text-[#8B8179]">{rab.customer} · {rab.createdAt}</p>
        </div>
        <RabStatusPill status={rab.status} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E8E2D9] bg-white">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#F8F6F2]">
              <th className="px-4 py-3 text-left font-semibold text-[#6B5B52]">Item</th>
              <th className="px-3 py-3 text-center font-semibold text-[#6B5B52]">Qty</th>
              <th className="px-3 py-3 text-center font-semibold text-[#6B5B52]">Satuan</th>
              <th className="px-3 py-3 text-right font-semibold text-[#6B5B52]">Harga</th>
              <th className="px-3 py-3 text-center font-semibold text-[#6B5B52]">Markup</th>
              <th className="px-4 py-3 text-right font-semibold text-[#6B5B52]">Total</th>
            </tr>
          </thead>
          <tbody>
            {rab.items.map((item) => {
              const lineTotal = item.qty * item.unitPrice * (1 + item.markup / 100);
              return (
                <tr key={item.id} className="border-b border-[#F0EBE4] last:border-0">
                  <td className="px-4 py-2.5 font-medium text-[#3D3530]">{item.name}</td>
                  <td className="px-3 py-2.5 text-center text-[#7A7067]">{item.qty}</td>
                  <td className="px-3 py-2.5 text-center text-[#7A7067]">{item.unit}</td>
                  <td className="px-3 py-2.5 text-right text-[#7A7067]">Rp{item.unitPrice.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2.5 text-center text-[#7A7067]">{item.markup}%</td>
                  <td className="px-4 py-2.5 text-right font-medium text-[#3D3530]">Rp{Math.round(lineTotal).toLocaleString("id-ID")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <div className="space-y-2">
          <div className="flex justify-between text-[13px]"><span className="text-[#7A7067]">Subtotal</span><span className="font-medium text-[#3D3530]">Rp{Math.round(subtotal).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-[#7A7067]">PPN ({rab.taxPercent}%)</span><span className="font-medium text-[#3D3530]">Rp{Math.round(tax).toLocaleString("id-ID")}</span></div>
          <div className="border-t border-[#E8E2D9] pt-2">
            <div className="flex justify-between text-[15px]"><span className="font-semibold text-[#3D3530]">Grand Total</span><span className="font-bold text-[#3D3530]">Rp{Math.round(total).toLocaleString("id-ID")}</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Export PDF</button>
        <button className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#6B5B52]">Kirim ke Client</button>
        <button className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Edit</button>
      </div>
    </div>
  );
}

function RabCreateForm({ items, setItems, taxPercent, setTaxPercent, onBack }: { items: RabItem[]; setItems: (i: RabItem[]) => void; taxPercent: number; setTaxPercent: (n: number) => void; onBack: () => void }) {
  const addItem = () => setItems([...items, { id: String(Date.now()), name: "", unit: "pcs", qty: 1, unitPrice: 0, markup: 0 }]);
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof RabItem, value: string | number) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.unitPrice * (1 + item.markup / 100), 0);
  const tax = subtotal * (taxPercent / 100);
  const total = subtotal + tax;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52]"><ChevronRight size={14} className="rotate-180" /> Kembali</button>
      <h1 className="font-serif text-[28px] leading-tight text-[#3D3530]">Buat RAB Baru</h1>

      <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-[#E8E2D9] bg-white p-5">
        <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Proyek</span><select className="field-control"><option>Kitchen Set Walnut — Mira H.</option><option>Wardrobe Minimalis — Kevin A.</option></select></label>
        <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">PPN (%)</span><input type="number" className="field-control" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} /></label>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#3D3530]">Item RAB</h3>
          <button onClick={addItem} className="flex h-7 items-center gap-1 rounded-md bg-[#6B5B52] px-2.5 text-[11px] font-semibold text-white"><Plus size={12} /> Tambah</button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_60px_70px_100px_60px_32px] items-center gap-2 rounded-lg bg-[#F8F6F2] p-2">
              <input className="h-8 rounded border border-[#E8E2D9] bg-white px-2 text-[12px]" placeholder="Nama item" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
              <input type="number" className="h-8 rounded border border-[#E8E2D9] bg-white px-2 text-[12px] text-center" value={item.qty} onChange={e => updateItem(item.id, "qty", Number(e.target.value))} />
              <input className="h-8 rounded border border-[#E8E2D9] bg-white px-2 text-[12px]" placeholder="Satuan" value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)} />
              <input type="number" className="h-8 rounded border border-[#E8E2D9] bg-white px-2 text-[12px]" placeholder="Harga" value={item.unitPrice || ""} onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))} />
              <input type="number" className="h-8 rounded border border-[#E8E2D9] bg-white px-2 text-[12px] text-center" placeholder="%" value={item.markup || ""} onChange={e => updateItem(item.id, "markup", Number(e.target.value))} />
              <button onClick={() => removeItem(item.id)} className="grid h-8 w-8 place-items-center rounded text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="py-4 text-center text-[13px] text-[#8B8179]">Belum ada item. Klik &quot;Tambah&quot; untuk mulai.</p>}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-[#7A7067]">Subtotal</span><span className="font-medium text-[#3D3530]">Rp{Math.round(subtotal).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span className="text-[#7A7067]">PPN ({taxPercent}%)</span><span className="font-medium text-[#3D3530]">Rp{Math.round(tax).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between border-t border-[#E8E2D9] pt-2 text-[15px]"><span className="font-semibold text-[#3D3530]">Grand Total</span><span className="font-bold text-[#3D3530]">Rp{Math.round(total).toLocaleString("id-ID")}</span></div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Simpan Draft</button>
        <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Simpan & Kirim</button>
      </div>
    </div>
  );
}

function RabStatusPill({ status }: { status: Rab["status"] }) {
  const map = { draft: { label: "Draft", color: "bg-[#F0EBE4] text-[#6B5B52]" }, sent: { label: "Dikirim", color: "bg-blue-50 text-blue-700" }, approved: { label: "Disetujui", color: "bg-emerald-50 text-emerald-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}
