"use client";

import {
  Bot,
  CalendarDays,
  FolderOpen,
  ImageIcon,
  Plus,
  Settings,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { MenuItem, PageId } from "./types";
import { AiChatView } from "./components/ai-chat-view";
import { CatalogDesign } from "./components/catalog-design";
// import { DashboardView } from "./components/dashboard-view";
import { MeetingView } from "./components/meeting-view";
import { NewProjectForm } from "./components/new-project-form";
import { ProyekView } from "./components/proyek-view";
import { SettingsView } from "./components/settings-view";
import { UserHeader } from "./components/user-header";
import { UserSidebar } from "./components/user-sidebar";
import { NotificationBell } from "./components/notification-panel";
import { FloatingWhatsApp } from "./components/floating-whatsapp";

const menuItems: MenuItem[] = [
  // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inspirasi", label: "Inspirasi Desain", icon: ImageIcon },
  { id: "ajukan", label: "Ajukan Proyek", icon: Plus },
  { id: "proyek", label: "Proyek Saya", icon: FolderOpen },
  { id: "konsultasi", label: "Konsultasi", icon: CalendarDays },
  { id: "ai", label: "VMatch AI", icon: Bot },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

export default function UserDashboardPage() {
  // const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [activePage, setActivePage] = useState<PageId>("inspirasi");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeMenu = useMemo(
    () => menuItems.find((item) => item.id === activePage) ?? menuItems[0],
    [activePage],
  );

  const changePage = (page: PageId) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  return (
    <main className="min-h-[100dvh] bg-[#F8F6F2] text-[#2C2C2C]">
      <UserSidebar
        menuItems={menuItems}
        activePage={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangePage={changePage}
      />

      <section
        className={`flex flex-col lg:pl-[250px] ${activePage === "ai" ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
          }`}
      >
        <UserHeader
          title={activeMenu.label}
          onOpenMenu={() => setIsSidebarOpen(true)}
          rightAction={
            <NotificationBell
              onNavigate={(page) => {
                if (page === "proyek") changePage("proyek");
                if (page === "konsultasi") changePage("konsultasi");
                // if (page === "dashboard") changePage("dashboard");
                // Dashboard sedang disembunyikan, arahkan ke Proyek Saya.
                if (page === "dashboard") changePage("proyek");
              }}
            />
          }
        />

        {activePage === "ai" ? (
          <AiChatView />
        ) : (
          <div className="w-full px-5 py-6 sm:px-6">
            {/* {activePage === "dashboard" && <DashboardView onChangePage={changePage} />} */}
            {activePage === "ajukan" && <NewProjectForm />}
            {activePage === "proyek" && <ProyekView />}
            {activePage === "konsultasi" && <MeetingView />}
            {activePage === "inspirasi" && (
              <CatalogDesign
                onChangePage={(page) => {
                  if (page === "ai-ide") changePage("ai");
                  if (page === "konsultasi") changePage("konsultasi");
                  if (page === "ajukan") changePage("ajukan");
                  if (page === "catalog") changePage("inspirasi");
                }}
              />
            )}
            {activePage === "pengaturan" && <SettingsView />}
          </div>
        )}
      </section>
       <FloatingWhatsApp />
    </main>
  );
}