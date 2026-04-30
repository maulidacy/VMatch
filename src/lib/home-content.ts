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
    src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573689/dapur3_qp7ftx.png",
    alt: "Compact custom kitchen inspiration",
    width: 564,
    height: 680,
  },
  {
    src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573502/dapur1_fcslhm.png",
    alt: "Bright interior detail",
    width: 564,
    height: 680,
  },
  {
    src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573771/dapur2_mr7sda.png",
    alt: "Warm kitchen storage detail",
    width: 564,
    height: 680,
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

export const inspirations = [
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
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573297/ruang_tamuu_uwaatm.png",
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
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573013/kanan_atas_kez6m5.png",
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
      src: "https://res.cloudinary.com/dxdb3dj8f/image/upload/v1777573102/kanan_bawah_r5suqy.png",
      alt: "Luxury closet interior detail",
      width: 736,
      height: 736,
      className: "object-[center_74%]",
    },
  },
];
