"use client";

import Link from "next/link";
import { LogOut, UserRound, X } from "lucide-react";

import type { AdminMenuGroup, AdminPageId } from "../types";

export function AdminSidebar({
  menuGroups,
  activePage,
  isOpen,
  onClose,
  onChangePage,
  userName,
  userEmail,
}: {
  menuGroups: AdminMenuGroup[];
  activePage: AdminPageId;
  isOpen: boolean;
  onClose: () => void;
  onChangePage: (page: AdminPageId) => void;
  userName: string;
  userEmail: string;
}) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col bg-[#6B5B52] text-white shadow-[18px_0_50px_rgba(49,51,44,0.16)] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <Link href="/" className="font-serif text-[26px] italic leading-none text-white">
              VMatch
            </Link>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/75 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-5">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = activePage === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onChangePage(item.id)}
                        className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-semibold transition ${
                          active
                            ? "bg-[#FCFBF9] text-[#3D3530] shadow-sm"
                            : "text-white/72 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.9}
                          className={active ? "text-[#725F54]" : "text-white/72"}
                        />

                        <span className="min-w-0 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F8F6F2] text-[#6B5B52]">
              <UserRound size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                {userName}
              </p>

              <p className="truncate text-[11px] text-white/60">
                {userEmail}
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