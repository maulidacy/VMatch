import Link from "next/link";
import { FillImage } from "@/components/home/fill-image";
import { SectionHeading } from "@/components/home/section-heading";
import { projects } from "@/lib/home-content";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProjectsSection() {
  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-6">
        <SectionHeading
          eyebrow="Portofolio Proyek"
          title="Proyek yang telah kami tangani"
          cta="Eksplorasi Semua Portofolio"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <Link
              key={`${project.title}-${index}`}
              href={`/portfolio/${createSlug(project.title)}`}
              className="group block"
              style={{
                animation: `fadeUp 700ms ease-out ${index * 100}ms both`,
              }}
            >
              <article className="overflow-hidden bg-[#f3f3f3] shadow-[0_8px_22px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
                <div className="relative h-[215px] overflow-hidden md:h-[230px]">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <FillImage image={project.image} />
                  </div>
                </div>

                <div className="px-5 py-5">
                  <h3 className="font-serif text-[22px] italic leading-7 text-[#31332c]">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-[12px] uppercase tracking-[0.16em] text-[#858078]">
                    {project.location}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}