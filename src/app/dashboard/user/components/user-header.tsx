"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";

export function UserHeader({
  title,
  onOpenMenu,
  rightAction,
}: {
  title: string;
  onOpenMenu: () => void;
  rightAction?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      <p className="flex-1 text-[13px] font-medium text-[#7A7067]">
        {title}
      </p>

      {rightAction}
    </header>
  );
}