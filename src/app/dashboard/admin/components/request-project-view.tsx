"use client";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    FileText,
    MapPin,
    MessageCircle,
    Phone,
    Save,
    Search,
    UserRound,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type RequestStatus =
    | "Baru Masuk"
    | "Menunggu Review"
    | "Butuh Konsultasi"
    | "Disetujui"
    | "Ditolak"
    | "Menunggu Vendor"
    | "Menjadi Proyek Aktif";

type RequestTab = "Semua" | "Baru" | "Review" | "Konsultasi" | "Disetujui";

type ProjectRequest = {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    projectTitle: string;
    projectType: string;
    location: string;
    budget: string;
    style: string;
    roomSize: string;
    targetTime: string;
    submittedAt: string;
    status: RequestStatus;
    description: string;
    referenceNote: string;
    adminNote: string;
};

const requestTabs: RequestTab[] = [
    "Semua",
    "Baru",
    "Review",
    "Konsultasi",
    "Disetujui",
];

const statusOptions: RequestStatus[] = [
    "Baru Masuk",
    "Menunggu Review",
    "Butuh Konsultasi",
    "Disetujui",
    "Menunggu Vendor",
    "Menjadi Proyek Aktif",
    "Ditolak",
];

const initialRequests: ProjectRequest[] = [
    {
        id: "req-1",
        customerName: "Alya Putri",
        customerEmail: "alya@email.com",
        customerPhone: "0812-3456-7890",
        projectTitle: "Kitchen Set Minimalis",
        projectType: "Kitchen Set",
        location: "Semarang",
        budget: "Rp18.000.000 - Rp25.000.000",
        style: "Minimalis Modern",
        roomSize: "2.5m x 2m",
        targetTime: "Bulan depan",
        submittedAt: "Hari ini, 09.20",
        status: "Baru Masuk",
        description:
            "Customer ingin membuat kitchen set minimalis dengan kabinet bawah dan atas. Area dapur kecil, jadi membutuhkan desain yang efisien dan mudah dibersihkan.",
        referenceNote:
            "Referensi warna putih tulang, kombinasi kayu muda, dan handle minimalis.",
        adminNote: "",
    },
    {
        id: "req-2",
        customerName: "Bima Santoso",
        customerEmail: "bima@email.com",
        customerPhone: "0821-2222-8899",
        projectTitle: "Wardrobe Kamar Utama",
        projectType: "Wardrobe",
        location: "Yogyakarta",
        budget: "Rp12.000.000 - Rp18.000.000",
        style: "Japandi",
        roomSize: "3m x 3m",
        targetTime: "Dalam 1 bulan",
        submittedAt: "Kemarin",
        status: "Menunggu Review",
        description:
            "Customer membutuhkan wardrobe built-in untuk kamar utama dengan ruang gantung, rak lipat, dan area penyimpanan tambahan.",
        referenceNote:
            "Model wardrobe full plafon dengan warna natural, pintu sliding, dan soft close.",
        adminNote: "Perlu cek ukuran detail sebelum dibuatkan brief awal.",
    },
    {
        id: "req-3",
        customerName: "Nadia Rahma",
        customerEmail: "nadia@email.com",
        customerPhone: "0857-1000-4421",
        projectTitle: "Ruang Kerja Rumah",
        projectType: "Ruang Kerja",
        location: "Solo",
        budget: "Rp8.000.000 - Rp12.000.000",
        style: "Scandinavian",
        roomSize: "2m x 3m",
        targetTime: "Secepatnya",
        submittedAt: "2 hari lalu",
        status: "Butuh Konsultasi",
        description:
            "Customer ingin membuat meja kerja custom, rak buku, dan storage kecil untuk ruang kerja di rumah.",
        referenceNote:
            "Ingin tampilan sederhana, terang, dan tidak terlalu banyak dekorasi.",
        adminNote: "Disarankan konsultasi untuk memastikan kebutuhan storage.",
    },
    {
        id: "req-4",
        customerName: "Raka Pratama",
        customerEmail: "raka@email.com",
        customerPhone: "0813-7788-9922",
        projectTitle: "Backdrop TV Ruang Keluarga",
        projectType: "Backdrop TV",
        location: "Semarang",
        budget: "Rp10.000.000 - Rp15.000.000",
        style: "Modern Warm",
        roomSize: "3.5m x 3m",
        targetTime: "Fleksibel",
        submittedAt: "3 hari lalu",
        status: "Disetujui",
        description:
            "Customer ingin membuat backdrop TV dengan kabinet bawah, panel dinding, dan tempat display sederhana.",
        referenceNote:
            "Warna coklat muda, aksen hitam tipis, dan desain tidak terlalu ramai.",
        adminNote: "Request sudah layak dibuatkan brief awal.",
    },
];

export function RequestProjectView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [requests, setRequests] = useState<ProjectRequest[]>(initialRequests);
    const [activeTab, setActiveTab] = useState<RequestTab>("Semua");
    const [selectedRequestId, setSelectedRequestId] = useState(
        initialRequests[0]?.id ?? "",
    );
    const [keyword, setKeyword] = useState("");
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

    const [adminNoteDraft, setAdminNoteDraft] = useState(
        initialRequests[0]?.adminNote ?? "",
    );
    const [isNoteSaved, setIsNoteSaved] = useState(false);

    const filteredRequests = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return requests.filter((request) => {
            const matchTab =
                activeTab === "Semua" ||
                (activeTab === "Baru" && request.status === "Baru Masuk") ||
                (activeTab === "Review" && request.status === "Menunggu Review") ||
                (activeTab === "Konsultasi" &&
                    request.status === "Butuh Konsultasi") ||
                (activeTab === "Disetujui" &&
                    ["Disetujui", "Menunggu Vendor", "Menjadi Proyek Aktif"].includes(
                        request.status,
                    ));

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                request.projectTitle.toLowerCase().includes(normalizedKeyword) ||
                request.customerName.toLowerCase().includes(normalizedKeyword) ||
                request.location.toLowerCase().includes(normalizedKeyword) ||
                request.projectType.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, requests]);

    const selectedRequest = useMemo(() => {
        return (
            requests.find((request) => request.id === selectedRequestId) ??
            filteredRequests[0] ??
            requests[0]
        );
    }, [filteredRequests, requests, selectedRequestId]);

    const updateSelectedStatus = (status: RequestStatus) => {
        if (!selectedRequest) return;

        setRequests((current) =>
            current.map((request) =>
                request.id === selectedRequest.id
                    ? {
                        ...request,
                        status,
                    }
                    : request,
            ),
        );
    };

    const updateAdminNote = (note: string) => {
        if (!selectedRequest) return;

        setRequests((current) =>
            current.map((request) =>
                request.id === selectedRequest.id
                    ? {
                        ...request,
                        adminNote: note,
                    }
                    : request,
            ),
        );
    };

    const handleSelectRequest = (id: string) => {
        const nextRequest = requests.find((request) => request.id === id);

        setSelectedRequestId(id);
        setAdminNoteDraft(nextRequest?.adminNote ?? "");
        setIsNoteSaved(false);
        setIsMobileDetailOpen(true);
    };

    if (!selectedRequest) {
        return null;
    }

    const isAdminNoteChanged = adminNoteDraft !== selectedRequest.adminNote;

    return (
        <div className="space-y-6">
            <section className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
                <div
                    className={`space-y-4 ${isMobileDetailOpen ? "hidden xl:block" : "block"
                        }`}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                                    Daftar Request
                                </h1>

                                <p className="mt-2 text-[12px] text-[#7B756E]">
                                    Pilih pengajuan untuk melihat detail.
                                </p>
                            </div>
                        </div>

                        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-3">
                            <Search size={16} className="shrink-0 text-[#9A8F86]" />

                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Cari request..."
                                className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                            />
                        </div>

                        {/* Mobile */}
                        <div className="relative sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(event) => setActiveTab(event.target.value as RequestTab)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
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

                        {/* Desktop */}
                        <div className="hidden rounded-2xl border border-[#E8E2D9] bg-white p-1.5 sm:block">
                            <div className="grid grid-cols-5 gap-1.5">
                                {requestTabs.map((tab) => {
                                    const active = activeTab === tab;

                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex h-10 w-full items-center justify-center rounded-xl px-2 text-[12px] font-semibold whitespace-nowrap transition ${active
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
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        selected={selectedRequest.id === request.id}
                                        onClick={() => handleSelectRequest(request.id)}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center">
                                    <p className="text-[13px] font-semibold text-[#31332C]">
                                        Request tidak ditemukan.
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

                    <AdminSectionCard
                        title="Detail Request"
                        action={<RequestStatusBadge status={selectedRequest.status} />}
                    >
                        <div className="space-y-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        {selectedRequest.projectType}
                                    </p>

                                    <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                                        {selectedRequest.projectTitle}
                                    </h2>

                                    <p className="mt-3 text-[13px] leading-7 text-[#7B756E]">
                                        {selectedRequest.description}
                                    </p>
                                </div>

                                <div className="w-full rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 lg:w-[240px]">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Status Request
                                    </label>

                                    <div className="relative mt-3">
                                        <select
                                            value={selectedRequest.status}
                                            onChange={(event) =>
                                                updateSelectedStatus(event.target.value as RequestStatus)
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
                                    value={selectedRequest.customerName}
                                    description={selectedRequest.customerEmail}
                                />

                                <InfoTile
                                    icon={Phone}
                                    label="Kontak"
                                    value={selectedRequest.customerPhone}
                                    description="Nomor aktif"
                                />

                                <InfoTile
                                    icon={MapPin}
                                    label="Lokasi"
                                    value={selectedRequest.location}
                                    description={selectedRequest.roomSize}
                                />

                                <InfoTile
                                    icon={Wallet}
                                    label="Budget"
                                    value={selectedRequest.budget}
                                    description={selectedRequest.projectType}
                                />

                                <InfoTile
                                    icon={FileText}
                                    label="Gaya"
                                    value={selectedRequest.style}
                                    description="Preferensi desain"
                                />

                                <InfoTile
                                    icon={CalendarDays}
                                    label="Target"
                                    value={selectedRequest.targetTime}
                                    description={selectedRequest.submittedAt}
                                />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Referensi Customer
                                    </p>

                                    <p className="mt-3 text-[13px] leading-6 text-[#6F6860]">
                                        {selectedRequest.referenceNote}
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
                                            <span className="rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
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
                                        placeholder="Tambahkan catatan review admin..."
                                        rows={5}
                                        className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                    />

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateAdminNote(adminNoteDraft);
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
                            icon={MessageCircle}
                            title="Jadwalkan Konsultasi"
                            description="Ubah request menjadi butuh konsultasi."
                            onClick={() => {
                                updateSelectedStatus("Butuh Konsultasi");
                                onChangePage?.("consultations");
                            }}
                        />

                        <ActionButton
                            icon={FileText}
                            title="Buat Brief Awal"
                            description="Lanjutkan ke brief dan dokumen proyek."
                            onClick={() => {
                                updateSelectedStatus("Disetujui");
                                onChangePage?.("documents");
                            }}
                        />

                        <ActionButton
                            icon={CheckCircle2}
                            title="Jadikan Proyek Aktif"
                            description="Pindahkan ke proyek aktif."
                            onClick={() => {
                                updateSelectedStatus("Menjadi Proyek Aktif");
                                onChangePage?.("active-projects");
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function RequestCard({
    request,
    selected,
    onClick,
}: {
    request: ProjectRequest;
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
                <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#31332C]">
                        {request.projectTitle}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {request.customerName} • {request.location}
                    </p>
                </div>

                <RequestStatusBadge status={request.status} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="truncate text-[11px] text-[#9A8F86]">
                    {request.submittedAt}
                </p>

                <span className="text-[11px] font-semibold text-[#725F54]">
                    {request.projectType}
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

function RequestStatusBadge({ status }: { status: RequestStatus }) {
    const styles: Record<RequestStatus, string> = {
        "Baru Masuk": "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]",
        "Menunggu Review": "border-[#D9C8BA] bg-[#FCFBF9] text-[#725F54]",
        "Butuh Konsultasi": "border-[#D9C8BA] bg-[#FCFBF9] text-[#725F54]",
        Disetujui: "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]",
        "Menunggu Vendor": "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]",
        "Menjadi Proyek Aktif": "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]",
        Ditolak: "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]",
    };

    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${styles[status]}`}
        >
            {status}
        </span>
    );
}
