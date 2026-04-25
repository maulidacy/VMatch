import { AnimateIn } from "@/components/home/animate-in";
import { ProjectsStrip } from "@/components/home/projects-carousel";
import { projects } from "@/lib/home-content";

export function ProjectsSection() {
  return (
    <section className="overflow-hidden bg-[#191A17] py-10 text-[#F5EFE5] md:py-12">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mb-7 flex items-end justify-between gap-6">
          <AnimateIn delay={0.1}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D8CFC4]/70">
              Featured projects
            </p>
            <h2 className="mt-2 max-w-[460px] font-serif text-[31px] font-medium leading-[36px] text-[#F5EFE5] sm:text-[38px] sm:leading-[42px]">
              Ruang yang kami bangun dengan detail.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2} direction="left">
            <a
              href="#kontak"
              className="hidden border border-[#D8CFC4]/30 px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F5EFE5] transition-colors hover:border-[#F5EFE5] hover:bg-[#F5EFE5] hover:text-[#31332C] md:inline-flex"
            >
              Konsultasi proyek
            </a>
          </AnimateIn>
        </div>
        <AnimateIn delay={0.25} direction="up">
          <ProjectsStrip projects={projects} />
        </AnimateIn>
      </div>
    </section>
  );
}
