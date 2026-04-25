type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  cta?: string;
};

export function SectionHeading({ eyebrow, title, cta }: SectionHeadingProps) {
  return (
    <div className="flex w-full items-end justify-between gap-8 max-md:block">
      <div className="min-w-0 max-w-[760px]">
        <p className="font-sans text-[12px] uppercase leading-6 tracking-[0.27em] text-[#6b5b52] sm:text-base">
          {eyebrow}
        </p>

        <h2 className="mt-4 max-w-[340px] font-serif text-[34px] font-medium leading-[38px] text-[#31332c] sm:max-w-full sm:text-5xl sm:leading-none">
          {title}
        </h2>
      </div>

      {cta ? (
        <a
          href="/portfolio"
          className="group hidden items-center gap-1.5 border-b border-[#6b5b52]/25 pb-1 font-sans text-base font-medium tracking-[0.025em] text-[#6b5b52] transition-all duration-300 hover:border-[#31332c] hover:text-[#31332c] md:inline-flex"
          aria-label={`${cta} menuju bagian kontak`}
        >
          <span>{cta}</span>

          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path
              d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ) : null}
    </div>
  );
}