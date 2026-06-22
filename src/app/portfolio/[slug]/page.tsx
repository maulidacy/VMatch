import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";
import {
  ProjectDetailTemplate,
  type DetailImage,
  type DetailRelatedItem,
} from "@/components/shared/project-detail";
import { portfolioProjects } from "@/lib/home-content";

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
  "Rp67.000.000",
  "Rp31.500.000",
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
  ["HPL", "Plywood", "Solid surface"],
  ["HPL", "MDF", "Kaca / cermin"],
  ["Panel dinding", "Rak TV", "Lighting"],
  ["HPL", "Plywood", "MDF"],
  ["Panel dinding", "Lighting", "Fabric accent"],
  ["Plywood", "HPL", "Panel dinding"],
  ["Duco", "Veneer", "Soft close hardware"],
  ["Multiplek", "HPL premium", "LED strip"],
];

const projectStyles = [
  "Modern Minimalis",
  "Japandi",
  "Modern Kontemporer",
  "Scandinavian",
  "Luxury Modern",
  "Tropical Modern",
];

function getProjectMeta(index: number) {
  return {
    projectValue: projectValues[index % projectValues.length],
    propertyType: propertyTypes[index % propertyTypes.length],
    materials: materialTypes[index % materialTypes.length],
    style: projectStyles[index % projectStyles.length],
  };
}

function cleanLocation(location: string) {
  return location.replace(/\s*-\s*\d{4}\s*$/, "");
}

function getRoomSize(category: string) {
  if (category.toLowerCase().includes("kitchen")) return "2.5m x 2m";
  if (category.toLowerCase().includes("bedroom")) return "3m x 4m";
  if (category.toLowerCase().includes("living")) return "4m x 5m";
  return "3m x 3m";
}

function getTimeline(index: number) {
  const timelines = [
    "05 Mei 2024 - 08 Agustus 2024 (3 bulan)",
    "12 Mei 2024 - 21 Juli 2024 (2 bulan)",
    "10 Mei 2024 - 28 Juli 2024 (2,5 bulan)",
  ];

  return timelines[index % timelines.length];
}

function getDesignElements(category: string) {
  const lower = category.toLowerCase();

  if (lower.includes("kitchen")) {
    return [
      "Kabinet atas dan bawah",
      "Area penyimpanan tertutup",
      "Top table solid surface",
      "Backsplash motif marble",
      "Layout dapur efisien",
      "Aksen pencahayaan hangat",
    ];
  }

  if (lower.includes("bedroom")) {
    return [
      "Area tidur yang nyaman",
      "Panel dinding dekoratif",
      "Storage rapi",
      "Pencahayaan lembut",
      "Warna netral",
      "Material mudah dirawat",
    ];
  }

  return [
    "Komposisi ruang rapi",
    "Warna netral",
    "Material mudah dirawat",
    "Pencahayaan nyaman",
    "Fungsi penyimpanan jelas",
    "Tampilan modern",
  ];
}

function getVendorName(category: string) {
  const lower = category.toLowerCase();

  if (lower.includes("kitchen")) return "Dapur Rapi Studio";
  if (lower.includes("bedroom")) return "Nusa Living Interior";
  if (lower.includes("living")) return "Ruang Nyaman Studio";
  return "Vendor Partner VMatch";
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const projectIndex = portfolioProjects.findIndex(
    (project) => createSlug(project.title) === slug,
  );

  if (projectIndex === -1) {
    notFound();
  }

  const project = portfolioProjects[projectIndex];
  const meta = getProjectMeta(projectIndex);

  const images: DetailImage[] = [
    {
      src: project.image.src,
      alt: project.image.alt,
    },
  ];

  const related: DetailRelatedItem[] = portfolioProjects
    .filter((item) => item.title !== project.title)
    .slice(0, 3)
    .map((item, index) => {
      const relatedMeta = getProjectMeta(index + 1);

      return {
        id: item.title,
        title: item.title,
        style: relatedMeta.style,
        projectValue: relatedMeta.projectValue,
        image: item.image.src,
        href: `/portfolio/${createSlug(item.title)}`,
      };
    });

  return (
    <main className="bg-[#FCFBF9] text-[#31332C]">
      <section className="bg-white px-4 pb-8 pt-6 text-[#31332c] sm:px-6">
        <div className="mx-auto max-w-[1320px]">
          <Navbar />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 md:py-12">
        <ProjectDetailTemplate
          title={project.title}
          category={project.category}
          packageLevel="Standard"
          style={meta.style}
          projectValue={meta.projectValue}
          roomSize={getRoomSize(project.category)}
          projectLocation={cleanLocation(project.location)}
          projectTimeline={getTimeline(projectIndex)}
          vendorName={getVendorName(project.category)}
          vendorStudio="Vendor Partner VMatch"
          propertyType={meta.propertyType}
          materials={meta.materials}
          shortDescription="Portofolio proyek interior yang telah dikerjakan oleh vendor partner VMatch sebagai referensi awal untuk kebutuhan desain dan pengerjaan interior."
          fullDescription={`Proyek ${project.title} merupakan portofolio ${project.category.toLowerCase()} dengan konsep ${meta.style.toLowerCase()}. Detail proyek ini dapat menjadi acuan awal bagi customer untuk memahami karakter desain, penggunaan material, nilai proyek, dan arah pengerjaan interior sebelum mengajukan request melalui VMatch.`}
          designElements={getDesignElements(project.category)}
          images={images}
          beforeAfter={{
            before: images[0],
            after: images[0],
          }}
          related={related}
          backHref="/portfolio"
          backLabel="Kembali ke Portofolio"
          breadcrumbLabel="Portofolio Proyek"
          detailLabel="Detail Portofolio"
          primaryCtaHref="/dashboard/user"
          primaryCtaLabel="Ajukan Proyek"
          secondaryCtaHref="https://wa.me/6281234567890"
          secondaryCtaLabel="WhatsApp"
        />
      </section>

      <Footer />
    </main>
  );
}
