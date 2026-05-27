"use client";

import { Calendar, Camera, ChevronRight, Cloud, CloudRain, Plus, Sun } from "lucide-react";
import { useState } from "react";

type DailyLogEntry = {
  id: string;
  date: string;
  projectName: string;
  weather: "cerah" | "mendung" | "hujan";
  workHours: string;
  activities: string[];
  issues: string;
  photos: string[];
  createdBy: string;
};

const dailyLogs: DailyLogEntry[] = [
  {
    id: "1", date: "27 Mei 2026", projectName: "Kitchen Set Walnut", weather: "cerah", workHours: "08:00 - 16:30",
    activities: ["Finishing modul bawah #3 dan #4", "Pemasangan engsel Blum pada modul atas #1", "Cutting HPL untuk panel samping"],
    issues: "", photos: ["/figma/benefits-kitchen.webp"], createdBy: "Aruna Woodwork",
  },
  {
    id: "2", date: "26 Mei 2026", projectName: "Kitchen Set Walnut", weather: "mendung", workHours: "08:00 - 17:00",
    activities: ["Assembling modul bawah #3", "Drilling untuk hardware", "QC modul bawah #1 dan #2"],
    issues: "Stok engsel Blum tinggal 4 pcs, perlu reorder", photos: [], createdBy: "Aruna Woodwork",
  },
  {
    id: "3", date: "25 Mei 2026", projectName: "Kitchen Set Walnut", weather: "hujan", workHours: "08:30 - 15:00",
    activities: ["Cutting multiplex untuk modul bawah #3 dan #4", "Edging HPL modul atas"],
    issues: "Hujan deras, workshop bocor sedikit di sudut. Kerja setengah hari.", photos: [], createdBy: "Aruna Woodwork",
  },
  {
    id: "4", date: "24 Mei 2026", projectName: "Kitchen Set Walnut", weather: "cerah", workHours: "08:00 - 17:00",
    activities: ["Mulai produksi modul bawah #1 dan #2", "Cutting multiplex sesuai gambar kerja", "Setup jig untuk batch cutting"],
    issues: "", photos: ["/figma/hero-kitchen.webp"], createdBy: "Aruna Woodwork",
  },
];

export function DailyLog() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DailyLogEntry | null>(null);

  if (selectedLog) return <LogDetail log={selectedLog} onBack={() => setSelectedLog(null)} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight text-[#3D3530] sm:text-[34px]">Daily Log</h1>
          <p className="mt-1 text-[14px] text-[#7A7067]">Catat aktivitas harian workshop untuk setiap proyek.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex h-9 items-center gap-2 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]">
          <Plus size={14} /> Log Hari Ini
        </button>
      </div>

      {/* New log form */}
      {showForm && (
        <div className="rounded-xl border border-[#6B5B52]/20 bg-white p-5">
          <h3 className="text-[15px] font-semibold text-[#3D3530]">Laporan Harian — {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Proyek *</span><select className="field-control"><option>Kitchen Set Walnut</option><option>Wardrobe Built-in Apartemen</option></select></label>
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Cuaca</span>
              <select className="field-control"><option value="cerah">☀️ Cerah</option><option value="mendung">☁️ Mendung</option><option value="hujan">🌧️ Hujan</option></select>
            </label>
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Jam kerja *</span><input className="field-control" placeholder="08:00 - 17:00" /></label>
          </div>
          <div className="mt-4">
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Aktivitas hari ini * (satu per baris)</span>
              <textarea rows={4} className="field-control resize-none" placeholder="- Finishing modul bawah&#10;- Pemasangan engsel&#10;- QC hasil cutting" />
            </label>
          </div>
          <div className="mt-4">
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Kendala / catatan</span>
              <textarea rows={2} className="field-control resize-none" placeholder="Ada kendala? Stok habis? Cuaca buruk?" />
            </label>
          </div>
          <div className="mt-4">
            <label className="grid gap-1.5"><span className="text-[12px] font-medium text-[#6B5B52]">Foto progress</span>
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-[#D4C9BD] bg-[#F8F6F2] px-4 py-3 transition hover:border-[#6B5B52]">
                <Camera size={16} className="text-[#8B8179]" />
                <span className="text-[12px] text-[#8B8179]">Upload foto (opsional)</span>
                <input type="file" accept="image/*" multiple className="sr-only" />
              </div>
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-[#E8E2D9] px-4 text-[12px] font-medium text-[#7A7067]">Batal</button>
            <button className="h-9 rounded-lg bg-[#6B5B52] px-4 text-[12px] font-semibold text-white">Simpan Log</button>
          </div>
        </div>
      )}

      {/* Log list */}
      <div className="space-y-2.5">
        {dailyLogs.map((log) => (
          <article key={log.id} onClick={() => setSelectedLog(log)} className="group cursor-pointer rounded-xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#D4C9BD] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5F0EA] text-[#6B5B52]">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#3D3530]">{log.date}</p>
                    <WeatherIcon weather={log.weather} />
                  </div>
                  <p className="text-[11px] text-[#8B8179]">{log.projectName} · {log.workHours} · {log.activities.length} aktivitas</p>
                  {log.issues && <p className="mt-0.5 text-[11px] text-amber-600">⚠️ {log.issues.slice(0, 60)}...</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {log.photos.length > 0 && <span className="rounded bg-[#F0EBE4] px-1.5 py-0.5 text-[10px] font-medium text-[#6B5B52]">{log.photos.length} foto</span>}
                <ChevronRight size={15} className="text-[#D4C9BD] group-hover:text-[#6B5B52]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LogDetail({ log, onBack }: { log: DailyLogEntry; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B5B52]"><ChevronRight size={14} className="rotate-180" /> Kembali</button>
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-[26px] leading-tight text-[#3D3530]">{log.date}</h1>
        <WeatherIcon weather={log.weather} />
      </div>
      <p className="text-[13px] text-[#8B8179]">{log.projectName} · {log.workHours} · Oleh: {log.createdBy}</p>

      <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#3D3530]">Aktivitas</h3>
        <ul className="mt-2 space-y-1.5">
          {log.activities.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#3D3530]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B5B52]" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {log.issues && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="text-[13px] font-semibold text-amber-800">Kendala</h3>
          <p className="mt-1 text-[13px] text-amber-700">{log.issues}</p>
        </div>
      )}

      {log.photos.length > 0 && (
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
          <h3 className="text-[14px] font-semibold text-[#3D3530]">Foto Progress</h3>
          <div className="mt-3 flex gap-3">
            {log.photos.map((photo, i) => (
              <div key={i} className="h-[140px] w-[200px] overflow-hidden rounded-lg bg-[#F0EBE4]">
                <img src={photo} alt={`Progress ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherIcon({ weather }: { weather: DailyLogEntry["weather"] }) {
  if (weather === "cerah") return <Sun size={14} className="text-amber-500" />;
  if (weather === "mendung") return <Cloud size={14} className="text-gray-400" />;
  return <CloudRain size={14} className="text-blue-500" />;
}
