import Image from "next/image";
import { steps } from "@/lib/home-content";

export function ProcessSection() {
  return (
    <section
      id="cara-kerja"
      className="bg-white pb-20 pt-20 text-center text-[#31332c] md:pb-20 md:pt-20"
    >
      <div className="relative min-h-[380px] overflow-hidden md:min-h-[460px]">
        <Image
          src="/figma/process-bg.webp"
          alt="Warm family room backdrop"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570945/kitcen_set_rw5fsv.png')",
          }}
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-center px-6 pb-32 pt-24 md:pb-40 md:pt-32">
          <p className="animate-[fadeUp_700ms_ease-out_both] font-sans text-[15px] uppercase tracking-[0.4em] text-white/90">
            Cara Kerja
          </p>

          <h2 className="mt-4 max-w-[700px] animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[32px] font-medium italic leading-[1.2] text-white sm:text-[42px]">
            Mewujudkan hunian dalam tiga langkah sederhana
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-6">
        <div className="relative z-20 -mt-24 grid gap-6 md:-mt-32 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="group flex h-full flex-col items-center bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] sm:px-8"
              style={{
                animation: `fadeUp 700ms ease-out ${index * 140 + 250}ms both`,
              }}
            >
              <div className="grid h-16 w-16 place-items-center bg-[#fcfbf9] shadow-inner ring-1 ring-[#e6e4de] transition-transform duration-500 group-hover:scale-110">
                <span className="font-serif text-xl italic text-[#6b5b52]">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-[19px] italic leading-snug text-[#31332C]">
                {step.title}
              </h3>

              <p className="mt-4 font-sans text-[14px] leading-[1.7] text-[#797C73]">
                {step.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}