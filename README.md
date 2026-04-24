# VMatch Interior

Website landing page untuk layanan interior VMatch, dibangun dengan Next.js App Router dan Tailwind CSS v4.

## Ringkasan

- Menampilkan halaman beranda dengan section: Hero, Projects, Inspiration, Process, Benefits, Philosophy, Testimonials, Offers, dan Footer.
- Sudah dioptimasi untuk SEO dasar (metadata, Open Graph, Twitter card).
- Seluruh aset gambar utama di `public/figma` menggunakan format `.webp` untuk performa yang lebih ringan.

## Tech Stack

- Next.js `16.2.4`
- React `19.2.4`
- Tailwind CSS `4`
- TypeScript `5`

## Menjalankan Project

Prasyarat:

- Node.js 20+
- npm

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## Scripts

- `npm run dev` menjalankan local development server.
- `npm run build` build production.
- `npm run start` menjalankan hasil build production.
- `npm run lint` menjalankan ESLint.

## Struktur Folder Utama

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/home/
    navbar.tsx
    fill-image.tsx
    sections/
      hero-section.tsx
      projects-section.tsx
      inspiration-section.tsx
      process-section.tsx
      benefits-section.tsx
      philosophy-section.tsx
      testimonials-section.tsx
      offers-section.tsx
      footer.tsx
  lib/
    home-content.ts

public/
  figma/
    *.webp
```

## Konfigurasi Environment

Project membaca `NEXT_PUBLIC_SITE_URL` untuk `metadataBase` pada SEO metadata.

Contoh `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://vmatch-interior.com
```

Jika tidak diisi, default yang dipakai adalah `https://vmatch-interior.com`.

## Panduan Aset Gambar

- Simpan aset visual landing page di `public/figma`.
- Gunakan format `.webp` (hindari `.png` untuk aset utama agar ukuran lebih kecil).
- Pastikan path gambar di komponen/data mengarah ke `.webp`, terutama di `src/lib/home-content.ts` dan section terkait.

## Deployment

Build untuk production:

```bash
npm run build
```

Jalankan hasil build:

```bash
npm run start
```

Siap di-deploy ke platform yang mendukung Next.js (misalnya Vercel).
