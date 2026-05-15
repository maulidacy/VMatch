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

export type Inspiration = {
  title: string;
  copy: string;
  image: ImageAsset;
};

export type Service = {
  number: string;
  title: string;
  copy: string;
  icon: "consultation" | "planning" | "monitoring" | "realization";
};

export type Step = {
  number: string;
  title: string;
  copy: string;
};

export type StatItem = {
  icon: string;
  value: string;
  label: string;
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

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  hours: string;
};

export type PortfolioProject = {
  title: string;
  category: string;
  property: string;
  location: string;
  year: string;
  description: string;
  secondDescription: string;
  material: string;
  concept: string;
  advantage: string;
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

export const stats: StatItem[] = [
  {
    icon: "spark",
    value: "150+",
    label: "Proyek interior selesai",
  },
  {
    icon: "flow",
    value: "120+",
    label: "Klien rumah & bisnis",
  },
  {
    icon: "seal",
    value: "10+",
    label: "Tahun pengalaman tim",
  },
  {
    icon: "chart",
    value: "4",
    label: "Kategori properti utama",
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Kitchen Set Walnut Modern",
    category: "Kitchen Set",
    property: "Rumah",
    location: "Jakarta Selatan",
    year: "2024",
    description:
      "Eksplorasi materialitas dan fungsi. Proyek ini mendefinisikan kembali jantung rumah dengan penggunaan material kayu walnut alami yang memberikan kehangatan organik di tengah estetika minimalis.",
    secondDescription:
      "Setiap garis dirancang untuk ketenangan visual, menyembunyikan kompleksitas teknis di balik panel kabinet yang mulus, menciptakan ruang yang bukan hanya untuk memasak, tapi juga untuk berkumpul.",
    material:
      "Walnut wood pilihan dengan serat lurus yang memberi tekstur premium dan durabilitas tinggi.",
    concept:
      "Minimalis modern yang mengutamakan kebersihan visual melalui integrasi kabinet tersembunyi.",
    advantage:
      "Layout ergonomis yang mengoptimalkan alur kerja dapur untuk efisiensi aktivitas harian.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777568553/Dapur_Walnut_Modern_g505wp.png",
      alt: "Dapur modern dengan kabinet walnut dan meja island marmer",
      width: 736,
      height: 1104,
      className: "object-[center_27%]",
    },
  },
  {
    title: "Wardrobe Minimalis",
    category: "Bedroom",
    property: "Rumah",
    location: "Semarang",
    year: "2025",
    description:
      "Wardrobe custom minimalis yang dirancang untuk memaksimalkan penyimpanan tanpa membuat ruangan terasa penuh.",
    secondDescription:
      "Desain dibuat dengan garis bersih, pembagian ruang yang fungsional, serta tampilan visual yang tetap rapi dan elegan.",
    material:
      "Material panel berkualitas dengan finishing halus yang mudah dirawat dan tahan untuk penggunaan harian.",
    concept:
      "Konsep minimalis modern dengan fokus pada penyimpanan tersembunyi dan tampilan ruang yang lebih bersih.",
    advantage:
      "Ruang penyimpanan lebih tertata, pakaian mudah diakses, dan kamar terasa lebih rapi.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570068/Wardrobe_Minimalis_b2nte7.png",
      alt: "Wardrobe minimalis modern",
      width: 736,
      height: 1037,
      className: "object-[center_49%]",
    },
  },
  {
    title: "Lemari Display",
    category: "Storage & Rak",
    property: "Rumah",
    location: "Yogyakarta",
    year: "2025",
    description:
      "Ruang display dengan atmosfer tenang melalui rak custom, pencahayaan hangat, serta detail panel yang rapi.",
    secondDescription:
      "Setiap ambalan dirancang untuk menonjolkan koleksi tanpa membuat ruang terasa penuh, menjaga keseimbangan antara fungsi penyimpanan dan estetika.",
    material:
      "Panel kayu hangat dengan lighting terintegrasi dan finishing halus.",
    concept:
      "Display cabinet modern yang menyatukan fungsi pajangan, penyimpanan, dan suasana ruang yang lebih elegan.",
    advantage:
      "Koleksi lebih tertata, mudah dijangkau, dan menjadi elemen dekoratif utama ruangan.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570214/Lemari_Display_quafgs.png",
      alt: "Lemari display modern",
      width: 736,
      height: 736,
      className: "object-[center_9%]",
    },
  },
  {
    title: "Backdrop TV Modern",
    category: "Living Room",
    property: "Rumah",
    location: "Bandung",
    year: "2026",
    description:
      "Area ruang keluarga dengan backdrop TV custom, pencahayaan aksen, dan komposisi simetris untuk menghadirkan kesan elegan.",
    secondDescription:
      "Desain ini memadukan penyimpanan tertutup dan panel dekoratif sehingga ruangan tetap terlihat rapi namun tetap memiliki karakter visual.",
    material:
      "Kayu finishing natural, panel dekoratif, dan lampu aksen warm white.",
    concept:
      "Backdrop modern dengan fokus pada komposisi visual, penyimpanan rapi, dan atmosfer ruang yang hangat.",
    advantage:
      "Area TV tampil lebih premium tanpa mengorbankan fungsi penyimpanan.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570711/Backdrop_TV_modern_qwpq5j.png",
      alt: "Backdrop TV modern",
      width: 736,
      height: 736,
      className: "object-[center_9%]",
    },
  },
];

export const projects: Project[] = [
  {
    title: "Kitchen Set Walnut Modern",
    location: "Jakarta Selatan - 2024",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777568553/Dapur_Walnut_Modern_g505wp.png",
      alt: "Dapur modern dengan kabinet walnut dan meja island marmer",
      width: 736,
      height: 1104,
      className: "object-[center_27%]",
    },
  },
  {
    title: "Wardrobe Minimalis",
    location: "Semarang - 2025",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570068/Wardrobe_Minimalis_b2nte7.png",
      alt: "Interior loteng bergaya Nordik dengan sofa dan dinding kayu",
      width: 736,
      height: 1037,
      className: "object-[center_49%]",
    },
  },
  {
    title: "Lemari Display",
    location: "Yogyakarta - 2025",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570214/Lemari_Display_quafgs.png",
      alt: "Ruang perpustakaan dengan pencahayaan hangat dan rak dekoratif",
      width: 736,
      height: 736,
      className: "object-[center_9%]",
    },
  },
  {
    title: "Backdrop TV Modern",
    location: "Bandung - 2026",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777570711/Backdrop_TV_modern_qwpq5j.png",
      alt: "Ruang koleksi interior dengan rak kayu dan pencahayaan hangat",
      width: 736,
      height: 736,
      className: "object-[center_9%]",
    },
  },
];

export const inspirations: Inspiration[] = [
  {
    title: "Storage & Rak",
    copy: "Solusi penyimpanan rapi dan efisien.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777572091/storage_gjjkhl.png",
      alt: "Storage dan rak interior",
      width: 736,
      height: 1104,
    },
  },
  {
    title: "Kitchen Set",
    copy: "Inspirasi dapur cantik yang fungsional, bersih, dan elegan.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777571859/white_kitchen_ugkcsg.png",
      alt: "Kitchen set modern",
      width: 736,
      height: 1104,
    },
  },
  {
    title: "Lemari/Wardrobe",
    copy: "Penyimpanan rapi dan efisien yang menyesuaikan kebutuhan ruang.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777571657/Lemari_Wardrobe_gk7pdx.png",
      alt: "Lemari wardrobe modern",
      width: 736,
      height: 1104,
    },
  },
  {
    title: "Ruang Tamu",
    copy: "Ruang santai yang nyaman dengan suasana hangat dan elegan.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777572162/ruang_tamu_qpmb5k.png",
      alt: "Ruang tamu modern",
      width: 736,
      height: 736,
    },
  },
  {
    title: "Ruang Kerja",
    copy: "Ruang kerja yang nyaman dan mendukung produktivitas.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777572294/ruang_kerja_iy3ebf.png",
      alt: "Ruang kerja interior",
      width: 736,
      height: 1104,
    },
  },
  {
    title: "Kamar Tidur",
    copy: "Ruang istirahat yang nyaman dan menenangkan.",
    image: {
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777572362/kamar_tidur_cgnbcn.png",
      alt: "Kamar tidur modern",
      width: 736,
      height: 1104,
    },
  },
];

export const services: Service[] = [
  {
    number: "01",
    title: "Konsultasi Proyek",
    copy: "Sampaikan kebutuhan interior, referensi desain, ukuran ruang, dan preferensi awal dengan mudah.",
    icon: "consultation",
  },
  {
    number: "02",
    title: "Perencanaan Solusi",
    copy: "Kami membantu menyusun arahan desain dan solusi interior yang sesuai dengan kebutuhan ruang.",
    icon: "planning",
  },
  {
    number: "03",
    title: "Koordinasi & Monitoring",
    copy: "VMATCH mengoordinasikan vendor partner dan membantu customer memantau progres proyek secara lebih jelas.",
    icon: "monitoring",
  },
  {
    number: "04",
    title: "Realisasi Proyek",
    copy: "Proyek diselesaikan secara terarah hingga hasil akhir sesuai dengan kebutuhan customer.",
    icon: "realization",
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
    icon: "partner",
    title: "Tidak perlu mencari vendor sendiri",
    copy: "Kami telah bermitra dengan pengrajin dan penyedia material terbaik yang sudah teruji.",
  },
  {
    icon: "curated",
    title: "Solusi sudah dikurasi",
    copy: "Setiap pilihan material dan desain melewati filter estetika tim ahli kami.",
  },
  {
    icon: "structured",
    title: "Proses lebih terstruktur",
    copy: "Dari desain hingga instalasi, semua memiliki linimasa yang jelas dan pasti.",
  },
  {
    icon: "transparent",
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

export const contactInfo: ContactInfo = {
  address: "Universitas Dian Nuswantoro, Semarang, Jawa Tengah",
  phone: "+62 812-3456-7890",
  email: "support@interior.com",
  hours: "Senin - Sabtu, 09.00 - 17.00 WIB",
};
