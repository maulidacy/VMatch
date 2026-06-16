"use client";

import {
    Bot,
    Camera,
    CheckCircle2,
    FileText,
    Send,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { fieldClass, FormField, SectionCard, textareaClass } from "./shared";
import {
    BriefResultCard,
    mockBriefResult,
    ReadinessScoreCard,
    ReviewSubmitCard,
    type BriefResultData,
} from "./brief-result-card";

type SelectedInspiration = {
    source: "design" | "material";
    referenceName: string;
    projectName: string;
    projectType: string;
    designStyle: string;
    estimatedBudget: string;
    materialPreference: string;
    materialPackage: string;
    initialNotes: string;
    referenceVisual?: string;
    description: string;
};

type ManualFormState = {
    projectName: string;
    projectType: string;
    designStyle: string;
    location: string;
    budget: string;
    materialPreference: string;
    materialPackage: string;
    referenceName: string;
    notes: string;
    startTarget: string;
    finishTarget: string;
};

const STORAGE_KEY = "vmatch_selected_inspiration";

function getStoredInspiration(): SelectedInspiration | null {
    if (typeof window === "undefined") return null;

    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as SelectedInspiration;
    } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function createManualFormFromInspiration(
    data: SelectedInspiration,
): ManualFormState {
    return {
        ...defaultManualForm,
        projectName: data.projectName || data.referenceName,
        projectType: data.projectType || defaultManualForm.projectType,
        designStyle: data.designStyle || "",
        budget: data.estimatedBudget || defaultManualForm.budget,
        materialPreference: data.materialPreference || "",
        materialPackage: data.materialPackage || "",
        referenceName: data.referenceName || "",
        notes: data.initialNotes || "",
    };
}

function createAiDescriptionFromInspiration(data: SelectedInspiration) {
    return `Saya ingin menggunakan referensi "${data.referenceName}" sebagai preferensi awal proyek interior.

Jenis proyek: ${data.projectType || "-"}
Style desain: ${data.designStyle || "-"}
Estimasi budget: ${data.estimatedBudget || "-"}
Preferensi material: ${data.materialPreference || "-"}
Paket material: ${data.materialPackage || "-"}
Catatan awal: ${data.initialNotes || "-"}

Saya ingin tim VMatch membantu menyesuaikan solusi berdasarkan ukuran, kondisi ruangan, budget, material, dan timeline.`;
}

const defaultManualForm: ManualFormState = {
    projectName: "",
    projectType: "Kitchen Set",
    designStyle: "",
    location: "",
    budget: "Rp60–100 juta",
    materialPreference: "",
    materialPackage: "",
    referenceName: "",
    notes: "",
    startTarget: "Secepatnya",
    finishTarget: "Fleksibel",
};

export function NewProjectForm() {
    const [storedInspiration] = useState<SelectedInspiration | null>(() =>
        getStoredInspiration(),
    );

    const [mode, setMode] = useState<"ai" | "manual">(
        storedInspiration ? "manual" : "ai",
    );

    const [notice, setNotice] = useState("");

    const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showNotice = (message: string) => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }

        setNotice(message);

        noticeTimerRef.current = setTimeout(() => {
            setNotice("");
            noticeTimerRef.current = null;
        }, 2500);
    };

    const closeNotice = () => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
            noticeTimerRef.current = null;
        }

        setNotice("");
    };

    const [selectedInspiration, setSelectedInspiration] =
        useState<SelectedInspiration | null>(storedInspiration);

    const [aiDescription, setAiDescription] = useState(() =>
        storedInspiration
            ? createAiDescriptionFromInspiration(storedInspiration)
            : "",
    );

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [generatedBrief, setGeneratedBrief] = useState("");
    const [briefResult, setBriefResult] =
        useState<BriefResultData>(mockBriefResult);

    const [isBriefSelected, setIsBriefSelected] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const [requestStatus, setRequestStatus] = useState<
        "draft" | "selected" | "submitted"
    >(storedInspiration ? "selected" : "draft");

    const [manualForm, setManualForm] = useState<ManualFormState>(() =>
        storedInspiration
            ? createManualFormFromInspiration(storedInspiration)
            : defaultManualForm,
    );


    const readinessScore = useMemo(() => {
        if (mode === "ai") {
            let score = 35;

            if (aiDescription.trim().length > 20) score += 20;
            if (aiDescription.trim().length > 80) score += 15;
            if (uploadedFiles.length > 0) score += 10;
            if (generatedBrief) score += 15;
            if (isBriefSelected) score += 5;

            return Math.min(score, 100);
        }

        let score = 35;

        if (manualForm.projectName.trim()) score += 12;
        if (manualForm.projectType.trim()) score += 10;
        if (manualForm.designStyle.trim()) score += 10;
        if (manualForm.budget.trim()) score += 10;
        if (manualForm.materialPreference.trim()) score += 10;
        if (manualForm.materialPackage.trim()) score += 8;
        if (manualForm.notes.trim()) score += 10;
        if (selectedInspiration) score += 5;

        return Math.min(score, 100);
    }, [
        mode,
        aiDescription,
        uploadedFiles.length,
        generatedBrief,
        isBriefSelected,
        manualForm,
        selectedInspiration,
    ]);

    const handleGenerateBrief = () => {
        if (!aiDescription.trim()) {
            showNotice("Isi deskripsi kebutuhan proyek dulu ya.");
            return;
        }

        setGeneratedBrief("generated");

        setBriefResult({
            ...mockBriefResult,
            summary:
                aiDescription.trim().length > 40
                    ? aiDescription.trim()
                    : mockBriefResult.summary,
        });

        setIsBriefSelected(false);
        setRequestStatus("draft");
        showNotice("Brief awal berhasil dibuat.");
    };

    const handleRegenerateBrief = () => {
        if (!generatedBrief) {
            showNotice("Buat brief awal dulu sebelum analisis ulang.");
            return;
        }

        setIsRegenerating(true);

        window.setTimeout(() => {
            setBriefResult((current) => ({
                ...current,
                recommendations: [
                    "Gunakan konsep modern minimalis dengan layout rapi dan mudah dibaca.",
                    "Maksimalkan penyimpanan vertikal agar ruangan tetap terasa lega.",
                    "Pilih material finishing matte agar lebih mudah dirawat.",
                    "Prioritaskan kombinasi gantungan, laci, dan rak lipat sesuai kebutuhan storage.",
                ],
            }));

            setIsBriefSelected(false);
            setRequestStatus("draft");
            setIsRegenerating(false);
            showNotice("Brief berhasil dianalisis ulang.");
        }, 700);
    };

    const handleUseBrief = () => {
        setIsBriefSelected(true);
        setRequestStatus("selected");
        showNotice(
            "Brief ini sudah dipilih untuk review. Ini belum mengirim request proyek.",
        );
    };

    const handleChangeBriefData = (data: BriefResultData) => {
        setBriefResult(data);
        setIsBriefSelected(false);
        setRequestStatus("draft");
        showNotice("Perubahan brief berhasil disimpan.");
    };

    const handleSaveDraft = () => {
        showNotice("Draft berhasil disimpan sementara di frontend.");
    };

    const handleSubmitRequest = () => {
        if (mode === "ai" && generatedBrief && !isBriefSelected) {
            showNotice("Pilih Gunakan Brief Ini dulu sebelum mengirim request.");
            return;
        }

        if (readinessScore < 60) {
            showNotice(
                "Data masih kurang lengkap. Lengkapi brief terlebih dahulu sebelum kirim request.",
            );
            return;
        }

        setRequestStatus("submitted");
        showNotice(
            "Request proyek berhasil dikirim dan sedang menunggu review tim VMatch.",
        );
    };


    const handleRemoveReference = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }

        setSelectedInspiration(null);
        setManualForm(defaultManualForm);
        setRequestStatus("draft");
        showNotice("Referensi inspirasi berhasil dihapus.");
    };

    return (
        <div className="w-full space-y-6">
            {notice && (
                <div className="fixed right-5 top-20 z-50 flex max-w-[340px] items-start gap-3 rounded-2xl border border-[#D4C9BD] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#6B5B52]"
                    />

                    <p className="flex-1 text-[13px] leading-6 text-[#3D3530]">
                        {notice}
                    </p>

                    <button
                        type="button"
                        onClick={closeNotice}
                        className="grid h-6 w-6 place-items-center rounded-full text-[#8B8179] hover:bg-[#F5F0EA]"
                        aria-label="Tutup notifikasi"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.03)] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B8179]">
                    Request Proyek
                </p>

                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#3D3530] sm:text-[42px]">
                    Ajukan Proyek
                </h1>

                <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7A7067]">
                    Pilih mode input sesuai kebutuhan kamu. Data ini adalah brief awal,
                    bukan solusi final.
                </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
                <ModeButton
                    active={mode === "ai"}
                    icon={Bot}
                    title="Mode Cepat dengan VMatch AI"
                    text="Cocok jika kamu ingin menjelaskan kebutuhan secara bebas."
                    onClick={() => {
                        setMode("ai");
                        closeNotice();
                    }}
                />

                <ModeButton
                    active={mode === "manual"}
                    icon={FileText}
                    title="Mode Manual Detail"
                    text="Cocok jika detail proyek, budget, dan material sudah lebih jelas."
                    onClick={() => {
                        setMode("manual");
                        closeNotice();
                    }}
                />
            </section>

            {mode === "ai" ? (
                <AiBriefForm
                    description={aiDescription}
                    onDescriptionChange={setAiDescription}
                    uploadedFiles={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                    generatedBrief={generatedBrief}
                    briefResult={briefResult}
                    isBriefSelected={isBriefSelected}
                    isRegenerating={isRegenerating}
                    onGenerateBrief={handleGenerateBrief}
                    onRegenerateBrief={handleRegenerateBrief}
                    onUseBrief={handleUseBrief}
                    onChangeBriefData={handleChangeBriefData}
                />
            ) : (
                <ManualBriefForm
                    form={manualForm}
                    selectedInspiration={selectedInspiration}
                    onRemoveReference={handleRemoveReference}
                    onChange={(key, value) =>
                        setManualForm((prev) => ({ ...prev, [key]: value }))
                    }
                />
            )}

            <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                <ReadinessScoreCard score={readinessScore} />

                <ReviewSubmitCard
                    hasGeneratedBrief={Boolean(generatedBrief || selectedInspiration)}
                    isBriefSelected={Boolean(isBriefSelected || selectedInspiration)}
                    requestStatus={requestStatus}
                    onCompleteData={() =>
                        showNotice("Silakan lengkapi bagian yang masih kosong pada form.")
                    }
                    onSaveDraft={handleSaveDraft}
                    onSubmitRequest={handleSubmitRequest}
                />
            </section>
        </div>
    );
}

function ModeButton({
    active,
    icon: Icon,
    title,
    text,
    onClick,
}: {
    active: boolean;
    icon: LucideIcon;
    title: string;
    text: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-5 text-left transition ${active
                ? "border-[#6B5B52] bg-[#6B5B52] text-white"
                : "border-[#E8E2D9] bg-white text-[#3D3530] hover:bg-[#F8F6F2]"
                }`}
        >
            <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "bg-white/15" : "bg-[#F5F0EA] text-[#6B5B52]"
                    }`}
            >
                <Icon size={18} />
            </div>

            <h2 className="mt-4 text-[16px] font-semibold">{title}</h2>

            <p
                className={`mt-2 text-[13px] leading-6 ${active ? "text-white/75" : "text-[#7A7067]"
                    }`}
            >
                {text}
            </p>
        </button>
    );
}

function AiBriefForm({
    description,
    onDescriptionChange,
    uploadedFiles,
    onFilesChange,
    generatedBrief,
    briefResult,
    isBriefSelected,
    isRegenerating,
    onGenerateBrief,
    onRegenerateBrief,
    onUseBrief,
    onChangeBriefData,
}: {
    description: string;
    onDescriptionChange: (value: string) => void;
    uploadedFiles: File[];
    onFilesChange: (files: File[]) => void;
    generatedBrief: string;
    briefResult: BriefResultData;
    isBriefSelected: boolean;
    isRegenerating: boolean;
    onGenerateBrief: () => void;
    onRegenerateBrief: () => void;
    onUseBrief: () => void;
    onChangeBriefData: (data: BriefResultData) => void;
}) {
    return (
        <SectionCard
            title="Smart Brief Builder"
            description="AI hanya membantu menyusun gambaran awal. Solusi final tetap akan divalidasi oleh tim VMatch."
        >
            <div className="space-y-4">
                <FormField label="Deskripsi kebutuhan proyek">
                    <textarea
                        rows={6}
                        value={description}
                        onChange={(event) => onDescriptionChange(event.target.value)}
                        className={textareaClass}
                        placeholder="Contoh: Saya ingin wardrobe custom untuk kamar utama. Ukuran ruangan tidak terlalu besar, jadi saya ingin lemari hemat tempat dengan banyak ruang penyimpanan..."
                    />
                </FormField>

                <UploadBox
                    uploadedFiles={uploadedFiles}
                    onFilesChange={onFilesChange}
                />

                <button
                    type="button"
                    onClick={onGenerateBrief}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D3530] px-5 text-[12px] font-semibold text-white transition hover:bg-[#2C2C2C]"
                >
                    <Send size={15} />
                    Buat Brief Awal
                </button>

                {generatedBrief && (
                    <BriefResultCard
                        data={briefResult}
                        isSelected={isBriefSelected}
                        isRegenerating={isRegenerating}
                        onChangeData={onChangeBriefData}
                        onUseBrief={onUseBrief}
                        onRegenerate={onRegenerateBrief}
                    />
                )}
            </div>
        </SectionCard>
    );
}

function ManualBriefForm({
    form,
    selectedInspiration,
    onRemoveReference,
    onChange,
}: {
    form: ManualFormState;
    selectedInspiration: SelectedInspiration | null;
    onRemoveReference: () => void;
    onChange: (key: keyof ManualFormState, value: string) => void;
}) {
    return (
        <div className="grid gap-5">
            {selectedInspiration && (
                <section className="rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725F54]">
                                Referensi dari Inspirasi Desain
                            </p>

                            <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C]">
                                {selectedInspiration.referenceName}
                            </h2>

                            <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#7A7067]">
                                Kamu menggunakan referensi “{selectedInspiration.referenceName}”
                                sebagai preferensi awal. Semua data di bawah masih bisa diedit
                                sebelum request dikirim.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onRemoveReference}
                            className="h-10 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-white"
                        >
                            Hapus Referensi
                        </button>
                    </div>
                </section>
            )}

            <SectionCard title="Informasi Proyek">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nama proyek">
                        <input
                            value={form.projectName}
                            onChange={(event) => onChange("projectName", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Storage & Rak Modern Minimalis"
                        />
                    </FormField>

                    <FormField label="Jenis proyek">
                        <input
                            value={form.projectType}
                            onChange={(event) => onChange("projectType", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Kitchen Set / Wardrobe"
                        />
                    </FormField>

                    <FormField label="Style desain">
                        <input
                            value={form.designStyle}
                            onChange={(event) => onChange("designStyle", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Modern minimalis"
                        />
                    </FormField>

                    <FormField label="Lokasi proyek">
                        <input
                            value={form.location}
                            onChange={(event) => onChange("location", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Semarang"
                        />
                    </FormField>

                    <FormField label="Estimasi budget">
                        <input
                            value={form.budget}
                            onChange={(event) => onChange("budget", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Rp15–35 juta"
                        />
                    </FormField>

                    <FormField label="Referensi desain">
                        <input
                            value={form.referenceName}
                            onChange={(event) => onChange("referenceName", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: Storage & Rak"
                        />
                    </FormField>
                </div>
            </SectionCard>

            <SectionCard title="Preferensi Material">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Preferensi material">
                        <input
                            value={form.materialPreference}
                            onChange={(event) =>
                                onChange("materialPreference", event.target.value)
                            }
                            className={fieldClass}
                            placeholder="Contoh: HPL, plywood, MDF"
                        />
                    </FormField>

                    <FormField label="Paket material">
                        <input
                            value={form.materialPackage}
                            onChange={(event) =>
                                onChange("materialPackage", event.target.value)
                            }
                            className={fieldClass}
                            placeholder="Contoh: Standard"
                        />
                    </FormField>
                </div>
            </SectionCard>

            <SectionCard
                title="Target Waktu"
                description="Jadwal ini adalah preferensi awal, bukan jadwal final."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Target mulai pengerjaan">
                        <select
                            value={form.startTarget}
                            onChange={(event) => onChange("startTarget", event.target.value)}
                            className={fieldClass}
                        >
                            <option>Secepatnya</option>
                            <option>Minggu depan</option>
                            <option>Bulan depan</option>
                            <option>Pilih tanggal sendiri</option>
                        </select>
                    </FormField>

                    <FormField label="Target selesai">
                        <select
                            value={form.finishTarget}
                            onChange={(event) => onChange("finishTarget", event.target.value)}
                            className={fieldClass}
                        >
                            <option>Fleksibel</option>
                            <option>Dalam 2 minggu</option>
                            <option>Dalam 1 bulan</option>
                            <option>Dalam 2-3 bulan</option>
                        </select>
                    </FormField>
                </div>
            </SectionCard>

            <SectionCard title="Catatan Tambahan">
                <FormField label="Catatan awal proyek">
                    <textarea
                        rows={5}
                        value={form.notes}
                        onChange={(event) => onChange("notes", event.target.value)}
                        className={textareaClass}
                        placeholder="Tulis kebutuhan, preferensi, atau catatan awal proyek..."
                    />
                </FormField>
            </SectionCard>
        </div>
    );
}

function UploadBox({
    uploadedFiles,
    onFilesChange,
}: {
    uploadedFiles: File[];
    onFilesChange: (files: File[]) => void;
}) {
    return (
        <div>
            <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9BD] bg-[#F8F6F2] p-7 text-center transition hover:border-[#6B5B52] hover:bg-[#F5F0EA]">
                <Camera size={22} className="text-[#6B5B52]" />

                <span className="mt-2 text-[13px] font-semibold text-[#3D3530]">
                    Upload referensi desain
                </span>

                <span className="mt-1 text-[11px] text-[#8B8179]">
                    Opsional, JPG/PNG/WEBP/PDF
                </span>

                <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        onFilesChange(files);
                    }}
                />
            </label>

            {uploadedFiles.length > 0 && (
                <div className="mt-3 rounded-2xl bg-[#F8F6F2] p-4">
                    <p className="text-[12px] font-semibold text-[#6B5B52]">
                        {uploadedFiles.length} file dipilih
                    </p>

                    <div className="mt-2 space-y-1">
                        {uploadedFiles.map((file) => (
                            <p
                                key={file.name}
                                className="truncate text-[12px] text-[#7A7067]"
                            >
                                {file.name}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}