"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Save,
  Search,
  Send,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getInvoices, updateInvoice as updateInvoiceRecord } from "@/lib/api/projects";
import type { Invoice as DBInvoice } from "@/lib/supabase/types";

type PaymentStatus =
  | "Draft"
  | "Menunggu Pembayaran"
  | "Terbayar"
  | "Terlambat"
  | "Refund";

type PaymentTab = "Semua" | "Menunggu" | "Terbayar" | "Terlambat" | "Refund";

type InvoiceItem = {
  id: string;
  label: string;
  amount: string;
};

type InvoicePayment = {
  id: string;
  invoiceNumber: string;
  projectTitle: string;
  customerName: string;
  vendorName: string;
  status: PaymentStatus;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  paymentStage: string;
  dueDate: string;
  issuedAt: string;
  paymentMethod: string;
  adminNote: string;
  customerNote: string;
  items: InvoiceItem[];
  timeline: {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "draft" | "sent" | "paid" | "late" | "refund";
  }[];
};

type InvoiceDraft = {
  dueDate: string;
  paymentMethod: string;
  adminNote: string;
  customerNote: string;
};

const paymentTabs: PaymentTab[] = [
  "Semua",
  "Menunggu",
  "Terbayar",
  "Terlambat",
  "Refund",
];

const statusOptions: PaymentStatus[] = [
  "Draft",
  "Menunggu Pembayaran",
  "Terbayar",
  "Terlambat",
  "Refund",
];

const initialInvoices: InvoicePayment[] = [];

function mapDbToLocalInvoice(inv: DBInvoice): InvoicePayment {
  return {
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    projectTitle: inv.project_title,
    customerName: "-",
    vendorName: "-",
    status: (inv.status as PaymentStatus) || "Draft",
    totalAmount: inv.total_amount,
    paidAmount: inv.paid_amount || "Rp0",
    remainingAmount: inv.remaining_amount || "Rp0",
    paymentStage: inv.payment_stage || "-",
    dueDate: inv.due_date || "-",
    issuedAt: inv.issued_at ? new Date(inv.issued_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-",
    paymentMethod: inv.payment_method || "Transfer Bank",
    adminNote: inv.admin_note || "",
    customerNote: inv.customer_note || "",
    items: inv.items || [],
    timeline: (inv.timeline || []) as InvoicePayment["timeline"],
  };
}

function createDraft(invoice: InvoicePayment): InvoiceDraft {
  return {
    dueDate: invoice.dueDate,
    paymentMethod: invoice.paymentMethod,
    adminNote: invoice.adminNote,
    customerNote: invoice.customerNote,
  };
}

export function InvoicePaymentsView() {
  const [invoices, setInvoices] = useState<InvoicePayment[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<PaymentTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [invoiceDraft, setInvoiceDraft] = useState<InvoiceDraft | null>(null);
  const [isInvoiceSaved, setIsInvoiceSaved] = useState(false);

  const loadInvoices = useCallback(async () => {
    try {
      const data = await getInvoices();
      setInvoices(data.map(mapDbToLocalInvoice));
    } catch (error) {
      toast.error("Gagal memuat invoice dari database.");
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Menunggu" &&
          (invoice.status === "Draft" ||
            invoice.status === "Menunggu Pembayaran")) ||
        (activeTab === "Terbayar" && invoice.status === "Terbayar") ||
        (activeTab === "Terlambat" && invoice.status === "Terlambat") ||
        (activeTab === "Refund" && invoice.status === "Refund");

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        invoice.invoiceNumber.toLowerCase().includes(normalizedKeyword) ||
        invoice.projectTitle.toLowerCase().includes(normalizedKeyword) ||
        invoice.customerName.toLowerCase().includes(normalizedKeyword) ||
        invoice.vendorName.toLowerCase().includes(normalizedKeyword) ||
        invoice.paymentStage.toLowerCase().includes(normalizedKeyword) ||
        invoice.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, invoices, keyword]);

  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId) return null;

    return invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;
  }, [invoices, selectedInvoiceId]);

  const openDetail = (invoice: InvoicePayment) => {
    setSelectedInvoiceId(invoice.id);
    setInvoiceDraft(createDraft(invoice));
    setIsInvoiceSaved(false);
  };

  const closeDetail = () => {
    setSelectedInvoiceId(null);
    setInvoiceDraft(null);
    setIsInvoiceSaved(false);
  };

  const updateInvoice = (
    id: string,
    updater: (invoice: InvoicePayment) => InvoicePayment,
  ) => {
    setInvoices((current) =>
      current.map((invoice) => (invoice.id === id ? updater(invoice) : invoice)),
    );
  };

  const updateStatus = async (id: string, status: PaymentStatus) => {
    try {
      await updateInvoiceRecord(id, { status });
    } catch (error) {
      toast.error("Gagal mengirim invoice.");
      loadInvoices();
      return;
    }

    updateInvoice(id, (invoice) => {
      if (status === "Terbayar") {
        return {
          ...invoice,
          status,
          paidAmount: invoice.totalAmount,
          remainingAmount: "Rp0",
        };
      }

      return {
        ...invoice,
        status,
      };
    });

    if (status === "Draft" || status === "Menunggu Pembayaran") {
      setActiveTab("Menunggu");
    }

    if (status === "Terbayar") setActiveTab("Terbayar");
    if (status === "Terlambat") setActiveTab("Terlambat");
    if (status === "Refund") setActiveTab("Refund");
  };

  const saveInvoiceChanges = async () => {
    if (!selectedInvoice || !invoiceDraft) return;

    try {
      await updateInvoiceRecord(selectedInvoice.id, {
        due_date: invoiceDraft.dueDate || null,
        payment_method: invoiceDraft.paymentMethod || null,
        admin_note: invoiceDraft.adminNote || null,
        customer_note: invoiceDraft.customerNote || null,
      });

      updateInvoice(selectedInvoice.id, (invoice) => ({
        ...invoice,
        dueDate: invoiceDraft.dueDate,
        paymentMethod: invoiceDraft.paymentMethod,
        adminNote: invoiceDraft.adminNote,
        customerNote: invoiceDraft.customerNote,
      }));
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan invoice.");
      loadInvoices();
      return;
    }

    setIsInvoiceSaved(true);
  };

  if (selectedInvoice && invoiceDraft) {
    return (
      <InvoiceDetailPage
        invoice={selectedInvoice}
        invoiceDraft={invoiceDraft}
        isInvoiceSaved={isInvoiceSaved}
        onBack={closeDetail}
        onChangeDraft={(draft) => {
          setInvoiceDraft(draft);
          setIsInvoiceSaved(false);
        }}
        onSave={saveInvoiceChanges}
        onStatusChange={(status) => updateStatus(selectedInvoice.id, status)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Invoice & Pembayaran
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Daftar Invoice
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Kelola invoice proyek, termin pembayaran, status tagihan, metode
            pembayaran, jatuh tempo, dan catatan follow up customer.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari invoice, proyek, customer, vendor, termin, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as PaymentTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {paymentTabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
            />
          </div>

          <div className="hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-1.5 sm:block lg:col-span-2">
            <div className="flex gap-1.5 overflow-x-auto">
              {paymentTabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold transition ${
                      active
                        ? "bg-[#725F54] text-white shadow-sm"
                        : "text-[#6F6860] hover:bg-white"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredInvoices.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={() => openDetail(invoice)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Invoice tidak ditemukan.
            </p>

            <p className="mt-2 text-[13px] text-[#7B756E]">
              Coba ubah filter atau kata pencarian.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function InvoiceDetailPage({
  invoice,
  invoiceDraft,
  isInvoiceSaved,
  onBack,
  onChangeDraft,
  onSave,
  onStatusChange,
}: {
  invoice: InvoicePayment;
  invoiceDraft: InvoiceDraft;
  isInvoiceSaved: boolean;
  onBack: () => void;
  onChangeDraft: (draft: InvoiceDraft) => void;
  onSave: () => void;
  onStatusChange: (status: PaymentStatus) => void;
}) {
  const isInvoiceChanged =
    invoiceDraft.dueDate !== invoice.dueDate ||
    invoiceDraft.paymentMethod !== invoice.paymentMethod ||
    invoiceDraft.adminNote !== invoice.adminNote ||
    invoiceDraft.customerNote !== invoice.customerNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar invoice
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                {invoice.invoiceNumber}
              </p>

              <PaymentStatusBadge status={invoice.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {invoice.projectTitle}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              Invoice untuk tahap pembayaran{" "}
              <span className="font-semibold text-[#725F54]">
                {invoice.paymentStage}
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Invoice
            </label>

            <div className="relative mt-3">
              <select
                value={invoice.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as PaymentStatus)
                }
                className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-11 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <AmountTile
              label="Total Invoice"
              value={invoice.totalAmount}
              description="Nilai tagihan"
            />

            <AmountTile
              label="Sudah Dibayar"
              value={invoice.paidAmount}
              description="Pembayaran masuk"
            />

            <AmountTile
              label="Sisa Tagihan"
              value={invoice.remainingAmount}
              description="Belum dibayar"
              highlight
            />
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              icon={UserRound}
              label="Customer"
              value={invoice.customerName}
              description="Penerima invoice"
            />

            <InfoTile
              icon={Wallet}
              label="Vendor"
              value={invoice.vendorName}
              description="Vendor partner"
            />

            <InfoTile
              icon={CalendarDays}
              label="Jatuh Tempo"
              value={invoice.dueDate}
              description={invoice.issuedAt}
            />

            <InfoTile
              icon={CreditCard}
              label="Metode"
              value={invoice.paymentMethod}
              description="Metode pembayaran"
            />

            <InfoTile
              icon={FileText}
              label="Tahap"
              value={invoice.paymentStage}
              description="Termin pembayaran"
            />

            <InfoTile
              icon={Banknote}
              label="Status"
              value={invoice.status}
              description="Status pembayaran"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Rincian Tagihan"
            description="Komponen biaya yang masuk dalam invoice."
          >
            <div className="grid gap-2.5">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                >
                  <p className="min-w-0 text-[12px] font-medium leading-5 text-[#31332C]">
                    {item.label}
                  </p>

                  <p className="shrink-0 text-[12px] font-semibold text-[#725F54]">
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock
            title="Riwayat Pembayaran"
            description="Timeline status invoice dan pembayaran customer."
            withRightBorder={false}
          >
            <div className="grid gap-2.5">
              {invoice.timeline.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-semibold text-[#31332C]">
                      {item.title}
                    </p>

                    <PaymentTimelineBadge type={item.type} />
                  </div>

                  <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                    {item.description}
                  </p>

                  <p className="mt-2 text-[11px] text-[#9A8F86]">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </DetailBlock>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Pengaturan Invoice"
            description="Atur jatuh tempo dan metode pembayaran invoice."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Jatuh Tempo">
                <input
                  value={invoiceDraft.dueDate}
                  onChange={(event) =>
                    onChangeDraft({
                      ...invoiceDraft,
                      dueDate: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>

              <FormField label="Metode Pembayaran">
                <input
                  value={invoiceDraft.paymentMethod}
                  onChange={(event) =>
                    onChangeDraft({
                      ...invoiceDraft,
                      paymentMethod: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>
            </div>
          </DetailBlock>

          <DetailBlock
            title="Catatan Invoice"
            description="Catatan internal admin dan pesan untuk customer."
            badge={isInvoiceSaved ? "Tersimpan" : undefined}
            withRightBorder={false}
          >
            <FormField label="Catatan Admin">
              <textarea
                value={invoiceDraft.adminNote}
                onChange={(event) =>
                  onChangeDraft({
                    ...invoiceDraft,
                    adminNote: event.target.value,
                  })
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </FormField>

            <div className="mt-3">
              <FormField label="Catatan Customer">
                <textarea
                  value={invoiceDraft.customerNote}
                  onChange={(event) =>
                    onChangeDraft({
                      ...invoiceDraft,
                      customerNote: event.target.value,
                    })
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onSave}
                disabled={!isInvoiceChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                  isInvoiceChanged
                    ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                    : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                }`}
              >
                <Save size={14} />
                Simpan Perubahan
              </button>
            </div>
          </DetailBlock>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onStatusChange("Menunggu Pembayaran")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            invoice.status === "Menunggu Pembayaran"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <Send size={15} />
          Kirim
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Terbayar")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            invoice.status === "Terbayar"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <CheckCircle2 size={15} />
          Terbayar
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Terlambat")}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${
            invoice.status === "Terlambat"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <AlertTriangle size={15} />
          Terlambat
        </button>
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  description,
  children,
  badge,
  withRightBorder = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
  withRightBorder?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 lg:border-b-0 ${
        withRightBorder ? "lg:border-r" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {title}
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>

        {badge && (
          <span className="shrink-0 rounded-full border border-[#DCEBDD] bg-[#F5FAF6] px-3 py-1 text-[10px] font-semibold text-[#4F7A5F]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
        {label}
      </span>

      {children}
    </label>
  );
}

function InvoiceCard({
  invoice,
  onClick,
}: {
  invoice: InvoicePayment;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {invoice.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {invoice.invoiceNumber}
          </p>
        </div>

        <PaymentStatusBadge status={invoice.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {invoice.paymentStage} • {invoice.customerName}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">
            Total Tagihan
          </p>

          <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
            {invoice.totalAmount}
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          Jatuh tempo
          <br />
          {invoice.dueDate}
        </p>
      </div>
    </button>
  );
}

function AmountTile({
  label,
  value,
  description,
  highlight,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  const isLongValue = value.length > 8;

  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 transition ${
        highlight ? "border-[#D9C8BA] bg-white" : "border-[#E8E2D9] bg-white"
      } hover:border-[#725F54] hover:bg-[#FCFBF9]`}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p
        className={`mt-2 truncate font-serif leading-none text-[#31332C] ${
          isLongValue ? "text-[21px] sm:text-[22px]" : "text-[26px]"
        }`}
        title={value}
      >
        {value}
      </p>

      <p className="mt-2 truncate text-[11px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#31332C]">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-[#7B756E]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentTimelineBadge({
  type,
}: {
  type: "draft" | "sent" | "paid" | "late" | "refund";
}) {
  const label =
    type === "draft"
      ? "Draft"
      : type === "sent"
        ? "Dikirim"
        : type === "paid"
          ? "Terbayar"
          : type === "late"
            ? "Terlambat"
            : "Refund";

  const style =
    type === "paid"
      ? "bg-[#F5FAF6] text-[#4F7A5F]"
      : type === "late"
        ? "bg-[#FFF3EF] text-[#9A4A32]"
        : type === "refund"
          ? "bg-[#F8F6F2] text-[#7B756E]"
          : "bg-white text-[#725F54] ring-1 ring-[#E8E2D9]";

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${style}`}
    >
      {label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const style =
    status === "Terbayar"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Menunggu Pembayaran" || status === "Draft"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : status === "Terlambat"
          ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
          : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
