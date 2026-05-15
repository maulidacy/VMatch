"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimateIn } from "@/components/home/animate-in";
import { FillImage } from "@/components/home/fill-image";
import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";
import { inspirations } from "@/lib/home-content";
import {
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const styles = ["Semua Gaya", "Modern", "Minimalis"];
const properties = ["Semua Properti", "Rumah", "Apartemen"];

type FilterState = {
  search: string;
  style: string;
  property: string;
};

let filterState: FilterState = {
  search: "",
  style: "Semua Gaya",
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

export default function InspirasiDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const activeCategory =
    inspirations.find((item) => createSlug(item.title) === slug) ||
    inspirations[0];

  return (
    <main className="bg-white text-[#31332c]">
      <ResultsSection activeCategory={activeCategory} />
      <ExploreOtherRooms />
      <CTASection activeCategoryTitle={activeCategory.title} />
      <Footer />
    </main>
  );
}

const HeroSection = memo(function HeroSection({
  activeCategory,
  filterBar,
}: {
  activeCategory: (typeof inspirations)[number];
  filterBar: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#191A17] px-4 pb-10 pt-6 text-white sm:px-6 md:pt-8">
      <div className="absolute inset-0 opacity-45">
        <FillImage image={activeCategory.image} sizes="100vw" />
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        <Navbar />

        <AnimateIn direction="up" duration={0.75} once={true}>
          <div className="mt-24 max-w-[760px] md:mt-28">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">
              Inspirasi Ruangan
            </p>

            <h1 className="mt-4 font-serif text-[38px] leading-tight text-white sm:text-[48px] md:text-[60px]">
              Inspirasi {activeCategory.title}
            </h1>

            <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-white/82">
              {activeCategory.copy}
            </p>
          </div>
        </AnimateIn>

        <AnimateIn direction="up" delay={0.18} duration={0.75} once={true}>
          {filterBar}
        </AnimateIn>
      </div>
    </section>
  );
});

function ResultsSection({
  activeCategory,
}: {
  activeCategory: (typeof inspirations)[number];
}) {
  return (
    <>
      <HeroSection activeCategory={activeCategory} filterBar={<FilterBar />} />
      <GallerySection activeCategoryTitle={activeCategory.title} />
    </>
  );
}

const GallerySection = memo(function GallerySection({
  activeCategoryTitle,
}: {
  activeCategoryTitle: string;
}) {
  const filter = useFilterStore();

  const deferredSearch = useDeferredValue(filter.search);
  const deferredStyle = useDeferredValue(filter.style);
  const deferredProperty = useDeferredValue(filter.property);

  const visibleItems = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();
    const categorySlug = createSlug(activeCategoryTitle);

    return galleryItems.filter((item) => {
      const baseTitle = item.title.replace(/\s+\d+$/, "");
      const sameCategory = createSlug(baseTitle) === categorySlug;

      const matchSearch =
        keyword.length === 0 ||
        item.title.toLowerCase().includes(keyword) ||
        item.copy.toLowerCase().includes(keyword);

      const matchStyle =
        deferredStyle === "Semua Gaya" || item.style === deferredStyle;

      const matchProperty =
        deferredProperty === "Semua Properti" ||
        item.property === deferredProperty;

      return sameCategory && matchSearch && matchStyle && matchProperty;
    });
  }, [activeCategoryTitle, deferredSearch, deferredStyle, deferredProperty]);

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16">
      {visibleItems.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {visibleItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/inspirasi/${createSlug(activeCategoryTitle)}/${createSlug(item.title)}`}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[22px] bg-[#f7f4ef] text-left outline-none transition duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#6b5b52]"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={1100}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index <= 1}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
              />

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/25" />

              <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-[16px] bg-white px-4 py-3 text-[14px] font-semibold leading-none text-[#191A17] shadow-lg">
                  <span className="text-[18px] leading-none">↗</span>
                  Lihat detail
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-serif text-[28px] italic text-[#31332c] sm:text-[32px]">
            Inspirasi tidak ditemukan.
          </p>
        </div>
      )}
    </section>
  );
});

const FilterBar = memo(function FilterBar() {
  const filter = useFilterStore();
  const [localSearch, setLocalSearch] = useState(filter.search);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilterState({ search: localSearch });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="mt-12 bg-black/18 p-4 backdrop-blur-sm sm:p-5 md:mt-14 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-[1.35fr_0.55fr_0.55fr_auto] lg:items-end">
        <div className="col-span-2 lg:col-span-1">
          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
            Cari Proyek
          </label>

          <div className="relative">
            <input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Cari inspirasi..."
              className="h-14 w-full bg-white px-12 text-sm text-[#31332c] outline-none placeholder:text-[#b8b2aa] focus:bg-[#f8f6f3]"
            />

            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8178]"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M13.2 13.2L17 17"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <SelectField
          label="Gaya"
          value={filter.style}
          onChange={(value) => setFilterState({ style: value })}
          options={styles}
        />

        <SelectField
          label="Jenis Properti"
          value={filter.property}
          onChange={(value) => setFilterState({ property: value })}
          options={properties}
        />

        <div className="col-span-2 flex justify-center lg:col-span-1 lg:block">
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              setFilterState({
                search: "",
                style: "Semua Gaya",
                property: "Semua Properti",
              });
            }}
            className="h-14 w-full max-w-[260px] bg-[#6b5b52] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#5a4a42] lg:max-w-none"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
});

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full appearance-none border border-[#ded6ca] bg-white px-5 pr-12 text-sm text-[#31332c] outline-none focus:bg-[#f8f6f3]"
        >
          {options.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5b52]"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const ExploreOtherRooms = memo(function ExploreOtherRooms() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 pb-20 sm:px-6">
      <AnimateIn direction="up" duration={0.7} once={true}>
        <h2 className="font-serif text-[32px] leading-tight text-[#31332c] md:text-[42px]">
          Jelajahi Ruang Lain
        </h2>
      </AnimateIn>

      <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-3 md:gap-4">
          {inspirations.map((item, index) => (
            <AnimateIn
              key={item.title}
              direction="up"
              delay={index * 0.08}
              duration={0.65}
              once={true}
            >
              <Link
                href={`/inspirasi/${createSlug(item.title)}`}
                className="group block shrink-0"
              >
                <article className="relative h-[320px] w-[230px] overflow-hidden rounded-xl bg-[#1f1d19] shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_42px_rgba(0,0,0,0.22)] sm:w-[250px] md:h-[360px] md:w-[270px]">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <FillImage image={item.image} sizes="270px" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-serif text-[22px] italic leading-none">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-white/80">
                      {item.copy}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-1.5 border-b border-white/25 pb-1 text-[11px] font-medium text-white/95 transition-all duration-300 group-hover:border-white">
                      Lihat Inspirasi
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      >
                        <path
                          d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>

      <AnimateIn direction="up" delay={0.35} duration={0.65} once={true}>
        <div className="mt-2 flex justify-center gap-2">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-2 rounded-full ${dot === 0 ? "w-6 bg-[#6B3E1E]" : "w-2 bg-[#6B3E1E]/50"
                }`}
            />
          ))}
        </div>
      </AnimateIn>
    </section>
  );
});

const CTASection = memo(function CTASection({
  activeCategoryTitle,
}: {
  activeCategoryTitle: string;
}) {
  return (
    <section className="mx-auto max-w-[900px] px-4 pb-20 sm:px-6">
      <AnimateIn direction="up" duration={0.7} once={true}>
        <div className="bg-[#f4f1ed] px-6 py-10 text-center shadow-[0_12px_35px_rgba(0,0,0,0.1)] sm:px-8 sm:py-12">
          <h2 className="font-serif text-[30px] leading-tight text-[#6b5b52] md:text-[42px]">
            Ingin {activeCategoryTitle.toLowerCase()} seperti ini?
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-7 text-[#797C73]">
            Kami dapat membantu Anda merancang dan mewujudkannya dengan proses
            yang lebih mudah, mulai dari konsultasi desain hingga pemasangan
            akhir.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/#kontak"
              className="inline-flex justify-center bg-[#6b5b52] px-9 py-4 text-[12px] uppercase tracking-[0.16em] text-white"
            >
              Mulai Proyek
            </Link>

            <a
              href="https://wa.me/6281234567890"
              className="inline-flex justify-center border border-[#6b5b52]/55 px-9 py-4 text-[12px] uppercase tracking-[0.16em] text-[#6b5b52]"
            >
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
});