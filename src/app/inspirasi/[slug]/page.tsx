import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimateIn } from "@/components/home/animate-in";
import { BackLink } from "@/components/home/back-link";
import { ScrollToTopOnMount } from "@/components/home/scroll-to-top-on-mount";
import { inspirations } from "@/lib/home-content";

type InspirationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getInspirationCategory(slug: string) {
  return inspirations.find((category) => category.slug === slug);
}

export function generateStaticParams() {
  return inspirations.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: InspirationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getInspirationCategory(slug);

  if (!category) {
    return {};
  }

  return {
    title: `Inspirasi ${category.title}`,
    description: `${category.copy} Lihat referensi ruang dan layanan interior dari VMatch.`,
    alternates: {
      canonical: `/inspirasi/${category.slug}`,
    },
    openGraph: {
      title: `Inspirasi ${category.title} | VMatch Interior`,
      description: category.copy,
      images: [
        {
          url: category.image.src,
          width: category.image.width,
          height: category.image.height,
          alt: category.image.alt,
        },
      ],
    },
  };
}

export default async function InspirationDetailPage({ params }: InspirationPageProps) {
  const { slug } = await params;
  const category = getInspirationCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#31332C]">
      <ScrollToTopOnMount />
      
      <header className="border-b border-[#E7E1D8] bg-white">
        <nav className="mx-auto flex min-h-[72px] max-w-[1180px] items-center justify-between gap-6 px-6 font-sans">
          <Link href="/" className="font-serif text-[26px] font-medium italic leading-none text-[#31332C]">
            VMatch
          </Link>
          <div className="flex items-center gap-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]">
            <BackLink className="hidden cursor-pointer bg-transparent p-0 font-inherit text-inherit transition-colors hover:text-[#31332C] sm:inline-flex">
              Kembali ke inspirasi
            </BackLink>
            <Link
              href="/#kontak"
              className="inline-flex h-10 items-center justify-center bg-[#6B5B52] px-5 text-white transition-colors hover:bg-[#5B4C44]"
            >
              Konsultasi
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#1c1a16] text-white">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1180px] flex-col justify-end px-6 pb-20">
          <AnimateIn delay={0.1}>
            <p className="font-sans text-[12px] uppercase tracking-[0.4em] text-white/80">Inspirasi Interior</p>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <h1 className="mt-4 font-serif text-[56px] font-medium italic leading-[1.1] text-white sm:text-[72px]">
              {category.title}
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <p className="mt-6 max-w-[600px] font-sans text-[18px] leading-[1.6] text-white/90">
              {category.copy}
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="border-y border-[#DED6CA] bg-[#FBFAF7]">
        <div className="mx-auto max-w-[1180px] px-6 py-8">
          <AnimateIn delay={0.1} direction="up">
            <div className="grid grid-cols-1 gap-6 font-sans text-sm leading-6 text-[#5E6058] md:grid-cols-3">
              <p>Setiap ruang dirancang berdasarkan fungsi, kebiasaan pengguna, dan target suasana visual.</p>
              <p>VMatch membantu menghubungkan konsep desain dengan vendor, material, produksi, dan instalasi.</p>
              <p>Detail layanan bisa disesuaikan dengan ukuran ruang, budget, dan prioritas pengerjaan.</p>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-14 lg:py-16">
        <AnimateIn delay={0.1}>
          <div className="flex flex-col justify-between gap-4 border-b border-[#DED6CA] pb-7 md:flex-row md:items-end">
            <div>
              <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-[#6B5B52]">Detail ruang</p>
              <h2 className="mt-4 font-serif text-[38px] leading-[40px] text-[#31332C] sm:text-[48px] sm:leading-[48px]">
                Area yang bisa kami bantu
              </h2>
            </div>
            <p className="max-w-[420px] font-sans text-sm leading-6 text-[#797C73]">
              Pilih area yang ingin dirapikan, lalu kami bantu susun kebutuhan desain, produksi, dan pemasangannya.
            </p>
          </div>
        </AnimateIn>

        {/* 2 Rows Grid Setup */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {category.areas.map((area, index) => (
            <AnimateIn key={area.title} delay={0.2 + index * 0.1} direction="up" className="h-full">
              <article className="group flex h-full flex-col border border-[#DED6CA] bg-white shadow-sm transition-shadow hover:shadow-xl">
                <div className="relative h-[240px] w-full overflow-hidden border-b border-[#DED6CA] bg-[#F3F3F3] sm:h-[300px]">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src={area.image.src}
                      alt={area.image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <h3 className="font-serif text-[28px] leading-9 text-[#31332C]">{area.title}</h3>
                    <p className="mt-4 font-sans text-sm leading-6 text-[#5E6058]">{area.description}</p>
                  </div>
                  <div className="mt-8 border-t border-[#DED6CA] pt-5">
                    <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#6B5B52]">Layanan Termasuk</p>
                    <ul className="grid gap-3 font-sans text-[13px] leading-5 text-[#5E6058]">
                      {area.services.map((service) => (
                         <li key={service} className="flex items-start gap-3">
                           <span className="mt-2 h-[1px] w-4 shrink-0 bg-[#6B5B52]" aria-hidden="true" />
                           <span>{service}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section className="bg-[#6B5B52] text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <AnimateIn delay={0.1} direction="left">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/70">Mulai dari kebutuhan ruang</p>
              <h2 className="mt-3 max-w-[560px] font-serif text-[36px] leading-[38px]">
                Ceritakan ruang yang ingin Anda rapikan, kami bantu susun langkahnya.
              </h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.2} direction="right">
            <Link
              href="/#kontak"
              className="inline-flex h-12 w-fit items-center justify-center bg-white px-7 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52] transition-colors hover:bg-[#F3F3F3]"
            >
              Konsultasi proyek
            </Link>
          </AnimateIn>
        </div>
      </section>
    </main>
  );
}
