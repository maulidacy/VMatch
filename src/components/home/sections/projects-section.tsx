import { AnimateIn } from "@/components/home/animate-in";
import { FillImage } from "@/components/home/fill-image";
import { SectionHeading } from "@/components/home/section-heading";
import { projects } from "@/lib/home-content";

export function ProjectsSection() {
  return (
    <section className="bg-white py-[61px]">
      <AnimateIn delay={0.1}>
        <SectionHeading eyebrow="Archive" title="Proyek yang telah kami tangani" cta="Eksplorasi Semua Portofolio" />
      </AnimateIn>
      <div className="mx-auto mt-[61px] grid max-w-[1170px] grid-cols-1 gap-[26px] px-6 md:grid-cols-3">
        {projects.map((project, index) => (
          <AnimateIn key={project.title} delay={0.2 + index * 0.15} direction="up" className="h-full">
            <article className="group h-full bg-[#F3F3F3]">
              <div className="relative h-[280px] overflow-hidden">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <FillImage image={project.image} />
                </div>
              </div>
              <div className="h-20 bg-[#F3F3F3] px-5 py-3.5">
                <h3 className="font-serif text-[28px] leading-7 text-[#31332C]">{project.title}</h3>
                <p className="mt-2 font-sans text-sm uppercase leading-4 tracking-[0.04em] text-[#797C73]">
                  {project.location}
                </p>
              </div>
            </article>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}