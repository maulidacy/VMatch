"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { AdminPageId } from "../types";

type VendorStatus =
  | "Aktif"
  | "Menunggu Review"
  | "Perlu Evaluasi"
  | "Nonaktif";

type VendorTab = "Semua" | "Aktif" | "Review" | "Evaluasi" | "Nonaktif";

type VendorPartner = {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  serviceArea: string;
  specialty: string[];
  completedProjects: number;
  activeProjects: number;
  status: VendorStatus;
  joinedAt: string;
  lastActivity: string;
  adminNote: string;
  vendorSummary: string;
  currentProjects: {
    id: string;
    title: string;
    customerName: string;
    progress: number;
    status: string;
  }[];
};

const vendorTabs: VendorTab[] = [
  "Semua",
  "Aktif",
  "Review",
  "Evaluasi",
  "Nonaktif",
];

const statusOptions: VendorStatus[] = [
  "Aktif",
  "Menunggu Review",
  "Perlu Evaluasi",
  "Nonaktif",
];

const initialVendors: VendorPartner[] = [
  {
    id: "vendor-1",
    name: "Kayu Rapi Interior",
    ownerName: "Andi Prasetyo",
    email: "kayurapi@email.com",
    phone: "0812-8888-2211",
    city: "Semarang",
    serviceArea: "Semarang, Ungaran, Kendal",
    specialty: ["Kitchen Set", "Kabinet", "Backdrop TV"],
    completedProjects: 18,
    activeProjects: 2,
    status: "Aktif",
    joinedAt: "12 Mei 2026",
    lastActivity: "Hari ini",
    adminNote:
      "Vendor cukup responsif dan hasil finishing rapi. Cocok untuk proyek kitchen set dan kabinet custom.",
    vendorSummary:
      "Vendor interior custom dengan fokus pengerjaan kabinet, kitchen set, dan furniture built-in.",
    currentProjects: [
      {
        id: "project-1",
        title: "Kitchen Set Minimalis",
        customerName: "Alya Putri",
        progress: 45,
        status: "Produksi kabinet",
      },
      {
        id: "project-2",
        title: "Backdrop TV Modern",
        customerName: "Raka Pratama",
        progress: 70,
        status: "Instalasi",
      },
    ],
  },
  {
    id: "vendor-2",
    name: "Mitra Interior Jogja",
    ownerName: "Bayu Nugroho",
    email: "mitrajogja@email.com",
    phone: "0821-7777-9921",
    city: "Yogyakarta",
    serviceArea: "Yogyakarta, Sleman, Bantul",
    specialty: ["Wardrobe", "Partisi", "Storage"],
    completedProjects: 12,
    activeProjects: 1,
    status: "Perlu Evaluasi",
    joinedAt: "20 Mei 2026",
    lastActivity: "Kemarin",
    adminNote:
      "Perlu evaluasi karena beberapa revisi layout cukup lama ditanggapi. Masih bisa dipakai untuk proyek sederhana.",
    vendorSummary:
      "Vendor spesialis wardrobe dan storage custom untuk ruang kamar dan area penyimpanan.",
    currentProjects: [
      {
        id: "project-1",
        title: "Wardrobe Kamar Utama",
        customerName: "Bima Santoso",
        progress: 35,
        status: "Revisi layout",
      },
    ],
  },
  {
    id: "vendor-3",
    name: "Studio Ruang Karya",
    ownerName: "Dian Puspita",
    email: "ruangkarya@email.com",
    phone: "0857-3000-1100",
    city: "Solo",
    serviceArea: "Solo, Sukoharjo, Karanganyar",
    specialty: ["Ruang Kerja", "Meja Custom", "Rak Buku"],
    completedProjects: 21,
    activeProjects: 1,
    status: "Aktif",
    joinedAt: "5 April 2026",
    lastActivity: "Hari ini",
    adminNote:
      "Vendor sangat rapi untuk proyek ruang kerja dan furniture sederhana. Komunikasi cukup cepat.",
    vendorSummary:
      "Vendor interior custom dengan fokus furniture fungsional untuk rumah dan ruang kerja.",
    currentProjects: [
      {
        id: "project-1",
        title: "Ruang Kerja Rumah",
        customerName: "Nadia Rahma",
        progress: 82,
        status: "QC finishing",
      },
    ],
  },
  {
    id: "vendor-4",
    name: "Vendor Baru Interior",
    ownerName: "Fajar Ramadhan",
    email: "vendorbaru@email.com",
    phone: "0813-5555-1020",
    city: "Semarang",
    serviceArea: "Semarang",
    specialty: ["Kitchen Set", "Wardrobe"],
    completedProjects: 0,
    activeProjects: 0,
    status: "Menunggu Review",
    joinedAt: "Hari ini",
    lastActivity: "Hari ini",
    adminNote:
      "Vendor baru perlu dicek portofolio, legalitas usaha, area layanan, dan kapasitas pengerjaan.",
    vendorSummary:
      "Vendor baru yang mengajukan kerja sama sebagai partner interior VMatch.",
    currentProjects: [],
  },
];

export function VendorPartnerView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [vendors, setVendors] = useState<VendorPartner[]>(initialVendors);
  const [activeTab, setActiveTab] = useState<VendorTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [vendorNameDraft, setVendorNameDraft] = useState("");
  const [serviceAreaDraft, setServiceAreaDraft] = useState("");
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isVendorSaved, setIsVendorSaved] = useState(false);

  const filteredVendors = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Aktif" && vendor.status === "Aktif") ||
        (activeTab === "Review" && vendor.status === "Menunggu Review") ||
        (activeTab === "Evaluasi" && vendor.status === "Perlu Evaluasi") ||
        (activeTab === "Nonaktif" && vendor.status === "Nonaktif");

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        vendor.name.toLowerCase().includes(normalizedKeyword) ||
        vendor.ownerName.toLowerCase().includes(normalizedKeyword) ||
        vendor.email.toLowerCase().includes(normalizedKeyword) ||
        vendor.phone.toLowerCase().includes(normalizedKeyword) ||
        vendor.city.toLowerCase().includes(normalizedKeyword) ||
        vendor.serviceArea.toLowerCase().includes(normalizedKeyword) ||
        vendor.status.toLowerCase().includes(normalizedKeyword) ||
        vendor.specialty.join(" ").toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, keyword, vendors]);

  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;

    return vendors.find((vendor) => vendor.id === selectedVendorId) ?? null;
  }, [selectedVendorId, vendors]);

  const evaluationCount = useMemo(
    () => vendors.filter((vendor) => vendor.status === "Perlu Evaluasi").length,
    [vendors],
  );

  const openDetail = (vendor: VendorPartner) => {
    setSelectedVendorId(vendor.id);
    setVendorNameDraft(vendor.name);
    setServiceAreaDraft(vendor.serviceArea);
    setAdminNoteDraft(vendor.adminNote);
    setIsVendorSaved(false);
  };

  const closeDetail = () => {
    setSelectedVendorId(null);
    setVendorNameDraft("");
    setServiceAreaDraft("");
    setAdminNoteDraft("");
    setIsVendorSaved(false);
  };

  const updateVendor = (
    id: string,
    updater: (vendor: VendorPartner) => VendorPartner,
  ) => {
    setVendors((current) =>
      current.map((vendor) =>
        vendor.id === id
          ? {
              ...updater(vendor),
              lastActivity: "Baru saja",
            }
          : vendor,
      ),
    );
  };

  const updateStatus = (id: string, status: VendorStatus) => {
    updateVendor(id, (vendor) => ({
      ...vendor,
      status,
    }));

    if (status === "Aktif") setActiveTab("Aktif");
    if (status === "Menunggu Review") setActiveTab("Review");
    if (status === "Perlu Evaluasi") setActiveTab("Evaluasi");
    if (status === "Nonaktif") setActiveTab("Nonaktif");
  };

  const saveVendorChanges = () => {
    if (!selectedVendor) return;

    updateVendor(selectedVendor.id, (vendor) => ({
      ...vendor,
      name: vendorNameDraft,
      serviceArea: serviceAreaDraft,
      adminNote: adminNoteDraft,
    }));

    setIsVendorSaved(true);
  };

  if (selectedVendor) {
    return (
      <VendorDetailPage
        vendor={selectedVendor}
        vendorNameDraft={vendorNameDraft}
        serviceAreaDraft={serviceAreaDraft}
        adminNoteDraft={adminNoteDraft}
        isVendorSaved={isVendorSaved}
        evaluationCount={evaluationCount}
        onBack={closeDetail}
        onChangeVendorName={(value) => {
          setVendorNameDraft(value);
          setIsVendorSaved(false);
        }}
        onChangeServiceArea={(value) => {
          setServiceAreaDraft(value);
          setIsVendorSaved(false);
        }}
        onChangeAdminNote={(value) => {
          setAdminNoteDraft(value);
          setIsVendorSaved(false);
        }}
        onSave={saveVendorChanges}
        onStatusChange={(status) => updateStatus(selectedVendor.id, status)}
        onChangePage={onChangePage}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Vendor Partner
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Daftar Vendor
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Kelola data vendor partner, area layanan, spesialisasi pekerjaan,
            proyek aktif, status kerja sama, dan catatan evaluasi admin.
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
              placeholder="Cari vendor, PIC, kota, area layanan, spesialisasi, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as VendorTab)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {vendorTabs.map((tab) => (
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
              {vendorTabs.map((tab) => {
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
        {filteredVendors.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onClick={() => openDetail(vendor)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Vendor tidak ditemukan.
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

function VendorDetailPage({
  vendor,
  vendorNameDraft,
  serviceAreaDraft,
  adminNoteDraft,
  isVendorSaved,
  evaluationCount,
  onBack,
  onChangeVendorName,
  onChangeServiceArea,
  onChangeAdminNote,
  onSave,
  onStatusChange,
  onChangePage,
}: {
  vendor: VendorPartner;
  vendorNameDraft: string;
  serviceAreaDraft: string;
  adminNoteDraft: string;
  isVendorSaved: boolean;
  evaluationCount: number;
  onBack: () => void;
  onChangeVendorName: (value: string) => void;
  onChangeServiceArea: (value: string) => void;
  onChangeAdminNote: (value: string) => void;
  onSave: () => void;
  onStatusChange: (status: VendorStatus) => void;
  onChangePage?: (page: AdminPageId) => void;
}) {
  const isVendorChanged =
    vendorNameDraft !== vendor.name ||
    serviceAreaDraft !== vendor.serviceArea ||
    adminNoteDraft !== vendor.adminNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar vendor
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Profil Vendor Partner
              </p>

              <VendorStatusBadge status={vendor.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {vendor.name}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              {vendor.vendorSummary}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Vendor
            </label>

            <div className="relative mt-3">
              <select
                value={vendor.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as VendorStatus)
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              icon={UserRound}
              label="PIC"
              value={vendor.ownerName}
              description="Penanggung jawab"
            />

            <InfoTile
              icon={Mail}
              label="Email"
              value={vendor.email}
              description="Kontak vendor"
            />

            <InfoTile
              icon={Phone}
              label="Telepon"
              value={vendor.phone}
              description="Nomor vendor"
            />

            <InfoTile
              icon={MapPin}
              label="Kota"
              value={vendor.city}
              description={vendor.serviceArea}
            />

            <InfoTile
              icon={CalendarDays}
              label="Bergabung"
              value={vendor.joinedAt}
              description={vendor.lastActivity}
            />

            <InfoTile
              icon={ShieldCheck}
              label="Status"
              value={vendor.status}
              description="Kerja sama vendor"
            />

            <InfoTile
              icon={Wallet}
              label="Proyek Aktif"
              value={`${vendor.activeProjects} proyek`}
              description="Sedang berjalan"
            />

            <InfoTile
              icon={ShieldCheck}
              label="Selesai"
              value={`${vendor.completedProjects} proyek`}
              description="Selesai dikerjakan"
            />
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-3">
            <AmountTile
              label="Selesai"
              value={`${vendor.completedProjects}`}
              description="Proyek selesai"
            />

            <AmountTile
              label="Aktif"
              value={`${vendor.activeProjects}`}
              description="Proyek berjalan"
              highlight
            />

            <AmountTile
              label="Evaluasi"
              value={`${evaluationCount}`}
              description="Vendor ditinjau"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Spesialisasi Vendor"
            description="Bidang pekerjaan yang paling sesuai untuk vendor ini."
          >
            <div className="flex flex-wrap gap-2">
              {vendor.specialty.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#E4D8CD] bg-[#FCFBF9] px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                >
                  {item}
                </span>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock
            title="Data Vendor"
            description="Informasi yang dapat diperbarui oleh admin."
            badge={isVendorSaved ? "Tersimpan" : undefined}
            withRightBorder={false}
          >
            <div className="grid gap-3">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                  Nama Vendor
                </span>

                <input
                  value={vendorNameDraft}
                  onChange={(event) => onChangeVendorName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                  Area Layanan
                </span>

                <input
                  value={serviceAreaDraft}
                  onChange={(event) => onChangeServiceArea(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>
          </DetailBlock>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Proyek Sedang Berjalan"
            description="Proyek yang sedang ditangani vendor."
          >
            <div className="grid gap-3">
              {vendor.currentProjects.length > 0 ? (
                vendor.currentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#31332C]">
                          {project.title}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#7B756E]">
                          {project.customerName} • {project.status}
                        </p>
                      </div>

                      <span className="shrink-0 text-[12px] font-semibold text-[#725F54]">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
                      <div
                        className="h-full rounded-full bg-[#725F54]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-4 text-center">
                  <p className="text-[12px] text-[#7B756E]">
                    Belum ada proyek aktif.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onChangePage?.("active-projects")}
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            >
              Lihat Proyek
              <ArrowRight size={13} />
            </button>
          </DetailBlock>

          <DetailBlock
            title="Catatan Evaluasi Admin"
            description="Catatan internal admin untuk evaluasi vendor."
            badge={isVendorSaved ? "Tersimpan" : undefined}
            withRightBorder={false}
          >
            <textarea
              value={adminNoteDraft}
              onChange={(event) => onChangeAdminNote(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-2xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onSave}
                disabled={!isVendorChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                  isVendorChanged
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
          onClick={() => onStatusChange("Aktif")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            vendor.status === "Aktif"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <ShieldCheck size={15} />
          Aktifkan
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Perlu Evaluasi")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            vendor.status === "Perlu Evaluasi"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <AlertTriangle size={15} />
          Evaluasi
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Nonaktif")}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${
            vendor.status === "Nonaktif"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <XCircle size={15} />
          Nonaktifkan
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

function VendorCard({
  vendor,
  onClick,
}: {
  vendor: VendorPartner;
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
            {vendor.name}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {vendor.city} • {vendor.serviceArea}
          </p>
        </div>

        <VendorStatusBadge status={vendor.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {vendor.vendorSummary}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">Selesai</p>

          <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
            {vendor.completedProjects} proyek
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          {vendor.activeProjects} proyek aktif
          <br />
          {vendor.status}
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
  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 transition ${
        highlight ? "border-[#D9C8BA] bg-white" : "border-[#E8E2D9] bg-white"
      } hover:border-[#725F54] hover:bg-[#FCFBF9]`}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>

      <p className="mt-2 truncate font-serif text-[24px] leading-none text-[#31332C]">
        {value}
      </p>

      <p className="mt-2 truncate text-[11px] text-[#7B756E]">
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

function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const style =
    status === "Aktif"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Menunggu Review"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : status === "Perlu Evaluasi"
          ? "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]"
          : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
