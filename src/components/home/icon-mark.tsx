export function IconMark({ type }: { type: string }) {
  const common = "h-7 w-7 text-[#6b5b52]";

  if (type === "seal") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M11 16.2l3.3 3.4L21.5 12" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "flow") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <path d="M7 10h18M7 16h13M7 22h18" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 7l4 3-4 3M21 19l4 3-4 3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <path d="M7 23h18" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 23V14M16 23V9M22 23V17" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={common} fill="none">
      <path d="M16 4l2.8 8.2L27 15l-8.2 2.8L16 26l-2.8-8.2L5 15l8.2-2.8L16 4z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
