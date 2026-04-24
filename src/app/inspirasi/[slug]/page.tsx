import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

      <section className="mx-auto grid max-w-[1180px] gap-8 px-6 pb-12 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:pb-16 lg:pt-14">
        <div>
          <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-[#6B5B52]">Inspirasi interior</p>
          <h1 className="mt-5 font-serif text-[48px] leading-none text-[#31332C] sm:text-[64px]">
            {category.title}
          </h1>
          <p className="mt-6 max-w-[520px] font-sans text-base leading-7 text-[#5E6058]">{category.copy}</p>
        </div>
        <div className="relative h-[360px] overflow-hidden bg-[#F3F3F3] sm:h-[430px] lg:h-[500px]">
          <Image
            src={category.image.src}
            alt={category.image.alt}
            width={category.image.width}
            height={category.image.height}
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-[#DED6CA] bg-[#FBFAF7]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-6 py-8 font-sans text-sm leading-6 text-[#5E6058] md:grid-cols-3">
          <p>Setiap ruang dirancang berdasarkan fungsi, kebiasaan pengguna, dan target suasana visual.</p>
          <p>VMatch membantu menghubungkan konsep desain dengan vendor, material, produksi, dan instalasi.</p>
          <p>Detail layanan bisa disesuaikan dengan ukuran ruang, budget, dan prioritas pengerjaan.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-14 lg:py-16">
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

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {category.areas.map((area) => (
            <article key={area.title} className="grid gap-5 border-b border-[#DED6CA] pb-8 sm:grid-cols-[220px_1fr]">
              <div className="relative h-[240px] overflow-hidden bg-[#F3F3F3] sm:h-full sm:min-h-[260px]">
                <Image
                  src={area.image.src}
                  alt={area.image.alt}
                  width={area.image.width}
                  height={area.image.height}
                  sizes="(min-width: 1024px) 220px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-h-[260px] flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[30px] leading-9 text-[#31332C]">{area.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-6 text-[#5E6058]">{area.description}</p>
                </div>
                <ul className="mt-6 grid gap-2 font-sans text-[13px] leading-5 text-[#6B5B52]">
                  {area.services.map((service) => (
                    <li key={service} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-[#6B5B52]" aria-hidden="true" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#6B5B52] text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/70">Mulai dari kebutuhan ruang</p>
            <h2 className="mt-3 max-w-[560px] font-serif text-[36px] leading-[38px]">
              Ceritakan ruang yang ingin Anda rapikan, kami bantu susun langkahnya.
            </h2>
          </div>
          <Link
            href="/#kontak"
            className="inline-flex h-12 w-fit items-center justify-center bg-white px-7 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B5B52]"
          >
            Konsultasi proyek
          </Link>
        </div>
      </section>
    </main>
  );
}
