import { FillImage } from "@/components/home/fill-image";
import { Navbar } from "@/components/home/navbar";
import { heroThumbs } from "@/lib/home-content";

const heroVideoUrl =
  "https://res.cloudinary.com/dyhatbrgj/video/upload/v1777021378/interiorvid_frqwr0.mp4";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative h-svh min-h-[680px] overflow-hidden bg-[#1c1a16] text-white"
    >
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.16),transparent_34%)]" />

      <Navbar />

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] items-end px-6 pb-12 pt-[120px] sm:pb-16 md:px-12 lg:pb-20">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[620px_1fr]">
          <div className="animate-[fadeUp_800ms_ease-out_150ms_both]">
            <p className="mb-4 text-[15px] uppercase tracking-[0.32em] text-white/75">
              Interior Custom & Furniture
            </p>

            <h1 className="max-w-[620px] font-serif text-[44px] font-semibold italic leading-[0.95] tracking-normal sm:text-[58px] lg:text-[68px]">
              Wujudkan Interior Impian Tanpa Ribet
            </h1>

            <p className="mt-6 max-w-[540px] font-sans text-[15px] leading-7 text-white/85 sm:text-[17px]">
              Cukup kirim kebutuhan Anda, kami siapkan solusi terbaik hingga
              proyek selesai. Keindahan hunian yang dikurasi secara profesional.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 font-sans sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
              <a
                href="#kontak"
                className="group inline-flex h-[50px] min-w-[220px] items-center justify-center bg-white px-9 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b5b52] shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f3eee9] active:scale-95"
              >
                Mulai Proyek Anda
              </a>

              <a
                href="#inspirasi"
                className="group inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-all duration-300 hover:border-white hover:text-white active:scale-95"
              >
                Lihat Inspirasi

                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="flex items-end gap-2 animate-[fadeUp_900ms_ease-out_420ms_both]">
              {heroThumbs.map((image, index) => (
                <a
                  key={image.src}
                  href="#inspirasi"
                  className={`group relative overflow-hidden bg-white/10 shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2 ${index === 1
                      ? "h-[170px] w-[158px] border-2 border-white"
                      : "h-[135px] w-[132px]"
                    }`}
                  style={{
                    animation: `fadeUp 700ms ease-out ${index * 120 + 520}ms both`,
                  }}
                >
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <FillImage image={image} sizes="160px" />
                  </div>

                  <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
}