"use client";

import { Bell, Menu, Search } from "lucide-react";

export function AdminHeader({
  title,
  onOpenSidebar,
}: {
  title: string;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[#7A7067]">
          Dashboard / {title}
        </p>
      </div>

      <div className="hidden h-10 w-[280px] items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-3 text-[#7B756E] md:flex">
        <Search size={16} />

        <span className="truncate text-[12px]">
          Cari proyek, customer, atau vendor...
        </span>
      </div>

      <button
        type="button"
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54] transition hover:bg-[#FCFBF9]"
        aria-label="Notifikasi"
      >
        <Bell size={18} />

        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#725F54]" />
      </button>
    </header>
  );
}