"use client";

import { useEffect, useState } from "react";
import { FillImage } from "@/components/home/fill-image";
import { Navbar } from "@/components/home/navbar";
import { heroThumbs } from "@/lib/home-content";

const slides = [
  {
    title: "Wujudkan Interior Impian Tanpa Ribet",
    eyebrow: "Interior Custom & Furniture",
    copy: "Cukup kirim kebutuhan Anda, kami siapkan solusi terbaik hingga proyek selesai.",
    image: heroThumbs[0],
  },
  {
    title: "Ruang Lebih Rapi, Hangat, dan Berkelas",
    eyebrow: "Desain Interior Terarah",
    copy: "Kami bantu menyusun konsep, material, dan pengerjaan dalam satu proses yang jelas.",
    image: heroThumbs[1],
  },
  {
    title: "Solusi Furniture Sesuai Kebutuhan Anda",
    eyebrow: "Furniture Custom",
    copy: "Setiap detail dibuat menyesuaikan fungsi, ukuran ruang, dan gaya hunian Anda.",
    image: heroThumbs[2],
  },
];

export function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[active];

  return (
    <section
      id="beranda"
      className="relative h-svh min-h-[720px] overflow-hidden bg-[#1c1a16] text-white"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-all duration-1000 ${
            active === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <FillImage image={slide.image} sizes="100vw" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/45 to-black/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <Navbar />

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] items-end px-6 pb-12 pt-[120px] md:px-12 lg:pb-20">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[560px_1fr]">
          <div key={currentSlide.title} className="animate-[fadeUp_800ms_ease-out_both]">
            <p className="mb-4 text-[12px] uppercase tracking-[0.35em] text-white/75">
              {currentSlide.eyebrow}
            </p>

            <h1 className="max-w-[620px] font-serif text-[48px] font-semibold italic leading-[0.95] sm:text-[62px] lg:text-[76px]">
              {currentSlide.title}
            </h1>

            <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-white/82 sm:text-[17px]">
              {currentSlide.copy}
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <a
                href="/login"
                className="inline-flex h-[50px] min-w-[220px] items-center justify-center bg-white px-9 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b5b52] shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f3eee9] active:scale-95"
              >
                Mulai Proyek Anda
              </a>

              <a
                href="#inspirasi"
                className="group inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-all duration-300 hover:border-white hover:text-white"
              >
                Lihat Inspirasi
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  <path d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="flex items-end gap-5">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`group relative overflow-hidden rounded-2xl bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-2 ${
                    active === index
                      ? "h-[260px] w-[190px] border-2 border-white"
                      : "h-[220px] w-[165px] opacity-80"
                  }`}
                >
                  <FillImage image={slide.image} sizes="220px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-left">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                      VMatch
                    </p>
                    <p className="mt-2 font-serif text-[22px] italic leading-6 text-white">
                      {slide.eyebrow}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 md:right-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === index ? "w-8 bg-white" : "w-2 bg-white/45"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}