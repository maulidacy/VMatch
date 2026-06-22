"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Home,
  Layers,
  Search,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  memo,
  useDeferredValue,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimateIn } from "@/components/home/animate-in";
import { portfolioProjects } from "@/lib/home-content";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const properties = [
  "Semua Properti",
  "Rumah Tinggal",
  "Apartemen",
  "Kos & Kontrakan",
  "Villa",
  "Hotel",
  "Kantor",
  "Cafe & Resto",
  "Retail & Toko",
  "Commercial Space",
];

const locations = [
  "Semua Lokasi",
  "Jabodetabek",
  "Jawa Barat",
  "Jawa Tengah & DIY",
  "Jawa Timur",
  "Bali",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
];

const styles = [
  "Semua Gaya",
  "Modern Minimalis",
  "Modern Kontemporer",
  "Japandi",
  "Scandinavian",
  "Industrial",
  "Luxury Modern",
  "Klasik Modern",
  "Tropical Modern",
];

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

const materials = [
  "HPL, plywood, solid surface",
  "HPL, MDF, kaca, cermin",
  "Panel dinding, rak TV, lighting",
  "HPL, plywood, MDF",
  "Panel dinding, lighting",
  "Plywood, HPL, panel dinding",
  "Duco, veneer, soft close hardware",
  "Multiplek, HPL premium, LED strip",
];

type PortfolioMeta = {
  style: string;
  propertyType: string;
  locationArea: string;
  projectValue: string;
  material: string;
};

type PortfolioItem = (typeof portfolioProjects)[number] & {
  meta: PortfolioMeta;
};

type FilterState = {
  search: string;
  property: string;
  location: string;
  style: string;
};

let filterState: FilterState = {
  search: "",
  property: "Semua Properti",
  location: "Semua Lokasi",
  style: "Semua Gaya",
};

const filterListeners = new Set<() => void>();

function setFilterState(next: Partial<FilterState>) {
  filterState = { ...filterState, ...next };
  filterListeners.forEach((listener) => listener());
}

function subscribeFilter(listener: () => void) {
  filterListeners.add(listener);
  return () => filterListeners.delete(listener);
}

function getFilterSnapshot() {
  return filterState;
}

function useFilterStore() {
  return useSyncExternalStore(
    subscribeFilter,
    getFilterSnapshot,
    getFilterSnapshot,
  );
}

function getMeta(index: number): PortfolioMeta {
  return {
    style: styles[((index + 1) % (styles.length - 1)) + 1],
    propertyType: properties[((index + 1) % (properties.length - 1)) + 1],
    locationArea: locations[((index + 1) % (locations.length - 1)) + 1],
    projectValue: projectValues[index % projectValues.length],
    material: materials[index % materials.length],
  };
}

function cleanLocation(location: string) {
  return location.replace(/\s*-\s*\d{4}\s*$/, "");
}

const enrichedProjects: PortfolioItem[] = portfolioProjects.map((project, index) => ({
  ...project,
  meta: getMeta(index),
}));

export function PortfolioProjects() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-[1320px]">
        <AnimateIn direction="up" duration={0.7} once={true}>
          <FilterControls />
        </AnimateIn>

        <ProjectGrid />
      </div>
    </section>
  );
}

const FilterControls = memo(function FilterControls() {
  const filter = useFilterStore();
  const [localSearch, setLocalSearch] = useState(filter.search);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.45fr_0.62fr_0.62fr_0.62fr_auto] lg:items-end">
      <div className="col-span-2 lg:col-span-1">
        <label className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-[#8b8179]">
          Cari Proyek
        </label>

        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7d766f]"
          />

          <input
            value={localSearch}
            onChange={(event) => {
              const value = event.target.value;
              setLocalSearch(value);
              setFilterState({ search: value });
            }}
            placeholder="Cari inspirasi..."
            className="h-12 w-full bg-[#f4f4f4] pl-11 pr-4 text-[13px] text-[#31332c] shadow-[0_4px_10px_rgba(0,0,0,0.12)] outline-none transition focus:bg-white"
          />
        </div>
      </div>

      <SelectField
        label="Properti"
        value={filter.property}
        options={properties}
        onChange={(value) => setFilterState({ property: value })}
      />

      <SelectField
        label="Lokasi"
        value={filter.location}
        options={locations}
        onChange={(value) => setFilterState({ location: value })}
      />

      <SelectField
        label="Gaya"
        value={filter.style}
        options={styles}
        onChange={(value) => setFilterState({ style: value })}
      />

      <div className="col-span-2 sm:col-span-1">
        <label className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-transparent">
          Filter
        </label>

        <button
          type="button"
          onClick={() => {
            setLocalSearch("");
            setFilterState({
              search: "",
              property: "Semua Properti",
              location: "Semua Lokasi",
              style: "Semua Gaya",
            });
          }}
          className="h-12 w-full bg-[#6b5b52] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition hover:bg-[#584941]"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
});

const ProjectGrid = memo(function ProjectGrid() {
  const filter = useFilterStore();

  const deferredSearch = useDeferredValue(filter.search);
  const deferredProperty = useDeferredValue(filter.property);
  const deferredLocation = useDeferredValue(filter.location);
  const deferredStyle = useDeferredValue(filter.style);

  const filteredProjects = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();

    return enrichedProjects.filter((project) => {
      const matchSearch =
        keyword.length === 0 ||
        project.title.toLowerCase().includes(keyword) ||
        project.location.toLowerCase().includes(keyword) ||
        project.category.toLowerCase().includes(keyword) ||
        project.meta.style.toLowerCase().includes(keyword) ||
        project.meta.propertyType.toLowerCase().includes(keyword) ||
        project.meta.locationArea.toLowerCase().includes(keyword) ||
        project.meta.material.toLowerCase().includes(keyword);

      const matchProperty =
        deferredProperty === "Semua Properti" ||
        project.meta.propertyType === deferredProperty;

      const matchLocation =
        deferredLocation === "Semua Lokasi" ||
        project.meta.locationArea === deferredLocation;

      const matchStyle =
        deferredStyle === "Semua Gaya" || project.meta.style === deferredStyle;

      return matchSearch && matchProperty && matchLocation && matchStyle;
    });
  }, [deferredSearch, deferredProperty, deferredLocation, deferredStyle]);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredProjects.map((project, index) => (
          <PortfolioCard
            key={`${project.title}-${index}`}
            project={project}
            priority={index < 4}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#E4D8CD] bg-white py-14 text-center">
          <p className="text-[14px] text-[#7B756E]">
            Proyek tidak ditemukan.
          </p>
        </div>
      )}
    </>
  );
});

function PortfolioCard({
  project,
  priority,
}: {
  project: PortfolioItem;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${createSlug(project.title)}`}
      className="group block h-full overflow-hidden rounded-xl border border-[#E8E2D9] bg-white text-left shadow-[0_8px_28px_rgba(49,51,44,0.03)] transition hover:-translate-y-1 hover:border-[#D8CABC] hover:shadow-[0_16px_38px_rgba(49,51,44,0.08)]"
    >
      <article className="h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DF]">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#725F54] shadow-sm backdrop-blur-md">
            {project.meta.style}
          </span>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#725F54] sm:text-[11px]">
                {project.meta.propertyType}
              </span>

              <span className="rounded-full bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                {project.meta.locationArea}
              </span>

              <span className="rounded-full bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
                {cleanLocation(project.location)}
              </span>
            </div>

            <h3 className="mt-3 line-clamp-2 font-serif text-[21px] leading-tight text-[#31332C] sm:text-[24px]">
              {project.title}
            </h3>
          </div>

          <div className="grid gap-2">
            <MetaRow
              icon={Wallet}
              label="Nilai Proyek"
              value={project.meta.projectValue}
            />
            <MetaRow
              icon={Home}
              label="Properti"
              value={project.meta.propertyType}
            />
            <MetaRow
              icon={Layers}
              label="Material"
              value={project.meta.material}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="col-span-1">
      <label className="mb-3 block truncate text-[10px] uppercase tracking-[0.2em] text-[#8b8179]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none bg-[#f4f4f4] px-4 pr-10 text-[13px] text-[#31332c] shadow-[0_4px_10px_rgba(0,0,0,0.12)] outline-none transition focus:bg-white"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b5b52] sm:right-4"
        />
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 rounded-xl bg-[#FCFBF9] px-2.5 py-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-[#725F54]" />

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B756E]">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-[#31332C] sm:text-[12px] sm:leading-5">
          {value}
        </p>
      </div>
    </div>
  );
}
