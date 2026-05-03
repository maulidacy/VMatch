import { FillImage } from "@/components/home/fill-image";
import type { Project } from "@/lib/home-content";

export function ProjectsStrip({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex lg:grid lg:grid-cols-5 gap-4 lg:gap-5 w-max lg:w-full">
        {projects.slice(0, 5).map((project) => (
          <article key={project.title} className="group w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-start lg:min-w-0">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#31332C]">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                <FillImage image={project.image} sizes="(min-width: 1024px) 20vw, 220px" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#191A17]/45 via-transparent to-transparent opacity-70" />
            </div>
            <div className="pt-4">
              <h3 className="font-serif text-[20px] leading-6 text-[#F5EFE5]">{project.title}</h3>
              <p className="mt-1 font-sans text-[11px] font-medium uppercase leading-4 tracking-[0.12em] text-[#D8CFC4]/70">
                {project.location}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
