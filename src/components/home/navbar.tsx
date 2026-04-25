const links = ["Beranda", "Inspirasi", "Cara Kerja", "Tentang", "Kontak"];

export function Navbar() {
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
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-[#31332c]"
              >
                {link}
              </a>
            ))}
          </div>
          <a
            href="#kontak"
            className="hidden h-10 min-w-[126px] items-center justify-center bg-[#6B5B52] px-6 text-[13px] font-medium leading-none text-white transition-colors hover:bg-[#5b4c44] sm:inline-flex"
          >
            Konsultasi
          </a>
        </div>
      </nav>
    </header>
  );
}
