"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgePercent, ChevronRight, ClipboardCheck, ClipboardList, FolderKanban, WalletCards } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { adminMenuGroups } from "./mock-data";
import { getProjectRequests } from "@/lib/api/projects";
import { getProjects } from "@/lib/api/projects";
import { getInvoices } from "@/lib/api/projects";
import { getActivePromo } from "@/lib/api/promos";
import { getNotifications } from "@/lib/api/notifications";
import type { Promo } from "@/lib/supabase/types";
import type { AdminPageId } from "./types";
import { AdminHeader } from "./components/admin-header";
import { AdminSidebar } from "./components/admin-sidebar";
import { PromoCampaignView } from "./components/promo-campaign-view";
import { RequestProjectView } from "./components/request-project-view";
import { ActiveProjectsView } from "./components/active-projects-view";
import { BriefDocumentsView } from "./components/brief-documents-view";
import { ProgressQcView } from "./components/progress-qc-view";
import { InvoicePaymentsView } from "./components/invoice-payments-view";
import { RabBuilderView } from "./components/rab-builder-view";
import { ConsultationView } from "./components/consultation-view";
import { VendorPartnerView } from "./components/vendor-partner-view";
import { CustomerView } from "./components/customer-view";
import { AnalyticsView } from "./components/analytics-view";
import { NotificationView } from "./components/notification-view";
import { SettingsView } from "./components/settings-view";
import { VendorBonusView } from "./components/vendor-bonus-view";
import {
  AdminIconBadge,
  AdminSectionCard,
  AdminStatusBadge,
} from "./components/shared";

export default function AdminDashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const [activePage, setActivePage] = useState<AdminPageId>("dashboard");
  const pageTitles: Partial<Record<AdminPageId, string>> = {
    dashboard: "Dashboard",
    promo: "Promo & Campaign",
    requests: "Request Proyek",
    "active-projects": "Proyek Aktif",
    "brief-documents": "Brief & Dokumen",
    "progress-qc": "Progress & QC",
    payments: "Invoice & Pembayaran",
    "rab-builder": "RAB Builder",
    "vendor-bonus": "Bonus Vendor",
    consultations: "Konsultasi",
    vendors: "Vendor Partner",
    customers: "Customer",
    analytics: "Analytics",
    notifications: "Notifikasi",
    settings: "Pengaturan",
  };

  const currentTitle = pageTitles[activePage] ?? "Dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTitle = useMemo(() => {
    const item = adminMenuGroups
      .flatMap((group) => group.items)
      .find((menu) => menu.id === activePage);

    return item?.label ?? "Dashboard";
  }, [activePage]);

  const handleChangePage = (page: AdminPageId) => {
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
      <AdminSidebar
        menuGroups={adminMenuGroups}
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onChangePage={handleChangePage}
      />

      <div className="min-h-screen lg:pl-[250px]">
        <AdminHeader
          title={currentTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          notificationCount={3}
          onOpenNotifications={() => handleChangePage("notifications")}
        />

        <main className="w-full px-5 py-6 sm:px-6">
          {activePage === "dashboard" && (
            <DashboardOverview onChangePage={handleChangePage} />
          )}

          {activePage === "promo" && <PromoCampaignView />}

          {activePage === "requests" && (
            <RequestProjectView onChangePage={handleChangePage} />
          )}

          {activePage === "active-projects" && (
            <ActiveProjectsView onChangePage={handleChangePage} />
          )}
          {activePage === "brief-documents" && (
            <BriefDocumentsView />
          )}
          {activePage === "progress-qc" && (
            <ProgressQcView />
          )}
          {activePage === "payments" && (
            <InvoicePaymentsView />
          )}
          {activePage === "rab-builder" && (
            <RabBuilderView onChangePage={handleChangePage} />
          )}
          {activePage === "vendor-bonus" && (
            <VendorBonusView />
          )}
          {activePage === "consultations" && (
            <ConsultationView />
          )}
          {activePage === "vendors" && (
            <VendorPartnerView />
          )}
          {activePage === "customers" && (
            <CustomerView />
          )}
          {activePage === "analytics" && (
            <AnalyticsView />
          )}
          {activePage === "notifications" && (
            <NotificationView />
          )}
          {activePage === "settings" && <SettingsView />}

          {activePage !== "dashboard" &&
            activePage !== "promo" &&
            activePage !== "requests" &&
            activePage !== "consultations" &&
            activePage !== "customers" &&
            activePage !== "vendors" &&
            activePage !== "active-projects" &&
            activePage !== "brief-documents" &&
            activePage !== "progress-qc" &&
            activePage !== "payments" &&
            activePage !== "rab-builder" &&
            activePage !== "vendor-bonus" &&
            activePage !== "analytics" &&
            activePage !== "notifications" &&
            activePage !== "settings" && (
              <AdminPlaceholder title={activeTitle} activePage={activePage} />
            )}
        </main>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} jam lalu`;
  return "Kemarin";
}

function DashboardOverview({
  onChangePage,
}: {
  onChangePage: (page: AdminPageId) => void;
}) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    newRequests: 0,
    activeProjects: 0,
    pendingQc: 0,
    pendingPayments: 0,
  });
  const [activePromo, setActivePromo] = useState<Promo | null>(null);
  const [recentActivities, setRecentActivities] = useState<{ id: string; title: string; description: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requests, projects, invoices, promo, notifs] = await Promise.all([
        getProjectRequests(),
        getProjects(),
        getInvoices(),
        getActivePromo(),
        user ? getNotifications(user.id) : Promise.resolve([]),
      ]);

      setStats({
        newRequests: requests.filter((r) => r.status === "Baru Masuk" || r.status === "Menunggu Review").length,
        activeProjects: projects.filter((p) => p.status === "Berjalan" || p.status === "Butuh Review").length,
        pendingQc: projects.filter((p) => p.status === "QC").length,
        pendingPayments: invoices.filter((i) => i.status === "Menunggu Pembayaran" || i.status === "Terlambat").length,
      });

      setActivePromo(promo);

      // Build recent activities from notifications
      const acts = notifs.slice(0, 6).map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description || "",
        time: formatTimeAgo(n.created_at),
      }));
      setRecentActivities(acts);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const summaryCards = [
    {
      id: "s1", label: "Request Baru", value: String(stats.newRequests),
      description: "Perlu direview admin", status: stats.newRequests > 0 ? "attention" : "normal",
      icon: ClipboardList,
    },
    {
      id: "s2", label: "Proyek Aktif", value: String(stats.activeProjects),
      description: "Sedang berjalan", status: "normal",
      icon: FolderKanban,
    },
    {
      id: "s3", label: "Butuh QC", value: String(stats.pendingQc),
      description: "Menunggu pengecekan", status: stats.pendingQc > 0 ? "attention" : "normal",
      icon: ClipboardCheck,
    },
    {
      id: "s4", label: "Pembayaran", value: String(stats.pendingPayments),
      description: "Menunggu verifikasi", status: stats.pendingPayments > 0 ? "attention" : "normal",
      icon: WalletCards,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            VMatch Admin
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Dashboard Operasional
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Pantau request customer, proyek aktif, progress vendor, pembayaran,
            dan promo landing page dalam satu tempat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangePage("requests")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          Review Request
          <ChevronRight size={16} />
        </button>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#725F54] border-t-transparent" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <AdminIconBadge
                    icon={card.icon}
                    tone={card.status === "normal" ? "default" : card.status}
                  />
                  <p className="font-serif text-[32px] leading-none text-[#31332C]">
                    {card.value}
                  </p>
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  {card.label}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  {card.description}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <AdminSectionCard
              title="Aktivitas Terbaru"
              description="Update operasional terbaru dari request, proyek, pembayaran, dan promo."
            >
              {recentActivities.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13px] font-semibold text-[#31332C]">
                          {activity.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-medium text-[#9A8F86]">
                          {activity.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#9A8F86]">Belum ada aktivitas terbaru.</p>
              )}
            </AdminSectionCard>

            <div className="space-y-5">
              <AdminSectionCard
                title="Promo Aktif"
                description="Promo yang sedang tampil di landing page."
                action={activePromo ? <AdminStatusBadge status="Aktif" /> : <AdminStatusBadge status="Menunggu" />}
              >
                {activePromo ? (
                  <div className="rounded-2xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                      <BadgePercent size={20} />
                    </div>

                    <h3 className="mt-4 text-[15px] font-semibold text-[#31332C]">
                      {activePromo.title}
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
                      {activePromo.description}
                    </p>

                    {activePromo.start_date && activePromo.end_date && (
                      <p className="mt-3 rounded-xl border border-[#E8E2D9] bg-white px-3 py-2 text-[11px] font-medium text-[#725F54]">
                        {new Date(activePromo.start_date).toLocaleDateString("id-ID")} -{" "}
                        {new Date(activePromo.end_date).toLocaleDateString("id-ID")}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => onChangePage("promo")}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                      Kelola Promo
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-4 text-center">
                    <p className="text-[13px] text-[#9A8F86]">Tidak ada promo aktif saat ini.</p>
                    <button
                      type="button"
                      onClick={() => onChangePage("promo")}
                      className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-[#725F54] px-4 text-[11px] font-semibold text-white transition hover:bg-[#5A4A42]"
                    >
                      Buat Promo
                    </button>
                  </div>
                )}
              </AdminSectionCard>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function AdminPlaceholder({
  title,
  activePage,
}: {
  title: string;
  activePage: AdminPageId;
}) {
  return (
    <div className="space-y-6">
      <section className="pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
          VMatch Admin
        </p>

        <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
          {title}
        </h1>

        <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
          Halaman ini sudah masuk struktur admin dashboard. Konten detailnya
          akan dibuat bertahap agar UI tetap rapi dan tidak membingungkan.
        </p>
      </section>

      <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
        <p className="text-[14px] font-semibold text-[#31332C]">
          {title} siap dikembangkan
        </p>

        <p className="mx-auto mt-2 max-w-[460px] text-[13px] leading-6 text-[#7B756E]">
          ID halaman: <span className="font-semibold text-[#725F54]">{activePage}</span>.
          Setelah layout utama aman, kita lanjut isi halaman ini satu per satu.
        </p>
      </div>
    </div>
  );
}