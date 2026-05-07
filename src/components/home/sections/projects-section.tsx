"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FillImage } from "@/components/home/fill-image";
import { projects } from "@/lib/home-content";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const ITEM_WIDTH = "clamp(210px, 31vw, 420px)";
const ITEM_GAP = 24;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const repeatedProjects = [...projects, ...projects, ...projects];
  const middleStart = projects.length;

  const [activeIndex, setActiveIndex] = useState(middleStart + 1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const realIndex = activeIndex % projects.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const normalizeIndex = (index: number) => {
    setEnableTransition(false);
    setActiveIndex(middleStart + (index % projects.length));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    });
  };

  const handleTransitionEnd = () => {
    if (activeIndex < middleStart) normalizeIndex(activeIndex);
    if (activeIndex >= middleStart * 2) normalizeIndex(activeIndex);
  };

  const chooseProject = (index: number) => {
    const currentRealIndex = activeIndex % projects.length;
    let targetIndex = activeIndex + (index - currentRealIndex);

    if (index - currentRealIndex > projects.length / 2) {
      targetIndex -= projects.length;
    }

    if (currentRealIndex - index > projects.length / 2) {
      targetIndex += projects.length;
    }

    setEnableTransition(true);
    setActiveIndex(targetIndex);
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="overflow-hidden bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div
            className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#6b5b52] sm:text-[12px]">
              Portofolio Proyek
            </p>

            <h2 className="mt-4 max-w-[720px] font-serif text-[32px] leading-tight text-[#31332c] sm:text-[38px] md:text-[46px]">
              Proyek yang telah kami tangani
            </h2>
          </div>

          <Link
            href="/portfolio"
            className={`group inline-flex w-fit items-center gap-2 border-b border-[#6b5b52]/25 pb-1 text-sm font-medium text-[#6b5b52] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#6b5b52] hover:text-[#31332c] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Eksplorasi Semua Portofolio
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div
          className={`relative mt-14 overflow-hidden py-10 transition-all delay-150 duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex items-center ${
              enableTransition
                ? "transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                : ""
            }`}
            style={{
              gap: `${ITEM_GAP}px`,
              transform: `translateX(calc(50% - (${activeIndex} * (${ITEM_WIDTH} + ${ITEM_GAP}px)) - (${ITEM_WIDTH} / 2)))`,
            }}
          >
            {repeatedProjects.map((project, index) => {
              const originalIndex = index % projects.length;
              const isActive = index === activeIndex;

              const cardClass = `group shrink-0 text-left transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? "z-20 scale-100 opacity-100 grayscale-0"
                  : "z-10 scale-[0.86] opacity-45 grayscale hover:opacity-80 hover:grayscale-0"
              }`;

              const articleClass = `overflow-hidden transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? "bg-[#f4f2ef] shadow-[0_20px_55px_rgba(0,0,0,0.16)] hover:-translate-y-2"
                  : "bg-[#efeeeb] hover:-translate-y-1"
              }`;

              const content = (
                <article className={articleClass}>
                  <div
                    className={`relative overflow-hidden transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "h-[290px] sm:h-[380px] md:h-[470px]"
                        : "h-[230px] sm:h-[310px] md:h-[380px]"
                    }`}
                  >
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                      <FillImage
                        image={project.image}
                        sizes="(min-width: 768px) 31vw, 80vw"
                      />
                    </div>

                    {isActive ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                        <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-[#6b5b52] backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-[10px]">
                          Proyek Utama
                        </span>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black/15" />
                    )}
                  </div>

                  <div className="px-4 py-5 sm:px-6 sm:py-6">
                    <h3
                      className={`line-clamp-2 font-serif italic leading-tight text-[#31332c] ${
                        isActive
                          ? "text-[24px] sm:text-[30px] md:text-[36px]"
                          : "text-[17px] sm:text-[22px] md:text-[26px]"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className={`mt-3 uppercase tracking-[0.14em] text-[#858078] ${
                        isActive
                          ? "text-[9px] sm:text-[10px] md:text-[11px]"
                          : "text-[7px] sm:text-[9px] md:text-[10px]"
                      }`}
                    >
                      {project.location}
                    </p>

                    {isActive && (
                      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b5b52] sm:text-[11px]">
                        Lihat Detail
                      </span>
                    )}
                  </div>
                </article>
              );

              if (isActive) {
                return (
                  <Link
                    key={`${project.title}-${index}`}
                    href={`/portfolio/${createSlug(project.title)}`}
                    className={cardClass}
                    style={{ width: ITEM_WIDTH }}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={`${project.title}-${index}`}
                  type="button"
                  onClick={() => chooseProject(originalIndex)}
                  className={cardClass}
                  style={{ width: ITEM_WIDTH }}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-6 flex items-center justify-center gap-4 transition-all delay-300 duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="flex gap-2">
            {projects.slice(0, 6).map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => chooseProject(index)}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  realIndex === index
                    ? "w-7 bg-[#6b5b52]"
                    : "w-2 bg-[#6b5b52]/35 hover:bg-[#6b5b52]"
                }`}
                aria-label={`Lihat proyek ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}