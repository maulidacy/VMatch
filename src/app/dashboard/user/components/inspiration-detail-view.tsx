"use client";

import Image from "next/image";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Home,
    ImageIcon,
    Package,
    Paintbrush,
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

type InspirationDetail = {
    id: string;
    title: string;
    category: string;
    packageLevel: string;
    style: string;
    budgetRange: string;
    idealSize: string;
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
    budgetRange: "Rp25–70 juta",
    idealSize: "2m–4m area dapur",
    spaceType: "Rumah / Apartemen",
    suitableFor: ["Dapur rumah", "Apartemen", "Ruang dapur compact"],
    materials: ["HPL", "Multiplek", "Solid surface"],
    shortDescription:
        "Konsep dapur fungsional, bersih, dan elegan sebagai referensi awal sebelum divalidasi oleh tim VMatch.",
    fullDescription:
        "Kitchen set ini mengutamakan tampilan modern minimalis dengan kombinasi warna netral dan aksen kayu hangat. Konsep ini cocok untuk customer yang membutuhkan dapur bersih, fungsional, mudah dirawat, dan tetap terlihat elegan. Inspirasi ini akan divalidasi kembali oleh tim VMatch berdasarkan ukuran ruang, budget, material, serta kebutuhan penyimpanan customer.",
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
                        <Badge label="Referensi Awal" />
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

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <SectionCard title="Mengenai Inspirasi Ini">
                    <p className="text-[13px] leading-7 text-[#6F6860] sm:text-[14px]">
                        {inspiration.fullDescription}
                    </p>

                    <div className="mt-5 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Validasi VMatch
                        </p>

                        <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                            Desain akhir akan disesuaikan kembali berdasarkan hasil konsultasi,
                            ukuran ruang, kondisi area, budget, material, dan estimasi vendor.
                        </p>
                    </div>
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

            <TimelineSection timeline={inspiration.timeline} />

            <section className="rounded-3xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-[760px]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                            Catatan VMatch
                        </p>

                        <p className="mt-2 text-[13px] leading-7 text-[#6F6860] sm:text-[14px]">
                            {inspiration.notes}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={goToRequest}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                        Gunakan sebagai Preferensi
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>

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
        <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
            <div className="relative h-[280px] bg-[#EFE8DF] sm:h-[360px] lg:h-[500px]">
                <ImageWithFallback
                    src={activeImage}
                    alt={title}
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 70vw"
                    priority
                />

                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#725F54] shadow-sm">
                    {activeIndex + 1} / {images.length}
                </div>

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

            <div className="border-t border-[#E8E2D9] bg-[#FCFBF9] p-3 sm:p-4">
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((image, index) => {
                        const active = index === activeIndex;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => onSelect(index)}
                                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-28 ${active ? "border-[#725F54] ring-2 ring-[#725F54]/15" : "border-[#E8E2D9]"
                                    }`}
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
    isSaved,
    onUsePreference,
    onRequestProject,
    onConsult,
    onSave,
}: {
    inspiration: InspirationDetail;
    isSaved: boolean;
    onUsePreference: () => void;
    onRequestProject: () => void;
    onConsult: () => void;
    onSave: () => void;
}) {
    return (
        <aside className="h-fit rounded-3xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Ringkasan Inspirasi
            </p>

            <div className="mt-4 space-y-3">
                <SummaryRow label="Estimasi awal" value={inspiration.budgetRange} />
                <SummaryRow label="Style" value={inspiration.style} />
                <SummaryRow label="Kategori" value={inspiration.category} />
                <SummaryRow label="Cocok untuk" value={inspiration.suitableFor.join(", ")} />
                <SummaryRow label="Paket material" value={inspiration.packageLevel} />
                <SummaryRow label="Material umum" value={inspiration.materials.join(", ")} />
            </div>

            <div className="mt-5 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[12px] leading-6 text-[#7B756E]">
                    Estimasi dapat berubah sesuai ukuran, material, kondisi ruangan, dan
                    hasil validasi VMatch.
                </p>
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

                <button
                    type="button"
                    onClick={onSave}
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-[12px] font-semibold transition ${isSaved
                            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
                            : "border-[#E4D8CD] bg-white text-[#725F54] hover:bg-[#FCFBF9]"
                        }`}
                >
                    <Bookmark size={14} />
                    {isSaved ? "Inspirasi Tersimpan" : "Simpan Inspirasi"}
                </button>
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
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoTile
                icon={Paintbrush}
                label="Style Desain"
                value={inspiration.style}
                description="Arah visual utama"
            />

            <InfoTile
                icon={Ruler}
                label="Ukuran Ideal"
                value={inspiration.idealSize}
                description="Estimasi luas ruang"
            />

            <InfoTile
                icon={Home}
                label="Jenis Ruang"
                value={inspiration.spaceType}
                description="Tipe hunian"
            />

            <InfoTile
                icon={ClipboardList}
                label="Kategori Proyek"
                value={inspiration.category}
                description="Jenis pengerjaan"
            />

            <InfoTile
                icon={Wallet}
                label="Estimasi Budget"
                value={inspiration.budgetRange}
                description="Estimasi awal"
            />

            <InfoTile
                icon={Package}
                label="Paket Material"
                value={inspiration.packageLevel}
                description="Referensi kualitas"
            />
        </section>
    );
}

function MaterialPackageSection({
    packages,
}: {
    packages: MaterialPackage[];
}) {
    return (
        <SectionCard title="Rekomendasi Material">
            <p className="mb-4 max-w-[820px] text-[13px] leading-7 text-[#7B756E]">
                Material final tetap mengikuti review admin, estimasi vendor, budget
                customer, kondisi ruangan, dan persetujuan customer.
            </p>

            <div className="grid gap-3 md:grid-cols-3">
                {packages.map((item) => (
                    <div
                        key={item.name}
                        className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:border-[#725F54] hover:bg-white"
                    >
                        <p className="font-serif text-[26px] leading-tight text-[#31332C]">
                            {item.name}
                        </p>

                        <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </SectionCard>
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
        <SectionCard title="Gallery Desain">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {images.map((image, index) => (
                    <button
                        key={`${image}-grid-${index}`}
                        type="button"
                        onClick={() => onSelect(index)}
                        className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition ${activeIndex === index
                                ? "border-[#725F54] ring-2 ring-[#725F54]/15"
                                : "border-[#E8E2D9]"
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
        </SectionCard>
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
        <SectionCard title="Sebelum dan Sesudah">
            <div className="grid gap-3 md:grid-cols-2">
                <BeforeAfterImage label="Sebelum" title={title} src={before} />
                <BeforeAfterImage label="Sesudah" title={title} src={after} />
            </div>
        </SectionCard>
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
        <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9]">
            <div className="relative h-[240px] sm:h-[300px]">
                <ImageWithFallback
                    src={src}
                    alt={`${label} ${title}`}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className="border-t border-[#E8E2D9] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold text-[#725F54]">{label}</p>
            </div>
        </div>
    );
}

function TimelineSection({ timeline }: { timeline: string[] }) {
    return (
        <SectionCard title="Estimasi Timeline">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {timeline.map((item, index) => (
                    <div
                        key={item}
                        className="flex gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[12px] font-semibold text-[#725F54] ring-1 ring-[#E8E2D9]">
                            {index + 1}
                        </div>

                        <div>
                            <p className="text-[13px] font-semibold text-[#31332C]">{item}</p>

                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                Tahap akan disesuaikan setelah kebutuhan, ukuran, dan RAB final
                                disetujui.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-[12px] leading-6 text-[#7B756E]">
                Timeline aktual akan disesuaikan setelah kebutuhan, ukuran, dan RAB final
                disetujui.
            </p>
        </SectionCard>
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
                    Estimasi awal {item.budgetRange}
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
        <section className="rounded-3xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                {title}
            </p>

            <div className="mt-4">{children}</div>
        </section>
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
        <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
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
