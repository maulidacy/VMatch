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
    Plus,
    Save,
    Search,
    UserRound,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
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

function formatRupiahShort(value: string) {
    const numberValue = Number(value.replace(/[^\d]/g, ""));

    if (!numberValue) return "Rp0";

    if (numberValue >= 1_000_000_000) {
        const billion = numberValue / 1_000_000_000;
        return `Rp${billion % 1 === 0 ? billion.toFixed(0) : billion.toFixed(1).replace(".", ",")} M`;
    }

    if (numberValue >= 1_000_000) {
        const million = numberValue / 1_000_000;
        return `Rp${million % 1 === 0 ? million.toFixed(0) : million.toFixed(1).replace(".", ",")} jt`;
    }

    if (numberValue >= 1_000) {
        return `Rp${Math.round(numberValue / 1_000)} rb`;
    }

    return `Rp${numberValue}`;
}

export function CustomerView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [customers, setCustomers] = useState<CustomerItem[]>(initialCustomers);
    const [activeTab, setActiveTab] = useState<CustomerTab>("Semua");
    const [keyword, setKeyword] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState(
        initialCustomers[0]?.id ?? "",
    );
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

    const [adminNoteDraft, setAdminNoteDraft] = useState(
        initialCustomers[0]?.adminNote ?? "",
    );
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
                customer.source.toLowerCase().includes(normalizedKeyword);

            return matchTab && matchKeyword;
        });
    }, [activeTab, keyword, customers]);

    const selectedCustomer = useMemo(() => {
        return (
            customers.find((customer) => customer.id === selectedCustomerId) ??
            filteredCustomers[0] ??
            customers[0]
        );
    }, [customers, filteredCustomers, selectedCustomerId]);

    const updateSelectedCustomer = (
        field: keyof CustomerItem,
        value: string | number | CustomerStatus,
    ) => {
        if (!selectedCustomer) return;

        setCustomers((current) =>
            current.map((customer) =>
                customer.id === selectedCustomer.id
                    ? {
                        ...customer,
                        [field]: value,
                        lastContact: "Baru saja",
                    }
                    : customer,
            ),
        );
    };

    const updateStatus = (status: CustomerStatus) => {
        updateSelectedCustomer("status", status);

        if (status === "Aktif") setActiveTab("Aktif");
        if (status === "Baru") setActiveTab("Baru");
        if (status === "Perlu Follow Up") setActiveTab("Follow Up");
        if (status === "Nonaktif") setActiveTab("Nonaktif");
    };

    const handleSelectCustomer = (id: string) => {
        const nextCustomer = customers.find((customer) => customer.id === id);

        setSelectedCustomerId(id);
        setAdminNoteDraft(nextCustomer?.adminNote ?? "");
        setIsNoteSaved(false);
        setIsMobileDetailOpen(true);
    };

    const addMockCustomer = () => {
        const newCustomer: CustomerItem = {
            id: `customer-${Date.now()}`,
            name: "Customer Baru",
            email: "customer@email.com",
            phone: "08xx-xxxx-xxxx",
            city: "Kota customer",
            source: "Landing Page",
            joinedAt: "Hari ini",
            lastContact: "Baru saja",
            status: "Baru",
            totalRequests: 0,
            activeProjects: 0,
            completedProjects: 0,
            totalValue: "Rp0",
            preferredStyle: "Belum ditentukan",
            budgetRange: "Belum ditentukan",
            latestNeed: "Tuliskan kebutuhan awal customer.",
            adminNote: "Tambahkan catatan admin untuk customer ini.",
            projects: [],
        };

        setCustomers((current) => [newCustomer, ...current]);
        setSelectedCustomerId(newCustomer.id);
        setAdminNoteDraft(newCustomer.adminNote);
        setIsNoteSaved(false);
        setIsMobileDetailOpen(true);
        setActiveTab("Baru");
    };

    if (!selectedCustomer) return null;

    const isAdminNoteChanged = adminNoteDraft !== selectedCustomer.adminNote;

    return (
        <div className="space-y-5">
            <section className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
                <div
                    className={`space-y-4 ${isMobileDetailOpen ? "hidden xl:block" : "block"
                        }`}
                >
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h1 className="font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                                    Daftar Customer
                                </h1>

                                <p className="mt-2 text-[12px] text-[#7B756E]">
                                    Pilih customer untuk melihat profil, kebutuhan, dan riwayat proyek.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addMockCustomer}
                                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                            >
                                <Plus size={15} />
                                <span className="hidden sm:inline">Tambah</span>
                            </button>
                        </div>

                        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-3">
                            <Search size={16} className="shrink-0 text-[#9A8F86]" />

                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Cari customer..."
                                className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
                            />
                        </div>

                        <div className="relative sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(event) =>
                                    setActiveTab(event.target.value as CustomerTab)
                                }
                                className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-white pl-4 pr-12 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
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

                        <div className="hidden rounded-2xl border border-[#E8E2D9] bg-white p-1.5 sm:block">
                            <div className="grid grid-cols-5 gap-1.5">
                                {customerTabs.map((tab) => {
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
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <CustomerCard
                                        key={customer.id}
                                        customer={customer}
                                        selected={selectedCustomer.id === customer.id}
                                        onClick={() => handleSelectCustomer(customer.id)}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center">
                                    <p className="text-[13px] font-semibold text-[#31332C]">
                                        Customer tidak ditemukan.
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
                        <AdminSectionCard title="Detail Customer">
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            Profil Customer
                                        </p>

                                        <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[30px]">
                                            {selectedCustomer.name}
                                        </h2>

                                        <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                                            Customer dari {selectedCustomer.city}, masuk melalui{" "}
                                            <span className="font-semibold text-[#725F54]">
                                                {selectedCustomer.source}
                                            </span>
                                            .
                                        </p>
                                    </div>

                                    <CustomerStatusBadge status={selectedCustomer.status} />
                                </div>

                                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <InfoTile
                                            icon={Mail}
                                            label="Email"
                                            value={selectedCustomer.email}
                                            description="Kontak customer"
                                        />

                                        <InfoTile
                                            icon={Phone}
                                            label="Telepon"
                                            value={selectedCustomer.phone}
                                            description="Nomor customer"
                                        />
                                    </div>

                                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                        <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            Status Customer
                                        </label>

                                        <div className="relative mt-3">
                                            <select
                                                value={selectedCustomer.status}
                                                onChange={(event) =>
                                                    updateStatus(event.target.value as CustomerStatus)
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

                                <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                                    <AmountTile
                                        label="Request"
                                        value={`${selectedCustomer.totalRequests}`}
                                        description="Pengajuan proyek"
                                    />

                                    <AmountTile
                                        label="Proyek Aktif"
                                        value={`${selectedCustomer.activeProjects}`}
                                        description="Sedang berjalan"
                                        highlight
                                    />

                                    <AmountTile
                                        label="Selesai"
                                        value={`${selectedCustomer.completedProjects}`}
                                        description="Proyek selesai"
                                    />

                                    <AmountTile
                                        label="Nilai Proyek"
                                        value={formatRupiahShort(selectedCustomer.totalValue)}
                                        description="Total estimasi"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <InfoTile
                                        icon={MapPin}
                                        label="Kota"
                                        value={selectedCustomer.city}
                                        description={selectedCustomer.source}
                                    />

                                    <InfoTile
                                        icon={CalendarDays}
                                        label="Bergabung"
                                        value={selectedCustomer.joinedAt}
                                        description={selectedCustomer.lastContact}
                                    />

                                    <InfoTile
                                        icon={UserRound}
                                        label="Gaya"
                                        value={selectedCustomer.preferredStyle}
                                        description="Preferensi desain"
                                    />
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                            Preferensi Customer
                                        </p>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                                    Gaya Desain
                                                </p>

                                                <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                                                    {selectedCustomer.preferredStyle}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                                    Budget
                                                </p>

                                                <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                                                    {selectedCustomer.budgetRange}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
                                            {selectedCustomer.latestNeed}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                                    Catatan Admin
                                                </p>

                                                <p className="mt-1 text-[12px] text-[#7B756E]">
                                                    Catatan internal untuk follow up customer.
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
                                            rows={5}
                                            className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                        />

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateSelectedCustomer("adminNote", adminNoteDraft);
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

                                <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                                        {selectedCustomer.projects.length > 0 ? (
                                            selectedCustomer.projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="rounded-xl border border-[#E8E2D9] bg-white p-3 transition hover:border-[#725F54] hover:bg-[#F4EEE8]"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-[13px] font-semibold text-[#31332C]">
                                                                {project.title}
                                                            </p>

                                                            <p className="mt-1 truncate text-[11px] text-[#7B756E]">
                                                                {project.status} • {formatRupiahShort(project.value)}
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
                            </div>
                        </AdminSectionCard>

                        <div className="space-y-5">
                            <div className="grid gap-2 sm:grid-cols-3 2xl:grid-cols-1">
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
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                                >
                                    <Wallet size={15} />
                                    Pembayaran
                                </button>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-1">
                                <button
                                    type="button"
                                    onClick={() => onChangePage?.("requests")}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                                >
                                    Ke Request Proyek
                                    <ArrowRight size={14} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onChangePage?.("consultations")}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                                >
                                    Ke Konsultasi
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}

function CustomerCard({
    customer,
    selected,
    onClick,
}: {
    customer: CustomerItem;
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
                        {customer.name}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {customer.city} • {customer.source}
                    </p>
                </div>

                <CustomerStatusBadge status={customer.status} />
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium text-[#7B756E]">
                        Nilai Proyek
                    </p>

                    <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
                        {formatRupiahShort(customer.totalValue)}
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
    return (
        <div
            className={`min-w-0 rounded-2xl border p-4 transition ${highlight
                ? "border-[#D9C8BA] bg-[#FFFDF9]"
                : "border-[#E8E2D9] bg-[#FCFBF9]"
                } hover:border-[#725F54] hover:bg-[#F4EEE8]`}
        >
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-2 truncate font-serif text-[24px] leading-none text-[#31332C]">
                {value}
            </p>

            <p className="mt-2 truncate text-[11px] text-[#7B756E]">
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
        <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-[#F4EEE8]">
            <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
                    <Icon size={16} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        {label}
                    </p>

                    <p className="mt-1 break-words text-[13px] font-semibold leading-5 text-[#31332C]">
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
            className={`inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
        >
            {status}
        </span>
    );
}