import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { testimonials } from "@/lib/home-content";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-14 lg:py-[72px]">
      <div className="mx-auto max-w-[1168px] px-6">
        <div className="grid gap-5 lg:grid-cols-[360px_1fr] lg:items-end">
          <div>
            <AnimateIn delay={0.1}>
              <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#6B5B52]">Testimoni klien</p>
              <h2 className="mt-4 max-w-[360px] font-serif text-[42px] leading-[42px] text-[#31332C] sm:text-[48px] sm:leading-[48px]">
                Kata mereka setelah proyek selesai.
              </h2>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.2} direction="left">
            <p className="max-w-[520px] font-sans text-base leading-7 text-[#5E6058] lg:justify-self-end">
              Review singkat dari klien yang memakai VMatch untuk desain, kurasi vendor, material, produksi, dan
              instalasi interior.
            </p>
          </AnimateIn>
        </div>

        <div className="mt-10 grid border-t border-[#DED6CA] lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimateIn
              key={testimonial.author}
              delay={0.3 + index * 0.15}
              direction="up"
              as="article"
              className={`border-b border-[#DED6CA] py-7 lg:px-7 ${
                index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[#DED6CA]"
              } ${index === testimonials.length - 1 ? "lg:pr-0" : ""}`}
            >
              <blockquote className="font-serif text-[25px] leading-[32px] text-[#31332C]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <Image
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  width={testimonial.image.width}
                  height={testimonial.image.height}
                  sizes="52px"
                  className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                    {testimonial.author}
                  </p>
                  <p className="mt-1 font-sans text-xs leading-4 text-[#797C73]">{testimonial.project}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}