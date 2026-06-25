"use client";

import {
    Bot,
    Camera,
    CheckCircle2,
    ChevronDown,
    FileText,
    Send,
    X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { fieldClass, FormField, SectionCard, textareaClass } from "./shared";
import { toast } from "sonner";
import {
    BriefResultCard,
    ReviewSubmitCard,
    type BriefResultData,
} from "./brief-result-card";
import { createProjectRequest } from "@/lib/api/projects";
import { uploadFileToStorage } from "@/lib/api/storage";

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
    roomSize: string;
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
        roomSize: "",
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
    roomSize: "",
    budget: "Rp60–100 juta",
    materialPreference: "",
    materialPackage: "",
    referenceName: "",
    notes: "",
    startTarget: "Secepatnya",
    finishTarget: "Fleksibel",
};

export function NewProjectForm({ userId, onSubmitSuccess }: { userId: string; onSubmitSuccess?: () => void }) {
    const [storedInspiration] = useState<SelectedInspiration | null>(() =>
        getStoredInspiration(),
    );

    const [mode, setMode] = useState<"ai" | "manual">(
        storedInspiration ? "manual" : "ai",
    );

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
        useState<BriefResultData | null>(null);

    const [isBriefSelected, setIsBriefSelected] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
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
        if (manualForm.designStyle.trim()) score += 8;
        if (manualForm.roomSize.trim()) score += 8;
        if (manualForm.budget.trim()) score += 8;
        if (manualForm.materialPreference.trim()) score += 8;
        if (manualForm.materialPackage.trim()) score += 6;
        if (manualForm.notes.trim()) score += 8;
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

    const handleGenerateBrief = async () => {
        if (!aiDescription.trim()) {
            toast.error("Isi deskripsi kebutuhan proyek dulu ya.");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch("/api/ai/brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: aiDescription }),
            });

            if (!response.ok) throw new Error("Gagal membuat brief");

            const { data } = await response.json();
            
            setGeneratedBrief("generated");
            setBriefResult(data);
            setIsBriefSelected(false);
            setRequestStatus("draft");
            toast.success("Brief awal berhasil dibuat.");
        } catch (error) {
            toast.error("Terjadi kesalahan saat membuat brief awal.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateBrief = async () => {
        if (!generatedBrief) {
            toast.error("Buat brief awal dulu sebelum analisis ulang.");
            return;
        }

        setIsRegenerating(true);

        try {
            const response = await fetch("/api/ai/brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: aiDescription + " Tolong buat lebih detail." }),
            });

            if (!response.ok) throw new Error("Gagal regenerasi brief");

            const { data } = await response.json();
            
            setBriefResult(data);
            setIsBriefSelected(false);
            setRequestStatus("draft");
            toast.success("Brief berhasil dianalisis ulang.");
        } catch (error) {
            toast.error("Terjadi kesalahan saat menganalisis ulang brief.");
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleUseBrief = () => {
        setIsBriefSelected(true);
        setRequestStatus("selected");
        toast.success(
            "Brief ini sudah dipilih untuk review. Ini belum mengirim request proyek.",
        );
    };

    const handleChangeBriefData = (data: BriefResultData) => {
        setBriefResult(data);
        setIsBriefSelected(false);
        setRequestStatus("draft");
        toast.success("Perubahan brief berhasil disimpan.");
    };

    const handleSaveDraft = async () => {
        setIsGenerating(true);
        try {
            let uploadedFileUrls: string[] = [];
            if (uploadedFiles.length > 0) {
                uploadedFileUrls = await Promise.all(
                    uploadedFiles.map(async (file) => {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                        const filePath = `${userId}/requests/${fileName}`;
                        return await uploadFileToStorage("vmatch-files", filePath, file);
                    })
                );
            }

            await createProjectRequest({
                customer_id: userId,
                project_name: mode === "ai" ? (briefResult?.summary?.slice(0, 50) || "Proyek Baru") : manualForm.projectName,
                project_type: mode === "ai" ? "Belum ditentukan" : manualForm.projectType,
                design_style: manualForm.designStyle || null,
                location: manualForm.location || "Belum ditentukan",
                room_size: manualForm.roomSize || null,
                budget: manualForm.budget || null,
                material_preference: manualForm.materialPreference || null,
                material_package: manualForm.materialPackage || null,
                reference_name: manualForm.referenceName || null,
                start_target: manualForm.startTarget || null,
                finish_target: manualForm.finishTarget || null,
                notes: manualForm.notes || null,
                ai_description: mode === "ai" ? aiDescription : null,
                ai_brief_summary: mode === "ai" ? (briefResult?.summary || null) : null,
                inspiration_reference: selectedInspiration?.referenceName || null,
                status: "Baru Masuk",
                // @ts-ignore
                uploaded_files: uploadedFileUrls.length > 0 ? uploadedFileUrls : null
            });
            toast.success("Draft berhasil disimpan ke database.");
            if (onSubmitSuccess) {
                setTimeout(() => {
                    onSubmitSuccess();
                }, 1500);
            }
        } catch {
            toast.error("Gagal menyimpan draft. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitRequest = async () => {
        if (mode === "ai") {
            if (!generatedBrief || !isBriefSelected) {
                toast.error("Silakan buat dan setujui brief AI terlebih dahulu.");
                return;
            }
        } else {
            if (!manualForm.projectName.trim()) {
                toast.error("Nama proyek wajib diisi.");
                return;
            }
            if (!manualForm.location.trim()) {
                toast.error("Lokasi proyek wajib diisi.");
                return;
            }
            if (!manualForm.roomSize.trim()) {
                toast.error("Ukuran ruangan wajib diisi.");
                return;
            }
        }

        setIsGenerating(true);
        try {
            let uploadedFileUrls: string[] = [];
            if (uploadedFiles.length > 0) {
                uploadedFileUrls = await Promise.all(
                    uploadedFiles.map(async (file) => {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                        const filePath = `${userId}/requests/${fileName}`;
                        return await uploadFileToStorage("vmatch-files", filePath, file);
                    })
                );
            }

            await createProjectRequest({
                customer_id: userId,
                project_name: mode === "ai" ? (briefResult?.summary?.slice(0, 50) || "Proyek Baru") : manualForm.projectName,
                project_type: mode === "ai" ? "Belum ditentukan" : manualForm.projectType,
                design_style: manualForm.designStyle || null,
                location: manualForm.location || "Belum ditentukan",
                room_size: manualForm.roomSize || null,
                budget: manualForm.budget || null,
                material_preference: manualForm.materialPreference || null,
                material_package: manualForm.materialPackage || null,
                reference_name: manualForm.referenceName || null,
                start_target: manualForm.startTarget || null,
                finish_target: manualForm.finishTarget || null,
                notes: manualForm.notes || null,
                ai_description: mode === "ai" ? aiDescription : null,
                ai_brief_summary: mode === "ai" ? (briefResult?.summary || null) : null,
                ai_brief_recommendations: mode === "ai" ? (briefResult?.recommendations?.join("\n") || null) : null,
                inspiration_reference: selectedInspiration?.referenceName || null,
                status: "Baru Masuk",
                // @ts-ignore
                uploaded_files: uploadedFileUrls.length > 0 ? uploadedFileUrls : null
            });

            setRequestStatus("submitted");
            toast.success(
                "Request proyek berhasil dikirim dan sedang menunggu review tim VMatch.",
            );
            if (onSubmitSuccess) {
                setTimeout(() => {
                    onSubmitSuccess();
                }, 1500);
            }
        } catch {
            toast.error("Gagal mengirim request. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };


    const handleRemoveReference = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }

        setSelectedInspiration(null);
        setManualForm(defaultManualForm);
        setRequestStatus("draft");
        toast.success("Referensi inspirasi berhasil dihapus.");
    };

    return (
        <div className="w-full space-y-6">

            <section className="pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B8179]">
                    Request Proyek
                </p>

                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#3D3530] sm:text-[42px]">
                    Ajukan Proyek
                </h1>

                <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7A7067]">
                    Pilih mode input sesuai kebutuhan kamu. Data ini adalah brief awal, bukan
                    solusi final.
                </p>
            </section>

            <section className="rounded-2xl border border-[#E8E2D9] bg-white p-1.5 shadow-[0_8px_24px_rgba(49,51,44,0.04)]">
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={() => {
                            setMode("ai");
                        }}
                        className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-[12px] font-semibold transition sm:px-4 sm:text-[13px] ${mode === "ai"
                            ? "bg-[#6B5B52] text-white shadow-[0_10px_24px_rgba(107,91,82,0.22)]"
                            : "bg-white text-[#6B5B52] hover:bg-[#F8F6F2]"
                            }`}
                    >
                        <Bot size={16} className="shrink-0" />
                        <span className="truncate">VMatch AI</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode("manual");
                        }}
                        className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-[12px] font-semibold transition sm:px-4 sm:text-[13px] ${mode === "manual"
                            ? "bg-[#6B5B52] text-white shadow-[0_10px_24px_rgba(107,91,82,0.22)]"
                            : "bg-white text-[#6B5B52] hover:bg-[#F8F6F2]"
                            }`}
                    >
                        <FileText size={16} className="shrink-0" />
                        <span className="truncate">Manual Detail</span>
                    </button>
                </div>
            </section>

            {mode === "ai" ? (
                <AiBriefForm
                    description={aiDescription}
                    onDescriptionChange={setAiDescription}
                    uploadedFiles={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                    generatedBrief={generatedBrief}
                    isGenerating={isGenerating}
                    onGenerateBrief={handleGenerateBrief}
                >
                    {generatedBrief && briefResult && (
                        <BriefResultCard
                            data={briefResult}
                            isSelected={isBriefSelected}
                            isRegenerating={isRegenerating}
                            onChangeData={handleChangeBriefData}
                            onUseBrief={handleUseBrief}
                            onRegenerate={handleRegenerateBrief}
                        />
                    )}
                </AiBriefForm>
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

            <section className="w-full">
                <ReviewSubmitCard
                    hasGeneratedBrief={Boolean(generatedBrief || selectedInspiration)}
                    isBriefSelected={Boolean(isBriefSelected || selectedInspiration)}
                    requestStatus={requestStatus}
                    onCompleteData={() =>
                        toast.error("Silakan lengkapi bagian yang masih kosong pada form.")
                    }
                    onSaveDraft={handleSaveDraft}
                    onSubmitRequest={handleSubmitRequest}
                />
            </section>
        </div>
    );
}

function AiBriefForm({
    description,
    onDescriptionChange,
    uploadedFiles,
    onFilesChange,
    generatedBrief,
    isGenerating,
    onGenerateBrief,
    children,
}: {
    description: string;
    onDescriptionChange: (value: string) => void;
    uploadedFiles: File[];
    onFilesChange: (files: File[]) => void;
    generatedBrief: string;
    isGenerating: boolean;
    onGenerateBrief: () => void;
    children?: React.ReactNode;
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
                    disabled={isGenerating}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D3530] px-5 text-[12px] font-semibold text-white transition hover:bg-[#2C2C2C] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Send size={15} className={isGenerating ? "animate-bounce" : ""} />
                    {isGenerating ? "Membuat Brief..." : "Buat Brief Awal"}
                </button>

                {children}
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

                    <FormField label="Ukuran ruangan">
                        <input
                            value={form.roomSize}
                            onChange={(event) => onChange("roomSize", event.target.value)}
                            className={fieldClass}
                            placeholder="Contoh: 3m x 2.5m"
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
                        <div className="relative">
                            <select
                                value={form.startTarget}
                                onChange={(event) => onChange("startTarget", event.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] pl-4 pr-12 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                            >
                                <option>Secepatnya</option>
                                <option>Minggu depan</option>
                                <option>Bulan depan</option>
                                <option>Pilih tanggal sendiri</option>
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#725F54]"
                            />
                        </div>
                    </FormField>

                    <FormField label="Target selesai">
                        <div className="relative">
                            <select
                                value={form.finishTarget}
                                onChange={(event) => onChange("finishTarget", event.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] pl-4 pr-12 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                            >
                                <option>Fleksibel</option>
                                <option>Dalam 2 minggu</option>
                                <option>Dalam 1 bulan</option>
                                <option>Dalam 2-3 bulan</option>
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#725F54]"
                            />
                        </div>
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