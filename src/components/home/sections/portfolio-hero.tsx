"use client";

import Image from "next/image";
import { Navbar } from "@/components/home/navbar";
import { useState } from "react";

const heroImages = [
  {
    src: "/figma/project-library.webp",
    alt: "Interior ruang keluarga modern dengan panel kayu dan kabinet",
  },
  {
    src: "/figma/project-loft.webp",
    alt: "Interior ruang makan minimalis",
  },
  {
    src: "/figma/project-walnut.webp",
    alt: "Interior ruang kerja modern",
  },
];

export function PortfolioHero() {
  const [activeImage, setActiveImage] = useState(heroImages[0]);

  return (
    <section className="relative overflow-hidden bg-[#f8f7f5]">
      <Navbar active="beranda" />

      <div className="relative min-h-screen overflow-hidden pt-[110px] lg:pt-0">
        {/* Desktop image kanan, tidak mepet kanan */}
        <div className="absolute bottom-8 right-6 top-8 hidden w-[46%] animate-[heroImageIn_1s_ease-out_both] overflow-hidden rounded-[28px] lg:block xl:right-10 2xl:right-[calc((100vw-1320px)/2)]">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            priority
            sizes="46vw"
            className="animate-[fadeIn_700ms_cubic-bezier(0.22,1,0.36,1)_both] object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1320px] px-4 sm:px-6 md:px-8 lg:grid-cols-[52%_48%] lg:px-10 xl:px-0">
          <div className="flex min-w-0 flex-col justify-center pb-8 pt-10 sm:pt-16 lg:min-h-screen lg:pb-32 lg:pr-12 lg:pt-28 xl:pr-16">
            <p className="animate-[fadeUp_700ms_ease-out_150ms_both] text-[10px] uppercase tracking-[0.32em] text-[#8b8179] md:text-[11px]">
              Eksplorasi Katalog
            </p>

            <h1 className="mt-4 max-w-[650px] animate-[fadeUp_800ms_ease-out_250ms_both] font-serif text-[42px] italic leading-[1] text-[#31332c] sm:text-[56px] md:text-[68px] lg:text-[72px]">
              Eksplorasi Portofolio Interior
            </h1>

            <p className="mt-6 max-w-[470px] animate-[fadeUp_800ms_ease-out_400ms_both] text-sm leading-7 text-[#6f6a65] md:text-[16px]">
              Temukan berbagai proyek interior yang telah kami tangani sebagai
              inspirasi untuk kebutuhan Anda.
            </p>

            {/* Thumbnail desktop */}
            <div className="mt-20 hidden h-[190px] items-center justify-start pl-5 animate-[fadeUp_900ms_ease-out_550ms_both] lg:flex xl:mt-28 xl:pl-10">
              {heroImages.map((image) => {
                const isActive = activeImage.src === image.src;

                return (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`relative -mx-4 overflow-hidden border-2 border-white bg-[#ddd] transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "z-20 h-[170px] w-[230px] scale-100 opacity-100 shadow-xl"
                        : "z-10 h-[120px] w-[180px] scale-100 opacity-85 hover:opacity-100"
                    }`}
                    aria-label={`Tampilkan ${image.alt}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={isActive ? "230px" : "180px"}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile image */}
          <div className="relative z-10 mb-10 h-[360px] overflow-hidden rounded-[28px] sm:h-[460px] lg:hidden">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] hidden h-[220px] bg-gradient-to-t from-[#2f332d] via-[#2f332d]/60 to-transparent lg:block" />
      </div>
    </section>
  );
}