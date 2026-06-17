"use client";

import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  FileText,
  MessageCircle,
  PackageCheck,
  PencilLine,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type DetailTab = "ringkasan" | "progress" | "pembayaran" | "dokumen";
type ProjectFilter = "semua" | "aktif" | "menunggu" | "selesai";

type PaymentStatus =
  | "Menunggu Pembayaran"
  | "Terverifikasi"
  | "Lunas"
  | "Belum Tersedia";

type RevisionStatus =
  | "Diajukan"
  | "Direview VMatch"
  | "Disetujui"
  | "Membutuhkan Diskusi";

type QCStatus = "Belum Mulai" | "Sedang Dicek" | "Perlu Catatan" | "Disetujui";

type ProjectItem = {
  id: string;
  filter: ProjectFilter;
  name: string;
  type: string;
  status: string;
  progress: number;
  location: string;
  roomSize: string;
  designStyle: string;
  estimatedCost: string;
  estimatedDuration: string;
  vendorPartner: string;
  startDate: string;
  estimatedFinish: string;
  nextStep: string;
  solution: string;
};

type Invoice = {
  id: string;
  title: string;
  amount: string;
  stage: string;
  method: string;
  status: PaymentStatus;
  dueDate: string;
  receiptNo?: string;
};

type Revision = {
  id: string;
  type: string;
  description: string;
  status: RevisionStatus;
  date: string;
};

type DocumentItem = {
  id: string;
  title: string;
  category: string;
  status: "Tersedia" | "Belum tersedia";
  date: string;
  description: string;
};

type WarrantyClaim = {
  id: string;
  issueType: string;
  description: string;
  incidentDate: string;
  status: "Klaim Diajukan" | "Klaim Diproses" | "Selesai";
};

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "progress", label: "Progress" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "dokumen", label: "Dokumen" },
];

const projectFilterTabs: { id: ProjectFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "aktif", label: "Aktif" },
  { id: "menunggu", label: "Menunggu" },
  { id: "selesai", label: "Selesai" },
];

const projectList: ProjectItem[] = [
  {
    id: "p-1",
    filter: "aktif",
    name: "Wardrobe Kamar Utama",
    type: "Wardrobe Custom",
    status: "Produksi/Pengerjaan",
    progress: 68,
    location: "Semarang, Jawa Tengah",
    roomSize: "3 x 4 meter",
    designStyle: "Warm modern",
    estimatedCost: "Rp18–60 juta",
    estimatedDuration: "4–6 minggu",
    vendorPartner: "Vendor Partner VMatch - Interior Semarang",
    startDate: "18 Juni 2026",
    estimatedFinish: "28 Juni 2026",
    nextStep: "Menunggu persetujuan material sebelum tahap produksi final.",
    solution:
      "Solusi awal VMatch adalah wardrobe custom dengan kombinasi area gantungan, laci, rak lipat, dan storage barang kecil. Desain diarahkan ke warm modern dengan finishing matte neutral.",
  },
  {
    id: "p-2",
    filter: "menunggu",
    name: "Kitchen Set Minimalis",
    type: "Kitchen Set Custom",
    status: "Menunggu Persetujuan Solusi",
    progress: 25,
    location: "Bandung, Jawa Barat",
    roomSize: "3 x 4 meter",
    designStyle: "Modern minimalis",
    estimatedCost: "Rp25–70 juta",
    estimatedDuration: "5–7 minggu",
    vendorPartner: "Belum dipilih",
    startDate: "Menunggu persetujuan",
    estimatedFinish: "Menunggu jadwal final",
    nextStep: "Customer perlu meninjau solusi awal dan estimasi biaya.",
    solution:
      "Solusi awal VMatch adalah kitchen set custom dengan layout dapur fungsional, storage maksimal, finishing modern minimalis, dan material yang mudah dibersihkan.",
  },
  {
    id: "p-3",
    filter: "selesai",
    name: "Storage & Rak Multifungsi",
    type: "Storage & Rak",
    status: "Selesai",
    progress: 100,
    location: "Semarang, Jawa Tengah",
    roomSize: "2.5 x 3 meter",
    designStyle: "Modern minimalis",
    estimatedCost: "Rp15–35 juta",
    estimatedDuration: "3–4 minggu",
    vendorPartner: "Vendor Partner VMatch - Interior Semarang",
    startDate: "10 Mei 2026",
    estimatedFinish: "30 Mei 2026",
    nextStep: "Proyek selesai. Garansi aktif sesuai ketentuan VMatch.",
    solution:
      "Solusi VMatch adalah storage multifungsi dengan kombinasi rak terbuka dan kabinet tertutup agar ruangan tetap rapi, efisien, dan mudah digunakan.",
  },
];

const initialRevisions: Revision[] = [
  {
    id: "rev-1",
    type: "Perubahan material",
    description: "Customer ingin membandingkan finishing matte dan semi-gloss.",
    status: "Direview VMatch",
    date: "19 Juni 2026",
  },
];

const qcChecklist = [
  "Ukuran sesuai brief",
  "Material sesuai persetujuan",
  "Finishing rapi",
  "Fungsi laci/engsel berjalan baik",
  "Area kerja rapi",
  "Foto final tersedia",
];

const warrantyCoverage = [
  "Kerusakan pemasangan",
  "Engsel/laci tidak berfungsi normal",
  "Finishing mengelupas karena pengerjaan",
  "Komponen tidak sesuai hasil QC",
];

export function ProyekView() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("semua");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "semua") return projectList;
    return projectList.filter((item) => item.filter === activeFilter);
  }, [activeFilter]);

  if (selectedProject) {
    return (
      <ProjectDetail
        projectData={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7B756E]">
          Project Tracking
        </p>

        <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[44px]">
          Proyek Saya
        </h1>

        <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-[#7B756E]">
          Pantau proyek interior yang sedang dikelola oleh tim VMatch dengan alur yang
          ringkas dan mudah dipahami.
        </p>
      </section>

      <section className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {projectFilterTabs.map((tab) => {
            const active = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`h-11 rounded-[16px] border px-5 text-[13px] font-semibold transition ${active
                    ? "border-[#725F54] bg-[#725F54] text-white"
                    : "border-[#E8E2D9] bg-white text-[#5A4A42] hover:bg-[#FCFBF9]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        {filteredProjects.map((item) => (
          <article
            key={item.id}
            className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.04)] sm:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-[28px] leading-tight text-[#31332C] sm:text-[32px]">
                    {item.name}
                  </h2>

                  <StatusPill label={item.status} />
                </div>

                <p className="mt-2 text-[13px] text-[#7B756E] sm:text-[14px]">
                  {item.type} • {item.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(item)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                Lihat Detail Proyek
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#7B756E]">Progress</span>
                <span className="font-semibold text-[#31332C]">
                  {item.progress}%
                </span>
              </div>

              <ProjectProgressBar value={item.progress} />
            </div>
          </article>
        ))}

        {filteredProjects.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#DCCBBC] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Belum ada proyek pada kategori ini.
            </p>
            <p className="mt-1 text-[13px] text-[#7B756E]">
              Proyek akan muncul sesuai statusnya.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectDetail({
  projectData,
  onBack,
}: {
  projectData: ProjectItem;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("ringkasan");

  const [materialStatus, setMaterialStatus] = useState(
    projectData.filter === "selesai"
      ? "Disetujui"
      : "Menunggu Persetujuan Customer",
  );

  const [qcStatus, setQcStatus] = useState<QCStatus>(
    projectData.filter === "selesai" ? "Disetujui" : "Sedang Dicek",
  );

  const [projectDone, setProjectDone] = useState(
    projectData.filter === "selesai",
  );

  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    createInvoices(projectData),
  );

  const [revisions, setRevisions] = useState<Revision[]>(initialRevisions);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
  const [documentPreview, setDocumentPreview] = useState<DocumentItem | null>(
    null,
  );
  const [qcNoteModalOpen, setQcNoteModalOpen] = useState(false);
  const [qcConfirmModalOpen, setQcConfirmModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);

  const warrantyActive = projectDone && qcStatus === "Disetujui";

  const progressTimeline = useMemo(
    () => createProgressTimeline(projectData, projectDone),
    [projectData, projectDone],
  );

  const workSchedules = useMemo(
    () => createWorkSchedules(projectData),
    [projectData],
  );

  const materialDetails = useMemo(
    () => createMaterialDetails(projectData),
    [projectData],
  );

  const documents = useMemo(
    () => createDocuments(projectData, projectDone, warrantyActive),
    [projectData, projectDone, warrantyActive],
  );

  const handlePaySuccess = (invoice: Invoice) => {
    setInvoices((current) =>
      current.map((item) =>
        item.id === invoice.id
          ? {
            ...item,
            status: item.title === "Pelunasan" ? "Lunas" : "Terverifikasi",
            receiptNo: `VMR-2026-${Date.now().toString().slice(-4)}`,
          }
          : item,
      ),
    );

    setPaymentInvoice(null);
  };

  const handleApproveQC = () => {
    setQcStatus("Disetujui");
    setProjectDone(true);

    setInvoices((current) =>
      current.map((item) =>
        item.title === "Pelunasan" && item.status === "Belum Tersedia"
          ? { ...item, status: "Menunggu Pembayaran" }
          : item,
      ),
    );

    setQcConfirmModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center gap-2 rounded-[16px] border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ChevronRight size={14} className="rotate-180" />
        Kembali ke Proyek Saya
      </button>

      <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.04)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7B756E]">
              Detail Proyek
            </p>

            <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[44px]">
              {projectData.name}
            </h1>

            <p className="mt-2 text-[14px] leading-7 text-[#7B756E]">
              {projectData.type} • {projectData.location}
            </p>
          </div>

          <StatusPill label={projectDone ? "Selesai" : projectData.status} />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#7B756E]">Progress Proyek</span>
            <span className="font-semibold text-[#31332C]">
              {projectDone ? 100 : projectData.progress}%
            </span>
          </div>

          <ProjectProgressBar value={projectDone ? 100 : projectData.progress} />
        </div>
      </section>

      <section className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {detailTabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 rounded-[16px] border px-5 text-[13px] font-semibold transition ${active
                    ? "border-[#725F54] bg-[#725F54] text-white"
                    : "border-[#E8E2D9] bg-white text-[#5A4A42] hover:bg-[#FCFBF9]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === "ringkasan" && (
        <SummaryTab
          projectData={projectData}
          projectDone={projectDone}
          materialStatus={materialStatus}
          warrantyActive={warrantyActive}
          onGoProgress={() => setActiveTab("progress")}
          onGoPayment={() => setActiveTab("pembayaran")}
        />
      )}

      {activeTab === "progress" && (
        <ProgressTab
          projectData={projectData}
          projectDone={projectDone}
          progressTimeline={progressTimeline}
          workSchedules={workSchedules}
          materialStatus={materialStatus}
          materialDetails={materialDetails}
          revisions={revisions}
          qcStatus={qcStatus}
          onApproveMaterial={() => setMaterialStatus("Disetujui")}
          onRequestMaterialChange={() => setMaterialModalOpen(true)}
          onCreateRevision={() => setRevisionModalOpen(true)}
          onCreateQCNote={() => setQcNoteModalOpen(true)}
          onApproveQC={() => setQcConfirmModalOpen(true)}
        />
      )}

      {activeTab === "pembayaran" && (
        <PaymentTab
          invoices={invoices}
          onPay={setPaymentInvoice}
          onReceipt={setReceiptInvoice}
        />
      )}

      {activeTab === "dokumen" && (
        <DocumentTab
          documents={documents}
          warrantyActive={warrantyActive}
          warrantyClaims={warrantyClaims}
          onPreview={setDocumentPreview}
          onCreateClaim={() => setWarrantyModalOpen(true)}
        />
      )}

      {materialModalOpen && (
        <SimpleTextModal
          title="Minta Perubahan Material"
          description="Tuliskan perubahan material yang kamu inginkan. Tim VMatch akan meninjau dampak biaya dan timeline."
          placeholder="Contoh: ingin warna finishing lebih hangat atau material yang lebih tahan lembap."
          submitLabel="Kirim Perubahan"
          onClose={() => setMaterialModalOpen(false)}
          onSubmit={(text) => {
            setRevisions((current) => [
              {
                id: `rev-${Date.now()}`,
                type: "Perubahan material",
                description: text || "Customer meminta perubahan material.",
                status: "Diajukan",
                date: "Hari ini",
              },
              ...current,
            ]);
            setMaterialStatus("Menunggu Review Perubahan");
            setMaterialModalOpen(false);
          }}
        />
      )}

      {revisionModalOpen && (
        <RevisionModal
          onClose={() => setRevisionModalOpen(false)}
          onSubmit={(data) => {
            setRevisions((current) => [
              {
                id: `rev-${Date.now()}`,
                type: data.type,
                description: data.description || "Customer mengajukan revisi.",
                status: "Diajukan",
                date: "Hari ini",
              },
              ...current,
            ]);
            setRevisionModalOpen(false);
          }}
        />
      )}

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onSuccess={() => handlePaySuccess(paymentInvoice)}
        />
      )}

      {receiptInvoice && (
        <ReceiptModal
          invoice={receiptInvoice}
          projectName={projectData.name}
          onClose={() => setReceiptInvoice(null)}
        />
      )}

      {documentPreview && (
        <DocumentPreviewModal
          document={documentPreview}
          onClose={() => setDocumentPreview(null)}
        />
      )}

      {qcNoteModalOpen && (
        <SimpleTextModal
          title="Ajukan Catatan QC"
          description="Tulis catatan jika masih ada hal yang perlu dicek ulang oleh tim VMatch."
          placeholder="Contoh: bagian laci kanan perlu dicek ulang karena terasa kurang halus."
          submitLabel="Kirim Catatan"
          onClose={() => setQcNoteModalOpen(false)}
          onSubmit={() => {
            setQcStatus("Perlu Catatan");
            setQcNoteModalOpen(false);
          }}
        />
      )}

      {qcConfirmModalOpen && (
        <ConfirmModal
          title="Setujui Hasil Akhir?"
          description="Setujui hasil hanya jika pekerjaan sudah sesuai. Setelah disetujui, proyek akan dianggap selesai dan garansi aktif."
          confirmLabel="Setujui Hasil"
          onClose={() => setQcConfirmModalOpen(false)}
          onConfirm={handleApproveQC}
        />
      )}

      {warrantyModalOpen && (
        <WarrantyClaimModal
          onClose={() => setWarrantyModalOpen(false)}
          onSubmit={(claim) => {
            setWarrantyClaims((current) => [
              {
                id: `claim-${Date.now()}`,
                issueType: claim.issueType,
                description: claim.description,
                incidentDate: claim.incidentDate,
                status: "Klaim Diajukan",
              },
              ...current,
            ]);
            setWarrantyModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SummaryTab({
  projectData,
  projectDone,
  materialStatus,
  warrantyActive,
  onGoProgress,
  onGoPayment,
}: {
  projectData: ProjectItem;
  projectDone: boolean;
  materialStatus: string;
  warrantyActive: boolean;
  onGoProgress: () => void;
  onGoPayment: () => void;
}) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={PackageCheck}
          label="Status"
          value={projectDone ? "Selesai" : projectData.status}
          tone="strong"
        />
        <InfoCard
          icon={Wallet}
          label="Estimasi Biaya"
          value={projectData.estimatedCost}
        />
        <InfoCard
          icon={Clock3}
          label="Estimasi Durasi"
          value={projectData.estimatedDuration}
        />
        <InfoCard
          icon={CalendarDays}
          label="Estimasi Selesai"
          value={projectData.estimatedFinish}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Informasi Utama Proyek">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow label="Nama proyek" value={projectData.name} />
            <DetailRow label="Jenis proyek" value={projectData.type} />
            <DetailRow label="Lokasi" value={projectData.location} />
            <DetailRow label="Ukuran ruangan" value={projectData.roomSize} />
            <DetailRow label="Style desain" value={projectData.designStyle} />
            <DetailRow label="Tanggal mulai" value={projectData.startDate} />
            <DetailRow
              label="Vendor partner"
              value={projectData.vendorPartner}
            />
          </div>

          <HighlightPanel
            className="mt-4"
            icon={RefreshCw}
            label="Langkah berikutnya"
            title={projectData.nextStep}
            description="Ini adalah tindakan atau informasi paling penting untuk tahap proyek saat ini."
          />
        </Card>

        <div className="space-y-5">
          <Card title="Langkah Berikutnya">
            <HighlightPanel
              icon={RefreshCw}
              label="Prioritas Saat Ini"
              title={projectData.nextStep}
              description="Cek progress atau pembayaran jika ada tindakan yang perlu dilakukan."
            />

            <div className="mt-5 grid gap-2">
              <ActionButton
                icon={RefreshCw}
                label="Lihat Progress"
                onClick={onGoProgress}
                primary
              />
              <ActionButton
                icon={CreditCard}
                label="Lihat Pembayaran"
                onClick={onGoPayment}
              />
              <ActionButton
                icon={MessageCircle}
                label="Jadwalkan Konsultasi"
                onClick={() => alert("Simulasi: buka halaman Konsultasi")}
              />
            </div>
          </Card>

          <Card title="Status Pendukung">
            <div className="grid gap-3">
              <StatusSummaryCard
                title="Status Material"
                value={materialStatus}
                description="Material perlu disetujui sebelum produksi final."
              />
              <StatusSummaryCard
                title="Status Garansi"
                value={warrantyActive ? "Aktif" : "Belum Aktif"}
                description={
                  warrantyActive
                    ? "Garansi sudah aktif setelah QC disetujui."
                    : "Garansi aktif setelah proyek selesai dan QC disetujui."
                }
              />
            </div>
          </Card>
        </div>
      </section>

      <Card title="Solusi Awal VMatch">
        <p className="text-[14px] leading-7 text-[#6F6860]">
          {projectData.solution}
        </p>
      </Card>
    </div>
  );
}

function ProgressTab({
  projectData,
  projectDone,
  progressTimeline,
  workSchedules,
  materialStatus,
  materialDetails,
  revisions,
  qcStatus,
  onApproveMaterial,
  onRequestMaterialChange,
  onCreateRevision,
  onCreateQCNote,
  onApproveQC,
}: {
  projectData: ProjectItem;
  projectDone: boolean;
  progressTimeline: { title: string; status: string; desc: string }[];
  workSchedules: { label: string; date: string }[];
  materialStatus: string;
  materialDetails: { part: string; material: string }[];
  revisions: Revision[];
  qcStatus: QCStatus;
  onApproveMaterial: () => void;
  onRequestMaterialChange: () => void;
  onCreateRevision: () => void;
  onCreateQCNote: () => void;
  onApproveQC: () => void;
}) {
  const showMaterialApproval =
    materialStatus !== "Disetujui" && projectData.filter !== "menunggu";

  const showQC = projectDone || qcStatus !== "Belum Mulai";

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Timeline Progress">
          <div className="space-y-0">
            {progressTimeline.map((item, index) => (
              <TimelineStep
                key={item.title}
                item={item}
                isLast={index === progressTimeline.length - 1}
              />
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Jadwal Pekerjaan">
            <div className="space-y-2">
              {workSchedules.map((item) => (
                <ScheduleRow key={item.label} label={item.label} date={item.date} />
              ))}
            </div>
          </Card>

          <Card title="Update dari VMatch">
            <p className="text-[14px] leading-7 text-[#6F6860]">
              Progress proyek {projectData.name} mengikuti jadwal yang sudah
              disusun. Jika ada perubahan, update akan muncul di dashboard ini.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MockPhoto label="Progress pekerjaan" />
              <MockPhoto label="Finishing material" />
            </div>
          </Card>
        </div>
      </section>

      {showMaterialApproval && (
        <Card title="Persetujuan Material">
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div>
              <StatusPill label={materialStatus} />

              <p className="mt-4 text-[14px] leading-7 text-[#6F6860]">
                Material berikut perlu disetujui sebelum masuk tahap produksi
                final. Material ini bukan marketplace dan tidak ada pembelian
                langsung dari customer.
              </p>

              <div className="mt-5 grid gap-2">
                <ActionButton
                  icon={CheckCircle2}
                  label="Setujui Material"
                  onClick={onApproveMaterial}
                  primary
                />
                <ActionButton
                  icon={PencilLine}
                  label="Minta Perubahan"
                  onClick={onRequestMaterialChange}
                />
                <ActionButton
                  icon={MessageCircle}
                  label="Konsultasi Material"
                  onClick={() => alert("Simulasi: konsultasi material")}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {materialDetails.map((item) => (
                <SpecCard key={item.part} label={item.part} value={item.material} />
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card
        title="Revisi & Tambahan"
        action={
          <button
            type="button"
            onClick={onCreateRevision}
            className="h-10 rounded-[16px] bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
          >
            Ajukan Revisi
          </button>
        }
      >
        <p className="text-[14px] leading-7 text-[#6F6860]">
          Revisi atau tambahan pekerjaan dapat memengaruhi biaya dan timeline.
          Tim VMatch akan meninjau terlebih dahulu.
        </p>

        <div className="mt-4 grid gap-3">
          {revisions.map((item) => (
            <div
              key={item.id}
              className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill label={item.status} />
                <span className="text-[12px] text-[#7B756E]">{item.date}</span>
              </div>

              <p className="mt-3 text-[14px] font-semibold text-[#31332C]">
                {item.type}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#6F6860]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {showQC && (
        <Card title="QC & Serah Terima">
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div>
              <StatusPill label={projectDone ? "Proyek Selesai" : qcStatus} />

              <p className="mt-4 text-[14px] leading-7 text-[#6F6860]">
                Setujui hasil hanya jika pekerjaan sudah sesuai. Jika masih ada
                catatan, ajukan catatan agar tim VMatch melakukan pengecekan
                ulang.
              </p>

              <div className="mt-5 grid gap-2">
                <ActionButton
                  icon={CheckCircle2}
                  label="Setujui Hasil"
                  onClick={onApproveQC}
                  primary
                />
                <ActionButton
                  icon={PencilLine}
                  label="Ajukan Catatan"
                  onClick={onCreateQCNote}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {qcChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#725F54] text-white">
                    <Check size={14} />
                  </span>
                  <p className="text-[13px] font-medium text-[#31332C]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function PaymentTab({
  invoices,
  onPay,
  onReceipt,
}: {
  invoices: Invoice[];
  onPay: (invoice: Invoice) => void;
  onReceipt: (invoice: Invoice) => void;
}) {
  return (
    <div className="space-y-5">
      <Card title="Pembayaran Proyek">
        <div className="rounded-[18px] border border-[#DCCBBC] bg-[#FFFDF9] p-4">
          <p className="text-[14px] leading-7 text-[#6F6860]">
            Pembayaran menggunakan Virtual Account Midtrans. Customer tidak
            perlu upload bukti transfer karena pembayaran diverifikasi otomatis.
          </p>
        </div>
      </Card>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <article
            key={invoice.id}
            className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.04)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={invoice.status} />
                  <span className="text-[12px] text-[#7B756E]">
                    {invoice.stage}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-[28px] leading-tight text-[#31332C]">
                  {invoice.title}
                </h3>

                <div className="mt-3 grid gap-2 text-[13px] text-[#6F6860] sm:grid-cols-2">
                  <p>Jatuh tempo: {invoice.dueDate}</p>
                  <p>Metode: {invoice.method}</p>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4 text-left lg:min-w-[220px] lg:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Nominal
                </p>
                <p className="mt-2 font-serif text-[30px] leading-tight text-[#31332C]">
                  {invoice.amount}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {invoice.status === "Menunggu Pembayaran" && (
                <button
                  type="button"
                  onClick={() => onPay(invoice)}
                  className="h-10 rounded-[16px] bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
                >
                  Bayar Sekarang
                </button>
              )}

              {invoice.receiptNo && (
                <button
                  type="button"
                  onClick={() => onReceipt(invoice)}
                  className="h-10 rounded-[16px] border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                >
                  Lihat Kuitansi
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DocumentTab({
  documents,
  warrantyActive,
  warrantyClaims,
  onPreview,
  onCreateClaim,
}: {
  documents: DocumentItem[];
  warrantyActive: boolean;
  warrantyClaims: WarrantyClaim[];
  onPreview: (document: DocumentItem) => void;
  onCreateClaim: () => void;
}) {
  return (
    <div className="space-y-5">
      <Card title="Dokumen Proyek">
        <div className="grid gap-3">
          {documents.map((document) => (
            <article
              key={document.id}
              className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-[#E8E2D9] bg-white text-[#725F54]">
                    <FileText size={18} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill label={document.status} />
                      <span className="text-[12px] text-[#7B756E]">
                        {document.category}
                      </span>
                    </div>

                    <h3 className="mt-2 text-[15px] font-semibold text-[#31332C]">
                      {document.title}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#7B756E]">
                      Dibuat: {document.date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onPreview(document)}
                    disabled={document.status !== "Tersedia"}
                    className="h-10 rounded-[16px] border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Lihat
                  </button>

                  <button
                    type="button"
                    disabled={document.status !== "Tersedia"}
                    className="inline-flex h-10 items-center gap-2 rounded-[16px] border border-[#E4D8CD] px-4 text-[12px] font-semibold text-[#31332C] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <WarrantySection
        active={warrantyActive}
        claims={warrantyClaims}
        onCreateClaim={onCreateClaim}
      />
    </div>
  );
}

function WarrantySection({
  active,
  claims,
  onCreateClaim,
}: {
  active: boolean;
  claims: WarrantyClaim[];
  onCreateClaim: () => void;
}) {
  if (!active) {
    return (
      <Card title="Garansi">
        <div className="rounded-[18px] border border-[#DCCBBC] bg-[#FFFDF9] p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white text-[#725F54]">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#31332C]">
                Garansi belum aktif.
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#6F6860]">
                Garansi akan aktif setelah proyek selesai dan hasil akhir
                disetujui melalui tahap QC & Serah Terima.
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Garansi Aktif"
      action={
        <button
          type="button"
          onClick={onCreateClaim}
          className="h-10 rounded-[16px] bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          Ajukan Klaim
        </button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <InfoCard icon={ShieldCheck} label="Status Garansi" value="Aktif" />
        <InfoCard icon={CalendarDays} label="Masa Garansi" value="3 bulan" />
        <InfoCard icon={Clock3} label="Berlaku Sampai" value="28 Sep 2026" />
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {warrantyCoverage.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
          >
            <CheckCircle2 size={16} className="shrink-0 text-[#725F54]" />
            <p className="text-[13px] font-medium text-[#31332C]">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-[#31332C]">
          Riwayat klaim
        </p>

        {claims.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
              >
                <StatusPill label={claim.status} />
                <p className="mt-3 text-[14px] font-semibold text-[#31332C]">
                  {claim.issueType}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#6F6860]">
                  {claim.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
            Belum ada klaim garansi.
          </p>
        )}
      </div>
    </Card>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 shadow-[0_12px_34px_rgba(49,51,44,0.04)] sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="font-serif text-[27px] leading-tight text-[#31332C] sm:text-[31px]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function HighlightPanel({
  icon: Icon,
  label,
  title,
  description,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border border-[#DCCBBC] bg-[#FFFDF9] p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white text-[#725F54]">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#31332C]">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-[13px] leading-6 text-[#7B756E]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "strong";
}) {
  return (
    <div
      className={`rounded-[20px] border p-4 shadow-[0_10px_28px_rgba(49,51,44,0.035)] ${tone === "strong"
          ? "border-[#DCCBBC] bg-[#FFFDF9]"
          : "border-[#E8E2D9] bg-white"
        }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-[14px] border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
        <Icon size={17} />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B756E]">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-semibold leading-6 text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-semibold leading-6 text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#EFE7DD] bg-[#FCFBF9] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#725F54]">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-semibold leading-6 text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function StatusSummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
        {title}
      </p>
      <div className="mt-2">
        <StatusPill label={value} />
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[#6F6860]">
        {description}
      </p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  const lower = label.toLowerCase();

  const isActive =
    lower.includes("berjalan") ||
    lower.includes("produksi") ||
    lower.includes("sedang");

  const isSuccess =
    lower.includes("selesai") ||
    lower.includes("terverifikasi") ||
    lower.includes("lunas") ||
    lower.includes("disetujui") ||
    lower.includes("tersedia") ||
    lower === "aktif";

  const isWaiting =
    lower.includes("menunggu") ||
    lower.includes("belum") ||
    lower.includes("review");

  const className = isActive
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : isSuccess
      ? "bg-[#F4F1EC] text-[#5A4A42] border-[#E4D8CD]"
      : isWaiting
        ? "bg-[#FFFDF9] text-[#725F54] border-[#DCCBBC]"
        : "bg-[#FCFBF9] text-[#725F54] border-[#E8E2D9]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${className}`}
    >
      {isActive && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
        </span>
      )}
      {label}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-[16px] px-4 text-[12px] font-semibold transition ${primary
          ? "bg-[#725F54] text-white hover:bg-[#5A4A42]"
          : "border border-[#E4D8CD] bg-white text-[#725F54] hover:bg-[#FCFBF9]"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function ProjectProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EFE8DF]">
      <div
        className="h-full rounded-full bg-[#725F54] transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function TimelineStep({
  item,
  isLast,
}: {
  item: { title: string; status: string; desc: string };
  isLast: boolean;
}) {
  const isRunning = item.status === "Berjalan";
  const isDone = item.status === "Selesai";

  return (
    <div className="grid grid-cols-[30px_1fr] gap-4">
      <div className="relative flex justify-center">
        <div className="relative mt-2 flex h-4 w-4 items-center justify-center">
          {isRunning && (
            <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-amber-400 opacity-60" />
          )}

          <span
            className={`relative h-4 w-4 rounded-full ${isDone
                ? "bg-[#725F54]"
                : isRunning
                  ? "bg-amber-500"
                  : "border border-[#D8CCC2] bg-white"
              }`}
          />
        </div>

        {!isLast && (
          <span className="absolute top-8 h-[calc(100%-10px)] w-px bg-[#E8E2D9]" />
        )}
      </div>

      <div className="pb-4">
        <div
          className={`rounded-[18px] border p-4 ${isRunning
              ? "border-[#DCCBBC] bg-[#FFFDF9] shadow-[0_10px_24px_rgba(114,95,84,0.07)]"
              : "border-[#EFE7DD] bg-[#FCFBF9]"
            }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-[#31332C]">
              {item.title}
            </p>
            <StatusPill label={item.status} />
            {isRunning && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                Tahap aktif
              </span>
            )}
          </div>

          <p className="mt-2 text-[13px] leading-6 text-[#6F6860]">
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] border border-[#EFE7DD] bg-[#FCFBF9] px-4 py-3">
      <p className="text-[13px] font-semibold text-[#31332C]">{label}</p>
      <span className="rounded-full border border-[#E8E2D9] bg-white px-3 py-1 text-right text-[12px] font-medium text-[#7B756E]">
        {date}
      </span>
    </div>
  );
}

function MockPhoto({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4 text-center">
      <div>
        <Upload size={20} className="mx-auto text-[#725F54]" />
        <p className="mt-2 text-[12px] font-semibold text-[#31332C]">
          {label}
        </p>
        <p className="mt-1 text-[11px] text-[#7B756E]">Mock image</p>
      </div>
    </div>
  );
}

function BaseModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <section className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] border border-[#E4D8CD] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:max-w-[620px] sm:rounded-[28px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-[30px] leading-tight text-[#31332C]">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-[13px] leading-6 text-[#7B756E]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[14px] text-[#7B756E] transition hover:bg-[#FCFBF9]"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}

function RevisionModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { type: string; description: string }) => void;
}) {
  const [type, setType] = useState("Revisi desain");
  const [description, setDescription] = useState("");

  return (
    <BaseModal
      title="Ajukan Revisi / Tambahan"
      description="Jelaskan revisi atau tambahan yang kamu inginkan. Tim VMatch akan meninjau dampaknya terlebih dahulu."
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="Jenis pengajuan">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={fieldClass}
          >
            <option>Revisi desain</option>
            <option>Perubahan material</option>
            <option>Tambahan storage</option>
            <option>Perubahan ukuran</option>
            <option>Tambahan pekerjaan</option>
            <option>Lainnya</option>
          </select>
        </Field>

        <Field label="Deskripsi revisi/tambahan">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className={textareaClass}
            placeholder="Contoh: ingin menambah rak lipat di bagian kanan wardrobe."
          />
        </Field>

        <ModalActions
          onClose={onClose}
          onSubmit={() => onSubmit({ type, description })}
          submitLabel="Kirim Revisi"
        />
      </div>
    </BaseModal>
  );
}

function PaymentModal({
  invoice,
  onClose,
  onSuccess,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}) {
  return (
    <BaseModal
      title="Simulasi Pembayaran VA"
      description="Ini simulasi frontend. Pada versi asli, pembayaran diverifikasi otomatis melalui Midtrans."
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4">
          <DetailRow label="Bank" value="Bank Mandiri Virtual Account" />
          <div className="mt-3">
            <DetailRow label="Nomor VA" value="8808 2026 0000 1234" />
          </div>
          <div className="mt-3">
            <DetailRow label="Nominal" value={invoice.amount} />
          </div>
          <div className="mt-3">
            <DetailRow label="Batas waktu" value="24 jam dari sekarang" />
          </div>
        </div>

        <ModalActions
          onClose={onClose}
          onSubmit={onSuccess}
          submitLabel="Simulasikan Berhasil"
        />
      </div>
    </BaseModal>
  );
}

function ReceiptModal({
  invoice,
  projectName,
  onClose,
}: {
  invoice: Invoice;
  projectName: string;
  onClose: () => void;
}) {
  return (
    <BaseModal
      title="Kuitansi Digital"
      description="Kuitansi ini adalah simulasi frontend untuk pembayaran proyek VMatch."
      onClose={onClose}
    >
      <div className="rounded-[18px] border border-[#E4D8CD] bg-[#FCFBF9] p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#725F54]">
            <Receipt size={20} />
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Pembayaran Terverifikasi
            </p>

            <h3 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C]">
              {invoice.title}
            </h3>

            <p className="mt-1 text-[13px] text-[#7B756E]">
              Nomor kuitansi: {invoice.receiptNo || "VMR-2026-MOCK"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <DetailRow label="Nominal" value={invoice.amount} />
          <DetailRow label="Tahap pembayaran" value={invoice.stage} />
          <DetailRow label="Metode" value={invoice.method} />
          <DetailRow label="Status" value={invoice.status} />
          <DetailRow label="Tanggal verifikasi" value="Hari ini" />
          <DetailRow label="Proyek" value={projectName} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-[16px] border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
        >
          Tutup
        </button>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <Download size={14} />
          Download Mock
        </button>
      </div>
    </BaseModal>
  );
}

function DocumentPreviewModal({
  document,
  onClose,
}: {
  document: DocumentItem;
  onClose: () => void;
}) {
  return (
    <BaseModal
      title={document.title}
      description={document.category}
      onClose={onClose}
    >
      <div className="rounded-[18px] border border-[#E4D8CD] bg-[#FCFBF9] p-5">
        <FileText size={28} className="text-[#725F54]" />
        <p className="mt-4 text-[13px] leading-6 text-[#6F6860]">
          {document.description}
        </p>
        <p className="mt-4 text-[12px] font-semibold text-[#31332C]">
          Preview dokumen mock. Tidak ada file asli yang diunduh.
        </p>
      </div>

      <ModalActions
        onClose={onClose}
        onSubmit={onClose}
        submitLabel="Tutup Preview"
      />
    </BaseModal>
  );
}

function SimpleTextModal({
  title,
  description,
  placeholder,
  submitLabel,
  onClose,
  onSubmit,
}: {
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <BaseModal title={title} description={description} onClose={onClose}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={5}
        className={textareaClass}
        placeholder={placeholder}
      />

      <ModalActions
        onClose={onClose}
        onSubmit={() => onSubmit(value)}
        submitLabel={submitLabel}
      />
    </BaseModal>
  );
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BaseModal title={title} description={description} onClose={onClose}>
      <ModalActions
        onClose={onClose}
        onSubmit={onConfirm}
        submitLabel={confirmLabel}
      />
    </BaseModal>
  );
}

function WarrantyClaimModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (claim: {
    issueType: string;
    description: string;
    incidentDate: string;
  }) => void;
}) {
  const [issueType, setIssueType] = useState(
    "Engsel/laci tidak berfungsi normal",
  );
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");

  return (
    <BaseModal
      title="Ajukan Klaim Garansi"
      description="Klaim garansi hanya dapat diajukan setelah garansi aktif."
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="Jenis masalah">
          <select
            value={issueType}
            onChange={(event) => setIssueType(event.target.value)}
            className={fieldClass}
          >
            <option>Kerusakan pemasangan</option>
            <option>Engsel/laci tidak berfungsi normal</option>
            <option>Finishing mengelupas karena pengerjaan</option>
            <option>Komponen tidak sesuai hasil QC</option>
          </select>
        </Field>

        <Field label="Tanggal kejadian">
          <input
            type="date"
            value={incidentDate}
            onChange={(event) => setIncidentDate(event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field label="Deskripsi masalah">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className={textareaClass}
            placeholder="Jelaskan masalah yang terjadi."
          />
        </Field>

        <ModalActions
          onClose={onClose}
          onSubmit={() =>
            onSubmit({
              issueType,
              description: description || "Customer mengajukan klaim garansi.",
              incidentDate: incidentDate || "Hari ini",
            })
          }
          submitLabel="Kirim Klaim"
        />
      </div>
    </BaseModal>
  );
}

function ModalActions({
  onClose,
  onSubmit,
  submitLabel,
}: {
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-[16px] border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        Batal
      </button>

      <button
        type="button"
        onClick={onSubmit}
        className="h-11 rounded-[16px] bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
      >
        {submitLabel}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-[#725F54]">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldClass =
  "h-11 w-full rounded-[16px] border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[13px] text-[#31332C] outline-none transition focus:border-[#725F54]";

const textareaClass =
  "w-full resize-none rounded-[16px] border border-[#E4D8CD] bg-[#FCFBF9] p-4 text-[13px] leading-6 text-[#31332C] outline-none transition focus:border-[#725F54]";

function createInvoices(projectData: ProjectItem): Invoice[] {
  const isDone = projectData.filter === "selesai";
  const isWaiting = projectData.filter === "menunggu";

  return [
    {
      id: "inv-1",
      title: "DP Proyek",
      amount: isWaiting ? "Rp0" : "Rp5.000.000",
      stage: "Pembayaran awal",
      method: "Virtual Account Midtrans",
      status: isWaiting ? "Belum Tersedia" : "Terverifikasi",
      dueDate: "18 Juni 2026",
      receiptNo: isWaiting ? undefined : "VMR-2026-0001",
    },
    {
      id: "inv-2",
      title: "Pembayaran Tahap 2",
      amount: "Rp8.000.000",
      stage: "Sebelum produksi final",
      method: "Virtual Account Midtrans",
      status: isDone ? "Terverifikasi" : "Menunggu Pembayaran",
      dueDate: "22 Juni 2026",
      receiptNo: isDone ? "VMR-2026-0002" : undefined,
    },
    {
      id: "inv-3",
      title: "Pelunasan",
      amount: "Rp4.000.000",
      stage: "Setelah QC disetujui",
      method: "Virtual Account Midtrans",
      status: isDone ? "Lunas" : "Belum Tersedia",
      dueDate: "28 Juni 2026",
      receiptNo: isDone ? "VMR-2026-0003" : undefined,
    },
  ];
}

function createProgressTimeline(projectData: ProjectItem, projectDone: boolean) {
  if (projectDone || projectData.filter === "selesai") {
    return [
      {
        title: "Request diterima",
        status: "Selesai",
        desc: "Kebutuhan awal proyek sudah diterima oleh tim VMatch.",
      },
      {
        title: "Solusi disiapkan",
        status: "Selesai",
        desc: "Tim VMatch sudah menyusun solusi dan estimasi proyek.",
      },
      {
        title: "Pengerjaan selesai",
        status: "Selesai",
        desc: "Pekerjaan sudah diselesaikan oleh vendor partner.",
      },
      {
        title: "Quality Control",
        status: "Selesai",
        desc: "QC dan serah terima sudah disetujui customer.",
      },
    ];
  }

  if (projectData.filter === "menunggu") {
    return [
      {
        title: "Request diterima",
        status: "Selesai",
        desc: "Kebutuhan awal proyek sudah diterima.",
      },
      {
        title: "Solusi disiapkan",
        status: "Berjalan",
        desc: "Tim VMatch sedang menyusun solusi awal dan estimasi biaya.",
      },
      {
        title: "Menunggu persetujuan",
        status: "Terjadwal",
        desc: "Customer perlu meninjau solusi sebelum proyek lanjut.",
      },
    ];
  }

  return [
    {
      title: "Request diterima",
      status: "Selesai",
      desc: "Kebutuhan awal proyek sudah diterima oleh tim VMatch.",
    },
    {
      title: "Solusi disiapkan",
      status: "Selesai",
      desc: "Tim VMatch menyusun solusi awal berdasarkan brief customer.",
    },
    {
      title: "Pembayaran terverifikasi",
      status: "Selesai",
      desc: "DP proyek sudah diverifikasi melalui sistem pembayaran.",
    },
    {
      title: "Produksi / pengerjaan",
      status: "Berjalan",
      desc: `Pengerjaan ${projectData.type} sedang berjalan.`,
    },
    {
      title: "Instalasi",
      status: "Terjadwal",
      desc: "Instalasi dijadwalkan setelah produksi selesai.",
    },
    {
      title: "Quality Control",
      status: "Belum mulai",
      desc: "QC dilakukan setelah pekerjaan selesai.",
    },
  ];
}

function createWorkSchedules(projectData: ProjectItem) {
  if (projectData.filter === "selesai") {
    return [
      { label: "Survey lokasi", date: "10 Mei 2026" },
      { label: "Produksi / pengerjaan", date: "12–25 Mei 2026" },
      { label: "Instalasi", date: "28 Mei 2026" },
      { label: "QC & serah terima", date: "30 Mei 2026" },
    ];
  }

  if (projectData.filter === "menunggu") {
    return [
      { label: "Review solusi", date: "Menunggu persetujuan" },
      { label: "Pembayaran awal", date: "Setelah solusi disetujui" },
      { label: "Penjadwalan vendor", date: "Belum dijadwalkan" },
    ];
  }

  return [
    { label: "Survey lokasi", date: "18 Juni 2026" },
    { label: "Produksi furniture", date: "20–25 Juni 2026" },
    { label: "Instalasi", date: "27 Juni 2026" },
    { label: "QC", date: "28 Juni 2026" },
  ];
}

function createMaterialDetails(projectData: ProjectItem) {
  if (projectData.type.toLowerCase().includes("kitchen")) {
    return [
      { part: "Kabinet dapur", material: "Plywood + HPL" },
      { part: "Top table", material: "Solid surface" },
      { part: "Backsplash", material: "Motif marble / neutral" },
      { part: "Finishing", material: "Matte modern minimalis" },
    ];
  }

  if (projectData.type.toLowerCase().includes("storage")) {
    return [
      { part: "Rak utama", material: "Plywood + HPL" },
      { part: "Kabinet tertutup", material: "MDF finishing matte" },
      { part: "Handle", material: "Minimalist handle" },
      { part: "Finishing", material: "Neutral warm tone" },
    ];
  }

  return [
    { part: "Kabinet utama", material: "Plywood + HPL" },
    { part: "Laci", material: "Soft close rail" },
    { part: "Pintu wardrobe", material: "HPL matte neutral" },
    { part: "Aksesori", material: "Hanging rod + rak lipat" },
  ];
}

function createDocuments(
  projectData: ProjectItem,
  projectDone: boolean,
  warrantyActive: boolean,
): DocumentItem[] {
  return [
    {
      id: "doc-1",
      title: `Brief Proyek ${projectData.name}`,
      category: "Brief Proyek",
      status: "Tersedia",
      date: "18 Juni 2026",
      description:
        "Berisi kebutuhan awal customer, referensi desain, budget, lokasi, dan catatan proyek.",
    },
    {
      id: "doc-2",
      title: "Solusi Awal VMatch",
      category: "Solusi Proyek",
      status: "Tersedia",
      date: "19 Juni 2026",
      description:
        "Berisi solusi awal, estimasi, material rekomendasi, dan langkah pengerjaan.",
    },
    {
      id: "doc-3",
      title: "Invoice Proyek",
      category: "Invoice",
      status: projectData.filter === "menunggu" ? "Belum tersedia" : "Tersedia",
      date: "20 Juni 2026",
      description: "Dokumen tagihan pembayaran proyek.",
    },
    {
      id: "doc-4",
      title: "Dokumen Final",
      category: "Final Project",
      status: projectDone ? "Tersedia" : "Belum tersedia",
      date: projectDone ? "28 Juni 2026" : "-",
      description:
        "Dokumen final proyek setelah pekerjaan selesai dan disetujui customer.",
    },
    {
      id: "doc-5",
      title: "Dokumen Garansi",
      category: "Garansi",
      status: warrantyActive ? "Tersedia" : "Belum tersedia",
      date: warrantyActive ? "28 Juni 2026" : "-",
      description:
        "Dokumen garansi yang aktif setelah proyek selesai dan QC disetujui.",
    },
  ];
}
