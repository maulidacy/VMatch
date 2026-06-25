"use client";

import { useMemo, useState } from "react";
import {
  ProjectDetailTemplate,
  type DetailImage,
  type DetailRelatedItem,
  type MaterialPackage,
} from "@/components/shared/project-detail";

type CustomerPageTarget = "ajukan" | "ai-ide" | "konsultasi" | "catalog";

type RelatedInspiration = {
  id: string;
  title: string;
  style: string;
  projectValue: string;
  image: string;
};

type VendorPortfolioProfile = {
  vendorName: string;
  studioName: string;
  location: string;
  specialty: string;
  experience: string;
  completedProjects: string;
  description: string;
};

export type InspirationDetail = {
  id: string;
  title: string;
  category: string;
  packageLevel: string;
  style: string;
  budgetRange: string;
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
  timeline: string[];
  notes: string;
  images: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
  related: RelatedInspiration[];
};

type SelectedInspirationPayload = {
  id: string;
  title: string;
  category: string;
  style: string;
  budgetRange: string;
  packageLevel: string;
  materials: string[];
  suitableFor: string[];
  mainImage: string;
  notes: string;
};

const STORAGE_KEY = "vmatch_selected_inspiration";
const REQUEST_PAGE_TARGET: CustomerPageTarget = "ajukan";

const inspirationDetail: InspirationDetail = {
  id: "kitchen-set-modern-1",
  title: "Kitchen Set Modern Minimalis",
  category: "Kitchen Set",
  packageLevel: "Standard / Premium",
  style: "Modern minimalis",
  budgetRange: "Rp43.500.000",
  idealSize: "2.5m x 2m",
  projectLocation: "Semarang",
  projectTimeline: "05 Mei 2024 - 08 Agustus 2024 (3 bulan)",
  vendorProfile: {
    vendorName: "Kayu Rapi Interior",
    studioName: "Vendor Partner VMatch",
    location: "Semarang",
    specialty: "Kitchen set, storage, dan custom cabinet",
    experience: "5 tahun pengalaman",
    completedProjects: "38 proyek selesai",
    description: "Vendor Partner VMatch",
  },
  spaceType: "Rumah / Apartemen",
  suitableFor: ["Dapur rumah", "Apartemen", "Ruang dapur compact"],
  materials: ["HPL", "Multiplek", "Solid surface"],
  shortDescription:
    "Referensi desain dari portofolio vendor partner VMatch dengan konsep dapur modern, fungsional, bersih, dan elegan.",
  fullDescription:
    "Kitchen set ini merupakan referensi portofolio dari vendor partner VMatch. Konsepnya mengutamakan tampilan modern minimalis dengan warna netral dan aksen kayu hangat. Referensi ini cocok untuk kebutuhan dapur yang bersih, fungsional, mudah dirawat, dan tetap terlihat elegan.",
  designElements: [
    "Kabinet atas dan bawah",
    "Area penyimpanan tertutup",
    "Top table solid surface",
    "Backsplash motif marble",
    "Warna netral dan aksen kayu",
    "Layout dapur efisien",
  ],
  materialPackages: [
    {
      name: "Basic",
      description:
        "Pilihan ekonomis menggunakan MDF Board dan finishing melamine untuk kebutuhan interior sederhana.",
    },
    {
      name: "Standard",
      description:
        "Pilihan seimbang menggunakan multiplek 15mm dan finishing HPL dengan tampilan yang rapi dan tahan pakai.",
    },
    {
      name: "Premium",
      description:
        "Pilihan terbaik menggunakan multiplek 18mm, finishing premium, dan hardware soft close untuk hasil yang lebih elegan dan tahan lama.",
    },
  ],
  timeline: [
    "Konsultasi & validasi kebutuhan",
    "Survey ukuran",
    "Finalisasi desain dan RAB",
    "Produksi",
    "Instalasi",
    "QC dan handover",
  ],
  notes:
    "Inspirasi ini digunakan sebagai referensi awal. Tim VMatch akan membantu menyesuaikan solusi berdasarkan ukuran ruang, kebutuhan penyimpanan, budget, material, dan kondisi ruangan customer.",
  images: [
    "/figma/benefits-kitchen.webp",
    "/figma/project-library.webp",
    "/figma/benefits-storage.webp",
    "/figma/benefits-living.webp",
    "/figma/benefits-wardrobe.webp",
    "/figma/benefits-bedroom.webp",
  ],
  beforeAfter: {
    before: "/figma/project-library.webp",
    after: "/figma/benefits-kitchen.webp",
  },
  related: [
    {
      id: "storage-rak-modern",
      title: "Storage Compact Modern",
      style: "Modern minimalis",
      projectValue: "Rp28.500.000",
      image: "/figma/benefits-storage.webp",
    },
    {
      id: "wardrobe-warm-modern",
      title: "Wardrobe Warm Modern",
      style: "Warm modern",
      projectValue: "Rp38.000.000",
      image: "/figma/benefits-wardrobe.webp",
    },
    {
      id: "living-room-japandi",
      title: "Ruang Tamu Japandi",
      style: "Japandi",
      projectValue: "Rp55.000.000",
      image: "/figma/benefits-living.webp",
    },
  ],
};

export default function InspirationDetailPage() {
  return <InspirationDetailView />;
}

export function InspirationDetailView({
  inspiration = inspirationDetail,
  onBack,
  onChangePage,
  onOpenRelated,
}: {
  inspiration?: InspirationDetail;
  onBack?: () => void;
  onChangePage?: (page: CustomerPageTarget) => void;
  onOpenRelated?: (id: string) => void;
}) {
  const [activeImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

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

  const activeImage = images[activeImageIndex]?.src ?? images[0]?.src ?? "";

  const selectedPayload = useMemo<SelectedInspirationPayload>(
    () => ({
      id: inspiration.id,
      title: inspiration.title,
      category: inspiration.category,
      style: inspiration.style,
      budgetRange: inspiration.budgetRange,
      packageLevel: inspiration.packageLevel,
      materials: inspiration.materials,
      suitableFor: inspiration.suitableFor,
      mainImage: String(activeImage),
      notes: inspiration.notes,
    }),
    [activeImage, inspiration],
  );

  const saveSelectedInspiration = () => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPayload));
    setIsSaved(true);
  };

  const goToRequest = () => {
    saveSelectedInspiration();

    if (onChangePage) {
      onChangePage(REQUEST_PAGE_TARGET);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/dashboard/user";
    }
  };

  const goToConsultation = () => {
    saveSelectedInspiration();

    if (onChangePage) {
      onChangePage("konsultasi");
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/dashboard/user";
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (onChangePage) {
      onChangePage("catalog");
      return;
    }

    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

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
  }));

  return (
    <ProjectDetailTemplate
      title={inspiration.title}
      category={inspiration.category}
      packageLevel={inspiration.packageLevel}
      style={inspiration.style}
      projectValue={inspiration.budgetRange}
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
      isSaved={isSaved}
      backLabel="Kembali ke Inspirasi Desain"
      breadcrumbLabel="Inspirasi Desain"
      detailLabel="Detail Inspirasi"
      primaryCtaLabel="Gunakan sebagai Preferensi"
      secondaryCtaLabel="Konsultasi"
      onBack={handleBack}
      onPrimaryAction={goToRequest}
      onSecondaryAction={goToConsultation}
      onSave={saveSelectedInspiration}
      onOpenRelated={onOpenRelated}
    />
  );
}
