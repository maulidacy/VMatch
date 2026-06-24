"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const REGISTER_IMAGE = "/figma/hero-kitchen.webp";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: "user", // default role for self-registration
          },
        },
      });

      if (signUpError) {
        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.toLowerCase().includes("already exists")
        ) {
          setError("Email ini sudah terdaftar. Silakan masuk.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Supabase mengembalikan user dengan identities kosong jika email sudah ada
      // (anti email-enumeration) — perlakukan sebagai sudah terdaftar.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("Email ini sudah terdaftar. Silakan masuk.");
        return;
      }

      // Jika konfirmasi email dimatikan, session langsung tersedia → masuk dashboard.
      if (data.session) {
        router.push("/dashboard/user");
        router.refresh();
        return;
      }

      if (data.user) {
        // Konfirmasi email aktif → tampilkan layar "cek email".
        setSuccess(true);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

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

              {success ? (
                <div className="mt-6 rounded-xl border border-[#DCEBDD] bg-[#F5FAF6] p-5">
                  <p className="font-semibold text-[#4F7A5F]">
                    Akun berhasil dibuat!
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-[#4F7A5F]">
                    Cek email kamu untuk konfirmasi akun, lalu{" "}
                    <Link
                      href="/login"
                      className="font-semibold underline underline-offset-4"
                    >
                      masuk di sini
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="mt-8 space-y-5">
                  {error && (
                    <div
                      role="alert"
                      className="border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  <InputField
                    id="register-name"
                    label="Nama Lengkap"
                    icon={<User size={18} strokeWidth={1.75} />}
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Nama kamu"
                    type="text"
                    autoComplete="name"
                  />

                  <InputField
                    id="register-email"
                    label="Email"
                    icon={<Mail size={18} strokeWidth={1.75} />}
                    value={email}
                    onChange={setEmail}
                    placeholder="email@example.com"
                    type="email"
                    autoComplete="email"
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
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-12 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                        required
                        minLength={6}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setIsPasswordVisible((value) => !value)
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#797c73] transition hover:text-[#31332c]"
                        aria-label="Tampilkan atau sembunyikan password"
                      >
                        {isPasswordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full bg-[#31332c] text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#191a17] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Mendaftar..." : "Daftar"}
                  </button>
                </form>
              )}

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
  value,
  onChange,
  placeholder,
  type,
  autoComplete,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  autoComplete?: string;
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-4 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c]"
          required
        />
      </div>
    </div>
  );
}
