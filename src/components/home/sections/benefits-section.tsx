import Image from "next/image";
import { AnimateIn } from "@/components/home/animate-in";
import { features } from "@/lib/home-content";

export function BenefitsSection() {
  return (
    <section className="overflow-hidden bg-white py-14 md:py-20">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div className="relative z-10">
          <AnimateIn direction="left" duration={0.65}>
            <p className="text-[12px] uppercase tracking-[0.32em] text-[#6b5b52]">
              Keunggulan Kami
            </p>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.08} duration={0.7}>
            <h2 className="mt-4 max-w-[560px] font-serif text-[38px] leading-tight text-[#31332c] sm:text-5xl">
              Kenapa memilih kami
            </h2>
          </AnimateIn>

          <AnimateIn direction="none" delay={0.15} duration={0.7}>
            <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-[#797C73]">
              VMATCH membantu proses interior berjalan lebih praktis, rapi,
              dan terarah tanpa customer harus mencari vendor sendiri.
            </p>
          </AnimateIn>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <AnimateIn
                key={feature.title}
                delay={0.18 + index * 0.09}
                duration={0.65}
                direction={
                  index === 0
                    ? "right"
                    : index === 1
                      ? "up"
                      : index === 2
                        ? "left"
                        : "none"
                }
                className="h-full"
              >
                <article className="group relative h-full overflow-hidden rounded-[26px] bg-[#6b5b52] px-6 py-7 text-center shadow-[0_14px_34px_rgba(49,51,44,0.14)] transition-all duration-500 hover:-translate-y-2 hover:bg-[#58483f] hover:shadow-[0_24px_55px_rgba(49,51,44,0.22)]">
                  <div className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-white/15">
                    <BenefitIcon index={index} />
                  </div>

                  <h3 className="relative z-10 mx-auto mt-5 max-w-[240px] font-sans text-[15px] font-bold leading-6 text-white">
                    {feature.title}
                  </h3>

                  <p className="relative z-10 mx-auto mt-3 max-w-[250px] font-sans text-[13px] leading-6 text-white/76">
                    {feature.copy}
                  </p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>

        <AnimateIn direction="left" delay={0.2} duration={0.75}>
          <div className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-[#eee9e3] shadow-[0_18px_50px_rgba(0,0,0,0.10)] sm:min-h-[430px] lg:min-h-[520px]">
            <Image
              src="https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777571462/Kitchen_set_hpzioo.png"
              alt="Kitchen detail with warm cabinetry"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              unoptimized
              className="object-cover object-[center_31%] transition-transform duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#6b5b52] shadow-md backdrop-blur-md">
              Managed Service
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-[24px] bg-white/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] backdrop-blur-md sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#6b5b52]">
                Solusi Terarah
              </p>

              <p className="mt-3 font-serif text-[22px] italic leading-8 text-[#31332c] sm:text-[26px]">
                Semua proses dibuat lebih rapi, terukur, dan mudah dipahami.
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function BenefitIcon({ index }: { index: number }) {
  const icons = [
    <path
      key="partner"
      d="M7 12h10M9 8h6M6 16h12"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />,
    <path
      key="curated"
      d="M12 4l2.2 5.5L20 12l-5.8 2.5L12 20l-2.2-5.5L4 12l5.8-2.5L12 4z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />,
    <path
      key="structured"
      d="M6 6h12v4H6V6zM6 14h12v4H6v-4z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />,
    <path
      key="transparent"
      d="M5 18V8M10 18V5M15 18v-7M20 18v-4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />,
  ];

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      {icons[index] ?? icons[0]}
    </svg>
  );
}