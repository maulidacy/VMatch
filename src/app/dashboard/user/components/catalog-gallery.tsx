"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import {
    ArrowLeft,
    Bookmark,
    BrainCircuit,
    CalendarDays,
    ChevronDown,
    MoreHorizontal,
    Send,
} from "lucide-react";
import { inspirations } from "@/lib/home-content";


type PageId =
    | "dashboard"
    | "catalog"
    | "ai-ide"
    | "konsultasi"
    | "ajukan"
    | "request"
    | "solusi"
    | "proyek"
    | "revisi"
    | "files"
    | "notifikasi"
    | "review"
    | "profil";

type Inspiration = (typeof inspirations)[number];

function createSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const styles = ["Semua Gaya", "Modern", "Minimalis"];
const properties = ["Semua Properti", "Rumah", "Apartemen"];

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

export function CatalogGallery({
    category,
    onBack,
    onChangePage,
}: {
    category: Inspiration;
    onBack: () => void;
    onChangePage: (page: PageId) => void;
}) {
    const [search, setSearch] = useState("");
    const [style, setStyle] = useState("Semua Gaya");
    const [property, setProperty] = useState("Semua Properti");

    const deferredSearch = useDeferredValue(search);

    const visibleItems = useMemo(() => {
        const keyword = deferredSearch.trim().toLowerCase();
        const categorySlug = createSlug(category.title);

        return galleryItems.filter((item) => {
            const baseTitle = item.title.replace(/\s+\d+$/, "");
            const sameCategory = createSlug(baseTitle) === categorySlug;

            const matchSearch =
                keyword.length === 0 ||
                item.title.toLowerCase().includes(keyword) ||
                item.copy.toLowerCase().includes(keyword);

            const matchStyle = style === "Semua Gaya" || item.style === style;

            const matchProperty =
                property === "Semua Properti" || item.property === property;

            return sameCategory && matchSearch && matchStyle && matchProperty;
        });
    }, [category.title, deferredSearch, style, property]);

    const [activeItem, setActiveItem] =
        useState<(typeof galleryItems)[number] | null>(null);

    if (activeItem) {
        return (
            <CatalogItemDetail
                item={activeItem}
                references={visibleItems.filter((item) => item.id !== activeItem.id)}
                onBack={() => setActiveItem(null)}
                onChangePage={onChangePage}
                onSelectItem={setActiveItem}
            />
        );
    }
    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden bg-[#191A17] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
                <div className="absolute inset-0 opacity-50">
                    <Image
                        src={category.image.src}
                        alt={category.image.alt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-black/28" />

                <div className="relative z-10">
                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-10 grid h-11 w-11 place-items-center border border-white/30 text-white transition hover:bg-white hover:text-[#31332c]"
                        aria-label="Kembali ke katalog"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">
                        Inspirasi Ruangan
                    </p>

                    <h1 className="mt-4 font-serif text-[42px] leading-tight text-white sm:text-[56px] md:text-[64px]">
                        Inspirasi {category.title}
                    </h1>

                    <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-white/85">
                        {category.copy}
                    </p>

                    <div className="mt-12 bg-black/18 p-4 backdrop-blur-sm sm:p-5 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
                        <div className="grid grid-cols-2 gap-5 lg:grid-cols-[1.35fr_0.55fr_0.55fr_auto] lg:items-end">
                            <div className="col-span-2 lg:col-span-1">
                                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                                    Cari Proyek
                                </label>

                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Cari inspirasi..."
                                    className="h-14 w-full bg-white px-5 text-sm text-[#31332c] outline-none placeholder:text-[#b8b2aa]"
                                />
                            </div>

                            <SelectField
                                label="Gaya"
                                value={style}
                                onChange={setStyle}
                                options={styles}
                            />

                            <SelectField
                                label="Jenis Properti"
                                value={property}
                                onChange={setProperty}
                                options={properties}
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStyle("Semua Gaya");
                                    setProperty("Semua Properti");
                                }}
                                className="col-span-2 h-14 bg-[#6b5b52] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#5a4a42] lg:col-span-1"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1320px] px-1 py-4 sm:px-2">
                {visibleItems.length > 0 ? (
                    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
                        {visibleItems.map((item, index) => (
                            <GalleryCard
                                key={item.id}
                                item={item}
                                index={index}
                                onChangePage={onChangePage}
                                onDetail={() => setActiveItem(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="font-serif text-[28px] italic text-[#31332c]">
                            Inspirasi tidak ditemukan.
                        </p>
                    </div>
                )}
            </section>

            <div className="border border-[#ded6ca] bg-[#f7f4ef] p-4 text-[13px] leading-6 text-[#797c73]">
                Desain ini hanya sebagai inspirasi awal. Solusi final akan disusun dan
                divalidasi oleh tim VMatch setelah request proyek diajukan.
            </div>
        </div>
    );
}

function GalleryCard({
    item,
    index,
    onChangePage,
    onDetail,
}: {
    item: (typeof galleryItems)[number];
    index: number;
    onChangePage: (page: PageId) => void;
    onDetail: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <article
            onClick={onDetail}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onDetail();
                }
            }}
            className="group relative mb-4 block w-full cursor-pointer break-inside-avoid rounded-[22px] bg-[#f7f4ef] text-left shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1"
        >
            <div className="overflow-hidden rounded-[22px]">
                <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={800}
                    height={1100}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index <= 1}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
                />
            </div>

            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen((value) => !value);
                }}
                className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full bg-white text-[#31332c] shadow-lg transition hover:bg-[#f7f4ef] active:scale-95"
                aria-label="Menu inspirasi"
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (
                <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-3 top-14 z-50 w-[260px] rounded-[24px] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.24)] ring-1 ring-black/5"
                >
                    <MenuAction icon={<Bookmark size={18} />} label="Simpan" />

                    <MenuAction
                        icon={<BrainCircuit size={18} />}
                        label="Gunakan untuk AI Ide"
                        onClick={() => onChangePage("ai-ide")}
                    />

                    <MenuAction
                        icon={<CalendarDays size={18} />}
                        label="Konsultasikan"
                        onClick={() => onChangePage("konsultasi")}
                    />

                    <MenuAction
                        icon={<Send size={18} />}
                        label="Ajukan Serupa"
                        onClick={() => onChangePage("ajukan")}
                    />
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-black/0 transition duration-300 group-hover:bg-black/25" />

            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onDetail();
                }}
                className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
                <span className="inline-flex items-center gap-2 rounded-[16px] bg-white px-4 py-3 text-[14px] font-semibold leading-none text-[#191A17] shadow-lg">
                    <span className="text-[18px] leading-none">↗</span>
                    Lihat detail
                </span>
            </button>
        </article>
    );
}

function MenuAction({
    icon,
    label,
    onClick,
}: {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
                onClick?.();
            }}
            className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[14px] font-medium text-[#31332c] transition hover:bg-[#f7f4ef]"
        >
            {icon}
            {label}
        </button>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {
    return (
        <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-14 w-full appearance-none border border-[#ded6ca] bg-white px-5 pr-12 text-sm text-[#31332c] outline-none"
                >
                    {options.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </select>

                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#6b5b52]"
                />
            </div>
        </div>
    );
}

function CatalogItemDetail({
    item,
    references,
    onBack,
    onChangePage,
    onSelectItem,
}: {
    item: (typeof galleryItems)[number];
    references: (typeof galleryItems)[number][];
    onBack: () => void;
    onChangePage: (page: PageId) => void;
    onSelectItem: (item: (typeof galleryItems)[number]) => void;
}) {
    return (
        <div className="space-y-10">
            <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:gap-8">
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        aria-label="Kembali ke galeri"
                        className="mb-4 inline-flex h-11 w-11 items-center justify-center text-[#191A17] transition hover:bg-[#f4f1ed]"
                    >
                        <ArrowLeft size={32} strokeWidth={2.2} />
                    </button>

                    <div className="overflow-hidden rounded-[28px] bg-[#f4f1ed]">
                        <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            width={1100}
                            height={1400}
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </div>

                <div className="lg:sticky lg:top-24">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b8178]">
                        Detail Inspirasi
                    </p>

                    <h1 className="mt-3 font-serif text-[38px] leading-tight text-[#31332c] sm:text-[48px]">
                        {item.title}
                    </h1>

                    <p className="mt-5 text-[15px] leading-7 text-[#797C73]">
                        {item.copy}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-[#f7f4ef] p-4">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b8178]">
                                Gaya
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[#31332c]">
                                {item.style}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#f7f4ef] p-4">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b8178]">
                                Properti
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[#31332c]">
                                {item.property}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-2.5">
                        <button
                            type="button"
                            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#6b5b52] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5a4a42] active:scale-[0.98] sm:h-[52px] sm:text-[12px]"
                        >
                            <Bookmark size={15} />
                            Simpan Inspirasi
                        </button>

                        <div className="grid grid-cols-3 gap-2.5">
                            <button
                                type="button"
                                onClick={() => onChangePage("ai-ide")}
                                className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#6b5b52]/30 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b5b52] transition hover:bg-[#f4f1ed] active:scale-[0.98] sm:h-12 sm:gap-2 sm:text-[12px]"
                            >
                                <BrainCircuit size={14} />
                                AI Ide
                            </button>

                            <button
                                type="button"
                                onClick={() => onChangePage("konsultasi")}
                                className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#6b5b52]/30 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b5b52] transition hover:bg-[#f4f1ed] active:scale-[0.98] sm:h-12 sm:gap-2 sm:text-[12px]"
                            >
                                <CalendarDays size={14} />
                                Konsultasi
                            </button>

                            <button
                                type="button"
                                onClick={() => onChangePage("ajukan")}
                                className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#6b5b52]/30 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b5b52] transition hover:bg-[#f4f1ed] active:scale-[0.98] sm:h-12 sm:gap-2 sm:text-[12px]"
                            >
                                <Send size={14} />
                                Ajukan
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b8178]">
                    Referensi Lain
                </p>

                <h2 className="mt-3 font-serif text-[32px] leading-tight text-[#31332c] md:text-[42px]">
                    Desain yang mungkin Anda suka
                </h2>

                <div className="mt-7 columns-2 gap-4 sm:columns-3 lg:columns-4">
                    {references.slice(0, 8).map((ref, index) => (
                        <GalleryCard
                            key={ref.id}
                            item={ref}
                            index={index}
                            onChangePage={onChangePage}
                            onDetail={() => {
                                onSelectItem(ref);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}