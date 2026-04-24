import { Arrow } from "@/components/home/arrow";
import { FillImage } from "@/components/home/fill-image";
import { SectionHeading } from "@/components/home/section-heading";
import { inspirations } from "@/lib/home-content";

export function InspirationSection() {
  return (
    <section className="bg-white py-[50px]" id="inspirasi">
      <SectionHeading eyebrow="kategori inspirasi" title="Temukan Inspirasi Interior" />
      <div className="mx-auto mt-[67px] grid max-w-[1170px] grid-cols-1 gap-[29px] px-6 md:grid-cols-3">
        {inspirations.map((item) => (
          <article key={item.title} className="group relative h-[486px] overflow-hidden rounded-[15px] bg-[#332d28]">
            <FillImage image={item.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/14 to-transparent" />
            <div className="absolute bottom-7 left-8 right-8 text-white">
              <h3 className="font-serif text-[32px] leading-10">{item.title}</h3>
              <p className="mt-1 max-w-60 font-sans text-base leading-5 text-white/88">{item.copy}</p>
              <a href="#kontak" className="mt-5 inline-flex items-center gap-2 font-sans text-xl font-medium">
                Lihat Inspirasi <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 flex items-center justify-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-1.5 w-1.5 rounded-full bg-[#6B3E1E]" />
        ))}
      </div>
    </section>
  );
}
