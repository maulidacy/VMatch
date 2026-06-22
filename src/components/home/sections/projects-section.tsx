"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Layers, Wallet, type LucideIcon } from "lucide-react";
import { FillImage } from "@/components/home/fill-image";
import { projects } from "@/lib/home-content";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const projectValues = [
  "Rp43.500.000",
  "Rp38.000.000",
  "Rp55.000.000",
  "Rp24.500.000",
  "Rp41.000.000",
  "Rp22.500.000",
];

const propertyTypes = [
  "Rumah Tinggal",
  "Apartemen",
  "Villa",
  "Hotel",
  "Kantor",
  "Cafe & Resto",
];

const materialTypes = [
  "HPL, plywood, solid surface",
  "HPL, MDF, kaca, cermin",
  "Panel dinding, rak TV, lighting",
  "HPL, plywood, MDF",
  "Panel dinding, lighting",
  "Plywood, HPL, panel dinding",
];

const projectStyles = [
  "Modern Minimalis",
  "Japandi",
  "Modern Kontemporer",
  "Scandinavian",
  "Luxury Modern",
  "Tropical Modern",
];

type ProjectMeta = {
  projectValue: string;
  propertyType: string;
  material: string;
  style: string;
};

function getProjectMeta(index: number): ProjectMeta {
  return {
    projectValue: projectValues[index % projectValues.length],
    propertyType: propertyTypes[index % propertyTypes.length],
    material: materialTypes[index % materialTypes.length],
    style: projectStyles[index % projectStyles.length],
  };
}

function cleanLocation(location: string) {
  return location.replace(/\s*-\s*\d{4}\s*$/, "");
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const portfolioItems = useMemo(() => {
    const items = projects.map((project, index) => ({
      ...project,
      meta: getProjectMeta(index),
    }));

    return items.length < 8 ? [...items, ...items] : items;
  }, []);

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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="overflow-hidden bg-white py-14 md:py-20"
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
        </div>

        <div
          className={`relative mt-10 transition-all delay-150 duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-14 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="-mx-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
            <div className="grid auto-cols-[minmax(280px,86vw)] grid-flow-col grid-rows-1 gap-4 sm:auto-cols-[minmax(330px,48vw)] lg:auto-cols-[minmax(260px,280px)] lg:grid-rows-2 lg:gap-5 xl:auto-cols-[minmax(285px,305px)] 2xl:auto-cols-[minmax(300px,320px)]">
              {portfolioItems.map((project, index) => (
                <ProjectCard
                  key={`${project.title}-${index}`}
                  project={project}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-4 flex justify-center transition-all delay-300 duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Link
            href="/portfolio"
            className="inline-flex w-full items-center justify-center rounded-1xl bg-[#6b5b52] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#5a4a42] active:scale-95 sm:w-auto"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  priority,
}: {
  project: (typeof projects)[number] & {
    meta: ProjectMeta;
  };
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${createSlug(project.title)}`}
      className="group block h-full overflow-hidden rounded-xl border border-[#E8E2D9] bg-white text-left shadow-[0_8px_28px_rgba(49,51,44,0.03)] transition hover:-translate-y-1 hover:border-[#D8CABC] hover:shadow-[0_16px_38px_rgba(49,51,44,0.08)]"
    >
      <article className="h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DF]">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <FillImage
              image={project.image}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 48vw, 320px"
              priority={priority}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#725F54] shadow-sm backdrop-blur-md">
            {project.meta.style}
          </span>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#725F54] sm:text-[11px]">
                {project.meta.propertyType}
              </span>

              <span className="rounded-full bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                {cleanLocation(project.location)}
              </span>
            </div>

            <h3 className="mt-3 line-clamp-2 font-serif text-[20px] leading-tight text-[#31332C] sm:text-[22px]">
              {project.title}
            </h3>
          </div>

          <div className="grid gap-2">
            <MetaInfo
              icon={Wallet}
              label="Nilai Proyek"
              value={project.meta.projectValue}
            />
            <MetaInfo
              icon={Home}
              label="Properti"
              value={project.meta.propertyType}
            />
            <MetaInfo
              icon={Layers}
              label="Material"
              value={project.meta.material}
            />
          </div>

          <span className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-3 text-[11px] font-semibold text-[#31332C] transition group-hover:bg-[#FCFBF9] sm:text-[12px]">
            Lihat Detail
          </span>
        </div>
      </article>
    </Link>
  );
}

function MetaInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 rounded-xl bg-[#FCFBF9] px-2.5 py-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-[#725F54]" />

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B756E]">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-[#31332C] sm:text-[12px] sm:leading-5">
          {value}
        </p>
      </div>
    </div>
  );
}
