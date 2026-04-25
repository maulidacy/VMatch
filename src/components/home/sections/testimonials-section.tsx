"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/home-content";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = [
    testimonials[activeIndex],
    testimonials[(activeIndex + 1) % testimonials.length],
  ];

  return (
    <section className="overflow-hidden bg-white pt-14 pb-8 md:pt-16 md:pb-10">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 lg:grid-cols-[340px_1fr] lg:gap-20">
        <div className="animate-[fadeUp_700ms_ease-out_both]">
          <p className="text-[15px] uppercase tracking-[0.28em] text-[#6b5b52]">
            Suara Klien
          </p>

          <h2 className="mt-4 font-serif text-[42px] italic leading-tight text-[#31332c] md:text-5xl">
            Testimoni Klien
          </h2>

          <p className="mt-8 max-w-[330px] font-sans text-[15px] leading-7 text-[#5e6058]">
            Kepercayaan klien menjadi dasar kami dalam menghadirkan proses
            interior yang rapi, jelas, dan nyaman dari awal hingga selesai.
          </p>

          <div className="mt-10 flex items-end gap-5">
            <div className="flex">
              {[0, 1, 2].map((item) => (
                <span
                  key={item}
                  className="-mr-3 h-12 w-12 rounded-full border-2 border-white bg-[#d8d1c6] shadow-sm"
                />
              ))}
            </div>

            <span className="text-[11px] uppercase tracking-[0.18em] text-[#6b5b52]">
              Lebih dari 40 klien puas
            </span>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {visibleTestimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.author}-${activeIndex}-${index}`}
              className="relative overflow-hidden border-l-4 border-[#6b5b52] bg-[#f5f3ee] px-8 py-9 shadow-[0_14px_35px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(0,0,0,0.12)] md:px-11 md:py-10"
              style={{
                animation: `fadeUp 700ms ease-out ${index * 140}ms both`,
              }}
            >
              <div className="absolute right-6 top-4 font-serif text-[90px] leading-none text-[#6b5b52]/10">
                ”
              </div>

              <div
                className="relative z-10 flex gap-1 text-[#6b5b52]"
                aria-label="Rating lima bintang"
              >
                {"★★★★★".split("").map((star, starIndex) => (
                  <span key={`${star}-${starIndex}`} className="text-sm">
                    {star}
                  </span>
                ))}
              </div>

              <p className="relative z-10 mt-6 font-serif text-[20px] italic leading-8 text-[#31332c]">
                “{testimonial.quote}”
              </p>

              <p className="relative z-10 mt-8 border-t border-[#ded7cc] pt-5 text-[11px] uppercase tracking-[0.14em] text-[#6b5b52]">
                {testimonial.author}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Lihat testimoni ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-7 bg-[#6b5b52]"
                : "w-2 bg-[#6b5b52]/35 hover:bg-[#6b5b52]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}