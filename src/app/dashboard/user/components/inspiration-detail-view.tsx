"use client";

import Image from "next/image";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    MapPin,
    Package,
    Ruler,
    Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

type CustomerPageTarget = "ajukan" | "ai-ide" | "konsultasi" | "catalog";

type MaterialPackage = {
    name: "Basic" | "Standard" | "Premium";
    description: string;
};

type RelatedInspiration = {
    id: string;
    title: string;
    style: string;
    budgetRange: string;
    image: string;
};

type VendorPortfolioProfile = {
    vendorName: string;
    studioName: string;
    location: string;
    specialty: string;
    experience: string;
    completedProjects: string;
    description: string;
};

type InspirationDetail = {
    id: string;
    title: string;
    category: string;
    packageLevel: string;
    style: string;
    budgetRange: string;
    idealSize: string;
    projectLocation: string;
    projectTimeline: string;
    vendorProfile: VendorPortfolioProfile;
    spaceType: string;
    suitableFor: string[];
    materials: string[];
    shortDescription: string;
    fullDescription: string;
    designElements: string[];
    materialPackages: MaterialPackage[];
    timeline: string[];
    notes: string;
    images: string[];
    beforeAfter?: {
        before: string;
        after: string;
    };
    related: RelatedInspiration[];
};

type SelectedInspirationPayload = {
    id: string;
    title: string;
    category: string;
    style: string;
    budgetRange: string;
    packageLevel: string;
    materials: string[];
    suitableFor: string[];
    mainImage: string;
    notes: string;
};

const STORAGE_KEY = "vmatch_selected_inspiration";
const REQUEST_PAGE_TARGET: CustomerPageTarget = "ajukan";

const inspirationDetail: InspirationDetail = {
    id: "kitchen-set-modern-1",
    title: "Kitchen Set Modern Minimalis",
    category: "Kitchen Set",
    packageLevel: "Standard / Premium",
    style: "Modern minimalis",
    budgetRange: "Rp43.500.000",
    idealSize: "2.5m x 2m",
    projectLocation: "Semarang",
    projectTimeline: "05 Mei 2024 - 08 Agustus 2024 (3 bulan)",
    vendorProfile: {
        vendorName: "Kayu Rapi Interior",
        studioName: "Vendor Partner VMatch",
        location: "Semarang",
        specialty: "Kitchen set, storage, dan custom cabinet",
        experience: "5 tahun pengalaman",
        completedProjects: "38 proyek selesai",
        description: "Vendor Partner VMatch",
    },
    spaceType: "Rumah / Apartemen",
    suitableFor: ["Dapur rumah", "Apartemen", "Ruang dapur compact"],
    materials: ["HPL", "Multiplek", "Solid surface"],
    shortDescription:
        "Referensi desain dari portofolio vendor partner VMatch dengan konsep dapur modern, fungsional, bersih, dan elegan.",
    fullDescription:
        "Kitchen set ini merupakan referensi portofolio dari vendor partner VMatch. Konsepnya mengutamakan tampilan modern minimalis dengan warna netral dan aksen kayu hangat. Referensi ini cocok untuk kebutuhan dapur yang bersih, fungsional, mudah dirawat, dan tetap terlihat elegan.",
    designElements: [
        "Kabinet atas dan bawah",
        "Area penyimpanan tertutup",
        "Top table solid surface",
        "Backsplash motif marble",
        "Warna netral dan aksen kayu",
        "Layout dapur efisien",
    ],
    materialPackages: [
        {
            name: "Basic",
            description: "MDF Board dengan finishing melamine ekonomis.",
        },
        {
            name: "Standard",
            description: "Multiplek 15mm dengan finishing HPL standar.",
        },
        {
            name: "Premium",
            description:
                "Multiplek 18mm dengan finishing HPL atau melamine premium dan hardware soft close.",
        },
    ],
    timeline: [
        "Konsultasi & validasi kebutuhan",
        "Survey ukuran",
        "Finalisasi desain dan RAB",
        "Produksi",
        "Instalasi",
        "QC dan handover",
    ],
    notes:
        "Inspirasi ini digunakan sebagai referensi awal. Tim VMatch akan membantu menyesuaikan solusi berdasarkan ukuran ruang, kebutuhan penyimpanan, budget, material, dan kondisi ruangan customer.",
    images: [
        "/figma/benefits-kitchen.webp",
        "/figma/project-library.webp",
        "/figma/benefits-storage.webp",
        "/figma/benefits-living.webp",
        "/figma/benefits-wardrobe.webp",
        "/figma/benefits-bedroom.webp",
    ],
    beforeAfter: {
        before: "/figma/project-library.webp",
        after: "/figma/benefits-kitchen.webp",
    },
    related: [
        {
            id: "storage-rak-modern",
            title: "Storage Compact Modern",
            style: "Modern minimalis",
            budgetRange: "Rp15–35 juta",
            image: "/figma/benefits-storage.webp",
        },
        {
            id: "wardrobe-warm-modern",
            title: "Wardrobe Warm Modern",
            style: "Warm modern",
            budgetRange: "Rp18–60 juta",
            image: "/figma/benefits-wardrobe.webp",
        },
        {
            id: "living-room-japandi",
            title: "Ruang Tamu Japandi",
            style: "Japandi",
            budgetRange: "Rp20–80 juta",
            image: "/figma/benefits-living.webp",
        },
    ],
};

export default function InspirationDetailPage() {
    return <InspirationDetailView />;
}

export function InspirationDetailView({
    inspiration = inspirationDetail,
    onBack,
    onChangePage,
    onOpenRelated,
}: {
    inspiration?: InspirationDetail;
    onBack?: () => void;
    onChangePage?: (page: CustomerPageTarget) => void;
    onOpenRelated?: (id: string) => void;
}) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const images = inspiration.images.length > 0 ? inspiration.images : [""];
    const activeImage = images[activeImageIndex] ?? images[0] ?? "";

    const selectedPayload = useMemo<SelectedInspirationPayload>(
        () => ({
            id: inspiration.id,
            title: inspiration.title,
            category: inspiration.category,
            style: inspiration.style,
            budgetRange: inspiration.budgetRange,
            packageLevel: inspiration.packageLevel,
            materials: inspiration.materials,
            suitableFor: inspiration.suitableFor,
            mainImage: activeImage,
            notes: inspiration.notes,
        }),
        [activeImage, inspiration],
    );

    const saveSelectedInspiration = () => {
        if (typeof window === "undefined") return;

        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPayload));
        setIsSaved(true);
    };

    const goToRequest = () => {
        saveSelectedInspiration();

        if (onChangePage) {
            onChangePage(REQUEST_PAGE_TARGET);
            return;
        }

        if (typeof window !== "undefined") {
            window.location.href = "/dashboard/user";
        }
    };

    const goToConsultation = () => {
        saveSelectedInspiration();

        if (onChangePage) {
            onChangePage("konsultasi");
            return;
        }

        if (typeof window !== "undefined") {
            window.location.href = "/dashboard/user";
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
            return;
        }

        if (onChangePage) {
            onChangePage("catalog");
            return;
        }

        if (typeof window !== "undefined") {
            window.history.back();
        }
    };

    const goToPreviousImage = () => {
        setActiveImageIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    };

    const goToNextImage = () => {
        setActiveImageIndex((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    };

    return (
        <div className="w-full space-y-6 text-[#31332C]">
            <section className="space-y-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#F8F6F2]"
                >
                    <ArrowLeft size={15} />
                    Kembali ke Inspirasi Desain
                </button>

                <div className="max-w-[920px]">
                    <p className="text-[12px] leading-5 text-[#7B756E]">
                        Inspirasi Desain / {inspiration.category}
                    </p>

                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                        DETAIL INSPIRASI
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[46px]">
                        {inspiration.title}
                    </h1>

                    <p className="mt-3 max-w-[760px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
                        {inspiration.shortDescription}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge label={inspiration.category} />
                        <Badge label={inspiration.packageLevel} />
                    </div>
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_380px]">
                <InspirationImageGallery
                    title={inspiration.title}
                    images={images}
                    activeIndex={activeImageIndex}
                    onPrevious={goToPreviousImage}
                    onNext={goToNextImage}
                    onSelect={setActiveImageIndex}
                />

                <InspirationSummaryCard
                    inspiration={inspiration}
                    isSaved={isSaved}
                    onUsePreference={goToRequest}
                    onRequestProject={goToRequest}
                    onConsult={goToConsultation}
                    onSave={saveSelectedInspiration}
                />
            </section>

            <InspirationInfoGrid inspiration={inspiration} />

            <VendorPortfolioSection profile={inspiration.vendorProfile} />

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <SectionCard title="Deskripsi Inspirasi">
                    <p className="text-[13px] leading-7 text-[#6F6860] sm:text-[14px]">
                        {inspiration.fullDescription}
                    </p>
                </SectionCard>

                <SectionCard title="Elemen Desain">
                    <div className="grid gap-2.5">
                        {inspiration.designElements.map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3"
                            >
                                <CheckCircle2
                                    size={16}
                                    className="mt-0.5 shrink-0 text-[#725F54]"
                                />

                                <p className="text-[13px] leading-5 text-[#31332C]">{item}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </section>

            <MaterialPackageSection packages={inspiration.materialPackages} />

            <GalleryGridSection
                title={inspiration.title}
                images={images}
                activeIndex={activeImageIndex}
                onSelect={setActiveImageIndex}
            />

            {inspiration.beforeAfter && (
                <BeforeAfterSection
                    title={inspiration.title}
                    before={inspiration.beforeAfter.before}
                    after={inspiration.beforeAfter.after}
                />
            )}

            <section className="space-y-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                        Inspirasi Serupa
                    </p>

                    <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[34px]">
                        Referensi lain yang mungkin cocok
                    </h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {inspiration.related.map((item) => (
                        <RelatedInspirationCard
                            key={item.id}
                            item={item}
                            onClick={() => onOpenRelated?.(item.id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function InspirationImageGallery({
    title,
    images,
    activeIndex,
    onPrevious,
    onNext,
    onSelect,
}: {
    title: string;
    images: string[];
    activeIndex: number;
    onPrevious: () => void;
    onNext: () => void;
    onSelect: (index: number) => void;
}) {
    const activeImage = images[activeIndex] ?? "";

    return (
        <section className="overflow-hidden rounded-1xl bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
            <div className="relative h-[280px] bg-[#EFE8DF] sm:h-[360px] lg:h-[500px]">
                <ImageWithFallback
                    src={activeImage}
                    alt={title}
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 70vw"
                    priority
                />

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={onPrevious}
                            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#725F54] shadow-sm transition hover:bg-white"
                            aria-label="Gambar sebelumnya"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#725F54] shadow-sm transition hover:bg-white"
                            aria-label="Gambar berikutnya"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </div>

            <div className="bg-[#FCFBF9] p-3 sm:p-4">
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((image, index) => {
                        const active = index === activeIndex;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => onSelect(index)}
                                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-1xl transition sm:h-20 sm:w-28 ${active ? "ring-2 ring-[#725F54]/25" : "opacity-80 hover:opacity-100"}`}
                                aria-label={`Pilih gambar ${index + 1}`}
                            >
                                <ImageWithFallback
                                    src={image}
                                    alt={`${title} ${index + 1}`}
                                    className="object-cover"
                                    sizes="120px"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function InspirationSummaryCard({
    inspiration,
    onUsePreference,
    onRequestProject,
    onConsult,
}: {
    inspiration: InspirationDetail;
    isSaved: boolean;
    onUsePreference: () => void;
    onRequestProject: () => void;
    onConsult: () => void;
    onSave: () => void;
}) {
    return (
        <aside className="h-fit rounded-1xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Ringkasan Inspirasi
            </p>

            <div className="mt-4 space-y-3">
                <SummaryRow label="Style" value={inspiration.style} />
                <SummaryRow label="Kategori" value={inspiration.category} />
                <SummaryRow label="Material" value={inspiration.materials.join(", ")} />
            </div>

            <div className="mt-5 grid gap-2">
                <button
                    type="button"
                    onClick={onUsePreference}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    Gunakan sebagai Preferensi
                    <ArrowRight size={15} />
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onRequestProject}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                    >
                        Ajukan Proyek
                    </button>

                    <button
                        type="button"
                        onClick={onConsult}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                    >
                        Konsultasi
                    </button>
                </div>
            </div>
        </aside>
    );
}

function InspirationInfoGrid({
    inspiration,
}: {
    inspiration: InspirationDetail;
}) {
    return (
        <section className="border-y border-[#E8E2D9] py-5">
            <div className="grid gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
                <InlineInfoItem
                    icon={MapPin}
                    label="Lokasi Proyek"
                    value={inspiration.projectLocation}
                />

                <InlineInfoItem
                    icon={Ruler}
                    label="Ukuran Ruang"
                    value={inspiration.idealSize}
                />

                <InlineInfoItem
                    icon={CalendarDays}
                    label="Timeline Proyek"
                    value={inspiration.projectTimeline}
                    className="lg:col-span-1"
                />

                <InlineInfoItem
                    icon={Wallet}
                    label="Nilai Proyek"
                    value={inspiration.budgetRange}
                />

                <InlineInfoItem
                    icon={Package}
                    label="Paket Material"
                    value={inspiration.packageLevel}
                />
            </div>
        </section>
    );
}

function InlineInfoItem({
    icon: Icon,
    label,
    value,
    className = "",
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div
            className={`flex items-start gap-3 px-0 sm:px-4 sm:first:pl-0 lg:border-l lg:border-[#E8E2D9] lg:first:border-l-0 ${className}`}
        >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F3EE] text-[#725F54]">
                <Icon size={16} />
            </div>

            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C8178]">
                    {label}
                </p>
                <p className="mt-1 text-[14px] font-semibold leading-snug text-[#31332C]">
                    {value}
                </p>
            </div>
        </div>
    );
}

function VendorPortfolioSection({
    profile,
}: {
    profile: VendorPortfolioProfile;
}) {
    return (
        <section className="rounded-1xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
            <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[#E4D8CD] bg-[#FCFBF9] text-[18px] font-semibold text-[#725F54]">
                    KR
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[20px] font-semibold text-[#31332C]">
                        {profile.vendorName}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Vendor Partner VMatch
                    </p>
                </div>
            </div>
        </section>
    );
}

function MaterialPackageSection({
    packages,
}: {
    packages: MaterialPackage[];
}) {
    return (
        <section className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Referensi Material
            </p>

            <div className="grid gap-3 md:grid-cols-3">
                {packages.map((item) => (
                    <div
                        key={item.name}
                        className={`rounded-1xl p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition ${item.name === "Standard"
                            ? "bg-[#725F54] text-white"
                            : "bg-white text-[#31332C] hover:bg-[#FCFBF9]"
                            }`}
                    >
                        <p
                            className={`font-serif text-[26px] leading-tight ${item.name === "Standard" ? "text-white" : "text-[#31332C]"
                                }`}
                        >
                            {item.name}
                        </p>

                        <p
                            className={`mt-2 text-[12px] leading-6 ${item.name === "Standard" ? "text-white/78" : "text-[#7B756E]"
                                }`}
                        >
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function GalleryGridSection({
    title,
    images,
    activeIndex,
    onSelect,
}: {
    title: string;
    images: string[];
    activeIndex: number;
    onSelect: (index: number) => void;
}) {
    return (
        <section className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Gallery Desain
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {images.map((image, index) => (
                    <button
                        key={`${image}-grid-${index}`}
                        type="button"
                        onClick={() => onSelect(index)}
                        className={`relative aspect-[4/3] overflow-hidden rounded-1xl transition ${activeIndex === index
                            ? "ring-2 ring-[#725F54]/25"
                            : "opacity-95 hover:opacity-100"
                            }`}
                    >
                        <ImageWithFallback
                            src={image}
                            alt={`${title} gallery ${index + 1}`}
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}

function BeforeAfterSection({
    title,
    before,
    after,
}: {
    title: string;
    before: string;
    after: string;
}) {
    return (
        <section className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Sebelum dan Sesudah
            </p>

            <div className="grid gap-3 md:grid-cols-2">
                <BeforeAfterImage label="Sebelum" title={title} src={before} />
                <BeforeAfterImage label="Sesudah" title={title} src={after} />
            </div>
        </section>
    );
}

function BeforeAfterImage({
    label,
    title,
    src,
}: {
    label: string;
    title: string;
    src: string;
}) {
    return (
        <div className="relative h-[240px] overflow-hidden rounded-1xl bg-[#EFE8DF] shadow-[0_8px_24px_rgba(49,51,44,0.025)] sm:h-[300px]">
            <ImageWithFallback
                src={src}
                alt={`${label} ${title}`}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#725F54] shadow-sm">
                {label}
            </div>
        </div>
    );
}

function RelatedInspirationCard({
    item,
    onClick,
}: {
    item: RelatedInspiration;
    onClick: () => void;
}) {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
            <div className="relative aspect-[4/3] bg-[#EFE8DF]">
                <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            <div className="p-4">
                <h3 className="truncate text-[14px] font-semibold text-[#31332C]">
                    {item.title}
                </h3>

                <p className="mt-1 text-[12px] text-[#7B756E]">{item.style}</p>

                <p className="mt-2 text-[12px] font-semibold text-[#725F54]">
                    Nilai referensi {item.budgetRange}
                </p>

                <button
                    type="button"
                    onClick={onClick}
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                >
                    Lihat Detail
                    <ChevronRight size={14} />
                </button>
            </div>
        </article>
    );
}

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-1xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                {title}
            </p>

            <div className="mt-4">{children}</div>
        </section>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#E8E2D9] pb-3 last:border-b-0 last:pb-0">
            <span className="text-[12px] text-[#7B756E]">{label}</span>

            <span className="max-w-[210px] text-right text-[12px] font-semibold leading-5 text-[#31332C]">
                {value}
            </span>
        </div>
    );
}

function Badge({ label }: { label: string }) {
    return (
        <span className="inline-flex h-8 items-center rounded-full border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] shadow-sm">
            {label}
        </span>
    );
}

function ImageWithFallback({
    src,
    alt,
    className,
    sizes,
    priority,
}: {
    src: string;
    alt: string;
    className?: string;
    sizes: string;
    priority?: boolean;
}) {
    const [hasError, setHasError] = useState(!src);

    return (
        <>
            {hasError ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#EFE8DF] px-4 text-center text-[#725F54]">
                    <ImageIcon size={28} />

                    <p className="text-[12px] font-semibold">Referensi visual</p>

                    <p className="text-[11px] text-[#7B756E]">
                        Gambar belum tersedia
                    </p>
                </div>
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes={sizes}
                    onError={() => setHasError(true)}
                    className={className}
                />
            )}
        </>
    );
}
