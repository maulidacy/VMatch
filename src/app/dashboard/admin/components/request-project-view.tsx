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
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProjectRequests, getProjects, updateProjectRequest, createProject, getBriefs, updateBrief } from "@/lib/api/projects";
import { getVendors } from "@/lib/api/profiles";
import type { ProjectRequest as DBRequest, Profile } from "@/lib/supabase/types";
import { toast } from "sonner";

import type { AdminPageId } from "../types";

type BriefDocumentStatus =
    | "Belum Dibuat"
    | "Draft Brief"
    | "Brief Siap"
    | "Brief Dikirim";

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
    customerId: string;
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
    briefDocumentStatus: BriefDocumentStatus;
    briefDocumentUpdatedAt?: string;
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

const recommendedVendors: VendorRecommendation[] = [];

const initialRequests: ProjectRequest[] = [];

function mapDbToLocalRequest(r: DBRequest): ProjectRequest {
    return {
        id: r.id,
        title: r.project_name,
        customerId: r.customer_id,
        customerName: r.customer?.full_name || "Customer",
        customerEmail: r.customer?.phone || "",
        location: r.location,
        budget: r.budget || "-",
        projectType: r.project_type,
        roomSize: r.room_size || "-",
        designStyle: r.design_style || "-",
        referenceSource: r.reference_name || r.inspiration_reference || "-",
        preferredMaterialPackage: r.material_package || "-",
        targetTime: r.start_target || "Fleksibel",
        status: r.status as RequestStatus,
        submittedAt: new Date(r.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        description: r.notes || r.ai_description || "-",
        adminNote: r.admin_note || "",
        briefDocumentStatus: r.brief_document_status as BriefDocumentStatus,
        briefDocumentUpdatedAt: r.sent_to_vendor_at ? "Tersedia" : "Belum ada",
        selectedVendorId: r.selected_vendor_id || undefined,
        sentToVendorAt: r.sent_to_vendor_at || undefined,
    };
}

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

function isBriefReadyForVendor(request: ProjectRequest) {
    return (
        request.briefDocumentStatus === "Brief Siap" ||
        request.briefDocumentStatus === "Brief Dikirim"
    );
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
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [activeTab, setActiveTab] = useState<RequestTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadRequests = useCallback(async () => {
        try {
            setIsLoadingRequests(true);
            const [dbRequests, dbVendors, dbProjects] = await Promise.all([
                getProjectRequests(),
                getVendors(),
                getProjects(),
            ]);
            setRequests(dbRequests.map(mapDbToLocalRequest));
            // Map vendors to recommendation format
            const activeProjectCountByVendor = new Map<string, number>();
            dbProjects.forEach((project) => {
                if (!project.vendor_id || project.status === "Selesai") return;
                activeProjectCountByVendor.set(
                    project.vendor_id,
                    (activeProjectCountByVendor.get(project.vendor_id) || 0) + 1,
                );
            });
            const vendorRecs: VendorRecommendation[] = dbVendors.map((v: Profile) => ({
                id: v.id,
                name: v.full_name || "Vendor",
                area: v.service_area || "-",
                skills: v.skills?.split(",").map(s => s.trim()) || [],
                availability: "Tersedia" as VendorAvailability,
                activeProjects: activeProjectCountByVendor.get(v.id) || 0,
                performanceScore: 85,
                responseTime: "± 1-2 hari",
                notes: v.notes || "Vendor partner VMatch.",
            }));
            // Update module-level for sub-components
            recommendedVendors.length = 0;
            recommendedVendors.push(...vendorRecs);
        } catch {
            // silent
        } finally {
            setIsLoadingRequests(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);
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

    const updateRequest = async (
        id: string,
        updater: (request: ProjectRequest) => ProjectRequest,
    ) => {
        if (submitting) return;
        const currentRequest = requests.find(r => r.id === id);
        if (!currentRequest) return;
        const newData = updater(currentRequest);
        
        try {
            setSubmitting(true);
            await updateProjectRequest(id, {
                status: newData.status,
                admin_note: newData.adminNote || null,
                brief_document_status: newData.briefDocumentStatus,
                selected_vendor_id: newData.selectedVendorId || null,
                sent_to_vendor_at: newData.sentToVendorAt ? new Date().toISOString() : null,
            });
            setRequests((current) =>
                current.map((request) => (request.id === id ? newData : request)),
            );
        } catch {
            toast.error("Gagal menyimpan perubahan ke database.");
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (id: string, status: RequestStatus) => {
        try {
            await updateRequest(id, (request) => ({
                ...request,
                status,
            }));
            
            toast.success(`Status berhasil diubah menjadi ${status}`);

            if (status === "Butuh Konsultasi") setActiveTab("Konsultasi");
            if (status === "Menunggu Estimasi Vendor") setActiveTab("Vendor");
            if (
                status === "Estimasi Dikirim Vendor" ||
                status === "RAB Direview Admin" ||
                status === "RAB Dikirim ke Customer"
            ) {
                setActiveTab("Estimasi");
            }
            if (status === "Menjadi Proyek Aktif") {
                setActiveTab("Aktif");
                setFeedbackMessage(
                    "Request berhasil dijadikan proyek aktif. Klik tombol di bawah untuk melihat di halaman Proyek Aktif.",
                );
            }
            if (status === "Ditolak") setActiveTab("Ditolak");
        } catch {
            toast.error("Terjadi kesalahan saat mengupdate status.");
        }
    };

    const openBriefDocument = (requestId: string) => {
        updateRequest(requestId, (request) => ({
            ...request,
            briefDocumentStatus:
                request.briefDocumentStatus === "Belum Dibuat"
                    ? "Draft Brief"
                    : request.briefDocumentStatus,
            briefDocumentUpdatedAt: "Baru saja",
        }));

        localStorage.setItem("pendingBriefRequestId", requestId);

        setFeedbackMessage(
            "Halaman Brief & Dokumen dibuka. Lengkapi brief sebelum dikirim ke vendor.",
        );

        onChangePage?.("brief-documents");
    };

    const markBriefReady = (requestId: string) => {
        updateRequest(requestId, (request) => ({
            ...request,
            briefDocumentStatus: "Brief Siap",
            briefDocumentUpdatedAt: "Baru saja",
        }));

        setFeedbackMessage(
            "Dokumen brief sudah ditandai siap. Admin dapat memilih vendor dan mengirim brief.",
        );
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

    const sendBriefToVendor = async () => {
        if (submitting) return;
        if (!selectedRequest?.selectedVendorId || !isBriefReadyForVendor(selectedRequest)) {
            setFeedbackMessage(
                "Lengkapi dan tandai dokumen brief siap sebelum dikirim ke vendor.",
            );
            return;
        }

        try {
            setSubmitting(true);
            const allBriefs = await getBriefs();
            const existingBrief = allBriefs.find(b => b.request_id === selectedRequest.id);
            if (existingBrief) {
                await updateBrief(existingBrief.id, {
                    status: "Dikirim ke Vendor",
                    vendor_id: selectedRequest.selectedVendorId,
                });
            } else {
                toast.error("Gagal mengirim: Dokumen brief belum dibuat di database. Buka Brief & Dokumen terlebih dahulu.");
                setSubmitting(false);
                return;
            }

            await updateProjectRequest(selectedRequest.id, {
                status: "Menunggu Estimasi Vendor",
                brief_document_status: "Brief Dikirim",
                sent_to_vendor_at: new Date().toISOString(),
            });

            setRequests((current) =>
                current.map((request) => (request.id === selectedRequest.id ? {
                    ...request,
                    status: "Menunggu Estimasi Vendor",
                    briefDocumentStatus: "Brief Dikirim",
                    sentToVendorAt: "Baru saja",
                    lastMessage: "Brief berhasil dikirim ke vendor. Vendor dapat melihat brief di Vendor Panel dan mengirim estimasi RAB kepada admin.",
                } : request)),
            );

            setActiveTab("Vendor");
            setFeedbackMessage(
                "Brief berhasil dikirim ke vendor. Vendor dapat melihat brief di Vendor Panel.",
            );
            toast.success("Brief berhasil dikirim ke vendor.");
        } catch {
            toast.error("Terjadi kesalahan saat mengirim brief ke vendor.");
        } finally {
            setSubmitting(false);
        }
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
                onOpenBriefDocument={() => openBriefDocument(selectedRequest.id)}
                onMarkBriefReady={() => markBriefReady(selectedRequest.id)}
                onOpenConsultation={() => onChangePage?.("consultations")}
                onOpenRabBuilder={() => onChangePage?.("rab-builder")}
                onOpenActiveProjects={() => onChangePage?.("active-projects")}
                submitting={submitting}
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
                        Tinjau request proyek interior dari customer, buat dokumen brief,
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
    onOpenBriefDocument,
    onMarkBriefReady,
    onOpenConsultation,
    onOpenRabBuilder,
    onOpenActiveProjects,
    submitting,
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
    onOpenBriefDocument: () => void;
    onMarkBriefReady: () => void;
    onOpenConsultation: () => void;
    onOpenRabBuilder: () => void;
    onOpenActiveProjects: () => void;
    submitting?: boolean;
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
                            Request dari {request.customerName}. Admin meninjau kebutuhan customer,
                            membuat dokumen brief, memilih vendor, lalu menunggu estimasi RAB
                            dari vendor sebelum masuk ke RAB Builder.
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
                                disabled={submitting}
                                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        description="Data asli dari request customer, bukan dokumen brief vendor."
                    >
                        <div className="grid gap-3">
                            <DetailRow label="Deskripsi Kebutuhan" value={request.description} />
                            <DetailRow label="Jenis Proyek" value={request.projectType} />
                            <DetailRow label="Gaya Desain" value={request.designStyle} />
                            <DetailRow label="Ukuran Ruangan" value={request.roomSize} />
                            <DetailRow label="Lokasi" value={request.location} />
                            <DetailRow label="Budget Customer" value={request.budget} />
                        </div>
                    </DetailSection>

                    <DetailSection
                        title="Referensi & Preferensi Customer"
                        description="Informasi pendukung dari customer untuk membantu admin menyusun brief."
                        withRightBorder={false}
                    >
                        <div className="grid gap-3">
                            <DetailRow label="Referensi Desain" value={request.referenceSource} />
                            <DetailRow
                                label="Preferensi Paket Material"
                                value={request.preferredMaterialPackage}
                            />
                            <DetailRow label="Target Waktu" value={request.targetTime} />
                            <DetailRow label="Tanggal Request" value={request.submittedAt} />
                            <DetailRow label="Catatan Review Admin" value={request.adminNote} />
                        </div>
                    </DetailSection>
                </div>

                <BriefDocumentActionCard
                    status={request.briefDocumentStatus}
                    updatedAt={request.briefDocumentUpdatedAt}
                    onOpenBriefDocument={onOpenBriefDocument}
                    onMarkBriefReady={onMarkBriefReady}
                />

                <RequestBriefSection
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
                    onOpenActiveProjects={onOpenActiveProjects}
                    submitting={submitting}
                />
            </section>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={onOpenConsultation}
                    disabled={submitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MessageCircle size={15} />
                    Jadwalkan Konsultasi
                </button>

                <button
                    type="button"
                    onClick={onOpenRabBuilder}
                    disabled={!canOpenRab || submitting}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
                        canOpenRab
                            ? "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                            : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <FileText size={15} />
                    Buka RAB Builder
                </button>
            </div>
        </div>
    );
}

function BriefDocumentActionCard({
    status,
    updatedAt,
    onOpenBriefDocument,
    onMarkBriefReady,
}: {
    status: BriefDocumentStatus;
    updatedAt?: string;
    onOpenBriefDocument: () => void;
    onMarkBriefReady: () => void;
}) {
    const isReady = status === "Brief Siap" || status === "Brief Dikirim";
    const isSent = status === "Brief Dikirim";

    const actionLabel =
        status === "Belum Dibuat"
            ? "Buat Dokumen Brief"
            : status === "Draft Brief"
                ? "Lanjut Edit Brief"
                : "Lihat/Edit Brief";

    return (
        <div className="border-t border-[#E8E2D9] bg-white p-5 sm:p-6">
            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
                            <FileText size={18} />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[14px] font-semibold text-[#31332C]">
                                    Dokumen Brief Proyek
                                </p>

                                <BriefDocumentStatusBadge status={status} />
                            </div>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                Brief disiapkan admin sebagai acuan vendor. Lengkapi brief
                                terlebih dahulu sebelum memilih dan mengirim ke vendor.
                            </p>

                            <p className="mt-1 text-[11px] text-[#9A8F86]">
                                Update: {updatedAt ?? "Belum ada update"}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[320px]">
                        <button
                            type="button"
                            onClick={onOpenBriefDocument}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                        >
                            <FileText size={14} />
                            {actionLabel}
                        </button>

                        <button
                            type="button"
                            onClick={onMarkBriefReady}
                            disabled={isSent}
                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                                isReady
                                    ? "bg-[#F5FAF6] text-[#4F7A5F] ring-1 ring-[#DCEBDD]"
                                    : "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                            } ${isSent ? "cursor-not-allowed opacity-80" : ""}`}
                        >
                            <CheckCircle2 size={14} />
                            {isReady ? "Brief Siap" : "Tandai Siap"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RequestBriefSection({
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
    onOpenActiveProjects,
    submitting,
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
    onOpenActiveProjects: () => void;
    submitting?: boolean;
}) {
    const isActiveProject = request.status === "Menjadi Proyek Aktif";
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
                        Pilih vendor setelah dokumen brief siap. Brief baru dapat dikirim ke vendor
                        jika vendor sudah dipilih dan brief sudah ditandai siap.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onSendBrief}
                    disabled={!request.selectedVendorId || !isBriefReadyForVendor(request) || submitting}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                        request.selectedVendorId && isBriefReadyForVendor(request)
                            ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                            : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <Send size={14} />
                    {submitting ? "Mengirim..." : "Kirim Brief ke Vendor"}
                </button>
            </div>

            {feedbackMessage && (
                <div className="mt-4 rounded-2xl border border-[#DCEBDD] bg-[#F5FAF6] px-4 py-3 text-[12px] font-semibold leading-5 text-[#4F7A5F]">
                    {feedbackMessage}
                </div>
            )}

            {isActiveProject && (
                <div className="mt-4 rounded-2xl border border-[#DCEBDD] bg-[#F5FAF6] p-4">
                    <p className="text-[12px] font-semibold text-[#4F7A5F]">
                        Request ini sudah menjadi proyek aktif.
                    </p>
                    <button
                        type="button"
                        onClick={onOpenActiveProjects}
                        className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                        Lihat di Proyek Aktif →
                    </button>
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


function BriefDocumentStatusBadge({ status }: { status: BriefDocumentStatus }) {
    const style =
        status === "Brief Dikirim"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : status === "Brief Siap"
                ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                : status === "Draft Brief"
                    ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                    : "border-[#E8E2D9] bg-white text-[#7B756E]";

    return (
        <span
            className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[10px] font-semibold ${style}`}
        >
            {status}
        </span>
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
