import Image from "next/image";
import { AnimateIn } from "@/components/home/animate-in";

const philosophyPoints = [
  "Satu jalur komunikasi untuk seluruh kebutuhan proyek.",
  "Material dan pengerjaan dikurasi sesuai standar kualitas.",
  "Biaya lebih efisien melalui jaringan vendor terpercaya.",
];

export function PhilosophySection() {
  return (
    <section
      id="tentang"
      className="overflow-hidden bg-white py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <AnimateIn
          direction="right"
          duration={0.75}
          className="relative order-2 flex min-h-[340px] items-center justify-center lg:order-1 lg:min-h-[540px]"
        >
          <div className="absolute h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,236,210,0.78)_0%,rgba(181,140,105,0.34)_36%,rgba(107,91,82,0.12)_58%,transparent_74%)] blur-2xl md:h-[540px] md:w-[540px]" />
          <div className="absolute h-[230px] w-[230px] rounded-full bg-white/80 blur-3xl md:h-[360px] md:w-[360px]" />

          <div className="absolute left-6 top-8 hidden rounded-full border border-[#DED6CA] bg-white/80 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#6b5b52] shadow-[0_14px_34px_rgba(49,51,44,0.08)] backdrop-blur-md md:block">
            Managed Service
          </div>

          <div className="absolute bottom-8 right-6 hidden max-w-[230px] rounded-[24px] bg-[#6b5b52] p-5 text-white shadow-[0_18px_45px_rgba(107,91,82,0.24)] md:block">
            <p className="text-[11px] tracking-[0.22em] text-white/65">
              VMatch
            </p>
            <p className="mt-2 font-serif text-[22px] italic leading-7">
              Interior lebih terarah dalam satu alur.
            </p>
          </div>

          <Image
            src="https://res.cloudinary.com/dxdb3dj8f/image/upload/v1778313074/vmatch_kp6qqo.png"
            alt="Logo VMatch"
            width={1024}
            height={1024}
            sizes="(min-width: 1024px) 520px, 80vw"
            className="relative z-10 max-h-[300px] w-full max-w-[360px] animate-[floatSoft_6s_ease-in-out_infinite] object-contain md:max-h-[430px] md:max-w-[500px]"
          />
        </AnimateIn>

        <div className="order-1 lg:order-2">
          <AnimateIn direction="left" duration={0.65}>
            <p className="font-sans text-[12px] uppercase tracking-[0.32em] text-[#6b5b52]">
              Tentang Kami
            </p>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.08} duration={0.75}>
            <h2 className="mt-5 max-w-[720px] font-serif text-[34px] leading-tight text-[#31332c] sm:text-[44px] lg:text-[52px]">
              Kami bukan sekadar perantara, kami adalah partner eksekusi Anda.
            </h2>
          </AnimateIn>

          <AnimateIn direction="none" delay={0.18} duration={0.75}>
            <p className="mt-6 max-w-[680px] font-sans text-[16px] leading-8 text-[#5e6058] md:text-lg">
              VMatch hadir untuk membantu pemilik rumah mewujudkan interior yang
              rapi, fungsional, dan sesuai kebutuhan. Kami menghubungkan ide,
              material, vendor, dan proses kerja dalam satu alur yang lebih jelas.
            </p>
          </AnimateIn>

          <div className="mt-9 grid gap-4">
            {philosophyPoints.map((item, index) => (
              <AnimateIn
                key={item}
                delay={0.24 + index * 0.09}
                duration={0.65}
                direction={index === 0 ? "left" : index === 1 ? "up" : "right"}
              >
                <div className="group flex items-start gap-4 rounded-[0px] border border-[#DED6CA] bg-[#FCFBF9] p-4 shadow-[0_10px_28px_rgba(49,51,44,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#6b5b52]/35 hover:shadow-[0_18px_42px_rgba(49,51,44,0.10)]">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6b5b52] text-white shadow-[0_8px_20px_rgba(107,91,82,0.22)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                      <path
                        d="M3.5 8.1l2.7 2.7 6.3-6.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="font-sans text-[15px] leading-7 text-[#31332c] md:text-base">
                    {item}
                  </span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}