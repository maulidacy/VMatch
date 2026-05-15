"use client";

import { ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LOGIN_IMAGE = "/figma/hero-kitchen.webp";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (username === "admin" && password === "123") {
      router.push("/dashboard/admin");
      return;
    }

    if (username === "user" && password === "123") {
      router.push("/dashboard/user");
      return;
    }

    setError("Username atau password salah.");
  };

  return (
    <main className="min-h-[100dvh] bg-[#f7f4ef] text-[#31332c]">
      <div className="grid min-h-[100dvh] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src={LOGIN_IMAGE}
            alt="Kitchen set dan area dapur modern"
            fill
            priority
            sizes="55vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#191A17]/85 via-[#191A17]/35 to-[#191A17]/10" />

          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="absolute left-10 top-8 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#31332c] shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md transition hover:-translate-x-0.5 hover:bg-white"
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </Link>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-10 xl:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              VMatch Portal
            </p>

            <h1 className="mt-5 max-w-[680px] font-serif text-[48px] leading-[0.95] text-white xl:text-[62px]">
              Kelola proyek interior dalam satu tempat.
            </h1>

            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/78">
              Pantau brief, timeline, konsultasi, material, dan progres proyek
              dengan tampilan yang lebih rapi.
            </p>

            <div className="mt-8 grid max-w-[560px] grid-cols-3 gap-3">
              {["Brief", "Timeline", "Progress"].map((item) => (
                <div
                  key={item}
                  className="border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                    Portal
                  </p>
                  <p className="mt-1 font-serif text-[20px]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#31332c] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-x-0.5 hover:bg-[#eee8df] lg:hidden"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft size={21} />
              </Link>
            </div>

            <div className="bg-white px-5 py-7 shadow-[0_18px_55px_rgba(0,0,0,0.08)] sm:px-8 sm:py-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b8179]">
                  Masuk Akun
                </p>

                <h2 className="mt-3 font-serif text-[36px] leading-tight text-[#31332c]">
                  Selamat datang
                </h2>

                <p className="mt-3 text-[14px] leading-6 text-[#797c73]">
                  Masuk untuk melanjutkan ke portal klien atau dashboard tim.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                {error && (
                  <div
                    role="alert"
                    className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
                  >
                    {error}
                  </div>
                )}

                <InputField
                  id="login-username"
                  label="Username"
                  icon={<User size={18} strokeWidth={1.75} />}
                  value={username}
                  onChange={setUsername}
                  placeholder="admin atau user"
                  autoComplete="username"
                />

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#797c73]">
                      <Lock size={18} strokeWidth={1.75} />
                    </span>

                    <input
                      id="login-password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-12 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                      placeholder="••••••"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((value) => !value)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#797c73] transition hover:text-[#31332c]"
                      aria-label={
                        isPasswordVisible
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
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
                  className="h-12 w-full bg-[#31332c] text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#191a17] active:scale-[0.99]"
                >
                  Masuk
                </button>
              </form>

              <p className="mt-5 text-center text-[12px] text-[#797c73]">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#6b5b52] underline-offset-4 hover:underline"
                >
                  Daftar
                </Link>
              </p>

              <div className="mt-7 border-t border-[#ded6ca] pt-5">
                <p className="text-center text-[12px] leading-6 text-[#797c73]">
                  Demo: <span className="font-medium text-[#31332c]">admin</span>{" "}
                  / <span className="font-medium text-[#31332c]">123</span>
                  <span className="mx-1 text-[#ded6ca]">·</span>
                  <span className="font-medium text-[#31332c]">user</span> /{" "}
                  <span className="font-medium text-[#31332c]">123</span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-[12px] text-[#797c73]">
              Portal ini digunakan untuk kebutuhan demo dan monitoring proyek.
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
  autoComplete,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
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
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="h-12 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-12 pr-4 text-[15px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c]"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}