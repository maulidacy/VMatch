"use client";

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardCheck,
    Hammer,
    MessageSquareWarning,
    RefreshCw,
    Save,
    Search,
    Send,
    UserRound,
    Wallet,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getRabs, updateRab as updateRabRecord } from "@/lib/api/projects";
import type { Rab as DBRab } from "@/lib/supabase/types";

import type { AdminPageId } from "../types";

type RabStatus =
    | "Menunggu Estimasi Vendor"
    | "Estimasi Dikirim Vendor"
    | "RAB Direview Admin"
    | "RAB Dikirim ke Customer"
    | "Revisi Diminta Customer"
    | "RAB Disetujui Customer";

type RabTab =
    | "Semua"
    | "Estimasi Vendor"
    | "Review Admin"
    | "Dikirim Customer"
    | "Revisi"
    | "Disetujui";

type VendorEstimate = {
    vendorName: string;
    estimatedCost: string;
    estimatedDuration: string;
    suggestedMaterial: string;
    vendorNote: string;
    sentAt: string;
};

type RabData = {
    id: string;
    projectTitle: string;
    customerName: string;
    projectType: string;
    location: string;
    status: RabStatus;
    createdAt: string;
    updatedAt: string;
    grandTotal: string;
    vmatchServiceFee: string;
    adminNote: string;
    customerNote: string;
    revisionNote?: string;
    vendorEstimate?: VendorEstimate;
};

const rabTabs: RabTab[] = [
    "Semua",
    "Estimasi Vendor",
    "Review Admin",
    "Dikirim Customer",
    "Revisi",
    "Disetujui",
];

const statusOptions: RabStatus[] = [
    "Menunggu Estimasi Vendor",
    "Estimasi Dikirim Vendor",
    "RAB Direview Admin",
    "RAB Dikirim ke Customer",
    "Revisi Diminta Customer",
    "RAB Disetujui Customer",
];

function parseRupiah(value?: string) {
    const numberOnly = (value ?? "").replace(/[^\d]/g, "");
    return Number(numberOnly || 0);
}

function formatRupiah(value: number) {
    return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}

const initialRabs: RabData[] = [];

function mapDbToLocalRab(r: DBRab): RabData {
    return {
        id: r.id,
        projectTitle: r.project_title,
        customerName: r.customer?.full_name || "Customer",
        projectType: r.project_type || "-",
        location: r.location || "-",
        status: (r.status as RabStatus) || "Menunggu Estimasi Vendor",
        createdAt: new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        updatedAt: new Date(r.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        grandTotal: r.grand_total,
        vmatchServiceFee: r.vmatch_service_fee,
        adminNote: r.admin_note || "",
        customerNote: r.customer_note || "",
        revisionNote: r.revision_note || undefined,
        vendorEstimate: r.vendor_estimate ? {
            vendorName: "-",
            estimatedCost: r.vendor_estimate.estimated_cost,
            estimatedDuration: r.vendor_estimate.estimated_duration,
            suggestedMaterial: r.vendor_estimate.suggested_material || "-",
            vendorNote: r.vendor_estimate.vendor_note || "",
            sentAt: r.vendor_estimate.sent_at || "-",
        } : undefined,
    };
}

function matchRabTab(rab: RabData, tab: RabTab) {
    if (tab === "Semua") return true;
    if (tab === "Estimasi Vendor") {
        return (
            rab.status === "Menunggu Estimasi Vendor" ||
            rab.status === "Estimasi Dikirim Vendor"
        );
    }
    if (tab === "Review Admin") return rab.status === "RAB Direview Admin";
    if (tab === "Dikirim Customer") return rab.status === "RAB Dikirim ke Customer";
    if (tab === "Revisi") return rab.status === "Revisi Diminta Customer";
    if (tab === "Disetujui") return rab.status === "RAB Disetujui Customer";

    return true;
}

export function RabBuilderView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [rabs, setRabs] = useState<RabData[]>(initialRabs);
    const [activeTab, setActiveTab] = useState<RabTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedRabId, setSelectedRabId] = useState<string | null>(null);
    const [adminNoteDraft, setAdminNoteDraft] = useState("");
    const [customerNoteDraft, setCustomerNoteDraft] = useState("");
    const [revisionNoteDraft, setRevisionNoteDraft] = useState("");
    const [finalRabDraft, setFinalRabDraft] = useState("");
    const [serviceFeeDraft, setServiceFeeDraft] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const loadRabs = useCallback(async () => {
        try {
            const data = await getRabs();
            setRabs(data.map(mapDbToLocalRab));
        } catch (error) {
            toast.error("Gagal memuat RAB dari server.");
        }
    }, []);

    useEffect(() => {
        loadRabs();
    }, [loadRabs]);

    const filteredRabs = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return rabs.filter((rab) => {
            const matchTab = matchRabTab(rab, activeTab);

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                rab.projectTitle.toLowerCase().includes(normalizedKeyword) ||
                rab.customerName.toLowerCase().includes(normalizedKeyword) ||
                rab.location.toLowerCase().includes(normalizedKeyword) ||
                rab.projectType.toLowerCase().includes(normalizedKeyword) ||
                rab.status.toLowerCase().includes(normalizedKeyword) ||
                rab.vendorEstimate?.vendorName.toLowerCase().includes(normalizedKeyword) ||
                rab.revisionNote?.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, rabs]);

    const selectedRab = useMemo(() => {
        if (!selectedRabId) return null;
        return rabs.find((rab) => rab.id === selectedRabId) ?? null;
    }, [rabs, selectedRabId]);

    const openDetail = (rab: RabData) => {
        setSelectedRabId(rab.id);
        setAdminNoteDraft(rab.adminNote);
        setCustomerNoteDraft(rab.customerNote);
        setRevisionNoteDraft(rab.revisionNote ?? "");
        setFinalRabDraft(rab.grandTotal);
        setServiceFeeDraft(rab.vmatchServiceFee);
        setIsSaved(false);
        setFeedbackMessage("");
    };

    const closeDetail = () => {
        setSelectedRabId(null);
        setAdminNoteDraft("");
        setCustomerNoteDraft("");
        setRevisionNoteDraft("");
        setFinalRabDraft("");
        setServiceFeeDraft("");
        setIsSaved(false);
        setFeedbackMessage("");
    };

    const updateRab = (id: string, updater: (rab: RabData) => RabData) => {
        setRabs((current) =>
            current.map((rab) => (rab.id === id ? updater(rab) : rab)),
        );
    };

    const syncTabFromStatus = (status: RabStatus) => {
        if (
            status === "Menunggu Estimasi Vendor" ||
            status === "Estimasi Dikirim Vendor"
        ) {
            setActiveTab("Estimasi Vendor");
        }
        if (status === "RAB Direview Admin") setActiveTab("Review Admin");
        if (status === "RAB Dikirim ke Customer") setActiveTab("Dikirim Customer");
        if (status === "Revisi Diminta Customer") setActiveTab("Revisi");
        if (status === "RAB Disetujui Customer") setActiveTab("Disetujui");
    };

    const updateStatus = async (id: string, status: RabStatus) => {
        try {
            await updateRabRecord(id, { status });
        } catch (error) {
            toast.error("Gagal mengupdate status RAB.");
            loadRabs();
            return;
        }

        updateRab(id, (rab) => ({
            ...rab,
            status,
            updatedAt: "Baru saja",
        }));

        syncTabFromStatus(status);
    };

    const saveNotes = async () => {
        if (!selectedRab) return;

        try {
            await updateRabRecord(selectedRab.id, {
                grand_total: finalRabDraft,
                vmatch_service_fee: serviceFeeDraft,
                admin_note: adminNoteDraft || null,
                customer_note: customerNoteDraft || null,
                revision_note: revisionNoteDraft || null,
            });
            updateRab(selectedRab.id, (rab) => ({
                ...rab,
                grandTotal: finalRabDraft,
                vmatchServiceFee: serviceFeeDraft,
                adminNote: adminNoteDraft,
                customerNote: customerNoteDraft,
                revisionNote: revisionNoteDraft,
                updatedAt: "Baru saja",
            }));
        } catch (error) {
            toast.error("Gagal menyimpan RAB.");
            loadRabs();
            return;
        }

        setIsSaved(true);
    };

    const reviewVendorEstimate = () => {
        if (!selectedRab) return;

        updateStatus(selectedRab.id, "RAB Direview Admin");
        setFeedbackMessage(
            "Estimasi vendor masuk ke tahap review admin. Harga belum dikirim ke customer.",
        );
    };

    const sendRabToCustomer = async () => {
        if (!selectedRab) return;

        try {
            await updateRabRecord(selectedRab.id, {
                status: "RAB Dikirim ke Customer",
                grand_total: finalRabDraft,
                vmatch_service_fee: serviceFeeDraft,
                admin_note: adminNoteDraft || null,
                customer_note: customerNoteDraft || null,
            });
        } catch (error) {
            toast.error("Gagal mengirim RAB ke customer.");
            loadRabs();
            return;
        }

        updateRab(selectedRab.id, (rab) => ({
            ...rab,
            status: "RAB Dikirim ke Customer",
            grandTotal: finalRabDraft,
            vmatchServiceFee: serviceFeeDraft,
            adminNote: adminNoteDraft,
            customerNote: customerNoteDraft,
            updatedAt: "Baru saja",
        }));
        syncTabFromStatus("RAB Dikirim ke Customer");
        setFeedbackMessage("RAB final berhasil dikirim ke customer untuk persetujuan.");
    };

    const approveRab = async () => {
        if (!selectedRab) return;

        try {
            await updateRabRecord(selectedRab.id, { status: "RAB Disetujui Customer" });
        } catch (error) {
            toast.error("Gagal menyetujui RAB.");
            loadRabs();
            return;
        }

        updateRab(selectedRab.id, (rab) => ({
            ...rab,
            status: "RAB Disetujui Customer",
            updatedAt: "Baru saja",
        }));
        syncTabFromStatus("RAB Disetujui Customer");
        setFeedbackMessage(
            "RAB sudah disetujui customer. Admin dapat lanjut membuat invoice.",
        );
    };

    const markCustomerRevision = async () => {
        if (!selectedRab) return;

        const nextRevisionNote =
            revisionNoteDraft.trim().length > 0
                ? revisionNoteDraft
                : "Customer meminta revisi RAB. Admin perlu menyesuaikan catatan sebelum dikirim ulang.";

        try {
            await updateRabRecord(selectedRab.id, {
                status: "Revisi Diminta Customer",
                revision_note: nextRevisionNote,
            });
        } catch (error) {
            toast.error("Gagal menandai revisi RAB.");
            loadRabs();
            return;
        }

        updateRab(selectedRab.id, (rab) => ({
            ...rab,
            status: "Revisi Diminta Customer",
            revisionNote: nextRevisionNote,
            updatedAt: "Baru saja",
        }));

        setActiveTab("Revisi");
        setFeedbackMessage("Status RAB diubah menjadi Revisi Diminta Customer.");
    };

    const resendRevisedRab = async () => {
        if (!selectedRab) return;

        try {
            await updateRabRecord(selectedRab.id, {
                status: "RAB Dikirim ke Customer",
                grand_total: finalRabDraft,
                vmatch_service_fee: serviceFeeDraft,
                admin_note: adminNoteDraft || null,
                customer_note: customerNoteDraft || null,
                revision_note: revisionNoteDraft || null,
            });
        } catch (error) {
            toast.error("Gagal mengirim ulang RAB.");
            loadRabs();
            return;
        }

        updateRab(selectedRab.id, (rab) => ({
            ...rab,
            status: "RAB Dikirim ke Customer",
            grandTotal: finalRabDraft,
            vmatchServiceFee: serviceFeeDraft,
            adminNote: adminNoteDraft,
            customerNote: customerNoteDraft,
            revisionNote: revisionNoteDraft,
            updatedAt: "Baru saja",
        }));

        setActiveTab("Dikirim Customer");
        setFeedbackMessage("Revisi RAB berhasil dikirim ulang ke customer.");
    };

    if (selectedRab) {
        const canReview = selectedRab.status === "Estimasi Dikirim Vendor";
        const canSendCustomer = selectedRab.status === "RAB Direview Admin";
        const canMarkCustomerDecision = selectedRab.status === "RAB Dikirim ke Customer";
        const canResendRevision = selectedRab.status === "Revisi Diminta Customer";
        const canCreateInvoice = selectedRab.status === "RAB Disetujui Customer";

        return (
            <RabDetailPage
                rab={selectedRab}
                adminNoteDraft={adminNoteDraft}
                customerNoteDraft={customerNoteDraft}
                revisionNoteDraft={revisionNoteDraft}
                finalRabDraft={finalRabDraft}
                serviceFeeDraft={serviceFeeDraft}
                isSaved={isSaved}
                feedbackMessage={feedbackMessage}
                canReview={canReview}
                canSendCustomer={canSendCustomer}
                canMarkCustomerDecision={canMarkCustomerDecision}
                canResendRevision={canResendRevision}
                canCreateInvoice={canCreateInvoice}
                onBack={closeDetail}
                onChangeAdminNote={(value) => {
                    setAdminNoteDraft(value);
                    setIsSaved(false);
                }}
                onChangeCustomerNote={(value) => {
                    setCustomerNoteDraft(value);
                    setIsSaved(false);
                }}
                onChangeRevisionNote={(value) => {
                    setRevisionNoteDraft(value);
                    setIsSaved(false);
                }}
                onChangeFinalRab={(value) => {
                    setFinalRabDraft(value);
                    setIsSaved(false);
                }}
                onChangeServiceFee={(value) => {
                    setServiceFeeDraft(value);
                    setIsSaved(false);

                    const vendorEstimate = parseRupiah(
                        selectedRab.vendorEstimate?.estimatedCost ?? "0",
                    );
                    const serviceFee = parseRupiah(value);

                    setFinalRabDraft(formatRupiah(vendorEstimate + serviceFee));
                }}
                onSave={saveNotes}
                onStatusChange={(status) => updateStatus(selectedRab.id, status)}
                onReviewVendorEstimate={reviewVendorEstimate}
                onSendRabToCustomer={sendRabToCustomer}
                onMarkCustomerRevision={markCustomerRevision}
                onResendRevisedRab={resendRevisedRab}
                onApproveRab={approveRab}
                onCreateInvoice={() => onChangePage?.("payments")}
            />
        );
    }

    return (
        <div className="space-y-5">
            <section className="pb-1">
                <div className="max-w-[860px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                        RAB Builder
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                        Review RAB Proyek
                    </h1>

                    <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                        Review estimasi dari vendor, finalisasi RAB versi VMatch, kirim RAB
                        final ke customer, lalu lanjut ke invoice jika customer menyetujui.
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
                            placeholder="Cari RAB, proyek, customer, vendor, lokasi, atau status..."
                            className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                        />
                    </div>

                    <div className="relative sm:hidden">
                        <select
                            value={activeTab}
                            onChange={(event) => setActiveTab(event.target.value as RabTab)}
                            className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                        >
                            {rabTabs.map((tab) => (
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
                            {rabTabs.map((tab) => {
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
                {filteredRabs.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                        {filteredRabs.map((rab) => (
                            <RabListCard key={rab.id} rab={rab} onClick={() => openDetail(rab)} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
                        <p className="text-[14px] font-semibold text-[#31332C]">
                            RAB tidak ditemukan.
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

function RabDetailPage({
    rab,
    adminNoteDraft,
    customerNoteDraft,
    revisionNoteDraft,
    finalRabDraft,
    serviceFeeDraft,
    isSaved,
    feedbackMessage,
    canReview,
    canSendCustomer,
    canMarkCustomerDecision,
    canResendRevision,
    canCreateInvoice,
    onBack,
    onChangeAdminNote,
    onChangeCustomerNote,
    onChangeRevisionNote,
    onChangeFinalRab,
    onChangeServiceFee,
    onSave,
    onStatusChange,
    onReviewVendorEstimate,
    onSendRabToCustomer,
    onMarkCustomerRevision,
    onResendRevisedRab,
    onApproveRab,
    onCreateInvoice,
}: {
    rab: RabData;
    adminNoteDraft: string;
    customerNoteDraft: string;
    revisionNoteDraft: string;
    finalRabDraft: string;
    serviceFeeDraft: string;
    isSaved: boolean;
    feedbackMessage: string;
    canReview: boolean;
    canSendCustomer: boolean;
    canMarkCustomerDecision: boolean;
    canResendRevision: boolean;
    canCreateInvoice: boolean;
    onBack: () => void;
    onChangeAdminNote: (value: string) => void;
    onChangeCustomerNote: (value: string) => void;
    onChangeRevisionNote: (value: string) => void;
    onChangeFinalRab: (value: string) => void;
    onChangeServiceFee: (value: string) => void;
    onSave: () => void;
    onStatusChange: (status: RabStatus) => void;
    onReviewVendorEstimate: () => void;
    onSendRabToCustomer: () => void;
    onMarkCustomerRevision: () => void;
    onResendRevisedRab: () => void;
    onApproveRab: () => void;
    onCreateInvoice: () => void;
}) {
    const isChanged =
        adminNoteDraft !== rab.adminNote ||
        customerNoteDraft !== rab.customerNote ||
        revisionNoteDraft !== (rab.revisionNote ?? "") ||
        finalRabDraft !== rab.grandTotal ||
        serviceFeeDraft !== rab.vmatchServiceFee;

    return (
        <div className="space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
            >
                <ArrowLeft size={15} />
                Kembali ke daftar RAB
            </button>

            <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                                RAB Proyek
                            </p>

                            <RabStatusBadge status={rab.status} />
                        </div>

                        <h1 className="mt-3 max-w-[820px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                            {rab.projectTitle}
                        </h1>

                        <p className="mt-3 max-w-[860px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                            RAB final diisi oleh admin VMatch berdasarkan estimasi vendor,
                            biaya layanan, margin, dan catatan review sebelum dikirim ke customer.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Status RAB
                        </label>

                        <div className="relative mt-3">
                            <select
                                value={rab.status}
                                onChange={(event) =>
                                    onStatusChange(event.target.value as RabStatus)
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

                {feedbackMessage && (
                    <div className="border-t border-[#E8E2D9] bg-[#F5FAF6] px-5 py-3 text-[12px] font-semibold text-[#4F7A5F] sm:px-6">
                        {feedbackMessage}
                    </div>
                )}

                <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <InfoTile
                            icon={UserRound}
                            label="Customer"
                            value={rab.customerName}
                            description={rab.location}
                        />

                        <InfoTile
                            icon={Hammer}
                            label="Jenis Proyek"
                            value={rab.projectType}
                            description="Kategori pekerjaan"
                        />

                        <InfoTile
                            icon={Wallet}
                            label="Grand Total"
                            value={rab.grandTotal}
                            description="Estimasi final admin"
                        />

                        <InfoTile
                            icon={CalendarDays}
                            label="Update"
                            value={rab.updatedAt}
                            description={rab.createdAt}
                        />
                    </div>
                </div>

                <VendorEstimateSection estimate={rab.vendorEstimate} status={rab.status} />

                <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <section className="border-b border-[#E8E2D9] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                        <div className="max-w-[760px]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                Finalisasi RAB VMatch
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                Admin mengisi nominal final untuk customer berdasarkan estimasi vendor,
                                biaya layanan, margin, dan hasil review VMatch.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <SummaryTile
                                label="Estimasi Vendor"
                                value={rab.vendorEstimate?.estimatedCost ?? "Menunggu estimasi"}
                                description={rab.vendorEstimate?.vendorName ?? "Belum ada vendor"}
                            />

                            <MoneyInput
                                label="Penyesuaian Internal VMatch (Biaya Layanan + Margin)"
                                value={serviceFeeDraft}
                                onChange={onChangeServiceFee}
                                description="Data internal untuk menghitung RAB final. Tidak ditampilkan ke vendor maupun customer."
                                placeholder="Contoh: Rp3.500.000"
                            />

                            <MoneyInput
                                label="RAB Final untuk Customer"
                                value={finalRabDraft}
                                onChange={onChangeFinalRab}
                                description="Nominal final yang dikirim ke customer."
                                placeholder="Contoh: Rp27.000.000"
                            />

                            <SummaryTile
                                label="Estimasi Durasi"
                                value={rab.vendorEstimate?.estimatedDuration ?? "-"}
                                description="Estimasi waktu pengerjaan dari vendor"
                            />
                        </div>
                    </section>

                    <section className="p-5 sm:p-6">
                        <div className="max-w-[760px]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                Catatan & Revisi
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                Kelola catatan review admin, informasi untuk customer, dan
                                catatan revisi jika customer meminta perubahan.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <NoteField
                                label="Catatan Internal Admin"
                                value={adminNoteDraft}
                                onChange={onChangeAdminNote}
                            />

                            <NoteField
                                label="Catatan untuk Customer"
                                value={customerNoteDraft}
                                onChange={onChangeCustomerNote}
                            />

                            <NoteField
                                label="Catatan Revisi Customer"
                                value={revisionNoteDraft}
                                onChange={onChangeRevisionNote}
                                placeholder="Isi jika customer meminta revisi RAB."
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={!isChanged}
                                className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition sm:w-auto ${isChanged
                                        ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                                        : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                                    }`}
                            >
                                <Save size={14} />
                                {isSaved ? "Tersimpan" : "Simpan Catatan"}
                            </button>
                        </div>
                    </section>
                </div>
            </section>

            <ActionPanel
                canReview={canReview}
                canSendCustomer={canSendCustomer}
                canMarkCustomerDecision={canMarkCustomerDecision}
                canResendRevision={canResendRevision}
                canCreateInvoice={canCreateInvoice}
                onReviewVendorEstimate={onReviewVendorEstimate}
                onSendRabToCustomer={onSendRabToCustomer}
                onMarkCustomerRevision={onMarkCustomerRevision}
                onResendRevisedRab={onResendRevisedRab}
                onApproveRab={onApproveRab}
                onCreateInvoice={onCreateInvoice}
            />
        </div>
    );
}

function ActionPanel({
    canReview,
    canSendCustomer,
    canMarkCustomerDecision,
    canResendRevision,
    canCreateInvoice,
    onReviewVendorEstimate,
    onSendRabToCustomer,
    onMarkCustomerRevision,
    onResendRevisedRab,
    onApproveRab,
    onCreateInvoice,
}: {
    canReview: boolean;
    canSendCustomer: boolean;
    canMarkCustomerDecision: boolean;
    canResendRevision: boolean;
    canCreateInvoice: boolean;
    onReviewVendorEstimate: () => void;
    onSendRabToCustomer: () => void;
    onMarkCustomerRevision: () => void;
    onResendRevisedRab: () => void;
    onApproveRab: () => void;
    onCreateInvoice: () => void;
}) {
    if (canMarkCustomerDecision) {
        return (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={onApproveRab}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    <CheckCircle2 size={15} />
                    Tandai Disetujui
                </button>

                <button
                    type="button"
                    onClick={onMarkCustomerRevision}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                >
                    <MessageSquareWarning size={15} />
                    Minta Revisi
                </button>

                <button
                    type="button"
                    disabled
                    className="col-span-2 inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-4 text-[12px] font-semibold text-[#B8AEA5] sm:col-span-1"
                >
                    <ArrowRight size={15} />
                    Buat Invoice
                </button>
            </div>
        );
    }

    if (canResendRevision) {
        return (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={onResendRevisedRab}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    <RefreshCw size={15} />
                    Revisi & Kirim Ulang RAB
                </button>

                <button
                    type="button"
                    disabled
                    className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-4 text-[12px] font-semibold text-[#B8AEA5]"
                >
                    <ArrowRight size={15} />
                    Buat Invoice
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
                type="button"
                onClick={onReviewVendorEstimate}
                disabled={!canReview}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${canReview
                        ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
                        : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
                    }`}
            >
                <ClipboardCheck size={15} />
                Review Estimasi
            </button>

            <button
                type="button"
                onClick={onSendRabToCustomer}
                disabled={!canSendCustomer}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${canSendCustomer
                        ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
                        : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
                    }`}
            >
                <Send size={15} />
                Kirim Customer
            </button>

            <button
                type="button"
                onClick={onCreateInvoice}
                disabled={!canCreateInvoice}
                className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${canCreateInvoice
                        ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
                        : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
                    }`}
            >
                <ArrowRight size={15} />
                Buat Invoice
            </button>
        </div>
    );
}

function VendorEstimateSection({
    estimate,
    status,
}: {
    estimate?: VendorEstimate;
    status: RabStatus;
}) {
    return (
        <div className="border-t border-[#E8E2D9] bg-[#FFFDF9] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-[760px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Estimasi dari Vendor
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                        Estimasi ini menjadi bahan review admin dan belum langsung dikirim
                        ke customer.
                    </p>
                </div>

                <RabStatusBadge status={status} />
            </div>

            {estimate ? (
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
                        <p className="text-[13px] font-semibold text-[#31332C]">
                            {estimate.vendorName}
                        </p>

                        <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                            {estimate.vendorNote}
                        </p>

                        <p className="mt-3 text-[11px] text-[#9A8F86]">
                            Dikirim: {estimate.sentAt}
                        </p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                        <MiniInfo label="Estimasi Biaya" value={estimate.estimatedCost} />
                        <MiniInfo label="Estimasi Durasi" value={estimate.estimatedDuration} />
                        {estimate.suggestedMaterial && (
                            <MiniInfo label="Saran Material" value={estimate.suggestedMaterial} />
                        )}
                    </div>
                </div>
            ) : (
                <EmptyBox text="Estimasi vendor belum masuk. RAB final belum bisa dikirim ke customer." />
            )}
        </div>
    );
}

function RabListCard({ rab, onClick }: { rab: RabData; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
        >
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[#31332C]">
                        {rab.projectTitle}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {rab.customerName} • {rab.location}
                    </p>
                </div>

                <RabStatusBadge status={rab.status} />
            </div>

            <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {rab.status === "Revisi Diminta Customer"
                    ? rab.revisionNote ?? "Customer meminta revisi RAB."
                    : rab.vendorEstimate
                        ? `Estimasi dari ${rab.vendorEstimate.vendorName}: ${rab.vendorEstimate.estimatedCost}`
                        : "Menunggu estimasi dari vendor."}
            </p>

            <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium text-[#7B756E]">RAB Final VMatch</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
                        {rab.grandTotal}
                    </p>
                </div>

                <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
                    Update
                    <br />
                    {rab.updatedAt}
                </p>
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

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#31332C]">
                {value}
            </p>
        </div>
    );
}

function SummaryTile({
    label,
    value,
    description,
}: {
    label: string;
    value: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-2 line-clamp-1 text-[15px] font-semibold text-[#31332C]">
                {value}
            </p>

            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#7B756E]">
                {description}
            </p>
        </div>
    );
}


function MoneyInput({
    label,
    value,
    onChange,
    description,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description: string;
    placeholder: string;
}) {
    return (
        <label className="block rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </span>

            <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3">
                <Wallet size={15} className="shrink-0 text-[#725F54]" />

                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                />
            </div>

            <p className="mt-2 text-[11px] leading-5 text-[#7B756E]">
                {description}
            </p>
        </label>
    );
}

function NoteField({
    label,
    value,
    onChange,
    placeholder = "",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                {label}
            </span>

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={3}
                placeholder={placeholder}
                className="mt-2 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            />
        </label>
    );
}

function EmptyBox({ text }: { text: string }) {
    return (
        <div className="mt-4 rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-6 text-center">
            <p className="text-[13px] font-semibold text-[#31332C]">{text}</p>
        </div>
    );
}

function RabStatusBadge({ status }: { status: RabStatus }) {
    const style =
        status === "Estimasi Dikirim Vendor" || status === "RAB Direview Admin"
            ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
            : status === "RAB Dikirim ke Customer"
                ? "border-[#D8E0ED] bg-[#F5F8FC] text-[#526B8A]"
                : status === "RAB Disetujui Customer"
                    ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
                    : status === "Revisi Diminta Customer"
                        ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
                        : "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]";

    return (
        <span
            className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}
