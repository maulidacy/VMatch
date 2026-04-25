import { BenefitsSection } from "@/components/home/sections/benefits-section";
import { ContactSection } from "@/components/home/sections/contact-section";
import { Footer } from "@/components/home/sections/footer";
import { HeroSection } from "@/components/home/sections/hero-section";
import { InspirationSection } from "@/components/home/sections/inspiration-section";
import { PhilosophySection } from "@/components/home/sections/philosophy-section";
import { ProcessSection } from "@/components/home/sections/process-section";
import { ProjectsSection } from "@/components/home/sections/projects-section";
import { StatsStrip } from "@/components/home/sections/stats-strip";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FCFBF9]">
      <HeroSection />
      <StatsStrip />
      <PhilosophySection />
      <InspirationSection />
      <ProjectsSection />
      <ProcessSection />
      <BenefitsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
