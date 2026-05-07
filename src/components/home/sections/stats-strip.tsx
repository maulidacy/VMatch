"use client";

import { useEffect, useRef, useState } from "react";
import { AnimateIn } from "@/components/home/animate-in";
import { stats } from "@/lib/home-content";

function parseNumber(value: string) {
  const number = Number(value.replace(/\D/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  return { number, suffix };
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const { number, suffix } = parseNumber(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasStarted(true);

        let start = 0;
        const duration = 900;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          start = Math.round(number * eased);
          setCount(start);

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted, number]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="border-y border-[#DED6CA] bg-[#F3F3F3]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-6 md:grid-cols-4">
        {stats.map((item, index) => (
          <AnimateIn
            key={item.label}
            delay={0.08 + index * 0.06}
            direction="up"
            className={`border-[#DED6CA] py-8 text-center md:py-10 ${
              index % 2 === 1 ? "border-l" : ""
            } ${index > 1 ? "border-t md:border-t-0" : ""} ${
              index > 0 ? "md:border-l" : ""
            }`}
          >
            <p className="font-serif text-[36px] font-medium leading-none text-[#31332C] md:text-[42px]">
              <CountUp value={item.value} />
            </p>

            <p className="mx-auto mt-3 max-w-[190px] font-sans text-[10px] font-medium uppercase leading-[17px] tracking-[0.12em] text-[#797C73] sm:text-[11px]">
              {item.label}
            </p>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}