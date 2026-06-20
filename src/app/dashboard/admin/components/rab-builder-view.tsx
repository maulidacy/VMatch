"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Hammer,
  Save,
  Search,
  Send,
  UserRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { AdminPageId } from "../types";

type RabStatus =
  | "Menunggu Estimasi Vendor"
  | "Estimasi Dikirim Vendor"
  | "RAB Direview Admin"
  | "RAB Dikirim ke Customer"
  | "Disetujui Customer"
  | "Draft";

type RabTab = "Semua" | "Estimasi Vendor" | "Review Admin" | "Dikirim" | "Disetujui";

type RabItem = {
  id: string;
  category: "Material" | "Jasa" | "Tambahan";
  name: string;
  qty: string;
  unit: string;
  price: string;
  subtotal: string;
};

type VendorEstimate = {
  vendorName: string;
  estimatedCost: string;
  estimatedDuration: string;
  suggestedMaterial: string;
  vendorNote: string;
  sentAt: string;
};

type RabData = {
  id: string;
  projectTitle: string;
  customerName: string;
  projectType: string;
  location: string;
  status: RabStatus;
  createdAt: string;
  updatedAt: string;
  totalMaterial: string;
  totalLabor: string;
  totalAdditional: string;
  grandTotal: string;
  adminNote: string;
  customerNote: string;
  vendorEstimate?: VendorEstimate;
  items: RabItem[];
};

const rabTabs: RabTab[] = [
  "Semua",
  "Estimasi Vendor",
  "Review Admin",
  "Dikirim",
  "Disetujui",
];

const statusOptions: RabStatus[] = [
  "Menunggu Estimasi Vendor",
  "Estimasi Dikirim Vendor",
  "RAB Direview Admin",
  "RAB Dikirim ke Customer",
  "Disetujui Customer",
  "Draft",
];

const initialRabs: RabData[] = [
  {
    id: "rab-1",
    projectTitle: "Kitchen Set Modern Minimalis",
    customerName: "Alya Putri",
    projectType: "Kitchen Set",
    location: "Semarang",
    status: "Estimasi Dikirim Vendor",
    createdAt: "Hari ini",
    updatedAt: "Baru saja",
    totalMaterial: "Rp14.500.000",
    totalLabor: "Rp6.500.000",
    totalAdditional: "Rp2.500.000",
    grandTotal: "Rp23.500.000",
    adminNote:
      "Estimasi vendor perlu dicek ulang pada bagian top table, aksesoris soft close, dan biaya instalasi.",
    customerNote:
      "Estimasi awal akan difinalisasi setelah review admin dan validasi kebutuhan customer.",
    vendorEstimate: {
      vendorName: "Andi Interior Partner",
      estimatedCost: "Rp23.500.000",
      estimatedDuration: "14-21 hari kerja",
      suggestedMaterial: "Multiplek 18mm + HPL standar + top table solid surface",
      vendorNote:
        "Perlu survey ulang untuk memastikan panjang kabinet dan titik instalasi listrik sebelum produksi.",
      sentAt: "Baru saja",
    },
    items: [
      {
        id: "item-1",
        category: "Material",
        name: "Multiplek 18mm",
        qty: "6",
        unit: "lembar",
        price: "Rp850.000",
        subtotal: "Rp5.100.000",
      },
      {
        id: "item-2",
        category: "Material",
        name: "HPL motif kayu muda",
        qty: "8",
        unit: "lembar",
        price: "Rp420.000",
        subtotal: "Rp3.360.000",
      },
      {
        id: "item-3",
        category: "Jasa",
        name: "Produksi dan instalasi",
        qty: "1",
        unit: "paket",
        price: "Rp6.500.000",
        subtotal: "Rp6.500.000",
      },
      {
        id: "item-4",
        category: "Tambahan",
        name: "Aksesoris soft close",
        qty: "1",
        unit: "paket",
        price: "Rp2.500.000",
        subtotal: "Rp2.500.000",
      },
    ],
  },
  {
    id: "rab-2",
    projectTitle: "Wardrobe Kamar Utama",
    customerName: "Bima Santoso",
    projectType: "Wardrobe",
    location: "Yogyakarta",
    status: "Menunggu Estimasi Vendor",
    createdAt: "Kemarin",
    updatedAt: "Kemarin",
    totalMaterial: "Rp0",
    totalLabor: "Rp0",
    totalAdditional: "Rp0",
    grandTotal: "Rp0",
    adminNote:
      "Brief sudah dikirim ke vendor dan sedang menunggu estimasi RAB.",
    customerNote:
      "RAB belum tersedia karena admin masih menunggu estimasi dari vendor.",
    items: [],
  },
  {
    id: "rab-3",
    projectTitle: "Ruang Kerja Rumah",
    customerName: "Nadia Rahma",
    projectType: "Ruang Kerja",
    location: "Solo",
    status: "RAB Dikirim ke Customer",
    createdAt: "2 Juli 2026",
    updatedAt: "3 hari lalu",
    totalMaterial: "Rp6.000.000",
    totalLabor: "Rp3.500.000",
    totalAdditional: "Rp1.000.000",
    grandTotal: "Rp10.500.000",
    adminNote:
      "RAB sudah direview admin dan dikirim ke customer untuk persetujuan.",
    customerNote:
      "Estimasi sudah termasuk meja kerja, ambalan, dan storage kecil.",
    vendorEstimate: {
      vendorName: "Ruang Rapi Studio",
      estimatedCost: "Rp10.500.000",
      estimatedDuration: "10-14 hari kerja",
      suggestedMaterial: "Multiplek standar + finishing HPL warna terang",
      vendorNote:
        "Pekerjaan relatif sederhana, namun perlu menyesuaikan titik stop kontak area meja.",
      sentAt: "3 hari lalu",
    },
    items: [
      {
        id: "item-1",
        category: "Material",
        name: "Multiplek",
        qty: "4",
        unit: "lembar",
        price: "Rp700.000",
        subtotal: "Rp2.800.000",
      },
      {
        id: "item-2",
        category: "Jasa",
        name: "Produksi meja dan rak",
        qty: "1",
        unit: "paket",
        price: "Rp3.500.000",
        subtotal: "Rp3.500.000",
      },
      {
        id: "item-3",
        category: "Tambahan",
        name: "Ambalan tambahan",
        qty: "1",
        unit: "paket",
        price: "Rp1.000.000",
        subtotal: "Rp1.000.000",
      },
    ],
  },
];

function matchRabTab(rab: RabData, tab: RabTab) {
  if (tab === "Semua") return true;
  if (tab === "Estimasi Vendor") {
    return (
      rab.status === "Menunggu Estimasi Vendor" ||
      rab.status === "Estimasi Dikirim Vendor"
    );
  }
  if (tab === "Review Admin") return rab.status === "RAB Direview Admin";
  if (tab === "Dikirim") return rab.status === "RAB Dikirim ke Customer";
  if (tab === "Disetujui") return rab.status === "Disetujui Customer";

  return true;
}

export function RabBuilderView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [rabs, setRabs] = useState<RabData[]>(initialRabs);
  const [activeTab, setActiveTab] = useState<RabTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedRabId, setSelectedRabId] = useState<string | null>(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [customerNoteDraft, setCustomerNoteDraft] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const filteredRabs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return rabs.filter((rab) => {
      const matchTab = matchRabTab(rab, activeTab);

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        rab.projectTitle.toLowerCase().includes(normalizedKeyword) ||
        rab.customerName.toLowerCase().includes(normalizedKeyword) ||
        rab.location.toLowerCase().includes(normalizedKeyword) ||
        rab.projectType.toLowerCase().includes(normalizedKeyword) ||
        rab.status.toLowerCase().includes(normalizedKeyword) ||
        rab.vendorEstimate?.vendorName.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, rabs]);

  const selectedRab = useMemo(() => {
    if (!selectedRabId) return null;
    return rabs.find((rab) => rab.id === selectedRabId) ?? null;
  }, [rabs, selectedRabId]);

  const openDetail = (rab: RabData) => {
    setSelectedRabId(rab.id);
    setAdminNoteDraft(rab.adminNote);
    setCustomerNoteDraft(rab.customerNote);
    setIsSaved(false);
    setFeedbackMessage("");
  };

  const closeDetail = () => {
    setSelectedRabId(null);
    setAdminNoteDraft("");
    setCustomerNoteDraft("");
    setIsSaved(false);
    setFeedbackMessage("");
  };

  const updateRab = (id: string, updater: (rab: RabData) => RabData) => {
    setRabs((current) =>
      current.map((rab) => (rab.id === id ? updater(rab) : rab)),
    );
  };

  const updateStatus = (id: string, status: RabStatus) => {
    updateRab(id, (rab) => ({
      ...rab,
      status,
      updatedAt: "Baru saja",
    }));

    if (
      status === "Menunggu Estimasi Vendor" ||
      status === "Estimasi Dikirim Vendor"
    ) {
      setActiveTab("Estimasi Vendor");
    }
    if (status === "RAB Direview Admin") setActiveTab("Review Admin");
    if (status === "RAB Dikirim ke Customer") setActiveTab("Dikirim");
    if (status === "Disetujui Customer") setActiveTab("Disetujui");
  };

  const saveNotes = () => {
    if (!selectedRab) return;

    updateRab(selectedRab.id, (rab) => ({
      ...rab,
      adminNote: adminNoteDraft,
      customerNote: customerNoteDraft,
      updatedAt: "Baru saja",
    }));

    setIsSaved(true);
  };

  const reviewVendorEstimate = () => {
    if (!selectedRab) return;

    updateStatus(selectedRab.id, "RAB Direview Admin");
    setFeedbackMessage(
      "Estimasi vendor masuk ke tahap review admin. Harga belum dikirim ke customer.",
    );
  };

  const sendRabToCustomer = () => {
    if (!selectedRab) return;

    updateStatus(selectedRab.id, "RAB Dikirim ke Customer");
    setFeedbackMessage("RAB final berhasil dikirim ke customer untuk persetujuan.");
  };

  if (selectedRab) {
    const canReview = selectedRab.status === "Estimasi Dikirim Vendor";
    const canSendCustomer =
      selectedRab.status === "RAB Direview Admin" ||
      selectedRab.status === "Draft";

    return (
      <RabDetailPage
        rab={selectedRab}
        adminNoteDraft={adminNoteDraft}
        customerNoteDraft={customerNoteDraft}
        isSaved={isSaved}
        feedbackMessage={feedbackMessage}
        canReview={canReview}
        canSendCustomer={canSendCustomer}
        onBack={closeDetail}
        onChangeAdminNote={(value) => {
          setAdminNoteDraft(value);
          setIsSaved(false);
        }}
        onChangeCustomerNote={(value) => {
          setCustomerNoteDraft(value);
          setIsSaved(false);
        }}
        onSave={saveNotes}
        onStatusChange={(status) => updateStatus(selectedRab.id, status)}
        onReviewVendorEstimate={reviewVendorEstimate}
        onSendRabToCustomer={sendRabToCustomer}
        onGoPayment={() => onChangePage?.("payments")}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[860px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            RAB Builder
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Review RAB Proyek
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Review estimasi dari vendor, susun RAB final, dan kirimkan RAB yang
            sudah divalidasi admin kepada customer.
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
              placeholder="Cari RAB, proyek, customer, vendor, lokasi, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as RabTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {rabTabs.map((tab) => (
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
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {rabTabs.map((tab) => {
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
        {filteredRabs.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredRabs.map((rab) => (
              <RabListCard key={rab.id} rab={rab} onClick={() => openDetail(rab)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              RAB tidak ditemukan.
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

function RabDetailPage({
  rab,
  adminNoteDraft,
  customerNoteDraft,
  isSaved,
  feedbackMessage,
  canReview,
  canSendCustomer,
  onBack,
  onChangeAdminNote,
  onChangeCustomerNote,
  onSave,
  onStatusChange,
  onReviewVendorEstimate,
  onSendRabToCustomer,
  onGoPayment,
}: {
  rab: RabData;
  adminNoteDraft: string;
  customerNoteDraft: string;
  isSaved: boolean;
  feedbackMessage: string;
  canReview: boolean;
  canSendCustomer: boolean;
  onBack: () => void;
  onChangeAdminNote: (value: string) => void;
  onChangeCustomerNote: (value: string) => void;
  onSave: () => void;
  onStatusChange: (status: RabStatus) => void;
  onReviewVendorEstimate: () => void;
  onSendRabToCustomer: () => void;
  onGoPayment: () => void;
}) {
  const isChanged =
    adminNoteDraft !== rab.adminNote || customerNoteDraft !== rab.customerNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar RAB
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                RAB Proyek
              </p>

              <RabStatusBadge status={rab.status} />
            </div>

            <h1 className="mt-3 max-w-[820px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {rab.projectTitle}
            </h1>

            <p className="mt-3 max-w-[860px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              RAB ini disusun dari estimasi vendor dan hanya boleh dikirim ke
              customer setelah review admin selesai.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status RAB
            </label>

            <div className="relative mt-3">
              <select
                value={rab.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as RabStatus)
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

        {feedbackMessage && (
          <div className="border-t border-[#E8E2D9] bg-[#F5FAF6] px-5 py-3 text-[12px] font-semibold text-[#4F7A5F] sm:px-6">
            {feedbackMessage}
          </div>
        )}

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              icon={UserRound}
              label="Customer"
              value={rab.customerName}
              description={rab.location}
            />

            <InfoTile
              icon={Hammer}
              label="Jenis Proyek"
              value={rab.projectType}
              description="Kategori pekerjaan"
            />

            <InfoTile
              icon={Wallet}
              label="Grand Total"
              value={rab.grandTotal}
              description="Estimasi final admin"
            />

            <InfoTile
              icon={CalendarDays}
              label="Update"
              value={rab.updatedAt}
              description={rab.createdAt}
            />
          </div>
        </div>

        <VendorEstimateSection estimate={rab.vendorEstimate} status={rab.status} />

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <AmountTile
              label="Material"
              value={rab.totalMaterial}
              description="Biaya material"
            />

            <AmountTile label="Jasa" value={rab.totalLabor} description="Biaya pengerjaan" />

            <AmountTile
              label="Tambahan"
              value={rab.totalAdditional}
              description="Aksesoris / biaya lain"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <DetailSection
            title="Rincian RAB"
            description="Item material, jasa, dan biaya tambahan yang sudah disusun admin."
          >
            {rab.items.length > 0 ? (
              <div className="grid gap-2.5">
                {rab.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-[#31332C]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[11px] text-[#7B756E]">
                          {item.category} • {item.qty} {item.unit} × {item.price}
                        </p>
                      </div>

                      <p className="text-[12px] font-semibold text-[#725F54]">
                        {item.subtotal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBox text="Rincian RAB belum tersedia karena estimasi vendor belum masuk." />
            )}
          </DetailSection>

          <DetailSection
            title="Catatan Admin"
            description="Catatan internal dan catatan yang akan dikirim ke customer."
            withRightBorder={false}
          >
            <div className="grid gap-3">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                  Catatan Internal Admin
                </span>

                <textarea
                  value={adminNoteDraft}
                  onChange={(event) => onChangeAdminNote(event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                  Catatan untuk Customer
                </span>

                <textarea
                  value={customerNoteDraft}
                  onChange={(event) => onChangeCustomerNote(event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!isChanged}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                    isChanged
                      ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
                      : "cursor-not-allowed bg-[#E8E2D9] text-[#9A8F86]"
                  }`}
                >
                  <Save size={14} />
                  {isSaved ? "Tersimpan" : "Simpan Catatan"}
                </button>
              </div>
            </div>
          </DetailSection>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onReviewVendorEstimate}
          disabled={!canReview}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            canReview
              ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
              : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
          }`}
        >
          <ClipboardCheck size={15} />
          Review Estimasi
        </button>

        <button
          type="button"
          onClick={onSendRabToCustomer}
          disabled={!canSendCustomer}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            canSendCustomer
              ? "border-[#725F54] bg-[#725F54] text-white hover:bg-[#5A4A42]"
              : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
          }`}
        >
          <Send size={15} />
          Kirim Customer
        </button>

        <button
          type="button"
          onClick={onGoPayment}
          className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white sm:col-span-1"
        >
          <ArrowRight size={15} />
          Ke Invoice
        </button>
      </div>
    </div>
  );
}

function VendorEstimateSection({
  estimate,
  status,
}: {
  estimate?: VendorEstimate;
  status: RabStatus;
}) {
  return (
    <div className="border-t border-[#E8E2D9] bg-[#FFFDF9] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            Estimasi dari Vendor
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
            Estimasi ini menjadi bahan review admin dan belum langsung dikirim
            ke customer.
          </p>
        </div>

        <RabStatusBadge status={status} />
      </div>

      {estimate ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)]">
          <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4">
            <p className="text-[13px] font-semibold text-[#31332C]">
              {estimate.vendorName}
            </p>

            <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
              {estimate.vendorNote}
            </p>

            <p className="mt-3 text-[11px] text-[#9A8F86]">
              Dikirim: {estimate.sentAt}
            </p>
          </div>

          <div className="grid gap-2.5">
            <MiniInfo label="Estimasi Biaya" value={estimate.estimatedCost} />
            <MiniInfo label="Estimasi Durasi" value={estimate.estimatedDuration} />
            <MiniInfo label="Material" value={estimate.suggestedMaterial} />
          </div>
        </div>
      ) : (
        <EmptyBox text="Estimasi vendor belum masuk. RAB final belum bisa dikirim ke customer." />
      )}
    </div>
  );
}

function RabListCard({ rab, onClick }: { rab: RabData; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {rab.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {rab.customerName} • {rab.location}
          </p>
        </div>

        <RabStatusBadge status={rab.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {rab.vendorEstimate
          ? `Estimasi dari ${rab.vendorEstimate.vendorName}: ${rab.vendorEstimate.estimatedCost}`
          : "Menunggu estimasi dari vendor."}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">Grand Total</p>
          <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
            {rab.grandTotal}
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          Update
          <br />
          {rab.updatedAt}
        </p>
      </div>
    </button>
  );
}

function DetailSection({
  title,
  description,
  children,
  withRightBorder = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  withRightBorder?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 ${
        withRightBorder ? "xl:border-r" : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {title}
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
        {description}
      </p>

      <div className="mt-4">{children}</div>
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

function AmountTile({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  const isLongValue = value.length > 8;

  return (
    <div className="min-w-0 rounded-2xl border border-[#E8E2D9] bg-white p-4 transition hover:border-[#725F54] hover:bg-[#FCFBF9]">
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

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold leading-5 text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-6 text-center">
      <p className="text-[13px] font-semibold text-[#31332C]">{text}</p>
    </div>
  );
}

function RabStatusBadge({ status }: { status: RabStatus }) {
  const style =
    status === "Estimasi Dikirim Vendor" ||
    status === "RAB Direview Admin" ||
    status === "RAB Dikirim ke Customer"
      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
      : status === "Disetujui Customer"
        ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
        : status === "Menunggu Estimasi Vendor"
          ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
          : "border-[#E8E2D9] bg-white text-[#7B756E]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
