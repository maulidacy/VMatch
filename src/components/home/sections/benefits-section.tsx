import Image from "next/image";

import { IconMark } from "@/components/home/icon-mark";
import { features } from "@/lib/home-content";

export function BenefitsSection() {
  return (
    <section className="overflow-hidden bg-white pt-6 pb-12 md:pt-8 md:pb-14">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10">
          <p className="animate-[fadeUp_700ms_ease-out_both] text-[15px] uppercase tracking-[0.28em] text-[#6b5b52]">
            Keunggulan Kami
          </p>

          <h2 className="mt-4 max-w-[520px] animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[38px] leading-tight text-[#31332c] sm:text-5xl">
            Kenapa memilih kami
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="group bg-[#6b5b52] px-6 py-7 text-center shadow-[0_12px_30px_rgba(49,51,44,0.14)] transition-all duration-500 hover:-translate-y-2 hover:bg-[#5a4a42] hover:shadow-[0_22px_50px_rgba(49,51,44,0.22)]"
                style={{
                  animation: `fadeUp 700ms ease-out ${index * 120 + 200}ms both`,
                }}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
                  <IconMark type={feature.icon} className="text-white" />
                </div>

                <h3 className="mx-auto mt-5 max-w-[230px] font-sans text-[15px] font-bold leading-6 text-white">
                  {feature.title}
                </h3>

                <p className="mx-auto mt-3 max-w-[235px] font-sans text-[13px] leading-6 text-white/75">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.10)] sm:min-h-[420px] lg:min-h-[500px]">
          <Image
            src="https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777571462/Kitchen_set_hpzioo.png"
            alt="Kitchen detail with warm cabinetry"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-[center_31%] transition-transform duration-700 hover:scale-105"
          />

          <div className="absolute inset-0 bg-[#2f241d]/25" />

          <div className="absolute bottom-6 left-6 right-6 bg-white/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] backdrop-blur-md sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#6b5b52]">
              Solusi Terarah
            </p>

            <p className="mt-3 font-serif text-[22px] italic leading-8 text-[#31332c] sm:text-[26px]">
              Semua proses dibuat lebih rapi, terukur, dan mudah dipahami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}