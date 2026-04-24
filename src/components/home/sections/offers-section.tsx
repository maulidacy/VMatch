import { AnimateIn } from "@/components/home/animate-in";
import { FillImage } from "@/components/home/fill-image";
import { offers } from "@/lib/home-content";

export function OffersSection() {
  return (
    <section className="bg-white pb-[50px] pt-10">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-5 px-6 lg:h-[579px] lg:grid-cols-[464px_1fr] lg:grid-rows-2">
        {offers.map((offer, index) => {
          const isPrimary = index === 0;

          return (
            <AnimateIn key={offer.title} delay={0.1 + index * 0.15} direction="up" className={`relative min-h-[278px] overflow-hidden text-white group ${offer.className ?? ""}`}>
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                <FillImage image={offer.image} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-transparent" />
              <div className={isPrimary ? "absolute inset-x-8 bottom-8 sm:inset-x-10 sm:bottom-10" : "absolute inset-x-8 bottom-7 sm:inset-x-10"}>
                <p className={isPrimary ? "max-w-[330px] font-sans text-[22px] leading-[25px]" : "font-sans text-[18px] leading-6"}>
                  {offer.eyebrow}
                </p>
                <h3
                  className={
                    isPrimary
                      ? "mt-2 max-w-[360px] font-serif text-[42px] font-semibold leading-[42px]"
                      : "mt-2 max-w-[430px] font-serif text-[38px] font-semibold leading-[38px]"
                  }
                >
                  {offer.title}
                </h3>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}