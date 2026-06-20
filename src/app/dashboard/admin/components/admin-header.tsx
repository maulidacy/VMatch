"use client";

import { Bell, Menu } from "lucide-react";
import type { ReactNode } from "react";

export function AdminHeader({
  title,
  onOpenSidebar,
  notificationCount = 0,
  onOpenNotifications,
  rightAction,
}: {
  title: string;
  onOpenSidebar: () => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  rightAction?: ReactNode;
}) {

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E2D9]/80 bg-[#F8F6F2]/95 px-5 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="grid h-8 w-8 place-items-center rounded-lg text-[#7A7067] transition hover:bg-[#F0EBE4] lg:hidden"
        aria-label="Buka sidebar"
      >
        <Menu size={18} />
      </button>

      <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#7A7067]">
        Dashboard / {title}
      </p>

      {rightAction}

      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#725F54] transition hover:bg-[#F0EBE4]"
        aria-label="Buka notifikasi"
      >
        <Bell size={18} strokeWidth={2.2} />

        {notificationCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#725F54] px-1.5 text-[10px] font-bold leading-none text-white">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
}