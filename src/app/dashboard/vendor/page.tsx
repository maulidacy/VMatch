"use client";

import { useState } from "react";
import { vendorMenuItems } from "./mock-data";
import type { VendorPageId } from "./types";
import { useAuth } from "@/lib/hooks/use-auth";
import { BriefWorkPlanView } from "./components/brief-work-plan-view";
import { PaymentBonusView } from "./components/payment-bonus-view";
import { ProgressLogView } from "./components/progress-log-view";
import { ProjectView } from "./components/project-view";
import { SettingsView } from "./components/settings-view";
import { VendorHeader } from "./components/vendor-header";
import { VendorSidebar } from "./components/vendor-sidebar";
import { VendorNotificationBell } from "./components/vendor-notification-bell";

export default function VendorDashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const [activePage, setActivePage] = useState<VendorPageId>("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChangePage = (page: VendorPageId) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFBF9]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#725F54] border-t-transparent" />
          <p className="mt-3 text-[13px] text-[#7B756E]">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#31332C]">
      <VendorSidebar
        menuItems={vendorMenuItems}
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onChangePage={handleChangePage}
      />

      <div className="min-h-screen lg:pl-[250px]">
        <VendorHeader
          activePage={activePage}
          onOpenSidebar={() => setSidebarOpen(true)}
          rightAction={<VendorNotificationBell onNavigate={handleChangePage} />}
        />

        <main className="w-full px-5 py-6 sm:px-6">
          {activePage === "projects" && (
            <ProjectView onChangePage={handleChangePage} vendorId={user.id} />
          )}

          {activePage === "brief" && (
            <BriefWorkPlanView onChangePage={handleChangePage} vendorId={user.id} />
          )}

          {activePage === "progress-log" && <ProgressLogView vendorId={user.id} />}

          {activePage === "payment-bonus" && <PaymentBonusView vendorId={user.id} />}

          {activePage === "settings" && <SettingsView vendorId={user.id} profile={profile} />}
        </main>
      </div>
    </div>
  );
}
