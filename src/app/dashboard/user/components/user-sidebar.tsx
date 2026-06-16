"use client";

import Link from "next/link";
import { LogOut, UserRound, X } from "lucide-react";
import type { MenuItem, PageId } from "../types";

export function UserSidebar({
  menuItems,
  activePage,
  isOpen,
  onClose,
  onChangePage,
}: {
  menuItems: MenuItem[];
  activePage: PageId;
  isOpen: boolean;
  onClose: () => void;
  onChangePage: (page: PageId) => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[250px] flex-col border-r border-white/10 bg-[#6B5B52] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="font-serif text-[22px] italic text-white">
            VMatch
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePage(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#F8F6F2] text-[#6B5B52]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.7} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F8F6F2] text-[#6B5B52]">
              <UserRound size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                Customer
              </p>
              <p className="truncate text-[11px] text-white/60">
                customer@email.com
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={14} />
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}