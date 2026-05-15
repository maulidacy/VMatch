import { PortfolioHero } from "@/components/home/sections/portfolio-hero";
import { PortfolioProjects } from "@/components/home/sections/portfolio-projects";
import { Footer } from "@/components/home/sections/footer";

export default function PortfolioPage() {
  return (
    <main className="bg-white text-[#31332c]">
      <PortfolioHero />
      <PortfolioProjects />
      <Footer />
    </main>
  );
}