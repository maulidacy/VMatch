import { BenefitsSection } from "@/components/home/sections/benefits-section";
import { Footer } from "@/components/home/sections/footer";
import { HeroSection } from "@/components/home/sections/hero-section";
import { InspirationCategoriesSection } from "@/components/home/sections/inspiration-section";
import { OffersSection } from "@/components/home/sections/offers-section";
import { PhilosophySection } from "@/components/home/sections/philosophy-section";
import { ProcessSection } from "@/components/home/sections/process-section";
import { ProjectsSection } from "@/components/home/sections/projects-section";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { FAQSection } from "@/components/home/sections/faq-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ProjectsSection />
      <InspirationCategoriesSection />
      <ProcessSection />
      <BenefitsSection />
      <PhilosophySection />
      <TestimonialsSection />
      <OffersSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
