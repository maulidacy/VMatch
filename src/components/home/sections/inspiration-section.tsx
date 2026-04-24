import Link from "next/link";

import { Arrow } from "@/components/home/arrow";
import { FillImage } from "@/components/home/fill-image";
import { SectionHeading } from "@/components/home/section-heading";
import { inspirations } from "@/lib/home-content";

export function InspirationSection() {
  return (
    <section className="bg-white py-[50px]" id="inspirasi">
      <SectionHeading eyebrow="kategori inspirasi" title="Temukan Inspirasi Interior" />
      <div className="mx-auto mt-[58px] grid max-w-[1170px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {inspirations.map((item) => (
          <Link
            key={item.slug}
            href={`/inspirasi/${item.slug}`}
            scroll
            className="group relative block h-[430px] overflow-hidden bg-[#332d28] outline-none focus-visible:ring-2 focus-visible:ring-[#6B5B52] focus-visible:ring-offset-4"
          >
            <FillImage image={item.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/18 to-transparent transition-colors group-hover:from-black/82" />
            <div className="absolute bottom-7 left-8 right-8 text-white">
              <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/72">
                {item.areas.length} area detail
              </p>
              <h3 className="mt-3 font-serif text-[32px] leading-9">{item.title}</h3>
              <p className="mt-3 max-w-60 font-sans text-sm leading-5 text-white/88">{item.copy}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.13em]">
                Lihat Inspirasi <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
