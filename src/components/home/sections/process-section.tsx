import Image from "next/image";

import { steps } from "@/lib/home-content";

export function ProcessSection() {
  return (
    <section className="bg-white pt-10 text-center text-[#31332c]" id="cara-kerja">
      <div className="relative min-h-[260px] overflow-hidden md:min-h-[300px]">
        <Image
          src="/figma/process-bg.webp"
          alt="Minimal modern kitchen backdrop"
          width={736}
          height={736}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/14 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-9 text-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/80">cara kerja</p>
          <h2 className="mx-auto mt-3 max-w-[620px] font-serif text-[34px] font-medium italic leading-[34px] text-white sm:text-[42px] sm:leading-[40px]">
            Mewujudkan hunian dalam tiga langkah sederhana
          </h2>
        </div>
        <div className="absolute inset-x-0 bottom-4 z-10 md:bottom-5">
          <div className="mx-auto grid max-w-[1180px] grid-cols-3 gap-8 px-6">
            {steps.map((step) => (
              <div key={step.number} className="flex justify-center">
                <div className="grid h-[68px] w-[68px] place-items-center rounded-lg bg-white shadow-sm sm:h-[74px] sm:w-[74px]">
                  <span className="font-serif text-xl italic text-[#6b5b52]">{step.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1180px] gap-8 bg-white px-6 pb-10 pt-5 md:grid-cols-3 md:gap-8">
        {steps.map((step) => (
          <article key={step.title} className="mx-auto flex min-h-[132px] w-full max-w-[330px] flex-col items-center text-center">
            <h3 className="font-serif text-lg italic leading-6 text-[#31332C]">{step.title}</h3>
            <p className="mt-5 max-w-[310px] font-sans text-[13px] leading-[22px] text-[#797C73]">{step.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
