// src/app/inspirasi/[slug]/[detailSlug]/page.tsx
"use client";

import { useParams } from "next/navigation";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";
import { inspirations } from "@/lib/home-content";
import {
  ProjectDetailTemplate,
  type DetailImage,
  type DetailRelatedItem,
  type ImageSource,
  type MaterialPackage,
} from "@/components/shared/project-detail";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type RelatedInspiration = {
  id: string;
  title: string;
  style: string;
  projectValue: string;
  image: ImageSource;
  href: string;
};

type VendorPortfolioProfile = {
  vendorName: string;
  studioName: string;
};

type InspirationDetail = {
  id: string;
  title: string;
  category: string;
  packageLevel: string;
  style: string;
  projectValue: string;
  idealSize: string;
  projectLocation: string;
  projectTimeline: string;
  vendorProfile: VendorPortfolioProfile;
  spaceType: string;
  suitableFor: string[];
  materials: string[];
  shortDescription: string;
  fullDescription: string;
  designElements: string[];
  materialPackages: MaterialPackage[];
  images: ImageSource[];
  beforeAfter?: {
    before: ImageSource;
    after: ImageSource;
  };
  related: RelatedInspiration[];
};

const galleryItems = inspirations.flatMap((item, index) => [
  {
    ...item,
    id: `${createSlug(item.title)}-${index}-main`,
    title: item.title,
    style: index % 2 === 0 ? "Modern" : "Minimalis",
    property: index % 3 === 0 ? "Apartemen" : "Rumah",
  },
  {
    ...item,
    id: `${createSlug(item.title)}-${index}-alt`,
    title: `${item.title} ${index + 1}`,
    style: index % 2 === 0 ? "Minimalis" : "Modern",
    property: index % 2 === 0 ? "Rumah" : "Apartemen",
  },
]);

function getProjectValue(category: string) {
  if (category.includes("Kitchen")) return "Rp43.500.000";
  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return "Rp38.000.000";
  }
  if (category.includes("Storage")) return "Rp28.500.000";
  if (category.includes("Tamu")) return "Rp55.000.000";
  if (category.includes("Tidur")) return "Rp35.000.000";
  return "Rp32.000.000";
}

function getIdealSize(category: string) {
  if (category.includes("Kitchen")) return "2.5m x 2m";
  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return "3m x 2.4m";
  }
  if (category.includes("Storage")) return "2m x 2m";
  if (category.includes("Tamu")) return "4m x 5m";
  if (category.includes("Tidur")) return "3m x 4m";
  return "3m x 3m";
}

function getProjectTimeline(category: string) {
  if (category.includes("Kitchen")) {
    return "05 Mei 2024 - 08 Agustus 2024 (3 bulan)";
  }

  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return "12 Mei 2024 - 21 Juli 2024 (2 bulan)";
  }

  return "10 Mei 2024 - 28 Juli 2024 (2,5 bulan)";
}

function getVendorName(category: string) {
  if (category.includes("Kitchen")) return "Dapur Rapi Studio";
  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return "Kayu Rapi Interior";
  }
  if (category.includes("Storage")) return "Ruang Simpan Studio";
  if (category.includes("Tamu")) return "Nusa Living Interior";
  return "Vendor Partner VMatch";
}

function getMaterials(category: string) {
  if (category.includes("Kitchen")) return ["HPL", "Multiplek", "Solid surface"];
  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return ["HPL", "Multiplek", "Kaca / cermin"];
  }
  if (category.includes("Storage")) return ["HPL", "Multiplek", "MDF"];
  if (category.includes("Tamu")) return ["Panel dinding", "Rak TV", "Lighting"];
  return ["HPL", "Panel dinding", "Lighting"];
}

function getSuitableFor(category: string) {
  if (category.includes("Kitchen")) return ["Dapur rumah", "Apartemen"];
  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return ["Kamar utama", "Kamar anak"];
  }
  if (category.includes("Storage")) return ["Kamar", "Ruang keluarga", "Apartemen"];
  if (category.includes("Tamu")) return ["Rumah tinggal", "Apartemen"];
  return ["Rumah", "Apartemen"];
}

function getDesignElements(category: string) {
  if (category.includes("Kitchen")) {
    return [
      "Kabinet atas dan bawah",
      "Area penyimpanan tertutup",
      "Top table solid surface",
      "Backsplash motif marble",
      "Warna netral dan aksen kayu",
      "Layout dapur efisien",
    ];
  }

  if (category.includes("Wardrobe") || category.includes("Lemari")) {
    return [
      "Area gantung pakaian",
      "Rak lipat dan laci penyimpanan",
      "Pintu wardrobe rapi",
      "Kombinasi panel kayu dan warna netral",
      "Pembagian storage sesuai kebutuhan",
      "Tampilan clean dan hemat ruang",
    ];
  }

  if (category.includes("Storage")) {
    return [
      "Storage tertutup",
      "Rak display",
      "Layout compact",
      "Aksen kayu hangat",
      "Area penyimpanan multifungsi",
      "Tampilan rapi dan ringan",
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

function buildInspirationDetail({
  activeItem,
  activeCategory,
  references,
}: {
  activeItem: (typeof galleryItems)[number];
  activeCategory: (typeof inspirations)[number];
  references: (typeof galleryItems)[number][];
}): InspirationDetail {
  const category = activeCategory.title;
  const materials = getMaterials(category);
  const images = Array.from(
    new Set([activeItem.image, ...references.map((item) => item.image)]),
  ).slice(0, 6);

  return {
    id: activeItem.id,
    title: activeItem.title,
    category,
    packageLevel:
      category.includes("Kitchen") || category.includes("Ruang")
        ? "Standard / Premium"
        : "Standard",
    style: activeItem.style,
    projectValue: getProjectValue(category),
    idealSize: getIdealSize(category),
    projectLocation: "Semarang",
    projectTimeline: getProjectTimeline(category),
    vendorProfile: {
      vendorName: getVendorName(category),
      studioName: "Vendor Partner VMatch",
    },
    spaceType: activeItem.property,
    suitableFor: getSuitableFor(category),
    materials,
    shortDescription:
      "Referensi desain dari portofolio vendor partner VMatch yang dapat menjadi acuan awal sebelum customer mengajukan proyek interior.",
    fullDescription: `${activeItem.copy} Referensi ini berasal dari portofolio vendor partner VMatch. Detail akhir proyek tetap dapat disesuaikan berdasarkan kebutuhan ruang, ukuran, material, budget, dan proses validasi VMatch.`,
    designElements: getDesignElements(category),
    materialPackages: [
      {
        name: "Basic",
        description: "Pilihan ekonomis untuk kebutuhan interior sederhana.",
      },
      {
        name: "Standard",
        description: "Pilihan seimbang dengan material lebih kokoh dan rapi.",
      },
      {
        name: "Premium",
        description:
          "Pilihan lebih kuat dengan finishing lebih detail dan tampilan elegan.",
      },
    ],
    images,
    beforeAfter: {
      before: references[0]?.image ?? activeItem.image,
      after: activeItem.image,
    },
    related: references.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      style: item.style,
      projectValue: getProjectValue(category),
      image: item.image,
      href: `/inspirasi/${createSlug(category)}/${createSlug(item.title)}`,
    })),
  };
}

export default function InspirationItemDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const detailSlug = String(params.detailSlug || "");

  const activeCategory =
    inspirations.find((item) => createSlug(item.title) === slug) || inspirations[0];

  const activeItem =
    galleryItems.find((item) => createSlug(item.title) === detailSlug) ||
    galleryItems.find((item) => createSlug(item.title) === slug) ||
    galleryItems[0];

  const references = galleryItems
    .filter((item) => createSlug(item.title) !== createSlug(activeItem.title))
    .slice(0, 8);

  const inspiration = buildInspirationDetail({
    activeItem,
    activeCategory,
    references,
  });

  const images: DetailImage[] =
    inspiration.images.length > 0
      ? inspiration.images.map((image, index) => ({
          src: image,
          alt: `${inspiration.title} ${index + 1}`,
        }))
      : [
          {
            src: "",
            alt: inspiration.title,
          },
        ];

  const beforeAfter = inspiration.beforeAfter
    ? {
        before: {
          src: inspiration.beforeAfter.before,
          alt: `Sebelum ${inspiration.title}`,
        },
        after: {
          src: inspiration.beforeAfter.after,
          alt: `Sesudah ${inspiration.title}`,
        },
      }
    : undefined;

  const related: DetailRelatedItem[] = inspiration.related.map((item) => ({
    id: item.id,
    title: item.title,
    style: item.style,
    projectValue: item.projectValue,
    image: item.image,
    href: item.href,
  }));

  return (
    <main className="bg-[#FCFBF9] text-[#31332C]">
      <section className="bg-white px-4 pb-8 pt-6 text-[#31332c] sm:px-6">
        <div className="mx-auto max-w-[1320px]">
          <Navbar />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 md:py-12">
        <ProjectDetailTemplate
          title={inspiration.title}
          category={inspiration.category}
          packageLevel={inspiration.packageLevel}
          style={inspiration.style}
          projectValue={inspiration.projectValue}
          roomSize={inspiration.idealSize}
          projectLocation={inspiration.projectLocation}
          projectTimeline={inspiration.projectTimeline}
          vendorName={inspiration.vendorProfile.vendorName}
          vendorStudio={inspiration.vendorProfile.studioName}
          propertyType={inspiration.spaceType}
          materials={inspiration.materials}
          shortDescription={inspiration.shortDescription}
          fullDescription={inspiration.fullDescription}
          designElements={inspiration.designElements}
          materialPackages={inspiration.materialPackages}
          images={images}
          beforeAfter={beforeAfter}
          related={related}
          backHref={`/inspirasi/${createSlug(activeCategory.title)}`}
          backLabel="Kembali ke Inspirasi Desain"
          breadcrumbLabel="Inspirasi Desain"
          detailLabel="Detail Inspirasi"
          primaryCtaHref="/#kontak"
          primaryCtaLabel="Konsultasi Desain"
          secondaryCtaHref="/dashboard/user"
          secondaryCtaLabel="Ajukan Proyek"
          tertiaryCtaHref="https://wa.me/6281234567890"
          tertiaryCtaLabel="WhatsApp"
        />
      </section>

      <Footer />
    </main>
  );
}
