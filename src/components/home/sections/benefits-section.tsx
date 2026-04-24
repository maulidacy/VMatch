import Image from "next/image";

import { IconMark } from "@/components/home/icon-mark";
import { features } from "@/lib/home-content";

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-[72px] lg:min-h-[570px] lg:py-11">
      <div className="absolute bottom-8 right-0 top-11 hidden w-[60vw] overflow-hidden lg:block">
        <Image
          src="/figma/benefits-kitchen.webp"
          alt="Kitchen detail with warm cabinetry"
          width={736}
          height={1030}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="h-full w-full object-cover object-[center_31%]"
        />
        <div className="absolute inset-0 bg-[#2f241d]/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 lg:h-[482px]">
        <h2 className="font-serif text-[38px] leading-none text-[#31332c] sm:text-5xl lg:absolute lg:left-6 lg:top-7 lg:text-[34px]">
          Kenapa memilih kami
        </h2>

        <div className="relative mt-9 h-[360px] overflow-hidden sm:h-[470px] lg:hidden">
          <Image
            src="/figma/benefits-kitchen.webp"
            alt="Kitchen detail with warm cabinetry"
            width={736}
            height={1030}
            sizes="100vw"
            className="h-full w-full object-cover object-[center_31%]"
          />
          <div className="absolute inset-0 bg-[#2f241d]/30" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:absolute lg:left-6 lg:top-[102px] lg:mt-0 lg:w-[525px] lg:grid-cols-[255px_255px] lg:gap-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="min-h-[136px] bg-[#F3F3F3] px-6 py-5 text-center shadow-[0_8px_24px_rgba(49,51,44,0.05)]"
            >
              <div className="mx-auto grid h-7 w-7 place-items-center">
                <IconMark type={feature.icon} />
              </div>
              <h3 className="mx-auto mt-3 max-w-[210px] font-sans text-[13px] font-bold leading-5 text-[#31332C]">
                {feature.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[205px] font-sans text-[12px] leading-[18px] text-[#797C73]">{feature.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
