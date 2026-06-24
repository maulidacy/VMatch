"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getActivePromo } from "@/lib/api/promos";
import type { Promo } from "@/lib/supabase/types";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPromo() {
      try {
        const activePromo = await getActivePromo();
        if (activePromo && mounted) {
          setPromo(activePromo);
          // Delay popup appearance
          setTimeout(() => {
            if (mounted) setIsOpen(true);
          }, 500);
        }
      } catch {
        // No promo available
      }
    }

    loadPromo();
    return () => { mounted = false; };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!promo || !isOpen) {
    return null;
  }

  const imageUrl = promo.image_url || "/inspirations/rumah-ruang-tamu.webp";
  const startDate = promo.start_date
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(promo.start_date))
    : "";
  const endDate = promo.end_date
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(promo.end_date))
    : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 px-4 pb-4 backdrop-blur-sm sm:items-center sm:p-6">
      <section className="relative h-[640px] max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-hidden rounded-[10px] border border-white/40 bg-[#31332C] shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
        <Image
          src={imageUrl}
          alt={promo.title}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/38 to-black/10" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-[#725F54] shadow-sm transition hover:bg-white hover:text-[#31332C]"
          aria-label="Tutup promo"
        >
          <X size={18} />
        </button>

        <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#725F54] shadow-sm">
          <Sparkles size={13} />
          Promo VMatch
        </div>

        <div className="absolute inset-x-5 bottom-5 z-20">
          <div className="w-fit rounded-[16px] bg-white/94 px-4 py-3 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
              Spesial Promo
            </p>

            <p className="mt-1 font-serif text-[34px] leading-none text-[#31332C]">
              {promo.title}
            </p>
          </div>

          <h2 className="mt-5 font-serif text-[36px] leading-tight text-white sm:text-[42px]">
            {promo.title}
          </h2>

          <p className="mt-3 max-w-[430px] text-[13px] leading-6 text-white/82">
            {promo.description}
          </p>

          {startDate && endDate && (
            <div className="mt-5 flex items-center gap-2 rounded-[16px] border border-white/18 bg-white/12 px-4 py-3 text-[13px] text-white/86 backdrop-blur-md">
              <CalendarDays size={16} className="shrink-0 text-white" />
              <span>{startDate} - {endDate}</span>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={closePopup}
              className="h-11 rounded-xl border border-white/35 bg-white/12 px-5 text-[13px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Nanti saja
            </button>

            <Link
              href={promo.cta_url || "/dashboard/user"}
              onClick={closePopup}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
            >
              {promo.cta_label || "Ajukan Proyek"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
