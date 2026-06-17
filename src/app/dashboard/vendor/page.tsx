"use client";

import { useState } from "react";
import { vendorMenuItems } from "./mock-data";
import type { VendorPageId } from "./types";
import { BriefWorkPlanView } from "./components/brief-work-plan-view";
import { DashboardView } from "./components/dashboard-view";
import { PaymentBonusView } from "./components/payment-bonus-view";
import { ProgressLogView } from "./components/progress-log-view";
import { ProjectView } from "./components/project-view";
import { SettingsView } from "./components/settings-view";
import { VendorHeader } from "./components/vendor-header";
import { VendorSidebar } from "./components/vendor-sidebar";
import { VendorNotificationBell } from "./components/vendor-notification-bell";

export default function VendorDashboardPage() {
  const [activePage, setActivePage] = useState<VendorPageId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChangePage = (page: VendorPageId) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

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

        <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {activePage === "dashboard" && (
            <DashboardView onChangePage={handleChangePage} />
          )}

          {activePage === "projects" && (
            <ProjectView onChangePage={handleChangePage} />
          )}

          {activePage === "brief" && (
            <BriefWorkPlanView onChangePage={handleChangePage} />
          )}

          {activePage === "progress-log" && <ProgressLogView />}

          {activePage === "payment-bonus" && <PaymentBonusView />}

          {activePage === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}