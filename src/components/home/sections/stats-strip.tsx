import { AnimateIn } from "@/components/home/animate-in";
import { IconMark } from "@/components/home/icon-mark";
import { stats } from "@/lib/home-content";

export function StatsStrip() {
  return (
    <section className="border-b border-[#DED6CA] bg-[#F3F3F3]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 px-6 md:grid-cols-4">
        {stats.map((item, index) => (
          <AnimateIn
            key={item.label}
            delay={0.08 + index * 0.06}
            direction="up"
            className={`border-[#DED6CA] py-6 md:py-7 ${
              index % 2 === 1 ? "border-l pl-5 md:pl-8" : "pr-5 md:border-l md:pl-8 md:pr-0"
            } ${index === 0 ? "md:border-l-0 md:pl-0" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center text-[#6B5B52]">
                <IconMark type={item.icon} />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-[25px] font-medium leading-none text-[#31332C]">{item.value}</p>
                <p className="mt-1 max-w-[150px] font-sans text-[11px] font-medium uppercase leading-[16px] tracking-[0.08em] text-[#797C73]">
                  {item.label}
                </p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
