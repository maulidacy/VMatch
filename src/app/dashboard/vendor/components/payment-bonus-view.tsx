"use client";

import { useMemo, useState } from "react";
import {
    ChevronDown,
    CircleDollarSign,
    Gift,
    Wallet,
} from "lucide-react";

import { bonusInfos, paymentMilestones, vendorProjects } from "../mock-data";
import {
    VendorChecklistItem,
    VendorEmptyState,
    VendorListRow,
    VendorSectionCard,
    VendorStatusBadge,
} from "./shared";

export function PaymentBonusView() {
    const [selectedProjectId, setSelectedProjectId] = useState(
        vendorProjects[0]?.id ?? "",
    );

    const selectedProject = vendorProjects.find(
        (project) => project.id === selectedProjectId,
    );

    const selectedPayments = useMemo(() => {
        return paymentMilestones.filter(
            (payment) => payment.projectId === selectedProjectId,
        );
    }, [selectedProjectId]);

    const selectedBonus = bonusInfos.find(
        (bonus) => bonus.projectId === selectedProjectId,
    );

    const totalPayment = selectedPayments.length;
    const paidPayment = selectedPayments.filter(
        (payment) => payment.status === "Dibayarkan",
    ).length;

    return (
        <div className="w-full space-y-6">
            <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B756E]">
                        Payment & Bonus
                    </p>

                    <h1 className="mt-2 font-serif text-[34px] leading-tight text-[#31332C] sm:text-[42px]">
                        Pembayaran & Bonus
                    </h1>

                    <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#7B756E]">
                        Pantau tahap pembayaran proyek dan potensi bonus vendor secara ringkas.
                    </p>
                </div>

                <div className="w-full lg:max-w-[340px]">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                        Pilih Proyek
                    </label>

                    <div className="relative">
                        <select
                            value={selectedProjectId}
                            onChange={(event) => setSelectedProjectId(event.target.value)}
                            className="h-12 w-full appearance-none rounded-xl border border-[#E4D8CD] bg-white pl-4 pr-12 text-[14px] font-medium text-[#31332C] outline-none transition focus:border-[#725F54] focus:ring-2 focus:ring-[#725F54]/10"
                        >
                            {vendorProjects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7B756E]"
                        />
                    </div>
                </div>
            </section>

            {selectedProject && (
                <section className="flex flex-col gap-3 rounded-2xl border border-[#E8E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                            Proyek Dipilih
                        </p>

                        <h2 className="mt-1 truncate text-[15px] font-semibold text-[#31332C]">
                            {selectedProject.name}
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <VendorStatusBadge status={selectedProject.status} />

                        <span className="rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-1.5 text-[11px] font-semibold text-[#7B756E]">
                            {paidPayment}/{totalPayment} tahap pembayaran selesai
                        </span>

                        <span className="rounded-full border border-[#E8E2D9] bg-[#FCFBF9] px-3 py-1.5 text-[11px] font-semibold text-[#7B756E]">
                            Deadline {selectedProject.deadline}
                        </span>
                    </div>
                </section>
            )}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <VendorSectionCard
                    title="Tahap Pembayaran"
                    description="Pantau tahap pembayaran vendor berdasarkan progress proyek."
                >
                    {selectedPayments.length > 0 ? (
                        <div className="grid gap-3">
                            {selectedPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="rounded-2xl border border-[#E8E2D9] bg-white p-4"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h3 className="text-[14px] font-semibold text-[#31332C]">
                                                {payment.title}
                                            </h3>

                                            <p className="mt-1 text-[12px] leading-5 text-[#7B756E]">
                                                {payment.dueInfo}
                                            </p>
                                        </div>

                                        <VendorStatusBadge status={payment.status} />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-[#E8E2D9] pt-3">
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#725F54]">
                                            Nominal
                                        </span>

                                        <span className="text-[14px] font-semibold text-[#31332C]">
                                            {payment.amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <VendorEmptyState
                            icon={Wallet}
                            title="Pembayaran belum tersedia"
                            description="Data tahap pembayaran proyek ini belum diterbitkan oleh VMatch."
                        />
                    )}
                </VendorSectionCard>

                <div className="space-y-5">
                    <VendorSectionCard
                        title="Potensi Bonus"
                        description="Bonus aktif jika syarat proyek terpenuhi."
                    >
                        {selectedBonus ? (
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-[#D9C8BA] bg-[#FFFDF9] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <VendorStatusBadge status={selectedBonus.status} />

                                        <span className="shrink-0 text-[13px] font-semibold text-[#725F54]">
                                            {selectedBonus.amount}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-[13px] leading-6 text-[#6F6860]">
                                        {selectedBonus.reason}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#725F54]">
                                        Syarat Bonus
                                    </p>

                                    <div className="space-y-2">
                                        {selectedBonus.requirements.map((item) => (
                                            <VendorChecklistItem
                                                key={item.label}
                                                label={item.label}
                                                completed={item.completed}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <VendorEmptyState
                                icon={Gift}
                                title="Bonus tidak tersedia"
                                description="Proyek ini belum masuk skema bonus."
                            />
                        )}
                    </VendorSectionCard>

                </div>
            </section>

            <VendorSectionCard title="Riwayat Pembayaran">
                {selectedPayments.length > 0 ? (
                    <div className="grid gap-3">
                        {selectedPayments.map((payment) => (
                            <VendorListRow
                                key={payment.id}
                                icon={CircleDollarSign}
                                title={payment.title}
                                description={payment.dueInfo}
                                meta={payment.projectName}
                                status={payment.status}
                                action={
                                    <span className="inline-flex h-8 items-center rounded-lg border border-[#E8E2D9] bg-[#FCFBF9] px-2.5 text-[11px] font-bold text-[#31332C]">
                                        {payment.amount}
                                    </span>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <VendorEmptyState
                        icon={CircleDollarSign}
                        title="Riwayat kosong"
                        description="Belum ada transaksi pada proyek ini."
                    />
                )}
            </VendorSectionCard>
        </div>
    );
}
