"use client";

import { AlertTriangle, Check, ChevronRight, Clock, Plus, X } from "lucide-react";
import { useState } from "react";

type ChangeOrder = {
  id: string;
  projectName: string;
  date: string;
  description: string;
  reason: string;
  additionalCost: string;
  status: "pending_review" | "quoted" | "approved" | "rejected";
  adminNote?: string;
};

const changeOrders: ChangeOrder[] = [
  {
    id: "1",
    projectName: "Kitchen Set Walnut",
    date: "22 Mei 2026",
    description: "Tambah rak bumbu tarik di samping kompor",
    reason: "Setelah lihat progress, ternyata butuh storage tambahan untuk bumbu",
    additionalCost: "Rp2.800.000",
    status: "approved",
    adminNote: "Sudah dikonfirmasi, akan ditambahkan di fase finishing.",
  },
  {
    id: "2",
    projectName: "Kitchen Set Walnut",
    date: "25 Mei 2026",
    description: "Ganti countertop dari Quartz Putih ke Granit Hitam Galaxy",
    reason: "Berubah pikiran setelah lihat sample di showroom",
    additionalCost: "-",
    status: "quoted",
    adminNote: "Selisih harga: -Rp1.800.000 (granit lebih murah). Tapi perlu waktu tambahan 5 hari untuk sourcing.",
  },
];

export function ChangeOrderView() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Change Order</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Ajukan perubahan setelah proyek berjalan. Perubahan mungkin mempengaruhi biaya dan timeline.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Ajukan Perubahan
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="text-[13px] font-medium text-amber-800">Perubahan setelah approval bisa mempengaruhi biaya & timeline</p>
          <p className="mt-0.5 text-[12px] text-amber-700">Tim VMatch akan review dan memberikan estimasi biaya tambahan (jika ada) sebelum perubahan dieksekusi.</p>
        </div>
      </div>

      {/* Change orders list */}
      <div className="space-y-3">
        {changeOrders.map((co) => (
          <div key={co.id} className="rounded-xl border border-[#E8E2D9] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#3D3530]">{co.description}</p>
                  <COStatusPill status={co.status} />
                </div>
                <p className="mt-0.5 text-[12px] text-[#8B8179]">{co.projectName} · {co.date}</p>
                <p className="mt-2 text-[12px] text-[#7A7067]"><span className="font-medium">Alasan:</span> {co.reason}</p>
              </div>
              {co.additionalCost !== "-" && (
                <p className="shrink-0 text-[14px] font-semibold text-[#3D3530]">{co.additionalCost}</p>
              )}
            </div>
            {co.adminNote && (
              <div className="mt-3 rounded-lg bg-[#F8F6F2] px-3 py-2">
                <p className="text-[11px] font-medium text-[#6B5B52]">Catatan Admin:</p>
                <p className="mt-0.5 text-[12px] text-[#7A7067]">{co.adminNote}</p>
              </div>
            )}
            {co.status === "quoted" && (
              <div className="mt-3 flex gap-2 border-t border-[#F0EBE4] pt-3">
                <button className="flex h-8 items-center gap-1.5 rounded-lg bg-[#6B5B52] px-3 text-[12px] font-semibold text-white"><Check size={13} /> Setuju & Lanjutkan</button>
                <button className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-[12px] font-medium text-red-600"><X size={13} /> Batalkan</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <h3 className="text-[16px] font-semibold text-[#3D3530]">Ajukan Change Order</h3>
              <div className="mt-4 space-y-3">
                <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Proyek *</span><select className="field-control"><option>Kitchen Set Walnut</option><option>Wardrobe Minimalis</option></select></label>
                <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Perubahan yang diinginkan *</span><textarea rows={3} className="field-control resize-none" placeholder="Jelaskan perubahan yang kamu inginkan..." /></label>
                <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Alasan perubahan</span><textarea rows={2} className="field-control resize-none" placeholder="Kenapa ingin diubah?" /></label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
                <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Kirim Request</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function COStatusPill({ status }: { status: ChangeOrder["status"] }) {
  const map = { pending_review: { label: "Direview", color: "bg-amber-50 text-amber-700" }, quoted: { label: "Ada Estimasi", color: "bg-blue-50 text-blue-700" }, approved: { label: "Disetujui", color: "bg-emerald-50 text-emerald-700" }, rejected: { label: "Ditolak", color: "bg-red-50 text-red-700" } };
  const { label, color } = map[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}
