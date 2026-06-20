"use client";

import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Pencil,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

type BonusStatus =
  | "Menunggu Review"
  | "Disetujui"
  | "Ditolak"
  | "Masuk Payout"
  | "Dibayarkan";

type BonusRecommendation =
  | "Layak Bonus"
  | "Belum Layak Bonus"
  | "Perlu Review Admin";

type PayoutStatus =
  | "Belum Masuk Payout"
  | "Masuk Payout"
  | "Dibayarkan"
  | "Tidak Ada Bonus";

type BonusTab =
  | "Semua"
  | "Menunggu Review"
  | "Disetujui"
  | "Masuk Payout"
  | "Dibayarkan"
  | "Ditolak";

type VendorBonus = {
  id: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  category: string;
  vendorServiceFee: number;
  recommendedBonus: number;
  finalBonus: number;
  bonusRate: number;
  status: BonusStatus;
  qcPassed: boolean;
  onTime: boolean;
  documentationComplete: boolean;
  workMatchesBrief: boolean;
  workMatchesRAB: boolean;
  hasMajorComplaint: boolean;
  revisionCompleted: boolean;
  vendorResponsive: boolean;
  recommendation: BonusRecommendation;
  adminNote: string;
  payoutStatus: PayoutStatus;
  createdAt: string;
};

const vendorBonuses: VendorBonus[] = [
  {
    id: "bonus-1",
    vendorId: "vendor-1",
    vendorName: "Andi Interior Partner",
    projectId: "project-1",
    projectName: "Kitchen Set Modern Minimalis",
    category: "Kitchen Set",
    vendorServiceFee: 10000000,
    recommendedBonus: 200000,
    finalBonus: 200000,
    bonusRate: 2,
    status: "Menunggu Review",
    qcPassed: true,
    onTime: true,
    documentationComplete: true,
    workMatchesBrief: true,
    workMatchesRAB: true,
    hasMajorComplaint: false,
    revisionCompleted: true,
    vendorResponsive: true,
    recommendation: "Layak Bonus",
    adminNote:
      "Vendor menyelesaikan pekerjaan tepat waktu, dokumentasi lengkap, dan hasil QC sesuai standar VMatch.",
    payoutStatus: "Belum Masuk Payout",
    createdAt: "2026-06-21",
  },
  {
    id: "bonus-2",
    vendorId: "vendor-2",
    vendorName: "Nusa Custom Interior",
    projectId: "project-2",
    projectName: "Wardrobe Kamar Utama",
    category: "Wardrobe",
    vendorServiceFee: 8500000,
    recommendedBonus: 0,
    finalBonus: 0,
    bonusRate: 0,
    status: "Ditolak",
    qcPassed: true,
    onTime: false,
    documentationComplete: true,
    workMatchesBrief: true,
    workMatchesRAB: true,
    hasMajorComplaint: false,
    revisionCompleted: true,
    vendorResponsive: true,
    recommendation: "Belum Layak Bonus",
    adminNote:
      "Pekerjaan selesai dan QC lolos, tetapi melewati timeline yang disepakati.",
    payoutStatus: "Tidak Ada Bonus",
    createdAt: "2026-06-19",
  },
];

const bonusTabs: BonusTab[] = [
  "Semua",
  "Menunggu Review",
  "Disetujui",
  "Masuk Payout",
  "Dibayarkan",
  "Ditolak",
];

function formatCurrency(value: number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}

function parseCurrency(value: string) {
  const numeric = value.replace(/[^\d]/g, "");
  return Number(numeric || 0);
}

function getRecommendedBonus(vendorServiceFee: number) {
  return Math.round(vendorServiceFee * 0.02);
}

function getRecommendation(bonus: VendorBonus): BonusRecommendation {
  const eligible =
    bonus.qcPassed &&
    bonus.onTime &&
    bonus.documentationComplete &&
    bonus.workMatchesBrief &&
    bonus.workMatchesRAB &&
    !bonus.hasMajorComplaint;

  const needsAdminReview =
    bonus.revisionCompleted === false || bonus.vendorResponsive === false;

  if (eligible && !needsAdminReview) return "Layak Bonus";
  if (needsAdminReview) return "Perlu Review Admin";
  return "Belum Layak Bonus";
}

function countPassedIndicators(bonus: VendorBonus) {
  const checks = [
    bonus.qcPassed,
    bonus.onTime,
    bonus.documentationComplete,
    bonus.workMatchesBrief,
    bonus.workMatchesRAB,
    !bonus.hasMajorComplaint,
    bonus.revisionCompleted,
    bonus.vendorResponsive,
  ];

  return checks.filter(Boolean).length;
}

function matchBonusTab(bonus: VendorBonus, tab: BonusTab) {
  if (tab === "Semua") return true;
  return bonus.status === tab;
}

export function VendorBonusView() {
  const [bonuses, setBonuses] = useState<VendorBonus[]>(vendorBonuses);
  const [activeTab, setActiveTab] = useState<BonusTab>("Semua");
  const [keyword, setKeyword] = useState("");
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);
  const [finalBonusDraft, setFinalBonusDraft] = useState("");
  const [adminNoteDraft, setAdminNoteDraft] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const filteredBonuses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return bonuses.filter((bonus) => {
      const matchTab = matchBonusTab(bonus, activeTab);

      const matchKeyword =
        normalizedKeyword.length === 0 ||
        bonus.vendorName.toLowerCase().includes(normalizedKeyword) ||
        bonus.projectName.toLowerCase().includes(normalizedKeyword) ||
        bonus.category.toLowerCase().includes(normalizedKeyword) ||
        bonus.status.toLowerCase().includes(normalizedKeyword) ||
        bonus.recommendation.toLowerCase().includes(normalizedKeyword);

      return matchTab && matchKeyword;
    });
  }, [activeTab, bonuses, keyword]);

  const selectedBonus = useMemo(() => {
    if (!selectedBonusId) return null;
    return bonuses.find((bonus) => bonus.id === selectedBonusId) ?? null;
  }, [bonuses, selectedBonusId]);

  const summary = useMemo(() => {
    const waiting = bonuses.filter((bonus) => bonus.status === "Menunggu Review").length;
    const approved = bonuses.filter((bonus) => bonus.status === "Disetujui").length;
    const payout = bonuses.filter((bonus) => bonus.status === "Masuk Payout").length;
    const totalThisMonth = bonuses.reduce((total, bonus) => {
      if (
        bonus.status === "Disetujui" ||
        bonus.status === "Masuk Payout" ||
        bonus.status === "Dibayarkan"
      ) {
        return total + bonus.finalBonus;
      }

      return total;
    }, 0);

    return { waiting, approved, payout, totalThisMonth };
  }, [bonuses]);

  const openDetail = (bonus: VendorBonus) => {
    setSelectedBonusId(bonus.id);
    setFinalBonusDraft(formatCurrency(bonus.finalBonus));
    setAdminNoteDraft(bonus.adminNote);
    setIsSaved(false);
  };

  const closeDetail = () => {
    setSelectedBonusId(null);
    setFinalBonusDraft("");
    setAdminNoteDraft("");
    setIsSaved(false);
  };

  const updateBonus = (id: string, updater: (bonus: VendorBonus) => VendorBonus) => {
    setBonuses((current) =>
      current.map((bonus) => (bonus.id === id ? updater(bonus) : bonus)),
    );
  };

  const saveBonusReview = () => {
    if (!selectedBonus) return;

    updateBonus(selectedBonus.id, (bonus) => ({
      ...bonus,
      finalBonus: parseCurrency(finalBonusDraft),
      adminNote: adminNoteDraft,
    }));

    setIsSaved(true);
  };

  const approveBonus = () => {
    if (!selectedBonus) return;

    updateBonus(selectedBonus.id, (bonus) => {
      const finalBonus = parseCurrency(finalBonusDraft);

      return {
        ...bonus,
        finalBonus,
        recommendedBonus: getRecommendedBonus(bonus.vendorServiceFee),
        bonusRate: finalBonus > 0 ? 2 : 0,
        status: "Disetujui",
        payoutStatus: "Belum Masuk Payout",
        recommendation: getRecommendation(bonus),
        adminNote: adminNoteDraft,
      };
    });

    setActiveTab("Disetujui");
    setIsSaved(true);
  };

  const rejectBonus = () => {
    if (!selectedBonus) return;

    updateBonus(selectedBonus.id, (bonus) => ({
      ...bonus,
      finalBonus: 0,
      bonusRate: 0,
      status: "Ditolak",
      payoutStatus: "Tidak Ada Bonus",
      recommendation: getRecommendation(bonus),
      adminNote: adminNoteDraft || "Bonus ditolak setelah review admin VMatch.",
    }));

    setFinalBonusDraft("Rp0");
    setActiveTab("Ditolak");
    setIsSaved(true);
  };

  const addToPayout = () => {
    if (!selectedBonus) return;

    updateBonus(selectedBonus.id, (bonus) => ({
      ...bonus,
      status: "Masuk Payout",
      payoutStatus: "Masuk Payout",
      adminNote: adminNoteDraft,
    }));

    setActiveTab("Masuk Payout");
  };

  const markAsPaid = () => {
    if (!selectedBonus) return;

    updateBonus(selectedBonus.id, (bonus) => ({
      ...bonus,
      status: "Dibayarkan",
      payoutStatus: "Dibayarkan",
      adminNote: adminNoteDraft,
    }));

    setActiveTab("Dibayarkan");
  };

  if (selectedBonus) {
    return (
      <VendorBonusDetail
        bonus={selectedBonus}
        finalBonusDraft={finalBonusDraft}
        adminNoteDraft={adminNoteDraft}
        isSaved={isSaved}
        onBack={closeDetail}
        onChangeFinalBonus={(value) => {
          setFinalBonusDraft(value);
          setIsSaved(false);
        }}
        onChangeAdminNote={(value) => {
          setAdminNoteDraft(value);
          setIsSaved(false);
        }}
        onSave={saveBonusReview}
        onApprove={approveBonus}
        onReject={rejectBonus}
        onAddToPayout={addToPayout}
        onMarkAsPaid={markAsPaid}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="pb-1">
        <div className="max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#725F54]">
            Bonus Vendor
          </p>

          <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
            Vendor Payout & Bonus
          </h1>

          <p className="mt-2 text-[13px] leading-6 text-[#7B756E] sm:text-[14px]">
            Kelola bonus performa vendor berdasarkan hasil QC, ketepatan waktu,
            dokumentasi progress, kesesuaian pekerjaan, dan catatan komplain.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={ClipboardCheck}
          label="Menunggu Review"
          value={`${summary.waiting}`}
          description="Perlu keputusan admin"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Bonus Disetujui"
          value={`${summary.approved}`}
          description="Siap masuk payout"
        />
        <SummaryCard
          icon={Wallet}
          label="Masuk Payout"
          value={`${summary.payout}`}
          description="Dalam proses pembayaran"
        />
        <SummaryCard
          icon={Banknote}
          label="Total Bonus Bulan Ini"
          value={formatCurrency(summary.totalThisMonth)}
          description="Bonus disetujui dan dibayar"
        />
      </section>

      <section className="rounded-3xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3">
            <Search size={16} className="shrink-0 text-[#9A8F86]" />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari vendor, proyek, kategori, status, atau rekomendasi..."
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#31332C] outline-none placeholder:text-[#B8AEA5]"
            />
          </div>

          <div className="hidden rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-1.5 sm:block lg:col-span-2">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {bonusTabs.map((tab) => {
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

          <div className="grid gap-2 sm:hidden">
            {bonusTabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-10 rounded-xl border px-3 text-[12px] font-semibold transition ${
                    active
                      ? "border-[#725F54] bg-[#725F54] text-white"
                      : "border-[#E8E2D9] bg-[#FCFBF9] text-[#6F6860]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        {filteredBonuses.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {filteredBonuses.map((bonus) => (
              <VendorBonusCard
                key={bonus.id}
                bonus={bonus}
                onClick={() => openDetail(bonus)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center">
            <p className="text-[14px] font-semibold text-[#31332C]">
              Data bonus tidak ditemukan.
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

function VendorBonusDetail({
  bonus,
  finalBonusDraft,
  adminNoteDraft,
  isSaved,
  onBack,
  onChangeFinalBonus,
  onChangeAdminNote,
  onSave,
  onApprove,
  onReject,
  onAddToPayout,
  onMarkAsPaid,
}: {
  bonus: VendorBonus;
  finalBonusDraft: string;
  adminNoteDraft: string;
  isSaved: boolean;
  onBack: () => void;
  onChangeFinalBonus: (value: string) => void;
  onChangeAdminNote: (value: string) => void;
  onSave: () => void;
  onApprove: () => void;
  onReject: () => void;
  onAddToPayout: () => void;
  onMarkAsPaid: () => void;
}) {
  const passedCount = countPassedIndicators(bonus);
  const recommendation = getRecommendation(bonus);

  const canAddToPayout = bonus.status === "Disetujui" && bonus.finalBonus > 0;
  const canMarkAsPaid = bonus.status === "Masuk Payout" && bonus.finalBonus > 0;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
      >
        <ArrowLeft size={15} />
        Kembali ke daftar bonus
      </button>

      <section className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_12px_34px_rgba(49,51,44,0.035)]">
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#725F54]">
                Review Bonus Vendor
              </p>

              <BonusStatusBadge status={bonus.status} />
              <RecommendationBadge recommendation={recommendation} />
            </div>

            <h1 className="mt-3 max-w-[820px] font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
              {bonus.vendorName}
            </h1>

            <p className="mt-3 max-w-[860px] text-[13px] leading-7 text-[#7B756E] sm:text-[14px]">
              Bonus vendor direview oleh admin VMatch berdasarkan QC, ketepatan
              waktu, dokumentasi progress, kesesuaian brief/RAB, dan catatan
              komplain. Tidak menggunakan rating customer.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D9] bg-[#FCFBF9] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Rekomendasi Sistem
            </p>

            <p className="mt-2 text-[18px] font-semibold text-[#31332C]">
              {recommendation}
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
              {passedCount}/8 indikator performa terpenuhi.
            </p>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] bg-[#FCFBF9]/70 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              icon={PackageCheck}
              label="Proyek"
              value={bonus.projectName}
              description={bonus.category}
            />
            <InfoTile
              icon={Wallet}
              label="Jasa Vendor"
              value={formatCurrency(bonus.vendorServiceFee)}
              description="Nilai jasa vendor"
            />
            <InfoTile
              icon={Banknote}
              label="Bonus Final"
              value={formatCurrency(bonus.finalBonus)}
              description="Yang disetujui admin"
            />
            <InfoTile
              icon={FileText}
              label="Payout"
              value={bonus.payoutStatus}
              description={bonus.createdAt}
            />
          </div>
        </div>

        <div className="grid gap-0 border-t border-[#E8E2D9] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 border-b border-[#E8E2D9] p-5 sm:p-6 xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                  Checklist Penilaian Bonus
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                  Semua indikator dicek oleh admin VMatch dari hasil progress dan QC.
                </p>
              </div>

              <span className="w-fit rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-1 text-[11px] font-semibold text-[#725F54]">
                {passedCount}/8 terpenuhi
              </span>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <ChecklistItem label="QC lolos" passed={bonus.qcPassed} />
              <ChecklistItem label="Tepat waktu" passed={bonus.onTime} />
              <ChecklistItem
                label="Dokumentasi lengkap"
                passed={bonus.documentationComplete}
              />
              <ChecklistItem
                label="Sesuai brief"
                passed={bonus.workMatchesBrief}
              />
              <ChecklistItem label="Sesuai RAB" passed={bonus.workMatchesRAB} />
              <ChecklistItem
                label="Tidak ada komplain besar"
                passed={!bonus.hasMajorComplaint}
              />
              <ChecklistItem
                label="Revisi selesai"
                passed={bonus.revisionCompleted}
              />
              <ChecklistItem
                label="Vendor responsif"
                passed={bonus.vendorResponsive}
              />
            </div>
          </div>

          <aside className="min-w-0 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
              Review Admin
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
              Admin dapat mengedit nominal bonus sebelum masuk ke payout vendor.
            </p>

            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Nominal Bonus Final
              </span>

              <input
                value={finalBonusDraft}
                onChange={(event) => onChangeFinalBonus(event.target.value)}
                className="mt-3 h-11 w-full rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 text-[14px] font-semibold text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                Catatan Admin
              </span>

              <textarea
                spellCheck={false}
                value={adminNoteDraft}
                onChange={(event) => onChangeAdminNote(event.target.value)}
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-[#E4D8CD] bg-[#FCFBF9] px-4 py-3 text-[13px] leading-6 text-[#31332C] outline-none transition placeholder:text-[#B8AEA5] focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
              />
            </label>

            <button
              type="button"
              onClick={onSave}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition hover:border-[#725F54] hover:bg-[#725F54] hover:text-white"
            >
              <Pencil size={14} />
              {isSaved ? "Tersimpan" : "Simpan Catatan"}
            </button>
          </aside>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#725F54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42]"
        >
          <CheckCircle2 size={15} />
          Approve Bonus
        </button>

        <button
          type="button"
          onClick={onReject}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#9A4A32] transition hover:bg-[#FFF3EF]"
        >
          <XCircle size={15} />
          Tolak Bonus
        </button>

        <button
          type="button"
          onClick={onAddToPayout}
          disabled={!canAddToPayout}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-1 ${
            canAddToPayout
              ? "border-[#725F54] bg-white text-[#725F54] hover:bg-[#725F54] hover:text-white"
              : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
          }`}
        >
          <Wallet size={15} />
          Masukkan Payout
        </button>

        <button
          type="button"
          onClick={onMarkAsPaid}
          disabled={!canMarkAsPaid}
          className={`col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition sm:col-span-2 ${
            canMarkAsPaid
              ? "border-[#725F54] bg-white text-[#725F54] hover:bg-[#725F54] hover:text-white"
              : "cursor-not-allowed border-[#E8E2D9] bg-white text-[#B8AEA5]"
          }`}
        >
          <Banknote size={15} />
          Tandai Dibayarkan
        </button>
      </section>
    </div>
  );
}

function VendorBonusCard({
  bonus,
  onClick,
}: {
  bonus: VendorBonus;
  onClick: () => void;
}) {
  const passedCount = countPassedIndicators(bonus);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#E8E2D9] bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,51,44,0.025)] transition hover:border-[#725F54] hover:bg-[#FCFBF9]"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#31332C]">
            {bonus.vendorName}
          </p>

          <p className="mt-1 truncate text-[12px] text-[#7B756E]">
            {bonus.projectName}
          </p>
        </div>

        <BonusStatusBadge status={bonus.status} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <MiniMetric
          label="Kategori"
          value={bonus.category}
          icon={PackageCheck}
        />
        <MiniMetric
          label="Jasa Vendor"
          value={formatCurrency(bonus.vendorServiceFee)}
          icon={Wallet}
        />
        <MiniMetric
          label="Nominal Bonus"
          value={formatCurrency(bonus.finalBonus)}
          icon={Banknote}
        />
        <MiniMetric
          label="Indikator"
          value={`${passedCount}/8`}
          icon={ClipboardCheck}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <StatusLine label="Status QC" passed={bonus.qcPassed} />
        <StatusLine label="Ketepatan waktu" passed={bonus.onTime} />
        <StatusLine
          label="Dokumentasi progress"
          passed={bonus.documentationComplete}
        />
        <StatusLine
          label="Sesuai brief/RAB"
          passed={bonus.workMatchesBrief && bonus.workMatchesRAB}
        />
        <StatusLine
          label="Komplain besar"
          passed={!bonus.hasMajorComplaint}
          positiveText="Tidak ada"
          negativeText="Ada komplain"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <RecommendationBadge recommendation={bonus.recommendation} />

        <span className="inline-flex h-9 items-center justify-center rounded-xl border border-[#E4D8CD] bg-white px-4 text-[12px] font-semibold text-[#725F54] transition group-hover:border-[#725F54] group-hover:bg-[#725F54] group-hover:text-white">
          Review Bonus
        </span>
      </div>
    </button>
  );
}

function SummaryCard({
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
    <div className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_8px_24px_rgba(49,51,44,0.025)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
            {label}
          </p>

          <p className="mt-2 text-[22px] font-semibold text-[#31332C]">
            {value}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#7B756E]">
            {description}
          </p>
        </div>

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] text-[#725F54]">
          <Icon size={17} />
        </div>
      </div>
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

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] p-3">
      <div className="flex items-center gap-2 text-[#725F54]">
        <Icon size={14} />
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-[12px] font-semibold text-[#31332C]">
        {value}
      </p>
    </div>
  );
}

function ChecklistItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 ${
        passed
          ? "border-[#DCEBDD] bg-[#F5FAF6]"
          : "border-[#E6C7BD] bg-[#FFF3EF]"
      }`}
    >
      <div
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
          passed ? "bg-[#4F7A5F] text-white" : "bg-[#9A4A32] text-white"
        }`}
      >
        {passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      </div>

      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#31332C]">{label}</p>
        <p className="mt-0.5 text-[11px] text-[#7B756E]">
          {passed ? "Terpenuhi" : "Perlu review admin"}
        </p>
      </div>
    </div>
  );
}

function StatusLine({
  label,
  passed,
  positiveText = "Terpenuhi",
  negativeText = "Perlu review",
}: {
  label: string;
  passed: boolean;
  positiveText?: string;
  negativeText?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-2">
      <p className="min-w-0 truncate text-[11px] font-medium text-[#7B756E]">
        {label}
      </p>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          passed ? "bg-[#F5FAF6] text-[#4F7A5F]" : "bg-[#FFF3EF] text-[#9A4A32]"
        }`}
      >
        {passed ? positiveText : negativeText}
      </span>
    </div>
  );
}

function BonusStatusBadge({ status }: { status: BonusStatus }) {
  const style =
    status === "Menunggu Review"
      ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
      : status === "Disetujui"
        ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
        : status === "Masuk Payout"
          ? "border-[#D8E0ED] bg-[#F5F8FC] text-[#526B8A]"
          : status === "Dibayarkan"
            ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
            : "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]";

  return (
    <span
      className={`inline-flex h-7 max-w-full shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {status}
    </span>
  );
}

function RecommendationBadge({
  recommendation,
}: {
  recommendation: BonusRecommendation;
}) {
  const style =
    recommendation === "Layak Bonus"
      ? "border-[#DCEBDD] bg-[#F5FAF6] text-[#4F7A5F]"
      : recommendation === "Perlu Review Admin"
        ? "border-[#E8D6BE] bg-[#FFF8ED] text-[#8A5A24]"
        : "border-[#E6C7BD] bg-[#FFF3EF] text-[#9A4A32]";

  return (
    <span
      className={`inline-flex h-7 w-fit items-center rounded-full border px-3 text-[10px] font-semibold sm:text-[11px] ${style}`}
    >
      {recommendation}
    </span>
  );
}
