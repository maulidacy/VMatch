import { AnimateIn } from "@/components/home/animate-in";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { SectionHeading } from "@/components/home/section-heading";
import { projects } from "@/lib/home-content";

export function ProjectsSection() {
  return (
    <section className="overflow-hidden bg-white py-[61px]">
      <AnimateIn delay={0.1}>
        <SectionHeading eyebrow="Archive" title="Proyek yang telah kami tangani" cta="Eksplorasi Semua Portofolio" />
      </AnimateIn>
      <div className="mt-8 w-full">
        <ProjectsCarousel projects={projects} />
      </div>
    </section>
  );
}
