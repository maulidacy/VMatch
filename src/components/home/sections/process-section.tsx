import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { steps } from "@/lib/home-content";

export function ProcessSection() {
  return (
    <section className="bg-white pb-20 text-center text-[#31332c] md:pb-28" id="cara-kerja">
      <div className="relative min-h-[380px] overflow-hidden md:min-h-[460px]">
        <Image
          src="/inspirations/rumah-ruang-keluarga.webp"
          alt="Warm family room backdrop"
          width={1400}
          height={1000}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-center px-6 pt-24 pb-32 md:pt-32 md:pb-40">
          <AnimateIn delay={0.1}>
            <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-white/90">cara kerja</p>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <h2 className="mt-4 max-w-[700px] font-serif text-[32px] font-medium italic leading-[1.2] text-white sm:text-[42px]">
              Mewujudkan hunian dalam tiga langkah sederhana
            </h2>
          </AnimateIn>
        </div>
      </div>
      
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="relative z-20 -mt-24 grid gap-6 md:-mt-32 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <AnimateIn key={step.number} delay={0.3 + index * 0.15} direction="up" className="h-full">
              <article 
                className="group flex h-full flex-col items-center bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] sm:px-8"
              >
                <div className="grid h-16 w-16 place-items-center bg-[#fcfbf9] shadow-inner ring-1 ring-[#e6e4de] transition-transform duration-500 group-hover:scale-110">
                  <span className="font-serif text-xl italic text-[#6b5b52]">{step.number}</span>
                </div>
                <h3 className="mt-6 font-serif text-[19px] italic leading-snug text-[#31332C]">{step.title}</h3>
                <p className="mt-4 font-sans text-[14px] leading-[1.7] text-[#797C73]">{step.copy}</p>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}