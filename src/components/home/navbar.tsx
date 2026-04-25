"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Beranda", href: "#beranda", id: "beranda" },
  { label: "Inspirasi", href: "#inspirasi", id: "inspirasi" },
  { label: "Cara Kerja", href: "#cara-kerja", id: "cara-kerja" },
  { label: "Tentang", href: "#tentang", id: "tentang" },
  { label: "Kontak", href: "#kontak", id: "kontak" },
];

export function Navbar({ active = "beranda" }: { active?: string }) {
  const [activeSection, setActiveSection] = useState(active);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (active !== "beranda") return;
    const handleScroll = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      const current = sections.findLast(
        (section) => window.scrollY >= section.offsetTop - 160,
      );

      setActiveSection(current?.id ?? "beranda");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-12 md:pt-5">
      <nav className="relative mx-auto flex h-[64px] max-w-[1320px] animate-[fadeDown_700ms_ease-out_both] items-center justify-between bg-white/95 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:px-10">
        <Link
          href="#beranda"
          onClick={() => setIsOpen(false)}
          className="font-serif text-xl italic text-[#31332c] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        >
          VMatch
        </Link>

        <div className="hidden items-center gap-10 text-[12px] uppercase tracking-[0.18em] text-[#6b5b52] lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group relative py-2 transition-all duration-300 hover:-translate-y-0.5 hover:text-[#31332c] active:scale-95 ${
                  isActive ? "text-[#31332c]" : ""
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-[#6b5b52] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <Link
          href="#kontak"
          className="hidden bg-[#6b5b52] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51433b] active:scale-95 lg:block"
        >
          Konsultasi
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center text-[#31332c] lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <span className="relative h-4 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${
                isOpen ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-6 bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${
                isOpen ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>

        <div
          className={`absolute left-0 right-0 top-[76px] overflow-hidden bg-white shadow-2xl transition-all duration-500 lg:hidden ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 p-5 text-[12px] uppercase tracking-[0.16em] text-[#6b5b52]">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`transition-all duration-300 hover:translate-x-1 hover:text-[#31332c] ${
                  activeSection === item.id ? "text-[#31332c]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="#kontak"
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-[#6b5b52] px-5 py-3 text-center text-sm normal-case tracking-normal text-white transition active:scale-95"
            >
              Konsultasi
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}