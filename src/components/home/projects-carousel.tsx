"use client";

import { useEffect, useState } from "react";
import { FillImage } from "@/components/home/fill-image";
import type { Project } from "@/lib/home-content";

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 2800); // Stop at the middle, then move
    return () => clearInterval(timer);
  }, [projects.length]);

  return (
    <div className="relative flex min-h-[580px] w-full items-center justify-center overflow-hidden py-10">
      <div className="relative flex w-full max-w-[1200px] items-center justify-center">
        {projects.map((project, index) => {
          // Calculate offset relative to activeIndex for continuous infinite loop
          let offset = index - activeIndex;
          const half = Math.floor(projects.length / 2);
          
          if (offset < -half) offset += projects.length;
          if (offset > half) offset -= projects.length;

          const isCenter = offset === 0;
          
          // Determine styles based on offset position
          // Base translation for a smooth staggered look
          let translateX = 0; 
          let scale = 1;
          let opacity = 1;
          let zIndex = 10;
          let blur = "blur(0px)";

          if (isCenter) {
            scale = 1.05;
            zIndex = 20;
            translateX = 0;
          } else if (offset === 1) {
            translateX = 460;
            scale = 0.85;
            opacity = 0.75;
            zIndex = 15;
          } else if (offset === -1) {
            translateX = -460;
            scale = 0.85;
            opacity = 0.75;
            zIndex = 15;
          } else if (offset > 1) {
            translateX = 500;
            scale = 0.6;
            opacity = 0;
            zIndex = 5;
            blur = "blur(10px)";
          } else if (offset < -1) {
            translateX = -500;
            scale = 0.6;
            opacity = 0;
            zIndex = 5;
            blur = "blur(10px)";
          }

          return (
            <article
              key={project.title}
              className="absolute w-[360px] cursor-pointer rounded-md border border-[#DED6CA] bg-[#F3F3F3] shadow-xl transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] sm:w-[420px]"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                filter: blur,
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto", // Prevent clicking hidden items
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative h-[280px] overflow-hidden rounded-t-md sm:h-[320px]">
                <div className="h-full w-full transition-transform duration-700 hover:scale-105">
                  <FillImage image={project.image} />
                </div>
              </div>
              <div className="h-24 rounded-b-md bg-[#F3F3F3] px-6 py-4">
                <h3 className="font-serif text-[26px] leading-7 text-[#31332C]">{project.title}</h3>
                <p className="mt-2 font-sans text-sm uppercase leading-4 tracking-[0.04em] text-[#797C73]">
                  {project.location}
                </p>
              </div>
              {/* Optional overlay to darken inactive slides slightly */}
              {!isCenter && (
                <div className="pointer-events-none absolute inset-0 rounded-md bg-black/10 transition-opacity duration-1000" />
              )}
            </article>
          );
        })}
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 flex gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              activeIndex === index ? "w-8 bg-[#6B5B52]" : "w-2 bg-[#DED6CA] hover:bg-[#A3978E]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}