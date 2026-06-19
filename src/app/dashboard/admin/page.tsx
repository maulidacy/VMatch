"use client";

import { useMemo, useState } from "react";
import { BadgePercent, ChevronRight } from "lucide-react";

import {
  activePromoPreview,
  adminActivities,
  adminMenuGroups,
  adminPriorityTasks,
  adminSummaryCards,
} from "./mock-data";
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
import {
  AdminIconBadge,
  AdminSectionCard,
  AdminStatusBadge,
} from "./components/shared";

export default function AdminDashboardPage() {
  const [activePage, setActivePage] = useState<AdminPageId>("dashboard");
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
          title={activeTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
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
          {activePage === "documents" && (
            <BriefDocumentsView />
          )}
          {activePage === "progress-qc" && (
            <ProgressQcView />
          )}
          {activePage === "payments" && (
            <InvoicePaymentsView onChangePage={handleChangePage} />
          )}
          {activePage === "rab-builder" && (
            <RabBuilderView onChangePage={handleChangePage} />
          )}
          {activePage === "consultations" && (
            <ConsultationView onChangePage={handleChangePage} />
          )}
          {activePage === "vendors" && (
            <VendorPartnerView onChangePage={handleChangePage} />
          )}
          {activePage === "customers" && (
            <CustomerView onChangePage={handleChangePage} />
          )}
          {activePage === "analytics" && (
            <AnalyticsView onChangePage={handleChangePage} />
          )}
          {activePage === "notifications" && (
            <NotificationView onChangePage={handleChangePage} />
          )}
          {activePage === "settings" && <SettingsView />}

          {activePage !== "dashboard" &&
            activePage !== "promo" &&
            activePage !== "requests" &&
            activePage !== "consultations" &&
            activePage !== "customers" &&
            activePage !== "vendors" &&
            activePage !== "active-projects" &&
            activePage !== "documents" &&
            activePage !== "progress-qc" &&
            activePage !== "payments" &&
            activePage !== "rab-builder" &&
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

function DashboardOverview({
  onChangePage,
}: {
  onChangePage: (page: AdminPageId) => void;
}) {
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

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {adminSummaryCards.map((card) => (
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
          title="Butuh Perhatian"
          description="Prioritas pekerjaan yang perlu segera ditindaklanjuti admin."
        >
          <div className="grid gap-3">
            {adminPriorityTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className="flex w-full items-start justify-between gap-4 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#31332C]">
                    {task.title}
                  </p>

                  <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                    {task.description}
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-[#9A8F86]">
                    {task.meta}
                  </p>
                </div>

                <AdminStatusBadge status={task.status} />
              </button>
            ))}
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard
            title="Promo Aktif"
            description="Promo yang sedang tampil di landing page."
            action={<AdminStatusBadge status={activePromoPreview.status} />}
          >
            <div className="rounded-2xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
                <BadgePercent size={20} />
              </div>

              <h3 className="mt-4 text-[15px] font-semibold text-[#31332C]">
                {activePromoPreview.title}
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-[#7B756E]">
                {activePromoPreview.description}
              </p>

              <p className="mt-3 rounded-xl border border-[#E8E2D9] bg-white px-3 py-2 text-[11px] font-medium text-[#725F54]">
                {activePromoPreview.period}
              </p>

              <button
                type="button"
                onClick={() => onChangePage("promo")}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Kelola Promo
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>

      <AdminSectionCard
        title="Aktivitas Terbaru"
        description="Update operasional terbaru dari request, proyek, pembayaran, dan promo."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {adminActivities.map((activity) => (
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
      </AdminSectionCard>
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