"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type CustomerStatus = "Aktif" | "Baru" | "Perlu Follow Up" | "Nonaktif";

type CustomerTab = "Semua" | "Aktif" | "Baru" | "Follow Up" | "Nonaktif";

type CustomerProject = {
  id: string;
  title: string;
  status: string;
  progress: number;
  value: string;
};

type CustomerItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  source: string;
  joinedAt: string;
  lastContact: string;
  status: CustomerStatus;
  totalRequests: number;
  activeProjects: number;
  completedProjects: number;
  totalValue: string;
  preferredStyle: string;
  budgetRange: string;
  latestNeed: string;
  adminNote: string;
  projects: CustomerProject[];
};

const customerTabs: CustomerTab[] = [
  "Semua",
  "Aktif",
  "Baru",
  "Follow Up",
  "Nonaktif",
];

const initialCustomers: CustomerItem[] = [
  {
    id: "customer-1",
    name: "Alya Putri",
    email: "alya@email.com",
    phone: "0812-3456-7890",
    city: "Semarang",
    source: "Landing Page",
    joinedAt: "28 Juni 2026",
    lastContact: "Hari ini",
    status: "Aktif",
    totalRequests: 2,
    activeProjects: 1,
    completedProjects: 0,
    totalValue: "Rp23.500.000",
    preferredStyle: "Minimalis Modern",
    budgetRange: "Rp18.000.000 - Rp25.000.000",
    latestNeed:
      "Customer ingin kitchen set minimalis untuk dapur kecil dengan penyimpanan yang efisien.",
    adminNote:
      "Customer responsif dan sudah punya referensi desain. Perlu dipandu pada pilihan material dan finishing.",
    projects: [
      {
        id: "project-1",
        title: "Kitchen Set Minimalis",
        status: "Produksi kabinet",
        progress: 45,
        value: "Rp23.500.000",
      },
    ],
  },
  {
    id: "customer-2",
    name: "Bima Santoso",
    email: "bima@email.com",
    phone: "0821-2222-8899",
    city: "Yogyakarta",
    source: "Referral",
    joinedAt: "30 Juni 2026",
    lastContact: "Kemarin",
    status: "Perlu Follow Up",
    totalRequests: 1,
    activeProjects: 1,
    completedProjects: 0,
    totalValue: "Rp16.000.000",
    preferredStyle: "Japandi",
    budgetRange: "Rp12.000.000 - Rp18.000.000",
    latestNeed:
      "Customer membutuhkan wardrobe built-in full plafon dengan pintu sliding dan area gantung tambahan.",
    adminNote:
      "Perlu follow up terkait revisi layout bagian dalam wardrobe dan konfirmasi pilihan rel sliding.",
    projects: [
      {
        id: "project-1",
        title: "Wardrobe Kamar Utama",
        status: "Revisi layout",
        progress: 35,
        value: "Rp16.000.000",
      },
    ],
  },
  {
    id: "customer-3",
    name: "Nadia Rahma",
    email: "nadia@email.com",
    phone: "0857-1000-4421",
    city: "Solo",
    source: "Instagram",
    joinedAt: "1 Juli 2026",
    lastContact: "Hari ini",
    status: "Aktif",
    totalRequests: 1,
    activeProjects: 1,
    completedProjects: 0,
    totalValue: "Rp10.500.000",
    preferredStyle: "Scandinavian",
    budgetRange: "Rp8.000.000 - Rp12.000.000",
    latestNeed:
      "Customer ingin ruang kerja sederhana, terang, dan tidak terlalu penuh.",
    adminNote:
      "Kebutuhan sudah cukup jelas. Cocok diarahkan ke vendor spesialis furniture ruang kerja.",
    projects: [
      {
        id: "project-1",
        title: "Ruang Kerja Rumah",
        status: "QC finishing",
        progress: 82,
        value: "Rp10.500.000",
      },
    ],
  },
  {
    id: "customer-4",
    name: "Raka Pratama",
    email: "raka@email.com",
    phone: "0813-7788-9922",
    city: "Semarang",
    source: "Landing Page",
    joinedAt: "15 Juni 2026",
    lastContact: "3 hari lalu",
    status: "Aktif",
    totalRequests: 1,
    activeProjects: 0,
    completedProjects: 1,
    totalValue: "Rp13.800.000",
    preferredStyle: "Modern Warm",
    budgetRange: "Rp10.000.000 - Rp15.000.000",
    latestNeed:
      "Customer ingin backdrop TV dengan kabinet bawah, panel dinding, dan warna coklat muda.",
    adminNote:
      "Proyek sudah selesai. Customer potensial untuk follow up layanan tambahan ruang keluarga.",
    projects: [
      {
        id: "project-1",
        title: "Backdrop TV Ruang Keluarga",
        status: "Selesai",
        progress: 100,
        value: "Rp13.800.000",
      },
    ],
  },
  {
    id: "customer-5",
    name: "Customer Baru",
    email: "customerbaru@email.com",
    phone: "08xx-xxxx-xxxx",
    city: "Semarang",
    source: "Katalog Desain",
    joinedAt: "Hari ini",
    lastContact: "Hari ini",
    status: "Baru",
    totalRequests: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalValue: "Rp0",
    preferredStyle: "Belum ditentukan",
    budgetRange: "Belum ditentukan",
    latestNeed:
      "Customer baru melihat inspirasi desain dan belum mengajukan proyek.",
    adminNote:
      "Perlu follow up ringan untuk mengetahui kebutuhan awal customer.",
    projects: [],
  },
];

export function CustomerView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [customers, setCustomers] = useState<CustomerItem[]>(initialCustomers);
  const [activeTab, setActiveTab] = useState<CustomerTab>("Semua");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomers[0]?.id ?? "",
  );

  const selectedCustomer = useMemo(() => {
    return (
      customers.find((customer) => customer.id === selectedCustomerId) ??
      customers[0]
    );
  }, [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Aktif") return customer.status === "Aktif";
      if (activeTab === "Baru") return customer.status === "Baru";
      if (activeTab === "Follow Up") {
        return customer.status === "Perlu Follow Up";
      }

      return customer.status === "Nonaktif";
    });
  }, [activeTab, customers]);

  const activeCount = customers.filter(
    (customer) => customer.status === "Aktif",
  ).length;

  const newCount = customers.filter(
    (customer) => customer.status === "Baru",
  ).length;

  const totalActiveProjects = customers.reduce(
    (total, customer) => total + customer.activeProjects,
    0,
  );

  const updateSelectedCustomer = (
    field: keyof CustomerItem,
    value: string | number | CustomerStatus,
  ) => {
    if (!selectedCustomer) return;

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              [field]: value,
              lastContact: "Baru saja",
            }
          : customer,
      ),
    );
  };

  const updateStatus = (status: CustomerStatus) => {
    updateSelectedCustomer("status", status);

    if (status === "Aktif") setActiveTab("Aktif");
    if (status === "Baru") setActiveTab("Baru");
    if (status === "Perlu Follow Up") setActiveTab("Follow Up");
    if (status === "Nonaktif") setActiveTab("Nonaktif");
  };

  const addMockCustomer = () => {
    const newCustomer: CustomerItem = {
      id: `customer-${Date.now()}`,
      name: "Customer Baru",
      email: "customer@email.com",
      phone: "08xx-xxxx-xxxx",
      city: "Kota customer",
      source: "Landing Page",
      joinedAt: "Hari ini",
      lastContact: "Baru saja",
      status: "Baru",
      totalRequests: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalValue: "Rp0",
      preferredStyle: "Belum ditentukan",
      budgetRange: "Belum ditentukan",
      latestNeed: "Tuliskan kebutuhan awal customer.",
      adminNote: "Tambahkan catatan admin untuk customer ini.",
      projects: [],
    };

    setCustomers((current) => [newCustomer, ...current]);
    setSelectedCustomerId(newCustomer.id);
    setActiveTab("Baru");
  };

  if (!selectedCustomer) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Relasi Pengguna
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Customer
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola data customer, riwayat request, proyek berjalan, preferensi
            desain, budget, serta catatan follow up dari admin VMatch.
          </p>
        </div>

        <button
          type="button"
          onClick={addMockCustomer}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Plus size={16} />
          Tambah Customer
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <CustomerMiniStat
          icon={Users}
          label="Total Customer"
          value={`${customers.length}`}
          description="Customer terdaftar"
        />

        <CustomerMiniStat
          icon={CheckCircle2}
          label="Aktif"
          value={`${activeCount}`}
          description="Customer aktif"
        />

        <CustomerMiniStat
          icon={UserRound}
          label="Customer Baru"
          value={`${newCount}`}
          description="Perlu dikenali"
        />

        <CustomerMiniStat
          icon={ClipboardList}
          label="Proyek Aktif"
          value={`${totalActiveProjects}`}
          description="Proyek berjalan"
        />
      </section>

      <AdminSectionCard title="Daftar Customer">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {customerTabs.map((tab) => {
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
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                selected={selectedCustomer.id === customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada customer pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Data customer akan muncul sesuai statusnya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Customer"
          action={<CustomerStatusBadge status={selectedCustomer.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Profil Customer
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedCustomer.name}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                Customer dari {selectedCustomer.city}, masuk melalui{" "}
                <span className="font-semibold text-[#725F54]">
                  {selectedCustomer.source}
                </span>
                .
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AmountTile
                label="Request"
                value={`${selectedCustomer.totalRequests}`}
                description="Pengajuan proyek"
              />

              <AmountTile
                label="Proyek Aktif"
                value={`${selectedCustomer.activeProjects}`}
                description="Sedang berjalan"
                highlight
              />

              <AmountTile
                label="Selesai"
                value={`${selectedCustomer.completedProjects}`}
                description="Proyek selesai"
              />

              <AmountTile
                label="Nilai Proyek"
                value={selectedCustomer.totalValue}
                description="Total estimasi"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoTile
                icon={Mail}
                label="Email"
                value={selectedCustomer.email}
                description="Kontak customer"
              />

              <InfoTile
                icon={Phone}
                label="Telepon"
                value={selectedCustomer.phone}
                description="Nomor customer"
              />

              <InfoTile
                icon={MapPin}
                label="Kota"
                value={selectedCustomer.city}
                description={selectedCustomer.source}
              />

              <InfoTile
                icon={CalendarDays}
                label="Bergabung"
                value={selectedCustomer.joinedAt}
                description={selectedCustomer.lastContact}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Preferensi Customer
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                      Gaya Desain
                    </p>

                    <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                      {selectedCustomer.preferredStyle}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E8E2D9] bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                      Budget
                    </p>

                    <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
                      {selectedCustomer.budgetRange}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
                  {selectedCustomer.latestNeed}
                </p>
              </div>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedCustomer.adminNote}
                  onChange={(event) =>
                    updateSelectedCustomer("adminNote", event.target.value)
                  }
                  rows={6}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                    Riwayat Proyek
                  </p>

                  <p className="mt-1 text-[12px] text-[#7B756E]">
                    Proyek yang pernah atau sedang dikelola VMatch.
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
                {selectedCustomer.projects.length > 0 ? (
                  selectedCustomer.projects.map((project) => (
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
                            {project.status} • {project.value}
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
                      Belum ada proyek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Customer">
            <div className="space-y-3">
              <ActionButton
                icon={MessageCircle}
                title="Jadwalkan Konsultasi"
                description="Arahkan customer ke menu konsultasi."
                onClick={() => onChangePage?.("consultations")}
              />

              <ActionButton
                icon={ClipboardList}
                title="Lihat Request"
                description="Cek pengajuan proyek customer."
                onClick={() => onChangePage?.("requests")}
              />

              <ActionButton
                icon={Wallet}
                title="Lihat Pembayaran"
                description="Cek invoice dan pembayaran customer."
                onClick={() => onChangePage?.("payments")}
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
                    selectedCustomer.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedCustomer.status === status && (
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
                onClick={() => onChangePage?.("requests")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Request Proyek
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("consultations")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Ke Konsultasi
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: CustomerStatus[] = [
  "Aktif",
  "Baru",
  "Perlu Follow Up",
  "Nonaktif",
];

function CustomerCard({
  customer,
  selected,
  onClick,
}: {
  customer: CustomerItem;
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
            {customer.name}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {customer.city} • {customer.source}
          </p>
        </div>

        <CustomerStatusBadge status={customer.status} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">
            Nilai Proyek
          </p>

          <p className="mt-1 text-[14px] font-semibold text-[#31332C]">
            {customer.totalValue}
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          {customer.totalRequests} request
          <br />
          {customer.activeProjects} proyek aktif
        </p>
      </div>
    </button>
  );
}

function CustomerMiniStat({
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

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const style =
    status === "Aktif"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Baru"
        ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
        : status === "Perlu Follow Up"
          ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
          : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}