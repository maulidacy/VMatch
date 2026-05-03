import { AnimateIn } from "@/components/home/animate-in";
import { IconMark } from "@/components/home/icon-mark";
import { steps } from "@/lib/home-content";

export function ProcessSection() {
  return (
    <section className="bg-[#FCFBF9] py-12 text-center text-[#31332C] md:py-16" id="cara-kerja">
      <div className="mx-auto max-w-[1180px] px-6">
        <AnimateIn delay={0.1}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B5B52]">Our process</p>
          <h2 className="mx-auto mt-3 max-w-[520px] font-serif text-[31px] font-medium leading-[36px] text-[#31332C] sm:text-[40px] sm:leading-[45px]">
            Dari konsep sampai ruang siap dipakai.
          </h2>
        </AnimateIn>

        <div className="relative mt-11 grid gap-9 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-[#DED6CA] md:block" />
          {steps.map((step, index) => (
            <AnimateIn
              key={step.number}
              delay={0.18 + index * 0.08}
              direction="up"
              as="article"
              className="relative px-5"
            >
              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#DED6CA] bg-[#6B5B52] text-white shadow-[0_0_0_8px_#FCFBF9]">
                <IconMark type={index === 0 ? "chat" : index === 1 ? "plan" : "build"} />
              </div>
              <p className="mt-5 font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-[#6B5B52]">{step.number}</p>
              <h3 className="mt-3 font-serif text-[21px] font-medium leading-7 text-[#31332C]">{step.title}</h3>
              <p className="mx-auto mt-3 max-w-[270px] font-sans text-[13px] leading-[22px] text-[#797C73]">{step.copy}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
