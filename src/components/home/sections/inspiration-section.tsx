import Link from "next/link";

import { AnimateIn } from "@/components/home/animate-in";
import { Arrow } from "@/components/home/arrow";
import { FillImage } from "@/components/home/fill-image";
import { inspirations } from "@/lib/home-content";

export function InspirationSection() {
  return (
    <section className="bg-[#FCFBF9] pb-12 pt-4 md:pb-16" id="inspirasi">
      <div className="mx-auto max-w-[1180px] px-6">
        <AnimateIn delay={0.1}>
          <div className="mx-auto max-w-[560px] text-center">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">
              Our services
            </p>
            <h2 className="mt-3 font-serif text-[32px] font-medium leading-[37px] text-[#31332C] sm:text-[42px] sm:leading-[46px]">
              Solusi interior untuk setiap tipe ruang.
            </h2>
          </div>
        </AnimateIn>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {inspirations.map((item, index) => (
            <AnimateIn key={item.slug} delay={0.18 + index * 0.08} direction="up" className="h-full">
              <Link
                href={`/inspirasi/${item.slug}`}
                scroll
                className="group relative block h-[430px] overflow-hidden bg-[#332D28] outline-none focus-visible:ring-2 focus-visible:ring-[#6B5B52] focus-visible:ring-offset-4"
              >
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <FillImage image={item.image} sizes="(min-width: 1024px) 25vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/18 to-transparent transition-colors group-hover:from-black/82" />
                <div className="absolute bottom-7 left-8 right-8 text-white transition-transform duration-300 group-hover:-translate-y-2">
                  <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/72">
                    {item.areas.length} area detail
                  </p>
                  <h3 className="mt-3 font-serif text-[32px] leading-9">{item.title}</h3>
                  <p className="mt-3 max-w-60 font-sans text-sm leading-5 text-white/88">{item.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.13em]">
                    Lihat Inspirasi <Arrow />
                  </span>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
