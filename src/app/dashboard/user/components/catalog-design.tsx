"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { inspirations } from "@/lib/home-content";
import { CatalogGallery } from "./catalog-gallery";

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

export function CatalogDesign({
    onChangePage,
}: {
    onChangePage: (page: PageId) => void;
}) {
    const [selectedCategory, setSelectedCategory] =
        useState<(typeof inspirations)[number] | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeDot, setActiveDot] = useState(0);

    const handleDotClick = (index: number) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = (container.scrollWidth - container.clientWidth) / 2;

        container.scrollTo({
            left: scrollAmount * index,
            behavior: "smooth",
        });

        setActiveDot(index);
    };

    if (selectedCategory) {
        return (
            <CatalogGallery
                category={selectedCategory}
                onBack={() => setSelectedCategory(null)}
                onChangePage={onChangePage}
            />
        );
    }

    return (
        <div className="space-y-8">
            <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">
                    Inspirasi Interior
                </p>

                <h1 className="mt-3 font-serif text-[42px] leading-tight text-[#31332c] sm:text-[56px]">
                    Katalog Desain
                </h1>

                <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#797c73]">
                    Temukan inspirasi interior sesuai kebutuhan ruangmu. Pilih kategori
                    untuk melihat referensi desain di dalam dashboard.
                </p>
            </section>

            <section>
                <div
                    ref={scrollRef}
                    className="-mx-4 overflow-x-auto scroll-smooth px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6"
                >
                    <div className="flex w-max gap-4">
                        {inspirations.slice(0, 6).map((item) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => setSelectedCategory(item)}
                                className="group block shrink-0 text-left"
                            >
                                <article className="relative h-[320px] w-[230px] overflow-hidden rounded-xl bg-[#1f1d19] shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_42px_rgba(0,0,0,0.22)] sm:w-[250px] md:h-[360px] md:w-[270px]">
                                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                        <Image
                                            src={item.image.src}
                                            alt={item.image.alt}
                                            fill
                                            sizes="270px"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                        <h3 className="font-serif text-[22px] italic leading-none">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-white/80">
                                            {item.copy}
                                        </p>

                                        <span className="mt-5 inline-flex items-center gap-1.5 border-b border-white/25 pb-1 text-[11px] font-medium text-white/95 transition-all duration-300 group-hover:border-white">
                                            Lihat Inspirasi
                                            <svg
                                                viewBox="0 0 16 16"
                                                aria-hidden="true"
                                                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                                            >
                                                <path
                                                    d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </article>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mx-auto mt-2 flex items-center justify-center gap-2">
                    {[0, 1, 2].map((dot) => (
                        <button
                            key={dot}
                            type="button"
                            onClick={() => handleDotClick(dot)}
                            aria-label={`Geser ke bagian ${dot + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${activeDot === dot
                                ? "w-6 bg-[#6B3E1E]"
                                : "w-2 bg-[#6B3E1E]/60 hover:bg-[#6B3E1E]"
                                }`}
                        />
                    ))}
                </div>
            </section>

            <div className="border border-[#ded6ca] bg-[#f7f4ef] p-4 text-[13px] leading-6 text-[#797c73]">
                Katalog ini bukan marketplace dan bukan tempat memilih vendor. Semua
                proses tetap dikelola oleh tim VMatch setelah request proyek diajukan.
            </div>
        </div>
    );
}