"use client";

import { AlertCircle, Calendar, CheckCircle2, Clock, Plus, Shield, Camera } from "lucide-react";
import { useState } from "react";

type WarrantyCard = {
  id: string;
  projectName: string;
  completedDate: string;
  warrantyEnd: string;
  daysRemaining: number;
  status: "active" | "expiring_soon" | "expired";
  claims: { id: string; date: string; description: string; status: "submitted" | "in_review" | "scheduled" | "resolved" }[];
};

const warranties: WarrantyCard[] = [
  {
    id: "1",
    projectName: "Backdrop TV Modern",
    completedDate: "15 Mar 2026",
    warrantyEnd: "15 Mar 2027",
    daysRemaining: 292,
    status: "active",
    claims: [],
  },
  {
    id: "2",
    projectName: "Kitchen Set Walnut",
    completedDate: "Estimasi Jul 2026",
    warrantyEnd: "Estimasi Jul 2027",
    daysRemaining: 420,
    status: "active",
    claims: [],
  },
];

// Simulated past warranty with claim
const pastWarranties: WarrantyCard[] = [
  {
    id: "3",
    projectName: "Lemari Kamar Anak",
    completedDate: "10 Jan 2025",
    warrantyEnd: "10 Jan 2026",
    daysRemaining: 0,
    status: "expired",
    claims: [
      { id: "c1", date: "15 Okt 2025", description: "Engsel pintu kanan lepas, perlu diganti", status: "resolved" },
    ],
  },
];

export function WarrantyTracking() {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const allWarranties = [...warranties, ...pastWarranties];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Garansi</h1>
        <p className="mt-1 text-[14px] text-[#7A7067]">Pantau garansi proyek dan ajukan klaim jika ada masalah.</p>
      </div>

      {/* Warranty cards */}
      <div className="space-y-3">
        {allWarranties.map((w) => (
          <div key={w.id} className="rounded-xl border border-[#E8E2D9] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${w.status === "active" ? "bg-emerald-50 text-emerald-600" : w.status === "expiring_soon" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"}`}>
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3530]">{w.projectName}</p>
                  <p className="text-[12px] text-[#8B8179]">Selesai: {w.completedDate} · Garansi s/d: {w.warrantyEnd}</p>
                  {w.status === "active" && <p className="mt-1 text-[12px] font-medium text-emerald-600">{w.daysRemaining} hari tersisa</p>}
                  {w.status === "expired" && <p className="mt-1 text-[12px] font-medium text-gray-500">Garansi sudah berakhir</p>}
                </div>
              </div>
              <WarrantyStatusPill status={w.status} />
            </div>

            {/* Claims */}
            {w.claims.length > 0 && (
              <div className="mt-3 border-t border-[#F0EBE4] pt-3">
                <p className="text-[12px] font-semibold text-[#6B5B52]">Riwayat Klaim</p>
                <div className="mt-2 space-y-1.5">
                  {w.claims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between rounded-lg bg-[#F8F6F2] px-3 py-2">
                      <div>
                        <p className="text-[12px] font-medium text-[#3D3530]">{claim.description}</p>
                        <p className="text-[11px] text-[#8B8179]">{claim.date}</p>
                      </div>
                      <ClaimStatusPill status={claim.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim button */}
            {w.status === "active" && (
              <button onClick={() => setShowClaimForm(true)} className="mt-3 flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E2D9] px-3 text-[12px] font-medium text-[#6B5B52] transition hover:bg-[#F5F0EA]">
                <Plus size={13} /> Ajukan Klaim Garansi
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Claim form modal */}
      {showClaimForm && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={() => setShowClaimForm(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <h3 className="text-[16px] font-semibold text-[#3D3530]">Ajukan Klaim Garansi</h3>
              <p className="mt-1 text-[12px] text-[#8B8179]">Jelaskan masalah yang terjadi dan lampirkan foto.</p>
              <div className="mt-4 space-y-3">
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-medium text-[#6B5B52]">Proyek</span>
                  <select className="field-control">
                    {warranties.filter(w => w.status === "active").map(w => <option key={w.id}>{w.projectName}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-medium text-[#6B5B52]">Deskripsi masalah *</span>
                  <textarea rows={3} className="field-control resize-none" placeholder="Jelaskan kerusakan atau masalah yang terjadi..." />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-medium text-[#6B5B52]">Foto kerusakan</span>
                  <div className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-[#D4C9BD] bg-[#F8F6F2] p-4 transition hover:border-[#6B5B52]">
                    <Camera size={20} className="text-[#8B8179]" />
                    <span className="mt-1 text-[12px] text-[#8B8179]">Upload foto</span>
                    <input type="file" accept="image/*" multiple className="sr-only" />
                  </div>
                </label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowClaimForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
                <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Kirim Klaim</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WarrantyStatusPill({ status }: { status: WarrantyCard["status"] }) {
  const map = { active: { label: "Aktif", color: "bg-emerald-50 text-emerald-700" }, expiring_soon: { label: "Segera Habis", color: "bg-amber-50 text-amber-700" }, expired: { label: "Berakhir", color: "bg-gray-100 text-gray-500" } };
  const { label, color } = map[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}

function ClaimStatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = { submitted: { label: "Diajukan", color: "bg-amber-50 text-amber-700" }, in_review: { label: "Direview", color: "bg-blue-50 text-blue-700" }, scheduled: { label: "Dijadwalkan", color: "bg-[#F0EBE4] text-[#6B5B52]" }, resolved: { label: "Selesai", color: "bg-emerald-50 text-emerald-700" } };
  const { label, color } = map[status] ?? { label: status, color: "bg-gray-100 text-gray-600" };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color}`}>{label}</span>;
}
