import { testimonials } from "@/lib/home-content";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-[30px]">
      <div className="mx-auto grid max-w-[1125px] grid-cols-1 gap-20 px-6 lg:grid-cols-[322px_1fr]">
        <div>
          <h2 className="font-serif text-5xl leading-none text-[#31332c]">Testimoni Klien</h2>
          <p className="mt-8 font-sans text-base leading-[26px] text-[#5e6058]">
            Hubungan antara pengrajin dan pemilik hunian dibangun atas dasar kepercayaan dan visi yang sejalan.
          </p>
          <div className="mt-8 flex items-end gap-4">
            <div className="flex">
              {[0, 1, 2].map((item) => (
                <span
                  key={item}
                  className="-mr-3 grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-[#d8d1c6]"
                />
              ))}
            </div>
            <span className="font-sans text-sm text-[#6b5b52]">Lebih dari 40 klien puas</span>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="border-l border-[#d6cfc3] bg-white px-11 py-10">
              <div className="flex gap-1 text-[#6b5b52]" aria-label="Five star rating">
                {"*****".split("").map((star, index) => (
                  <span key={`${star}-${index}`}>*</span>
                ))}
              </div>
              <p className="mt-6 font-sans text-base leading-7 text-[#3f413a]">&quot;{testimonial.quote}&quot;</p>
              <p className="mt-6 border-t border-[#e4ded5] pt-4 font-sans text-xs uppercase tracking-[0.08em] text-[#6b5b52]">
                {testimonial.author}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
