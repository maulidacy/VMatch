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
import { Home, Layers, Wallet } from "lucide-react";
import Image from "next/image";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

type FilterState = {
  search: string;
  style: string;
  property: string;
  location: string;
};

const locations = [
  "Semua Lokasi",
  "Jabodetabek",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Sumatera Utara",
  "Sulawesi Selatan",
];

let filterState: FilterState = {
  search: "",
  style: "Semua Gaya",
  property: "Semua Properti",
  location: "Semua Lokasi",
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

const locationList = [
  "Jabodetabek",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Sumatera Utara",
  "Sulawesi Selatan",
];

const galleryItems = inspirations.flatMap((item, index) => [
  {
    ...item,
    id: `${createSlug(item.title)}-${index}-main`,
    title: item.title,
    style: styles[(index % (styles.length - 1)) + 1],

    property: properties[(index % (properties.length - 1)) + 1],
    location: locationList[index % locationList.length]
  },
  {
    ...item,
    id: `${createSlug(item.title)}-${index}-alt`,
    title: `${item.title} ${index + 1}`,
    style: index % 2 === 0 ? "Minimalis" : "Modern",
    property: index % 2 === 0 ? "Rumah" : "Apartemen",
    location: locationList[index % locationList.length]
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
  const deferredLocation = useDeferredValue(filter.location);

  const visibleItems = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();
    const categorySlug = createSlug(activeCategoryTitle);

    return galleryItems.filter((item) => {
      const baseTitle = item.title.replace(/\s+\d+$/, "");
      const sameCategory = createSlug(baseTitle) === categorySlug;

      const matchLocation =
        deferredLocation === "Semua Lokasi" ||
        item.location === deferredLocation;

      const matchSearch =
        keyword.length === 0 ||
        item.title.toLowerCase().includes(keyword) ||
        item.copy.toLowerCase().includes(keyword);

      const matchStyle =
        deferredStyle === "Semua Gaya" || item.style === deferredStyle;

      const matchProperty =
        deferredProperty === "Semua Properti" ||
        item.property === deferredProperty;

      return (
        sameCategory &&
        matchSearch &&
        matchStyle &&
        matchProperty &&
        matchLocation
      );
    });
  }, [
    activeCategoryTitle,
    deferredSearch,
    deferredStyle,
    deferredProperty,
    deferredLocation,
  ]);

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16">
      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleItems.map((item, index) => (
            <InspirationLandingCard
              key={item.id}
              item={item}
              activeCategoryTitle={activeCategoryTitle}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#E4D8CD] bg-white py-14 text-center">
          <p className="text-[14px] text-[#7B756E]">
            Belum ada inspirasi yang cocok dengan filter ini.
          </p>
        </div>
      )}
    </section>
  );
});

function InspirationLandingCard({
  item,
  activeCategoryTitle,
  priority,
}: {
  item: (typeof galleryItems)[number];
  activeCategoryTitle: string;
  priority?: boolean;
}) {
  const packageLabel = item.title.toLowerCase().includes("premium")
    ? "Premium"
    : item.title.toLowerCase().includes("basic")
      ? "Basic"
      : "Standard";

  const vendorName = item.title.toLowerCase().includes("wardrobe") ||
    item.title.toLowerCase().includes("lemari")
    ? "Kayu Rapi Interior"
    : item.title.toLowerCase().includes("dapur") ||
      item.title.toLowerCase().includes("kitchen")
      ? "Dapur Rapi Studio"
      : "Vendor Partner VMatch";

  const projectValue =
    activeCategoryTitle === "Kitchen Set"
      ? "Rp43.500.000"
      : activeCategoryTitle === "Lemari/Wardrobe"
        ? "Rp38.000.000"
        : activeCategoryTitle === "Ruang Tamu"
          ? "Rp55.000.000"
          : activeCategoryTitle === "Storage & Rak"
            ? "Rp28.500.000"
            : "Rp35.000.000";

  const suitableFor =
    activeCategoryTitle === "Kitchen Set"
      ? "Dapur rumah, apartemen"
      : activeCategoryTitle === "Lemari/Wardrobe"
        ? "Kamar utama, kamar anak"
        : activeCategoryTitle === "Ruang Tamu"
          ? "Rumah tinggal, apartemen"
          : activeCategoryTitle === "Storage & Rak"
            ? "Kamar, ruang keluarga, apartemen"
            : "Rumah, apartemen";

  const materials =
    activeCategoryTitle === "Kitchen Set"
      ? "HPL, plywood, solid surface"
      : activeCategoryTitle === "Lemari/Wardrobe"
        ? "HPL, MDF, kaca, cermin"
        : activeCategoryTitle === "Ruang Tamu"
          ? "Panel dinding, rak TV, lighting"
          : activeCategoryTitle === "Storage & Rak"
            ? "HPL, plywood, MDF"
            : "HPL, panel dinding, lighting";

  return (
    <Link
      href={`/inspirasi/${createSlug(activeCategoryTitle)}/${createSlug(item.title)}`}
      className="group block overflow-hidden rounded-xl border border-[#E8E2D9] bg-white text-left shadow-[0_8px_28px_rgba(49,51,44,0.03)] transition hover:border-[#E4D8CD] hover:shadow-[0_12px_32px_rgba(49,51,44,0.06)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DF]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-2.5 py-1 text-[10px] font-semibold text-[#725F54] sm:text-[11px]">
              {packageLabel}
            </span>

            <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
              {item.style}
            </span>

            <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
              {item.property}
            </span>

            <span className="rounded-full bg-[#FCFBF9] px-2 py-1 text-[10px] font-medium text-[#7B756E] sm:text-[11px]">
              {item.location}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[20px] leading-tight text-[#31332C] sm:text-[24px]">
            {item.title}
          </h2>

          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725F54]">
            {vendorName}
          </p>

          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#7B756E] sm:text-[13px] sm:leading-6">
            {item.copy}
          </p>
        </div>

        <div className="grid gap-2">
          <MetaInfo icon={Wallet} label="Nilai Proyek" value={projectValue} />
          <MetaInfo icon={Home} label="Cocok" value={suitableFor} />
          <MetaInfo icon={Layers} label="Material" value={materials} />
        </div>

        <div className="grid gap-2">
          <span className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-3 text-[11px] font-semibold text-[#31332C] transition group-hover:bg-[#FCFBF9] sm:text-[12px]">
            Lihat Detail
            <span className="text-[14px] leading-none">›</span>
          </span>

          <span className="inline-flex h-10 items-center justify-center rounded-xl bg-[#725F54] px-3 text-[11px] font-semibold text-white transition group-hover:bg-[#5A4A42] sm:text-[12px]">
            Gunakan sebagai Preferensi
          </span>
        </div>
      </div>
    </Link>
  );
}

function MetaInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
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
    <div className="mt-12 p-4 sm:p-5 md:mt-14 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_auto] lg:items-end">
        <div className="col-span-2 lg:col-span-1">
          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
            Cari Inspirasi
          </label>

          <div className="relative">
            <input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Kitchen set, apartemen, kantor, hotel..."
              className="h-14 w-full bg-white px-12 text-sm text-[#31332c] outline-none placeholder:text-[#b8b2aa] focus:bg-[#f8f6f3]"
            />

            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8178]"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="9"
                cy="9"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
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
          label="Properti"
          value={filter.property}
          onChange={(value) => setFilterState({ property: value })}
          options={properties}
        />

        <SelectField
          label="Lokasi"
          value={filter.location}
          onChange={(value) => setFilterState({ location: value })}
          options={locations}
        />

        <SelectField
          label="Gaya"
          value={filter.style}
          onChange={(value) => setFilterState({ style: value })}
          options={styles}
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
                location: "Semua Lokasi",
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
