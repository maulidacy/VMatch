"use client";

import {
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    ClipboardCheck,
    FileText,
    MapPin,
    PackageCheck,
    Save,
    Search,
    UserRound,
    Users,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type ProjectStatus =
    | "Berjalan"
    | "Menunggu Vendor"
    | "Butuh Review"
    | "QC"
    | "Selesai";

type ProjectTab = "Semua" | "Berjalan" | "Review" | "Selesai";

type ActiveProject = {
    id: string;
    title: string;
    customerName: string;
    vendorName: string;
    location: string;
    budget: string;
    projectType: string;
    startDate: string;
    targetDate: string;
    status: ProjectStatus;
    progress: number;
    currentStage: string;
    nextTask: string;
    adminNote: string;
    description: string;
};

const projectTabs: ProjectTab[] = ["Semua", "Berjalan", "Review", "Selesai"];

const statusOptions: ProjectStatus[] = [
    "Berjalan",
    "Menunggu Vendor",
    "Butuh Review",
    "QC",
    "Selesai",
];

const initialProjects: ActiveProject[] = [
    {
        id: "project-1",
        title: "Kitchen Set Minimalis",
        customerName: "Alya Putri",
        vendorName: "Kayu Rapi Interior",
        location: "Semarang",
        budget: "Rp23.500.000",
        projectType: "Kitchen Set",
        startDate: "3 Juli 2026",
        targetDate: "25 Juli 2026",
        status: "Berjalan",
        progress: 45,
        currentStage: "Produksi kabinet",
        nextTask: "Update foto progres produksi",
        adminNote: "Pastikan ukuran kabinet atas sesuai hasil survey terakhir.",
        description:
            "Proyek kitchen set minimalis untuk area dapur kecil dengan kabinet bawah, kabinet atas, dan finishing HPL warna natural.",
    },
    {
        id: "project-2",
        title: "Wardrobe Kamar Utama",
        customerName: "Bima Santoso",
        vendorName: "Mitra Interior Jogja",
        location: "Yogyakarta",
        budget: "Rp16.000.000",
        projectType: "Wardrobe",
        startDate: "5 Juli 2026",
        targetDate: "28 Juli 2026",
        status: "Butuh Review",
        progress: 30,
        currentStage: "Review desain final",
        nextTask: "Admin cek revisi desain dari vendor",
        adminNote: "Customer meminta tambahan area gantung baju panjang.",
        description:
            "Wardrobe built-in full plafon dengan pintu sliding, area gantung, rak lipat, dan storage tambahan.",
    },
    {
        id: "project-3",
        title: "Ruang Kerja Rumah",
        customerName: "Nadia Rahma",
        vendorName: "Studio Ruang Karya",
        location: "Solo",
        budget: "Rp10.500.000",
        projectType: "Ruang Kerja",
        startDate: "1 Juli 2026",
        targetDate: "18 Juli 2026",
        status: "QC",
        progress: 82,
        currentStage: "Quality control",
        nextTask: "Cek hasil pemasangan dan finishing",
        adminNote: "Periksa area rak dan meja sebelum serah terima.",
        description:
            "Pembuatan ruang kerja sederhana dengan meja custom, rak buku, storage kecil, dan konsep Scandinavian.",
    },
    {
        id: "project-4",
        title: "Backdrop TV Ruang Keluarga",
        customerName: "Raka Pratama",
        vendorName: "Warm Living Interior",
        location: "Semarang",
        budget: "Rp13.800.000",
        projectType: "Backdrop TV",
        startDate: "15 Juni 2026",
        targetDate: "10 Juli 2026",
        status: "Selesai",
        progress: 100,
        currentStage: "Selesai",
        nextTask: "Garansi dan dokumentasi akhir",
        adminNote: "Dokumentasi akhir sudah diterima.",
        description:
            "Backdrop TV ruang keluarga dengan kabinet bawah, panel dinding, dan aksen warna coklat muda.",
    },
];

export function ActiveProjectsView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [projects, setProjects] = useState<ActiveProject[]>(initialProjects);
    const [activeTab, setActiveTab] = useState<ProjectTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState(
        initialProjects[0]?.id ?? "",
    );
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

    const [adminNoteDraft, setAdminNoteDraft] = useState(
        initialProjects[0]?.adminNote ?? "",
    );
    const [isNoteSaved, setIsNoteSaved] = useState(false);

    const filteredProjects = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return projects.filter((project) => {
            const matchTab =
                activeTab === "Semua" ||
                (activeTab === "Berjalan" &&
                    ["Berjalan", "Menunggu Vendor"].includes(project.status)) ||
                (activeTab === "Review" &&
                    ["Butuh Review", "QC"].includes(project.status)) ||
                (activeTab === "Selesai" && project.status === "Selesai");

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                project.title.toLowerCase().includes(normalizedKeyword) ||
                project.customerName.toLowerCase().includes(normalizedKeyword) ||
                project.vendorName.toLowerCase().includes(normalizedKeyword) ||
                project.location.toLowerCase().includes(normalizedKeyword) ||
                project.projectType.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, projects]);

    const selectedProject = useMemo(() => {
        return (
            projects.find((project) => project.id === selectedProjectId) ??
            filteredProjects[0] ??
            projects[0]
        );
    }, [filteredProjects, projects, selectedProjectId]);

    const updateSelectedProject = (
        field: keyof ActiveProject,
        value: string | number | ProjectStatus,
    ) => {
        if (!selectedProject) return;

        setProjects((current) =>
            current.map((project) =>
                project.id === selectedProject.id
                    ? {
                        ...project,
                        [field]: value,
                    }
                    : project,
            ),
        );
    };

    const updateStatus = (status: ProjectStatus) => {
        updateSelectedProject("status", status);

        if (status === "Selesai") {
            updateSelectedProject("progress", 100);
        }
    };

    const handleSelectProject = (id: string) => {
        const nextProject = projects.find((project) => project.id === id);

        setSelectedProjectId(id);
        setAdminNoteDraft(nextProject?.adminNote ?? "");
        setIsNoteSaved(false);
        setIsMobileDetailOpen(true);
    };

    if (!selectedProject) {
        return null;
    }

    const isAdminNoteChanged = adminNoteDraft !== selectedProject.adminNote;

    return (
        <div className="space-y-5">
            <section className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
                <div
                    className={`space-y-4 ${isMobileDetailOpen ? "hidden xl:block" : "block"
                        }`}
                >
                    <div className="space-y-4">
                        <div>
                            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                                Daftar Proyek
                            </h1>

                            <p className="mt-2 text-[12px] text-[#7B756E]">
                                Pilih proyek untuk melihat progress dan detail pengerjaan.
                            </p>
                        </div>

                        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-3">
                            <Search size={16} className="shrink-0 text-[#9A8F86]" />

                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Cari proyek..."
                                className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                            />
                        </div>

                        <div className="relative sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(event) =>
                                    setActiveTab(event.target.value as ProjectTab)
                                }
                                className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                            >
                                {projectTabs.map((tab) => (
                                    <option key={tab} value={tab}>
                                        {tab}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                            />
                        </div>

                        <div className="hidden rounded-2xl border border-[#E8E2D9] bg-white p-1.5 sm:block">
                            <div className="grid grid-cols-4 gap-1.5">
                                {projectTabs.map((tab) => {
                                    const active = activeTab === tab;

                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl px-2 text-[12px] font-semibold transition ${active
                                                ? "bg-[#725F54] text-white shadow-sm"
                                                : "text-[#6F6860] hover:bg-[#F8F6F2]"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-3 xl:max-h-[calc(100vh-210px)] xl:overflow-y-auto xl:pr-1">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        selected={selectedProject.id === project.id}
                                        onClick={() => handleSelectProject(project.id)}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center">
                                    <p className="text-[13px] font-semibold text-[#31332C]">
                                        Proyek tidak ditemukan.
                                    </p>

                                    <p className="mt-1 text-[12px] text-[#7B756E]">
                                        Coba ubah filter atau kata pencarian.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`space-y-5 ${isMobileDetailOpen ? "block" : "hidden xl:block"
                        }`}
                >
                    <button
                        type="button"
                        onClick={() => setIsMobileDetailOpen(false)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] xl:hidden"
                    >
                        <ArrowLeft size={15} />
                        Kembali ke daftar
                    </button>

                    <AdminSectionCard title="Detail Proyek">
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        {selectedProject.projectType}
                                    </p>

                                    <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[30px]">
                                        {selectedProject.title}
                                    </h2>
                                </div>

                                <ProjectStatusBadge status={selectedProject.status} />
                            </div>

                            <p className="text-[13px] leading-7 text-[#7B756E]">
                                {selectedProject.description}
                            </p>

                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                                <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[12px] font-semibold text-[#31332C]">
                                                Progress Proyek
                                            </p>

                                            <p className="mt-1 text-[11px] text-[#7B756E]">
                                                Tahap saat ini: {selectedProject.currentStage}
                                            </p>
                                        </div>

                                        <p className="font-serif text-[28px] leading-none text-[#725F54]">
                                            {selectedProject.progress}%
                                        </p>
                                    </div>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                                        <div
                                            className="h-full rounded-full bg-[#725F54]"
                                            style={{ width: `${selectedProject.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Status Proyek
                                    </label>

                                    <div className="relative mt-3">
                                        <select
                                            value={selectedProject.status}
                                            onChange={(event) =>
                                                updateStatus(event.target.value as ProjectStatus)
                                            }
                                            className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <InfoTile
                                    icon={UserRound}
                                    label="Customer"
                                    value={selectedProject.customerName}
                                    description={selectedProject.projectType}
                                />

                                <InfoTile
                                    icon={Users}
                                    label="Vendor"
                                    value={selectedProject.vendorName}
                                    description="Vendor partner"
                                />

                                <InfoTile
                                    icon={MapPin}
                                    label="Lokasi"
                                    value={selectedProject.location}
                                    description="Area proyek"
                                />

                                <InfoTile
                                    icon={Wallet}
                                    label="Nilai Proyek"
                                    value={selectedProject.budget}
                                    description="Estimasi/RAB"
                                />

                                <InfoTile
                                    icon={CalendarDays}
                                    label="Mulai"
                                    value={selectedProject.startDate}
                                    description="Tanggal mulai"
                                />

                                <InfoTile
                                    icon={PackageCheck}
                                    label="Target"
                                    value={selectedProject.targetDate}
                                    description="Target selesai"
                                />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Tugas Terdekat
                                    </p>

                                    <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                                        {selectedProject.nextTask}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                Catatan Admin
                                            </p>
                                        </div>

                                        {isNoteSaved && (
                                            <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
                                                Tersimpan
                                            </span>
                                        )}
                                    </div>

                                    <textarea
                                        value={adminNoteDraft}
                                        onChange={(event) => {
                                            setAdminNoteDraft(event.target.value);
                                            setIsNoteSaved(false);
                                        }}
                                        rows={4}
                                        placeholder="Tambahkan catatan progress proyek..."
                                        className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                    />

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateSelectedProject("adminNote", adminNoteDraft);
                                                setIsNoteSaved(true);
                                            }}
                                            disabled={!isAdminNoteChanged}
                                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isAdminNoteChanged
                                                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                                                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                                                }`}
                                        >
                                            <Save size={14} />
                                            Simpan Catatan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminSectionCard>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <ActionButton
                            icon={FileText}
                            title="Buka Brief"
                            description="Lihat brief dan dokumen kerja."
                            onClick={() => onChangePage?.("documents")}
                        />

                        <ActionButton
                            icon={ClipboardCheck}
                            title="Progress & QC"
                            description="Cek log progress dan quality control."
                            onClick={() => onChangePage?.("progress-qc")}
                        />

                        <ActionButton
                            icon={Wallet}
                            title="Invoice"
                            description="Lihat invoice dan pembayaran proyek."
                            onClick={() => onChangePage?.("payments")}
                        />
                    </div>
                </div>
            </section >
        </div >
    );
}

function ProjectCard({
    project,
    selected,
    onClick,
}: {
    project: ActiveProject;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-2xl border p-4 text-left transition ${selected
                ? "border-[#D9C8BA] bg-[#FFFDF9] shadow-[0_8px_24px_rgba(49,51,44,0.04)]"
                : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[#31332C]">
                        {project.title}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {project.customerName} • {project.location}
                    </p>
                </div>

                <ProjectStatusBadge status={project.status} />
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-[#7B756E]">
                        Progress
                    </span>

                    <span className="text-[11px] font-semibold text-[#725F54]">
                        {project.progress}%
                    </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                    <div
                        className="h-full rounded-full bg-[#725F54]"
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            <p className="mt-3 truncate text-[12px] text-[#7B756E]">
                {project.currentStage}
            </p>
        </button>
    );
}

function InfoTile({
    icon: Icon,
    label,
    value,
    description,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
                    <Icon size={16} />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-[13px] font-semibold text-[#31332C]">
                        {value}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-[#7B756E]">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ActionButton({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left transition hover:border-[#D9C8BA] hover:bg-[#FCFBF9]"
        >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54] ring-1 ring-[#E8E2D9]">
                <Icon size={16} />
            </div>

            <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                    {description}
                </p>
            </div>
        </button>
    );
}

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
    const style =
        status === "Berjalan"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : status === "Menunggu Vendor" ||
                status === "Butuh Review" ||
                status === "QC"
                ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                : "border-[#E8E2D9] bg-white text-[#7B756E]";

    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}