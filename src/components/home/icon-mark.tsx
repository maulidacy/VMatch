export function IconMark({ type }: { type: string }) {
  const common = "h-7 w-7 text-current";

  if (type === "chat") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <path
          d="M8 10.5c0-2 1.6-3.5 3.5-3.5h9c2 0 3.5 1.6 3.5 3.5v5.2c0 2-1.6 3.5-3.5 3.5h-5.4L10 24v-4.8h-1.7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M12 12h8M12 16h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "plan") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <path
          d="M9 7h10l4 4v14H9V7z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M19 7v4h4" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        <path
          d="M12 21.5l1-3.7 6.4-6.4 2.7 2.7-6.4 6.4-3.7 1z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "build") {
    return (
      <svg viewBox="0 0 32 32" className={common} fill="none">
        <path
          d="M7 25h18M9 25V14.5L16 9l7 5.5V25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M13 25v-6h6v6M11.5 14.5h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M21.5 8.5l2 2 3-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

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
