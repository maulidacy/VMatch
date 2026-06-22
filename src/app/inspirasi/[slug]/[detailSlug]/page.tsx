"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useState } from "react";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";
import { inspirations } from "@/lib/home-content";

function createSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

type ImageSource = string | StaticImageData;

type MaterialPackage = {
    name: "Basic" | "Standard" | "Premium";
    description: string;
};

type RelatedInspiration = {
    id: string;
    title: string;
    style: string;
    budgetRange: string;
    image: ImageSource;
    href: string;
};

type VendorPortfolioProfile = {
    vendorName: string;
    studioName: string;
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
    images: ImageSource[];
    beforeAfter?: {
        before: ImageSource;
        after: ImageSource;
    };
    related: RelatedInspiration[];
};

const galleryItems = inspirations.flatMap((item, index) => [
    {
        ...item,
        id: `${createSlug(item.title)}-${index}-main`,
        title: item.title,
        style: index % 2 === 0 ? "Modern" : "Minimalis",
        property: index % 3 === 0 ? "Apartemen" : "Rumah",
    },
    {
        ...item,
        id: `${createSlug(item.title)}-${index}-alt`,
        title: `${item.title} ${index + 1}`,
        style: index % 2 === 0 ? "Minimalis" : "Modern",
        property: index % 2 === 0 ? "Rumah" : "Apartemen",
    },
]);

function getBudgetRange(category: string) {
    if (category.includes("Kitchen")) return "Rp43.500.000";
    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return "Rp38.000.000";
    }
    if (category.includes("Storage")) return "Rp28.500.000";
    if (category.includes("Tamu")) return "Rp55.000.000";
    if (category.includes("Tidur")) return "Rp35.000.000";
    return "Rp32.000.000";
}

function getIdealSize(category: string) {
    if (category.includes("Kitchen")) return "2.5m x 2m";
    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return "3m x 2.4m";
    }
    if (category.includes("Storage")) return "2m x 2m";
    if (category.includes("Tamu")) return "4m x 5m";
    if (category.includes("Tidur")) return "3m x 4m";
    return "3m x 3m";
}

function getProjectTimeline(category: string) {
    if (category.includes("Kitchen")) {
        return "05 Mei 2024 - 08 Agustus 2024 (3 bulan)";
    }

    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return "12 Mei 2024 - 21 Juli 2024 (2 bulan)";
    }

    return "10 Mei 2024 - 28 Juli 2024 (2,5 bulan)";
}

function getVendorName(category: string) {
    if (category.includes("Kitchen")) return "Dapur Rapi Studio";
    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return "Kayu Rapi Interior";
    }
    if (category.includes("Storage")) return "Ruang Simpan Studio";
    if (category.includes("Tamu")) return "Nusa Living Interior";
    return "Vendor Partner VMatch";
}

function getMaterials(category: string) {
    if (category.includes("Kitchen")) return ["HPL", "Multiplek", "Solid surface"];
    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return ["HPL", "Multiplek", "Kaca / cermin"];
    }
    if (category.includes("Storage")) return ["HPL", "Multiplek", "MDF"];
    if (category.includes("Tamu")) return ["Panel dinding", "Rak TV", "Lighting"];
    return ["HPL", "Panel dinding", "Lighting"];
}

function getSuitableFor(category: string) {
    if (category.includes("Kitchen")) return ["Dapur rumah", "Apartemen"];
    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return ["Kamar utama", "Kamar anak"];
    }
    if (category.includes("Storage")) return ["Kamar", "Ruang keluarga", "Apartemen"];
    if (category.includes("Tamu")) return ["Rumah tinggal", "Apartemen"];
    return ["Rumah", "Apartemen"];
}

function getDesignElements(category: string) {
    if (category.includes("Kitchen")) {
        return [
            "Kabinet atas dan bawah",
            "Area penyimpanan tertutup",
            "Top table solid surface",
            "Backsplash motif marble",
            "Warna netral dan aksen kayu",
            "Layout dapur efisien",
        ];
    }

    if (category.includes("Wardrobe") || category.includes("Lemari")) {
        return [
            "Area gantung pakaian",
            "Rak lipat dan laci penyimpanan",
            "Pintu wardrobe rapi",
            "Kombinasi panel kayu dan warna netral",
            "Pembagian storage sesuai kebutuhan",
            "Tampilan clean dan hemat ruang",
        ];
    }

    if (category.includes("Storage")) {
        return [
            "Storage tertutup",
            "Rak display",
            "Layout compact",
            "Aksen kayu hangat",
            "Area penyimpanan multifungsi",
            "Tampilan rapi dan ringan",
        ];
    }

    return [
        "Komposisi ruang rapi",
        "Warna netral",
        "Material mudah dirawat",
        "Pencahayaan nyaman",
        "Fungsi penyimpanan jelas",
        "Tampilan modern",
    ];
}

function buildInspirationDetail({
    activeItem,
    activeCategory,
    references,
}: {
    activeItem: (typeof galleryItems)[number];
    activeCategory: (typeof inspirations)[number];
    references: (typeof galleryItems)[number][];
}): InspirationDetail {
    const category = activeCategory.title;
    const materials = getMaterials(category);
    const images = Array.from(
        new Set([activeItem.image, ...references.map((item) => item.image)]),
    ).slice(0, 6);

    return {
        id: activeItem.id,
        title: activeItem.title,
        category,
        packageLevel:
            category.includes("Kitchen") || category.includes("Ruang")
                ? "Standard / Premium"
                : "Standard",
        style: activeItem.style,
        budgetRange: getBudgetRange(category),
        idealSize: getIdealSize(category),
        projectLocation: "Semarang",
        projectTimeline: getProjectTimeline(category),
        vendorProfile: {
            vendorName: getVendorName(category),
            studioName: "Vendor Partner VMatch",
        },
        spaceType: activeItem.property,
        suitableFor: getSuitableFor(category),
        materials,
        shortDescription:
            "Referensi desain dari portofolio vendor partner VMatch yang dapat menjadi acuan awal sebelum customer mengajukan proyek interior.",
        fullDescription: `${activeItem.copy} Referensi ini berasal dari portofolio vendor partner VMatch. Detail akhir proyek tetap dapat disesuaikan berdasarkan kebutuhan ruang, ukuran, material, budget, dan proses validasi VMatch.`,
        designElements: getDesignElements(category),
        materialPackages: [
            {
                name: "Basic",
                description: "Pilihan ekonomis untuk kebutuhan interior sederhana.",
            },
            {
                name: "Standard",
                description: "Pilihan seimbang dengan material lebih kokoh dan rapi.",
            },
            {
                name: "Premium",
                description:
                    "Pilihan lebih kuat dengan finishing lebih detail dan tampilan elegan.",
            },
        ],
        images,
        beforeAfter: {
            before: references[0]?.image ?? activeItem.image,
            after: activeItem.image,
        },
        related: references.slice(0, 3).map((item) => ({
            id: item.id,
            title: item.title,
            style: item.style,
            budgetRange: getBudgetRange(category),
            image: item.image,
            href: `/inspirasi/${createSlug(category)}/${createSlug(item.title)}`,
        })),
    };
}

export default function InspirationItemDetailPage() {
    const params = useParams();
    const slug = String(params.slug || "");
    const detailSlug = String(params.detailSlug || "");

    const activeCategory =
        inspirations.find((item) => createSlug(item.title) === slug) ||
        inspirations[0];

    const activeItem =
        galleryItems.find((item) => createSlug(item.title) === detailSlug) ||
        galleryItems.find((item) => createSlug(item.title) === slug) ||
        galleryItems[0];

    const references = galleryItems
        .filter((item) => createSlug(item.title) !== createSlug(activeItem.title))
        .slice(0, 8);

    const inspiration = buildInspirationDetail({
        activeItem,
        activeCategory,
        references,
    });

    return (
        <main className="bg-[#FCFBF9] text-[#31332C]">
            <section className="bg-white px-4 pb-8 pt-6 text-[#31332c] sm:px-6">
                <div className="mx-auto max-w-[1320px]">
                    <Navbar />
                </div>
            </section>

            <section className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 md:py-12">
                <InspirationDetailView
                    inspiration={inspiration}
                    backHref={`/inspirasi/${createSlug(activeCategory.title)}`}
                />
            </section>

            <Footer />
        </main>
    );
}

function InspirationDetailView({
    inspiration,
    backHref,
}: {
    inspiration: InspirationDetail;
    backHref: string;
}) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = inspiration.images.length > 0 ? inspiration.images : [""];
    const activeImage = images[activeImageIndex] ?? images[0] ?? "";

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
        <div className="w-full space-y-6">
            <Link
                href={backHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#F8F6F2]"
            >
                <ArrowLeft size={15} />
                Kembali ke Inspirasi Desain
            </Link>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_380px]">
                <InspirationImageGallery
                    title={inspiration.title}
                    images={images}
                    activeImage={activeImage}
                    activeIndex={activeImageIndex}
                    onPrevious={goToPreviousImage}
                    onNext={goToNextImage}
                    onSelect={setActiveImageIndex}
                />

                <InspirationSummaryCard inspiration={inspiration} />
            </section>

            <section className="space-y-4">
                <div className="max-w-[920px]">
                    <p className="text-[12px] leading-5 text-[#7B756E]">
                        Inspirasi Desain / {inspiration.category}
                    </p>

                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
                        Detail Inspirasi
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
                        <RelatedInspirationCard key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function InspirationImageGallery({
    title,
    images,
    activeImage,
    activeIndex,
    onPrevious,
    onNext,
    onSelect,
}: {
    title: string;
    images: ImageSource[];
    activeImage: ImageSource;
    activeIndex: number;
    onPrevious: () => void;
    onNext: () => void;
    onSelect: (index: number) => void;
}) {
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
                                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-1xl transition sm:h-20 sm:w-28 ${active ? "ring-2 ring-[#725F54]/25" : "opacity-80 hover:opacity-100"
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
}: {
    inspiration: InspirationDetail;
}) {
    return (
        <aside className="h-fit rounded-1xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6 xl:sticky xl:top-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Ringkasan Inspirasi
            </p>

            <div className="mt-4 space-y-3">
                <SummaryRow label="Style" value={inspiration.style} />
                <SummaryRow label="Kategori" value={inspiration.category} />
                <SummaryRow label="Material" value={inspiration.materials.join(", ")} />
            </div>

            <div className="mt-5 grid gap-2">
                <Link
                    href="/#kontak"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                    Konsultasi Desain
                    <ArrowRight size={15} />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href="/dashboard/user"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                    >
                        Ajukan Proyek
                    </Link>

                    <a
                        href="https://wa.me/6281234567890"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
                    >
                        WhatsApp
                    </a>
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
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 px-0 sm:px-4 sm:first:pl-0 lg:border-l lg:border-[#E8E2D9] lg:first:border-l-0">
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
                    {profile.vendorName
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[20px] font-semibold text-[#31332C]">
                        {profile.vendorName}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        {profile.studioName}
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
    images: ImageSource[];
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
    before: ImageSource;
    after: ImageSource;
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
    src: ImageSource;
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

function RelatedInspirationCard({ item }: { item: RelatedInspiration }) {
    return (
        <Link
            href={item.href}
            className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:-translate-y-1 hover:border-[#725F54] hover:bg-[#FCFBF9]"
        >
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
                    {item.budgetRange}
                </p>

                <span className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white">
                    Lihat Detail
                    <ChevronRight size={14} />
                </span>
            </div>
        </Link>
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
    src: ImageSource;
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

                    <p className="text-[11px] text-[#7B756E]">Gambar belum tersedia</p>
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
