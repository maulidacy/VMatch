import { BenefitsSection } from "@/components/home/sections/benefits-section";
import { ContactSection } from "@/components/home/sections/contact-section";
import { Footer } from "@/components/home/sections/footer";
import { HeroSection } from "@/components/home/sections/hero-section";
import { InspirationCategoriesSection } from "@/components/home/sections/inspiration-section";
import { ServicesSection } from "@/components/home/sections/services-section";
import { PhilosophySection } from "@/components/home/sections/philosophy-section";
import { ProcessSection } from "@/components/home/sections/process-section";
import { ProjectsSection } from "@/components/home/sections/projects-section";
import { StatsStrip } from "@/components/home/sections/stats-strip";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { FAQSection } from "@/components/home/sections/faq-section";
import { PromoPopup } from "@/components/home/sections/promo-popup";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FCFBF9]">
      <PromoPopup />
      <HeroSection />
      <StatsStrip />
      <InspirationCategoriesSection />
      <ProjectsSection />
      <ServicesSection />
      <ProcessSection />
      <BenefitsSection />
      <PhilosophySection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
