import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Inspirasi", href: "/#inspirasi" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
];

export function PortfolioHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f7f5]">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-12 md:pt-7">
        <nav className="mx-auto flex h-[62px] max-w-[1320px] animate-[fadeDown_700ms_ease-out_both] items-center justify-between bg-[#6b5b52]/95 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md md:h-[64px] md:px-10">
          <Link
            href="/"
            className="font-serif text-xl italic text-white transition duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            VMatch
          </Link>

          <div className="hidden items-center gap-10 text-[12px] uppercase tracking-[0.16em] text-white/85 lg:flex">
            {navItems.map((item) => {
              const isActive = item.label === "Beranda";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-2 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95 ${
                    isActive ? "text-white" : ""
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-white transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <Link
            href="/#kontak"
            className="hidden bg-white px-8 py-3 text-sm text-[#6b5b52] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3eee9] active:scale-95 md:block"
          >
            Konsultasi
          </Link>

          <button
            type="button"
            className="peer flex h-10 w-10 items-center justify-center text-white lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <span className="relative h-4 w-6">
              <span className="absolute left-0 top-0 h-px w-6 bg-white transition-all duration-300 peer-focus:top-2 peer-focus:rotate-45" />
              <span className="absolute left-0 top-2 h-px w-6 bg-white transition-all duration-300 peer-focus:opacity-0" />
              <span className="absolute left-0 top-4 h-px w-6 bg-white transition-all duration-300 peer-focus:top-2 peer-focus:-rotate-45" />
            </span>
          </button>

          <div className="invisible absolute left-4 right-4 top-[76px] translate-y-3 bg-[#6b5b52] p-5 opacity-0 shadow-2xl transition-all duration-300 peer-focus:visible peer-focus:translate-y-0 peer-focus:opacity-100 lg:hidden">
            <div className="flex flex-col gap-4 text-[12px] uppercase tracking-[0.16em] text-white/90">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-all duration-300 hover:translate-x-1 hover:text-white active:scale-95"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/#kontak"
                className="mt-2 bg-white px-5 py-3 text-center text-sm normal-case tracking-normal text-[#6b5b52] transition active:scale-95"
              >
                Konsultasi
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-[49%] animate-[heroImageIn_1s_ease-out_both] lg:block">
          <Image
            src="/figma/project-library.webp"
            alt="Interior ruang keluarga modern dengan panel kayu dan kabinet"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 w-full px-8 pt-[165px] md:px-16 md:pt-[185px] lg:w-[52%]">
          <p className="animate-[fadeUp_700ms_ease-out_150ms_both] text-[10px] uppercase tracking-[0.32em] text-[#8b8179] md:text-[11px]">
            Eksplorasi Katalog
          </p>

          <h1 className="mt-4 max-w-[650px] animate-[fadeUp_800ms_ease-out_250ms_both] font-serif text-[46px] italic leading-[0.98] text-[#31332c] sm:text-[56px] md:text-[68px]">
            Eksplorasi Portofolio Interior
          </h1>

          <p className="mt-7 max-w-[470px] animate-[fadeUp_800ms_ease-out_400ms_both] text-sm leading-7 text-[#6f6a65] md:text-[16px]">
            Temukan berbagai proyek interior yang telah kami tangani sebagai
            inspirasi untuk kebutuhan Anda.
          </p>
        </div>

        <div className="relative z-10 mt-10 h-[360px] w-full animate-[heroImageIn_1s_ease-out_both] lg:hidden">
          <Image
            src="/figma/project-library.webp"
            alt="Interior ruang keluarga modern"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="absolute bottom-[70px] left-6 z-20 hidden items-end animate-[fadeUp_900ms_ease-out_550ms_both] sm:flex md:left-16">
          <Image
            src="/figma/project-loft.webp"
            alt="Interior ruang makan minimalis"
            width={190}
            height={150}
            className="h-[110px] w-[140px] object-cover md:h-[150px] md:w-[190px]"
          />

          <Image
            src="/figma/project-walnut.webp"
            alt="Interior ruang kerja modern"
            width={250}
            height={190}
            className="z-10 -ml-1 h-[145px] w-[190px] border-2 border-white object-cover shadow-xl md:h-[190px] md:w-[250px]"
          />

          <Image
            src="/figma/project-library.webp"
            alt="Interior dapur modern"
            width={190}
            height={150}
            className="-ml-1 h-[110px] w-[140px] object-cover md:h-[150px] md:w-[190px]"
          />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[260px] bg-gradient-to-t from-[#2f332d] via-[#2f332d]/70 to-transparent sm:h-[280px] md:h-[300px] lg:h-[240px]" />
      </div>
    </section>
  );
}