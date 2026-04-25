import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { testimonials } from "@/lib/home-content";

export function TestimonialsSection() {
  return (
    <section className="bg-[#FCFBF9] pb-12 md:pb-16">
      <div className="mx-auto max-w-[1180px] px-6">
        <AnimateIn delay={0.1}>
          <div className="mx-auto max-w-[560px] text-center">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">
              Client testimonials
            </p>
            <h2 className="mt-3 font-serif text-[31px] font-medium leading-[36px] text-[#31332C] sm:text-[40px] sm:leading-[45px]">
              Apa kata klien setelah proyek selesai.
            </h2>
          </div>
        </AnimateIn>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimateIn key={testimonial.author} delay={0.18 + index * 0.08} direction="up" as="article" className="border border-[#DED6CA] bg-white p-6">
              <p className="font-sans text-[13px] font-semibold tracking-[0.22em] text-[#6B5B52]">*****</p>
              <blockquote className="mt-5 font-serif text-[23px] leading-[31px] text-[#31332C]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-7 flex items-center gap-4 border-t border-[#DED6CA] pt-5">
                <Image
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  width={testimonial.image.width}
                  height={testimonial.image.height}
                  sizes="48px"
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-[#31332C]">
                    {testimonial.author}
                  </p>
                  <p className="mt-1 font-sans text-[12px] leading-4 text-[#797C73]">{testimonial.project}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
