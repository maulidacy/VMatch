"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Apakah saya harus sudah punya desain sebelum konsultasi?",
    answer:
      "Tidak harus. Anda cukup menceritakan kebutuhan, ukuran ruangan, gaya yang disukai, dan estimasi budget. Tim kami akan membantu mengarahkan konsep terbaik.",
  },
  {
    question: "Apakah VMatch membantu sampai proses instalasi?",
    answer:
      "Ya. Kami membantu mengelola kebutuhan proyek mulai dari konsep, rekomendasi material, koordinasi vendor, hingga proses pemasangan selesai.",
  },
  {
    question: "Berapa lama proses pengerjaan interior?",
    answer:
      "Durasi bergantung pada ukuran dan kompleksitas proyek. Setelah konsultasi awal, kami akan memberikan estimasi timeline yang lebih jelas dan terukur.",
  },
  {
    question: "Apakah bisa menyesuaikan budget?",
    answer:
      "Bisa. Kami akan membantu menyesuaikan pilihan desain, material, dan prioritas pengerjaan agar tetap sesuai dengan kebutuhan dan anggaran Anda.",
  },
];

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faq" className="overflow-hidden bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="animate-[fadeUp_700ms_ease-out_both]">
          <p className="text-[15px] uppercase tracking-[0.28em] text-[#6b5b52]">
            FAQ
          </p>

          <h2 className="mt-4 max-w-[520px] font-serif text-[38px] leading-tight text-[#31332c] md:text-5xl">
            Pertanyaan yang sering diajukan
          </h2>

          <p className="mt-6 max-w-[460px] text-[15px] leading-7 text-[#797C73]">
            Temukan jawaban singkat sebelum memulai konsultasi interior bersama
            VMatch.
          </p>

          <a
            href="#kontak"
            className="mt-8 inline-flex bg-[#6b5b52] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5a4a42] active:scale-95"
          >
            Konsultasi Sekarang
          </a>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={faq.question}
                className="overflow-hidden border border-[#e6e1da] bg-[#f8f6f3] transition-all duration-500 hover:border-[#6b5b52]/40"
                style={{
                  animation: `fadeUp 700ms ease-out ${index * 100 + 150}ms both`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="font-serif text-[20px] italic leading-7 text-[#31332c]">
                    {faq.question}
                  </span>

                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6b5b52] text-white transition-transform duration-300 ${
                      isActive ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ${
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[15px] leading-7 text-[#797C73]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}