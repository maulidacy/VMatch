"use client";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Hammer,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
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
  rating: string;
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
    rating: "4.8",
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
    rating: "4.6",
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
    rating: "4.9",
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
    rating: "Belum ada",
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
  const [selectedVendorId, setSelectedVendorId] = useState(
    initialVendors[0]?.id ?? "",
  );

  const selectedVendor = useMemo(() => {
    return vendors.find((vendor) => vendor.id === selectedVendorId) ?? vendors[0];
  }, [vendors, selectedVendorId]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Aktif") return vendor.status === "Aktif";
      if (activeTab === "Review") return vendor.status === "Menunggu Review";
      if (activeTab === "Evaluasi") return vendor.status === "Perlu Evaluasi";
      return vendor.status === "Nonaktif";
    });
  }, [activeTab, vendors]);

  const activeCount = vendors.filter((vendor) => vendor.status === "Aktif").length;
  const reviewCount = vendors.filter(
    (vendor) => vendor.status === "Menunggu Review",
  ).length;
  const evaluationCount = vendors.filter(
    (vendor) => vendor.status === "Perlu Evaluasi",
  ).length;
  const totalActiveProjects = vendors.reduce(
    (total, vendor) => total + vendor.activeProjects,
    0,
  );

  const updateSelectedVendor = (
    field: keyof VendorPartner,
    value: string | number | VendorStatus,
  ) => {
    if (!selectedVendor) return;

    setVendors((current) =>
      current.map((vendor) =>
        vendor.id === selectedVendor.id
          ? {
              ...vendor,
              [field]: value,
              lastActivity: "Baru saja",
            }
          : vendor,
      ),
    );
  };

  const updateStatus = (status: VendorStatus) => {
    updateSelectedVendor("status", status);

    if (status === "Aktif") setActiveTab("Aktif");
    if (status === "Menunggu Review") setActiveTab("Review");
    if (status === "Perlu Evaluasi") setActiveTab("Evaluasi");
    if (status === "Nonaktif") setActiveTab("Nonaktif");
  };

  if (!selectedVendor) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Relasi Pengguna
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Vendor Partner
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola data vendor partner, status kerja sama, area layanan,
            spesialisasi, performa proyek, dan catatan evaluasi admin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangePage?.("active-projects")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          Lihat Proyek Aktif
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <VendorMiniStat
          icon={Users}
          label="Total Vendor"
          value={`${vendors.length}`}
          description="Vendor partner terdaftar"
        />

        <VendorMiniStat
          icon={ShieldCheck}
          label="Vendor Aktif"
          value={`${activeCount}`}
          description="Siap menerima proyek"
        />

        <VendorMiniStat
          icon={ClipboardCheck}
          label="Menunggu Review"
          value={`${reviewCount}`}
          description="Perlu dicek admin"
        />

        <VendorMiniStat
          icon={Hammer}
          label="Proyek Aktif"
          value={`${totalActiveProjects}`}
          description="Sedang dikerjakan vendor"
        />
      </section>

      <AdminSectionCard title="Daftar Vendor">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {vendorTabs.map((tab) => {
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
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                selected={selectedVendor.id === vendor.id}
                onClick={() => setSelectedVendorId(vendor.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada vendor pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Vendor partner akan muncul sesuai status kerja samanya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Vendor"
          action={<VendorStatusBadge status={selectedVendor.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Profil Vendor Partner
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedVendor.name}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                {selectedVendor.vendorSummary}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AmountTile
                label="Rating"
                value={selectedVendor.rating}
                description="Nilai performa"
              />

              <AmountTile
                label="Selesai"
                value={`${selectedVendor.completedProjects}`}
                description="Proyek selesai"
              />

              <AmountTile
                label="Aktif"
                value={`${selectedVendor.activeProjects}`}
                description="Proyek berjalan"
                highlight
              />

              <AmountTile
                label="Evaluasi"
                value={`${evaluationCount}`}
                description="Perlu ditinjau"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoTile
                icon={UserRound}
                label="PIC"
                value={selectedVendor.ownerName}
                description={selectedVendor.email}
              />

              <InfoTile
                icon={Phone}
                label="Kontak"
                value={selectedVendor.phone}
                description="Nomor vendor"
              />

              <InfoTile
                icon={MapPin}
                label="Kota"
                value={selectedVendor.city}
                description={selectedVendor.serviceArea}
              />

              <InfoTile
                icon={CalendarDays}
                label="Bergabung"
                value={selectedVendor.joinedAt}
                description={selectedVendor.lastActivity}
              />
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Spesialisasi Vendor
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedVendor.specialty.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#E4D8CD] bg-white px-3 py-1.5 text-[12px] font-medium text-[#725F54]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Nama Vendor
                </span>

                <input
                  value={selectedVendor.name}
                  onChange={(event) =>
                    updateSelectedVendor("name", event.target.value)
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Area Layanan
                </span>

                <input
                  value={selectedVendor.serviceArea}
                  onChange={(event) =>
                    updateSelectedVendor("serviceArea", event.target.value)
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                    Proyek Sedang Berjalan
                  </p>

                  <p className="mt-1 text-[12px] text-[#7B756E]">
                    Proyek yang sedang ditangani oleh vendor ini.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onChangePage?.("active-projects")}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-3 text-[11px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                  Lihat Proyek
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {selectedVendor.currentProjects.length > 0 ? (
                  selectedVendor.currentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl border border-[#E8E2D9] bg-white p-3"
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
                  <div className="rounded-xl border border-dashed border-[#E8E2D9] bg-white p-4 text-center">
                    <p className="text-[12px] text-[#7B756E]">
                      Belum ada proyek aktif.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Catatan Evaluasi Admin
              </span>

              <textarea
                value={selectedVendor.adminNote}
                onChange={(event) =>
                  updateSelectedVendor("adminNote", event.target.value)
                }
                rows={4}
                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Vendor">
            <div className="space-y-3">
              <ActionButton
                icon={ShieldCheck}
                title="Aktifkan Vendor"
                description="Vendor bisa menerima proyek baru."
                onClick={() => updateStatus("Aktif")}
              />

              <ActionButton
                icon={AlertTriangle}
                title="Tandai Perlu Evaluasi"
                description="Vendor perlu ditinjau performanya."
                onClick={() => updateStatus("Perlu Evaluasi")}
              />

              <ActionButton
                icon={XCircle}
                title="Nonaktifkan"
                description="Vendor tidak menerima proyek sementara."
                onClick={() => updateStatus("Nonaktif")}
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
                    selectedVendor.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedVendor.status === status && (
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
                onClick={() => onChangePage?.("active-projects")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Proyek Aktif
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("progress-qc")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Ke Progress & QC
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: VendorStatus[] = [
  "Aktif",
  "Menunggu Review",
  "Perlu Evaluasi",
  "Nonaktif",
];

function VendorCard({
  vendor,
  selected,
  onClick,
}: {
  vendor: VendorPartner;
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
            {vendor.name}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {vendor.city} • {vendor.serviceArea}
          </p>
        </div>

        <VendorStatusBadge status={vendor.status} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">Rating</p>

          <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
            {vendor.rating}
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          {vendor.completedProjects} proyek selesai
          <br />
          {vendor.activeProjects} aktif
        </p>
      </div>
    </button>
  );
}

function VendorMiniStat({
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

      <p className="mt-2 flex items-center gap-1 font-serif text-[25px] leading-none text-[#31332C]">
        {label === "Rating" && value !== "Belum ada" && (
          <Star size={18} className="text-[#725F54]" />
        )}
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
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}