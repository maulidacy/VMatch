import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { contactInfo } from "@/lib/home-content";

export function ContactSection() {
  return (
    <section className="bg-[#FCFBF9]" id="kontak">
      <div className="relative min-h-[210px] overflow-hidden bg-[#31332C]">
        <Image
          src="/inspirations/rumah-ruang-keluarga.webp"
          alt="Interior ruang keluarga hangat"
          width={1200}
          height={900}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-[#191A17]/60" />

        <div className="relative mx-auto flex min-h-[210px] max-w-[1320px] flex-col justify-center gap-6 px-6 py-10 text-[#F5EFE5] md:flex-row md:items-center md:justify-between">
          <AnimateIn delay={0.1}>
            <h2 className="max-w-[620px] font-serif text-[34px] font-medium leading-tight sm:text-[44px]">
              Mari wujudkan ruang yang rapi, indah, dan siap dipakai.
            </h2>

            <p className="mt-3 max-w-[560px] font-sans text-[15px] leading-7 text-[#F5EFE5]/85">
              Ceritakan kebutuhan rumah, apartemen, hotel, atau kos Anda. Tim
              kami akan membantu menyusun langkah awalnya.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.2} direction="left">
            <a
              href="https://wa.me/6281234567890"
              className="inline-flex h-11 shrink-0 items-center justify-center bg-[#F5EFE5] px-7 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52] transition-colors hover:bg-white"
            >
              Konsultasi Sekarang
            </a>
          </AnimateIn>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-20">
        <AnimateIn delay={0.1}>
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">
            Kontak Kami
          </p>

          <h2 className="mt-4 max-w-[520px] font-serif text-[38px] font-medium leading-tight text-[#31332C] md:text-5xl">
            Kami siap mendengar kebutuhan proyek Anda.
          </h2>

          <div className="mt-9 grid gap-5 font-sans text-[15px] leading-7 text-[#5E6058]">
            <ContactLine label="Alamat" value={contactInfo.address} />
            <ContactLine
              label="Telepon"
              value={contactInfo.phone}
              href="https://wa.me/6281234567890"
            />
            <ContactLine
              label="Email"
              value={contactInfo.email}
              href={`mailto:${contactInfo.email}`}
            />
            <ContactLine label="Jam Operasional" value={contactInfo.hours} />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.18} direction="left">
          <div className="overflow-hidden border border-[#DED6CA] bg-white">
            <iframe
              title="Google Maps lokasi UDINUS Semarang"
              src="https://www.google.com/maps?q=Universitas%20Dian%20Nuswantoro%20Semarang&output=embed"
              className="h-[360px] w-full border-0 md:h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function ContactLine({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">
        {label}
      </span>
      <span className="mt-1 block text-[#31332C]">{value}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="block transition-colors hover:text-[#6B5B52]">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}