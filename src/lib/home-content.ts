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

export type Inspiration = {
  title: string;
  copy: string;
  image: ImageAsset;
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

export const heroThumbs: ImageAsset[] = [
  {
    src: "/figma/hero-thumb-1.webp",
    alt: "Compact custom kitchen inspiration",
    width: 564,
    height: 680,
  },
  {
    src: "/figma/hero-thumb-2.webp",
    alt: "Bright interior detail",
    width: 564,
    height: 680,
  },
  {
    src: "/figma/hero-thumb-3.webp",
    alt: "Warm kitchen storage detail",
    width: 564,
    height: 680,
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
];

export const inspirations: Inspiration[] = [
  {
    title: "Kitchen Set",
    copy: "Inspirasi dapur custom yang fungsional, bersih, dan elegan.",
    image: {
      src: "/figma/inspiration-kitchen.webp",
      alt: "Modern kitchen set with pendant lights",
      width: 736,
      height: 1104,
      className: "object-[center_top]",
    },
  },
  {
    title: "Lemari/Wardrobe",
    copy: "Penyimpanan rapi dan efisien yang menyesuaikan kebutuhan ruang.",
    image: {
      src: "/figma/inspiration-wardrobe.webp",
      alt: "Wardrobe with soft grey finish",
      width: 736,
      height: 981,
      className: "object-[center_top]",
    },
  },
  {
    title: "Ruang Tamu",
    copy: "Ruang santai yang nyaman dengan suasana yang hangat dan elegan.",
    image: {
      src: "/figma/inspiration-living.webp",
      alt: "Warm living room ceiling and wall treatment",
      width: 736,
      height: 1104,
      className: "object-[center_4%]",
    },
  },
];

export const steps = [
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

export const testimonials = [
  {
    quote:
      "Tim Atelier Woodworks berhasil mengubah villa kami di Bali. Perhatian mereka terhadap detail, terutama pada keselarasan serat kayu, adalah sesuatu yang jarang ditemui di Indonesia saat ini.",
    author: "Ananda Kusuma, Private Owner",
  },
  {
    quote:
      "Sangat profesional. Mereka menangani instalasi kitchen set di apartemen kami di Jakarta dengan sangat rapi dan presisi. Benar-benar ahli dalam bidangnya.",
    author: "Reza Rahadian, Architect",
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
