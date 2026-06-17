"use client";

import { useMemo, useState } from "react";
import {
    ChevronDown,
    FileText,
    FolderKanban,
    ImagePlus,
    Send,
} from "lucide-react";

import {
    progressLogs as initialProgressLogs,
    vendorProjects,
} from "../mock-data";
import type { ProgressLog, ProgressLogStatus } from "../types";
import {
    VendorActionButton,
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

export function ProgressLogView() {
    const [selectedProjectId, setSelectedProjectId] = useState(
        vendorProjects[0]?.id ?? "",
    );
    const [logs, setLogs] = useState<ProgressLog[]>(initialProgressLogs);
    const [status, setStatus] = useState<ProgressLogStatus>("Sesuai Jadwal");
    const [progressPercent, setProgressPercent] = useState("70");
    const [workSummary, setWorkSummary] = useState("");
    const [issue, setIssue] = useState("");
    const [nextPlan, setNextPlan] = useState("");
    const [photoLabel, setPhotoLabel] = useState("Foto progress terbaru");

    const selectedProject = vendorProjects.find(
        (project) => project.id === selectedProjectId,
    );

    const projectLogs = useMemo(() => {
        return logs.filter((log) => log.projectId === selectedProjectId);
    }, [logs, selectedProjectId]);

    const latestLog = projectLogs[0];

    const handleSubmit = () => {
        if (!selectedProject || !workSummary.trim()) return;

        const newLog: ProgressLog = {
            id: `log-${logs.length + 1}`,
            projectId: selectedProject.id,
            projectName: selectedProject.name,
            date: "Hari ini",
            status,
            progressPercent: Number(progressPercent) || selectedProject.progress,
            workSummary: workSummary.trim(),
            issue: issue.trim() || "Tidak ada kendala.",
            nextPlan: nextPlan.trim() || "Menunggu arahan berikutnya dari VMatch.",
            photoLabel: photoLabel.trim() || "Foto progress terbaru",
        };

        setLogs((current) => [newLog, ...current]);
        setWorkSummary("");
        setIssue("");
        setNextPlan("");
        setPhotoLabel("Foto progress terbaru");
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
                                            className="h-12 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-12 text-[14px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
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
                            <div className="grid gap-2 sm:grid-cols-3">
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

                            <button
                                type="button"
                                className="h-9 rounded-xl border border-[#E4D8CD] bg-white px-3.5 text-[11px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                            >
                                Pilih Berkas
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <VendorActionButton
                                icon={Send}
                                label="Kirim Log"
                                primary
                                onClick={handleSubmit}
                                disabled={!selectedProject || !workSummary.trim()}
                            />
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