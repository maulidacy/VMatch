"use client";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    FileText,
    Layers,
    Package,
    Paperclip,
    PenLine,
    Plus,
    Ruler,
    Save,
    Search,
    Send,
    Trash2,
    Upload,
    UserRound,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";

import { BriefMaterialForm } from "./brief-material-form";
import {
    BriefTimelineForm,
    type BriefTimelineInput,
} from "./brief-timeline-form";

type BriefStatus = "Draft" | "Siap Vendor" | "Revisi" | "Disetujui";

type BriefTab = "Semua" | "Draft" | "Siap Vendor" | "Revisi" | "Disetujui";

type BriefFile = {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
};

type BriefDocument = {
    id: string;
    projectTitle: string;
    customerName: string;
    vendorName: string;
    projectType: string;
    location: string;
    roomSize: string;
    budget: string;
    status: BriefStatus;
    createdAt: string;
    updatedAt: string;
    scope: string;
    materialNote: string;
    adminNote: string;
    vendorNote: string;
    timeline: {
        id: string;
        label: string;
        date: string;
    }[];
    materials: string[];
    files: BriefFile[];
    checklist: {
        id: string;
        label: string;
        completed: boolean;
    }[];
};

const briefTabs: BriefTab[] = [
    "Semua",
    "Draft",
    "Siap Vendor",
    "Revisi",
    "Disetujui",
];

const statusOptions: BriefStatus[] = [
    "Draft",
    "Siap Vendor",
    "Revisi",
    "Disetujui",
];

const initialBriefs: BriefDocument[] = [
    {
        id: "brief-1",
        projectTitle: "Kitchen Set Minimalis",
        customerName: "Alya Putri",
        vendorName: "Kayu Rapi Interior",
        projectType: "Kitchen Set",
        location: "Semarang",
        roomSize: "2.5m x 2m",
        budget: "Rp23.500.000",
        status: "Draft",
        createdAt: "3 Juli 2026",
        updatedAt: "Hari ini",
        scope:
            "Pembuatan kitchen set minimalis untuk area dapur kecil, meliputi kabinet bawah, kabinet atas, area penyimpanan, dan finishing HPL warna natural.",
        materialNote:
            "Material utama multiplek 18mm, finishing HPL motif kayu muda, top table solid surface, dan aksesoris soft close.",
        adminNote:
            "Pastikan ukuran kabinet atas mengikuti hasil survey terakhir dan tidak menutup area ventilasi.",
        vendorNote:
            "Vendor perlu mengirimkan gambar kerja final sebelum masuk tahap produksi.",
        timeline: [
            {
                id: "tl-1",
                label: "Survey & final ukuran",
                date: "3 Juli 2026",
            },
            {
                id: "tl-2",
                label: "Produksi kabinet",
                date: "6 - 18 Juli 2026",
            },
            {
                id: "tl-3",
                label: "Instalasi",
                date: "22 Juli 2026",
            },
        ],
        materials: ["Multiplek 18mm", "HPL kayu muda", "Solid surface", "Soft close"],
        files: [
            {
                id: "file-1",
                name: "brief-kitchen-set.pdf",
                type: "PDF",
                size: "1.2 MB",
                uploadedBy: "Admin",
                uploadedAt: "Hari ini",
            },
            {
                id: "file-2",
                name: "referensi-dapur.jpg",
                type: "Gambar",
                size: "850 KB",
                uploadedBy: "Customer",
                uploadedAt: "3 Juli 2026",
            },
        ],
        checklist: [
            {
                id: "check-1",
                label: "Kebutuhan customer sudah dirangkum",
                completed: true,
            },
            {
                id: "check-2",
                label: "Ukuran ruang sudah dicatat",
                completed: true,
            },
            {
                id: "check-3",
                label: "Material sudah disetujui",
                completed: false,
            },
            {
                id: "check-4",
                label: "Brief siap dikirim ke vendor",
                completed: false,
            },
        ],
    },
    {
        id: "brief-2",
        projectTitle: "Wardrobe Kamar Utama",
        customerName: "Bima Santoso",
        vendorName: "Mitra Interior Jogja",
        projectType: "Wardrobe",
        location: "Yogyakarta",
        roomSize: "3m x 3m",
        budget: "Rp16.000.000",
        status: "Siap Vendor",
        createdAt: "5 Juli 2026",
        updatedAt: "Kemarin",
        scope:
            "Pembuatan wardrobe built-in full plafon dengan pintu sliding, area gantung, rak lipat, dan storage tambahan.",
        materialNote:
            "Material multiplek 15mm, finishing HPL warna natural, rel sliding, dan handle minimalis.",
        adminNote:
            "Customer meminta tambahan area gantung baju panjang di sisi kiri wardrobe.",
        vendorNote:
            "Vendor diminta mengecek kembali layout bagian dalam sebelum produksi.",
        timeline: [
            {
                id: "tl-1",
                label: "Review brief",
                date: "5 Juli 2026",
            },
            {
                id: "tl-2",
                label: "Produksi",
                date: "8 - 20 Juli 2026",
            },
            {
                id: "tl-3",
                label: "Instalasi",
                date: "24 Juli 2026",
            },
        ],
        materials: ["Multiplek 15mm", "HPL natural", "Rel sliding", "Handle minimalis"],
        files: [
            {
                id: "file-3",
                name: "brief-wardrobe.pdf",
                type: "PDF",
                size: "980 KB",
                uploadedBy: "Admin",
                uploadedAt: "Kemarin",
            },
        ],
        checklist: [
            {
                id: "check-1",
                label: "Kebutuhan customer sudah dirangkum",
                completed: true,
            },
            {
                id: "check-2",
                label: "Ukuran ruang sudah dicatat",
                completed: true,
            },
            {
                id: "check-3",
                label: "Material sudah disetujui",
                completed: true,
            },
            {
                id: "check-4",
                label: "Brief siap dikirim ke vendor",
                completed: true,
            },
        ],
    },
    {
        id: "brief-3",
        projectTitle: "Ruang Kerja Rumah",
        customerName: "Nadia Rahma",
        vendorName: "Studio Ruang Karya",
        projectType: "Ruang Kerja",
        location: "Solo",
        roomSize: "2m x 3m",
        budget: "Rp10.500.000",
        status: "Revisi",
        createdAt: "1 Juli 2026",
        updatedAt: "2 hari lalu",
        scope:
            "Pembuatan meja kerja custom, rak buku, dan storage kecil dengan konsep Scandinavian yang sederhana dan terang.",
        materialNote:
            "Material multiplek, finishing HPL putih doff, aksen kayu muda, dan ambalan sederhana.",
        adminNote:
            "Customer meminta storage tambahan di sisi kanan meja kerja.",
        vendorNote:
            "Vendor perlu mengirim revisi layout sebelum brief disetujui.",
        timeline: [
            {
                id: "tl-1",
                label: "Revisi desain",
                date: "2 Juli 2026",
            },
            {
                id: "tl-2",
                label: "Final brief",
                date: "4 Juli 2026",
            },
            {
                id: "tl-3",
                label: "Produksi",
                date: "6 - 15 Juli 2026",
            },
        ],
        materials: ["Multiplek", "HPL putih doff", "Aksen kayu", "Ambalan"],
        files: [],
        checklist: [
            {
                id: "check-1",
                label: "Kebutuhan customer sudah dirangkum",
                completed: true,
            },
            {
                id: "check-2",
                label: "Ukuran ruang sudah dicatat",
                completed: true,
            },
            {
                id: "check-3",
                label: "Material sudah disetujui",
                completed: false,
            },
            {
                id: "check-4",
                label: "Brief siap dikirim ke vendor",
                completed: false,
            },
        ],
    },
];

export function BriefDocumentsView() {
    const [briefs, setBriefs] = useState<BriefDocument[]>(initialBriefs);
    const [activeTab, setActiveTab] = useState<BriefTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedBriefId, setSelectedBriefId] = useState(
        initialBriefs[0]?.id ?? "",
    );
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

    const [scopeDraft, setScopeDraft] = useState(initialBriefs[0]?.scope ?? "");
    const [adminNoteDraft, setAdminNoteDraft] = useState(
        initialBriefs[0]?.adminNote ?? "",
    );
    const [vendorNoteDraft, setVendorNoteDraft] = useState(
        initialBriefs[0]?.vendorNote ?? "",
    );
    const [isBriefSaved, setIsBriefSaved] = useState(false);

    const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
    const [isTimelineFormOpen, setIsTimelineFormOpen] = useState(false);

    const filteredBriefs = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return briefs.filter((brief) => {
            const matchTab = activeTab === "Semua" || brief.status === activeTab;

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                brief.projectTitle.toLowerCase().includes(normalizedKeyword) ||
                brief.customerName.toLowerCase().includes(normalizedKeyword) ||
                brief.vendorName.toLowerCase().includes(normalizedKeyword) ||
                brief.location.toLowerCase().includes(normalizedKeyword) ||
                brief.projectType.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, briefs]);

    const selectedBrief = useMemo(() => {
        return (
            briefs.find((brief) => brief.id === selectedBriefId) ??
            filteredBriefs[0] ??
            briefs[0]
        );
    }, [briefs, filteredBriefs, selectedBriefId]);

    const updateSelectedBrief = (
        field: keyof BriefDocument,
        value: string | BriefStatus,
    ) => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        [field]: value,
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const updateChecklist = (checkId: string) => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        updatedAt: "Baru saja",
                        checklist: brief.checklist.map((item) =>
                            item.id === checkId
                                ? {
                                    ...item,
                                    completed: !item.completed,
                                }
                                : item,
                        ),
                    }
                    : brief,
            ),
        );
    };

    const addBriefFile = () => {
        if (!selectedBrief) return;

        const newFile: BriefFile = {
            id: `file-${Date.now()}`,
            name: "dokumen-brief-baru.pdf",
            type: "PDF",
            size: "UI only",
            uploadedBy: "Admin",
            uploadedAt: "Baru saja",
        };

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        files: [newFile, ...brief.files],
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const deleteBriefFile = (fileId: string) => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        files: brief.files.filter((file) => file.id !== fileId),
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const addMaterial = (materialName: string) => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        materials: [...brief.materials, materialName],
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const addTimeline = (timeline: BriefTimelineInput) => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        timeline: [
                            ...brief.timeline,
                            {
                                id: `tl-${Date.now()}`,
                                label: timeline.label,
                                date: timeline.date,
                            },
                        ],
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const updateStatus = (status: BriefStatus) => {
        updateSelectedBrief("status", status);
        setActiveTab(status);
    };

    const handleSelectBrief = (id: string) => {
        const nextBrief = briefs.find((brief) => brief.id === id);

        setSelectedBriefId(id);
        setScopeDraft(nextBrief?.scope ?? "");
        setAdminNoteDraft(nextBrief?.adminNote ?? "");
        setVendorNoteDraft(nextBrief?.vendorNote ?? "");
        setIsBriefSaved(false);
        setIsMobileDetailOpen(true);
    };

    const saveBriefChanges = () => {
        if (!selectedBrief) return;

        setBriefs((current) =>
            current.map((brief) =>
                brief.id === selectedBrief.id
                    ? {
                        ...brief,
                        scope: scopeDraft,
                        adminNote: adminNoteDraft,
                        vendorNote: vendorNoteDraft,
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );

        setIsBriefSaved(true);
    };

    if (!selectedBrief) {
        return null;
    }

    const isBriefChanged =
        scopeDraft !== selectedBrief.scope ||
        adminNoteDraft !== selectedBrief.adminNote ||
        vendorNoteDraft !== selectedBrief.vendorNote;

    return (
        <div className="space-y-5">
            <section className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
                <div
                    className={`space-y-4 ${isMobileDetailOpen ? "hidden xl:block" : "block"
                        }`}
                >
                    <div className="space-y-4">
                        <div>
                            <h1 className="font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                                Daftar Brief
                            </h1>

                            <p className="mt-2 text-[12px] text-[#7B756E]">
                                Pilih brief untuk melihat detail dokumen kerja.
                            </p>
                        </div>

                        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-3">
                            <Search size={16} className="shrink-0 text-[#9A8F86]" />

                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Cari brief..."
                                className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                            />
                        </div>

                        <div className="relative sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(event) =>
                                    setActiveTab(event.target.value as BriefTab)
                                }
                                className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                            >
                                {briefTabs.map((tab) => (
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
                            <div className="grid grid-cols-5 gap-1.5">
                                {briefTabs.map((tab) => {
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
                            {filteredBriefs.length > 0 ? (
                                filteredBriefs.map((brief) => (
                                    <BriefCard
                                        key={brief.id}
                                        brief={brief}
                                        selected={selectedBrief.id === brief.id}
                                        onClick={() => handleSelectBrief(brief.id)}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center">
                                    <p className="text-[13px] font-semibold text-[#31332C]">
                                        Brief tidak ditemukan.
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

                    <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        <AdminSectionCard title="Detail Brief">
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            {selectedBrief.projectType}
                                        </p>

                                        <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[30px]">
                                            {selectedBrief.projectTitle}
                                        </h2>
                                    </div>

                                    <BriefStatusBadge status={selectedBrief.status} />
                                </div>

                                <p className="text-[13px] leading-7 text-[#7B756E]">
                                    Brief ini menjadi acuan admin dan vendor untuk memahami scope,
                                    material, timeline, serta catatan penting sebelum pengerjaan.
                                </p>

                                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <InfoTile
                                            icon={UserRound}
                                            label="Customer"
                                            value={selectedBrief.customerName}
                                            description={selectedBrief.projectType}
                                        />

                                        <InfoTile
                                            icon={Users}
                                            label="Vendor"
                                            value={selectedBrief.vendorName}
                                            description="Vendor partner"
                                        />
                                    </div>

                                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            Status Brief
                                        </label>

                                        <div className="relative mt-3">
                                            <select
                                                value={selectedBrief.status}
                                                onChange={(event) =>
                                                    updateStatus(event.target.value as BriefStatus)
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

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <InfoTile
                                        icon={Ruler}
                                        label="Ukuran"
                                        value={selectedBrief.roomSize}
                                        description={selectedBrief.location}
                                    />

                                    <InfoTile
                                        icon={Package}
                                        label="Material"
                                        value={`${selectedBrief.materials.length} item`}
                                        description="Material acuan"
                                    />


                                    <InfoTile
                                        icon={CalendarDays}
                                        label="Update"
                                        value={selectedBrief.updatedAt}
                                        description={selectedBrief.createdAt}
                                    />

                                    <InfoTile
                                        icon={Layers}
                                        label="Budget"
                                        value={selectedBrief.budget}
                                        description="Estimasi proyek"
                                    />
                                </div>

                                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                Dokumen Brief
                                            </p>

                                            <p className="mt-1 text-[12px] text-[#7B756E]">
                                                Kelola scope pekerjaan, catatan penting, dan instruksi.
                                            </p>
                                        </div>

                                        {isBriefSaved && (
                                            <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
                                                Tersimpan
                                            </span>
                                        )}
                                    </div>

                                    <label className="mt-4 block">
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            Scope Pekerjaan
                                        </span>

                                        <textarea
                                            value={scopeDraft}
                                            onChange={(event) => {
                                                setScopeDraft(event.target.value);
                                                setIsBriefSaved(false);
                                            }}
                                            rows={5}
                                            className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                        />
                                    </label>

                                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                        <label className="block">
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                Catatan Admin
                                            </span>

                                            <textarea
                                                value={adminNoteDraft}
                                                onChange={(event) => {
                                                    setAdminNoteDraft(event.target.value);
                                                    setIsBriefSaved(false);
                                                }}
                                                rows={4}
                                                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                Catatan Untuk Vendor
                                            </span>

                                            <textarea
                                                value={vendorNoteDraft}
                                                onChange={(event) => {
                                                    setVendorNoteDraft(event.target.value);
                                                    setIsBriefSaved(false);
                                                }}
                                                rows={4}
                                                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={saveBriefChanges}
                                            disabled={!isBriefChanged}
                                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isBriefChanged
                                                ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                                                : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                                                }`}
                                        >
                                            <Save size={14} />
                                            Simpan Dokumen
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                File Brief & Referensi
                                            </p>

                                            <p className="mt-1 text-[12px] text-[#7B756E]">
                                                Upload file brief, gambar referensi, hasil survey, atau
                                                dokumen kerja.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addBriefFile}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                                        >
                                            <Upload size={14} />
                                            Upload File
                                        </button>
                                    </div>

                                    <div className="mt-4 grid gap-3">
                                        {selectedBrief.files.length > 0 ? (
                                            selectedBrief.files.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
                                                >
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                                                        {file.type === "PDF" ? (
                                                            <FileText size={17} />
                                                        ) : (
                                                            <Paperclip size={17} />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[13px] font-semibold text-[#31332C]">
                                                            {file.name}
                                                        </p>

                                                        <p className="mt-1 text-[11px] text-[#7B756E]">
                                                            {file.type} • {file.size} • {file.uploadedBy} •{" "}
                                                            {file.uploadedAt}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBriefFile(file.id)}
                                                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9A4A32] transition hover:bg-[#FFF3EF]"
                                                        aria-label="Hapus file"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-5 text-center">
                                                <p className="text-[13px] font-semibold text-[#31332C]">
                                                    Belum ada file brief.
                                                </p>

                                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                                    File upload masih UI prototype, belum tersimpan ke
                                                    storage.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#D9C8BA] hover:bg-white">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                    Material Acuan
                                                </p>

                                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                                    Material referensi untuk vendor.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setIsMaterialFormOpen(true)}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                            >
                                                <Plus size={13} />
                                                Tambah
                                            </button>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedBrief.materials.map((material) => (
                                                <span
                                                    key={material}
                                                    className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium text-[#725F54] transition hover:border-[#D9C8BA] hover:bg-[#FFFDF9]"
                                                >
                                                    {material}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
                                            {selectedBrief.materialNote}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#D9C8BA] hover:bg-white">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                    Timeline Estimasi Kerja
                                                </p>

                                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                                    Disusun admin, vendor memberi masukan jika perlu.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setIsTimelineFormOpen(true)}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                            >
                                                <Plus size={13} />
                                                Tahap
                                            </button>
                                        </div>

                                        <div className="mt-3 space-y-2.5">
                                            {selectedBrief.timeline.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-white p-3 transition hover:border-[#D9C8BA] hover:bg-[#FFFDF9]"
                                                >
                                                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#FCFBF9] text-[11px] font-semibold text-[#725F54]">
                                                        {index + 1}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[13px] font-semibold text-[#31332C]">
                                                            {item.label}
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-[#7B756E]">
                                                            {item.date}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </AdminSectionCard>

                        <div className="space-y-5">
                            <AdminSectionCard title="Checklist Brief">
                                <div className="space-y-2.5">
                                    {selectedBrief.checklist.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => updateChecklist(item.id)}
                                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${item.completed
                                                ? "border-[#DCEBDD] bg-[#F5FAF6]"
                                                : "border-[#E8E2D9] bg-white hover:bg-[#FCFBF9]"
                                                }`}
                                        >
                                            <div
                                                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${item.completed
                                                    ? "border-[#4F7A5F] bg-[#4F7A5F] text-white"
                                                    : "border-[#D9C8BA] bg-white text-transparent"
                                                    }`}
                                            >
                                                <CheckCircle2 size={14} />
                                            </div>

                                            <span className="text-[12px] leading-5 text-[#31332C]">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </AdminSectionCard>

                            <div className="grid gap-2 sm:grid-cols-3 2xl:grid-cols-1">
                                <button
                                    type="button"
                                    onClick={() => updateStatus("Siap Vendor")}
                                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${selectedBrief.status === "Siap Vendor"
                                        ? "border-[#725F54] bg-[#725F54] text-white"
                                        : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                        }`}
                                >
                                    <Send size={15} />
                                    Kirim ke Vendor
                                </button>

                                <button
                                    type="button"
                                    onClick={() => updateStatus("Revisi")}
                                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${selectedBrief.status === "Revisi"
                                        ? "border-[#725F54] bg-[#725F54] text-white"
                                        : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                        }`}
                                >
                                    <PenLine size={15} />
                                    Minta Revisi
                                </button>

                                <button
                                    type="button"
                                    onClick={() => updateStatus("Disetujui")}
                                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${selectedBrief.status === "Disetujui"
                                        ? "border-[#725F54] bg-[#725F54] text-white"
                                        : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                        }`}
                                >
                                    <CheckCircle2 size={15} />
                                    Setujui Brief
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            <BriefMaterialForm
                open={isMaterialFormOpen}
                onClose={() => setIsMaterialFormOpen(false)}
                onAddMaterial={addMaterial}
            />

            <BriefTimelineForm
                open={isTimelineFormOpen}
                onClose={() => setIsTimelineFormOpen(false)}
                onAddTimeline={addTimeline}
            />
        </div>
    );
}

function BriefCard({
    brief,
    selected,
    onClick,
}: {
    brief: BriefDocument;
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
                        {brief.projectTitle}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {brief.customerName} • {brief.location}
                    </p>
                </div>

                <BriefStatusBadge status={brief.status} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="truncate text-[11px] text-[#9A8F86]">
                    Update: {brief.updatedAt}
                </p>

                <span className="shrink-0 text-[11px] font-semibold text-[#725F54]">
                    {brief.projectType}
                </span>
            </div>
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

function BriefStatusBadge({ status }: { status: BriefStatus }) {
    const style =
        status === "Siap Vendor"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : status === "Revisi"
                ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                : status === "Disetujui"
                    ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                    : "border-[#E8E2D9] bg-white text-[#7B756E]";

    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}