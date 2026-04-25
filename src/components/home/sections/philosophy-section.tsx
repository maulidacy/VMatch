import Image from "next/image";

const philosophyPoints = [
  "Satu jalur komunikasi untuk seluruh kebutuhan proyek.",
  "Material dan pengerjaan dikurasi sesuai standar kualitas.",
  "Biaya lebih efisien melalui jaringan vendor terpercaya.",
];

export function PhilosophySection() {
  return (
    <section id="tentang" className="overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative order-2 flex min-h-[320px] items-center justify-center lg:order-1 lg:min-h-[520px]">
          <div className="absolute h-[320px] w-[320px] animate-[glowPulse_5s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,236,210,0.75)_0%,rgba(181,140,105,0.35)_35%,rgba(107,91,82,0.12)_58%,transparent_72%)] blur-2xl md:h-[520px] md:w-[520px]" />

          <div className="absolute h-[240px] w-[240px] rounded-full bg-white/70 blur-3xl md:h-[360px] md:w-[360px]" />

          <Image
            src="/figma/philosophy-logo.webp"
            alt="Logo VMatch"
            width={1024}
            height={1024}
            sizes="(min-width: 1024px) 520px, 80vw"
            className="relative z-10 max-h-[300px] w-full max-w-[360px] animate-[floatSoft_6s_ease-in-out_infinite] object-contain md:max-h-[430px] md:max-w-[500px]"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="animate-[fadeUp_700ms_ease-out_both] font-sans text-[15px] uppercase tracking-[0.32em] text-[#6b5b52]">
            Filosofi Kami
          </p>

          <h2 className="mt-5 max-w-[720px] animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[34px] leading-tight text-[#31332c] sm:text-[44px] lg:text-[52px]">
            Kami bukan sekadar perantara, kami adalah partner eksekusi Anda.
          </h2>

          <p className="mt-6 max-w-[680px] animate-[fadeUp_800ms_ease-out_220ms_both] font-sans text-[16px] leading-8 text-[#5e6058] md:text-lg">
            VMatch hadir untuk membantu pemilik rumah mewujudkan interior yang
            rapi, fungsional, dan sesuai kebutuhan. Kami menghubungkan ide,
            material, vendor, dan proses kerja dalam satu alur yang lebih jelas.
          </p>

          <ul className="mt-9 space-y-4 font-sans text-[15px] text-[#31332c] md:text-base">
            {philosophyPoints.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-4"
                style={{
                  animation: `fadeUp 700ms ease-out ${index * 120 + 320}ms both`,
                }}
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#6b5b52] text-white shadow-[0_8px_20px_rgba(107,91,82,0.22)]"
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

                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}