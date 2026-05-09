import { AnimateIn } from "@/components/home/animate-in";

const designServices = [
  {
    number: "01",
    icon: "consultation",
    title: "Konsultasi Desain",
    copy: "Sampaikan kebutuhan interior, referensi desain, ukuran ruang, dan preferensi awal dengan mudah.",
  },
  {
    number: "02",
    icon: "planning",
    title: "Konsep & Tata Ruang",
    copy: "Kami membantu menyusun konsep visual, moodboard, layout, dan alur fungsi ruang yang lebih nyaman.",
  },
  {
    number: "03",
    icon: "monitoring",
    title: "Pemilihan Material",
    copy: "Kami membantu memilih warna, tekstur, finishing, dan material yang sesuai dengan konsep desain.",
  },
  {
    number: "04",
    icon: "realization",
    title: "Arahan Visual Akhir",
    copy: "Detail desain dirapikan agar hasil akhir lebih selaras, estetik, dan siap menjadi acuan pengerjaan.",
  },
] as const;

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-[#191A17] py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="mx-auto max-w-[780px] text-center">
          <AnimateIn direction="up" duration={0.65}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/65">
              Layanan Kami
            </p>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.1} duration={0.7}>
            <h2 className="mt-3 font-serif text-[34px] leading-tight text-white sm:text-[44px] md:text-[52px]">
              Layanan desain interior untuk ruang yang lebih tertata
            </h2>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.18} duration={0.7}>
            <p className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-white/65">
              Kami membantu merancang konsep interior, pemilihan material,
              penataan ruang, hingga arahan visual agar hasil akhir lebih rapi,
              fungsional, dan sesuai karakter hunian Anda.
            </p>
          </AnimateIn>
        </div>

        <div className="relative mt-14 md:mt-20">
          <div className="absolute left-8 top-0 h-full w-px bg-white/18 md:left-0 md:right-0 md:top-[34px] md:mx-auto md:h-px md:w-full" />

          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {designServices.map((service, index) => (
              <AnimateIn
                key={service.number}
                direction="up"
                delay={index * 0.12}
                duration={0.7}
                once={true}
              >
                <article className="relative flex gap-5 pl-20 text-left md:block md:pl-0 md:text-center">
                  <div className="absolute left-0 top-0 z-10 grid h-16 w-16 place-items-center rounded-full bg-[#7a6a42] text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] ring-8 ring-[#191A17] md:relative md:left-auto md:top-auto md:mx-auto">
                    <ServiceIcon type={service.icon} />
                  </div>

                  <div className="pt-1 md:pt-7">
                    <span className="font-serif text-[15px] italic text-[#d8c79a]">
                      {service.number}
                    </span>

                    <h3 className="mt-2 font-serif text-[22px] italic leading-snug text-white md:text-[23px]">
                      {service.title}
                    </h3>

                    <p className="mt-4 max-w-[280px] text-[14px] leading-7 text-white/62 md:mx-auto md:text-[13px]">
                      {service.copy}
                    </p>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>

        <AnimateIn direction="up" delay={0.45} duration={0.65}>
          <div className="mt-14 flex justify-center">
            <a
              href="#kontak"
              className="inline-flex items-center justify-center bg-white px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b5b52] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d8c79a] hover:text-white active:scale-95"
            >
              Mulai Konsultasi
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function ServiceIcon({
  type,
}: {
  type: "consultation" | "planning" | "monitoring" | "realization";
}) {
  if (type === "consultation") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M5 6.5h14v9H9l-4 3v-12z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 10h8M8 13h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "planning") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M6 4h12v16H6V4z" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9 8h6M9 12h6M9 16h3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "monitoring") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 5h16v11H4V5z" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9 20h6M12 16v4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M5 12l4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}