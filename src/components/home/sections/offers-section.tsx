import Link from "next/link";
import { FillImage } from "@/components/home/fill-image";
import { offers } from "@/lib/home-content";

export function OffersSection() {
  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="mb-10">
          <p className="animate-[fadeUp_700ms_ease-out_both] text-[15px] uppercase tracking-[0.28em] text-[#6b5b52]">
            Penawaran Spesial
          </p>

          <h2 className="mt-4 max-w-[620px] animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[38px] leading-tight text-[#31332c] md:text-5xl">
            Promo interior pilihan untuk hunian Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:min-h-[620px] lg:grid-cols-[0.95fr_1.35fr] lg:grid-rows-2">
          {offers.map((offer, index) => {
            const isPrimary = index === 0;

            return (
              <article
                key={offer.title}
                className={`group relative min-h-[330px] overflow-hidden bg-[#2f241d] text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.22)] ${
                  isPrimary ? "lg:row-span-2 lg:min-h-[620px]" : "lg:min-h-0"
                } ${offer.className ?? ""}`}
                style={{
                  animation: `fadeUp 750ms ease-out ${index * 130}ms both`,
                }}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <FillImage image={offer.image} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/34 to-black/5" />
                <div className="absolute inset-0 bg-[#6b5b52]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div
                  className={
                    isPrimary
                      ? "absolute inset-x-7 bottom-7 sm:inset-x-10 sm:bottom-10"
                      : "absolute inset-x-7 bottom-7 sm:inset-x-10"
                  }
                >
                  <p
                    className={
                      isPrimary
                        ? "max-w-[360px] font-sans text-[20px] leading-7 text-white/92 md:text-[24px]"
                        : "font-sans text-[17px] leading-6 text-white/92 md:text-[20px]"
                    }
                  >
                    {offer.eyebrow}
                  </p>

                  <h3
                    className={
                      isPrimary
                        ? "mt-3 max-w-[470px] font-serif text-[44px] font-semibold leading-[0.95] md:text-[62px]"
                        : "mt-3 max-w-[560px] font-serif text-[36px] font-semibold leading-[1] md:text-[52px]"
                    }
                  >
                    {offer.title}
                  </h3>

                  <Link
                    href="#kontak"
                    className="mt-7 inline-flex min-h-12 max-w-full items-center justify-center bg-white px-6 py-3 font-sans text-[16px] font-medium text-[#4e453f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3eee9] active:scale-95 sm:px-8 md:text-[20px]"
                  >
                    Konsultasi GRATIS sekarang!
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}