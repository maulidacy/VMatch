"use client";

import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  ReceiptText,
  Send,
  UserRound,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

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

const paymentTabs: PaymentTab[] = [
  "Semua",
  "Menunggu",
  "Terbayar",
  "Terlambat",
  "Refund",
];

const initialInvoices: InvoicePayment[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-VM-0726-001",
    projectTitle: "Kitchen Set Minimalis",
    customerName: "Alya Putri",
    vendorName: "Kayu Rapi Interior",
    status: "Menunggu Pembayaran",
    totalAmount: "Rp23.500.000",
    paidAmount: "Rp10.000.000",
    remainingAmount: "Rp13.500.000",
    paymentStage: "Termin 2 - Produksi",
    dueDate: "15 Juli 2026",
    issuedAt: "10 Juli 2026",
    paymentMethod: "Transfer Bank",
    adminNote:
      "Customer sudah membayar DP. Invoice termin 2 dikirim setelah produksi kabinet dimulai.",
    customerNote:
      "Mohon lakukan pembayaran sesuai nominal dan batas waktu yang tertera.",
    items: [
      {
        id: "item-1",
        label: "DP proyek kitchen set",
        amount: "Rp10.000.000",
      },
      {
        id: "item-2",
        label: "Termin produksi kabinet",
        amount: "Rp13.500.000",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Invoice dibuat",
        description: "Admin membuat invoice termin 2.",
        time: "10 Juli 2026",
        type: "draft",
      },
      {
        id: "tl-2",
        title: "Invoice dikirim",
        description: "Invoice dikirim ke customer untuk pembayaran termin 2.",
        time: "10 Juli 2026",
        type: "sent",
      },
    ],
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-VM-0726-002",
    projectTitle: "Wardrobe Kamar Utama",
    customerName: "Bima Santoso",
    vendorName: "Mitra Interior Jogja",
    status: "Draft",
    totalAmount: "Rp16.000.000",
    paidAmount: "Rp0",
    remainingAmount: "Rp16.000.000",
    paymentStage: "DP Awal",
    dueDate: "18 Juli 2026",
    issuedAt: "Belum dikirim",
    paymentMethod: "Transfer Bank",
    adminNote:
      "Invoice masih draft karena brief final belum disetujui customer.",
    customerNote:
      "Invoice akan dikirim setelah brief dan estimasi biaya disetujui.",
    items: [
      {
        id: "item-1",
        label: "DP awal proyek wardrobe",
        amount: "Rp8.000.000",
      },
      {
        id: "item-2",
        label: "Sisa pembayaran estimasi",
        amount: "Rp8.000.000",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Draft invoice dibuat",
        description: "Admin menyiapkan invoice awal untuk proyek wardrobe.",
        time: "Hari ini",
        type: "draft",
      },
    ],
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-VM-0726-003",
    projectTitle: "Ruang Kerja Rumah",
    customerName: "Nadia Rahma",
    vendorName: "Studio Ruang Karya",
    status: "Terlambat",
    totalAmount: "Rp10.500.000",
    paidAmount: "Rp5.000.000",
    remainingAmount: "Rp5.500.000",
    paymentStage: "Pelunasan",
    dueDate: "12 Juli 2026",
    issuedAt: "8 Juli 2026",
    paymentMethod: "Transfer Bank",
    adminNote:
      "Pembayaran pelunasan melewati batas waktu. Perlu follow up customer.",
    customerNote:
      "Mohon segera menyelesaikan pembayaran agar proses serah terima dapat dilanjutkan.",
    items: [
      {
        id: "item-1",
        label: "DP proyek ruang kerja",
        amount: "Rp5.000.000",
      },
      {
        id: "item-2",
        label: "Pelunasan setelah pemasangan",
        amount: "Rp5.500.000",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Invoice dikirim",
        description: "Invoice pelunasan dikirim ke customer.",
        time: "8 Juli 2026",
        type: "sent",
      },
      {
        id: "tl-2",
        title: "Pembayaran melewati jatuh tempo",
        description: "Customer belum melakukan pelunasan.",
        time: "12 Juli 2026",
        type: "late",
      },
    ],
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-VM-0626-009",
    projectTitle: "Backdrop TV Ruang Keluarga",
    customerName: "Raka Pratama",
    vendorName: "Warm Living Interior",
    status: "Terbayar",
    totalAmount: "Rp13.800.000",
    paidAmount: "Rp13.800.000",
    remainingAmount: "Rp0",
    paymentStage: "Lunas",
    dueDate: "10 Juli 2026",
    issuedAt: "25 Juni 2026",
    paymentMethod: "Transfer Bank",
    adminNote:
      "Pembayaran sudah lunas. Proyek masuk periode garansi dan dokumentasi akhir.",
    customerNote:
      "Terima kasih, pembayaran telah diterima oleh VMatch.",
    items: [
      {
        id: "item-1",
        label: "DP backdrop TV",
        amount: "Rp6.000.000",
      },
      {
        id: "item-2",
        label: "Pelunasan proyek",
        amount: "Rp7.800.000",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        title: "DP diterima",
        description: "Customer membayar DP proyek.",
        time: "25 Juni 2026",
        type: "paid",
      },
      {
        id: "tl-2",
        title: "Pelunasan diterima",
        description: "Customer menyelesaikan pembayaran proyek.",
        time: "8 Juli 2026",
        type: "paid",
      },
    ],
  },
];

export function InvoicePaymentsView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [invoices, setInvoices] =
    useState<InvoicePayment[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<PaymentTab>("Semua");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    initialInvoices[0]?.id ?? "",
  );

  const selectedInvoice = useMemo(() => {
    return (
      invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
      invoices[0]
    );
  }, [invoices, selectedInvoiceId]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Menunggu") {
        return (
          invoice.status === "Draft" ||
          invoice.status === "Menunggu Pembayaran"
        );
      }
      if (activeTab === "Terbayar") return invoice.status === "Terbayar";
      if (activeTab === "Terlambat") return invoice.status === "Terlambat";
      return invoice.status === "Refund";
    });
  }, [activeTab, invoices]);

  const waitingCount = invoices.filter(
    (invoice) =>
      invoice.status === "Draft" || invoice.status === "Menunggu Pembayaran",
  ).length;

  const paidCount = invoices.filter(
    (invoice) => invoice.status === "Terbayar",
  ).length;

  const lateCount = invoices.filter(
    (invoice) => invoice.status === "Terlambat",
  ).length;

  const refundCount = invoices.filter(
    (invoice) => invoice.status === "Refund",
  ).length;

  const updateSelectedInvoice = (
    field: keyof InvoicePayment,
    value: string | PaymentStatus,
  ) => {
    if (!selectedInvoice) return;

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoice.id
          ? {
              ...invoice,
              [field]: value,
            }
          : invoice,
      ),
    );
  };

  const updateStatus = (status: PaymentStatus) => {
    updateSelectedInvoice("status", status);

    if (status === "Terbayar") {
      updateSelectedInvoice("paidAmount", selectedInvoice.totalAmount);
      updateSelectedInvoice("remainingAmount", "Rp0");
      setActiveTab("Terbayar");
    }

    if (status === "Terlambat") {
      setActiveTab("Terlambat");
    }

    if (status === "Refund") {
      setActiveTab("Refund");
    }
  };

  if (!selectedInvoice) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Keuangan & Perencanaan
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Invoice & Pembayaran
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola invoice customer, tahap pembayaran, status pelunasan, dan
            tindak lanjut pembayaran proyek.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangePage?.("progress-qc")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          Dari Progress & QC
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <PaymentMiniStat
          icon={ReceiptText}
          label="Total Invoice"
          value={`${invoices.length}`}
          description="Invoice proyek"
        />

        <PaymentMiniStat
          icon={Clock}
          label="Menunggu"
          value={`${waitingCount}`}
          description="Draft atau belum dibayar"
        />

        <PaymentMiniStat
          icon={CheckCircle2}
          label="Terbayar"
          value={`${paidCount}`}
          description="Pembayaran selesai"
        />

        <PaymentMiniStat
          icon={AlertTriangle}
          label="Terlambat"
          value={`${lateCount}`}
          description="Perlu follow up"
        />
      </section>

      <AdminSectionCard title="Daftar Invoice">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {paymentTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-11 items-center justify-center rounded-xl px-2 text-[10px] font-semibold transition sm:text-[13px] ${
                    active
                      ? "bg-[#725F54] text-white shadow-sm"
                      : "text-[#6F6860] hover:bg-[#F8F6F2]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                selected={selectedInvoice.id === invoice.id}
                onClick={() => setSelectedInvoiceId(invoice.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada invoice pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Invoice akan muncul sesuai status pembayarannya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Invoice"
          action={<PaymentStatusBadge status={selectedInvoice.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                {selectedInvoice.invoiceNumber}
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedInvoice.projectTitle}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                Invoice untuk tahap pembayaran{" "}
                <span className="font-semibold text-[#725F54]">
                  {selectedInvoice.paymentStage}
                </span>
                .
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <AmountTile
                label="Total Invoice"
                value={selectedInvoice.totalAmount}
                description="Nilai tagihan"
              />

              <AmountTile
                label="Sudah Dibayar"
                value={selectedInvoice.paidAmount}
                description="Pembayaran masuk"
              />

              <AmountTile
                label="Sisa Tagihan"
                value={selectedInvoice.remainingAmount}
                description="Belum dibayar"
                highlight
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile
                icon={UserRound}
                label="Customer"
                value={selectedInvoice.customerName}
                description="Penerima invoice"
              />

              <InfoTile
                icon={Wallet}
                label="Vendor"
                value={selectedInvoice.vendorName}
                description="Vendor partner"
              />

              <InfoTile
                icon={CalendarDays}
                label="Jatuh Tempo"
                value={selectedInvoice.dueDate}
                description={selectedInvoice.issuedAt}
              />

              <InfoTile
                icon={CreditCard}
                label="Metode"
                value={selectedInvoice.paymentMethod}
                description="Metode pembayaran"
              />

              <InfoTile
                icon={FileText}
                label="Tahap"
                value={selectedInvoice.paymentStage}
                description="Termin pembayaran"
              />

              <InfoTile
                icon={Banknote}
                label="Refund"
                value={`${refundCount} data`}
                description="Data refund"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Rincian Tagihan
                </p>

                <div className="mt-3 space-y-2.5">
                  {selectedInvoice.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-white p-3"
                    >
                      <p className="text-[12px] font-medium text-[#31332C]">
                        {item.label}
                      </p>

                      <p className="shrink-0 text-[12px] font-semibold text-[#725F54]">
                        {item.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Riwayat Pembayaran
                </p>

                <div className="mt-3 space-y-2.5">
                  {selectedInvoice.timeline.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#E8E2D9] bg-white p-3"
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
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedInvoice.adminNote}
                  onChange={(event) =>
                    updateSelectedInvoice("adminNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Customer
                </span>

                <textarea
                  value={selectedInvoice.customerNote}
                  onChange={(event) =>
                    updateSelectedInvoice("customerNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Invoice">
            <div className="space-y-3">
              <ActionButton
                icon={Send}
                title="Kirim Invoice"
                description="Ubah status menjadi menunggu pembayaran."
                onClick={() => updateStatus("Menunggu Pembayaran")}
              />

              <ActionButton
                icon={CheckCircle2}
                title="Tandai Terbayar"
                description="Tandai invoice sudah lunas."
                onClick={() => updateStatus("Terbayar")}
              />

              <ActionButton
                icon={AlertTriangle}
                title="Tandai Terlambat"
                description="Gunakan jika melewati jatuh tempo."
                onClick={() => updateStatus("Terlambat")}
              />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Ubah Status">
            <div className="grid gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateStatus(status)}
                  className={`flex h-10 items-center justify-between rounded-xl border px-3 text-left text-[12px] font-semibold transition ${
                    selectedInvoice.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedInvoice.status === status && (
                    <CheckCircle2 size={15} />
                  )}
                </button>
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Navigasi Cepat">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => onChangePage?.("progress-qc")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Progress & QC
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("rab-builder")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Ke RAB Builder
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: PaymentStatus[] = [
  "Draft",
  "Menunggu Pembayaran",
  "Terbayar",
  "Terlambat",
  "Refund",
];

function InvoiceCard({
  invoice,
  selected,
  onClick,
}: {
  invoice: InvoicePayment;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[#D9C8BA] bg-[#FFFDF9]"
          : "border-[#E8E2D9] bg-[#FCFBF9] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {invoice.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {invoice.invoiceNumber}
          </p>
        </div>

        <PaymentStatusBadge status={invoice.status} />
      </div>

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

function PaymentMiniStat({
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
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={17} strokeWidth={2} />
        </div>

        <p className="min-w-0 truncate text-right font-serif text-[25px] leading-none text-[#31332C]">
          {value}
        </p>
      </div>

      <p className="mt-4 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>
    </div>
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
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-[#D9C8BA] bg-[#FFFDF9]"
          : "border-[#E8E2D9] bg-[#FCFBF9]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-2 font-serif text-[25px] leading-none text-[#31332C]">
        {value}
      </p>

      <p className="mt-2 text-[11px] text-[#7B756E]">{description}</p>
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-white text-[#725F54]">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-1 truncate text-[13px] font-semibold text-[#31332C]">
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

function ActionButton({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-left transition hover:border-[#D9C8BA] hover:bg-white"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#725F54] ring-1 ring-[#E8E2D9]">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[13px] font-semibold text-[#31332C]">{title}</p>

        <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
          {description}
        </p>
      </div>
    </button>
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
          : "bg-[#FCFBF9] text-[#725F54]";

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${style}`}>
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
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}