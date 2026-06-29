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
import {
  getMyProjects,
  getMyProjectRequests,
  getProgressLogs,
  getProjectInvoices,
  getQcChecklist,
  getWarrantyClaims,
  updateInvoice,
  createWarrantyClaim,
  getCustomerRabs,
  updateRab,
  upsertQcChecklist,
  createVendorBonus,
  getProjectById,
  updateProject,
} from "@/lib/api/projects";
import { toast } from "sonner";
import type {
  Invoice as DBInvoice,
  ProgressLog as DBProgressLog,
  Project as DBProject,
  ProjectRequest as DBProjectRequest,
  QcChecklist as DBQcChecklist,
  WarrantyClaim as DBWarrantyClaim,
  Rab as DBRab,
} from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

type DetailTab = "ringkasan" | "rab" | "progress" | "pembayaran" | "dokumen";
type ProjectFilter = "semua" | "aktif" | "menunggu" | "selesai" | "draft";

type PaymentStatus =
  | "Menunggu Pembayaran"
  | "Terbayar"
  | "Lunas"
  | "Terlambat"
  | "Belum Tersedia";

type RabReviewStatus = "Menunggu RAB" | "RAB Diterima" | "Sedang Direview" | "Disetujui" | "Minta Revisi";

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
  vendor_id?: string | null;
  startDate: string;
  estimatedFinish: string;
  nextStep: string;
  solution: string;
  createdAt: string;
  uploadedFiles?: string[];
  notes?: string | null;
  aiDescription?: string | null;
  aiBriefSummary?: string | null;
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
  { id: "rab", label: "RAB & Estimasi" },
  { id: "progress", label: "Progress" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "dokumen", label: "Dokumen" },
];

const projectFilterTabs: { id: ProjectFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "aktif", label: "Aktif" },
  { id: "menunggu", label: "Menunggu" },
  { id: "draft", label: "Draft" },
  { id: "selesai", label: "Selesai" },
];

const projectList: ProjectItem[] = [];

const initialRevisions: Revision[] = [];

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


function mapDbProjectRequestToItem(r: DBProjectRequest): ProjectItem {
  const filterMap: Record<string, ProjectFilter> = {
    "Draft": "draft",
    "Baru Masuk": "menunggu",
    "Review": "menunggu",
    "Estimasi": "menunggu",
  };

  return {
    id: r.id,
    filter: filterMap[r.status] || "menunggu",
    name: r.project_name || "Proyek Tanpa Nama",
    type: r.project_type || "-",
    status: r.status,
    progress: 0,
    location: r.location || "-",
    roomSize: r.room_size || "-",
    designStyle: r.design_style || "-",
    estimatedCost: r.budget || "-",
    estimatedDuration: "-",
    vendorPartner: "Belum dipilih",
    vendor_id: r.selected_vendor_id || null,
    startDate: "Menunggu jadwal",
    estimatedFinish: "Menunggu jadwal",
    nextStep: r.status === "Draft" ? "Lengkapi form dan kirim request." : "Menunggu update dari tim VMatch.",
    solution: r.ai_brief_summary || "Solusi akan ditampilkan setelah brief disetujui.",
    createdAt: r.submitted_at || new Date().toISOString(),
    uploadedFiles: (r as any).uploaded_files || [],
    notes: r.notes,
    aiDescription: r.ai_description,
    aiBriefSummary: r.ai_brief_summary,
  };
}

function mapDbProjectToItem(p: DBProject): ProjectItem {
  const filterMap: Record<string, ProjectFilter> = {
    "Berjalan": "aktif",
    "Butuh Review": "menunggu",
    "QC": "aktif",
    "Selesai": "selesai",
  };

  return {
    id: p.id,
    filter: filterMap[p.status] || "menunggu",
    name: p.title,
    type: p.project_type,
    status: p.status === "Berjalan" ? "Produksi/Pengerjaan" : p.status,
    progress: p.progress,
    location: p.location || "-",
    roomSize: p.room_size || "-",
    designStyle: p.design_style || "-",
    estimatedCost: p.estimated_cost || "-",
    estimatedDuration: p.start_date && p.estimated_finish ? "Lihat detail" : "-",
    vendorPartner: p.vendor?.full_name || "Belum dipilih",
    vendor_id: p.vendor_id || null,
    startDate: p.start_date || "Menunggu jadwal",
    estimatedFinish: p.estimated_finish || "Menunggu jadwal",
    nextStep: p.next_task || "Menunggu update dari tim VMatch.",
    solution: p.solution || p.description || "Solusi akan ditampilkan setelah brief disetujui.",
    createdAt: p.created_at,
  };
}

export function ProyekView({ userId }: { userId: string }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("semua");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dbProjects, dbRequests] = await Promise.all([
        getMyProjects(userId),
        getMyProjectRequests(userId)
      ]);
      const mappedProjects = dbProjects.map(mapDbProjectToItem);
      const mappedRequests = dbRequests.map(mapDbProjectRequestToItem);
      
      const combined = [...mappedProjects, ...mappedRequests].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setProjects(combined);
    } catch {
      // Silent fail — show empty state
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "semua") return projects;
    return projects.filter((item) => item.filter === activeFilter);
  }, [activeFilter, projects]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#725F54] border-t-transparent" />
          <p className="mt-3 text-[13px] text-[#7B756E]">Memuat proyek...</p>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetail
        projectData={selectedProject}
        userId={userId}
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
  projectData: initialProjectData,
  userId,
  onBack,
}: {
  projectData: ProjectItem;
  userId: string;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("ringkasan");
  const [currentProject, setCurrentProject] = useState<ProjectItem>(initialProjectData);
  const projectData = currentProject;

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

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [revisions, setRevisions] = useState<Revision[]>(initialRevisions);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  const [progressLogs, setProgressLogs] = useState<DBProgressLog[]>([]);
  const [qcChecklistData, setQcChecklistData] = useState<DBQcChecklist | null>(null);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
  const [documentPreview, setDocumentPreview] = useState<DocumentItem | null>(
    null,
  );
  const [qcNoteModalOpen, setQcNoteModalOpen] = useState(false);
  const [qcConfirmModalOpen, setQcConfirmModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);

  // RAB review state
  const isRequest = ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status);
  const [rabStatus, setRabStatus] = useState<RabReviewStatus>(
    isRequest ? "Menunggu RAB" :
    projectData.filter === "menunggu" ? "RAB Diterima" : 
    projectData.filter === "selesai" ? "Disetujui" : "Menunggu RAB"
  );
  const [rabRevisionNote, setRabRevisionNote] = useState("");
  const [rabRevisionOpen, setRabRevisionOpen] = useState(false);
  const [rabApproveOpen, setRabApproveOpen] = useState(false);
  const [customerRab, setCustomerRab] = useState<DBRab | null>(null);

  const warrantyActive = projectDone && qcStatus === "Disetujui";

  useEffect(() => {
    const loadProjectDetail = async () => {
      if (["Baru Masuk", "Draft", "Review", "Estimasi"].includes(initialProjectData.status)) {
        return; // Don't load full details for pending requests
      }
      try {
        const [invoiceRows, progressRows, qcRow, warrantyRows, rabs, projectDetail] = await Promise.all([
          getProjectInvoices(initialProjectData.id),
          getProgressLogs(initialProjectData.id),
          getQcChecklist(initialProjectData.id),
          getWarrantyClaims(initialProjectData.id),
          getCustomerRabs(userId),
          getProjectById(initialProjectData.id),
        ]);

        setInvoices(invoiceRows.map(mapDbInvoiceToLocalInvoice));
        setProgressLogs(progressRows);
        setQcChecklistData(qcRow);
        setWarrantyClaims(warrantyRows.map(mapDbWarrantyToLocalWarranty));
        
        // @ts-ignore
        if (projectDetail && projectDetail.revisions) {
          // @ts-ignore
          setRevisions(projectDetail.revisions);
        }

        if (projectDetail) {
          setCurrentProject(mapDbProjectToItem(projectDetail));
        }

        const projRab = rabs.find(r => r.project_id === initialProjectData.id);
        if (projRab) {
          setCustomerRab(projRab);
          if (projRab.status === "RAB Dikirim ke Customer") setRabStatus("RAB Diterima");
          else if (projRab.status === "Revisi Diminta Customer") setRabStatus("Minta Revisi");
          else if (projRab.status === "RAB Disetujui Customer") setRabStatus("Disetujui");
          else if (projRab.status === "Menunggu Estimasi Vendor" || projRab.status === "Estimasi Dikirim Vendor" || projRab.status === "RAB Direview Admin") setRabStatus("Menunggu RAB");
        }

        if (qcRow?.status === "Disetujui" || qcRow?.customer_approved_at) {
          setQcStatus("Disetujui");
          setProjectDone(true);
        } else if (qcRow?.status === "Perlu Catatan") {
          setQcStatus("Perlu Catatan");
        } else if (qcRow?.status) {
          setQcStatus("Sedang Dicek");
        }
      } catch {
        setInvoices([]);
        setProgressLogs([]);
        setQcChecklistData(null);
        setWarrantyClaims([]);
      }
    };

    loadProjectDetail();
  }, [initialProjectData.id]);

  const progressTimeline = useMemo(
    () => createProgressTimeline(projectData, projectDone, progressLogs),
    [projectData, projectDone, progressLogs],
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
    () => createDocuments(projectData, projectDone, warrantyActive, invoices, progressLogs, qcChecklistData),
    [projectData, projectDone, warrantyActive, invoices, progressLogs, qcChecklistData],
  );

  const handlePaySuccess = async (invoice: Invoice) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await updateInvoice(invoice.id, {
        status: invoice.title === "Pelunasan" ? "Lunas" : "Terbayar",
        paid_at: new Date().toISOString(),
      });
      setInvoices((current) =>
        current.map((item) =>
          item.id === invoice.id
            ? {
              ...item,
              status: item.title === "Pelunasan" ? "Lunas" : "Terbayar",
              receiptNo: `VMR-2026-${Date.now().toString().slice(-4)}`,
            }
            : item,
        ),
      );
      setPaymentInvoice(null);
      toast.success("Pembayaran berhasil dikonfirmasi.");
    } catch {
      toast.error("Gagal mengkonfirmasi pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveQC = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await upsertQcChecklist({
        project_id: projectData.id,
        status: "Disetujui",
        customer_approved_at: new Date().toISOString()
      });

      if (projectData.vendor_id) {
        await createVendorBonus({
          vendor_id: projectData.vendor_id,
          project_id: projectData.id,
          reason: "Penyelesaian Proyek (Menunggu Review)",
          status: "Berpotensi Aktif",
          amount: "Rp0",
          requirements: [
            { label: "Lulus QC Checklist", completed: true }
          ]
        });
      }
      setQcStatus("Disetujui");
      setProjectDone(true);

      setInvoices((current) =>
        current.map((item) =>
          item.title === "Pelunasan" && item.status === "Belum Tersedia"
            ? { ...item, status: "Menunggu Pembayaran" }
            : item,
        ),
      );
      toast.success("Hasil QC berhasil disetujui.");
    } catch {
      toast.error("Gagal menyetujui hasil QC.");
    } finally {
      setQcConfirmModalOpen(false);
      setSubmitting(false);
    }
  };

  const handleSubmitDraft = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const supabase = createClient();
      await supabase.from("project_requests").update({ status: "Baru Masuk", submitted_at: new Date().toISOString() }).eq("id", projectData.id);
      setCurrentProject((prev) => ({ ...prev, status: "Baru Masuk", filter: "menunggu" }));
      toast.success("Request proyek berhasil dikirim!");
    } catch {
      toast.error("Gagal mengirim request.");
    } finally {
      setSubmitting(false);
    }
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

          <div className="flex items-center gap-3">
            {projectData.status === "Draft" && (
              <button
                type="button"
                onClick={handleSubmitDraft}
                disabled={submitting}
                className="h-9 rounded-[14px] bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42] disabled:opacity-50"
              >
                Kirim Request
              </button>
            )}
            <StatusPill label={projectDone ? "Selesai" : projectData.status} />
          </div>
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

      {activeTab === "rab" && (
        <RabTab
          projectData={projectData}
          rabStatus={rabStatus}
          customerRab={customerRab}
          onApprove={() => setRabApproveOpen(true)}
          onRequestRevision={() => setRabRevisionOpen(true)}
        />
      )}

      {activeTab === "progress" && (
        <ProgressTab
          projectData={projectData}
          projectDone={projectDone}
          progressLogs={progressLogs}
          progressTimeline={progressTimeline}
          workSchedules={workSchedules}
          materialStatus={materialStatus}
          materialDetails={materialDetails}
          revisions={revisions}
          qcStatus={qcStatus}
          qcChecklistData={qcChecklistData}
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
          submitting={submitting}
          onSubmit={async (text) => {
            if (submitting) return;
            const newRev: Revision = {
              id: `rev-${Date.now()}`,
              type: "Perubahan material",
              description: text || "Customer meminta perubahan material.",
              status: "Diajukan",
              date: "Hari ini",
            };
            const updatedRevisions = [newRev, ...revisions];
            
            try {
              setSubmitting(true);
              // @ts-ignore
              await updateProject(projectData.id, { revisions: updatedRevisions });
              setRevisions(updatedRevisions);
              setMaterialStatus("Menunggu Review Perubahan");
              toast.success("Perubahan material berhasil diajukan.");
              setMaterialModalOpen(false);
            } catch {
              toast.error("Gagal mengajukan perubahan material.");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      )}

      {revisionModalOpen && (
        <RevisionModal
          onClose={() => setRevisionModalOpen(false)}
          submitting={submitting}
          onSubmit={async (data) => {
            if (submitting) return;
            const newRev: Revision = {
              id: `rev-${Date.now()}`,
              type: data.type,
              description: data.description || "Customer mengajukan revisi.",
              status: "Diajukan",
              date: "Hari ini",
            };
            const updatedRevisions = [newRev, ...revisions];
            
            try {
              setSubmitting(true);
              // @ts-ignore
              await updateProject(projectData.id, { revisions: updatedRevisions });
              setRevisions(updatedRevisions);
              toast.success("Revisi berhasil diajukan.");
              setRevisionModalOpen(false);
            } catch {
              toast.error("Gagal mengajukan revisi.");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      )}

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onSuccess={() => handlePaySuccess(paymentInvoice)}
          submitting={submitting}
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
          projectData={projectData}
          invoices={invoices}
          progressLogs={progressLogs}
          qcChecklistData={qcChecklistData}
          customerRab={customerRab}
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
          submitting={submitting}
          onSubmit={async (text) => {
            if (submitting) return;
            try {
              setSubmitting(true);
              await upsertQcChecklist({
                project_id: projectData.id,
                status: "Perlu Catatan",
                // @ts-ignore
                customer_note: text || "Perlu cek ulang",
              });
              setQcStatus("Perlu Catatan");
              toast.success("Catatan QC berhasil dikirim.");
              setQcNoteModalOpen(false);
            } catch {
              toast.error("Gagal mengirim catatan QC.");
            } finally {
              setSubmitting(false);
            }
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
          submitting={submitting}
        />
      )}

      {warrantyModalOpen && (
        <WarrantyClaimModal
          onClose={() => setWarrantyModalOpen(false)}
          submitting={submitting}
          onSubmit={async (claim) => {
            if (submitting) return;
            try {
              setSubmitting(true);
              const res = await createWarrantyClaim({
                project_id: projectData.id,
                customer_id: userId,
                issue_type: claim.issueType,
                description: claim.description,
                incident_date: claim.incidentDate,
                status: "Klaim Diajukan"
              });
              
              setWarrantyClaims((current) => [
                {
                  id: res.id,
                  issueType: claim.issueType,
                  description: claim.description,
                  incidentDate: claim.incidentDate,
                  status: "Klaim Diajukan",
                },
                ...current,
              ]);
              toast.success("Klaim garansi berhasil diajukan.");
              setWarrantyModalOpen(false);
            } catch {
              toast.error("Gagal mengajukan klaim garansi.");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      )}

      {rabRevisionOpen && (
        <SimpleTextModal
          title="Minta Revisi RAB"
          description="Tuliskan catatan revisi yang kamu inginkan. Tim VMatch akan menghubungi kamu untuk penyesuaian lebih lanjut."
          placeholder="Contoh: budget terlalu tinggi, minta opsi material yang lebih hemat."
          submitLabel="Kirim Permintaan Revisi"
          onClose={() => setRabRevisionOpen(false)}
          submitting={submitting}
          onSubmit={async (text) => {
            if (submitting) return;
            if (customerRab) {
              try {
                setSubmitting(true);
                await updateRab(customerRab.id, { 
                   status: "Revisi Diminta Customer", 
                   revision_note: text || "Customer meminta revisi RAB." 
                });
                setRabRevisionNote(text || "Customer meminta revisi RAB.");
                setRabStatus("Minta Revisi");
                toast.success("Permintaan revisi RAB berhasil dikirim.");
                setRabRevisionOpen(false);
              } catch {
                toast.error("Gagal mengirim permintaan revisi RAB.");
              } finally {
                setSubmitting(false);
              }
            } else {
              setRabRevisionNote(text || "Customer meminta revisi RAB.");
              setRabStatus("Minta Revisi");
              setRabRevisionOpen(false);
            }
          }}
        />
      )}

      {rabApproveOpen && (
        <ConfirmModal
          title="Setujui RAB?"
          description="Dengan menyetujui RAB ini, tim VMatch akan melanjutkan ke tahap produksi dan mengirimkan invoice pembayaran pertama."
          confirmLabel="Setujui RAB"
          onClose={() => setRabApproveOpen(false)}
          onConfirm={async () => {
            if (submitting) return;
            if (customerRab) {
              try {
                setSubmitting(true);
                await updateRab(customerRab.id, { status: "RAB Disetujui Customer" });
                setRabStatus("Disetujui");
                toast.success("RAB berhasil disetujui.");
                setRabApproveOpen(false);
              } catch {
                toast.error("Gagal menyetujui RAB.");
              } finally {
                setSubmitting(false);
              }
            } else {
              setRabStatus("Disetujui");
              setRabApproveOpen(false);
            }
          }}
          submitting={submitting}
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
                onClick={() => toast.info("Buka halaman Konsultasi dari menu utama untuk membuat jadwal.")}
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

function RabTab({
  projectData,
  rabStatus,
  customerRab,
  onApprove,
  onRequestRevision,
}: {
  projectData: ProjectItem;
  rabStatus: RabReviewStatus;
  customerRab?: DBRab | null;
  onApprove: () => void;
  onRequestRevision: () => void;
}) {
  const isWaiting = rabStatus === "Menunggu RAB";
  const isReceived = rabStatus === "RAB Diterima" || rabStatus === "Sedang Direview";
  const isApproved = rabStatus === "Disetujui";
  const isRevision = rabStatus === "Minta Revisi";

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
              RAB & Estimasi Biaya
            </p>
            <h2 className="mt-2 font-serif text-[28px] leading-tight text-[#31332C]">
              {isWaiting ? "Menunggu RAB dari VMatch" : isApproved ? "RAB Disetujui" : isRevision ? "Revisi Diminta" : "RAB Siap Ditinjau"}
            </h2>
            <p className="mt-2 max-w-[680px] text-[14px] leading-7 text-[#7B756E]">
              {isWaiting
                ? "Tim VMatch sedang menyiapkan estimasi biaya proyek berdasarkan kebutuhan dan survey awal. Anda akan mendapat notifikasi ketika RAB siap."
                : isApproved
                ? "RAB sudah disetujui. Tim VMatch sedang memproses langkah berikutnya dan akan segera mengirimkan invoice pembayaran pertama."
                : isRevision
                ? "Permintaan revisi sudah dikirim ke tim VMatch. Anda akan mendapat RAB yang sudah disesuaikan dalam waktu dekat."
                : "Tinjau estimasi biaya dari tim VMatch. Anda bisa menyetujui atau meminta revisi sebelum pengerjaan dimulai."}
            </p>
          </div>
          <StatusPill
            label={isApproved ? "Disetujui" : isRevision ? "Minta Revisi" : isWaiting ? "Menunggu" : "Siap Ditinjau"}
          />
        </div>

        <div className="mt-5 border-t border-[#E8E2D9] pt-5">
          <h3 className="text-[14px] font-semibold text-[#31332C]">Apa itu RAB?</h3>
          <p className="mt-1.5 text-[13px] leading-6 text-[#6F6860]">
            <strong>Rencana Anggaran Biaya (RAB)</strong> adalah dokumen rincian estimasi biaya material, 
            jasa pengerjaan oleh vendor partner, serta biaya pengawasan dari VMatch. Kami menampilkan biaya secara transparan 
            agar Anda mengetahui alokasi dana proyek dengan jelas tanpa biaya tersembunyi.
          </p>
        </div>
      </div>

      {!isWaiting && (
        <div className="rounded-[24px] border border-[#E8E2D9] bg-white p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
            Detail Estimasi
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard icon={Wallet} label="Estimasi Biaya" value={projectData.estimatedCost} />
            <InfoCard icon={Clock3} label="Estimasi Durasi" value={projectData.estimatedDuration} />
            <InfoCard icon={CalendarDays} label="Target Selesai" value={projectData.estimatedFinish} />
            <InfoCard icon={PackageCheck} label="Jenis Proyek" value={projectData.type} />
          </div>

          <div className="mt-5">
            <h3 className="text-[15px] font-semibold text-[#31332C]">Rincian Anggaran Transparan</h3>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E8E2D9]">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#FCFBF9] border-b border-[#E8E2D9] text-[#7B756E] font-medium">
                    <th className="p-3">Komponen Biaya</th>
                    <th className="p-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9] text-[#31332C]">
                  <tr>
                    <td className="p-3">Jasa Pembuatan & Material (Vendor Partner)</td>
                    <td className="p-3 text-right font-medium">
                      {customerRab 
                        ? formatRupiah(parseRupiah(customerRab.grand_total) - parseRupiah(customerRab.vmatch_service_fee))
                        : projectData.estimatedCost}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">Biaya Layanan & Jaminan Pengawasan Mutu (VMatch)</td>
                    <td className="p-3 text-right font-medium">{customerRab ? customerRab.vmatch_service_fee : "Rp0"}</td>
                  </tr>
                  <tr className="bg-[#F8F6F2] font-bold text-[#725F54]">
                    <td className="p-3">Total Anggaran Proyek (RAB)</td>
                    <td className="p-3 text-right">
                      {customerRab ? customerRab.grand_total : projectData.estimatedCost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-[#7B756E]">
              * Seluruh biaya di atas sudah mencakup proses quality control (QC) berkala oleh tim VMatch, jaminan garansi pasca-selesai, dan perlindungan pembayaran termin aman (escrow).
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Catatan dari VMatch
            </p>
            <p className="mt-2 text-[13px] leading-7 text-[#6F6860]">
              Estimasi rincian di atas telah disesuaikan dengan brief Anda. Jika ada perubahan detail pengerjaan, nominal final dapat disesuaikan kembali melalui revisi RAB.
            </p>
          </div>

          {!isApproved && !isRevision && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5A4A42]"
              >
                <CheckCircle2 size={16} />
                Setujui RAB
              </button>
              <button
                type="button"
                onClick={onRequestRevision}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] px-5 text-[13px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
              >
                <PencilLine size={16} />
                Minta Revisi
              </button>
            </div>
          )}

          {isApproved && (
            <div className="mt-5 rounded-xl border border-[#DCEBDD] bg-[#F5FAF6] px-4 py-3">
              <p className="text-[13px] font-semibold text-[#4F7A5F]">
                RAB sudah disetujui — Tim VMatch akan segera memproses invoice pembayaran pertama.
              </p>
            </div>
          )}

          {isRevision && (
            <div className="mt-5 rounded-xl border border-[#E8D6BE] bg-[#FFF8ED] px-4 py-3">
              <p className="text-[13px] font-semibold text-[#8A5A24]">
                Permintaan revisi sudah dikirim. Tim VMatch akan menghubungi Anda untuk konfirmasi.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProgressTab({
  projectData,
  projectDone,
  progressLogs,
  progressTimeline,
  workSchedules,
  materialStatus,
  materialDetails,
  revisions,
  qcStatus,
  qcChecklistData,
  onApproveMaterial,
  onRequestMaterialChange,
  onCreateRevision,
  onCreateQCNote,
  onApproveQC,
}: {
  projectData: ProjectItem;
  projectDone: boolean;
  progressLogs: DBProgressLog[];
  progressTimeline: { title: string; status: string; desc: string }[];
  workSchedules: { label: string; date: string }[];
  materialStatus: string;
  materialDetails: { part: string; material: string }[];
  revisions: Revision[];
  qcStatus: QCStatus;
  qcChecklistData: DBQcChecklist | null;
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
              Laporan pengerjaan harian langsung dari vendor partner di lapangan. 
              Semua detail pekerjaan, rencana kelanjutan, serta dokumentasi foto dilampirkan secara transparan di bawah ini.
            </p>

            <div className="mt-4 space-y-4">
              {progressLogs.length > 0 ? (
                progressLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-[#E8E2D9] p-4 bg-[#FCFBF9] space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D9]">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          log.status === "Sesuai Jadwal" 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : log.status === "Ada Kendala" 
                              ? "bg-red-50 text-red-700 border border-red-200" 
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[13px] font-bold text-[#725F54]">
                          Progres {log.progress_percent}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9A8F86]">
                        {new Date(log.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A8F86]">Ringkasan Pekerjaan</p>
                      <p className="mt-1 text-[13px] text-[#31332C] leading-relaxed">{log.work_summary}</p>
                    </div>

                    {log.next_plan && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A8F86]">Rencana Selanjutnya</p>
                        <p className="mt-1 text-[13px] text-[#6F6860] leading-relaxed">{log.next_plan}</p>
                      </div>
                    )}

                    {log.status === "Ada Kendala" && log.issue && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">Kendala Dilaporkan</p>
                        <p className="mt-1 text-[13px] text-red-700 font-medium leading-relaxed">{log.issue}</p>
                      </div>
                    )}

                    {log.photo_path && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A8F86] mb-1.5">Dokumentasi Foto</p>
                        <div className="max-w-[280px]">
                          <VendorPhoto
                            label={log.photo_label || "Update Progress"}
                            path={log.photo_path}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#E4D8CD] bg-[#FCFBF9] p-8 text-center text-[#7B756E]">
                  Belum ada laporan progress dari vendor.
                </div>
              )}
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
                  onClick={() => toast.info("Buka halaman Konsultasi untuk mendiskusikan material.")}
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
              {(qcChecklistData?.items || qcChecklist.map((l) => ({ label: l, completed: false }))).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-[18px] border border-[#EFE7DD] bg-[#FCFBF9] p-4"
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${item.completed ? "bg-[#725F54] text-white" : "border border-[#DCCBBC] bg-transparent text-transparent"}`}>
                    <Check size={14} />
                  </span>
                  <p className={`text-[13px] font-medium ${item.completed ? "text-[#31332C]" : "text-[#7B756E]"}`}>
                    {item.label}
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
  const handleDownload = (doc: DocumentItem) => {
    if (typeof window === "undefined") return;
    const element = window.document.createElement("a");
    const file = new Blob([`${doc.title}\nKategori: ${doc.category}\nStatus: ${doc.status}\nTanggal: ${doc.date}\n\nDeskripsi:\n${doc.description}\n\nDokumen resmi VMatch System.`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/\s+/g, "_")}.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
    toast.success(`Mengunduh ${doc.title}...`);
  };

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
                    onClick={() => handleDownload(document)}
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
    lower.includes("terbayar") ||
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

function VendorPhoto({ label, path }: { label: string; path: string }) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vmatch-files/${path}`;
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-[16px] border border-[#E8E2D9] bg-[#FCFBF9]">
      <img
        src={url}
        alt={label}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[12px] font-semibold text-white drop-shadow-md">
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
  submitting,
}: {
  onClose: () => void;
  onSubmit: (data: { type: string; description: string }) => void;
  submitting?: boolean;
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
            disabled={submitting}
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
            disabled={submitting}
            rows={5}
            className={textareaClass}
            placeholder="Contoh: ingin menambah rak lipat di bagian kanan wardrobe."
          />
        </Field>

        <ModalActions
          onClose={onClose}
          onSubmit={() => onSubmit({ type, description })}
          submitLabel="Kirim Revisi"
          disabled={submitting}
        />
      </div>
    </BaseModal>
  );
}

function PaymentModal({
  invoice,
  onClose,
  onSuccess,
  submitting,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
  submitting?: boolean;
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
          disabled={submitting}
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
              Pembayaran Terbayar
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
  projectData,
  invoices,
  progressLogs,
  qcChecklistData,
  customerRab,
  onClose,
}: {
  document: DocumentItem;
  projectData: ProjectItem;
  invoices: Invoice[];
  progressLogs: DBProgressLog[];
  qcChecklistData: DBQcChecklist | null;
  customerRab: DBRab | null;
  onClose: () => void;
}) {
  const isBrief = document.category === "Brief Proyek";
  const isSolution = document.category === "Solusi Proyek";
  const isInvoice = document.category === "Invoice";
  const isProgress = document.category === "Progress";
  const isQC = document.category === "QC";
  const isFinal = document.category === "Final Project";
  const isWarranty = document.category === "Garansi";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col rounded-2xl border border-[#E4D8CD] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] overflow-hidden">
        {/* Header */}
        <header className="border-b border-[#E8E2D9] bg-[#FCFBF9] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#725F54]">VMatch Document System</span>
            <h2 className="font-serif text-[22px] font-semibold text-[#31332C] mt-0.5">{document.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-[#7B756E] hover:bg-[#FCFBF9] hover:text-[#31332C] transition"
            aria-label="Tutup preview"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#31332C]">
          {/* Document Header Brand */}
          <div className="flex justify-between items-start border-b-2 border-double border-[#E8E2D9] pb-4">
            <div>
              <h3 className="font-serif text-[20px] font-bold text-[#725F54] tracking-tight">VMATCH</h3>
              <p className="text-[10px] text-[#7B756E] uppercase tracking-widest mt-0.5">Interior & Fit Out System</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[#31332C]">REF NO: VM-{document.id.toUpperCase()}-{projectData.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-[11px] text-[#7B756E] mt-0.5">Tanggal: {document.date}</p>
            </div>
          </div>

          {/* Render Document Content depending on Category */}
          {isBrief && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Spesifikasi Brief Proyek</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
                <DetailRow label="Nama Proyek" value={projectData.name} />
                <DetailRow label="Tipe Desain" value={projectData.designStyle} />
                <DetailRow label="Jenis Proyek" value={projectData.type} />
                <DetailRow label="Lokasi Proyek" value={projectData.location} />
                <DetailRow label="Ukuran Ruangan" value={projectData.roomSize} />
                <DetailRow label="Estimasi Anggaran" value={projectData.estimatedCost} />
                <DetailRow label="Status Saat Ini" value={projectData.status} />
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E2D9]">
                <h5 className="text-[12px] font-semibold text-[#725F54] mb-1">Catatan / Deskripsi Tambahan:</h5>
                <p className="text-[13px] leading-6 text-[#6F6860] bg-[#FCFBF9] p-3 rounded-xl border border-[#E8E2D9] whitespace-pre-wrap">
                  {projectData.notes || projectData.aiDescription || projectData.aiBriefSummary || projectData.solution || "Tidak ada catatan atau deskripsi."}
                </p>
              </div>
              {projectData.uploadedFiles && projectData.uploadedFiles.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E8E2D9]">
                  <h5 className="text-[12px] font-semibold text-[#725F54] mb-3">Foto / Referensi yang Diunggah:</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {projectData.uploadedFiles.map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl border border-[#E8E2D9] overflow-hidden bg-black/5 relative group cursor-pointer hover:border-[#31332C] transition-colors" onClick={() => window.open(url, '_blank')}>
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={url} alt={`Referensi ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isSolution && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Rekomendasi Solusi & Material VMatch</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
                <DetailRow label="Solusi Untuk" value={projectData.name} />
                <DetailRow label="Tipe Pengerjaan" value={projectData.type} />
                <DetailRow label="Estimasi Durasi" value={projectData.startDate !== "Menunggu jadwal" && projectData.estimatedFinish !== "Menunggu jadwal" ? "2 Bulan" : "Menunggu jadwal"} />
                <DetailRow label="Estimasi Mulai" value={projectData.startDate} />
                <DetailRow label="Estimasi Selesai" value={projectData.estimatedFinish} />
                <DetailRow label="Rencana Anggaran (RAB)" value={customerRab ? customerRab.grand_total : projectData.estimatedCost} />
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E2D9] space-y-3">
                <div>
                  <h5 className="text-[12px] font-semibold text-[#725F54] mb-1">Pendekatan Desain & Pengerjaan:</h5>
                  <p className="text-[13px] leading-6 text-[#6F6860] bg-[#FCFBF9] p-3 rounded-xl border border-[#E8E2D9]">
                    Fokus pengerjaan ditujukan untuk efisiensi ruang dengan gaya {projectData.designStyle || "Modern"}. Tim vendor menggunakan material ramah lingkungan berkualitas tinggi dengan pengawasan mutu 3-tahap (3-stage QC) dari tim VMatch.
                  </p>
                </div>
                <div>
                  <h5 className="text-[12px] font-semibold text-[#725F54] mb-1.5">Rekomendasi Material Utama:</h5>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FCFBF9] border border-[#E8E2D9]">
                      <span className="font-semibold text-[#725F54]">Kayu & Board:</span> Plywood/Blockboard 18mm
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FCFBF9] border border-[#E8E2D9]">
                      <span className="font-semibold text-[#725F54]">Finishing:</span> High Pressure Laminate (HPL) Matte
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FCFBF9] border border-[#E8E2D9]">
                      <span className="font-semibold text-[#725F54]">Fitting:</span> Rel Laci Tandem & Engsel Soft-Close
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FCFBF9] border border-[#E8E2D9]">
                      <span className="font-semibold text-[#725F54]">Edging:</span> PVC Edging sewarna HPL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isInvoice && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Daftar Invoice Pembayaran</h4>
              {invoices.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-[#E8E2D9]">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-[#FCFBF9] border-b border-[#E8E2D9] text-[#7B756E] font-medium">
                        <th className="p-3">Deskripsi Tagihan</th>
                        <th className="p-3 text-right">Nominal</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="p-3">
                            <p className="font-semibold text-[#31332C]">{inv.title}</p>
                            <p className="text-[11px] text-[#7B756E] mt-0.5">Jatuh Tempo: {inv.dueDate}</p>
                          </td>
                          <td className="p-3 text-right font-semibold text-[#31332C]">{inv.amount}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              inv.status === "Terbayar" || inv.status === "Lunas"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[13px] text-[#9A8F86] text-center py-6">Belum ada invoice yang diterbitkan untuk proyek ini.</p>
              )}
            </div>
          )}

          {isProgress && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Log Progress Aktual Pengerjaan</h4>
              {progressLogs.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {progressLogs.map((log) => (
                    <div key={log.id} className="relative pl-6 border-l-2 border-[#E8E2D9]">
                      <div className="absolute -left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#725F54] ring-4 ring-white" />
                      <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4 text-[13px]">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#725F54]">Progress: {log.progress_percent}%</span>
                          <span className="text-[11px] text-[#7B756E]">{formatIndoDate(log.log_date)}</span>
                        </div>
                        <p className="mt-2 text-[#31332C] leading-relaxed"><strong className="text-[12px] text-[#725F54]">Pekerjaan:</strong> {log.work_summary}</p>
                        {log.next_plan && <p className="mt-1 text-[#6F6860]"><strong className="text-[12px] text-[#725F54]">Rencana Selanjutnya:</strong> {log.next_plan}</p>}
                        {log.issue && <p className="mt-2 text-red-700 bg-red-50 p-2 rounded-lg border border-red-200"><strong className="text-[12px] text-red-800">Kendala:</strong> {log.issue}</p>}
                        {log.photo_path && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-[#E8E2D9] max-w-[240px]">
                            <img src={log.photo_path} alt="Progress dokumentasi" className="h-32 w-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#9A8F86] text-center py-6">Belum ada pembaruan log progres dari vendor.</p>
              )}
            </div>
          )}

          {isQC && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Checklist Pengawasan Mutu (Quality Control)</h4>
              <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
                <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3 mb-3 text-[13px]">
                  <span className="font-semibold text-[#31332C]">Status QC VMatch:</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                    qcChecklistData?.status === "Disetujui"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {qcChecklistData?.status || "Sedang Dicek"}
                  </span>
                </div>
                <div className="space-y-3">
                  {qcChecklist.map((item, idx) => {
                    // Check if item is completed
                    let isCompleted = false;
                    if (qcChecklistData?.items) {
                      const itemObj = qcChecklistData.items.find((i: any) => i.label === item || i.id === `qc-${idx}`);
                      isCompleted = itemObj ? itemObj.completed : (qcChecklistData.status === "Disetujui");
                    } else if (qcChecklistData?.status === "Disetujui") {
                      isCompleted = true;
                    }
                    return (
                      <div key={idx} className="flex items-center gap-3 text-[13px]">
                        <CheckCircle2 size={16} className={isCompleted ? "text-green-600 shrink-0" : "text-gray-300 shrink-0"} />
                        <span className={isCompleted ? "text-[#31332C] font-medium" : "text-[#7B756E]"}>{item}</span>
                      </div>
                    );
                  })}
                </div>
                {qcChecklistData?.customer_note && (
                  <div className="mt-4 pt-3 border-t border-[#E8E2D9] text-[12px]">
                    <strong className="text-[#725F54]">Catatan dari Klien:</strong>
                    <p className="mt-1 text-[#6F6860] bg-white p-2.5 rounded-lg border border-[#E8E2D9]">{qcChecklistData.customer_note}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {isFinal && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Berita Acara Serah Terima (BAST)</h4>
              <div className="rounded-xl border-2 border-dashed border-[#E8E2D9] bg-[#FFFDF9] p-5 text-[13px] space-y-4">
                <div className="text-center space-y-1">
                  <h5 className="font-serif text-[16px] font-bold text-[#725F54]">SURAT PERNYATAAN SERAH TERIMA PEKERJAAN</h5>
                  <p className="text-[11px] text-[#7B756E]">Nominal Final: {customerRab ? customerRab.grand_total : projectData.estimatedCost}</p>
                </div>
                <p className="leading-6 text-[#6F6860]">
                  Pada hari ini, dengan ditandatanganinya berita acara ini, pekerjaan konstruksi fit-out untuk <strong>{projectData.name}</strong> dinyatakan telah <strong>SELESAI 100%</strong> dengan hasil inspeksi mutu baik dan siap digunakan. Tanggung jawab perawatan secara penuh berpindah ke tangan pemilik proyek, dilindungi oleh Jaminan Garansi VMatch.
                </p>
                <div className="grid grid-cols-2 pt-4 border-t border-[#E8E2D9] text-center gap-4">
                  <div className="space-y-8">
                    <p className="text-[12px] font-semibold text-[#725F54]">Pihak Pertama (VMatch & Vendor)</p>
                    <p className="font-serif font-bold text-[#31332C] underline decoration-[#725F54]">Andi Interior Partner</p>
                  </div>
                  <div className="space-y-8">
                    <p className="text-[12px] font-semibold text-[#725F54]">Pihak Kedua (Klien / Customer)</p>
                    <p className="font-serif font-bold text-[#31332C] underline decoration-[#725F54]">{projectData.status === "Selesai" || qcChecklistData?.customer_approved_at ? "Klien Terverifikasi" : "Menunggu Tanda Tangan"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isWarranty && (
            <div className="space-y-4">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#725F54] border-b border-[#E8E2D9] pb-1">Sertifikat Garansi Mutu VMatch</h4>
              <div className="rounded-2xl border-4 border-double border-[#D9C8BA] bg-[#FFFDF9] p-5 text-center space-y-4">
                <span className="inline-block rounded-full bg-[#EFE7DD] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#725F54]">
                  Official Warranty Certificate
                </span>
                <div className="space-y-1">
                  <h5 className="font-serif text-[22px] font-bold text-[#725F54]">JAMINAN PEMELIHARAAN INTERIOR</h5>
                  <p className="text-[12px] text-[#7B756E]">No Sertifikat: W-VM-{projectData.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="max-w-[420px] mx-auto text-[13px] leading-6 text-[#6F6860] border-t border-b border-[#E8E2D9] py-3 my-2">
                  Sertifikat ini menjamin bahwa pekerjaan <strong>{projectData.name}</strong> bebas dari cacat pengerjaan atau kelalaian material selama masa pemeliharaan <strong>3 Bulan</strong> terhitung sejak tanggal serah terima pekerjaan.
                </div>
                <div className="grid grid-cols-2 text-center text-[12px] gap-2 max-w-[320px] mx-auto">
                  <div>
                    <span className="text-[#7B756E] block">Masa Berlaku:</span>
                    <strong className="text-[#31332C] font-semibold">90 Hari Kalender</strong>
                  </div>
                  <div>
                    <span className="text-[#7B756E] block">Status Garansi:</span>
                    <strong className="text-green-700 font-bold uppercase">AKTIF</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E8E2D9] bg-[#FCFBF9] px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] hover:bg-white transition"
          >
            Tutup Preview
          </button>
        </footer>
      </div>
    </div>
  );
}

function SimpleTextModal({
  title,
  description,
  placeholder,
  submitLabel,
  onClose,
  onSubmit,
  submitting,
}: {
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
  submitting?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <BaseModal title={title} description={description} onClose={onClose}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={submitting}
        rows={5}
        className={textareaClass}
        placeholder={placeholder}
      />

      <ModalActions
        onClose={onClose}
        onSubmit={() => onSubmit(value)}
        submitLabel={submitLabel}
        disabled={submitting}
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
  submitting,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
}) {
  return (
    <BaseModal title={title} description={description} onClose={onClose}>
      <p className="text-[13px] leading-6 text-[#6F6860] mb-4">
        {description}
      </p>
      <ModalActions
        onClose={onClose}
        onSubmit={onConfirm}
        submitLabel={confirmLabel}
        disabled={submitting}
      />
    </BaseModal>
  );
}

function WarrantyClaimModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (claim: {
    issueType: string;
    description: string;
    incidentDate: string;
  }) => void;
  submitting?: boolean;
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
            disabled={submitting}
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
            disabled={submitting}
            className={fieldClass}
          />
        </Field>

        <Field label="Deskripsi masalah">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={submitting}
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
          disabled={submitting}
        />
      </div>
    </BaseModal>
  );
}

function ModalActions({
  onClose,
  onSubmit,
  submitLabel,
  disabled,
}: {
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className="h-11 rounded-[16px] border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Batal
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="h-11 rounded-[16px] bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Mengirim..." : submitLabel}
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
      status: isWaiting ? "Belum Tersedia" : "Terbayar",
      dueDate: "18 Juni 2026",
      receiptNo: isWaiting ? undefined : "VMR-2026-0001",
    },
    {
      id: "inv-2",
      title: "Pembayaran Tahap 2",
      amount: "Rp8.000.000",
      stage: "Sebelum produksi final",
      method: "Virtual Account Midtrans",
      status: isDone ? "Terbayar" : "Menunggu Pembayaran",
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

function mapDbInvoiceToLocalInvoice(invoice: DBInvoice): Invoice {
  return {
    id: invoice.id,
    title: invoice.project_title,
    amount: invoice.total_amount,
    stage: invoice.payment_stage || "Tahap pembayaran",
    method: invoice.payment_method || "Virtual Account Midtrans",
    status: (invoice.status as PaymentStatus) || "Belum Tersedia",
    dueDate: invoice.due_date || "-",
    receiptNo: invoice.paid_at ? invoice.invoice_number : undefined,
  };
}

function mapDbWarrantyToLocalWarranty(claim: DBWarrantyClaim): WarrantyClaim {
  return {
    id: claim.id,
    issueType: claim.issue_type,
    description: claim.description,
    incidentDate: claim.incident_date,
    status: (claim.status as WarrantyClaim["status"]) || "Klaim Diajukan",
  };
}

function parseRupiah(val: string | null | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

function formatRupiah(num: number): string {
  return "Rp" + num.toLocaleString("id-ID");
}

function formatIndoDate(dateStr: string): string {
  if (!dateStr || dateStr === "Menunggu jadwal") return "Menunggu jadwal";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function createProgressTimeline(
  projectData: ProjectItem,
  projectDone: boolean,
  logs: DBProgressLog[],
) {

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

  const prodStatus = projectData.progress >= 100 ? "Selesai" : projectData.progress > 0 ? "Berjalan" : "Terjadwal";
  const instStatus = projectData.progress >= 100 ? "Berjalan" : "Terjadwal";

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
      status: prodStatus,
      desc: `Pengerjaan ${projectData.type} sedang berjalan.`,
    },
    {
      title: "Instalasi",
      status: instStatus,
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
    const end = projectData.estimatedFinish !== "Menunggu jadwal" ? formatIndoDate(projectData.estimatedFinish) : "Selesai";
    return [
      { label: "Survey lokasi", date: projectData.startDate !== "Menunggu jadwal" ? formatIndoDate(projectData.startDate) : "Selesai" },
      { label: "Produksi / pengerjaan", date: projectData.startDate !== "Menunggu jadwal" ? `${formatIndoDate(projectData.startDate)} s/d ${end}` : "Selesai" },
      { label: "Instalasi", date: end },
      { label: "QC & serah terima", date: end },
    ];
  }

  if (projectData.filter === "menunggu") {
    return [
      { label: "Review solusi", date: "Menunggu persetujuan" },
      { label: "Pembayaran awal", date: "Setelah solusi disetujui" },
      { label: "Penjadwalan vendor", date: "Belum dijadwalkan" },
    ];
  }

  if (projectData.startDate !== "Menunggu jadwal") {
    const end = projectData.estimatedFinish !== "Menunggu jadwal" ? formatIndoDate(projectData.estimatedFinish) : "Menunggu jadwal";
    return [
      { label: "Survey lokasi", date: formatIndoDate(projectData.startDate) },
      { label: "Produksi furniture", date: `${formatIndoDate(projectData.startDate)} s/d ${end}` },
      { label: "Instalasi", date: end },
      { label: "QC & Serah Terima", date: "Dikonfirmasi setelah instalasi" },
    ];
  }

  return [
    { label: "Survey lokasi", date: "Menunggu penjadwalan survey" },
    { label: "Produksi furniture", date: "Menunggu jadwal produksi" },
    { label: "Instalasi", date: "Menunggu jadwal instalasi" },
    { label: "QC", date: "Menunggu jadwal QC" },
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
  invoices: Invoice[],
  progressLogs: DBProgressLog[],
  qcChecklistData: DBQcChecklist | null,
): DocumentItem[] {
  const dateStr = projectData.createdAt ? formatIndoDate(projectData.createdAt) : "Terbaru";

  const allDocs: DocumentItem[] = [
    {
      id: "doc-1",
      title: `Brief Proyek ${projectData.name}`,
      category: "Brief Proyek",
      status: "Tersedia",
      date: dateStr,
      description:
        "Berisi kebutuhan awal customer, referensi desain, budget, lokasi, dan catatan proyek.",
    },
    {
      id: "doc-2",
      title: "Solusi Awal VMatch",
      category: "Solusi Proyek",
      status: ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status) ? "Belum tersedia" : "Tersedia",
      date: dateStr,
      description:
        "Berisi solusi awal, estimasi, material rekomendasi, dan langkah pengerjaan.",
    },
    {
      id: "doc-3",
      title: "Invoice Proyek",
      category: "Invoice",
      status: invoices.length > 0 ? "Tersedia" : "Belum tersedia",
      date: invoices[0]?.dueDate ? formatIndoDate(invoices[0].dueDate) : "-",
      description: "Dokumen tagihan pembayaran proyek.",
    },
    {
      id: "doc-4",
      title: "Log Progress Proyek",
      category: "Progress",
      status: progressLogs.length > 0 ? "Tersedia" : "Belum tersedia",
      date: progressLogs[0]?.log_date ? formatIndoDate(progressLogs[0].log_date) : "-",
      description: "Dokumen pembaruan pengerjaan dari vendor dan tim VMatch.",
    },
    {
      id: "doc-5",
      title: "Checklist QC",
      category: "QC",
      status: qcChecklistData ? "Tersedia" : "Belum tersedia",
      date: qcChecklistData?.updated_at ? formatIndoDate(qcChecklistData.updated_at) : "-",
      description: "Checklist quality control proyek.",
    },
    {
      id: "doc-6",
      title: "Dokumen Final",
      category: "Final Project",
      status: projectDone ? "Tersedia" : "Belum tersedia",
      date: projectDone && projectData.estimatedFinish !== "Menunggu jadwal" ? formatIndoDate(projectData.estimatedFinish) : "-",
      description:
        "Dokumen final proyek setelah pekerjaan selesai dan disetujui customer.",
    },
    {
      id: "doc-7",
      title: "Dokumen Garansi",
      category: "Garansi",
      status: warrantyActive ? "Tersedia" : "Belum tersedia",
      date: warrantyActive && projectData.estimatedFinish !== "Menunggu jadwal" ? formatIndoDate(projectData.estimatedFinish) : "-",
      description:
        "Dokumen garansi yang aktif setelah proyek selesai dan QC disetujui.",
    },
  ];

  const isReq = ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status);
  if (isReq) {
    return allDocs.filter(doc => doc.status === "Tersedia");
  }
  return allDocs;
}
