"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
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

const categories = ["Semua Kategori", "Bedroom", "Kitchen", "Living Room"];
const properties = ["Semua Properti", "Rumah", "Apartemen", "Villa"];

type FilterState = {
  search: string;
  category: string;
  property: string;
};

let filterState: FilterState = {
  search: "",
  category: "Semua Kategori",
  property: "Semua Properti",
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
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-[1.5fr_0.55fr_0.55fr_auto] lg:items-end">
      <div className="col-span-3 lg:col-span-1">
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
        label="Kategori"
        value={filter.category}
        options={categories}
        onChange={(value) => setFilterState({ category: value })}
      />

      <SelectField
        label="Properti"
        value={filter.property}
        options={properties}
        onChange={(value) => setFilterState({ property: value })}
      />

      <div className="col-span-1">
        <label className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-transparent">
          Filter
        </label>

        <button
          type="button"
          onClick={() => {
            setLocalSearch("");
            setFilterState({
              search: "",
              category: "Semua Kategori",
              property: "Semua Properti",
            });
          }}
          className="h-12 w-full bg-[#6b5b52] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition hover:bg-[#584941]"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );
});

const ProjectGrid = memo(function ProjectGrid() {
  const filter = useFilterStore();

  const deferredSearch = useDeferredValue(filter.search);
  const deferredCategory = useDeferredValue(filter.category);
  const deferredProperty = useDeferredValue(filter.property);

  const filteredProjects = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();

    return portfolioProjects.filter((project) => {
      const matchSearch =
        keyword.length === 0 ||
        project.title.toLowerCase().includes(keyword) ||
        project.location.toLowerCase().includes(keyword) ||
        project.category.toLowerCase().includes(keyword);

      const matchCategory =
        deferredCategory === "Semua Kategori" ||
        project.category === deferredCategory;

      const matchProperty =
        deferredProperty === "Semua Properti" ||
        project.property === deferredProperty;

      return matchSearch && matchCategory && matchProperty;
    });
  }, [deferredSearch, deferredCategory, deferredProperty]);

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProjects.map((project, index) => (
          <Link
            key={project.title}
            href={`/portfolio/${createSlug(project.title)}`}
            className="group block bg-[#f4f4f4] shadow-[0_4px_10px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={index < 4 ? "eager" : "lazy"}
                className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-90"
              />
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[8px] uppercase tracking-[0.14em] text-[#8b8179] sm:text-[10px]">
                {project.category}
              </p>

              <h3 className="mt-2 line-clamp-2 font-serif text-[16px] leading-snug text-[#31332c] sm:text-[20px]">
                {project.title}
              </h3>

              <p className="mt-2 text-[11px] text-[#8b8179] sm:mt-3 sm:text-[13px]">
                {project.location} - {project.year}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-serif text-[26px] italic text-[#31332c] sm:text-[30px]">
            Proyek tidak ditemukan.
          </p>
        </div>
      )}
    </>
  );
});

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