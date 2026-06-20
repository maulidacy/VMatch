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
import { useMemo, useRef, useState } from "react";

import { BriefMaterialForm } from "./brief-material-form";
import { BriefQcForm } from "./brief-qc-form";
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
    qcChecklist: string[];
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

const vendorResponses: Record<string, string> = {
    "brief-1":
        "Vendor perlu konfirmasi ulang ukuran kabinet atas sebelum masuk tahap produksi. Selain itu, vendor menyarankan pengecekan ulang area ventilasi agar tidak tertutup kabinet.",
    "brief-2":
        "Vendor sudah memahami brief dan siap melanjutkan ke tahap persiapan produksi. Tidak ada revisi tambahan saat ini.",
    "brief-3":
        "Vendor meminta revisi layout storage sisi kanan meja kerja agar ukuran lebih sesuai dengan ruang yang tersedia.",
};

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
        qcChecklist: [
            "Ukuran sesuai brief",
            "Material sesuai persetujuan",
            "Finishing rapi",
            "Fungsi laci dan engsel berjalan baik",
            "Area kerja bersih setelah instalasi",
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
        qcChecklist: [
            "Ukuran sesuai brief",
            "Material sesuai persetujuan",
            "Finishing rapi",
            "Fungsi furniture berjalan baik",
            "Area kerja bersih setelah instalasi",
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
        qcChecklist: [
            "Ukuran sesuai brief",
            "Material sesuai persetujuan",
            "Finishing rapi",
            "Fungsi furniture berjalan baik",
            "Area kerja bersih setelah instalasi",
        ],
    },
];

export function BriefDocumentsView() {
    const [briefs, setBriefs] = useState<BriefDocument[]>(initialBriefs);
    const [activeTab, setActiveTab] = useState<BriefTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);

    const [scopeDraft, setScopeDraft] = useState("");
    const [adminNoteDraft, setAdminNoteDraft] = useState("");
    const [vendorNoteDraft, setVendorNoteDraft] = useState("");
    const [isBriefSaved, setIsBriefSaved] = useState(false);

    const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
    const [isTimelineFormOpen, setIsTimelineFormOpen] = useState(false);
    const [isQcFormOpen, setIsQcFormOpen] = useState(false);

    const localIdRef = useRef(10);

    const createLocalId = (prefix: string) => {
        localIdRef.current += 1;
        return `${prefix}-${localIdRef.current}`;
    };

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
                brief.projectType.toLowerCase().includes(normalizedKeyword) ||
                brief.status.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, briefs]);

    const selectedBrief = useMemo(() => {
        if (!selectedBriefId) return null;

        return briefs.find((brief) => brief.id === selectedBriefId) ?? null;
    }, [briefs, selectedBriefId]);

    const openDetail = (brief: BriefDocument) => {
        setSelectedBriefId(brief.id);
        setScopeDraft(brief.scope);
        setAdminNoteDraft(brief.adminNote);
        setVendorNoteDraft(brief.vendorNote);
        setIsBriefSaved(false);
    };

    const closeDetail = () => {
        setSelectedBriefId(null);
        setScopeDraft("");
        setAdminNoteDraft("");
        setVendorNoteDraft("");
        setIsBriefSaved(false);
    };

    const updateBrief = (
        id: string,
        updater: (brief: BriefDocument) => BriefDocument,
    ) => {
        setBriefs((current) =>
            current.map((brief) =>
                brief.id === id
                    ? {
                        ...updater(brief),
                        updatedAt: "Baru saja",
                    }
                    : brief,
            ),
        );
    };

    const updateStatus = (id: string, status: BriefStatus) => {
        updateBrief(id, (brief) => ({
            ...brief,
            status,
        }));
    };

    const updateChecklist = (id: string, checkId: string) => {
        updateBrief(id, (brief) => ({
            ...brief,
            checklist: brief.checklist.map((item) =>
                item.id === checkId
                    ? {
                        ...item,
                        completed: !item.completed,
                    }
                    : item,
            ),
        }));
    };

    const addBriefFile = (id: string) => {
        const newFile: BriefFile = {
            id: createLocalId("file"),
            name: "dokumen-brief-baru.pdf",
            type: "PDF",
            size: "UI only",
            uploadedBy: "Admin",
            uploadedAt: "Baru saja",
        };

        updateBrief(id, (brief) => ({
            ...brief,
            files: [newFile, ...brief.files],
        }));
    };

    const deleteBriefFile = (id: string, fileId: string) => {
        updateBrief(id, (brief) => ({
            ...brief,
            files: brief.files.filter((file) => file.id !== fileId),
        }));
    };

    const addMaterial = (materialName: string) => {
        if (!selectedBrief) return;

        updateBrief(selectedBrief.id, (brief) => ({
            ...brief,
            materials: [...brief.materials, materialName],
        }));
    };

    const addTimeline = (timeline: BriefTimelineInput) => {
        if (!selectedBrief) return;

        updateBrief(selectedBrief.id, (brief) => ({
            ...brief,
            timeline: [
                ...brief.timeline,
                {
                    id: createLocalId("tl"),
                    label: timeline.label,
                    date: timeline.date,
                },
            ],
        }));
    };

    const addQcItem = (qcItem: string) => {
        if (!selectedBrief) return;

        updateBrief(selectedBrief.id, (brief) => ({
            ...brief,
            qcChecklist: [...brief.qcChecklist, qcItem],
        }));
    };

    const deleteQcItem = (id: string, qcItem: string) => {
        updateBrief(id, (brief) => ({
            ...brief,
            qcChecklist: brief.qcChecklist.filter((item) => item !== qcItem),
        }));
    };

    const saveBriefChanges = () => {
        if (!selectedBrief) return;

        updateBrief(selectedBrief.id, (brief) => ({
            ...brief,
            scope: scopeDraft,
            adminNote: adminNoteDraft,
            vendorNote: vendorNoteDraft,
        }));

        setIsBriefSaved(true);
    };

    if (selectedBrief) {
        return (
            <>
                <BriefDetailPage
                    brief={selectedBrief}
                    scopeDraft={scopeDraft}
                    adminNoteDraft={adminNoteDraft}
                    vendorNoteDraft={vendorNoteDraft}
                    isBriefSaved={isBriefSaved}
                    vendorResponse={vendorResponses[selectedBrief.id] ?? ""}
                    onBack={closeDetail}
                    onStatusChange={(status) => updateStatus(selectedBrief.id, status)}
                    onScopeChange={(value) => {
                        setScopeDraft(value);
                        setIsBriefSaved(false);
                    }}
                    onAdminNoteChange={(value) => {
                        setAdminNoteDraft(value);
                        setIsBriefSaved(false);
                    }}
                    onVendorNoteChange={(value) => {
                        setVendorNoteDraft(value);
                        setIsBriefSaved(false);
                    }}
                    onSave={saveBriefChanges}
                    onChecklistToggle={(checkId) => updateChecklist(selectedBrief.id, checkId)}
                    onOpenMaterialForm={() => setIsMaterialFormOpen(true)}
                    onOpenTimelineForm={() => setIsTimelineFormOpen(true)}
                    onOpenQcForm={() => setIsQcFormOpen(true)}
                    onUploadFile={() => addBriefFile(selectedBrief.id)}
                    onDeleteFile={(fileId) => deleteBriefFile(selectedBrief.id, fileId)}
                    onDeleteQcItem={(qcItem) => deleteQcItem(selectedBrief.id, qcItem)}
                />

                <BriefForms
                    materialOpen={isMaterialFormOpen}
                    timelineOpen={isTimelineFormOpen}
                    qcOpen={isQcFormOpen}
                    onCloseMaterial={() => setIsMaterialFormOpen(false)}
                    onCloseTimeline={() => setIsTimelineFormOpen(false)}
                    onCloseQc={() => setIsQcFormOpen(false)}
                    onAddMaterial={addMaterial}
                    onAddTimeline={addTimeline}
                    onAddQcItem={addQcItem}
                />
            </>
        );
    }

    return (
        <>
            <div className="space-y-5">
                <section className="pb-1">
                    <div className="max-w-[820px]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                            Brief & Dokumen
                        </p>

                        <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                            Daftar Brief
                        </h1>

                        <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                            Kelola brief kerja proyek interior, mulai dari scope pekerjaan,
                            material acuan, timeline, file referensi, standar QC, hingga
                            catatan untuk vendor.
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
                            <Search size={16} className="shrink-0 text-[#9A8F86]" />

                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Cari brief, customer, vendor, lokasi, atau status..."
                                className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                            />
                        </div>

                        <div className="relative sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(event) => setActiveTab(event.target.value as BriefTab)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
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

                        <div className="hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-1.5 sm:block lg:col-span-2">
                            <div className="flex gap-1.5 overflow-x-auto">
                                {briefTabs.map((tab) => {
                                    const active = activeTab === tab;

                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold transition ${active
                                                    ? "bg-[#725F54] text-white shadow-sm"
                                                    : "text-[#6F6860] hover:bg-white"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    {filteredBriefs.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                            {filteredBriefs.map((brief) => (
                                <BriefCard
                                    key={brief.id}
                                    brief={brief}
                                    onClick={() => openDetail(brief)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
                            <p className="text-[14px] font-semibold text-[#31332C]">
                                Brief tidak ditemukan.
                            </p>

                            <p className="mt-2 text-[13px] text-[#7B756E]">
                                Coba ubah filter atau kata pencarian.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <BriefForms
                materialOpen={isMaterialFormOpen}
                timelineOpen={isTimelineFormOpen}
                qcOpen={isQcFormOpen}
                onCloseMaterial={() => setIsMaterialFormOpen(false)}
                onCloseTimeline={() => setIsTimelineFormOpen(false)}
                onCloseQc={() => setIsQcFormOpen(false)}
                onAddMaterial={addMaterial}
                onAddTimeline={addTimeline}
                onAddQcItem={addQcItem}
            />
        </>
    );
}

function BriefDetailPage({
    brief,
    scopeDraft,
    adminNoteDraft,
    vendorNoteDraft,
    isBriefSaved,
    vendorResponse,
    onBack,
    onStatusChange,
    onScopeChange,
    onAdminNoteChange,
    onVendorNoteChange,
    onSave,
    onChecklistToggle,
    onOpenMaterialForm,
    onOpenTimelineForm,
    onOpenQcForm,
    onUploadFile,
    onDeleteFile,
    onDeleteQcItem,
}: {
    brief: BriefDocument;
    scopeDraft: string;
    adminNoteDraft: string;
    vendorNoteDraft: string;
    isBriefSaved: boolean;
    vendorResponse: string;
    onBack: () => void;
    onStatusChange: (status: BriefStatus) => void;
    onScopeChange: (value: string) => void;
    onAdminNoteChange: (value: string) => void;
    onVendorNoteChange: (value: string) => void;
    onSave: () => void;
    onChecklistToggle: (checkId: string) => void;
    onOpenMaterialForm: () => void;
    onOpenTimelineForm: () => void;
    onOpenQcForm: () => void;
    onUploadFile: () => void;
    onDeleteFile: (fileId: string) => void;
    onDeleteQcItem: (qcItem: string) => void;
}) {
    const isBriefChanged =
        scopeDraft !== brief.scope ||
        adminNoteDraft !== brief.adminNote ||
        vendorNoteDraft !== brief.vendorNote;

    return (
        <div className="space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
            >
                <ArrowLeft size={15} />
                Kembali ke daftar brief
            </button>

            <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                                {brief.projectType}
                            </p>

                            <BriefStatusBadge status={brief.status} />
                        </div>

                        <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                            {brief.projectTitle}
                        </h1>

                        <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                            Brief kerja untuk mengatur scope, material, timeline, file acuan,
                            standar QC, serta instruksi vendor sebelum proyek masuk tahap
                            produksi.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Status Brief
                        </label>

                        <div className="relative mt-3">
                            <select
                                value={brief.status}
                                onChange={(event) =>
                                    onStatusChange(event.target.value as BriefStatus)
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

                <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <InfoTile
                            icon={UserRound}
                            label="Customer"
                            value={brief.customerName}
                            description={brief.projectType}
                        />

                        <InfoTile
                            icon={Users}
                            label="Vendor"
                            value={brief.vendorName}
                            description="Vendor partner"
                        />

                        <InfoTile
                            icon={Ruler}
                            label="Ukuran"
                            value={brief.roomSize}
                            description={brief.location}
                        />

                        <InfoTile
                            icon={Layers}
                            label="Budget"
                            value={brief.budget}
                            description="Estimasi proyek"
                        />

                        <InfoTile
                            icon={Package}
                            label="Material"
                            value={`${brief.materials.length} item`}
                            description="Material acuan"
                        />

                        <InfoTile
                            icon={CalendarDays}
                            label="Dibuat"
                            value={brief.createdAt}
                            description="Tanggal brief"
                        />

                        <InfoTile
                            icon={FileText}
                            label="File"
                            value={`${brief.files.length} file`}
                            description="Dokumen acuan"
                        />

                        <InfoTile
                            icon={CheckCircle2}
                            label="QC"
                            value={`${brief.qcChecklist.length} poin`}
                            description="Standar cek"
                        />
                    </div>
                </div>

                <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 xl:border-r">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                    Dokumen Brief
                                </p>

                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                    Scope pekerjaan, catatan admin, dan instruksi vendor.
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
                                onChange={(event) => onScopeChange(event.target.value)}
                                rows={5}
                                className="mt-3 w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                            />
                        </label>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <label className="block">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                    Catatan Admin
                                </span>

                                <textarea
                                    value={adminNoteDraft}
                                    onChange={(event) => onAdminNoteChange(event.target.value)}
                                    rows={4}
                                    className="mt-3 w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                />
                            </label>

                            <label className="block">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                    Catatan Untuk Vendor
                                </span>

                                <textarea
                                    value={vendorNoteDraft}
                                    onChange={(event) => onVendorNoteChange(event.target.value)}
                                    rows={4}
                                    className="mt-3 w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={!isBriefChanged}
                                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${isBriefChanged
                                        ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                                        : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                                    }`}
                            >
                                <Save size={14} />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>

                    <aside className="min-w-0 p-5 sm:p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Checklist Brief
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                            Tandai kesiapan brief sebelum dikirim ke vendor.
                        </p>

                        <div className="mt-4 space-y-2.5">
                            {brief.checklist.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => onChecklistToggle(item.id)}
                                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${item.completed
                                            ? "border-[#DCEBDD] bg-[#F5FAF6]"
                                            : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
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
                    </aside>
                </div>

                <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <DetailBlock
                        title="Material Acuan"
                        description="Material referensi untuk vendor."
                        actionLabel="Tambah"
                        onAction={onOpenMaterialForm}
                    >
                        <div className="flex flex-wrap gap-2">
                            {brief.materials.map((material) => (
                                <span
                                    key={material}
                                    className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                                >
                                    {material}
                                </span>
                            ))}
                        </div>

                        <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
                            {brief.materialNote}
                        </p>
                    </DetailBlock>

                    <DetailBlock
                        title="Timeline Estimasi Kerja"
                        description="Tahapan kerja sebagai acuan admin dan vendor."
                        actionLabel="Tahap"
                        onAction={onOpenTimelineForm}
                        withRightBorder={false}
                    >
                        <div className="space-y-2.5">
                            {brief.timeline.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                                >
                                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-semibold text-[#725F54] ring-1 ring-[#E8E2D9]">
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
                    </DetailBlock>
                </div>

                <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <DetailBlock
                        title="Standar QC"
                        description="Poin pengecekan kualitas untuk admin dan vendor."
                        actionLabel="Tambah"
                        onAction={onOpenQcForm}
                    >
                        <div className="grid gap-2.5">
                            {brief.qcChecklist.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <CheckCircle2 size={16} className="shrink-0 text-[#725F54]" />

                                        <p className="truncate text-[13px] font-semibold text-[#31332C]">
                                            {item}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onDeleteQcItem(item)}
                                        className="shrink-0 text-[11px] font-semibold text-[#9A4A32] transition hover:text-[#6F2F1F]"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    </DetailBlock>

                    <DetailBlock
                        title="Tanggapan Vendor"
                        description="Catatan vendor setelah membaca scope, material, dan timeline."
                        badge="Read-only"
                        withRightBorder={false}
                    >
                        <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3">
                            <p className="text-[13px] leading-7 text-[#31332C]">
                                {vendorResponse ||
                                    "Belum ada tanggapan dari vendor untuk brief ini."}
                            </p>
                        </div>
                    </DetailBlock>
                </div>

                <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                File Brief & Referensi
                            </p>

                            <p className="mt-1 text-[12px] text-[#7B756E]">
                                Upload file brief, gambar referensi, hasil survey, atau dokumen
                                kerja.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onUploadFile}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                        >
                            <Upload size={14} />
                            Upload File
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {brief.files.length > 0 ? (
                            brief.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-white p-4"
                                >
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54] ring-1 ring-[#E8E2D9]">
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
                                        onClick={() => onDeleteFile(file.id)}
                                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9A4A32] transition hover:bg-[#FFF3EF]"
                                        aria-label="Hapus file"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-5 text-center">
                                <p className="text-[13px] font-semibold text-[#31332C]">
                                    Belum ada file brief.
                                </p>

                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                    File upload masih UI prototype, belum tersimpan ke storage.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={() => onStatusChange("Siap Vendor")}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${brief.status === "Siap Vendor"
                            ? "border-[#725F54] bg-[#725F54] text-white"
                            : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                        }`}
                >
                    <Send size={15} />
                    Kirim Vendor
                </button>

                <button
                    type="button"
                    onClick={() => onStatusChange("Revisi")}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${brief.status === "Revisi"
                            ? "border-[#725F54] bg-[#725F54] text-white"
                            : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                        }`}
                >
                    <PenLine size={15} />
                    Revisi
                </button>

                <button
                    type="button"
                    onClick={() => onStatusChange("Disetujui")}
                    className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${brief.status === "Disetujui"
                            ? "border-[#725F54] bg-[#725F54] text-white"
                            : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                        }`}
                >
                    <CheckCircle2 size={15} />
                    Setujui Brief
                </button>
            </div>
        </div>
    );
}

function DetailBlock({
    title,
    description,
    children,
    actionLabel,
    onAction,
    badge,
    withRightBorder = true,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    badge?: string;
    withRightBorder?: boolean;
}) {
    return (
        <div
            className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 lg:border-b-0 ${withRightBorder ? "lg:border-r" : ""
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        {title}
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                        {description}
                    </p>
                </div>

                {actionLabel && onAction && (
                    <button
                        type="button"
                        onClick={onAction}
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                    >
                        <Plus size={13} />
                        {actionLabel}
                    </button>
                )}

                {badge && (
                    <span className="shrink-0 rounded-full border border-[#E4D8CD] bg-white px-3 py-1 text-[10px] font-semibold text-[#725F54]">
                        {badge}
                    </span>
                )}
            </div>

            <div className="mt-4">{children}</div>
        </div>
    );
}

function BriefForms({
    materialOpen,
    timelineOpen,
    qcOpen,
    onCloseMaterial,
    onCloseTimeline,
    onCloseQc,
    onAddMaterial,
    onAddTimeline,
    onAddQcItem,
}: {
    materialOpen: boolean;
    timelineOpen: boolean;
    qcOpen: boolean;
    onCloseMaterial: () => void;
    onCloseTimeline: () => void;
    onCloseQc: () => void;
    onAddMaterial: (materialName: string) => void;
    onAddTimeline: (timeline: BriefTimelineInput) => void;
    onAddQcItem: (qcItem: string) => void;
}) {
    return (
        <>
            <BriefMaterialForm
                open={materialOpen}
                onClose={onCloseMaterial}
                onAddMaterial={onAddMaterial}
            />

            <BriefTimelineForm
                open={timelineOpen}
                onClose={onCloseTimeline}
                onAddTimeline={onAddTimeline}
            />

            <BriefQcForm
                open={qcOpen}
                onClose={onCloseQc}
                onAddQcItem={onAddQcItem}
            />
        </>
    );
}

function BriefCard({
    brief,
    onClick,
}: {
    brief: BriefDocument;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
        >
            <div className="flex min-w-0 items-start justify-between gap-3">
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

            <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {brief.scope}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[11px] text-[#9A8F86]">
                    Update: {brief.updatedAt}
                </p>

                <span className="shrink-0 rounded-full bg-[#F5F0EA] px-3 py-1 text-[11px] font-semibold text-[#725F54]">
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
        <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
            <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
                    <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        {label}
                    </p>

                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#31332C]">
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
            className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}
