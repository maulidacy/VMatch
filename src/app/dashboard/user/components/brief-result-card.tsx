"use client";

import {
    AlertCircle,
    Check,
    CheckCircle2,
    Clock3,
    ClipboardList,
    Gauge,
    Layers,
    PenLine,
    RefreshCw,
    RotateCcw,
    Save,
    Send,
    Target,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

export type BriefResultData = {
    chips: {
        jenis: string;
        style: string;
        budget: string;
        timeline: string;
        prioritas: string;
        lokasi: string;
        ukuran: string;
        referensi: string;
        material: string;
    };
    summary: string;
    recommendations: string[];
    validations: string[];
};

const inputClass =
    "h-11 w-full rounded-xl border border-[#E4D8CD] bg-white px-4 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]";

const textareaClass =
    "w-full resize-none rounded-xl border border-[#E4D8CD] bg-white p-4 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54]";

export function BriefResultCard({
    data,
    isSelected,
    isRegenerating,
    onChangeData,
    onUseBrief,
    onRegenerate,
}: {
    data: BriefResultData;
    isSelected: boolean;
    isRegenerating: boolean;
    onChangeData: (data: BriefResultData) => void;
    onUseBrief: () => void;
    onRegenerate: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<BriefResultData>(data);
    const handleStartEditing = () => {
        setDraft(data);
        setIsEditing(true);
    };

    const updateChip = (key: keyof BriefResultData["chips"], value: string) => {
        setDraft((current) => ({
            ...current,
            chips: {
                ...current.chips,
                [key]: value,
            },
        }));
    };

    const updateLines = (
        key: "recommendations" | "validations",
        value: string,
    ) => {
        setDraft((current) => ({
            ...current,
            [key]: value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        }));
    };

    const handleCancel = () => {
        setDraft(data);
        setIsEditing(false);
    };

    const handleReset = () => {
        setDraft(data);
    };

    const handleSave = () => {
        onChangeData(draft);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <section className="overflow-hidden rounded-xl border border-[#E4D8CD] bg-white shadow-[0_10px_34px_rgba(49,51,44,0.05)]">
                <div className="border-b border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        <PenLine size={13} />
                        Mode Edit Brief
                    </span>

                    <h2 className="mt-4 font-serif text-[30px] leading-tight text-[#31332C] sm:text-[36px]">
                        Edit Hasil Brief Awal
                    </h2>

                    <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                        Kamu bisa menyesuaikan brief sebelum digunakan untuk review. Tim
                        VMatch tetap akan memvalidasi detail teknis sebelum solusi final
                        dibuat.
                    </p>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <EditField label="Jenis kebutuhan">
                            <input
                                value={draft.chips.jenis}
                                onChange={(event) => updateChip("jenis", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>

                        <EditField label="Style desain">
                            <select
                                value={draft.chips.style}
                                onChange={(event) => updateChip("style", event.target.value)}
                                className={inputClass}
                            >
                                <option>Modern minimalis</option>
                                <option>Japandi</option>
                                <option>Scandinavian</option>
                                <option>Industrial</option>
                                <option>Classic</option>
                            </select>
                        </EditField>

                        <EditField label="Budget">
                            <select
                                value={draft.chips.budget}
                                onChange={(event) => updateChip("budget", event.target.value)}
                                className={inputClass}
                            >
                                <option>Di bawah Rp30 juta</option>
                                <option>Rp30–60 juta</option>
                                <option>Rp60–100 juta</option>
                                <option>Rp100–150 juta</option>
                                <option>Di atas Rp150 juta</option>
                            </select>
                        </EditField>

                        <EditField label="Timeline">
                            <select
                                value={draft.chips.timeline}
                                onChange={(event) => updateChip("timeline", event.target.value)}
                                className={inputClass}
                            >
                                <option>Fleksibel</option>
                                <option>Secepatnya</option>
                                <option>Minggu depan</option>
                                <option>Bulan depan</option>
                                <option>2–3 bulan</option>
                            </select>
                        </EditField>

                        <EditField label="Prioritas">
                            <input
                                value={draft.chips.prioritas}
                                onChange={(event) => updateChip("prioritas", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>

                        <EditField label="Lokasi">
                            <input
                                value={draft.chips.lokasi}
                                onChange={(event) => updateChip("lokasi", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>

                        <EditField label="Ukuran Ruangan">
                            <input
                                value={draft.chips.ukuran}
                                onChange={(event) => updateChip("ukuran", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>

                        <EditField label="Preferensi Material">
                            <input
                                value={draft.chips.material}
                                onChange={(event) => updateChip("material", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>

                        <EditField label="Referensi Desain">
                            <input
                                value={draft.chips.referensi}
                                onChange={(event) => updateChip("referensi", event.target.value)}
                                className={inputClass}
                            />
                        </EditField>
                    </div>

                    <EditField label="Ringkasan Kebutuhan">
                        <textarea
                            rows={5}
                            value={draft.summary}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    summary: event.target.value,
                                }))
                            }
                            className={textareaClass}
                        />
                    </EditField>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <EditField label="Rekomendasi Awal VMatch">
                            <textarea
                                rows={7}
                                value={draft.recommendations.join("\n")}
                                onChange={(event) =>
                                    updateLines("recommendations", event.target.value)
                                }
                                className={textareaClass}
                                placeholder="Tulis satu rekomendasi per baris"
                            />
                        </EditField>

                        <EditField label="Hal yang Perlu Divalidasi">
                            <textarea
                                rows={7}
                                value={draft.validations.join("\n")}
                                onChange={(event) =>
                                    updateLines("validations", event.target.value)
                                }
                                className={textareaClass}
                                placeholder="Tulis satu item validasi per baris"
                            />
                        </EditField>
                    </div>

                    <div className="rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-4">
                        <p className="text-[13px] leading-6 text-[#7B756E]">
                            Brief ini masih bisa kamu edit sebelum dikirim. Gunakan Brief Ini
                            hanya memilih brief untuk tahap review, bukan mengirim request.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#E8E2D9] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                        >
                            <RotateCcw size={15} />
                            Reset ke Hasil AI
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                        >
                            <Save size={15} />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-xl border border-[#E4D8CD] bg-white shadow-[0_10px_34px_rgba(49,51,44,0.05)]">
            <div className="border-b border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                <CheckCircle2 size={13} />
                                Brief Awal Dibuat
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                <Check size={13} />
                                {isSelected ? "Dipilih untuk Review" : "Siap Direview"}
                            </span>
                        </div>

                        <h2 className="mt-4 font-serif text-[30px] leading-tight text-[#31332C] sm:text-[36px]">
                            Hasil Brief Awal
                        </h2>

                        <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                            Brief ini dibuat berdasarkan kebutuhan awal kamu dan masih akan
                            divalidasi oleh tim VMatch.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <SummaryChip icon={Layers} label="Jenis" value={data.chips.jenis} />
                    <SummaryChip
                        icon={ClipboardList}
                        label="Style"
                        value={data.chips.style}
                    />
                    <SummaryChip icon={Wallet} label="Budget" value={data.chips.budget} />
                    <SummaryChip
                        icon={Clock3}
                        label="Timeline"
                        value={data.chips.timeline}
                    />
                    <SummaryChip
                        icon={Target}
                        label="Prioritas"
                        value={data.chips.prioritas}
                    />
                    <SummaryChip
                        icon={Layers}
                        label="Lokasi"
                        value={data.chips.lokasi}
                    />
                    <SummaryChip
                        icon={Layers}
                        label="Ukuran Ruangan"
                        value={data.chips.ukuran}
                    />
                    <SummaryChip
                        icon={ClipboardList}
                        label="Preferensi Material"
                        value={data.chips.material}
                    />
                    <SummaryChip
                        icon={Target}
                        label="Referensi Desain"
                        value={data.chips.referensi}
                    />
                </div>

                <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-5">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Ringkasan Kebutuhan
                        </p>

                        <p className="mt-3 text-[14px] leading-7 text-[#31332C]">
                            {data.summary}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#E8E2D9] bg-white p-5">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Rekomendasi Awal VMatch
                        </p>

                        <div className="mt-4 space-y-3">
                            {data.recommendations.map((item) => (
                                <div key={item} className="flex gap-3">
                                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#EFE8DF] text-[#725F54]">
                                        <Check size={14} />
                                    </span>

                                    <p className="text-[13px] leading-6 text-[#31332C]">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-5">
                    <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54]">
                            <AlertCircle size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-semibold text-[#31332C]">
                                Hal yang Perlu Divalidasi
                            </p>

                            <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
                                Tim VMatch tetap perlu memvalidasi detail teknis sebelum solusi
                                final dibuat.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {data.validations.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#E8E2D9] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12px] leading-5 text-[#7B756E]">
                        Brief ini membantu menyusun gambaran awal, bukan keputusan final.
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={onRegenerate}
                            disabled={isRegenerating}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={15}
                                className={isRegenerating ? "animate-spin" : ""}
                            />
                            {isRegenerating ? "Menganalisis..." : "Analisis Ulang"}
                        </button>

                        <button
                            type="button"
                            onClick={handleStartEditing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
                        >
                            <PenLine size={15} />
                            Edit Manual
                        </button>

                        <button
                            type="button"
                            onClick={onUseBrief}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                        >
                            <Send size={15} />
                            Gunakan Brief Ini
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ReadinessScoreCard({ score }: { score: number }) {
    return (
        <div className="rounded-xl border border-[#E4D8CD] bg-white p-5 shadow-[0_8px_28px_rgba(49,51,44,0.04)]">
            <div className="flex items-center gap-2 text-[#725F54]">
                <Gauge size={17} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Readiness Score
                </p>
            </div>

            <div className="mt-4 flex items-end gap-2">
                <span className="font-serif text-[56px] leading-none text-[#31332C]">
                    {score}
                </span>
                <span className="mb-2 text-[14px] text-[#7B756E]">/100</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EFE8DF]">
                <div
                    className="h-full rounded-full bg-[#725F54] transition-all duration-500"
                    style={{ width: `${score}%` }}
                />
            </div>

            <p className="mt-4 text-[13px] leading-6 text-[#7B756E]">
                Score ini hanya indikator kelengkapan brief awal. Tim VMatch tetap akan
                memvalidasi kebutuhan.
            </p>
        </div>
    );
}

export function ReviewSubmitCard({
    hasGeneratedBrief,
    isBriefSelected,
    requestStatus,
    onCompleteData,
    onSaveDraft,
    onSubmitRequest,
}: {
    hasGeneratedBrief: boolean;
    isBriefSelected: boolean;
    requestStatus: "draft" | "selected" | "submitted";
    onCompleteData: () => void;
    onSaveDraft: () => void;
    onSubmitRequest: () => void;
}) {
    const statusText =
        requestStatus === "submitted"
            ? "Request proyek sudah dikirim dan sedang menunggu review tim VMatch."
            : isBriefSelected
                ? "Brief sudah dipilih dan siap dikirim."
                : hasGeneratedBrief
                    ? "Brief AI sudah dibuat dan siap direview."
                    : "Isi deskripsi lalu klik Buat Brief Awal.";

    return (
        <div className="rounded-xl border border-[#E4D8CD] bg-white p-5 shadow-[0_8px_28px_rgba(49,51,44,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7B756E]">
                Review & Kirim
            </p>

            <h3 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C]">
                Review Sebelum Kirim
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#7B756E]">
                Periksa kembali data sebelum mengirim request. Setelah request dikirim,
                tim VMatch akan menganalisis kebutuhan dan menyusun solusi.
            </p>

            <div className="mt-4 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[12px] font-semibold text-[#725F54]">
                    Status brief
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#31332C]">
                    {statusText}
                </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCompleteData}
                    className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                    Lengkapi Data
                </button>

                <button
                    type="button"
                    onClick={onSaveDraft}
                    className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
                >
                    Simpan Draft
                </button>

                <button
                    type="button"
                    onClick={onSubmitRequest}
                    className="h-11 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    Kirim Request Proyek
                </button>
            </div>
        </div>
    );
}

function SummaryChip({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#E4D8CD]">
            <div className="flex items-center gap-2 text-[#725F54]">
                <Icon size={15} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    {label}
                </p>
            </div>

            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#31332C]">
                {value}
            </p>
        </div>
    );
}

function EditField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-2">
            <span className="text-[12px] font-semibold text-[#725F54]">
                {label}
            </span>
            {children}
        </label>
    );
}