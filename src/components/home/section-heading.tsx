type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  cta?: string;
};

export function SectionHeading({ eyebrow, title, cta }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1152px] items-end justify-between gap-8 px-6 max-md:block">
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
          href="/login"
          className="hidden border-b border-[#6b5b52]/25 pb-1 font-sans text-base font-medium tracking-[0.025em] text-[#6b5b52] md:inline-flex"
        >
          {cta} <span className="ml-2">/</span>
        </a>
      ) : null}
    </div>
  );
}
