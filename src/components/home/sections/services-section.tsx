import { AnimateIn } from "@/components/home/animate-in";
import { services } from "@/lib/home-content";

export function ServicesSection() {
    const title = "Layanan interior terkelola dari perencanaan hingga realisasi";

    return (
        <section className="relative overflow-hidden bg-[#191A17] py-16 text-white md:py-24">
            <div className="relative z-10 mx-auto max-w-[1320px] px-6">

                <div className="relative z-10 mx-auto max-w-[1320px] px-6">
                    <div className="mx-auto max-w-[820px] text-center">
                        <AnimateIn direction="none" duration={0.65}>
                            <p className="animate-[serviceLabel_700ms_ease-out_both] text-[12px] uppercase tracking-[0.32em] text-white/75">
                                LAYANAN KAMI
                            </p>
                        </AnimateIn>

                        <h2 className="mt-5 font-serif text-[36px] leading-tight text-white sm:text-[46px] md:text-[56px]">
                            {title.split(" ").map((word, index) => (
                                <span
                                    key={`${word}-${index}`}
                                    className="inline-block animate-[wordReveal_650ms_cubic-bezier(0.22,1,0.36,1)_both] pr-2"
                                    style={{ animationDelay: `${index * 55 + 120}ms` }}
                                >
                                    {word}
                                </span>
                            ))}
                        </h2>

                        <AnimateIn direction="none" delay={0.45} duration={0.75}>
                            <p className="mx-auto mt-6 max-w-[650px] text-[15px] leading-7 text-white/72 md:text-base">
                                VMATCH membantu customer menjalankan proyek interior secara lebih
                                praktis, terarah, dan mudah dipantau dalam satu alur layanan.
                            </p>
                        </AnimateIn>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {services.map((service, index) => (
                            <AnimateIn
                                key={service.number}
                                delay={0.18 + index * 0.1}
                                duration={0.65}
                                direction={
                                    index === 0
                                        ? "right"
                                        : index === 1
                                            ? "up"
                                            : index === 2
                                                ? "left"
                                                : "none"
                                }
                                className="h-full"
                            >
                                <article className="group h-full rounded-[30px] border border-white/16 bg-white/90 px-7 py-8 text-[#31332c] shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#d7c3b2] hover:bg-white hover:shadow-[0_28px_70px_rgba(0,0,0,0.26)]">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="grid h-13 w-13 place-items-center rounded-full bg-[#6b5b52] text-white transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                            <ServiceIcon type={service.icon} />
                                        </div>

                                        <span className="font-serif text-[24px] italic text-[#6b5b52]/45">
                                            {service.number}
                                        </span>
                                    </div>

                                    <h3 className="mt-8 font-serif text-[25px] italic leading-8 text-[#31332c]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-4 text-[14px] leading-7 text-[#797C73]">
                                        {service.copy}
                                    </p>
                                </article>
                            </AnimateIn>
                        ))}
                    </div>

                    <AnimateIn direction="none" delay={0.65} duration={0.65}>
                        <div className="mt-12 flex justify-center">
                            <a
                                href="#kontak"
                                className="inline-flex items-center justify-center rounded-none border-0 bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#4f433b] shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d7c3b2] hover:text-white active:scale-95"
                            >
                                Mulai Konsultasi
                            </a>
                        </div>
                    </AnimateIn>
                </div>
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