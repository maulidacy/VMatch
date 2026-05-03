import { AnimateIn } from "@/components/home/animate-in";
import { FillImage } from "@/components/home/fill-image";
import { Navbar } from "@/components/home/navbar";
import { heroThumbs } from "@/lib/home-content";

const heroVideoUrl = "https://res.cloudinary.com/dyhatbrgj/video/upload/v1777021378/interiorvid_frqwr0.mp4";

export function HeroSection() {
  return (
    <section className="relative h-svh min-h-[620px] overflow-hidden bg-[#1c1a16] pt-[72px] text-white" id="beranda">
      <video
        className="absolute inset-x-0 bottom-0 top-[72px] h-[calc(100%-72px)] w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-x-0 bottom-0 top-[72px] bg-gradient-to-t from-black/72 via-black/14 to-transparent" />
      <Navbar />
      <div className="relative z-10 mx-auto flex h-full max-w-[1536px] items-end px-[40px] pb-[72px] max-lg:px-8 max-md:pb-10 max-sm:px-6 lg:px-[60px] xl:px-[100px]">
        <div className="grid min-w-0 w-full items-end gap-10 lg:grid-cols-[600px_1fr]">
          <div className="min-w-0">
            <AnimateIn delay={0.1} direction="up">
              <h1 className="max-w-[340px] font-serif text-[40px] font-semibold italic leading-[38px] tracking-normal sm:max-w-[550px] sm:text-[52px] sm:leading-[48px]">
                Wujudkan Interior Impian Tanpa Ribet
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.3} direction="up">
              <p className="mt-5 max-w-[340px] font-sans text-base font-normal leading-[26px] text-white/90 sm:max-w-[520px] sm:text-[17px] sm:leading-[27px]">
                Cukup kirim kebutuhan Anda, kami siapkan solusi terbaik hingga proyek selesai. Keindahan hunian yang dikurasi secara profesional.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.5} direction="up">
              <div className="mt-8 flex flex-col items-start gap-5 font-sans sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
                <a
                  href="/login"
                  className="inline-flex h-[47px] min-w-[212px] items-center justify-center bg-white px-9 text-[12px] font-medium uppercase tracking-[0.08em] text-[#6b5b52] transition-colors hover:bg-gray-100"
                >
                  MULAI PROYEK ANDA
                </a>
                <a href="#inspirasi" className="border-b border-white/25 pb-1 text-[12px] font-medium uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-white hover:border-white">
                  Lihat Inspirasi
                </a>
              </div>
            </AnimateIn>
          </div>
          <div className="hidden justify-end gap-1.5 lg:flex">
            {heroThumbs.map((image, index) => (
              <AnimateIn key={image.src} delay={0.6 + index * 0.15} direction="left">
                <div className="relative h-[140px] w-[132px] overflow-hidden bg-white/10">
                  <FillImage image={image} sizes="132px" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}