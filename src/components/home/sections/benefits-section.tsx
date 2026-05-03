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

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <AnimateIn
              key={feature.title}
              delay={0.18 + index * 0.08}
              direction="up"
              as="article"
              className="group relative flex flex-col justify-between overflow-hidden bg-white border border-[#DED6CA] p-8 text-left transition-all hover:border-[#6B5B52] hover:shadow-[0_8px_30px_rgb(49,51,44,0.06)]"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCFBF9] text-[#6B5B52] ring-1 ring-[#DED6CA] transition-colors group-hover:bg-[#6B5B52] group-hover:text-white">
                <IconMark type={feature.icon} />
              </div>
              <div>
                <h3 className="font-sans text-[14px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-[#31332C]">
                  {feature.title}
                </h3>
                <p className="mt-4 font-sans text-[13px] leading-[22px] text-[#797C73]">{feature.copy}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
