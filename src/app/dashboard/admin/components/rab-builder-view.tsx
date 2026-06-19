"use client";

import {
    ArrowRight,
    Calculator,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Hammer,
    PenLine,
    Plus,
    Send,
    UserRound,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type RabStatus = "Draft" | "Review" | "Disetujui" | "Dikirim";

type RabTab = "Semua" | "Draft" | "Review" | "Disetujui" | "Dikirim";

type RabItem = {
    id: string;
    category: "Material" | "Jasa" | "Tambahan";
    name: string;
    qty: string;
    unit: string;
    price: string;
    subtotal: string;
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
    totalMaterial: string;
    totalLabor: string;
    totalAdditional: string;
    grandTotal: string;
    adminNote: string;
    customerNote: string;
    items: RabItem[];
};

const rabTabs: RabTab[] = ["Semua", "Draft", "Review", "Disetujui", "Dikirim"];

const initialRabs: RabData[] = [
    {
        id: "rab-1",
        projectTitle: "Kitchen Set Minimalis",
        customerName: "Alya Putri",
        projectType: "Kitchen Set",
        location: "Semarang",
        status: "Review",
        createdAt: "8 Juli 2026",
        updatedAt: "Hari ini",
        totalMaterial: "Rp14.500.000",
        totalLabor: "Rp6.500.000",
        totalAdditional: "Rp2.500.000",
        grandTotal: "Rp23.500.000",
        adminNote:
            "RAB masih perlu dicek ulang pada bagian top table dan aksesoris soft close.",
        customerNote:
            "Estimasi biaya dapat berubah setelah survey final dan pemilihan material.",
        items: [
            {
                id: "item-1",
                category: "Material",
                name: "Multiplek 18mm",
                qty: "6",
                unit: "lembar",
                price: "Rp850.000",
                subtotal: "Rp5.100.000",
            },
            {
                id: "item-2",
                category: "Material",
                name: "HPL motif kayu muda",
                qty: "8",
                unit: "lembar",
                price: "Rp420.000",
                subtotal: "Rp3.360.000",
            },
            {
                id: "item-3",
                category: "Jasa",
                name: "Produksi dan instalasi",
                qty: "1",
                unit: "paket",
                price: "Rp6.500.000",
                subtotal: "Rp6.500.000",
            },
            {
                id: "item-4",
                category: "Tambahan",
                name: "Aksesoris soft close",
                qty: "1",
                unit: "paket",
                price: "Rp2.500.000",
                subtotal: "Rp2.500.000",
            },
        ],
    },
    {
        id: "rab-2",
        projectTitle: "Wardrobe Kamar Utama",
        customerName: "Bima Santoso",
        projectType: "Wardrobe",
        location: "Yogyakarta",
        status: "Draft",
        createdAt: "9 Juli 2026",
        updatedAt: "Kemarin",
        totalMaterial: "Rp9.000.000",
        totalLabor: "Rp5.000.000",
        totalAdditional: "Rp2.000.000",
        grandTotal: "Rp16.000.000",
        adminNote:
            "Masih perlu menyesuaikan biaya tambahan untuk pintu sliding dan rel.",
        customerNote:
            "RAB belum final karena desain bagian dalam wardrobe masih direvisi.",
        items: [
            {
                id: "item-1",
                category: "Material",
                name: "Multiplek 15mm",
                qty: "5",
                unit: "lembar",
                price: "Rp760.000",
                subtotal: "Rp3.800.000",
            },
            {
                id: "item-2",
                category: "Material",
                name: "HPL natural",
                qty: "6",
                unit: "lembar",
                price: "Rp390.000",
                subtotal: "Rp2.340.000",
            },
            {
                id: "item-3",
                category: "Jasa",
                name: "Produksi wardrobe",
                qty: "1",
                unit: "paket",
                price: "Rp5.000.000",
                subtotal: "Rp5.000.000",
            },
        ],
    },
    {
        id: "rab-3",
        projectTitle: "Ruang Kerja Rumah",
        customerName: "Nadia Rahma",
        projectType: "Ruang Kerja",
        location: "Solo",
        status: "Disetujui",
        createdAt: "2 Juli 2026",
        updatedAt: "3 hari lalu",
        totalMaterial: "Rp6.000.000",
        totalLabor: "Rp3.500.000",
        totalAdditional: "Rp1.000.000",
        grandTotal: "Rp10.500.000",
        adminNote:
            "RAB sudah disetujui customer dan siap dibuatkan invoice pelunasan.",
        customerNote:
            "Estimasi sudah termasuk meja kerja, ambalan, dan storage kecil.",
        items: [
            {
                id: "item-1",
                category: "Material",
                name: "Multiplek",
                qty: "4",
                unit: "lembar",
                price: "Rp700.000",
                subtotal: "Rp2.800.000",
            },
            {
                id: "item-2",
                category: "Jasa",
                name: "Produksi meja dan rak",
                qty: "1",
                unit: "paket",
                price: "Rp3.500.000",
                subtotal: "Rp3.500.000",
            },
            {
                id: "item-3",
                category: "Tambahan",
                name: "Ambalan tambahan",
                qty: "1",
                unit: "paket",
                price: "Rp1.000.000",
                subtotal: "Rp1.000.000",
            },
        ],
    },
];

export function RabBuilderView({
    onChangePage,
}: {
    onChangePage?: (page: AdminPageId) => void;
}) {
    const [rabs, setRabs] = useState<RabData[]>(initialRabs);
    const [activeTab, setActiveTab] = useState<RabTab>("Semua");
    const [selectedRabId, setSelectedRabId] = useState(initialRabs[0]?.id ?? "");

    const selectedRab = useMemo(() => {
        return rabs.find((rab) => rab.id === selectedRabId) ?? rabs[0];
    }, [rabs, selectedRabId]);

    const filteredRabs = useMemo(() => {
        return rabs.filter((rab) => {
            if (activeTab === "Semua") return true;
            return rab.status === activeTab;
        });
    }, [activeTab, rabs]);

    const draftCount = rabs.filter((rab) => rab.status === "Draft").length;
    const reviewCount = rabs.filter((rab) => rab.status === "Review").length;
    const approvedCount = rabs.filter((rab) => rab.status === "Disetujui").length;

    const updateSelectedRab = (field: keyof RabData, value: string | RabStatus) => {
        if (!selectedRab) return;

        setRabs((current) =>
            current.map((rab) =>
                rab.id === selectedRab.id
                    ? {
                        ...rab,
                        [field]: value,
                        updatedAt: "Baru saja",
                    }
                    : rab,
            ),
        );
    };

    const updateStatus = (status: RabStatus) => {
        updateSelectedRab("status", status);
        setActiveTab(status);
    };

    const addMockItem = () => {
        if (!selectedRab) return;

        const newItem: RabItem = {
            id: `item-${Date.now()}`,
            category: "Tambahan",
            name: "Item biaya baru",
            qty: "1",
            unit: "paket",
            price: "Rp0",
            subtotal: "Rp0",
        };

        setRabs((current) =>
            current.map((rab) =>
                rab.id === selectedRab.id
                    ? {
                        ...rab,
                        updatedAt: "Baru saja",
                        items: [...rab.items, newItem],
                    }
                    : rab,
            ),
        );
    };

    if (!selectedRab) return null;

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
                        Keuangan & Perencanaan
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                        RAB Builder
                    </h1>

                    <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
                        Susun estimasi biaya proyek berdasarkan material, jasa pengerjaan,
                        dan biaya tambahan sebelum dibuatkan invoice customer.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onChangePage?.("payments")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                    Ke Invoice
                    <ArrowRight size={16} />
                </button>
            </section>

            <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                <RabMiniStat
                    icon={Calculator}
                    label="Total RAB"
                    value={`${rabs.length}`}
                    description="Estimasi proyek"
                />

                <RabMiniStat
                    icon={PenLine}
                    label="Draft"
                    value={`${draftCount}`}
                    description="Masih disusun"
                />

                <RabMiniStat
                    icon={ClipboardCheck}
                    label="Review"
                    value={`${reviewCount}`}
                    description="Perlu dicek admin"
                />

                <RabMiniStat
                    icon={CheckCircle2}
                    label="Disetujui"
                    value={`${approvedCount}`}
                    description="Siap dibuat invoice"
                />
            </section>

            <AdminSectionCard title="Daftar RAB">
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
                    <div className="grid grid-cols-5 gap-2">
                        {rabTabs.map((tab) => {
                            const active = activeTab === tab;

                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex h-11 items-center justify-center rounded-xl px-2 text-[10px] font-semibold transition sm:text-[13px] ${active
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

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredRabs.length > 0 ? (
                        filteredRabs.map((rab) => (
                            <RabCard
                                key={rab.id}
                                rab={rab}
                                selected={selectedRab.id === rab.id}
                                onClick={() => setSelectedRabId(rab.id)}
                            />
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
                            <p className="text-[13px] font-semibold text-[#31332C]">
                                Belum ada RAB pada kategori ini.
                            </p>

                            <p className="mt-1 text-[12px] text-[#7B756E]">
                                RAB proyek akan muncul sesuai statusnya.
                            </p>
                        </div>
                    )}
                </div>
            </AdminSectionCard>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <AdminSectionCard
                    title="Detail RAB"
                    action={<RabStatusBadge status={selectedRab.status} />}
                >
                    <div className="space-y-5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                Estimasi Biaya Proyek
                            </p>

                            <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                                {selectedRab.projectTitle}
                            </h2>

                            <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                                RAB untuk proyek {selectedRab.projectType} milik{" "}
                                <span className="font-semibold text-[#725F54]">
                                    {selectedRab.customerName}
                                </span>
                                .
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <AmountTile
                                label="Material"
                                value={selectedRab.totalMaterial}
                                description="Total bahan"
                            />

                            <AmountTile
                                label="Jasa"
                                value={selectedRab.totalLabor}
                                description="Biaya pengerjaan"
                            />

                            <AmountTile
                                label="Tambahan"
                                value={selectedRab.totalAdditional}
                                description="Aksesoris/opsional"
                            />

                            <AmountTile
                                label="Grand Total"
                                value={selectedRab.grandTotal}
                                description="Estimasi akhir"
                                highlight
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <InfoTile
                                icon={UserRound}
                                label="Customer"
                                value={selectedRab.customerName}
                                description="Pemilik proyek"
                            />

                            <InfoTile
                                icon={Hammer}
                                label="Jenis"
                                value={selectedRab.projectType}
                                description="Kategori proyek"
                            />

                            <InfoTile
                                icon={CalendarDays}
                                label="Update"
                                value={selectedRab.updatedAt}
                                description={selectedRab.createdAt}
                            />

                            <InfoTile
                                icon={Wallet}
                                label="Lokasi"
                                value={selectedRab.location}
                                description="Area proyek"
                            />
                        </div>

                        <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Rincian Biaya
                                    </p>

                                    <p className="mt-1 text-[12px] text-[#7B756E]">
                                        Daftar item biaya material, jasa, dan tambahan.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addMockItem}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                                >
                                    <Plus size={15} />
                                    Tambah Item
                                </button>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white">
                                <div className="hidden grid-cols-[1fr_90px_90px_120px] gap-3 border-b border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#725F54] md:grid">
                                    <span>Item</span>
                                    <span>Qty</span>
                                    <span>Harga</span>
                                    <span className="text-right">Subtotal</span>
                                </div>

                                <div className="divide-y divide-[#E8E2D9]">
                                    {selectedRab.items.map((item) => (
                                        <RabItemRow key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                    Catatan Admin
                                </span>

                                <textarea
                                    value={selectedRab.adminNote}
                                    onChange={(event) =>
                                        updateSelectedRab("adminNote", event.target.value)
                                    }
                                    rows={4}
                                    className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                />
                            </label>

                            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                    Catatan Customer
                                </span>

                                <textarea
                                    value={selectedRab.customerNote}
                                    onChange={(event) =>
                                        updateSelectedRab("customerNote", event.target.value)
                                    }
                                    rows={4}
                                    className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                                />
                            </label>
                        </div>
                    </div>
                </AdminSectionCard>

                <div className="space-y-5">
                    <AdminSectionCard title="Aksi RAB">
                        <div className="space-y-3">
                            <ActionButton
                                icon={ClipboardCheck}
                                title="Tandai Review"
                                description="RAB perlu dicek sebelum dikirim."
                                onClick={() => updateStatus("Review")}
                            />

                            <ActionButton
                                icon={CheckCircle2}
                                title="Setujui RAB"
                                description="RAB siap digunakan untuk invoice."
                                onClick={() => updateStatus("Disetujui")}
                            />

                            <ActionButton
                                icon={Send}
                                title="Kirim ke Customer"
                                description="Tandai RAB sudah dikirim."
                                onClick={() => updateStatus("Dikirim")}
                            />
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard title="Ubah Status">
                        <div className="grid gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => updateStatus(status)}
                                    className={`flex h-10 items-center justify-between rounded-xl border px-3 text-left text-[12px] font-semibold transition ${selectedRab.status === status
                                            ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                                            : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                                        }`}
                                >
                                    <span>{status}</span>

                                    {selectedRab.status === status && <CheckCircle2 size={15} />}
                                </button>
                            ))}
                        </div>
                    </AdminSectionCard>

                    <AdminSectionCard title="Navigasi Cepat">
                        <div className="grid gap-2">
                            <button
                                type="button"
                                onClick={() => onChangePage?.("payments")}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                            >
                                Ke Invoice
                                <ArrowRight size={14} />
                            </button>

                            <button
                                type="button"
                                onClick={() => onChangePage?.("payments")}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                            >
                                Buat Invoice
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </AdminSectionCard>
                </div>
            </section>
        </div>
    );
}

const statusOptions: RabStatus[] = ["Draft", "Review", "Disetujui", "Dikirim"];

function RabCard({
    rab,
    selected,
    onClick,
}: {
    rab: RabData;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-w-0 rounded-2xl border p-4 text-left transition ${selected
                    ? "border-[#D9C8BA] bg-[#FFFDF9]"
                    : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#31332C]">
                        {rab.projectTitle}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#7B756E]">
                        {rab.customerName} • {rab.location}
                    </p>
                </div>

                <RabStatusBadge status={rab.status} />
            </div>

            <div className="mt-4">
                <p className="text-[11px] font-medium text-[#7B756E]">Grand Total</p>

                <p className="mt-1 text-[18px] font-semibold text-[#31332C]">
                    {rab.grandTotal}
                </p>
            </div>

            <p className="mt-3 text-[11px] text-[#9A8F86]">
                Update: {rab.updatedAt}
            </p>
        </button>
    );
}

function RabItemRow({ item }: { item: RabItem }) {
    return (
        <div className="grid gap-2 px-4 py-3 md:grid-cols-[1fr_90px_90px_120px] md:items-center md:gap-3">
            <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#31332C]">
                    {item.name}
                </p>

                <p className="mt-1 text-[11px] text-[#7B756E]">{item.category}</p>
            </div>

            <p className="text-[12px] text-[#7B756E]">
                {item.qty} {item.unit}
            </p>

            <p className="text-[12px] text-[#7B756E]">{item.price}</p>

            <p className="text-[13px] font-semibold text-[#725F54] md:text-right">
                {item.subtotal}
            </p>
        </div>
    );
}

function RabMiniStat({
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
        <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
            <div className="flex items-start justify-between gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
                    <Icon size={17} strokeWidth={2} />
                </div>

                <p className="min-w-0 truncate text-right font-serif text-[25px] leading-none text-[#31332C]">
                    {value}
                </p>
            </div>

            <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
                {description}
            </p>
        </div>
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
            className={`rounded-2xl border p-4 ${highlight
                    ? "border-[#D9C8BA] bg-[#FFFDF9]"
                    : "border-[#E8E2D9] bg-[#FCFBF9]"
                }`}
        >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                {label}
            </p>

            <p className="mt-2 font-serif text-[25px] leading-none text-[#31332C]">
                {value}
            </p>

            <p className="mt-2 text-[11px] text-[#7B756E]">{description}</p>
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
            className="flex w-full items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
        >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                <Icon size={16} />
            </div>

            <div>
                <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                    {description}
                </p>
            </div>
        </button>
    );
}

function RabStatusBadge({ status }: { status: RabStatus }) {
    const style =
        status === "Disetujui"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : status === "Review"
                ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
                : status === "Dikirim"
                    ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                    : "border-[#E8E2D9] bg-white text-[#7B756E]";

    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
        >
            {status}
        </span>
    );
}