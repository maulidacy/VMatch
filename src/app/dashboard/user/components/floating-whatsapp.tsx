"use client";

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20VMatch%2C%20saya%20ingin%20bertanya%20tentang%20proyek%20interior.";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi VMatch via WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1FBE5D] hover:shadow-[0_18px_42px_rgba(37,211,102,0.42)] active:translate-y-0 sm:bottom-7 sm:right-7 sm:h-[58px] sm:w-[58px]"
    >
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-8 w-8"
      fill="currentColor"
    >
      <path d="M16.02 3.2C9.05 3.2 3.38 8.79 3.38 15.67c0 2.2.59 4.35 1.71 6.24L3.2 28.8l7.08-1.84a12.8 12.8 0 0 0 5.74 1.36c6.97 0 12.64-5.59 12.64-12.47S22.99 3.2 16.02 3.2Zm0 22.96c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-4.2 1.09 1.12-4.06-.25-.39a10.26 10.26 0 0 1-1.61-5.49c0-5.69 4.71-10.31 10.49-10.31s10.49 4.62 10.49 10.31-4.71 10.49-10.49 10.49Zm5.74-7.72c-.31-.16-1.86-.91-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.24-.68.08-.31-.16-1.32-.48-2.52-1.53-.93-.82-1.56-1.84-1.74-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.31-.26-.61-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.21 2.23 3.36 5.41 4.71.76.32 1.35.51 1.81.65.76.24 1.45.21 2 .13.61-.09 1.86-.75 2.12-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.37Z" />
    </svg>
  );
}