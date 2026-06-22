"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MapPin,
  Package,
  Ruler,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

export type ImageSource = string | StaticImageData;

export type DetailImage = {
  src: ImageSource;
  alt: string;
};

export type MaterialPackage = {
  name: "Basic" | "Standard" | "Premium";
  description: string;
};

export type DetailRelatedItem = {
  id: string;
  title: string;
  style: string;
  projectValue: string;
  image: ImageSource;
  href?: string;
};

export type ProjectDetailTemplateProps = {
  title: string;
  category: string;
  packageLevel: string;
  style: string;
  projectValue: string;
  roomSize: string;
  projectLocation: string;
  projectTimeline: string;
  vendorName: string;
  vendorStudio?: string;
  propertyType?: string;
  materials: string[];
  shortDescription: string;
  fullDescription: string;
  designElements: string[];
  materialPackages?: MaterialPackage[];
  images: DetailImage[];
  beforeAfter?: {
    before: DetailImage;
    after: DetailImage;
  };
  related?: DetailRelatedItem[];

  backHref?: string;
  backLabel?: string;
  breadcrumbLabel?: string;
  detailLabel?: string;

  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  tertiaryCtaHref?: string;
  tertiaryCtaLabel?: string;

  isSaved?: boolean;
  onBack?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onSave?: () => void;
  onOpenRelated?: (id: string) => void;
};

const defaultMaterialPackages: MaterialPackage[] = [
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
];

export function ProjectDetailTemplate({
  title,
  category,
  packageLevel,
  style,
  projectValue,
  roomSize,
  projectLocation,
  projectTimeline,
  vendorName,
  vendorStudio = "Vendor Partner VMatch",
  materials,
  shortDescription,
  fullDescription,
  designElements,
  materialPackages = defaultMaterialPackages,
  images,
  beforeAfter,
  related = [],
  backHref = "#",
  backLabel = "Kembali",
  breadcrumbLabel = "Portofolio Proyek",
  detailLabel = "Detail Proyek",
  primaryCtaHref = "/dashboard/user",
  primaryCtaLabel = "Ajukan Proyek",
  secondaryCtaHref = "https://wa.me/6281234567890",
  secondaryCtaLabel = "WhatsApp",
  tertiaryCtaHref,
  tertiaryCtaLabel,
  isSaved = false,
  onBack,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onSave,
  onOpenRelated,
}: ProjectDetailTemplateProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const safeImages =
    images.length > 0
      ? images
      : [
          {
            src: "/figma/benefits-kitchen.webp",
            alt: title,
          },
        ];

  const activeImage = safeImages[activeImageIndex] ?? safeImages[0];

  const isInspiration = detailLabel.toLowerCase().includes("inspirasi");

  const goToPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="w-full space-y-6 text-[#31332C]">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#F8F6F2]"
        >
          <ArrowLeft size={15} />
          {backLabel}
        </button>
      ) : (
        <Link
          href={backHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#F8F6F2]"
        >
          <ArrowLeft size={15} />
          {backLabel}
        </Link>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <ProjectImageGallery
          title={title}
          images={safeImages}
          activeImage={activeImage}
          activeIndex={activeImageIndex}
          onPrevious={goToPreviousImage}
          onNext={goToNextImage}
          onSelect={setActiveImageIndex}
        />

        <ProjectSummaryCard
          title={title}
          category={category}
          style={style}
          materials={materials}
          summaryTitle={isInspiration ? "Ringkasan Inspirasi" : "Ringkasan Proyek"}
          nameLabel={isInspiration ? "Nama" : "Nama Proyek"}
          isSaved={isSaved}
          primaryCtaHref={primaryCtaHref}
          primaryCtaLabel={primaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          tertiaryCtaHref={tertiaryCtaHref}
          tertiaryCtaLabel={tertiaryCtaLabel}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
          onTertiaryAction={onTertiaryAction}
          onSave={onSave}
        />
      </section>

      <section className="space-y-4">
        <div className="max-w-[920px]">
          <p className="text-[12px] leading-5 text-[#7B756E]">
            {breadcrumbLabel} / {category}
          </p>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            {detailLabel}
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[46px]">
            {title}
          </h1>

          <p className="mt-3 max-w-[760px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
            {shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge label={category} />
            <Badge label={packageLevel} />
            <Badge label={style} />
          </div>
        </div>
      </section>

      <ProjectInfoGrid
        roomSize={roomSize}
        projectLocation={projectLocation}
        projectTimeline={projectTimeline}
        projectValue={projectValue}
        packageLevel={packageLevel}
      />

      <VendorPortfolioSection vendorName={vendorName} vendorStudio={vendorStudio} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <SectionCard title={isInspiration ? "Deskripsi Inspirasi" : "Deskripsi Proyek"}>
          <p className="text-[13px] leading-7 text-[#6F6860] sm:text-[14px]">
            {fullDescription}
          </p>
        </SectionCard>

        <SectionCard title="Elemen Desain">
          <div className="grid gap-2.5">
            {designElements.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3"
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-[#725F54]"
                />

                <p className="text-[13px] leading-5 text-[#31332C]">{item}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <MaterialPackageSection packages={materialPackages} />

      <GalleryGridSection
        title={title}
        images={safeImages}
        activeIndex={activeImageIndex}
        onSelect={setActiveImageIndex}
      />

      {beforeAfter && (
        <BeforeAfterSection
          title={title}
          before={beforeAfter.before}
          after={beforeAfter.after}
        />
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
              {isInspiration ? "Inspirasi Serupa" : "Proyek Serupa"}
            </p>

            <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C] sm:text-[34px]">
              Referensi lain yang mungkin cocok
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {related.map((item) => (
              <RelatedProjectCard
                key={item.id}
                item={item}
                onOpenRelated={onOpenRelated}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProjectImageGallery({
  title,
  images,
  activeImage,
  activeIndex,
  onPrevious,
  onNext,
  onSelect,
}: {
  title: string;
  images: DetailImage[];
  activeImage: DetailImage;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
      <div className="relative h-[280px] bg-[#EFE8DF] sm:h-[360px] lg:h-[500px]">
        <ImageWithFallback
          src={activeImage.src}
          alt={activeImage.alt}
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 70vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#725F54] shadow-sm transition hover:bg-white"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#725F54] shadow-sm transition hover:bg-white"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="bg-[#FCFBF9] p-3 sm:p-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={`${image.alt}-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl transition sm:h-20 sm:w-28 ${
                  active ? "ring-2 ring-[#725F54]/25" : "opacity-80 hover:opacity-100"
                }`}
                aria-label={`Pilih gambar ${index + 1}`}
              >
                <ImageWithFallback
                  src={image.src}
                  alt={`${title} ${index + 1}`}
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectSummaryCard({
  title,
  category,
  style,
  materials,
  summaryTitle,
  nameLabel,
  isSaved,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  tertiaryCtaHref,
  tertiaryCtaLabel,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onSave,
}: {
  title: string;
  category: string;
  style: string;
  materials: string[];
  summaryTitle: string;
  nameLabel: string;
  isSaved: boolean;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  tertiaryCtaHref?: string;
  tertiaryCtaLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onSave?: () => void;
}) {
  return (
    <aside className="h-fit rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6 xl:sticky xl:top-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
        {summaryTitle}
      </p>

      <div className="mt-4 space-y-3">
        <SummaryRow label={nameLabel} value={title} />
        <SummaryRow label="Style" value={style} />
        <SummaryRow label="Kategori" value={category} />
        <SummaryRow label="Material" value={materials.join(", ")} />
      </div>

      <div className="mt-5 grid gap-2">
        <ActionLinkOrButton
          href={primaryCtaHref}
          label={primaryCtaLabel}
          onClick={onPrimaryAction}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
          icon={<ArrowRight size={15} />}
        />

        <div className="grid grid-cols-2 gap-2">
          {onSave ? (
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            >
              {isSaved ? "Tersimpan" : "Simpan"}
            </button>
          ) : (
            <ActionLinkOrButton
              href={secondaryCtaHref}
              label={secondaryCtaLabel}
              onClick={onSecondaryAction}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            />
          )}

          <ActionLinkOrButton
            href={tertiaryCtaHref ?? secondaryCtaHref}
            label={tertiaryCtaLabel ?? secondaryCtaLabel}
            onClick={onTertiaryAction ?? (onSave ? onSecondaryAction : undefined)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          />
        </div>
      </div>
    </aside>
  );
}

function ActionLinkOrButton({
  href,
  label,
  onClick,
  className,
  icon,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className: string;
  icon?: ReactNode;
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {label}
        {icon}
      </button>
    );
  }

  const external = href.startsWith("http");

  if (external) {
    return (
      <a href={href} className={className}>
        {label}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      {icon}
    </Link>
  );
}

function ProjectInfoGrid({
  roomSize,
  projectLocation,
  projectTimeline,
  projectValue,
  packageLevel,
}: {
  roomSize: string;
  projectLocation: string;
  projectTimeline: string;
  projectValue: string;
  packageLevel: string;
}) {
  return (
    <section className="border-y border-[#E8E2D9] py-5">
      <div className="grid gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        <InlineInfoItem icon={MapPin} label="Lokasi Proyek" value={projectLocation} />
        <InlineInfoItem icon={Ruler} label="Ukuran Ruang" value={roomSize} />
        <InlineInfoItem icon={CalendarDays} label="Timeline Proyek" value={projectTimeline} />
        <InlineInfoItem icon={Wallet} label="Nilai Proyek" value={projectValue} />
        <InlineInfoItem icon={Package} label="Paket Material" value={packageLevel} />
      </div>
    </section>
  );
}

function InlineInfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-0 sm:px-4 sm:first:pl-0 lg:border-l lg:border-[#E8E2D9] lg:first:border-l-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F3EE] text-[#725F54]">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C8178]">
          {label}
        </p>
        <p className="mt-1 text-[14px] font-semibold leading-snug text-[#31332C]">
          {value}
        </p>
      </div>
    </div>
  );
}

function VendorPortfolioSection({
  vendorName,
  vendorStudio,
}: {
  vendorName: string;
  vendorStudio: string;
}) {
  return (
    <section className="rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[#E4D8CD] bg-[#FCFBF9] text-[18px] font-semibold text-[#725F54]">
          {vendorName
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[20px] font-semibold text-[#31332C]">
            {vendorName}
          </p>

          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {vendorStudio}
          </p>
        </div>
      </div>
    </section>
  );
}

function MaterialPackageSection({ packages }: { packages: MaterialPackage[] }) {
  return (
    <section className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
        Referensi Material
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {packages.map((item) => (
          <div
            key={item.name}
            className={`rounded-xl p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition ${
              item.name === "Standard"
                ? "bg-[#725F54] text-white"
                : "bg-white text-[#31332C] hover:bg-[#FCFBF9]"
            }`}
          >
            <p
              className={`font-serif text-[26px] leading-tight ${
                item.name === "Standard" ? "text-white" : "text-[#31332C]"
              }`}
            >
              {item.name}
            </p>

            <p
              className={`mt-2 text-[12px] leading-6 ${
                item.name === "Standard" ? "text-white/78" : "text-[#7B756E]"
              }`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryGridSection({
  title,
  images,
  activeIndex,
  onSelect,
}: {
  title: string;
  images: DetailImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
        Gallery Desain
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={`${image.alt}-grid-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
              activeIndex === index ? "ring-2 ring-[#725F54]/25" : "opacity-95 hover:opacity-100"
            }`}
          >
            <ImageWithFallback
              src={image.src}
              alt={`${title} gallery ${index + 1}`}
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function BeforeAfterSection({
  title,
  before,
  after,
}: {
  title: string;
  before: DetailImage;
  after: DetailImage;
}) {
  return (
    <section className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
        Sebelum dan Sesudah
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <BeforeAfterImage label="Sebelum" title={title} image={before} />
        <BeforeAfterImage label="Sesudah" title={title} image={after} />
      </div>
    </section>
  );
}

function BeforeAfterImage({
  label,
  title,
  image,
}: {
  label: string;
  title: string;
  image: DetailImage;
}) {
  return (
    <div className="relative h-[240px] overflow-hidden rounded-xl bg-[#EFE8DF] shadow-[0_8px_24px_rgba(49,51,44,0.025)] sm:h-[300px]">
      <ImageWithFallback
        src={image.src}
        alt={`${label} ${title}`}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#725F54] shadow-sm">
        {label}
      </div>
    </div>
  );
}

function RelatedProjectCard({
  item,
  onOpenRelated,
}: {
  item: DetailRelatedItem;
  onOpenRelated?: (id: string) => void;
}) {
  const cardContent = (
    <>
      <div className="relative aspect-[4/3] bg-[#EFE8DF]">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="truncate text-[14px] font-semibold text-[#31332C]">
          {item.title}
        </h3>

        <p className="mt-1 text-[12px] text-[#7B756E]">{item.style}</p>

        <p className="mt-2 text-[12px] font-semibold text-[#725F54]">
          Nilai Proyek {item.projectValue}
        </p>

        <span className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[12px] font-semibold text-[#725F54] transition group-hover:border-[#725F54] group-hover:bg-[#725F54] group-hover:text-white">
          Lihat Detail
          <ChevronRight size={14} />
        </span>
      </div>
    </>
  );

  const className =
    "group overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:-translate-y-1 hover:border-[#725F54] hover:bg-[#FCFBF9]";

  if (onOpenRelated) {
    return (
      <button
        type="button"
        onClick={() => onOpenRelated(item.id)}
        className={`${className} text-left`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link href={item.href ?? "#"} className={className}>
      {cardContent}
    </Link>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.035)] sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
        {title}
      </p>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E8E2D9] pb-3 last:border-b-0 last:pb-0">
      <span className="text-[12px] text-[#7B756E]">{label}</span>

      <span className="max-w-[210px] text-right text-[12px] font-semibold leading-5 text-[#31332C]">
        {value}
      </span>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] shadow-sm">
      {label}
    </span>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: ImageSource;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(!src);

  return (
    <>
      {hasError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#EFE8DF] px-4 text-center text-[#725F54]">
          <ImageIcon size={28} />

          <p className="text-[12px] font-semibold">Referensi visual</p>

          <p className="text-[11px] text-[#7B756E]">Gambar belum tersedia</p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setHasError(true)}
          className={className}
        />
      )}
    </>
  );
}
