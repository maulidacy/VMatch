import Image from "next/image";

export function PhilosophySection() {
  return (
    <section className="bg-white py-0" id="tentang">
      <div className="mx-auto grid min-h-[520px] max-w-[1152px] items-center gap-20 px-6 lg:grid-cols-2">
        <div className="relative flex min-h-[510px] items-center justify-center">
          <Image
            src="/figma/philosophy-logo.webp"
            alt="VMatch logo mark"
            width={1024}
            height={1024}
            sizes="536px"
            className="max-h-[430px] w-full max-w-[500px] object-contain"
          />
        </div>
        <div className="py-10">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#6b5b52]">Our Philosophy</p>
          <h2 className="mt-6 font-serif text-[36px] leading-[45px] text-[#31332c]">
            Kami bukan sekadar perantara, kami adalah partner eksekusi Anda.
          </h2>
          <p className="mt-6 font-sans text-lg leading-[29px] text-[#5e6058]">
            VMATCH lahir dari keresahan pemilik properti yang lelah dengan ketidakpastian vendor. Kami mengambil peran penuh sebagai pengelola proyek, memastikan setiap detail sesuai dengan standar tinggi yang kami janjikan.
          </p>
          <ul className="mt-8 space-y-4 font-sans text-base text-[#31332c]">
            {[
              "Single point of contact untuk seluruh urusan proyek",
              "Garansi kualitas pengerjaan dan material",
              "Efisiensi biaya melalui jaringan pengadaan langsung",
            ].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="grid h-[19px] w-[19px] place-items-center rounded-full bg-[#6b5b52] text-white" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                    <path d="M3.5 8.1l2.7 2.7 6.3-6.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
