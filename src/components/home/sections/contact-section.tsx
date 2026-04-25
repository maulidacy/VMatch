import Image from "next/image";

import { AnimateIn } from "@/components/home/animate-in";
import { contactInfo } from "@/lib/home-content";

export function ContactSection() {
  return (
    <section className="bg-[#FCFBF9]" id="kontak">
      <div className="relative min-h-[210px] overflow-hidden bg-[#31332C]">
        <Image
          src="/inspirations/rumah-ruang-keluarga.webp"
          alt="Warm family room interior"
          width={1200}
          height={900}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#191A17]/60" />
        <div className="relative mx-auto flex min-h-[210px] max-w-[1180px] flex-col justify-center gap-6 px-6 py-10 text-[#F5EFE5] md:flex-row md:items-center md:justify-between">
          <AnimateIn delay={0.1}>
            <h2 className="max-w-[560px] font-serif text-[32px] font-medium leading-[38px] sm:text-[43px] sm:leading-[48px]">
              Mari wujudkan ruang yang rapi, indah, dan siap dipakai.
            </h2>
            <p className="mt-3 max-w-[520px] font-sans text-[14px] leading-6 text-[#F5EFE5]/82">
              Ceritakan kebutuhan rumah, apartment, hotel, atau kos Anda. Tim kami akan bantu susun langkah awalnya.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} direction="left">
            <a
              href="https://wa.me/6281234567890"
              className="inline-flex h-11 shrink-0 items-center justify-center bg-[#F5EFE5] px-7 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52] transition-colors hover:bg-white"
            >
              Book consultation
            </a>
          </AnimateIn>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-14">
        <AnimateIn delay={0.1}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">Contact us</p>
          <h2 className="mt-3 max-w-[440px] font-serif text-[31px] font-medium leading-[36px] text-[#31332C] sm:text-[40px] sm:leading-[45px]">
            Kami siap mendengar kebutuhan proyek Anda.
          </h2>
          <div className="mt-8 grid gap-4 font-sans text-[14px] leading-6 text-[#5E6058]">
            <ContactLine label="Address" value={contactInfo.address} />
            <ContactLine label="Phone" value={contactInfo.phone} href="https://wa.me/6281234567890" />
            <ContactLine label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
            <ContactLine label="Hours" value={contactInfo.hours} />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.18} direction="left">
          <div className="overflow-hidden border border-[#DED6CA] bg-white">
            <iframe
              title="Google Maps lokasi UDINUS Semarang"
              src="https://www.google.com/maps?q=Universitas%20Dian%20Nuswantoro%20Semarang&output=embed"
              className="h-[360px] w-full border-0 md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B5B52]">{label}</span>
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
