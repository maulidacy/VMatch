"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Link2,
  MessageCircle,
  Phone,
  Plus,
  RefreshCcw,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminSectionCard } from "./shared";
import type { AdminPageId } from "../types";

type ConsultationStatus =
  | "Menunggu Konfirmasi"
  | "Terkonfirmasi"
  | "Dijadwalkan Ulang"
  | "Selesai"
  | "Dibatalkan";

type ConsultationTab =
  | "Semua"
  | "Menunggu"
  | "Terkonfirmasi"
  | "Selesai"
  | "Dibatalkan";

type ConsultationItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectTitle: string;
  projectType: string;
  consultationDate: string;
  consultationTime: string;
  method: "Google Meet" | "WhatsApp Call" | "Offline";
  meetingLink: string;
  status: ConsultationStatus;
  requestSource: string;
  adminNote: string;
  customerNeed: string;
  resultNote: string;
};

const consultationTabs: ConsultationTab[] = [
  "Semua",
  "Menunggu",
  "Terkonfirmasi",
  "Selesai",
  "Dibatalkan",
];

const initialConsultations: ConsultationItem[] = [
  {
    id: "consult-1",
    customerName: "Alya Putri",
    customerEmail: "alya@email.com",
    customerPhone: "0812-3456-7890",
    projectTitle: "Kitchen Set Minimalis",
    projectType: "Kitchen Set",
    consultationDate: "12 Juli 2026",
    consultationTime: "10.00 WIB",
    method: "Google Meet",
    meetingLink: "https://meet.google.com/vmatch-kitchen",
    status: "Menunggu Konfirmasi",
    requestSource: "Request Proyek",
    adminNote:
      "Perlu konfirmasi ukuran dapur, kebutuhan kabinet atas, dan preferensi finishing.",
    customerNeed:
      "Customer ingin kitchen set minimalis untuk dapur kecil dengan penyimpanan yang efisien.",
    resultNote: "Belum ada hasil konsultasi.",
  },
  {
    id: "consult-2",
    customerName: "Bima Santoso",
    customerEmail: "bima@email.com",
    customerPhone: "0821-2222-8899",
    projectTitle: "Wardrobe Kamar Utama",
    projectType: "Wardrobe",
    consultationDate: "13 Juli 2026",
    consultationTime: "14.00 WIB",
    method: "Google Meet",
    meetingLink: "https://meet.google.com/vmatch-wardrobe",
    status: "Terkonfirmasi",
    requestSource: "Request Proyek",
    adminNote:
      "Bahas kebutuhan area gantung, rak lipat, pintu sliding, dan estimasi budget.",
    customerNeed:
      "Customer membutuhkan wardrobe built-in full plafon dengan area gantung dan rak tambahan.",
    resultNote: "Konsultasi sudah dikonfirmasi dan menunggu jadwal meeting.",
  },
  {
    id: "consult-3",
    customerName: "Nadia Rahma",
    customerEmail: "nadia@email.com",
    customerPhone: "0857-1000-4421",
    projectTitle: "Ruang Kerja Rumah",
    projectType: "Ruang Kerja",
    consultationDate: "10 Juli 2026",
    consultationTime: "09.30 WIB",
    method: "WhatsApp Call",
    meetingLink: "wa.me/6285710004421",
    status: "Selesai",
    requestSource: "Request Proyek",
    adminNote:
      "Customer ingin ruang kerja sederhana, terang, dan tidak terlalu penuh.",
    customerNeed:
      "Customer membutuhkan meja kerja custom, rak buku, dan storage kecil.",
    resultNote:
      "Kebutuhan sudah jelas. Brief awal dapat disusun dan diteruskan ke vendor.",
  },
  {
    id: "consult-4",
    customerName: "Raka Pratama",
    customerEmail: "raka@email.com",
    customerPhone: "0813-7788-9922",
    projectTitle: "Backdrop TV Ruang Keluarga",
    projectType: "Backdrop TV",
    consultationDate: "8 Juli 2026",
    consultationTime: "15.30 WIB",
    method: "Google Meet",
    meetingLink: "https://meet.google.com/vmatch-backdrop",
    status: "Dijadwalkan Ulang",
    requestSource: "Request Proyek",
    adminNote:
      "Customer meminta jadwal ulang karena berhalangan pada jadwal sebelumnya.",
    customerNeed:
      "Customer ingin backdrop TV dengan kabinet bawah, panel dinding, dan desain modern warm.",
    resultNote: "Menunggu jadwal ulang dari customer.",
  },
];

export function ConsultationView({
  onChangePage,
}: {
  onChangePage?: (page: AdminPageId) => void;
}) {
  const [consultations, setConsultations] =
    useState<ConsultationItem[]>(initialConsultations);
  const [activeTab, setActiveTab] = useState<ConsultationTab>("Semua");
  const [selectedConsultationId, setSelectedConsultationId] = useState(
    initialConsultations[0]?.id ?? "",
  );

  const selectedConsultation = useMemo(() => {
    return (
      consultations.find((item) => item.id === selectedConsultationId) ??
      consultations[0]
    );
  }, [consultations, selectedConsultationId]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (activeTab === "Semua") return true;

      if (activeTab === "Menunggu") {
        return item.status === "Menunggu Konfirmasi";
      }

      if (activeTab === "Terkonfirmasi") {
        return (
          item.status === "Terkonfirmasi" ||
          item.status === "Dijadwalkan Ulang"
        );
      }

      if (activeTab === "Selesai") {
        return item.status === "Selesai";
      }

      return item.status === "Dibatalkan";
    });
  }, [activeTab, consultations]);

  const waitingCount = consultations.filter(
    (item) => item.status === "Menunggu Konfirmasi",
  ).length;

  const confirmedCount = consultations.filter(
    (item) =>
      item.status === "Terkonfirmasi" ||
      item.status === "Dijadwalkan Ulang",
  ).length;

  const finishedCount = consultations.filter(
    (item) => item.status === "Selesai",
  ).length;

  const updateSelectedConsultation = (
    field: keyof ConsultationItem,
    value: string | ConsultationStatus,
  ) => {
    if (!selectedConsultation) return;

    setConsultations((current) =>
      current.map((item) =>
        item.id === selectedConsultation.id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const updateStatus = (status: ConsultationStatus) => {
    updateSelectedConsultation("status", status);

    if (status === "Menunggu Konfirmasi") setActiveTab("Menunggu");
    if (status === "Terkonfirmasi" || status === "Dijadwalkan Ulang") {
      setActiveTab("Terkonfirmasi");
    }
    if (status === "Selesai") setActiveTab("Selesai");
    if (status === "Dibatalkan") setActiveTab("Dibatalkan");
  };

  const addMockConsultation = () => {
    const newConsultation: ConsultationItem = {
      id: `consult-${Date.now()}`,
      customerName: "Customer Baru",
      customerEmail: "customer@email.com",
      customerPhone: "08xx-xxxx-xxxx",
      projectTitle: "Konsultasi Proyek Baru",
      projectType: "Interior",
      consultationDate: "Tanggal konsultasi",
      consultationTime: "Jam konsultasi",
      method: "Google Meet",
      meetingLink: "https://meet.google.com/",
      status: "Menunggu Konfirmasi",
      requestSource: "Request Proyek",
      adminNote: "Tambahkan catatan awal untuk konsultasi.",
      customerNeed: "Tuliskan kebutuhan awal customer.",
      resultNote: "Belum ada hasil konsultasi.",
    };

    setConsultations((current) => [newConsultation, ...current]);
    setSelectedConsultationId(newConsultation.id);
    setActiveTab("Menunggu");
  };

  if (!selectedConsultation) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Relasi Pengguna
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Konsultasi
          </h1>

          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
            Kelola jadwal konsultasi customer, konfirmasi meeting, catatan
            kebutuhan, dan hasil diskusi sebelum proyek diproses lebih lanjut.
          </p>
        </div>

        <button
          type="button"
          onClick={addMockConsultation}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Plus size={16} />
          Tambah Jadwal
        </button>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <ConsultationMiniStat
          icon={MessageCircle}
          label="Total Konsultasi"
          value={`${consultations.length}`}
          description="Semua jadwal customer"
        />

        <ConsultationMiniStat
          icon={Clock}
          label="Menunggu"
          value={`${waitingCount}`}
          description="Perlu konfirmasi"
        />

        <ConsultationMiniStat
          icon={Video}
          label="Terkonfirmasi"
          value={`${confirmedCount}`}
          description="Siap dilakukan"
        />

        <ConsultationMiniStat
          icon={CheckCircle2}
          label="Selesai"
          value={`${finishedCount}`}
          description="Sudah ditindaklanjuti"
        />
      </section>

      <AdminSectionCard title="Daftar Konsultasi">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-2">
          <div className="grid grid-cols-5 gap-2">
            {consultationTabs.map((tab) => {
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
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map((item) => (
              <ConsultationCard
                key={item.id}
                item={item}
                selected={selectedConsultation.id === item.id}
                onClick={() => setSelectedConsultationId(item.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FCFBF9] p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-[13px] font-semibold text-[#31332C]">
                Belum ada konsultasi pada kategori ini.
              </p>

              <p className="mt-1 text-[12px] text-[#7B756E]">
                Jadwal konsultasi akan muncul sesuai statusnya.
              </p>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSectionCard
          title="Detail Konsultasi"
          action={
            <ConsultationStatusBadge status={selectedConsultation.status} />
          }
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Jadwal Customer
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                {selectedConsultation.projectTitle}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#7B756E]">
                Konsultasi untuk proyek{" "}
                <span className="font-semibold text-[#725F54]">
                  {selectedConsultation.projectType}
                </span>{" "}
                dari {selectedConsultation.customerName}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile
                icon={UserRound}
                label="Customer"
                value={selectedConsultation.customerName}
                description={selectedConsultation.customerEmail}
              />

              <InfoTile
                icon={Phone}
                label="Kontak"
                value={selectedConsultation.customerPhone}
                description="Nomor customer"
              />

              <InfoTile
                icon={CalendarDays}
                label="Tanggal"
                value={selectedConsultation.consultationDate}
                description={selectedConsultation.consultationTime}
              />

              <InfoTile
                icon={Video}
                label="Metode"
                value={selectedConsultation.method}
                description="Metode konsultasi"
              />

              <InfoTile
                icon={Link2}
                label="Link"
                value="Meeting Link"
                description={selectedConsultation.meetingLink}
              />

              <InfoTile
                icon={MessageCircle}
                label="Sumber"
                value={selectedConsultation.requestSource}
                description="Asal pengajuan"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Tanggal Konsultasi
                </span>

                <input
                  value={selectedConsultation.consultationDate}
                  onChange={(event) =>
                    updateSelectedConsultation(
                      "consultationDate",
                      event.target.value,
                    )
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Jam Konsultasi
                </span>

                <input
                  value={selectedConsultation.consultationTime}
                  onChange={(event) =>
                    updateSelectedConsultation(
                      "consultationTime",
                      event.target.value,
                    )
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>

            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Link Meeting
              </span>

              <input
                value={selectedConsultation.meetingLink}
                onChange={(event) =>
                  updateSelectedConsultation("meetingLink", event.target.value)
                }
                className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Kebutuhan Customer
                </span>

                <textarea
                  value={selectedConsultation.customerNeed}
                  onChange={(event) =>
                    updateSelectedConsultation("customerNeed", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>

              <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Catatan Admin
                </span>

                <textarea
                  value={selectedConsultation.adminNote}
                  onChange={(event) =>
                    updateSelectedConsultation("adminNote", event.target.value)
                  }
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </label>
            </div>

            <label className="block rounded-2xl border border-[#E8E2D9] bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Hasil Konsultasi
              </span>

              <textarea
                value={selectedConsultation.resultNote}
                onChange={(event) =>
                  updateSelectedConsultation("resultNote", event.target.value)
                }
                rows={4}
                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>
          </div>
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="Aksi Konsultasi">
            <div className="space-y-3">
              <ActionButton
                icon={CheckCircle2}
                title="Konfirmasi Jadwal"
                description="Jadwal konsultasi sudah disetujui."
                onClick={() => updateStatus("Terkonfirmasi")}
              />

              <ActionButton
                icon={RefreshCcw}
                title="Reschedule"
                description="Gunakan jika customer meminta jadwal ulang."
                onClick={() => updateStatus("Dijadwalkan Ulang")}
              />

              <ActionButton
                icon={Clock}
                title="Tandai Selesai"
                description="Konsultasi sudah dilakukan."
                onClick={() => updateStatus("Selesai")}
              />

              <ActionButton
                icon={XCircle}
                title="Batalkan"
                description="Batalkan jadwal konsultasi."
                onClick={() => updateStatus("Dibatalkan")}
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
                    selectedConsultation.status === status
                      ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
                      : "border-[#E8E2D9] bg-white text-[#6F6860] hover:bg-[#FCFBF9]"
                  }`}
                >
                  <span>{status}</span>

                  {selectedConsultation.status === status && (
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
                onClick={() => onChangePage?.("documents")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Buat Brief
                <ArrowRight size={14} />
              </button>
            </div>
          </AdminSectionCard>
        </div>
      </section>
    </div>
  );
}

const statusOptions: ConsultationStatus[] = [
  "Menunggu Konfirmasi",
  "Terkonfirmasi",
  "Dijadwalkan Ulang",
  "Selesai",
  "Dibatalkan",
];

function ConsultationCard({
  item,
  selected,
  onClick,
}: {
  item: ConsultationItem;
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
            {item.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {item.customerName} • {item.projectType}
          </p>
        </div>

        <ConsultationStatusBadge status={item.status} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">
            Jadwal
          </p>

          <p className="mt-1 text-[13px] font-semibold text-[#31332C]">
            {item.consultationDate}
          </p>

          <p className="mt-0.5 text-[11px] text-[#9A8F86]">
            {item.consultationTime}
          </p>
        </div>

        <p className="text-right text-[11px] leading-5 text-[#9A8F86]">
          {item.method}
        </p>
      </div>
    </button>
  );
}

function ConsultationMiniStat({
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

function ConsultationStatusBadge({
  status,
}: {
  status: ConsultationStatus;
}) {
  const style =
    status === "Selesai"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : status === "Terkonfirmasi" || status === "Dijadwalkan Ulang"
        ? "border-[#D9C8BA] bg-[#FFFDF9] text-[#725F54]"
        : status === "Menunggu Konfirmasi"
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