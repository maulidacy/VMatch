"use client";

import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronDown,
    FileText,
    MapPin,
    MessageCircle,
    Search,
    Send,
    ShieldCheck,
    Star,
    UserRound,
    Users,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { AdminPageId } from "../types";

type RequestStatus =
    | "Baru Masuk"
    | "Menunggu Review"
    | "Butuh Konsultasi"
    | "Disetujui"
    | "Menunggu Vendor"
    | "Menunggu Estimasi Vendor"
    | "Estimasi Dikirim Vendor"
    | "RAB Direview Admin"
    | "RAB Dikirim ke Customer"
    | "Menjadi Proyek Aktif"
    | "Ditolak";

type RequestTab =
    | "Semua"
    | "Baru"
    | "Review"
    | "Konsultasi"
    | "Vendor"
    | "Estimasi"
    | "Aktif"
    | "Ditolak";

type VendorAvailability = "Tersedia" | "Sibuk" | "Perlu Review";

type VendorRecommendation = {
    id: string;
    name: string;
    area: string;
    skills: string[];
    availability: VendorAvailability;
    activeProjects: number;
    performanceScore: number;
    responseTime: string;
    notes: string;
};

type ProjectRequest = {
    id: string;
    title: string;
    customerName: string;
    customerEmail: string;
    location: string;
    budget: string;
    projectType: string;
    roomSize: string;
    designStyle: string;
    referenceSource: string;
    preferredMaterialPackage: string;
    targetTime: string;
    status: RequestStatus;
    submittedAt: string;
    description: string;
    adminNote: string;
    initialBrief: string;
    vendorNote: string;
    selectedVendorId?: string;
    sentToVendorAt?: string;
    lastMessage?: string;
};

const requestTabs: RequestTab[] = [
    "Semua",
    "Baru",
    "Review",
    "Konsultasi",
    "Vendor",
    "Estimasi",
    "Aktif",
    "Ditolak",
];

const statusOptions: RequestStatus[] = [
    "Baru Masuk",
    "Menunggu Review",
    "Butuh Konsultasi",
    "Disetujui",
    "Menunggu Vendor",
    "Menunggu Estimasi Vendor",
    "Estimasi Dikirim Vendor",
    "RAB Direview Admin",
    "RAB Dikirim ke Customer",
    "Menjadi Proyek Aktif",
    "Ditolak",
];

const recommendedVendors: VendorRecommendation[] = [
    {
        id: "vendor-1",
        name: "Andi Interior Partner",
        area: "Semarang",
        skills: ["Kitchen Set", "Wardrobe", "Storage"],
        availability: "Tersedia",
        activeProjects: 2,
        performanceScore: 92,
        responseTime: "± 1 hari",
        notes: "Cocok untuk kitchen set dan pekerjaan custom furniture rumah.",
    },
    {
        id: "vendor-2",
        name: "Nusa Custom Interior",
        area: "Semarang",
        skills: ["Kitchen Set", "Backdrop TV"],
        availability: "Sibuk",
        activeProjects: 5,
        performanceScore: 86,
        responseTime: "± 2 hari",
        notes: "Performa baik, tetapi sedang menangani beberapa proyek aktif.",
    },
    {
        id: "vendor-3",
        name: "Ruang Rapi Studio",
        area: "Yogyakarta",
        skills: ["Wardrobe", "Ruang Kerja", "Storage"],
        availability: "Tersedia",
        activeProjects: 1,
        performanceScore: 89,
        responseTime: "± 1 hari",
        notes: "Cocok untuk wardrobe, ruang kerja, dan storage minimalis.",
    },
];

const initialRequests: ProjectRequest[] = [
    {
        id: "request-1",
        title: "Kitchen Set Modern Minimalis",
        customerName: "Alya Putri",
        customerEmail: "alya@email.com",
        location: "Semarang",
        budget: "Rp25.000.000 - Rp70.000.000",
        projectType: "Kitchen Set",
        roomSize: "Area dapur 3m x 2.5m",
        designStyle: "Modern minimalis",
        referenceSource: "Inspirasi Kitchen Set Modern Minimalis",
        preferredMaterialPackage: "Standard / Premium",
        targetTime: "Mulai pengerjaan bulan depan",
        status: "Menunggu Vendor",
        submittedAt: "Hari ini, 10.30 WIB",
        description:
            "Customer membutuhkan kitchen set yang bersih, fungsional, mudah dirawat, dan memiliki penyimpanan yang cukup untuk dapur kecil.",
        adminNote:
            "Request sudah cukup jelas. Cocok diteruskan ke vendor kitchen set area Semarang untuk estimasi awal.",
        initialBrief:
            "Buat estimasi kitchen set modern minimalis untuk area dapur compact. Fokus pada kabinet bawah, kabinet atas, area penyimpanan tertutup, top table solid surface, dan finishing warna netral dengan aksen kayu hangat.",
        vendorNote:
            "Vendor diminta mengecek kemungkinan layout L-shape, kebutuhan pengukuran ulang, dan estimasi material Standard / Premium.",
    },
    {
        id: "request-2",
        title: "Wardrobe Kamar Utama",
        customerName: "Bima Santoso",
        customerEmail: "bima@email.com",
        location: "Yogyakarta",
        budget: "Rp18.000.000 - Rp60.000.000",
        projectType: "Wardrobe",
        roomSize: "Lebar dinding ± 3 meter",
        designStyle: "Warm modern",
        referenceSource: "Referensi wardrobe built-in",
        preferredMaterialPackage: "Standard",
        targetTime: "2-3 minggu setelah RAB disetujui",
        status: "Butuh Konsultasi",
        submittedAt: "Kemarin, 14.00 WIB",
        description:
            "Customer ingin wardrobe built-in full plafon dengan area gantung, rak lipat, dan pintu sliding.",
        adminNote:
            "Perlu konsultasi untuk memastikan layout bagian dalam wardrobe dan preferensi pintu sliding.",
        initialBrief:
            "Estimasi wardrobe built-in full plafon dengan pembagian area gantung, rak lipat, laci, dan storage tambahan.",
        vendorNote:
            "Vendor perlu menanyakan detail ukuran dan kondisi area instalasi sebelum estimasi final.",
    },
    {
        id: "request-3",
        title: "Ruang Kerja Compact",
        customerName: "Nadia Rahma",
        customerEmail: "nadia@email.com",
        location: "Solo",
        budget: "Rp12.000.000 - Rp40.000.000",
        projectType: "Ruang Kerja",
        roomSize: "2m x 3m",
        designStyle: "Scandinavian",
        referenceSource: "Inspirasi ruang kerja compact",
        preferredMaterialPackage: "Basic / Standard",
        targetTime: "Fleksibel",
        status: "Estimasi Dikirim Vendor",
        submittedAt: "2 hari lalu",
        description:
            "Customer membutuhkan meja kerja custom, rak buku, dan storage kecil agar ruang tetap rapi dan terang.",
        adminNote:
            "Estimasi vendor sudah masuk. Admin dapat lanjut review di RAB Builder.",
        initialBrief:
            "Ruang kerja compact dengan meja custom, rak terbuka, storage tertutup, dan warna terang.",
        vendorNote:
            "Vendor sudah mengirim estimasi awal untuk review admin.",
        selectedVendorId: "vendor-3",
        sentToVendorAt: "Kemarin, 09.20 WIB",
        lastMessage: "Vendor mengirim estimasi RAB. Silakan review di RAB Builder.",
    },
];

function matchRequestTab(request: ProjectRequest, activeTab: RequestTab) {
    if (activeTab === "Semua") return true;
    if (activeTab === "Baru") return request.status === "Baru Masuk";
    if (activeTab === "Review") return request.status === "Menunggu Review";
    if (activeTab === "Konsultasi") return request.status === "Butuh Konsultasi";
    if (activeTab === "Vendor") {
        return (
            request.status === "Disetujui" ||
            request.status === "Menunggu Vendor" ||
            request.status === "Menunggu Estimasi Vendor"
        );
    }
    if (activeTab === "Estimasi") {
        return (
            request.status === "Estimasi Dikirim Vendor" ||
            request.status === "RAB Direview Admin" ||
            request.status === "RAB Dikirim ke Customer"
        );
    }
    if (activeTab === "Aktif") return request.status === "Menjadi Proyek Aktif";
    if (activeTab === "Ditolak") return request.status === "Ditolak";

    return true;
}

function getVendorScore(request: ProjectRequest, vendor: VendorRecommendation) {
    let score = vendor.performanceScore;

    if (vendor.area.toLowerCase() === request.location.toLowerCase()) {
        score += 6;
    }

    if (
        vendor.skills.some(
            (skill) => skill.toLowerCase() === request.projectType.toLowerCase(),
        )
    ) {
        score += 8;
    }

    if (vendor.availability === "Tersedia") score += 5;
    if (vendor.availability === "Sibuk") score -= 4;
    if (vendor.availability === "Perlu Review") score -= 8;

    score -= Math.min(vendor.activeProjects, 6);

    return Math.max(0, Math.min(score, 100));
}

export function RequestProjectView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [requests, setRequests] = useState<ProjectRequest[]>(initialRequests);
    const [activeTab, setActiveTab] = useState<RequestTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
        null,
    );
    const [areaFilter, setAreaFilter] = useState("Semua");
    const [skillFilter, setSkillFilter] = useState("Semua");
    const [availabilityFilter, setAvailabilityFilter] = useState("Semua");
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const filteredRequests = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return requests.filter((request) => {
            const matchTab = matchRequestTab(request, activeTab);

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                request.title.toLowerCase().includes(normalizedKeyword) ||
                request.customerName.toLowerCase().includes(normalizedKeyword) ||
                request.location.toLowerCase().includes(normalizedKeyword) ||
                request.projectType.toLowerCase().includes(normalizedKeyword) ||
                request.designStyle.toLowerCase().includes(normalizedKeyword) ||
                request.status.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, requests]);

    const selectedRequest = useMemo(() => {
        if (!selectedRequestId) return null;

        return requests.find((request) => request.id === selectedRequestId) ?? null;
    }, [requests, selectedRequestId]);

    const selectedVendor =
        selectedRequest?.selectedVendorId
            ? recommendedVendors.find(
                (vendor) => vendor.id === selectedRequest.selectedVendorId,
            ) ?? null
            : null;

    const vendorAreaOptions = useMemo(
        () => ["Semua", ...Array.from(new Set(recommendedVendors.map((v) => v.area)))],
        [],
    );

    const vendorSkillOptions = useMemo(
        () => [
            "Semua",
            ...Array.from(new Set(recommendedVendors.flatMap((v) => v.skills))),
        ],
        [],
    );

    const filteredVendorRecommendations = useMemo(() => {
        if (!selectedRequest) return [];

        return recommendedVendors
            .filter((vendor) => {
                const matchArea = areaFilter === "Semua" || vendor.area === areaFilter;
                const matchSkill =
                    skillFilter === "Semua" || vendor.skills.includes(skillFilter);
                const matchAvailability =
                    availabilityFilter === "Semua" ||
                    vendor.availability === availabilityFilter;

                return matchArea && matchSkill && matchAvailability;
            })
            .sort(
                (a, b) =>
                    getVendorScore(selectedRequest, b) - getVendorScore(selectedRequest, a),
            );
    }, [areaFilter, availabilityFilter, selectedRequest, skillFilter]);

    const openDetail = (request: ProjectRequest) => {
        setSelectedRequestId(request.id);
        setFeedbackMessage("");
        setAreaFilter("Semua");
        setSkillFilter("Semua");
        setAvailabilityFilter("Semua");
    };

    const closeDetail = () => {
        setSelectedRequestId(null);
        setFeedbackMessage("");
    };

    const updateRequest = (
        id: string,
        updater: (request: ProjectRequest) => ProjectRequest,
    ) => {
        setRequests((current) =>
            current.map((request) => (request.id === id ? updater(request) : request)),
        );
    };

    const updateStatus = (id: string, status: RequestStatus) => {
        updateRequest(id, (request) => ({
            ...request,
            status,
        }));

        if (status === "Butuh Konsultasi") setActiveTab("Konsultasi");
        if (status === "Menunggu Estimasi Vendor") setActiveTab("Vendor");
        if (
            status === "Estimasi Dikirim Vendor" ||
            status === "RAB Direview Admin" ||
            status === "RAB Dikirim ke Customer"
        ) {
            setActiveTab("Estimasi");
        }
        if (status === "Menjadi Proyek Aktif") setActiveTab("Aktif");
        if (status === "Ditolak") setActiveTab("Ditolak");
    };

    const selectVendor = (requestId: string, vendorId: string) => {
        updateRequest(requestId, (request) => ({
            ...request,
            selectedVendorId: vendorId,
            status:
                request.status === "Baru Masuk" || request.status === "Menunggu Review"
                    ? "Menunggu Vendor"
                    : request.status,
        }));

        setFeedbackMessage("Vendor berhasil dipilih untuk request ini.");
    };

    const sendBriefToVendor = () => {
        if (!selectedRequest?.selectedVendorId) return;

        updateRequest(selectedRequest.id, (request) => ({
            ...request,
            status: "Menunggu Estimasi Vendor",
            sentToVendorAt: "Baru saja",
            lastMessage:
                "Brief berhasil dikirim ke vendor. Vendor dapat melihat brief di Vendor Panel dan mengirim estimasi RAB kepada admin.",
        }));

        setActiveTab("Vendor");
        setFeedbackMessage(
            "Brief berhasil dikirim ke vendor. Vendor dapat melihat brief di Vendor Panel.",
        );
    };

    if (selectedRequest) {
        return (
            <RequestDetailPage
                request={selectedRequest}
                selectedVendor={selectedVendor}
                vendorRecommendations={filteredVendorRecommendations}
                areaOptions={vendorAreaOptions}
                skillOptions={vendorSkillOptions}
                areaFilter={areaFilter}
                skillFilter={skillFilter}
                availabilityFilter={availabilityFilter}
                feedbackMessage={feedbackMessage}
                onBack={closeDetail}
                onAreaFilterChange={setAreaFilter}
                onSkillFilterChange={setSkillFilter}
                onAvailabilityFilterChange={setAvailabilityFilter}
                onSelectVendor={(vendorId) => selectVendor(selectedRequest.id, vendorId)}
                onSendBrief={sendBriefToVendor}
                onStatusChange={(status) => updateStatus(selectedRequest.id, status)}
                onOpenConsultation={() => onChangePage?.("consultations")}
                onOpenRabBuilder={() => onChangePage?.("rab-builder")}
            />
        );
    }

    return (
        <div className="space-y-5">
            <section className="pb-1">
                <div className="max-w-[860px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                        Request Customer
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                        Daftar Request
                    </h1>

                    <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                        Tinjau request proyek interior dari customer, siapkan brief awal,
                        lakukan vendor matching, lalu kirim brief ke vendor yang sesuai.
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
                            placeholder="Cari request, customer, lokasi, jenis proyek, style, atau status..."
                            className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                        />
                    </div>

                    <div className="relative sm:hidden">
                        <select
                            value={activeTab}
                            onChange={(event) => setActiveTab(event.target.value as RequestTab)}
                            className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                        >
                            {requestTabs.map((tab) => (
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
                        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {requestTabs.map((tab) => {
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
                {filteredRequests.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                        {filteredRequests.map((request) => (
                            <RequestListCard
                                key={request.id}
                                request={request}
                                onClick={() => openDetail(request)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
                        <p className="text-[14px] font-semibold text-[#31332C]">
                            Request tidak ditemukan.
                        </p>

                        <p className="mt-2 text-[13px] text-[#7B756E]">
                            Coba ubah filter atau kata pencarian.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

function RequestDetailPage({
    request,
    selectedVendor,
    vendorRecommendations,
    areaOptions,
    skillOptions,
    areaFilter,
    skillFilter,
    availabilityFilter,
    feedbackMessage,
    onBack,
    onAreaFilterChange,
    onSkillFilterChange,
    onAvailabilityFilterChange,
    onSelectVendor,
    onSendBrief,
    onStatusChange,
    onOpenConsultation,
    onOpenRabBuilder,
}: {
    request: ProjectRequest;
    selectedVendor: VendorRecommendation | null;
    vendorRecommendations: VendorRecommendation[];
    areaOptions: string[];
    skillOptions: string[];
    areaFilter: string;
    skillFilter: string;
    availabilityFilter: string;
    feedbackMessage: string;
    onBack: () => void;
    onAreaFilterChange: (value: string) => void;
    onSkillFilterChange: (value: string) => void;
    onAvailabilityFilterChange: (value: string) => void;
    onSelectVendor: (vendorId: string) => void;
    onSendBrief: () => void;
    onStatusChange: (status: RequestStatus) => void;
    onOpenConsultation: () => void;
    onOpenRabBuilder: () => void;
}) {
    const canOpenRab =
        request.status === "Estimasi Dikirim Vendor" ||
        request.status === "RAB Direview Admin";

    return (
        <div className="space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
            >
                <ArrowLeft size={15} />
                Kembali ke daftar request
            </button>

            <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                                Detail Request
                            </p>

                            <RequestStatusBadge status={request.status} />
                        </div>

                        <h1 className="mt-3 max-w-[820px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                            {request.title}
                        </h1>

                        <p className="mt-3 max-w-[860px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                            Request dari {request.customerName}. Admin meninjau kebutuhan,
                            membuat brief awal, memilih vendor, lalu menunggu estimasi RAB dari
                            vendor sebelum proyek dilanjutkan.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Status Request
                        </label>

                        <div className="relative mt-3">
                            <select
                                value={request.status}
                                onChange={(event) =>
                                    onStatusChange(event.target.value as RequestStatus)
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
                            value={request.customerName}
                            description={request.customerEmail}
                        />

                        <InfoTile
                            icon={MapPin}
                            label="Lokasi"
                            value={request.location}
                            description="Area proyek"
                        />

                        <InfoTile
                            icon={Wallet}
                            label="Budget"
                            value={request.budget}
                            description="Estimasi awal customer"
                        />

                        <InfoTile
                            icon={BriefcaseBusiness}
                            label="Jenis Proyek"
                            value={request.projectType}
                            description={request.submittedAt}
                        />
                    </div>
                </div>

                <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <DetailSection
                        title="Detail Kebutuhan Customer"
                        description="Informasi utama dari request customer."
                    >
                        <div className="grid gap-3">
                            <DetailRow label="Deskripsi Kebutuhan" value={request.description} />
                            <DetailRow label="Gaya Desain" value={request.designStyle} />
                            <DetailRow label="Ukuran Ruangan" value={request.roomSize} />
                            <DetailRow label="Referensi Desain" value={request.referenceSource} />
                            <DetailRow label="Catatan Admin" value={request.adminNote} />
                        </div>
                    </DetailSection>

                    <DetailSection
                        title="Brief Awal"
                        description="Ringkasan brief yang akan menjadi acuan vendor."
                        withRightBorder={false}
                    >
                        <div className="grid gap-3">
                            <DetailRow label="Ringkasan Brief" value={request.initialBrief} />
                            <DetailRow
                                label="Paket Material Preferensi"
                                value={request.preferredMaterialPackage}
                            />
                            <DetailRow label="Target Waktu" value={request.targetTime} />
                            <DetailRow label="Catatan untuk Vendor" value={request.vendorNote} />
                        </div>
                    </DetailSection>
                </div>

                <VendorMatchingSection
                    request={request}
                    vendors={vendorRecommendations}
                    selectedVendor={selectedVendor}
                    areaOptions={areaOptions}
                    skillOptions={skillOptions}
                    areaFilter={areaFilter}
                    skillFilter={skillFilter}
                    availabilityFilter={availabilityFilter}
                    feedbackMessage={feedbackMessage}
                    onAreaFilterChange={onAreaFilterChange}
                    onSkillFilterChange={onSkillFilterChange}
                    onAvailabilityFilterChange={onAvailabilityFilterChange}
                    onSelectVendor={onSelectVendor}
                    onSendBrief={onSendBrief}
                />
            </section>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                >
                    <MessageCircle size={15} />
                    Jadwalkan Konsultasi
                </button>

                <button
                    type="button"
                    onClick={onSendBrief}
                    disabled={!request.selectedVendorId}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${request.selectedVendorId
                            ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
                            : "cursor-not-allowed border-[#E8E2D9] bg-[#E8E2D9] text-[#9A8F86]"
                        }`}
                >
                    <Send size={15} />
                    Kirim Brief
                </button>

                <button
                    type="button"
                    onClick={onOpenRabBuilder}
                    disabled={!canOpenRab}
                    className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${canOpenRab
                            ? "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                            : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
                        }`}
                >
                    <FileText size={15} />
                    Buat RAB Draft
                </button>
            </div>
        </div>
    );
}

function VendorMatchingSection({
    request,
    vendors,
    selectedVendor,
    areaOptions,
    skillOptions,
    areaFilter,
    skillFilter,
    availabilityFilter,
    feedbackMessage,
    onAreaFilterChange,
    onSkillFilterChange,
    onAvailabilityFilterChange,
    onSelectVendor,
    onSendBrief,
}: {
    request: ProjectRequest;
    vendors: VendorRecommendation[];
    selectedVendor: VendorRecommendation | null;
    areaOptions: string[];
    skillOptions: string[];
    areaFilter: string;
    skillFilter: string;
    availabilityFilter: string;
    feedbackMessage: string;
    onAreaFilterChange: (value: string) => void;
    onSkillFilterChange: (value: string) => void;
    onAvailabilityFilterChange: (value: string) => void;
    onSelectVendor: (vendorId: string) => void;
    onSendBrief: () => void;
}) {
    return (
        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[760px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Vendor Matching
                    </p>

                    <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[34px]">
                        Pilih vendor yang sesuai
                    </h2>

                    <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                        Rekomendasi vendor berdasarkan lokasi, keahlian, ketersediaan,
                        performa internal, dan jumlah proyek aktif.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onSendBrief}
                    disabled={!request.selectedVendorId}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${request.selectedVendorId
                            ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                            : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                        }`}
                >
                    <Send size={14} />
                    Kirim Brief ke Vendor
                </button>
            </div>

            {feedbackMessage && (
                <div className="mt-4 rounded-2xl border border-[#DCEBDD] bg-[#F5FAF6] px-4 py-3 text-[12px] font-semibold leading-5 text-[#4F7A5F]">
                    {feedbackMessage}
                </div>
            )}

            <div className="mt-5 grid gap-3 md:grid-cols-3">
                <FilterSelect
                    label="Area"
                    value={areaFilter}
                    options={areaOptions}
                    onChange={onAreaFilterChange}
                />

                <FilterSelect
                    label="Keahlian"
                    value={skillFilter}
                    options={skillOptions}
                    onChange={onSkillFilterChange}
                />

                <FilterSelect
                    label="Ketersediaan"
                    value={availabilityFilter}
                    options={["Semua", "Tersedia", "Sibuk", "Perlu Review"]}
                    onChange={onAvailabilityFilterChange}
                />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div
                    className={`min-w-0 ${vendors.length > 2
                            ? "xl:max-h-[640px] xl:overflow-y-auto xl:pr-2 [scrollbar-width:thin]"
                            : ""
                        }`}
                >
                    {vendors.length > 0 ? (
                        <div className="grid gap-3 lg:grid-cols-2">
                            {vendors.map((vendor) => (
                                <VendorRecommendationCard
                                    key={vendor.id}
                                    request={request}
                                    vendor={vendor}
                                    selected={request.selectedVendorId === vendor.id}
                                    onSelect={() => onSelectVendor(vendor.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
                            <p className="text-[14px] font-semibold text-[#31332C]">
                                Vendor tidak ditemukan.
                            </p>

                            <p className="mt-2 text-[13px] text-[#7B756E]">
                                Coba ubah filter vendor matching.
                            </p>
                        </div>
                    )}
                </div>

                <SelectedVendorCard
                    selectedVendor={selectedVendor}
                    sentToVendorAt={request.sentToVendorAt}
                />
            </div>
        </div>
    );
}

function SelectedVendorCard({
    selectedVendor,
    sentToVendorAt,
}: {
    selectedVendor: VendorRecommendation | null;
    sentToVendorAt?: string;
}) {
    if (!selectedVendor) {
        return (
            <aside className="h-fit rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54]">
                    <Users size={18} />
                </div>

                <p className="mt-4 text-[14px] font-semibold text-[#31332C]">
                    Belum ada vendor terpilih
                </p>

                <p className="mt-2 text-[12px] leading-6 text-[#7B756E]">
                    Pilih salah satu vendor dari daftar rekomendasi agar brief dapat
                    dikirim ke Vendor Panel.
                </p>
            </aside>
        );
    }

    return (
        <aside className="h-fit rounded-2xl border border-[#D9C8BA] bg-white p-5 shadow-[0_10px_28px_rgba(49,51,44,0.04)]">
            <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#725F54] text-white">
                    <ShieldCheck size={18} />
                </div>

                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Vendor Terpilih
                    </p>

                    <h3 className="mt-1 text-[15px] font-semibold text-[#31332C]">
                        {selectedVendor.name}
                    </h3>
                </div>
            </div>

            <div className="mt-4 space-y-2.5">
                <MiniInfo label="Area" value={selectedVendor.area} />
                <MiniInfo label="Status" value={selectedVendor.availability} />
                <MiniInfo label="Proyek aktif" value={`${selectedVendor.activeProjects}`} />
                <MiniInfo label="Estimasi respon" value={selectedVendor.responseTime} />
            </div>

            {sentToVendorAt && (
                <div className="mt-4 rounded-xl border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-2 text-[12px] leading-5 text-[#4F7A5F]">
                    Brief sudah dikirim ke Vendor Panel: {sentToVendorAt}.
                </div>
            )}
        </aside>
    );
}

function VendorRecommendationCard({
    request,
    vendor,
    selected,
    onSelect,
}: {
    request: ProjectRequest;
    vendor: VendorRecommendation;
    selected: boolean;
    onSelect: () => void;
}) {
    const matchScore = getVendorScore(request, vendor);

    return (
        <article
            className={`rounded-2xl border p-4 transition ${selected
                    ? "border-[#725F54] bg-white ring-2 ring-[#725F54]/12"
                    : "border-[#E8E2D9] bg-white hover:border-[#725F54]"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54] ring-1 ring-[#E8E2D9]">
                    <ShieldCheck size={18} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-[14px] font-semibold text-[#31332C]">
                                {vendor.name}
                            </h3>

                            <p className="mt-1 text-[12px] text-[#7B756E]">{vendor.area}</p>
                        </div>

                        <VendorAvailabilityBadge availability={vendor.availability} />
                    </div>

                    <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                        {vendor.notes}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {vendor.skills.map((skill) => (
                    <span
                        key={skill}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${skill === request.projectType
                                ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                                : "border-[#E8E2D9] bg-[#FCFBF9] text-[#7B756E]"
                            }`}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
                <SmallStat label="Proyek" value={`${vendor.activeProjects}`} />
                <SmallStat label="Cocok" value={`${matchScore}`} />
                <SmallStat label="Respon" value={vendor.responseTime.replace("± ", "")} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-2">
                <div className="flex items-center gap-2">
                    <Star size={14} className="text-[#725F54]" />

                    <span className="text-[11px] font-medium text-[#7B756E]">
                        Respon {vendor.responseTime}
                    </span>
                </div>

                <span className="text-[11px] font-semibold text-[#725F54]">
                    {matchScore}/100
                </span>
            </div>

            <button
                type="button"
                onClick={onSelect}
                className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-semibold transition ${selected
                        ? "bg-[#F5FAF6] text-[#4F7A5F] ring-1 ring-[#DCEBDD]"
                        : "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    }`}
            >
                <CheckCircle2 size={14} />
                {selected ? "Vendor Dipilih" : "Pilih Vendor"}
            </button>
        </article>
    );
}

function RequestListCard({
    request,
    onClick,
}: {
    request: ProjectRequest;
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
                        {request.title}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {request.customerName} • {request.location}
                    </p>
                </div>

                <RequestStatusBadge status={request.status} />
            </div>

            <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {request.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#725F54]">
                    {request.projectType}
                </span>

                <span className="rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#7B756E]">
                    {request.budget}
                </span>
            </div>
        </button>
    );
}

function DetailSection({
    title,
    description,
    children,
    withRightBorder = true,
}: {
    title: string;
    description: string;
    children: ReactNode;
    withRightBorder?: boolean;
}) {
    return (
        <div
            className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 ${withRightBorder ? "xl:border-r" : ""
                }`}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                {title}
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                {description}
            </p>

            <div className="mt-4">{children}</div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-1 text-[13px] leading-6 text-[#31332C]">{value}</p>
        </div>
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

function FilterSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                />
            </div>
        </label>
    );
}

function SmallStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-2.5 text-center">
            <p className="text-[13px] font-semibold text-[#31332C]">{value}</p>
            <p className="mt-0.5 text-[10px] font-medium text-[#7B756E]">{label}</p>
        </div>
    );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-[#E8E2D9] pb-2.5 last:border-b-0 last:pb-0">
            <span className="text-[12px] text-[#7B756E]">{label}</span>
            <span className="text-right text-[12px] font-semibold text-[#31332C]">
                {value}
            </span>
        </div>
    );
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
    const style =
        status === "Baru Masuk"
            ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
            : status === "Menunggu Review" ||
                status === "Butuh Konsultasi" ||
                status === "Menunggu Vendor" ||
                status === "Menunggu Estimasi Vendor"
                ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                : status === "Estimasi Dikirim Vendor" ||
                    status === "RAB Direview Admin" ||
                    status === "RAB Dikirim ke Customer"
                    ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
                    : status === "Menjadi Proyek Aktif" || status === "Disetujui"
                        ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
                        : status === "Ditolak"
                            ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
                            : "border-[#E8E2D9] bg-white text-[#7B756E]";

    return (
        <span
            className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}

function VendorAvailabilityBadge({
    availability,
}: {
    availability: VendorAvailability;
}) {
    const style =
        availability === "Tersedia"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : availability === "Sibuk"
                ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                : "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]";

    return (
        <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style}`}
        >
            {availability}
        </span>
    );
}
