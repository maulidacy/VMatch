"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Link2,
  MessageCircle,
  Phone,
  RefreshCcw,
  Save,
  Search,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getConsultations,
  updateConsultation as updateConsultationRecord,
} from "@/lib/api/consultations";
import type { Consultation as DBConsultation } from "@/lib/supabase/types";

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
  method: "Google Meet" | "WhatsApp Call" | "Chat WhatsApp" | "Offline";
  meetingLink: string;
  status: ConsultationStatus;
  requestSource: string;
  adminNote: string;
  customerNeed: string;
  resultNote: string;
};

type ConsultationDraft = {
  consultationDate: string;
  consultationTime: string;
  method: "Google Meet" | "WhatsApp Call" | "Chat WhatsApp" | "Offline";
  meetingLink: string;
  customerNeed: string;
  adminNote: string;
  resultNote: string;
};

const consultationTabs: ConsultationTab[] = [
  "Semua",
  "Menunggu",
  "Terkonfirmasi",
  "Selesai",
  "Dibatalkan",
];

const statusOptions: ConsultationStatus[] = [
  "Menunggu Konfirmasi",
  "Terkonfirmasi",
  "Dijadwalkan Ulang",
  "Selesai",
  "Dibatalkan",
];

const methodOptions: ConsultationItem["method"][] = [
  "Google Meet",
  "WhatsApp Call",
  "Chat WhatsApp",
  "Offline",
];

const initialConsultations: ConsultationItem[] = [];

function mapDbToLocal(c: DBConsultation): ConsultationItem {
  return {
    id: c.id,
    customerName: c.customer?.full_name || "Customer",
    // profiles tidak menyimpan email (ada di auth.users). Tampilkan phone sebagai kontak.
    customerEmail: c.customer?.phone ? `HP: ${c.customer.phone}` : "-",
    customerPhone: c.customer?.phone || "-",
    projectTitle: c.project_name || "-",
    projectType: c.topic || "-",
    consultationDate: c.consultation_date || "-",
    consultationTime: c.consultation_time || "-",
    method: (c.method as ConsultationItem["method"]) || "Google Meet",
    meetingLink: c.meeting_link || "",
    status: (c.status as ConsultationStatus) || "Menunggu Konfirmasi",
    requestSource: c.request_source || "-",
    adminNote: c.admin_note || "",
    customerNeed: c.customer_need || "",
    resultNote: c.result_note || "",
  };
}

function createDraft(item: ConsultationItem): ConsultationDraft {
  return {
    consultationDate: item.consultationDate,
    consultationTime: item.consultationTime,
    method: item.method,
    meetingLink: item.meetingLink,
    customerNeed: item.customerNeed,
    adminNote: item.adminNote,
    resultNote: item.resultNote,
  };
}

export function ConsultationView() {
  const [consultations, setConsultations] =
    useState<ConsultationItem[]>(initialConsultations);
  const [activeTab, setActiveTab] = useState<ConsultationTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    string | null
  >(null);
  const [formDraft, setFormDraft] = useState<ConsultationDraft | null>(null);
  const [isFormSaved, setIsFormSaved] = useState(false);

  const loadConsultations = useCallback(async () => {
    try {
      const data = await getConsultations();
      setConsultations(data.map(mapDbToLocal));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const filteredConsultations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return consultations.filter((item) => {
      const matchTab =
        activeTab === "Semua" ||
        (activeTab === "Menunggu" &&
          item.status === "Menunggu Konfirmasi") ||
        (activeTab === "Terkonfirmasi" &&
          (item.status === "Terkonfirmasi" ||
            item.status === "Dijadwalkan Ulang")) ||
        (activeTab === "Selesai" && item.status === "Selesai") ||
        (activeTab === "Dibatalkan" && item.status === "Dibatalkan");

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        item.customerName.toLowerCase().includes(normalizedKeyword) ||
        item.customerEmail.toLowerCase().includes(normalizedKeyword) ||
        item.customerPhone.toLowerCase().includes(normalizedKeyword) ||
        item.projectTitle.toLowerCase().includes(normalizedKeyword) ||
        item.projectType.toLowerCase().includes(normalizedKeyword) ||
        item.method.toLowerCase().includes(normalizedKeyword) ||
        item.status.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, consultations, keyword]);

  const selectedConsultation = useMemo(() => {
    if (!selectedConsultationId) return null;

    return (
      consultations.find((item) => item.id === selectedConsultationId) ?? null
    );
  }, [consultations, selectedConsultationId]);

  const openDetail = (item: ConsultationItem) => {
    setSelectedConsultationId(item.id);
    setFormDraft(createDraft(item));
    setIsFormSaved(false);
  };

  const closeDetail = () => {
    setSelectedConsultationId(null);
    setFormDraft(null);
    setIsFormSaved(false);
  };

  const updateConsultation = (
    id: string,
    updater: (item: ConsultationItem) => ConsultationItem,
  ) => {
    setConsultations((current) =>
      current.map((item) => (item.id === id ? updater(item) : item)),
    );
  };

  const updateStatus = async (id: string, status: ConsultationStatus) => {
    try {
      await updateConsultationRecord(id, { status });
    } catch {
      return;
    }

    updateConsultation(id, (item) => ({
      ...item,
      status,
    }));

    if (status === "Menunggu Konfirmasi") setActiveTab("Menunggu");
    if (status === "Terkonfirmasi" || status === "Dijadwalkan Ulang") {
      setActiveTab("Terkonfirmasi");
    }
    if (status === "Selesai") setActiveTab("Selesai");
    if (status === "Dibatalkan") setActiveTab("Dibatalkan");
  };

  const saveConsultationChanges = async () => {
    if (!selectedConsultation || !formDraft) return;

    try {
      await updateConsultationRecord(selectedConsultation.id, {
        consultation_date: formDraft.consultationDate || null,
        consultation_time: formDraft.consultationTime || null,
        method: formDraft.method,
        meeting_link: formDraft.meetingLink || null,
        customer_need: formDraft.customerNeed || null,
        admin_note: formDraft.adminNote || null,
        result_note: formDraft.resultNote || null,
      });

      updateConsultation(selectedConsultation.id, (item) => ({
        ...item,
        ...formDraft,
      }));
    } catch {
      return;
    }

    setIsFormSaved(true);
  };

  if (selectedConsultation && formDraft) {
    return (
      <ConsultationDetailPage
        consultation={selectedConsultation}
        formDraft={formDraft}
        isFormSaved={isFormSaved}
        onBack={closeDetail}
        onChangeDraft={(draft) => {
          setFormDraft(draft);
          setIsFormSaved(false);
        }}
        onSave={saveConsultationChanges}
        onStatusChange={(status) =>
          updateStatus(selectedConsultation.id, status)
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[820px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Konsultasi
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Daftar Konsultasi
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Kelola jadwal konsultasi customer, metode meeting, link panggilan,
            kebutuhan proyek, catatan admin, dan hasil konsultasi.
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
              placeholder="Cari konsultasi, customer, proyek, metode, atau status..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="relative sm:hidden">
            <select
              value={activeTab}
              onChange={(event) =>
                setActiveTab(event.target.value as ConsultationTab)
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] pl-4 pr-12 text-[13px] font-semibold text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
            >
              {consultationTabs.map((tab) => (
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
              {consultationTabs.map((tab) => {
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
        {filteredConsultations.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredConsultations.map((item) => (
              <ConsultationCard
                key={item.id}
                item={item}
                onClick={() => openDetail(item)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Konsultasi tidak ditemukan.
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

function ConsultationDetailPage({
  consultation,
  formDraft,
  isFormSaved,
  onBack,
  onChangeDraft,
  onSave,
  onStatusChange,
}: {
  consultation: ConsultationItem;
  formDraft: ConsultationDraft;
  isFormSaved: boolean;
  onBack: () => void;
  onChangeDraft: (draft: ConsultationDraft) => void;
  onSave: () => void;
  onStatusChange: (status: ConsultationStatus) => void;
}) {
  const isFormChanged =
    formDraft.consultationDate !== consultation.consultationDate ||
    formDraft.consultationTime !== consultation.consultationTime ||
    formDraft.method !== consultation.method ||
    formDraft.meetingLink !== consultation.meetingLink ||
    formDraft.customerNeed !== consultation.customerNeed ||
    formDraft.adminNote !== consultation.adminNote ||
    formDraft.resultNote !== consultation.resultNote;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar konsultasi
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Jadwal Customer
              </p>

              <ConsultationStatusBadge status={consultation.status} />
            </div>

            <h1 className="mt-3 max-w-[760px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {consultation.projectTitle}
            </h1>

            <p className="mt-3 max-w-[820px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              Konsultasi untuk proyek{" "}
              <span className="font-semibold text-[#725F54]">
                {consultation.projectType}
              </span>{" "}
              dari {consultation.customerName}.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Status Konsultasi
            </label>

            <div className="relative mt-3">
              <select
                value={consultation.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as ConsultationStatus)
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
              label="Customer"
              value={consultation.customerName}
              description={consultation.customerEmail}
            />

            <InfoTile
              icon={Phone}
              label="Kontak"
              value={consultation.customerPhone}
              description="Nomor customer"
            />

            <InfoTile
              icon={CalendarDays}
              label="Tanggal"
              value={consultation.consultationDate}
              description={consultation.consultationTime}
            />

            <InfoTile
              icon={Video}
              label="Metode"
              value={consultation.method}
              description="Metode konsultasi"
            />

            <InfoTile
              icon={Link2}
              label="Link"
              value="Meeting Link"
              description={consultation.meetingLink}
            />

            <InfoTile
              icon={MessageCircle}
              label="Sumber"
              value={consultation.requestSource}
              description="Asal pengajuan"
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <DetailBlock
            title="Jadwal Konsultasi"
            description="Atur tanggal, jam, metode, dan link konsultasi customer."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Tanggal">
                <input
                  value={formDraft.consultationDate}
                  onChange={(event) =>
                    onChangeDraft({
                      ...formDraft,
                      consultationDate: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>

              <FormField label="Jam">
                <input
                  value={formDraft.consultationTime}
                  onChange={(event) =>
                    onChangeDraft({
                      ...formDraft,
                      consultationTime: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
              <FormField label="Metode">
                <div className="relative">
                  <select
                    value={formDraft.method}
                    onChange={(event) =>
                      onChangeDraft({
                        ...formDraft,
                        method: event.target.value as ConsultationItem["method"],
                      })
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] pl-4 pr-11 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                  >
                    {methodOptions.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                  />
                </div>
              </FormField>

              <FormField label="Link Meeting">
                <input
                  value={formDraft.meetingLink}
                  onChange={(event) =>
                    onChangeDraft({
                      ...formDraft,
                      meetingLink: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>
            </div>
          </DetailBlock>

          <DetailBlock
            title="Catatan Konsultasi"
            description="Rangkum kebutuhan customer dan hasil konsultasi."
            badge={isFormSaved ? "Tersimpan" : undefined}
            withRightBorder={false}
          >
            <FormField label="Kebutuhan Customer">
              <textarea
                value={formDraft.customerNeed}
                onChange={(event) =>
                  onChangeDraft({
                    ...formDraft,
                    customerNeed: event.target.value,
                  })
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </FormField>

            <div className="mt-3 grid gap-3">
              <FormField label="Catatan Admin">
                <textarea
                  value={formDraft.adminNote}
                  onChange={(event) =>
                    onChangeDraft({
                      ...formDraft,
                      adminNote: event.target.value,
                    })
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                />
              </FormField>

              <FormField label="Hasil Konsultasi">
                <textarea
                  value={formDraft.resultNote}
                  onChange={(event) =>
                    onChangeDraft({
                      ...formDraft,
                      resultNote: event.target.value,
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
                disabled={!isFormChanged}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold transition ${
                  isFormChanged
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

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onStatusChange("Terkonfirmasi")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            consultation.status === "Terkonfirmasi"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <CheckCircle2 size={15} />
          Konfirmasi
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Dijadwalkan Ulang")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            consultation.status === "Dijadwalkan Ulang"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <RefreshCcw size={15} />
          Reschedule
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Selesai")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            consultation.status === "Selesai"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <Clock size={15} />
          Selesai
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("Dibatalkan")}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition ${
            consultation.status === "Dibatalkan"
              ? "border-[#725F54] bg-[#725F54] text-white"
              : "border-[#E4D8CD] bg-white text-[#725F54] hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
          }`}
        >
          <XCircle size={15} />
          Batalkan
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

function ConsultationCard({
  item,
  onClick,
}: {
  item: ConsultationItem;
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
            {item.projectTitle}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {item.customerName} • {item.projectType}
          </p>
        </div>

        <ConsultationStatusBadge status={item.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-[#7B756E]">
        {item.customerNeed}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#7B756E]">Jadwal</p>

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
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}
