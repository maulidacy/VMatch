export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export type Project = {
  title: string;
  location: string;
  image: ImageAsset;
};

export type InspirationArea = {
  title: string;
  description: string;
  services: string[];
  image: ImageAsset;
};

export type InspirationCategory = {
  title: string;
  slug: string;
  copy: string;
  image: ImageAsset;
  areas: InspirationArea[];
};

export type Step = {
  number: string;
  title: string;
  copy: string;
};

export type Feature = {
  icon: string;
  title: string;
  copy: string;
};

export type Offer = {
  eyebrow: string;
  title: string;
  image: ImageAsset;
  className?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  project: string;
  image: ImageAsset;
};

export const heroThumbs: ImageAsset[] = [
  {
    src: "/inspirations/rumah-ruang-tamu.webp",
    alt: "Modern home living room",
    width: 1200,
    height: 900,
  },
  {
    src: "/inspirations/rumah-kamar-tidur.webp",
    alt: "Warm home bedroom interior",
    width: 1200,
    height: 900,
  },
  {
    src: "/inspirations/apartment-living-area.webp",
    alt: "Clean home kitchen interior",
    width: 1200,
    height: 900,
  },
];

export const projects: Project[] = [
  {
    title: "Walnut Brutalism",
    location: "Jakarta Selatan - 2024",
    image: {
      src: "/figma/project-walnut.webp",
      alt: "Walnut kitchen with marble island",
      width: 736,
      height: 1104,
      className: "object-[center_27%]",
    },
  },
  {
    title: "The Nordic Loft",
    location: "Bali - 2023",
    image: {
      src: "/figma/project-loft.webp",
      alt: "Nordic loft interior with sofa and timber wall",
      width: 736,
      height: 1037,
      className: "object-[center_49%]",
    },
  },
  {
    title: "Library of Silence",
    location: "Yogyakarta - 2023",
    image: {
      src: "/figma/project-library.webp",
      alt: "Interior library wall with warm lighting",
      width: 736,
      height: 736,
      className: "object-[center_9%]",
    },
  },
  {
    title: "Urban Minimalist",
    location: "Jakarta Pusat - 2024",
    image: {
      src: "/inspirations/rumah-ruang-tamu.webp",
      alt: "Minimalist living room",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Modern Culinary",
    location: "Tangerang - 2023",
    image: {
      src: "/inspirations/rumah-dapur.webp",
      alt: "Modern kitchen design",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Grand Lobby",
    location: "Surabaya - 2024",
    image: {
      src: "/inspirations/hotel-lobby.webp",
      alt: "Grand hotel lobby",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Compact Living",
    location: "Bandung - 2024",
    image: {
      src: "/inspirations/apartment-living-area.webp",
      alt: "Compact apartment living area",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Serene Sleep",
    location: "Jakarta Barat - 2023",
    image: {
      src: "/inspirations/apartment-bedroom.webp",
      alt: "Serene apartment bedroom",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Executive Suite",
    location: "Bali - 2024",
    image: {
      src: "/inspirations/hotel-room.webp",
      alt: "Executive hotel suite",
      width: 1200,
      height: 900,
    },
  },
  {
    title: "Communal Hub",
    location: "Malang - 2023",
    image: {
      src: "/inspirations/boarding-common-area.webp",
      alt: "Communal area for boarding house",
      width: 1200,
      height: 900,
    },
  },
];

export const inspirations: InspirationCategory[] = [
  {
    title: "Rumah",
    slug: "rumah",
    copy: "Inspirasi interior rumah untuk ruang keluarga yang nyaman, rapi, dan terasa personal.",
    image: {
      src: "/inspirations/rumah-hero.webp",
      alt: "Warm modern home interior",
      width: 1400,
      height: 1000,
    },
    areas: [
      {
        title: "Ruang Tamu",
        description: "Area pertama yang membangun kesan rumah: nyaman untuk menerima tamu dan tetap enak dipakai harian.",
        services: ["Layout furniture", "Backdrop TV atau wall panel", "Loose furniture selection", "Lighting ambience"],
        image: {
          src: "/inspirations/rumah-ruang-tamu.webp",
          alt: "Modern home living room",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Kamar Tidur",
        description: "Kamar yang lebih tenang dengan storage cukup, material hangat, dan alur gerak yang tidak sempit.",
        services: ["Headboard custom", "Wardrobe built-in", "Meja rias atau meja kerja", "Layering lampu tidur"],
        image: {
          src: "/inspirations/rumah-kamar-tidur.webp",
          alt: "Warm home bedroom interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Dapur",
        description: "Dapur rumah yang rapi, mudah dibersihkan, dan disesuaikan dengan kebiasaan memasak keluarga.",
        services: ["Kitchen set atas bawah", "Top table dan backsplash", "Storage alat masak", "Lighting area kerja"],
        image: {
          src: "/inspirations/rumah-dapur.webp",
          alt: "Clean home kitchen interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Kamar Mandi",
        description: "Kamar mandi yang fungsional dengan pemilihan material tahan lembap dan detail penyimpanan yang rapi.",
        services: ["Vanity cabinet", "Mirror cabinet", "Niche storage", "Material dan finishing basah"],
        image: {
          src: "/inspirations/rumah-kamar-mandi.webp",
          alt: "Modern home bathroom interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Wardrobe",
        description: "Penyimpanan pakaian yang disusun berdasarkan kebutuhan pemilik rumah, bukan sekadar lemari besar.",
        services: ["Pembagian gantung dan lipat", "Drawer accessories", "Cermin dan lighting", "Finishing panel"],
        image: {
          src: "/inspirations/rumah-wardrobe.webp",
          alt: "Home wardrobe storage",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Ruang Keluarga",
        description: "Ruang santai yang hangat untuk berkumpul, menonton, dan menyimpan kebutuhan aktivitas keluarga.",
        services: ["TV cabinet", "Panel dinding", "Storage mainan atau buku", "Sofa dan coffee table"],
        image: {
          src: "/inspirations/rumah-ruang-keluarga.webp",
          alt: "Home family room interior",
          width: 1200,
          height: 900,
        },
      },
    ],
  },
  {
    title: "Apartment",
    slug: "apartment",
    copy: "Solusi interior apartment yang ringkas, efisien, dan terasa lega meski luas terbatas.",
    image: {
      src: "/inspirations/apartment-hero.webp",
      alt: "Modern apartment interior",
      width: 1400,
      height: 1000,
    },
    areas: [
      {
        title: "Studio Layout",
        description: "Zoning ruang tidur, santai, kerja, dan makan dalam satu area tanpa membuat ruangan terasa penuh.",
        services: ["Space planning", "Partisi ringan", "Furniture multifungsi", "Sirkulasi ruang kecil"],
        image: {
          src: "/inspirations/apartment-studio-layout.webp",
          alt: "Compact studio apartment layout",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Kitchen Set Compact",
        description: "Kitchen set kecil yang tetap lengkap untuk kebutuhan harian, dengan storage vertikal yang maksimal.",
        services: ["Kabinet modular", "Top table compact", "Rak bumbu dan alat masak", "Area sink dan kompor"],
        image: {
          src: "/inspirations/apartment-kitchen-set.webp",
          alt: "Compact apartment kitchen set",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Bedroom",
        description: "Kamar apartment yang tenang dengan storage tersembunyi agar ruangan tetap terasa lapang.",
        services: ["Bedframe storage", "Wardrobe sliding", "Panel headboard", "Lampu baca dan ambience"],
        image: {
          src: "/inspirations/apartment-bedroom.webp",
          alt: "Apartment bedroom interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Living Area",
        description: "Area duduk yang nyaman untuk menerima tamu sekaligus menjadi ruang santai harian.",
        services: ["Sofa sizing", "TV console", "Wall shelf", "Karpet dan coffee table"],
        image: {
          src: "/inspirations/apartment-living-area.webp",
          alt: "Apartment living area interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Storage",
        description: "Solusi penyimpanan yang menyatu dengan dinding dan sudut agar barang tidak terlihat berantakan.",
        services: ["Kabinet tinggi", "Hidden storage", "Open shelf", "Finishing anti lembap"],
        image: {
          src: "/inspirations/apartment-storage.webp",
          alt: "Apartment storage interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Laundry Corner",
        description: "Area cuci kecil yang tetap rapi, mudah dipakai, dan aman dari cipratan air.",
        services: ["Kabinet mesin cuci", "Rak deterjen", "Counter lipat", "Ventilasi dan material tahan air"],
        image: {
          src: "/inspirations/apartment-laundry.webp",
          alt: "Apartment laundry corner",
          width: 1200,
          height: 900,
        },
      },
    ],
  },
  {
    title: "Hotel",
    slug: "hotel",
    copy: "Konsep interior hospitality yang menjaga pengalaman tamu sejak lobby sampai kamar.",
    image: {
      src: "/inspirations/hotel-hero.webp",
      alt: "Hotel interior and pool area",
      width: 1400,
      height: 1000,
    },
    areas: [
      {
        title: "Lobby",
        description: "Area penyambutan dengan kesan brand yang kuat, alur tamu jelas, dan titik tunggu yang nyaman.",
        services: ["Reception flow", "Lounge furniture", "Feature wall", "Decor dan lighting"],
        image: {
          src: "/inspirations/hotel-lobby.webp",
          alt: "Hotel lobby interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Kamar Hotel",
        description: "Kamar yang efisien untuk operasional, nyaman untuk tamu, dan tahan terhadap pemakaian intensif.",
        services: ["Headboard panel", "Built-in desk", "Wardrobe dan luggage rack", "Material durable"],
        image: {
          src: "/inspirations/hotel-room.webp",
          alt: "Hotel room interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Bathroom Vanity",
        description: "Vanity kamar hotel yang bersih, mudah dirawat, dan punya detail pencahayaan yang flattering.",
        services: ["Vanity counter", "Mirror lighting", "Storage amenities", "Material tahan air"],
        image: {
          src: "/inspirations/hotel-bathroom-vanity.webp",
          alt: "Hotel bathroom vanity",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Corridor",
        description: "Koridor yang tidak terasa kosong, dengan pencahayaan terarah dan signage yang mudah dibaca.",
        services: ["Wall treatment", "Wayfinding", "Carpet atau flooring", "Lampu orientasi"],
        image: {
          src: "/inspirations/hotel-corridor.webp",
          alt: "Hotel corridor interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Restaurant / Cafe Area",
        description: "Area makan yang nyaman untuk breakfast, kerja singkat, atau meeting santai tamu hotel.",
        services: ["Table layout", "Banquette seating", "Buffet counter", "Accent lighting"],
        image: {
          src: "/inspirations/hotel-restaurant.webp",
          alt: "Hotel restaurant interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Reception Desk",
        description: "Meja resepsionis yang rapi secara visual dan tetap mendukung kebutuhan kerja staf.",
        services: ["Counter design", "Cable management", "Backwall branding", "Storage dokumen"],
        image: {
          src: "/inspirations/hotel-reception.webp",
          alt: "Hotel reception desk",
          width: 1200,
          height: 900,
        },
      },
    ],
  },
  {
    title: "Kos / Boarding House",
    slug: "kos-boarding-house",
    copy: "Interior kos yang tahan pakai, mudah dirawat, dan tetap nyaman untuk penghuni.",
    image: {
      src: "/inspirations/boarding-hero.webp",
      alt: "Boarding house bedroom interior",
      width: 1400,
      height: 1000,
    },
    areas: [
      {
        title: "Kamar Kos",
        description: "Kamar compact dengan kebutuhan dasar lengkap: tidur, belajar, menyimpan barang, dan bergerak nyaman.",
        services: ["Bedframe storage", "Meja belajar", "Wardrobe compact", "Finishing tahan pakai"],
        image: {
          src: "/inspirations/boarding-room.webp",
          alt: "Boarding house room interior",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Kamar Mandi",
        description: "Kamar mandi yang mudah dibersihkan, minim sudut kotor, dan aman untuk pemakaian jangka panjang.",
        services: ["Vanity sederhana", "Rak toiletries", "Partisi shower", "Material anti lembap"],
        image: {
          src: "/inspirations/boarding-bathroom.webp",
          alt: "Boarding house bathroom",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Pantry Bersama",
        description: "Pantry komunal yang tertata agar penghuni bisa memakai area bersama tanpa cepat berantakan.",
        services: ["Kabinet pantry", "Counter preparation", "Rak alat makan", "Area sink"],
        image: {
          src: "/inspirations/boarding-pantry.webp",
          alt: "Shared boarding house pantry",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Area Laundry",
        description: "Area laundry yang memisahkan kebutuhan cuci, jemur, dan penyimpanan agar sirkulasi tetap rapi.",
        services: ["Rak laundry", "Counter lipat", "Zona mesin cuci", "Material tahan air"],
        image: {
          src: "/inspirations/boarding-laundry.webp",
          alt: "Boarding house laundry area",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Common Area",
        description: "Area bersama yang nyaman untuk menunggu, kerja singkat, atau bersosialisasi antar penghuni.",
        services: ["Bench seating", "Meja komunal", "Wall shelf", "Lighting hemat energi"],
        image: {
          src: "/inspirations/boarding-common-area.webp",
          alt: "Boarding house common area",
          width: 1200,
          height: 900,
        },
      },
      {
        title: "Storage",
        description: "Penyimpanan tambahan untuk kebutuhan operasional kos tanpa mengganggu area penghuni.",
        services: ["Lemari linen", "Storage cleaning tools", "Rak utilitas", "Labeling dan akses"],
        image: {
          src: "/inspirations/boarding-storage.webp",
          alt: "Boarding house storage area",
          width: 1200,
          height: 900,
        },
      },
    ],
  },
];

export const steps: Step[] = [
  {
    number: "01",
    title: "Kirim kebutuhan proyek",
    copy: "Ceritakan visi, preferensi, dan spesifikasi ruangan yang ingin Anda transformasikan.",
  },
  {
    number: "02",
    title: "Kami siapkan solusi terbaik",
    copy: "Tim ahli kami merancang proposal komprehensif mulai dari konsep hingga estimasi biaya.",
  },
  {
    number: "03",
    title: "Proyek berjalan hingga selesai",
    copy: "Duduk manis sementara kami mengawasi pengerjaan hingga kunci diserahkan ke tangan Anda.",
  },
];

export const features: Feature[] = [
  {
    icon: "spark",
    title: "Tidak perlu mencari vendor sendiri",
    copy: "Kami telah bermitra dengan pengrajin dan penyedia material terbaik yang sudah teruji.",
  },
  {
    icon: "seal",
    title: "Solusi sudah dikurasi",
    copy: "Setiap pilihan material dan desain melewati filter estetika tim ahli kami.",
  },
  {
    icon: "flow",
    title: "Proses lebih terstruktur",
    copy: "Dari desain hingga instalasi, semua memiliki linimasa yang jelas dan pasti.",
  },
  {
    icon: "chart",
    title: "Progres transparan",
    copy: "Anda akan mendapatkan laporan berkala secara rutin tanpa harus menanyakan.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Kitchen set jadi rapi dan presisi. Dari desain, material, sampai pemasangan semuanya jelas jadwalnya.",
    author: "Nadya P.",
    project: "Kitchen Set Apartemen - Jakarta Selatan",
    image: {
      src: "/testimonials/client-1.webp",
      alt: "Portrait of Nadya P.",
      width: 240,
      height: 240,
    },
  },
  {
    quote:
      "VMatch bantu pilih vendor dan material sesuai budget. Update progresnya jelas, hasil ruang keluarga terasa hangat.",
    author: "Bagas R.",
    project: "Ruang Keluarga & Storage - Tangerang",
    image: {
      src: "/testimonials/client-2.webp",
      alt: "Portrait of Bagas R.",
      width: 240,
      height: 240,
    },
  },
  {
    quote:
      "Wardrobe custom selesai rapi. Pengukuran detail, material cocok, dan finishing terlihat elegan.",
    author: "Clara W.",
    project: "Wardrobe Custom - Bandung",
    image: {
      src: "/testimonials/client-3.webp",
      alt: "Portrait of Clara W.",
      width: 240,
      height: 240,
    },
  },
];

export const offers: Offer[] = [
  {
    eyebrow: "Upgrade ruang Anda jadi lebih elegan & modern.",
    title: "DISKON SPESIAL hingga 15%",
    image: {
      src: "/figma/offer-office.webp",
      alt: "Elegant office corner",
      width: 736,
      height: 920,
    },
    className: "lg:row-span-2",
  },
  {
    eyebrow: "Penawaran Eksklusif Minggu Ini",
    title: "Diskon spesial untuk project interior pilihan",
    image: {
      src: "/figma/offer-closet-top.webp",
      alt: "Modern walk-in closet with soft lighting",
      width: 736,
      height: 736,
      className: "object-[center_74%]",
    },
  },
  {
    eyebrow: "Penawaran Eksklusif Minggu Ini",
    title: "Elegan. Rapi. Berkelas.",
    image: {
      src: "/figma/offer-closet-bottom.webp",
      alt: "Luxury closet interior detail",
      width: 736,
      height: 736,
      className: "object-[center_74%]",
    },
  },
];
