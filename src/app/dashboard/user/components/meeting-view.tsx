"use client";

import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Link2,
  MessageCircle,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createConsultation, getMyConsultations, updateConsultation } from "@/lib/api/consultations";
import { getMyProjects } from "@/lib/api/projects";
import type { Consultation as DBConsultation, Project } from "@/lib/supabase/types";

type ConsultationStatus =
  | "Menunggu Konfirmasi"
  | "Terkonfirmasi"
  | "Dijadwalkan Ulang"
  | "Selesai"
  | "Dibatalkan";

type ConsultationTab = "Semua" | "Aktif" | "Menunggu" | "Selesai";

type Consultation = {
  id: string;
  projectName: string;
  topic: string;
  type: "Google Meet" | "WhatsApp Call" | "Chat WhatsApp" | "Offline";
  date: string;
  time: string;
  note: string;
  status: ConsultationStatus;
  meetUrl?: string;
  resultSummary?: string;
};

type ConsultationForm = {
  projectName: string;
  topic: string;
  type: "Google Meet" | "WhatsApp Call" | "Chat WhatsApp" | "Offline" | "";
  date: string;
  time: string;
  note: string;
};

const consultationTabs: ConsultationTab[] = [
  "Semua",
  "Aktif",
  "Menunggu",
  "Selesai",
];

const projectOptions = [
  "Belum terkait proyek tertentu",
];

const topicOptions = [
  "Konsultasi kebutuhan proyek",
  "Konfirmasi request proyek",
  "Diskusi solusi proyek",
  "Diskusi material",
  "Revisi atau tambahan pekerjaan",
  "Kendala proyek",
  "Progress pengerjaan",
  "Lainnya",
];

const typeOptions: ConsultationForm["type"][] = [
  "Google Meet",
  "WhatsApp Call",
  "Chat WhatsApp",
  "Offline",
];

const timeOptions = ["09.00", "10.00", "13.00", "14.00", "15.00", "16.00"];

const initialForm: ConsultationForm = {
  projectName: "",
  topic: "",
  type: "",
  date: "",
  time: "",
  note: "",
};

const initialConsultations: Consultation[] = [];

export function MeetingView({ userId }: { userId: string }) {
  const [consultations, setConsultations] =
    useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState<ConsultationTab>("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ConsultationForm>(initialForm);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [dynamicProjectOptions, setDynamicProjectOptions] = useState<string[]>(projectOptions);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch consultations and projects from DB
  const loadData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const [dbConsultations, dbProjects] = await Promise.all([
        getMyConsultations(userId),
        getMyProjects(userId),
      ]);

      // Map DB consultations to local type
      const mapped: Consultation[] = dbConsultations.map((c: DBConsultation) => ({
        id: c.id,
        projectName: c.project_name || "Belum terkait proyek",
        topic: c.topic || "",
        type: (c.method as Consultation["type"]) || "Google Meet",
        date: c.consultation_date || "",
        time: c.consultation_time || "",
        note: c.customer_note || "",
        status: c.status as ConsultationStatus,
        meetUrl: c.meeting_link || undefined,
        resultSummary: c.result_note || undefined,
      }));
      setConsultations(mapped);

      // Build project options dynamically
      const projectNames = dbProjects.map((p: Project) => p.title);
      setDynamicProjectOptions([...projectNames, "Belum terkait proyek tertentu"]);
    } catch {
      // silent fail, show empty state
    } finally {
      setIsDataLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (activeTab === "Semua") return true;

      if (activeTab === "Aktif") {
        return (
          item.status === "Menunggu Konfirmasi" ||
          item.status === "Terkonfirmasi" ||
          item.status === "Dijadwalkan Ulang"
        );
      }

      if (activeTab === "Menunggu") {
        return item.status === "Menunggu Konfirmasi";
      }

      return item.status === "Selesai" || item.status === "Dibatalkan";
    });
  }, [activeTab, consultations]);

  const listTitle = useMemo(() => {
    if (activeTab === "Aktif") return "Jadwal Konsultasi Aktif";
    if (activeTab === "Menunggu") return "Menunggu Konfirmasi";
    if (activeTab === "Selesai") return "Riwayat Konsultasi";
    return "Semua Konsultasi";
  }, [activeTab]);

  const listDescription = useMemo(() => {
    if (activeTab === "Aktif") {
      return "Pantau jadwal yang masih berjalan atau sudah dikonfirmasi.";
    }

    if (activeTab === "Menunggu") {
      return "Daftar konsultasi yang masih menunggu konfirmasi dari tim VMatch.";
    }

    if (activeTab === "Selesai") {
      return "Daftar konsultasi yang sudah selesai atau dibatalkan.";
    }

    return "Lihat seluruh jadwal konsultasi, baik yang aktif maupun sudah selesai.";
  }, [activeTab]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openRescheduleModal = (item: Consultation) => {
    setEditingId(item.id);
    setForm({
      projectName: item.projectName,
      topic: item.topic,
      type: item.type,
      date: item.date,
      time: item.time,
      note: item.note,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setFormError("");
  };

  const updateForm = (key: keyof ConsultationForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.projectName ||
      !form.topic ||
      !form.type ||
      !form.date ||
      !form.time
    ) {
      setFormError("Mohon lengkapi data konsultasi terlebih dahulu.");
      return;
    }

    try {
      if (editingId) {
        // Reschedule: update existing consultation
        await updateConsultation(editingId, {
          project_name: form.projectName,
          topic: form.topic,
          method: form.type as string,
          consultation_date: form.date,
          consultation_time: form.time,
          customer_note: form.note,
          status: "Dijadwalkan Ulang",
          meeting_link: null,
        });

        setActiveTab("Aktif");
        setNotice("Pengajuan reschedule berhasil dikirim. Tim VMatch akan mengonfirmasi ulang jadwal kamu.");
      } else {
        // Create new consultation
        await createConsultation({
          customer_id: userId,
          project_name: form.projectName,
          topic: form.topic,
          method: form.type as string,
          consultation_date: form.date,
          consultation_time: form.time,
          customer_note: form.note,
          status: "Menunggu Konfirmasi",
          request_source: "Customer Request",
        });

        setActiveTab("Menunggu");
        setNotice("Pengajuan konsultasi berhasil dikirim. Tim VMatch akan mengonfirmasi jadwal kamu.");
      }

      closeModal();
      await loadData(); // Refresh from DB
    } catch {
      setFormError("Gagal mengirim. Silakan coba lagi.");
    }
  };

  const handleCancelSchedule = async (id: string) => {
    try {
      await updateConsultation(id, {
        status: "Dibatalkan",
        meeting_link: null,
        result_note: "Jadwal konsultasi dibatalkan oleh customer.",
      });

      setActiveTab("Selesai");
      setNotice("Jadwal konsultasi berhasil dibatalkan.");
      await loadData();
    } catch {
      setNotice("Gagal membatalkan. Silakan coba lagi.");
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#725F54] border-t-transparent" />
          <p className="mt-3 text-[13px] text-[#7B756E]">Memuat data konsultasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {notice && (
        <div className="fixed right-5 top-20 z-50 flex max-w-[360px] items-start gap-3 rounded-2xl border border-[#E4D8CD] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#725F54]"
          />

          <p className="flex-1 text-[13px] leading-6 text-[#31332C]">
            {notice}
          </p>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="grid h-6 w-6 place-items-center rounded-full text-[#7B756E] transition hover:bg-[#FCFBF9]"
            aria-label="Tutup notifikasi"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <section className="pb-2">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
              Consultation
            </p>

            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              Konsultasi
            </h1>

            <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
              Jadwalkan konsultasi dengan tim VMatch untuk membahas kebutuhan,
              brief proyek, estimasi, revisi, atau progress pengerjaan.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42] sm:w-fit"
          >
            <Plus size={16} />
            Ajukan Konsultasi
          </button>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-2">
        <div className="grid grid-cols-4 gap-2">
          {consultationTabs.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex h-11 items-center justify-center rounded-[18px] px-2 text-[12px] font-semibold transition sm:h-12 sm:px-4 sm:text-[14px] ${
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
      </section>

      <section className="space-y-4">
        <SectionHeader title={listTitle} description={listDescription} />

        {filteredConsultations.length > 0 ? (
          <div className="grid gap-4">
            {filteredConsultations.map((item) => (
              <ConsultationCard
                key={item.id}
                item={item}
                onReschedule={() => openRescheduleModal(item)}
                onCancel={() => handleCancelSchedule(item.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState activeTab={activeTab} onCreate={openCreateModal} />
        )}
      </section>

      {isModalOpen && (
        <ConsultationModal
          form={form}
          editing={Boolean(editingId)}
          error={formError}
          projectOptions={dynamicProjectOptions}
          onChange={updateForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function ConsultationCard({
  item,
  onReschedule,
  onCancel,
}: {
  item: Consultation;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  const confirmed = item.status === "Terkonfirmasi";
  const finished = item.status === "Selesai" || item.status === "Dibatalkan";

  return (
    <article className="rounded-2xl border border-[#DED1C4] bg-white p-5 shadow-[0_10px_30px_rgba(49,51,44,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={item.status} />

            <span className="rounded-full border border-[#EFE7DD] bg-[#FCFBF9] px-3 py-1 text-[11px] font-medium text-[#7B756E]">
              {item.type}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[26px] leading-tight text-[#31332C]">
            {item.topic}
          </h2>

          <p className="mt-1 text-[13px] text-[#7B756E]">
            {item.projectName}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:w-[260px]">
          <InfoMini
            icon={CalendarDays}
            label="Tanggal"
            value={formatDate(item.date)}
          />

          <InfoMini icon={Clock} label="Jam" value={`${item.time} WIB`} />
        </div>
      </div>

      {item.note && (
        <div className="mt-4 rounded-xl border border-[#EFE7DD] bg-[#FFFDF9] p-4">
          <p className="text-[12px] font-semibold text-[#725F54]">
            Catatan Konsultasi
          </p>

          <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
            {item.note}
          </p>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
        <p className="text-[13px] leading-6 text-[#7B756E]">
          {finished
            ? item.resultSummary ||
              "Konsultasi sudah selesai atau tidak lagi aktif."
            : confirmed
              ? "Jadwal sudah dikonfirmasi. Kamu bisa masuk melalui link Google Meet pada waktu yang ditentukan."
              : "Jadwal menunggu konfirmasi dari tim VMatch. Link meeting akan muncul setelah jadwal dikonfirmasi."}
        </p>

        {confirmed && item.meetUrl && (
          <a
            href={item.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
          >
            <Link2 size={14} />
            Masuk Google Meet
          </a>
        )}
      </div>

      {!finished && (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onReschedule}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
          >
            <RotateCcw size={14} />
            Reschedule
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9]"
          >
            <Ban size={14} />
            Batalkan
          </button>
        </div>
      )}
    </article>
  );
}

function ConsultationModal({
  form,
  editing,
  error,
  projectOptions: modalProjectOptions,
  onChange,
  onClose,
  onSubmit,
}: {
  form: ConsultationForm;
  editing: boolean;
  error: string;
  projectOptions: string[];
  onChange: (key: keyof ConsultationForm, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <section className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-[#E4D8CD] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:max-w-[620px] sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725F54]">
              {editing ? "Reschedule Konsultasi" : "Ajukan Konsultasi"}
            </p>

            <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
              {editing ? "Ubah Jadwal Konsultasi" : "Form Konsultasi"}
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
              Tim VMatch akan meninjau pengajuan jadwal kamu terlebih dahulu.
              Link meeting akan muncul setelah jadwal dikonfirmasi.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#7B756E] transition hover:bg-[#FCFBF9] hover:text-[#31332C]"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-3 text-[13px] font-medium text-[#725F54]">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Pilih Proyek">
            <SelectInput
              value={form.projectName}
              onChange={(value) => onChange("projectName", value)}
            >
              <option value="">Pilih proyek</option>
              {modalProjectOptions.map((item: string) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Topik Konsultasi">
            <SelectInput
              value={form.topic}
              onChange={(value) => onChange("topic", value)}
            >
              <option value="">Pilih topik</option>
              {topicOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Tipe Konsultasi">
            <SelectInput
              value={form.type}
              onChange={(value) => onChange("type", value)}
            >
              <option value="">Pilih tipe</option>
              {typeOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Pilih Tanggal">
            <input
              type="date"
              value={form.date}
              onChange={(event) => onChange("date", event.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field label="Pilih Jam">
            <SelectInput
              value={form.time}
              onChange={(value) => onChange("time", value)}
            >
              <option value="">Pilih jam</option>
              {timeOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Catatan Konsultasi">
            <textarea
              rows={5}
              value={form.note}
              onChange={(event) => onChange("note", event.target.value)}
              className={textareaClass}
              placeholder="Tulis hal yang ingin kamu bahas, misalnya ukuran ruangan, budget, material, revisi, atau kendala proyek."
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="h-11 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
          >
            Kirim Pengajuan
          </button>
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  activeTab,
  onCreate,
}: {
  activeTab: ConsultationTab;
  onCreate: () => void;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-[#E4D8CD] bg-white p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#FCFBF9] text-[#725F54]">
        <MessageCircle size={22} />
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-[#31332C]">
        Belum ada konsultasi {activeTab !== "Semua" ? activeTab.toLowerCase() : ""}.
      </h3>

      <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-6 text-[#7B756E]">
        Kamu bisa mengajukan konsultasi untuk membahas kebutuhan proyek,
        material, revisi, atau progress pengerjaan.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
      >
        <Plus size={15} />
        Ajukan Konsultasi
      </button>
    </section>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-serif text-[28px] leading-tight text-[#31332C]">
        {title}
      </h2>

      <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
        {description}
      </p>
    </div>
  );
}

function InfoMini({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E4D8CD] border-l-4 border-l-[#725F54] bg-white p-3">
      <div className="flex items-center gap-2 text-[#725F54]">
        <Icon size={14} />

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p className="mt-1 text-[12px] font-semibold text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 pr-11 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]"
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#725F54]"
      />
    </div>
  );
}

function StatusPill({ status }: { status: ConsultationStatus }) {
  const styleMap: Record<ConsultationStatus, string> = {
    "Menunggu Konfirmasi": "border border-amber-200 bg-amber-50 text-amber-700",
    Terkonfirmasi: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    "Dijadwalkan Ulang": "border border-blue-200 bg-blue-50 text-blue-700",
    Selesai: "border border-[#E4D8CD] bg-[#FCFBF9] text-[#725F54]",
    Dibatalkan: "border border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${styleMap[status]}`}
    >
      {status}
    </span>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] p-4 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-[#725F54]">
        {label}
      </span>

      {children}
    </label>
  );
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}