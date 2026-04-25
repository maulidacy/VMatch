import { AnimateIn } from "@/components/home/animate-in";
import { IconMark } from "@/components/home/icon-mark";
import { features } from "@/lib/home-content";

export function BenefitsSection() {
  return (
    <section className="bg-[#FCFBF9] pb-12 text-center md:pb-16">
      <div className="mx-auto max-w-[1180px] px-6">
        <AnimateIn delay={0.1}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">
            Why choose VMatch
          </p>
          <h2 className="mx-auto mt-3 max-w-[560px] font-serif text-[31px] font-medium leading-[36px] text-[#31332C] sm:text-[40px] sm:leading-[45px]">
            Proyek interior lebih rapi, jelas, dan terukur.
          </h2>
        </AnimateIn>

        <div className="mt-9 grid grid-cols-1 gap-y-8 border-t border-[#DED6CA] pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {features.map((feature, index) => (
            <AnimateIn
              key={feature.title}
              delay={0.18 + index * 0.08}
              direction="up"
              as="article"
              className={`px-5 ${index > 0 ? "lg:border-l lg:border-[#DED6CA]" : ""}`}
            >
              <div className="mx-auto grid h-11 w-11 place-items-center text-[#6B5B52]">
                <IconMark type={feature.icon} />
              </div>
              <h3 className="mx-auto mt-4 max-w-[210px] font-sans text-[13px] font-bold uppercase leading-5 tracking-[0.06em] text-[#31332C]">
                {feature.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[235px] font-sans text-[13px] leading-[22px] text-[#797C73]">{feature.copy}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
