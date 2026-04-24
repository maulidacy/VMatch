"use client";

import Link from "next/link";

type BackLinkProps = {
  className?: string;
  children: React.ReactNode;
};

export function BackLink({ className, children }: BackLinkProps) {
  return (
    <Link
      href="/#inspirasi"
      className={className}
    >
      {children}
    </Link>
  );
}
