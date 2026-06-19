"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type RequestStatus =
  | "Baru Masuk"
  | "Menunggu Review"
  | "Butuh Konsultasi"
  | "Disetujui"
  | "Ditolak"
  | "Menunggu Vendor"
  | "Menjadi Proyek Aktif";

type RequestTab = "Semua" | "Baru" | "Review" | "Konsultasi" | "Disetujui";

type ProjectRequest = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectTitle: string;
  projectType: string;
  location: string;
  budget: string;
  style: string;
  roomSize: string;
  targetTime: string;
  submittedAt: string;
  status: RequestStatus;
  description: string;
  referenceNote: string;
  adminNote: string;
};

const requestTabs: RequestTab[] = [
  "Semua",
  "Baru",
  "Review",
  "Konsultasi",
  "Disetujui",
];

const initialRequests: ProjectRequest[] = [
  {
    id: "req-1",
    customerName: "Alya Putri",
    customerEmail: "alya@email.com",
    customerPhone: "0812-3456-7890",
    projectTitle: "Kitchen Set Minimalis",
    projectType: "Kitchen Set",
    location: "Semarang",
    budget: "Rp18.000.000 - Rp25.000.000",
    style: "Minimalis Modern",
    roomSize: "2.5m x 2m",
    targetTime: "Bulan depan",
    submittedAt: "Hari ini, 09.20",
    status: "Baru Masuk",
    description:
      "Customer ingin membuat kitchen set minimalis dengan kabinet bawah dan atas. Area dapur kecil, jadi membutuhkan desain yang efisien dan mudah dibersihkan.",
    referenceNote:
      "Referensi warna putih tulang, kombinasi kayu muda, dan handle minimalis.",
    adminNote: "",
  },
  {
    id: "req-2",
    customerName: "Bima Santoso",
    customerEmail: "bima@email.com",
    customerPhone: "0821-2222-8899",
    projectTitle: "Wardrobe Kamar Utama",
    projectType: "Wardrobe",
    location: "Yogyakarta",
    budget: "Rp12.000.000 - Rp18.000.000",
    style: "Japandi",
    roomSize: "3m x 3m",
    targetTime: "Dalam 1 bulan",
    submittedAt: "Kemarin",
    status: "Menunggu Review",
    description:
      "Customer membutuhkan wardrobe built-in untuk kamar utama dengan ruang gantung, rak lipat, dan area penyimpanan tambahan.",
    referenceNote:
      "Model wardrobe full plafon dengan warna natural, pintu sliding, dan soft close.",
    adminNote: "Perlu cek ukuran detail sebelum dibuatkan brief awal.",
  },
  {
    id: "req-3",
    customerName: "Nadia Rahma",
    customerEmail: "nadia@email.com",
    customerPhone: "0857-1000-4421",
    projectTitle: "Ruang Kerja Rumah",
    projectType: "Ruang Kerja",
    location: "Solo",
    budget: "Rp8.000.000 - Rp12.000.000",
    style: "Scandinavian",
    roomSize: "2m x 3m",
    targetTime: "Secepatnya",
    submittedAt: "2 hari lalu",
    status: "Butuh Konsultasi",
    description:
      "Customer ingin membuat meja kerja custom, rak buku, dan storage kecil untuk ruang kerja di rumah.",
    referenceNote:
      "Ingin tampilan sederhana, terang, dan tidak terlalu banyak dekorasi.",
    adminNote: "Disarankan konsultasi untuk memastikan kebutuhan storage.",
  },
  {
    id: "req-4",
    customerName: "Raka Pratama",
    customerEmail: "raka@email.com",
    customerPhone: "0813-7788-9922",
    projectTitle: "Backdrop TV Ruang Keluarga",
    projectType: "Backdrop TV",
    location: "Semarang",
    budget: "Rp10.000.000 - Rp15.000.000",
    style: "Modern Warm",
    roomSize: "3.5m x 3m",
    targetTime: "Fleksibel",
    submittedAt: "3 hari lalu",
    status: "Disetujui",
    description:
      "Customer ingin membuat backdrop TV dengan kabinet bawah, panel dinding, dan tempat display sederhana.",
    referenceNote:
      "Warna coklat muda, aksen hitam tipis, dan desain tidak terlalu ramai.",
    adminNote: "Request sudah layak dibuatkan brief awal.",
  },
];

export function RequestProjectView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [requests, setRequests] =
    useState<ProjectRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<RequestTab>("Semua");
  const [selectedRequestId, setSelectedRequestId] = useState(
    initialRequests[0]?.id ?? "",
  );

  const selectedRequest = useMemo(() => {
    return (
      requests.find((request) => request.id === selectedRequestId) ??
      requests[0]
    );
  }, [requests, selectedRequestId]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (activeTab === "Semua") return true;
      if (activeTab === "Baru") return request.status === "Baru Masuk";
      if (activeTab === "Review") return request.status === "Menunggu Review";
      if (activeTab === "Konsultasi") {
        return request.status === "Butuh Konsultasi";
      }

      return (
        request.status === "Disetujui" ||
        request.status === "Menunggu Vendor" ||
        request.status === "Menjadi Proyek Aktif"
      );
    });
  }, [activeTab, requests]);

  const newCount = requests.filter(
    (request) => request.status === "Baru Masuk",
  ).length;

  const consultationCount = requests.filter(
    (request) => request.status === "Butuh Konsultasi",
  ).length;

  const approvedCount = requests.filter(
    (request) =>
      request.status === "Disetujui" ||
      request.status === "Menunggu Vendor" ||
      request.status === "Menjadi Proyek Aktif",
  ).length;

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const updateSelectedRequest = (
    field: keyof ProjectRequest,
    value: string | RequestStatus,
  ) => {
    if (!selectedRequest) return;

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              [field]: value,
            }
          : request,
      ),
    );
  };

  const setSelectedStatus = (status: RequestStatus) => {
    updateSelectedRequest("status", status);
  };

  if (!selectedRequest) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Manajemen Proyek
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Request Proyek
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Tinjau pengajuan proyek customer, cek kebutuhan awal, tambahkan
            catatan admin, lalu lanjutkan ke konsultasi, brief, atau proyek
            aktif.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedStatus("Baru Masuk")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <ClipboardList size={16} />
          Request Baru
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <RequestMiniStat
          icon={ClipboardList}
          label="Total Request"
          value={`${requests.length}`}
          description="Semua pengajuan customer"
        />

        <RequestMiniStat
          icon={MessageCircle}
          label="Baru Masuk"
          value={`${newCount}`}
          description="Perlu dicek admin"
        />

        <RequestMiniStat
          icon={CalendarDays}
          label="Butuh Konsultasi"
          value={`${consultationCount}`}
          description="Perlu dijadwalkan"
        />

        <RequestMiniStat
          icon={CheckCircle2}
          label="Siap Diproses"
          value={`${approvedCount}`}
          description="Disetujui atau lanjut proyek"
        />
      </section>

      <AdminSectionCard title="Daftar Request">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {requestTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-11 items-center justify-center rounded-xl px-2 text-[11px] font-semibold transition sm:text-[13px] ${
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
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                selected={selectedRequest.id === request.id}
                onClick={() => handleSelectRequest(request.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada request pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Request customer akan muncul sesuai statusnya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Request"
          action={<RequestStatusBadge status={selectedRequest.status} />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Pengajuan Customer
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedRequest.projectTitle}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                {selectedRequest.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile
                icon={UserRound}
                label="Customer"
                value={selectedRequest.customerName}
                description={selectedRequest.customerEmail}
              />

              <InfoTile
                icon={MapPin}
                label="Lokasi"
                value={selectedRequest.location}
                description={selectedRequest.roomSize}
              />

              <InfoTile
                icon={Wallet}
                label="Budget"
                value={selectedRequest.budget}
                description={selectedRequest.projectType}
              />

              <InfoTile
                icon={FileText}
                label="Gaya Desain"
                value={selectedRequest.style}
                description="Preferensi customer"
              />

              <InfoTile
                icon={CalendarDays}
                label="Target"
                value={selectedRequest.targetTime}
                description={selectedRequest.submittedAt}
              />

              <InfoTile
                icon={Phone}
                label="Kontak"
                value={selectedRequest.customerPhone}
                description="Nomor WhatsApp"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Referensi
                </p>

                <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
                  {selectedRequest.referenceNote}
                </p>
              </div>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedRequest.adminNote}
                  onChange={(event) =>
                    updateSelectedRequest("adminNote", event.target.value)
                  }
                  placeholder="Tambahkan catatan internal untuk tim VMatch."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Admin">
            <div className="space-y-3">
              <ActionButton
                icon={MessageCircle}
                title="Jadwalkan Konsultasi"
                description="Ubah status menjadi butuh konsultasi."
                onClick={() => setSelectedStatus("Butuh Konsultasi")}
              />

              <ActionButton
                icon={FileText}
                title="Buat Brief Awal"
                description="Tandai request siap dibuatkan brief."
                onClick={() => setSelectedStatus("Disetujui")}
              />

              <ActionButton
                icon={CheckCircle2}
                title="Jadikan Proyek Aktif"
                description="Request siap masuk proses proyek."
                onClick={() => setSelectedStatus("Menjadi Proyek Aktif")}
              />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Ubah Status">
            <div className="grid gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`flex h-10 items-center justify-between rounded-xl border px-3 text-left text-[12px] font-semibold transition ${
                    selectedRequest.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedRequest.status === status && (
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
                onClick={() => onChangePage?.("consultations")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                Ke Menu Konsultasi
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onChangePage?.("active-projects")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Ke Proyek Aktif
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: RequestStatus[] = [
  "Baru Masuk",
  "Menunggu Review",
  "Butuh Konsultasi",
  "Disetujui",
  "Ditolak",
  "Menunggu Vendor",
  "Menjadi Proyek Aktif",
];

function RequestCard({
  request,
  selected,
  onClick,
}: {
  request: ProjectRequest;
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
            {request.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {request.customerName} • {request.location}
          </p>
        </div>

        <RequestStatusBadge status={request.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {request.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#9A8F86]">
        <CalendarDays size={13} />
        <span className="truncate">{request.submittedAt}</span>
      </div>
    </button>
  );
}

function RequestMiniStat({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof ClipboardList;
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

function InfoTile({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof UserRound;
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
  icon: typeof MessageCircle;
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

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const style =
    status === "Baru Masuk"
      ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
      : status === "Menunggu Review" || status === "Butuh Konsultasi"
        ? "border-[#D9C8BA] bg-[#FCFBF9] text-[#725F54]"
        : status === "Disetujui" ||
            status === "Menunggu Vendor" ||
            status === "Menjadi Proyek Aktif"
          ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
          : "border-[#E8E2D9] bg-white text-[#9A8F86]";

  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}