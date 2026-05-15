"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const REGISTER_IMAGE = "/figma/hero-kitchen.webp";

export default function RegisterPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <main className="min-h-[100dvh] bg-[#f7f4ef] text-[#31332c]">
            <div className="grid min-h-[100dvh] lg:grid-cols-[0.92fr_1.08fr]">
                <section className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                    <div className="w-full max-w-[430px]">
                        <div className="mb-8 flex items-center justify-between">
                            <Link
                                href="/"
                                className="font-serif text-[30px] italic leading-none text-[#31332c] transition hover:text-[#6b5b52]"
                            >
                                VMatch
                            </Link>

                            <Link
                                href="/"
                                aria-label="Kembali ke beranda"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#31332c] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-x-0.5 hover:bg-[#eee8df]"
                            >
                                <ArrowLeft size={21} />
                            </Link>
                        </div>

                        <div className="bg-white px-5 py-7 shadow-[0_18px_55px_rgba(0,0,0,0.08)] sm:px-8 sm:py-9">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b8179]">
                                Daftar Akun
                            </p>

                            <h1 className="mt-3 font-serif text-[36px] leading-tight">
                                Buat akun baru
                            </h1>

                            <p className="mt-3 text-[14px] leading-6 text-[#797c73]">
                                Daftar untuk mulai mengelola kebutuhan proyek interior Anda.
                            </p>

                            <form className="mt-8 space-y-5">
                                <InputField
                                    id="register-name"
                                    label="Nama Lengkap"
                                    icon={<User size={18} strokeWidth={1.75} />}
                                    placeholder="Nama kamu"
                                    type="text"
                                />

                                <InputField
                                    id="register-email"
                                    label="Email"
                                    icon={<Mail size={18} strokeWidth={1.75} />}
                                    placeholder="email@example.com"
                                    type="email"
                                />

                                <div>
                                    <label
                                        htmlFor="register-password"
                                        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52]"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#797c73]">
                                            <Lock size={18} strokeWidth={1.75} />
                                        </span>

                                        <input
                                            id="register-password"
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Minimal 6 karakter"
                                            className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-12 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordVisible((value) => !value)}
                                            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#797c73] transition hover:text-[#31332c]"
                                            aria-label="Tampilkan atau sembunyikan password"
                                        >
                                            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="h-12 w-full bg-[#31332c] text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#191a17] active:scale-[0.99]"
                                >
                                    Daftar
                                </button>
                            </form>

                            <p className="mt-7 border-t border-[#ded6ca] pt-5 text-center text-[12px] text-[#797c73]">
                                Sudah punya akun?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-[#6b5b52] underline-offset-4 hover:underline"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="relative hidden overflow-hidden lg:block">
                    <Image
                        src={REGISTER_IMAGE}
                        alt="Interior dapur modern"
                        fill
                        priority
                        sizes="55vw"
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#191A17]/85 via-[#191A17]/35 to-[#191A17]/10" />

                    <div className="absolute bottom-0 left-0 right-0 z-10 p-10 xl:p-14">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                            VMatch Portal
                        </p>

                        <h2 className="mt-5 max-w-[680px] font-serif text-[48px] leading-[0.95] text-white xl:text-[62px]">
                            Mulai proyek interior dengan alur yang lebih rapi.
                        </h2>

                        <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/78">
                            Buat akun untuk menyimpan brief, mengikuti progress, dan mengatur
                            konsultasi proyek interior dalam satu tempat.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

function InputField({
    id,
    label,
    icon,
    placeholder,
    type,
}: {
    id: string;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    type: string;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52]"
            >
                {label}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#797c73]">
                    {icon}
                </span>

                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-4 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c]"
                />
            </div>
        </div>
    );
}