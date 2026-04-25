import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";

export function PhilosophySection() {
  return (
    <section className="bg-[#FCFBF9] py-12 md:py-16" id="tentang">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <div className="py-2">
          <AnimateIn delay={0.1}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">
              About us
            </p>
            <h2 className="mt-3 max-w-[460px] font-serif text-[34px] font-medium leading-[39px] text-[#31332C] sm:text-[43px] sm:leading-[48px]">
              Kami mendesain dengan tujuan, lalu mengeksekusinya sampai selesai.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="mt-6 max-w-[520px] font-sans text-[15px] leading-[27px] text-[#5E6058]">
              VMATCH lahir dari keresahan pemilik properti yang lelah dengan ketidakpastian vendor. Kami mengambil
              peran penuh sebagai pengelola proyek, memastikan setiap detail sesuai dengan standar tinggi yang kami
              janjikan.
            </p>
          </AnimateIn>
          <ul className="mt-7 space-y-3 font-sans text-[14px] leading-6 text-[#31332C]">
            {[
              "Single point of contact untuk seluruh urusan proyek",
              "Garansi kualitas pengerjaan dan material",
              "Efisiensi biaya melalui jaringan pengadaan langsung",
            ].map((item, index) => (
              <AnimateIn key={item} delay={0.35 + index * 0.08} direction="up" as="li" className="flex items-start gap-3">
                <span className="mt-1 grid h-[18px] w-[18px] shrink-0 place-items-center bg-[#6B5B52] text-white" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                    <path d="M3.5 8.1l2.7 2.7 6.3-6.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                {item}
              </AnimateIn>
            ))}
          </ul>
          <AnimateIn delay={0.65}>
            <a
              href="#kontak"
              className="mt-8 inline-flex h-11 items-center justify-center bg-[#6B5B52] px-7 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#5B4C44]"
            >
              Kenali kebutuhan proyek
            </a>
          </AnimateIn>
        </div>
        <AnimateIn delay={0.2} direction="left" className="relative min-h-[300px] overflow-hidden bg-[#DED6CA] sm:min-h-[420px] lg:min-h-[460px]">
          <Image
            src="/inspirations/rumah-hero.webp"
            alt="Warm modern home interior"
            width={1400}
            height={1000}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimateIn>
      </div>
    </section>
  );
}
