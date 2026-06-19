"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export function BriefQcForm({
  open,
  onClose,
  onAddQcItem,
}: {
  open: boolean;
  onClose: () => void;
  onAddQcItem: (qcItem: string) => void;
}) {
  const [qcItem, setQcItem] = useState("");

  const handleSubmit = () => {
    const trimmedQcItem = qcItem.trim();

    if (!trimmedQcItem) return;

    onAddQcItem(trimmedQcItem);
    setQcItem("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E8E2D9] bg-white p-5 shadow-[0_24px_80px_rgba(49,51,44,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Tambah Standar QC
            </p>

            <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
              Tambahkan poin pengecekan kualitas sebagai acuan vendor dan admin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] text-[#7B756E] transition hover:bg-[#FCFBF9]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Poin QC
          </label>

          <input
            value={qcItem}
            onChange={(event) => setQcItem(event.target.value)}
            placeholder="Contoh: Finishing rapi"
            className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!qcItem.trim()}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
              qcItem.trim()
                ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
            }`}
          >
            <Plus size={14} />
            Simpan QC
          </button>
        </div>
      </div>
    </div>
  );
}