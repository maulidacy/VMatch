"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";
import { inspirations } from "@/lib/home-content";
import { AnimateIn } from "@/components/home/animate-in";
import { ArrowLeft } from "lucide-react";

function createSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

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

    return (
        <main className="bg-white text-[#31332c]">
            <section className="bg-white px-4 pb-8 pt-6 text-[#31332c] sm:px-6">
                <div className="mx-auto max-w-[1320px]">
                    <Navbar />
                </div>
            </section>

            <section className="mx-auto grid max-w-[1320px] gap-5 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[48px_1fr_0.72fr] lg:gap-8">
                <Link
                    href={`/inspirasi/${createSlug(activeCategory.title)}`}
                    aria-label="Kembali ke inspirasi"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#191A17] transition hover:bg-[#f4f1ed] lg:mt-2"
                >
                    <ArrowLeft size={34} strokeWidth={2.2} />
                </Link>

                <AnimateIn direction="up" duration={0.65} once={true}>
                    <div className="overflow-hidden rounded-[28px] bg-[#f4f1ed]">
                        <Image
                            src={activeItem.image}
                            alt={activeItem.title}
                            width={1100}
                            height={1400}
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </AnimateIn>

                <AnimateIn direction="up" delay={0.12} duration={0.65} once={true}>
                    <div className="lg:sticky lg:top-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b8178]">
                            Detail Inspirasi
                        </p>

                        <h1 className="mt-3 font-serif text-[38px] leading-tight text-[#31332c] sm:text-[48px]">
                            {activeItem.title}
                        </h1>

                        <p className="mt-5 text-[15px] leading-7 text-[#797C73]">
                            {activeItem.copy}
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-[#f7f4ef] p-4">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b8178]">
                                    Gaya
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[#31332c]">
                                    {activeItem.style}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[#f7f4ef] p-4">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b8178]">
                                    Properti
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[#31332c]">
                                    {activeItem.property}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/#kontak"
                                className="inline-flex justify-center rounded-full bg-[#6b5b52] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#5a4a42]"
                            >
                                Konsultasi Desain
                            </Link>

                            <a
                                href="https://wa.me/6281234567890"
                                className="inline-flex justify-center rounded-full border border-[#6b5b52]/45 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52] transition hover:bg-[#f4f1ed]"
                            >
                                Chat WhatsApp
                            </a>
                        </div>
                    </div>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-[1320px] px-4 pb-20 sm:px-6">
                <AnimateIn direction="up" duration={0.65} once={true}>
                    <div className="mb-7 flex items-end justify-between gap-5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b8178]">
                                Referensi Lain
                            </p>
                            <h2 className="mt-3 font-serif text-[32px] leading-tight text-[#31332c] md:text-[42px]">
                                Desain yang mungkin Anda suka
                            </h2>
                        </div>
                    </div>
                </AnimateIn>

                <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
                    {references.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/inspirasi/${createSlug(activeCategory.title)}/${createSlug(
                                item.title,
                            )}`}
                            className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-[22px] bg-[#f7f4ef]"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={800}
                                height={1100}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={index <= 1}
                                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
                            />

                            <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <span className="inline-flex items-center gap-2 rounded-[16px] bg-white px-4 py-3 text-[14px] font-semibold leading-none text-[#191A17] shadow-lg">
                                    <span className="text-[18px] leading-none">↗</span>
                                    Lihat detail
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}