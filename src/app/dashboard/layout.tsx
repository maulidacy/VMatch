import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#FCFBF9] font-sans text-[#31332C]">
      {children}
    </div>
  );
}
