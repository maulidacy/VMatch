"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    FileText,
    FolderKanban,
    ImagePlus,
    Send,
} from "lucide-react";
import { toast } from "sonner";

import { getMyProjects, getProgressLogs, createProgressLog } from "@/lib/api/projects";
import { uploadFileToStorage } from "@/lib/api/storage";
import type { Project as DBProject, ProgressLog as DBProgressLog } from "@/lib/supabase/types";
import type { ProgressLog, ProgressLogStatus } from "../types";
import {
    VendorEmptyState,
    VendorField,
    VendorListRow,
    VendorProgressBar,
    VendorSectionCard,
    VendorStatusBadge,
    vendorFieldClass,
    vendorTextareaClass,
} from "./shared";

const statusOptions: ProgressLogStatus[] = [
    "Sesuai Jadwal",
    "Ada Kendala",
    "Tidak Ada Pekerjaan Hari Ini",
];

type SimpleProject = { id: string; name: string; progress: number; status: string; deadline: string };

function mapDbLog(l: DBProgressLog): ProgressLog {
    const date = l.log_date
        ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(l.log_date))
        : "Hari ini";
    return {
        id: l.id,
        projectId: l.project_id,
        projectName: "",
        date,
        status: l.status as ProgressLogStatus,
        progressPercent: l.progress_percent,
        workSummary: l.work_summary,
        issue: l.issue || "Tidak ada kendala.",
        nextPlan: l.next_plan || "-",
        photoLabel: l.photo_label || "Foto progress",
    };
}

export function ProgressLogView({ vendorId }: { vendorId: string }) {
    const [vendorProjects, setVendorProjects] = useState<SimpleProject[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [logs, setLogs] = useState<ProgressLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<ProgressLogStatus>("Sesuai Jadwal");
    const [progressPercent, setProgressPercent] = useState("70");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const dbProjects = await getMyProjects(vendorId);
            const simpleProjects: SimpleProject[] = dbProjects.map((p: DBProject) => ({
                id: p.id, name: p.title, progress: p.progress, status: p.status, deadline: p.estimated_finish || "Belum ditentukan",
            }));
            setVendorProjects(simpleProjects);
            if (simpleProjects.length > 0) {
                setSelectedProjectId(simpleProjects[0].id);
                // Load logs for first project
                const dbLogs = await getProgressLogs(simpleProjects[0].id);
                setLogs(dbLogs.map(mapDbLog));
            }
        } catch {
            // silent
        } finally {
            setIsLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // When project selection changes, reload logs
    useEffect(() => {
        if (!selectedProjectId) return;
        async function loadLogs() {
            try {
                const dbLogs = await getProgressLogs(selectedProjectId);
                setLogs(dbLogs.map(mapDbLog));
            } catch { /* silent */ }
        }
        loadLogs();
    }, [selectedProjectId]);
    const [workSummary, setWorkSummary] = useState("");
    const [issue, setIssue] = useState("");
    const [nextPlan, setNextPlan] = useState("");
    const [photoLabel, setPhotoLabel] = useState("Foto progress terbaru");
    const [isUploading, setIsUploading] = useState(false);

    const selectedProject = vendorProjects.find(
        (project) => project.id === selectedProjectId,
    );

    const projectLogs = useMemo(() => {
        return logs.filter((log) => log.projectId === selectedProjectId);
    }, [logs, selectedProjectId]);

    const latestLog = projectLogs[0];

    const handleSubmit = async () => {
        if (!selectedProject || !workSummary.trim()) return;

        try {
            await createProgressLog({
                project_id: selectedProject.id,
                vendor_id: vendorId,
                status,
                progress_percent: Number(progressPercent) || selectedProject.progress,
                work_summary: workSummary.trim(),
                issue: issue.trim() || "Tidak ada kendala.",
                next_plan: nextPlan.trim() || "Menunggu arahan berikutnya dari VMatch.",
                photo_label: photoLabel.trim() || "Foto progress terbaru",
            });

            // Reload logs from DB
            const dbLogs = await getProgressLogs(selectedProjectId);
            setLogs(dbLogs.map(mapDbLog));

            setWorkSummary("");
            setIssue("");
            setNextPlan("");
            setPhotoLabel("Foto progress terbaru");
            toast.success("Log progress berhasil dikirim.");
        } catch {
            toast.error("Gagal mengirim log progress.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedProjectId) return;

        setIsUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const filePath = `progress/${selectedProjectId}/${Date.now()}.${ext}`;
            const url = await uploadFileToStorage("vmatch-files", filePath, file);
            
            setPhotoLabel(file.name);
            toast.success(`File ${file.name} berhasil diunggah.`);
        } catch (error) {
            toast.error("Gagal mengunggah file ke storage.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <section className="pb-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
                    Progress Update
                </p>

                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                    Log Progress
                </h1>

                <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#7B756E]">
                    Kirim update pekerjaan, kendala, dan rencana berikutnya agar VMatch
                    bisa memantau progress proyek dengan jelas.
                </p>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                <VendorSectionCard
                    title="Kirim Update Baru"
                    description="Isi ringkasan pekerjaan yang benar-benar sudah dilakukan."
                >
                    <div className="space-y-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="w-full sm:max-w-[420px]">
                                <VendorField label="Pilih Proyek">
                                    <div className="relative">
                                        <select
                                            value={selectedProjectId}
                                            onChange={(event) => setSelectedProjectId(event.target.value)}
                                            className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-12 text-[13px] font-medium text-[#31332C] outline-none focus:border-[#725F54]"
                                        >
                                            {vendorProjects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={18}
                                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                                        />
                                    </div>
                                </VendorField>
                            </div>

                            {selectedProject && (
                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                    <VendorStatusBadge status={selectedProject.status} />

                                    <span className="rounded-full border border-[#E8E2D9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#7B756E]">
                                        Deadline {selectedProject.deadline}
                                    </span>
                                </div>
                            )}
                        </div>

                        <VendorField label="Status Pekerjaan">
                            <div className="grid gap-3 sm:grid-cols-3">
                                {statusOptions.map((item) => {
                                    const active = status === item;

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setStatus(item)}
                                            className={`min-h-10 rounded-xl border px-3 text-[12px] font-semibold transition ${active
                                                ? "border-[#725F54] bg-[#725F54] text-white"
                                                : "border-[#E4D8CD] bg-white text-[#725F54] hover:bg-[#FCFBF9]"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </VendorField>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <VendorField label="Progress Saat Ini (%)">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={progressPercent}
                                    onChange={(event) => setProgressPercent(event.target.value)}
                                    className={vendorFieldClass}
                                    placeholder="Contoh: 70"
                                />
                            </VendorField>

                            <VendorField label="Label Foto">
                                <input
                                    type="text"
                                    value={photoLabel}
                                    onChange={(event) => setPhotoLabel(event.target.value)}
                                    className={vendorFieldClass}
                                    placeholder="Contoh: Pemasangan kabinet"
                                />
                            </VendorField>
                        </div>

                        <VendorField label="Ringkasan Pekerjaan">
                            <textarea
                                value={workSummary}
                                onChange={(event) => setWorkSummary(event.target.value)}
                                className={vendorTextareaClass}
                                rows={3}
                                placeholder="Contoh: Kabinet atas sudah terpasang, finishing sisi kanan sudah selesai."
                            />
                        </VendorField>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <VendorField label="Kendala">
                                <textarea
                                    value={issue}
                                    onChange={(event) => setIssue(event.target.value)}
                                    className={vendorTextareaClass}
                                    rows={2}
                                    placeholder="Kosongkan jika tidak ada kendala."
                                />
                            </VendorField>

                            <VendorField label="Rencana Berikutnya">
                                <textarea
                                    value={nextPlan}
                                    onChange={(event) => setNextPlan(event.target.value)}
                                    className={vendorTextareaClass}
                                    rows={2}
                                    placeholder="Contoh: Melanjutkan finishing dan pengecekan ukuran."
                                />
                            </VendorField>
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#D9C8BA] bg-[#FFFDF9] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
                                    <ImagePlus size={16} />
                                </div>

                                <div>
                                    <p className="text-[12px] font-semibold text-[#31332C]">
                                        Foto Progress
                                    </p>

                                    <p className="text-[11px] leading-5 text-[#7B756E]">
                                        Upload foto masih mock pada prototype.
                                    </p>
                                </div>
                            </div>

                            <label className={`relative h-9 cursor-pointer rounded-xl border border-[#E4D8CD] bg-white px-3.5 text-[11px] font-semibold flex items-center text-[#725F54] transition hover:bg-[#FCFBF9] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {isUploading ? "Mengunggah..." : "Pilih Berkas"}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!workSummary.trim()}
                                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold transition sm:w-fit ${workSummary.trim()
                                        ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                                        : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                                    }`}
                            >
                                <Send size={15} />
                                Kirim Log
                            </button>
                        </div>
                    </div>
                </VendorSectionCard>

                <div className="space-y-5">
                    <VendorSectionCard title="Log Terakhir">
                        {latestLog ? (
                            <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <VendorStatusBadge status={latestLog.status} />

                                    <span className="text-[11px] text-[#A19B95]">
                                        {latestLog.date}
                                    </span>
                                </div>

                                <h3 className="mt-3 text-[14px] font-semibold text-[#31332C]">
                                    {latestLog.projectName}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-[#7B756E]">
                                    {latestLog.workSummary}
                                </p>

                                <div className="mt-4">
                                    <VendorProgressBar
                                        value={latestLog.progressPercent}
                                        label="Progress dilaporkan"
                                    />
                                </div>

                                <div className="mt-4 border-t border-[#E8E2D9] pt-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                        Rencana berikutnya
                                    </p>

                                    <p className="mt-1 text-[13px] leading-6 text-[#6F6860]">
                                        {latestLog.nextPlan}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <VendorEmptyState
                                icon={FileText}
                                title="Belum ada log"
                                description="Kirim update pertama melalui form di samping."
                            />
                        )}
                    </VendorSectionCard>

                    {selectedProject && (
                        <VendorSectionCard title="Ringkasan Proyek">
                            <div className="space-y-4">
                                <SummaryItem label="Proyek" value={selectedProject.name} />
                                <SummaryItem label="Deadline" value={selectedProject.deadline} />
                                <SummaryItem
                                    label="Progress Saat Ini"
                                    value={`${selectedProject.progress}%`}
                                    accent
                                />
                            </div>
                        </VendorSectionCard>
                    )}
                </div>
            </section>

            <VendorSectionCard title="Riwayat Log">
                {projectLogs.length > 0 ? (
                    <div className="grid gap-3">
                        {projectLogs.map((log) => (
                            <VendorListRow
                                key={log.id}
                                icon={FileText}
                                title={log.projectName}
                                description={log.workSummary}
                                meta={log.date}
                                status={log.status}
                                action={
                                    <span className="inline-flex h-8 items-center rounded-lg border border-[#E8E2D9] bg-[#FCFBF9] px-2.5 text-[11px] font-bold text-[#31332C]">
                                        {log.progressPercent}%
                                    </span>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <VendorEmptyState
                        icon={FolderKanban}
                        title="Riwayat kosong"
                        description="Belum ada log untuk proyek ini."
                    />
                )}
            </VendorSectionCard>
        </div>
    );
}

function SummaryItem({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="border-b border-[#E8E2D9] pb-4 last:border-b-0 last:pb-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7B756E]">
                {label}
            </p>

            <p
                className={`mt-1 text-[13px] leading-6 ${accent ? "font-semibold text-[#725F54]" : "font-medium text-[#31332C]"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}