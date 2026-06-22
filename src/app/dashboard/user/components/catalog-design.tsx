"use client";

import Image from "next/image";
import {
    ArrowRight,
    Check,
    ChevronDown,
    ChevronRight,
    Home,
    ImageIcon,
    Layers,
    Search,
    Tag,
    Wallet,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { InspirationDetailView } from "./inspiration-detail-view";

type CatalogPageTarget = "ajukan" | "ai-ide" | "konsultasi" | "catalog";

type DesignItem = {
    id: string;
    name: string;
    projectType: string;
    category: string;
    style: string;
    propertyType: string;
    locationArea: string;
    description: string;
    budget: string;
    suitableFor: string;
    materials: string;
    packageType: "Basic" | "Standard" | "Premium" | "Standard/Premium";
    image: string;
    notes: string;
};

type MaterialPackage = {
    id: string;
    name: "Basic" | "Standard" | "Premium";
    description: string;
    suitableFor: string[];
    characters: string[];
};

type SelectedInspiration = {
    source: "design" | "material";
    referenceName: string;
    projectName: string;
    projectType: string;
    designStyle: string;
    estimatedBudget: string;
    materialPreference: string;
    materialPackage: string;
    initialNotes: string;
    referenceVisual?: string;
    description: string;
};

const STORAGE_KEY = "vmatch_selected_inspiration";

const propertyTypes = [
    "Semua Properti",
    "Rumah Tinggal",
    "Apartemen",
    "Kos & Kontrakan",
    "Villa",
    "Hotel",
    "Kantor",
    "Cafe & Resto",
    "Retail & Toko",
    "Commercial Space",
];

const locations = [
    "Semua Lokasi",
    "Jabodetabek",
    "Jawa Barat",
    "Jawa Tengah & DIY",
    "Jawa Timur",
    "Bali",
    "Sumatera",
    "Kalimantan",
    "Sulawesi",
];

const styles = [
    "Semua Gaya",
    "Modern Minimalis",
    "Modern Kontemporer",
    "Japandi",
    "Scandinavian",
    "Industrial",
    "Luxury Modern",
    "Klasik Modern",
    "Tropical Modern",
];

const designItems: DesignItem[] = [
    {
        id: "storage-rak",
        name: "Storage & Rak",
        projectType: "Storage & Rak / Furniture Built-in",
        category: "Storage & Rak",
        style: "Modern Minimalis",
        propertyType: "Apartemen",
        locationArea: "Jawa Tengah & DIY",
        description: "Solusi penyimpanan rapi dan efisien.",
        budget: "Rp24.500.000",
        suitableFor: "Kamar, ruang keluarga, apartemen",
        materials: "HPL, plywood, MDF",
        packageType: "Standard",
        image: "/figma/benefits-storage.webp",
        notes:
            "Customer tertarik dengan konsep Storage & Rak yang rapi, efisien, dan hemat ruang. Referensi ini digunakan sebagai preferensi awal. Solusi final tetap akan disesuaikan oleh tim VMatch berdasarkan ukuran, budget, material, dan kondisi ruangan.",
    },
    {
        id: "kitchen-set",
        name: "Kitchen Set",
        projectType: "Kitchen Set",
        category: "Kitchen Set",
        style: "Modern Minimalis",
        propertyType: "Rumah Tinggal",
        locationArea: "Jabodetabek",
        description: "Inspirasi dapur fungsional, bersih, dan elegan.",
        budget: "Rp43.500.000",
        suitableFor: "Dapur rumah, apartemen",
        materials: "HPL, plywood, solid surface",
        packageType: "Standard/Premium",
        image: "/figma/benefits-kitchen.webp",
        notes:
            "Customer tertarik dengan konsep dapur fungsional, bersih, dan elegan. Referensi ini digunakan sebagai preferensi awal sebelum divalidasi oleh tim VMatch.",
    },
    {
        id: "wardrobe",
        name: "Lemari/Wardrobe",
        projectType: "Wardrobe",
        category: "Lemari/Wardrobe",
        style: "Modern Kontemporer",
        propertyType: "Rumah Tinggal",
        locationArea: "Jawa Barat",
        description:
            "Penyimpanan pakaian yang rapi dan menyesuaikan kebutuhan ruang.",
        budget: "Rp38.000.000",
        suitableFor: "Kamar utama, kamar anak",
        materials: "HPL, MDF, kaca, cermin",
        packageType: "Standard",
        image: "/figma/benefits-wardrobe.webp",
        notes:
            "Customer tertarik dengan konsep wardrobe custom yang rapi, hemat tempat, dan menyesuaikan kebutuhan ruang. Tim VMatch tetap akan memvalidasi ukuran, material, budget, dan kondisi ruangan.",
    },
    {
        id: "living-room",
        name: "Ruang Tamu",
        projectType: "Ruang Tamu",
        category: "Ruang Tamu",
        style: "Japandi",
        propertyType: "Villa",
        locationArea: "Bali",
        description:
            "Ruang santai yang nyaman dengan suasana hangat dan elegan.",
        budget: "Rp55.000.000",
        suitableFor: "Rumah tinggal, apartemen",
        materials: "Panel dinding, rak TV, lighting",
        packageType: "Premium",
        image: "/figma/benefits-living.webp",
        notes:
            "Customer tertarik dengan inspirasi ruang tamu yang nyaman, hangat, dan elegan. Referensi ini akan menjadi preferensi awal sebelum solusi final disusun oleh tim VMatch.",
    },
    {
        id: "bedroom",
        name: "Kamar Tidur",
        projectType: "Kamar Tidur",
        category: "Kamar Tidur",
        style: "Scandinavian",
        propertyType: "Hotel",
        locationArea: "Jawa Timur",
        description:
            "Inspirasi kamar yang tenang, ringan, dan nyaman untuk istirahat.",
        budget: "Rp41.000.000",
        suitableFor: "Kamar utama, kamar anak, apartemen",
        materials: "HPL, panel dinding, lighting, fabric accent",
        packageType: "Standard",
        image: "/figma/benefits-bedroom.webp",
        notes:
            "Customer tertarik dengan konsep kamar tidur yang clean, nyaman, dan memiliki storage yang rapi. Detail teknis tetap akan disesuaikan oleh tim VMatch.",
    },
    {
        id: "work-area",
        name: "Area Kerja",
        projectType: "Ruang Kerja",
        category: "Area Kerja",
        style: "Luxury Modern",
        propertyType: "Kantor",
        locationArea: "Jabodetabek",
        description:
            "Area kerja compact yang rapi, fokus, dan tetap terlihat premium.",
        budget: "Rp22.500.000",
        suitableFor: "Home office, kamar, apartemen",
        materials: "Plywood, HPL, panel dinding, lighting",
        packageType: "Basic",
        image: "/figma/benefits-workspace.webp",
        notes:
            "Customer tertarik dengan area kerja custom yang rapi, fokus, dan hemat ruang. Referensi ini menjadi preferensi awal, bukan solusi final.",
    },
];

const materialPackages: MaterialPackage[] = [
    {
        id: "basic",
        name: "Basic",
        description:
            "Pilihan ekonomis untuk kebutuhan interior sederhana, area kering, dan penggunaan ringan.",
        suitableFor: [
            "MDF board",
            "Finishing melamine ekonomis",
            "Storage ringan",
            "Furniture built-in kecil",
        ],
        characters: [
            "Budget hemat",
            "Area kering",
            "Fungsional",
            "Mudah dirawat",
        ],
    },
    {
        id: "standard",
        name: "Standard",
        description:
            "Pilihan seimbang untuk furniture rumah dengan material lebih kokoh dan tampilan tetap rapi.",
        suitableFor: [
            "Multiplek 15mm",
            "Finishing HPL standar",
            "Kitchen set ringan",
            "Wardrobe dan storage rumah",
        ],
        characters: [
            "Lebih kokoh",
            "Tampilan rapi",
            "Tahan pakai",
            "Budget masih terkontrol",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        description:
            "Pilihan lebih kuat untuk interior utama dengan finishing lebih detail dan daya tahan lebih baik.",
        suitableFor: [
            "Multiplek 18mm",
            "Finishing HPL/melamine premium",
            "Hardware soft close",
            "Kitchen set premium dan master bedroom",
        ],
        characters: [
            "Material lebih kuat",
            "Finishing lebih rapi",
            "Lebih tahan lama",
            "Tampilan lebih elegan",
        ],
    },
];
export function CatalogDesign({
    onChangePage,
}: {
    onChangePage?: (page: CatalogPageTarget) => void;
}) {
    const [activeTab, setActiveTab] = useState<"design" | "material">("design");
    const [activeProperty, setActiveProperty] = useState("Semua Properti");
    const [activeLocation, setActiveLocation] = useState("Semua Lokasi");
    const [activeStyle, setActiveStyle] = useState("Semua Gaya");
    const [search, setSearch] = useState("");
    const [detailItem, setDetailItem] = useState<DesignItem | null>(null);
    const [pendingReference, setPendingReference] =
        useState<SelectedInspiration | null>(null);

    const filteredDesigns = useMemo(() => {
        return designItems.filter((item) => {
            const matchProperty =
                activeProperty === "Semua Properti" ||
                item.propertyType === activeProperty;

            const matchLocation =
                activeLocation === "Semua Lokasi" ||
                item.locationArea === activeLocation;

            const matchStyle =
                activeStyle === "Semua Gaya" || item.style === activeStyle;

            const keyword = search.trim().toLowerCase();

            const matchSearch =
                !keyword ||
                item.name.toLowerCase().includes(keyword) ||
                item.category.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword) ||
                item.materials.toLowerCase().includes(keyword) ||
                item.suitableFor.toLowerCase().includes(keyword) ||
                item.propertyType.toLowerCase().includes(keyword) ||
                item.locationArea.toLowerCase().includes(keyword);

            return matchProperty && matchLocation && matchStyle && matchSearch;
        });
    }, [activeProperty, activeLocation, activeStyle, search]);

    const openUseDesignPopup = (item: DesignItem) => {
        setPendingReference({
            source: "design",
            referenceName: item.name,
            projectName: `${item.name} ${item.style}`,
            projectType: item.projectType,
            designStyle: item.style,
            estimatedBudget: item.budget,
            materialPreference: item.materials,
            materialPackage: item.packageType,
            initialNotes: item.notes,
            referenceVisual: item.image,
            description: item.description,
        });
    };

    const openUseMaterialPopup = (item: MaterialPackage) => {
        const estimatedBudget =
            item.name === "Basic"
                ? "Di bawah Rp30 juta"
                : item.name === "Standard"
                    ? "Rp30-60 juta"
                    : "Rp60-100 juta";

        setPendingReference({
            source: "material",
            referenceName: `Paket ${item.name}`,
            projectName: `Proyek Interior Paket ${item.name}`,
            projectType: "",
            designStyle: "",
            estimatedBudget,
            materialPreference:
                item.name === "Premium"
                    ? "Plywood, HPL premium, duco, solid surface, kaca / cermin, lighting interior"
                    : item.name === "Standard"
                        ? "HPL, plywood, solid surface"
                        : "HPL, MDF, plywood",
            materialPackage: item.name,
            initialNotes: `Customer memilih paket ${item.name} sebagai preferensi awal. Tim VMatch tetap akan menyesuaikan material berdasarkan kebutuhan, budget, kondisi ruangan, dan solusi final.`,
            description: item.description,
        });
    };

    const handleUseAndEditRequest = () => {
        if (!pendingReference) return;

        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(pendingReference),
            );
        }

        setPendingReference(null);
        onChangePage?.("ajukan");
    };

    if (detailItem) {
        return (
            <InspirationDetailView
                onBack={() => setDetailItem(null)}
                onChangePage={onChangePage}
            />
        );
    }

    return (
        <div className="w-full space-y-6">
            <section className="relative -mx-5 -mt-5 overflow-hidden sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8">
                <div className="absolute inset-0">
                    <Image
                        src="/figma/project-library.webp"
                        alt="Inspirasi desain interior"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/60 to-black/45" />
                </div>

                <div className="relative z-10 px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                                INSPIRASI INTERIOR
                            </p>

                            <h1 className="mt-2 font-serif text-[34px] leading-tight text-white sm:text-[42px]">
                                Inspirasi Desain
                            </h1>

                            <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-white/78">
                                Temukan referensi desain dan material untuk membantu menyusun kebutuhan
                                proyek interior kamu.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onChangePage?.("ajukan")}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#31332C] transition hover:bg-[#F3EFE9] sm:w-fit"
                        >
                            Ajukan Proyek
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="flex gap-2 overflow-x-auto rounded-xl border border-[#E8E2D9] bg-white p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TabButton
                    active={activeTab === "design"}
                    icon={Home}
                    label="Desain Interior"
                    onClick={() => setActiveTab("design")}
                />

                <TabButton
                    active={activeTab === "material"}
                    icon={Layers}
                    label="Material & Finishing"
                    onClick={() => setActiveTab("material")}
                />
            </section>

            {activeTab === "design" ? (
                <DesignTab
                    activeProperty={activeProperty}
                    activeLocation={activeLocation}
                    activeStyle={activeStyle}
                    search={search}
                    filteredDesigns={filteredDesigns}
                    onSearchChange={setSearch}
                    onPropertyChange={setActiveProperty}
                    onLocationChange={setActiveLocation}
                    onStyleChange={setActiveStyle}
                    onResetFilter={() => {
                        setSearch("");
                        setActiveProperty("Semua Properti");
                        setActiveLocation("Semua Lokasi");
                        setActiveStyle("Semua Gaya");
                    }}
                    onOpenDetail={setDetailItem}
                    onUseDesign={openUseDesignPopup}
                />
            ) : (
                <MaterialTab onUseMaterial={openUseMaterialPopup} />
            )}

            {pendingReference && (
                <UseReferencePopup
                    reference={pendingReference}
                    onClose={() => setPendingReference(null)}
                    onViewDetail={() => {
                        const design = designItems.find(
                            (item) => item.name === pendingReference.referenceName,
                        );

                        if (design) {
                            setPendingReference(null);
                            setDetailItem(design);
                        }
                    }}
                    onUseAndEdit={handleUseAndEditRequest}
                />
            )}
        </div>
    );
}

function DesignTab({
    activeProperty,
    activeLocation,
    activeStyle,
    search,
    filteredDesigns,
    onSearchChange,
    onPropertyChange,
    onLocationChange,
    onStyleChange,
    onResetFilter,
    onOpenDetail,
    onUseDesign,
}: {
    activeProperty: string;
    activeLocation: string;
    activeStyle: string;
    search: string;
    filteredDesigns: DesignItem[];
    onSearchChange: (value: string) => void;
    onPropertyChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onStyleChange: (value: string) => void;
    onResetFilter: () => void;
    onOpenDetail: (item: DesignItem) => void;
    onUseDesign: (item: DesignItem) => void;
}) {
    return (
        <div className="space-y-5">
            <section className="rounded-xl border border-[#E8E2D9] bg-white p-4 sm:p-5">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_220px_150px] lg:items-end">
                    <label className="grid gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B756E]">
                            Cari Inspirasi
                        </span>

                        <div className="relative">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                            />

                            <input
                                value={search}
                                onChange={(event) => onSearchChange(event.target.value)}
                                className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] pl-11 pr-4 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]"
                                placeholder="Cari desain, material, ruangan, atau area..."
                            />
                        </div>
                    </label>

                    <FilterSelect
                        label="Properti"
                        value={activeProperty}
                        onChange={onPropertyChange}
                        options={propertyTypes.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                    />

                    <FilterSelect
                        label="Lokasi"
                        value={activeLocation}
                        onChange={onLocationChange}
                        options={locations.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                    />

                    <FilterSelect
                        label="Gaya"
                        value={activeStyle}
                        onChange={onStyleChange}
                        options={styles.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                    />

                    <button
                        type="button"
                        onClick={onResetFilter}
                        className="h-11 rounded-xl bg-[#725F54] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#5A4A42]"
                    >
                        Reset
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredDesigns.slice(0, 6).map((item, index) => (
                    <DesignCard
                        key={item.id}
                        item={item}
                        priority={index === 0}
                        onOpenDetail={() => onOpenDetail(item)}
                        onUseDesign={() => onUseDesign(item)}
                    />
                ))}
            </section>

            {filteredDesigns.length === 0 && (
                <section className="rounded-xl border border-dashed border-[#E4D8CD] bg-white py-14 text-center">
                    <p className="text-[14px] text-[#7B756E]">
                        Belum ada inspirasi yang cocok dengan filter ini.
                    </p>
                </section>
            )}
        </div>
    );
}

function DesignCard({
    item,
    priority,
    onOpenDetail,
    onUseDesign,
}: {
    item: DesignItem;
    priority: boolean;
    onOpenDetail: () => void;
    onUseDesign: () => void;
}) {
    return (
        <article className="overflow-hidden rounded-xl border border-[#E8E2D9] bg-white shadow-[0_8px_28px_rgba(49,51,44,0.03)] transition hover:border-[#E4D8CD] hover:shadow-[0_12px_32px_rgba(49,51,44,0.06)]">
            <ImageBox
                src={item.image}
                alt={item.name}
                title={item.name}
                priority={priority}
            />

            <div className="space-y-3 p-3 sm:p-4">
                <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <PackageBadge label={item.packageType} />
                        <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                            {item.style}
                        </span>

                        <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                            {item.propertyType}
                        </span>

                        <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                            {item.locationArea}
                        </span>
                    </div>

                    <h2 className="mt-3 font-serif text-[20px] leading-tight text-[#31332C] sm:text-[24px]">
                        {item.name}
                    </h2>

                    <p className="mt-2 text-[12px] leading-5 text-[#7B756E] sm:text-[13px] sm:leading-6">
                        {item.description}
                    </p>
                </div>

                <div className="grid gap-2">
                    <MetaRow icon={Wallet} label="Nilai Proyek" value={item.budget} />
                    <MetaRow icon={Home} label="Cocok" value={item.suitableFor} />
                    <MetaRow icon={Layers} label="Material" value={item.materials} />
                </div>

                <div className="grid gap-2">
                    <button
                        type="button"
                        onClick={onOpenDetail}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-3 text-[11px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9] sm:text-[12px]"
                    >
                        Lihat Detail
                        <ChevronRight size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={onUseDesign}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#725F54] px-3 text-[11px] font-semibold text-white transition hover:bg-[#5A4A42] sm:text-[12px]"
                    >
                        Gunakan sebagai Preferensi
                    </button>
                </div>
            </div>
        </article>
    );
}

function MaterialGroup({
    title,
    items,
}: {
    title: string;
    items: string[];
}) {
    return (
        <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_26px_rgba(49,51,44,0.05)]">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                    {title}
                </p>

                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#7B756E] ring-1 ring-[#E8E2D9]">
                    {items.length} item
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item}
                        className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function MaterialTab({
    onUseMaterial,
}: {
    onUseMaterial: (item: MaterialPackage) => void;
}) {
    return (
        <div className="space-y-5">
            <section className="pb-2">
                <div className="flex flex-col gap-3 border-l-4 border-[#725F54] pl-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725F54]">
                        Preferensi Material
                    </p>

                    <h2 className="font-serif text-[30px] leading-tight text-[#31332C]">
                        Material & Finishing
                    </h2>

                    <p className="max-w-[680px] text-[13px] leading-6 text-[#7B756E]">
                        Pilih referensi material dan finishing sebagai gambaran awal kualitas
                        proyek. Pilihan ini hanya untuk kebutuhan brief, bukan proses pembelian.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {materialPackages.map((item) => (
                    <MaterialPackageCard
                        key={item.id}
                        item={item}
                        onUse={() => onUseMaterial(item)}
                    />
                ))}
            </section>

            <section className="pb-2">

                <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#725F54]">
                        <Tag size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold text-[#31332C]">
                            Catatan Pemilihan Material
                        </h3>

                        <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#7B756E]">
                            Material final akan disesuaikan dengan kebutuhan ruang, budget,
                            dan kondisi proyek. Paket Basic, Standard, dan Premium hanya
                            menjadi referensi awal sebelum dikonsultasikan.
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <MaterialGroup
                                title="Material inti"
                                items={["MDF", "Multiplek 15mm", "Multiplek 18mm"]}
                            />

                            <MaterialGroup
                                title="Finishing"
                                items={["Melamine", "HPL", "Duco"]}
                            />

                            <MaterialGroup
                                title="Tambahan"
                                items={["Solid surface", "Kaca/cermin", "Lighting interior"]}
                            />
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

function UseReferencePopup({
    reference,
    onClose,
    onViewDetail,
    onUseAndEdit,
}: {
    reference: SelectedInspiration;
    onClose: () => void;
    onViewDetail: () => void;
    onUseAndEdit: () => void;
}) {
    const isDesign = reference.source === "design";

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6 backdrop-blur-sm">
            <section className="w-full max-w-[520px] rounded-xl border border-[#E4D8CD] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725F54]">
                            Preferensi Awal
                        </p>

                        <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C]">
                            {isDesign ? "Gunakan Referensi Ini?" : "Gunakan Paket Material Ini?"}
                        </h2>

                        <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                            Referensi ini akan digunakan sebagai preferensi awal saat kamu
                            mengajukan proyek. Semua data masih bisa kamu edit di halaman
                            Ajukan Proyek.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#7B756E] transition hover:bg-[#FCFBF9] hover:text-[#31332C]"
                        aria-label="Tutup popup"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5 space-y-2 rounded-xl bg-[#FCFBF9] p-4">
                    <PreviewRow label="Nama" value={reference.referenceName} />
                    <PreviewRow label="Style" value={reference.designStyle || "-"} />
                    <PreviewRow
                        label={isDesign ? "Nilai Proyek" : "Budget Preferensi"}
                        value={reference.estimatedBudget || "-"}
                    />
                    <PreviewRow
                        label="Material"
                        value={reference.materialPreference || "-"}
                    />
                    <PreviewRow
                        label="Paket"
                        value={reference.materialPackage || "-"}
                    />
                </div>

                <p className="mt-4 text-[12px] leading-5 text-[#7B756E]">
                    Memilih referensi tidak langsung mengirim request. Kamu tetap bisa
                    mengedit data sebelum request dikirim. Tim VMatch tetap akan
                    menyesuaikan solusi berdasarkan ukuran, budget, material, dan kondisi
                    ruangan.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                    >
                        Batal
                    </button>

                    {isDesign ? (
                        <button
                            type="button"
                            onClick={onViewDetail}
                            className="h-11 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
                        >
                            Lihat Detail
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
                        >
                            Tetap di Sini
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onUseAndEdit}
                        className="h-11 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                        Gunakan & Edit Request
                    </button>
                </div>
            </section>
        </div>
    );
}

function MaterialPackageCard({
    item,
    onUse,
}: {
    item: MaterialPackage;
    onUse: () => void;
}) {
    const featured = item.name === "Standard";

    return (
        <article
            className={`rounded-xl border p-5 shadow-[0_8px_28px_rgba(49,51,44,0.03)] transition hover:shadow-[0_12px_32px_rgba(49,51,44,0.06)] ${featured
                ? "border-[#725F54] bg-[#725F54] text-white"
                : "border-[#E8E2D9] bg-white text-[#31332C]"
                }`}
        >
            <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${featured ? "bg-white/15 text-white" : "bg-[#FCFBF9] text-[#725F54]"
                    }`}
            >
                <Layers size={18} />
            </div>

            <h3 className="mt-4 font-serif text-[28px] leading-tight">
                {item.name}
            </h3>

            <p
                className={`mt-2 text-[13px] leading-6 ${featured ? "text-white/75" : "text-[#7B756E]"
                    }`}
            >
                {item.description}
            </p>

            <div className="mt-5 space-y-2">
                {item.suitableFor.map((text) => (
                    <CheckLine key={text} text={text} light={featured} />
                ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {item.characters.map((text) => (
                    <span
                        key={text}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${featured
                            ? "bg-white/12 text-white"
                            : "border border-[#E4D8CD] bg-[#FCFBF9] text-[#725F54]"
                            }`}
                    >
                        {text}
                    </span>
                ))}
            </div>

            <button
                type="button"
                onClick={onUse}
                className={`mt-6 h-11 w-full rounded-xl text-[12px] font-semibold transition ${featured
                    ? "bg-white text-[#725F54] hover:bg-[#FCFBF9]"
                    : "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    }`}
            >
                Gunakan sebagai Preferensi
            </button>
        </article>
    );
}

function ImageBox({
    src,
    alt,
    title,
    priority,
}: {
    src: string;
    alt: string;
    title: string;
    priority?: boolean;
}) {
    const [error, setError] = useState(false);

    return (
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DF]">
            {error ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#EFE8DF] px-4 text-center text-[#725F54]">
                    <ImageIcon size={26} />
                    <p className="text-[12px] font-semibold">{title}</p>
                    <p className="text-[11px] text-[#7B756E]">Referensi visual</p>
                </div>
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    onError={() => setError(true)}
                    className="object-cover transition duration-300 hover:scale-[1.03]"
                />
            )}
        </div>
    );
}

function TabButton({
    active,
    icon: Icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-[13px] font-semibold transition ${active
                ? "bg-[#725F54] text-white"
                : "text-[#7B756E] hover:bg-[#FCFBF9] hover:text-[#31332C]"
                }`}
        >
            <Icon size={15} />
            {label}
        </button>
    );
}

function MetaRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-2 rounded-xl bg-[#FCFBF9] px-2.5 py-2">
            <Icon size={14} className="mt-0.5 shrink-0 text-[#725F54]" />
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B756E]">
                    {label}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-[#31332C] sm:text-[12px] sm:leading-5">
                    {value}
                </p>
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
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B756E]">
                {label}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 pr-10 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]"
                >
                    {options.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#725F54]"
                />
            </div>
        </label>
    );
}

function PackageBadge({ label }: { label: DesignItem["packageType"] }) {
    return (
        <span className="inline-flex rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#725F54] sm:text-[11px]">
            {label}
        </span>
    );
}

function CheckLine({ text, light }: { text: string; light?: boolean }) {
    return (
        <div className="flex gap-2">
            <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${light ? "bg-white/15 text-white" : "bg-[#FCFBF9] text-[#725F54]"
                    }`}
            >
                <Check size={12} />
            </span>

            <p
                className={`text-[13px] leading-6 ${light ? "text-white/78" : "text-[#7B756E]"
                    }`}
            >
                {text}
            </p>
        </div>
    );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-3 text-[12px]">
            <span className="text-[#7B756E]">{label}</span>
            <span className="max-w-[230px] text-right font-semibold text-[#31332C]">
                {value}
            </span>
        </div>
    );
}