"use client";

import { Check, ChevronRight, Clock, X } from "lucide-react";
import { useState } from "react";

type SelectionItem = {
  id: string;
  category: string;
  title: string;
  options: { id: string; name: string; image: string; description: string; price?: string }[];
  selectedOptionId?: string;
  approvedAt?: string;
  status: "pending" | "approved" | "change_requested";
};

const selectionItems: SelectionItem[] = [
  {
    id: "1", category: "Material Kabinet", title: "Pilih material untuk kabinet atas & bawah",
    options: [
      { id: "a", name: "HPL Walnut W-2204", image: "/figma/hero-kitchen.webp", description: "Warna walnut natural, tekstur kayu. Tahan gores dan panas.", price: "Rp480.000/lembar" },
      { id: "b", name: "HPL Oak Light", image: "/figma/benefits-kitchen.webp", description: "Warna oak terang, cocok untuk ruangan kecil. Kesan luas.", price: "Rp460.000/lembar" },
      { id: "c", name: "Veneer Teak", image: "/figma/project-walnut.webp", description: "Kayu jati asli veneer. Premium look, perawatan lebih.", price: "Rp750.000/lembar" },
    ],
    selectedOptionId: "a", approvedAt: "18 Mei 2026", status: "approved",
  },
  {
    id: "2", category: "Countertop", title: "Pilih material countertop dapur",
    options: [
      { id: "a", name: "Quartz Putih", image: "/figma/inspiration-kitchen.webp", description: "Quartz engineered, anti noda, tahan panas. Warna putih bersih.", price: "Rp2.200.000/meter" },
      { id: "b", name: "Granit Hitam Galaxy", image: "/figma/process-bg.webp", description: "Granit alam, motif unik tiap lembar. Elegan dan kuat.", price: "Rp1.800.000/meter" },
      { id: "c", name: "Solid Surface", image: "/figma/offer-office.webp", description: "Seamless, bisa dibentuk. Warna konsisten, mudah diperbaiki.", price: "Rp1.500.000/meter" },
    ],
    selectedOptionId: undefined, status: "pending",
  },
  {
    id: "3", category: "Handle Kabinet", title: "Pilih tipe handle untuk kabinet",
    options: [
      { id: "a", name: "Push-to-Open (Hidden)", image: "/figma/offer-closet-top.webp", description: "Tanpa handle visible. Tampilan clean dan minimalis.", price: "Rp85.000/pcs" },
      { id: "b", name: "Handle Bar Hitam", image: "/figma/offer-closet-bottom.webp", description: "Handle bar metal hitam. Industrial modern look.", price: "Rp65.000/pcs" },
    ],
    selectedOptionId: "a", approvedAt: "18 Mei 2026", status: "approved",
  },
];

export function SelectionBoard() {
  const [items] = useState(selectionItems);
  const [selectedItem, setSelectedItem] = useState<SelectionItem | null>(null);

  if (selectedItem) return <SelectionDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;

  const pendingCount = items.filter(i => i.status === "pending").length;
  const approvedCount = items.filter(i => i.status === "approved").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Pilihan Material</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Pilih material dan komponen untuk proyek kamu. Keputusan tercatat sebagai approval resmi.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
          <Clock size={14} className="text-amber-600" />
          <span className="text-[12px] font-medium text-amber-700">{pendingCount} menunggu pilihan</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <Check size={14} className="text-emerald-600" />
          <span className="text-[12px] font-medium text-emerald-700">{approvedCount} sudah dipilih</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} onClick={() => setSelectedItem(item)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-[#F0EBE4] px-2 py-0.5 text-[10px] font-semibold text-[#6B5B52]">{item.category}</span>
                  <SelectionStatusPill status={item.status} />
                </div>
                <p className="mt-1.5 text-[14px] font-semibold text-[#3D3530]">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{item.options.length} opsi tersedia{item.selectedOptionId ? ` · Dipilih: ${item.options.find(o => o.id === item.selectedOptionId)?.name}` : ""}</p>
              </div>
              <ChevronRight size={15} className="text-[#D4C9BD] group-hover:text-[#6B5B52]" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SelectionDetail({ item, onBack }: { item: SelectionItem; onBack: () => void }) {
  const [selected, setSelected] = useState<string | undefined>(item.selectedOptionId);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52]"><ChevronRight size={14} className="rotate-180" /> Kembali</button>

      <div>
        <span className="rounded bg-[#F0EBE4] px-2 py-0.5 text-[10px] font-semibold text-[#6B5B52]">{item.category}</span>
        <h1 className="mt-2 font-serif text-[26px] leading-tight text-[#3D3530]">{item.title}</h1>
      </div>

      {item.status === "approved" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <Check size={14} className="text-emerald-600" />
          <p className="text-[12px] text-emerald-700">Sudah disetujui pada {item.approvedAt}. Perubahan setelah ini akan tercatat sebagai Change Order.</p>
        </div>
      )}

      {/* Options grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {item.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`rounded-xl border-2 bg-white p-3 text-left transition ${selected === opt.id ? "border-[#6B5B52] shadow-[0_0_0_1px_#6B5B52]" : "border-[#E8E2D9] hover:border-[#D4C9BD]"}`}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#F0EBE4]">
              <img src={opt.image} alt={opt.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[#3D3530]">{opt.name}</p>
                {selected === opt.id && <div className="grid h-5 w-5 place-items-center rounded-full bg-[#6B5B52] text-white"><Check size={12} /></div>}
              </div>
              <p className="mt-1 text-[11px] leading-4 text-[#7A7067]">{opt.description}</p>
              {opt.price && <p className="mt-1.5 text-[12px] font-medium text-[#6B5B52]">{opt.price}</p>}
            </div>
          </button>
        ))}
      </div>

      {item.status === "pending" && (
        <div className="flex justify-end gap-2">
          <button className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Nanti saja</button>
          <button disabled={!selected} className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white disabled:opacity-40">Konfirmasi Pilihan</button>
        </div>
      )}
    </div>
  );
}

function SelectionStatusPill({ status }: { status: SelectionItem["status"] }) {
  const map = { pending: { label: "Menunggu Pilihan", color: "bg-amber-50 text-amber-700" }, approved: { label: "Disetujui", color: "bg-emerald-50 text-emerald-700" }, change_requested: { label: "Change Order", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}
