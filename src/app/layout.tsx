import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vmatch-interior.com"),
  title: {
    default: "VMatch Interior | Partner Eksekusi Interior Tanpa Ribet",
    template: "%s | VMatch Interior",
  },
  description:
    "VMatch Interior membantu pemilik hunian mengelola proyek interior dari konsultasi, desain, kurasi vendor, material, produksi, hingga instalasi secara rapi dan profesional.",
  applicationName: "VMatch Interior",
  authors: [{ name: "VMatch Interior" }],
  creator: "VMatch Interior",
  publisher: "VMatch Interior",
  category: "Interior Design",
  keywords: [
    "VMatch Interior",
    "jasa interior",
    "desain interior",
    "kitchen set custom",
    "wardrobe custom",
    "renovasi interior",
    "project interior",
    "vendor interior",
    "interior Jakarta",
    "manajemen proyek interior",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VMatch Interior | Partner Eksekusi Interior Tanpa Ribet",
    description:
      "Kelola kebutuhan interior dari desain, material, vendor, produksi, sampai instalasi dengan partner eksekusi yang terstruktur.",
    url: "/",
    siteName: "VMatch Interior",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/figma/philosophy-logo.webp",
        width: 1024,
        height: 1024,
        alt: "VMatch Interior logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VMatch Interior | Partner Eksekusi Interior Tanpa Ribet",
    description:
      "Partner eksekusi interior untuk desain, vendor, material, produksi, dan instalasi yang lebih rapi.",
    images: ["/figma/philosophy-logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
