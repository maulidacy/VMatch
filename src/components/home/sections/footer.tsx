import { contactInfo } from "@/lib/home-content";

const navigationLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Inspirasi", href: "#inspirasi" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const serviceLinks = ["Kitchen Set", "Wardrobe", "Ruang Tamu", "Interior Custom"];
const supportLinks = ["FAQ", "Syarat & Ketentuan", "Kebijakan Privasi", "Konsultasi Proyek"];
const socialLinks = [
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "TikTok", icon: <TikTokIcon /> },
  { label: "YouTube", icon: <YouTubeIcon /> },
  { label: "Facebook", icon: <FacebookIcon /> },
];

export function Footer() {
  return (
    <footer className="bg-[#191A17] text-[#F5EFE5]">
      <div className="mx-auto max-w-[1180px] px-6 py-9 lg:py-10">
        <div className="grid grid-cols-1 gap-8 border-b border-white/12 pb-8 lg:grid-cols-[1.2fr_0.72fr_0.72fr_0.92fr]">
          <div>
            <a href="#beranda" className="font-serif text-[34px] font-medium italic leading-none text-white">
              VMatch
            </a>
            <p className="mt-5 max-w-[370px] font-sans text-[14px] leading-[24px] text-white/72">
              Partner eksekusi interior yang membantu Anda mengelola kebutuhan desain, vendor, material, hingga instalasi dengan proses yang lebih rapi.
            </p>

            <div className="mt-6 space-y-2 font-sans text-[13px] leading-6 text-white/72">
              <p>{contactInfo.address}</p>
              <p>
                <a href={`mailto:${contactInfo.email}`} className="transition-colors hover:text-white">
                  {contactInfo.email}
                </a>
              </p>
              <p>
                <a href="https://wa.me/6281234567890" className="transition-colors hover:text-white">
                  {contactInfo.phone}
                </a>
              </p>
            </div>
          </div>

          <FooterColumn title="Navigasi">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Layanan">
            {serviceLinks.map((link) => (
              <li key={link}>
                <a href="#inspirasi" className="transition-colors hover:text-white">
                  {link}
                </a>
              </li>
            ))}
          </FooterColumn>

          <div>
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white">Dukungan</h3>
            <ul className="mt-5 space-y-2 font-sans text-[13px] leading-6 text-white/70">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href="/login" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="/login"
                  className="grid h-9 w-9 place-items-center border border-white/16 bg-white/8 text-white/80 transition-colors hover:bg-white hover:text-[#6B5B52]"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 font-sans text-[11px] uppercase tracking-[0.14em] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 VMatch Interior. All rights reserved.</p>
          <a href="#beranda" className="transition-colors hover:text-white">
            Kembali ke atas
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white">{title}</h3>
      <ul className="mt-5 space-y-2 font-sans text-[13px] leading-6 text-white/70">{children}</ul>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M14.2 5v9.1a4 4 0 1 1-3.9-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14.2 5c.5 2.8 2.1 4.4 4.8 4.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.8" y="6.5" width="16.4" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.4v5.2l4.4-2.6-4.4-2.6z" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M13.2 20v-7h2.4l.4-3h-2.8V8.1c0-.9.3-1.5 1.6-1.5H16V4.1c-.7-.1-1.4-.1-2.1-.1-2.2 0-3.7 1.4-3.7 3.8V10H8v3h2.2v7h3z"
        fill="currentColor"
      />
    </svg>
  );
}
