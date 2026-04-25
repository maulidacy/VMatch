"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { FillImage } from "@/components/home/fill-image";
import { inspirations } from "@/lib/home-content";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function InspirationCategoriesSection() {
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

  return (
    <section id="inspirasi" className="overflow-hidden bg-white py-5">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="mb-10 animate-[fadeUp_700ms_ease-out_both]">
           <p className="font-sans text-[12px] uppercase leading-6 tracking-[0.27em] text-[#6b5b52] sm:text-base">
            Kategori Inspirasi
          </p>

          <h2 className="mt-4 max-w-[620px] font-serif text-[38px] font-medium leading-tight text-[#31332c] md:text-5xl">
            Temukan inspirasi sesuai kebutuhan ruang Anda
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="-mx-6 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-3 md:gap-4">
            {inspirations.slice(0, 6).map((item, index) => (
              <Link
                key={item.title}
                href={`/inspirasi/${createSlug(item.title)}`}
                className="group block shrink-0"
                style={{
                  animation: `fadeUp 700ms ease-out ${index * 100}ms both`,
                }}
              >
                <article className="relative h-[320px] w-[230px] overflow-hidden rounded-xl bg-[#1f1d19] shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_42px_rgba(0,0,0,0.22)] sm:w-[250px] md:h-[360px] md:w-[270px]">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <FillImage image={item.image} sizes="270px" />
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
              </Link>
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
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDot === dot
                  ? "w-6 bg-[#6B3E1E]"
                  : "w-2 bg-[#6B3E1E]/60 hover:bg-[#6B3E1E]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}