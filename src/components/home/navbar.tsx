"use client";

import { useState } from "react";

const links = ["Beranda", "Inspirasi", "Cara Kerja", "Tentang", "Kontak"];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e7e1d8] bg-white shadow-[0_1px_2px_rgba(49,51,44,0.08)]">
      <nav className="relative mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 font-sans text-[#6b5b52] sm:gap-8 sm:px-8 lg:px-10">
        <a href="#beranda" className="shrink-0 font-serif text-[26px] font-medium italic leading-none text-[#31332c]">
          VMatch
        </a>
        <div className="flex min-w-0 items-center justify-end gap-5 sm:gap-8 lg:gap-12">
          <div className="hidden items-center justify-end gap-8 lg:flex xl:gap-12">
            {links.map((link) => (
              <a
                key={link}
                href={`/#${link.toLowerCase().replace(" ", "-")}`}
                className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-[#31332c]"
              >
                {link}
              </a>
            ))}
          </div>
          <a
            href="/login"
            className="hidden h-10 min-w-[126px] items-center justify-center bg-[#6B5B52] px-6 text-[13px] font-medium leading-none text-white transition-colors hover:bg-[#5b4c44] sm:inline-flex"
          >
            Konsultasi
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="flex lg:hidden flex-col items-center justify-center w-10 h-10 gap-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[2px] w-6 bg-[#31332c] transition-transform duration-300 ${isOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
            <span className={`block h-[2px] w-6 bg-[#31332c] transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`block h-[2px] w-6 bg-[#31332c] transition-transform duration-300 ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`lg:hidden border-[#e7e1d8] bg-white transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 border-b border-t" : "max-h-0 border-transparent"}`}
      >
        <div className="flex flex-col px-5 py-4 space-y-4">
          {links.map((link) => (
            <a
              key={link}
              href={`/#${link.toLowerCase().replace(" ", "-")}`}
              onClick={() => setIsOpen(false)}
              className="text-[14px] font-medium uppercase tracking-[0.16em] text-[#6b5b52] hover:text-[#31332c]"
            >
              {link}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setIsOpen(false)}
            className="inline-flex sm:hidden h-10 w-full items-center justify-center bg-[#6B5B52] px-6 text-[13px] font-medium leading-none text-white transition-colors hover:bg-[#5b4c44] mt-2"
          >
            Konsultasi
          </a>
        </div>
      </div>
    </header>
  );
}
