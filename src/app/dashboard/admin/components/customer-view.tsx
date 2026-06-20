"use client";

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    ChevronDown,
    ClipboardList,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Save,
    Search,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminPageId } from "../types";

type CustomerStatus = "Aktif" | "Baru" | "Perlu Follow Up" | "Nonaktif";

type CustomerTab = "Semua" | "Aktif" | "Baru" | "Follow Up" | "Nonaktif";

type CustomerProject = {
    id: string;
    title: string;
    status: string;
    progress: number;
    value: string;
};

type CustomerItem = {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    source: string;
    joinedAt: string;
    lastContact: string;
    status: CustomerStatus;
    totalRequests: number;
    activeProjects: number;
    completedProjects: number;
    totalValue: string;
    preferredStyle: string;
    budgetRange: string;
    latestNeed: string;
    adminNote: string;
    projects: CustomerProject[];
};

const customerTabs: CustomerTab[] = [
    "Semua",
    "Aktif",
    "Baru",
    "Follow Up",
    "Nonaktif",
];

const statusOptions: CustomerStatus[] = [
    "Aktif",
    "Baru",
    "Perlu Follow Up",
    "Nonaktif",
];

const initialCustomers: CustomerItem[] = [
    {
        id: "customer-1",
        name: "Alya Putri",
        email: "alya@email.com",
        phone: "0812-3456-7890",
        city: "Semarang",
        source: "Landing Page",
        joinedAt: "28 Juni 2026",
        lastContact: "Hari ini",
        status: "Aktif",
        totalRequests: 2,
        activeProjects: 1,
        completedProjects: 0,
        totalValue: "Rp23.500.000",
        preferredStyle: "Minimalis Modern",
        budgetRange: "Rp18.000.000 - Rp25.000.000",
        latestNeed:
            "Customer ingin kitchen set minimalis untuk dapur kecil dengan penyimpanan yang efisien.",
        adminNote:
            "Customer responsif dan sudah punya referensi desain. Perlu dipandu pada pilihan material dan finishing.",
        projects: [
            {
                id: "project-1",
                title: "Kitchen Set Minimalis",
                status: "Produksi kabinet",
                progress: 45,
                value: "Rp23.500.000",
            },
        ],
    },
    {
        id: "customer-2",
        name: "Bima Santoso",
        email: "bima@email.com",
        phone: "0821-2222-8899",
        city: "Yogyakarta",
        source: "Referral",
        joinedAt: "30 Juni 2026",
        lastContact: "Kemarin",
        status: "Perlu Follow Up",
        totalRequests: 1,
        activeProjects: 1,
        completedProjects: 0,
        totalValue: "Rp16.000.000",
        preferredStyle: "Japandi",
        budgetRange: "Rp12.000.000 - Rp18.000.000",
        latestNeed:
            "Customer membutuhkan wardrobe built-in full plafon dengan pintu sliding dan area gantung tambahan.",
        adminNote:
            "Perlu follow up terkait revisi layout bagian dalam wardrobe dan konfirmasi pilihan rel sliding.",
        projects: [
            {
                id: "project-1",
                title: "Wardrobe Kamar Utama",
                status: "Revisi layout",
                progress: 35,
                value: "Rp16.000.000",
            },
        ],
    },
    {
        id: "customer-3",
        name: "Nadia Rahma",
        email: "nadia@email.com",
        phone: "0857-1000-4421",
        city: "Solo",
        source: "Instagram",
        joinedAt: "1 Juli 2026",
        lastContact: "Hari ini",
        status: "Aktif",
        totalRequests: 1,
        activeProjects: 1,
        completedProjects: 0,
        totalValue: "Rp10.500.000",
        preferredStyle: "Scandinavian",
        budgetRange: "Rp8.000.000 - Rp12.000.000",
        latestNeed:
            "Customer ingin ruang kerja sederhana, terang, dan tidak terlalu penuh.",
        adminNote:
            "Kebutuhan sudah cukup jelas. Cocok diarahkan ke vendor spesialis furniture ruang kerja.",
        projects: [
            {
                id: "project-1",
                title: "Ruang Kerja Rumah",
                status: "QC finishing",
                progress: 82,
                value: "Rp10.500.000",
            },
        ],
    },
    {
        id: "customer-4",
        name: "Raka Pratama",
        email: "raka@email.com",
        phone: "0813-7788-9922",
        city: "Semarang",
        source: "Landing Page",
        joinedAt: "15 Juni 2026",
        lastContact: "3 hari lalu",
        status: "Aktif",
        totalRequests: 1,
        activeProjects: 0,
        completedProjects: 1,
        totalValue: "Rp13.800.000",
        preferredStyle: "Modern Warm",
        budgetRange: "Rp10.000.000 - Rp15.000.000",
        latestNeed:
            "Customer ingin backdrop TV dengan kabinet bawah, panel dinding, dan warna coklat muda.",
        adminNote:
            "Proyek sudah selesai. Customer potensial untuk follow up layanan tambahan ruang keluarga.",
        projects: [
            {
                id: "project-1",
                title: "Backdrop TV Ruang Keluarga",
                status: "Selesai",
                progress: 100,
                value: "Rp13.800.000",
            },
        ],
    },
    {
        id: "customer-5",
        name: "Customer Baru",
        email: "customerbaru@email.com",
        phone: "08xx-xxxx-xxxx",
        city: "Semarang",
        source: "Katalog Desain",
        joinedAt: "Hari ini",
        lastContact: "Hari ini",
        status: "Baru",
        totalRequests: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalValue: "Rp0",
        preferredStyle: "Belum ditentukan",
        budgetRange: "Belum ditentukan",
        latestNeed:
            "Customer baru melihat inspirasi desain dan belum mengajukan proyek.",
        adminNote:
            "Perlu follow up ringan untuk mengetahui kebutuhan awal customer.",
        projects: [],
    },
];

function formatRupiah(value: string) {
    const numberValue = Number(value.replace(/[^\d]/g, ""));

    if (!numberValue) return "Rp0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    })
        .format(numberValue)
        .replace(/\s/g, "");
}

export function CustomerView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [customers, setCustomers] = useState<CustomerItem[]>(initialCustomers);
    const [activeTab, setActiveTab] = useState<CustomerTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        null,
    );
    const [adminNoteDraft, setAdminNoteDraft] = useState("");
    const [isNoteSaved, setIsNoteSaved] = useState(false);

    const filteredCustomers = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return customers.filter((customer) => {
            const matchTab =
                activeTab === "Semua" ||
                (activeTab === "Aktif" && customer.status === "Aktif") ||
                (activeTab === "Baru" && customer.status === "Baru") ||
                (activeTab === "Follow Up" &&
                    customer.status === "Perlu Follow Up") ||
                (activeTab === "Nonaktif" && customer.status === "Nonaktif");

            const matchKeyword =
                normalizedKeyword.length === 0 ||
                customer.name.toLowerCase().includes(normalizedKeyword) ||
                customer.email.toLowerCase().includes(normalizedKeyword) ||
                customer.phone.toLowerCase().includes(normalizedKeyword) ||
                customer.city.toLowerCase().includes(normalizedKeyword) ||
                customer.source.toLowerCase().includes(normalizedKeyword) ||
                customer.status.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, customers]);

    const selectedCustomer = useMemo(() => {
        if (!selectedCustomerId) return null;

        return (
            customers.find((customer) => customer.id === selectedCustomerId) ?? null
        );
    }, [customers, selectedCustomerId]);

    const openDetail = (customer: CustomerItem) => {
        setSelectedCustomerId(customer.id);
        setAdminNoteDraft(customer.adminNote);
        setIsNoteSaved(false);
    };

    const closeDetail = () => {
        setSelectedCustomerId(null);
        setAdminNoteDraft("");
        setIsNoteSaved(false);
    };

    const updateCustomer = (
        id: string,
        updater: (customer: CustomerItem) => CustomerItem,
    ) => {
        setCustomers((current) =>
            current.map((customer) =>
                customer.id === id
                    ? {
                        ...updater(customer),
                        lastContact: "Baru saja",
                    }
                    : customer,
            ),
        );
    };

    const updateStatus = (id: string, status: CustomerStatus) => {
        updateCustomer(id, (customer) => ({
            ...customer,
            status,
        }));

        if (status === "Aktif") setActiveTab("Aktif");
        if (status === "Baru") setActiveTab("Baru");
        if (status === "Perlu Follow Up") setActiveTab("Follow Up");
        if (status === "Nonaktif") setActiveTab("Nonaktif");
    };

    const saveAdminNote = () => {
        if (!selectedCustomer) return;

        updateCustomer(selectedCustomer.id, (customer) => ({
            ...customer,
            adminNote: adminNoteDraft,
        }));

        setIsNoteSaved(true);
    };

    if (selectedCustomer) {
        return (
            <CustomerDetailPage
                customer={selectedCustomer}
                adminNoteDraft={adminNoteDraft}
                isNoteSaved={isNoteSaved}
                onBack={closeDetail}
                onStatusChange={(status) => updateStatus(selectedCustomer.id, status)}
                onChangeNote={(value) => {
                    setAdminNoteDraft(value);
                    setIsNoteSaved(false);
                }}
                onSaveNote={saveAdminNote}
                onChangePage={onChangePage}
            />
        );
    }

    return (
        <div className="space-y-5">
            <section className="pb-1">
                <div className="max-w-[820px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                        Customer
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                        Daftar Customer
                    </h1>

                    <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
                        Pantau data customer, kontak, sumber masuk, kebutuhan interior,
                        nilai proyek, riwayat pengerjaan, dan catatan follow up admin.
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
                            placeholder="Cari customer, email, kota, sumber, atau status..."
                            className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                        />
                    </div>

                    <div className="relative sm:hidden">
                        <select
                            value={activeTab}
                            onChange={(event) =>
                                setActiveTab(event.target.value as CustomerTab)
                            }
                            className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                        >
                            {customerTabs.map((tab) => (
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
                            {customerTabs.map((tab) => {
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
                {filteredCustomers.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                        {filteredCustomers.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onClick={() => openDetail(customer)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
                        <p className="text-[14px] font-semibold text-[#31332C]">
                            Customer tidak ditemukan.
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

function CustomerDetailPage({
    customer,
    adminNoteDraft,
    isNoteSaved,
    onBack,
    onStatusChange,
    onChangeNote,
    onSaveNote,
    onChangePage,
}: {
    customer: CustomerItem;
    adminNoteDraft: string;
    isNoteSaved: boolean;
    onBack: () => void;
    onStatusChange: (status: CustomerStatus) => void;
    onChangeNote: (value: string) => void;
    onSaveNote: () => void;
    onChangePage?: (page: AdminPageId) => void;
}) {
    const isAdminNoteChanged = adminNoteDraft !== customer.adminNote;

    return (
        <div className="space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
            >
                <ArrowLeft size={15} />
                Kembali ke daftar customer
            </button>

            <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                                Profil Customer
                            </p>

                            <CustomerStatusBadge status={customer.status} />
                        </div>

                        <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                            {customer.name}
                        </h1>

                        <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                            Customer dari {customer.city}, masuk melalui{" "}
                            <span className="font-semibold text-[#725F54]">
                                {customer.source}
                            </span>
                            . Gunakan halaman ini untuk melihat kebutuhan, riwayat proyek,
                            kontak, dan catatan follow up.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Status Customer
                        </label>

                        <div className="relative mt-3">
                            <select
                                value={customer.status}
                                onChange={(event) =>
                                    onStatusChange(event.target.value as CustomerStatus)
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
                            icon={Mail}
                            label="Email"
                            value={customer.email}
                            description="Kontak customer"
                        />

                        <InfoTile
                            icon={Phone}
                            label="Telepon"
                            value={customer.phone}
                            description="Nomor customer"
                        />

                        <InfoTile
                            icon={MapPin}
                            label="Kota"
                            value={customer.city}
                            description={customer.source}
                        />

                        <InfoTile
                            icon={CalendarDays}
                            label="Bergabung"
                            value={customer.joinedAt}
                            description={customer.lastContact}
                        />
                    </div>
                </div>

                <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
                    <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                        <AmountTile
                            label="Request"
                            value={`${customer.totalRequests}`}
                            description="Pengajuan proyek"
                        />

                        <AmountTile
                            label="Proyek Aktif"
                            value={`${customer.activeProjects}`}
                            description="Sedang berjalan"
                            highlight
                        />

                        <AmountTile
                            label="Selesai"
                            value={`${customer.completedProjects}`}
                            description="Proyek selesai"
                        />

                        <AmountTile
                            label="Nilai Proyek"
                            value={formatRupiah(customer.totalValue)}
                            description="Total estimasi"
                        />
                    </div>
                </div>

                <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <DetailBlock
                        title="Preferensi Customer"
                        description="Kebutuhan interior, gaya desain, dan rentang budget customer."
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                    Gaya Desain
                                </p>

                                <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                                    {customer.preferredStyle}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                    Budget
                                </p>

                                <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                                    {customer.budgetRange}
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-[13px] leading-7 text-[#6F6860]">
                            {customer.latestNeed}
                        </p>
                    </DetailBlock>

                    <DetailBlock
                        title="Catatan Admin"
                        description="Catatan internal untuk follow up customer."
                        badge={isNoteSaved ? "Tersimpan" : undefined}
                        withRightBorder={false}
                    >
                        <textarea
                            value={adminNoteDraft}
                            onChange={(event) => onChangeNote(event.target.value)}
                            rows={5}
                            className="w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                        />

                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={onSaveNote}
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
                    </DetailBlock>
                </div>

                <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                Riwayat Proyek
                            </p>

                            <p className="mt-1 text-[12px] text-[#7B756E]">
                                Proyek yang pernah atau sedang dikelola VMatch.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onChangePage?.("active-projects")}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                        >
                            Lihat Proyek
                            <ArrowRight size={13} />
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {customer.projects.length > 0 ? (
                            customer.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="rounded-xl border border-[#E8E2D9] bg-white p-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-[13px] font-semibold text-[#31332C]">
                                                {project.title}
                                            </p>

                                            <p className="mt-1 truncate text-[11px] text-[#7B756E]">
                                                {project.status} • {formatRupiah(project.value)}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-[12px] font-semibold text-[#725F54]">
                                            {project.progress}%
                                        </span>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                                        <div
                                            className="h-full rounded-full bg-[#725F54]"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-[#E8E2D9] bg-white p-4 text-center">
                                <p className="text-[12px] text-[#7B756E]">
                                    Belum ada proyek.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={() => onChangePage?.("consultations")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                >
                    <MessageCircle size={15} />
                    Konsultasi
                </button>

                <button
                    type="button"
                    onClick={() => onChangePage?.("requests")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                >
                    <ClipboardList size={15} />
                    Request
                </button>

                <button
                    type="button"
                    onClick={() => onChangePage?.("payments")}
                    className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white sm:col-span-1"
                >
                    <Wallet size={15} />
                    Pembayaran
                </button>
            </div>
        </div>
    );
}

function DetailBlock({
    title,
    description,
    children,
    badge,
    withRightBorder = true,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
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

                {badge && (
                    <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
                        {badge}
                    </span>
                )}
            </div>

            <div className="mt-4">{children}</div>
        </div>
    );
}

function CustomerCard({
    customer,
    onClick,
}: {
    customer: CustomerItem;
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
                        {customer.name}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {customer.city} • {customer.source}
                    </p>
                </div>

                <CustomerStatusBadge status={customer.status} />
            </div>

            <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {customer.latestNeed}
            </p>

            <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium text-[#7B756E]">
                        Nilai Proyek
                    </p>

                    <p className="mt-1 text-[13px] font-semibold text-[#31332C] sm:text-[14px]">
                        {formatRupiah(customer.totalValue)}
                    </p>
                </div>

                <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
                    {customer.totalRequests} request
                    <br />
                    {customer.activeProjects} proyek aktif
                </p>
            </div>
        </button>
    );
}

function AmountTile({
  label,
  value,
  description,
  highlight,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  const isLongValue = value.length > 8;

  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 transition ${
        highlight ? "border-[#D9C8BA] bg-white" : "border-[#E8E2D9] bg-white"
      } hover:border-[#725F54] hover:bg-[#FCFBF9]`}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p
        className={`mt-2 truncate font-serif leading-none text-[#31332C] ${
          isLongValue ? "text-[22px]" : "text-[26px]"
        }`}
        title={value}
      >
        {value}
      </p>

      <p className="mt-2 truncate text-[11px] leading-5 text-[#7B756E]">
        {description}
      </p>
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

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
    const style =
        status === "Aktif"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : status === "Baru"
                ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                : status === "Perlu Follow Up"
                    ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                    : "border-[#E8E2D9] bg-white text-[#9A8F86]";

    return (
        <span
            className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}
