import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { steps } from "@/lib/home-content";

export function ProcessSection() {
  return (
    <section className="bg-[#fcfbf9] pb-20 text-center text-[#31332c] md:pb-28" id="cara-kerja">
      <div className="relative min-h-[380px] overflow-hidden md:min-h-[460px]">
        <Image
          src="/figma/process-bg.webp"
          alt="Minimal modern kitchen backdrop"
          width={736}
          height={736}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
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
                className="flex h-full flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-xl shadow-black/5 ring-1 ring-black/[0.04] transition-transform duration-300 hover:-translate-y-1 sm:px-8"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#fcfbf9] shadow-inner ring-1 ring-[#e6e4de]">
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
