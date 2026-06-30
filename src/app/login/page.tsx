"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LOGIN_IMAGE = "/figma/hero-kitchen.webp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (/email not confirmed/i.test(authError.message)) {
          setError("Email belum dikonfirmasi. Cek inbox kamu untuk link konfirmasi.");
        } else {
          setError("Email atau password salah.");
        }
        return;
      }

      if (!data.user) {
        setError("Gagal masuk. Silakan coba lagi.");
        return;
      }

      // Ambil role dan email dari profiles. Pakai maybeSingle agar tidak error saat baris belum ada.
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", data.user.id)
        .maybeSingle();

      let role = profile?.role as string | undefined;

      // Self-heal: jika profil belum ada (mis. user lama), buat dari metadata.
      if (!role) {
        const meta = (data.user.user_metadata ?? {}) as {
          role?: string;
          full_name?: string;
        };
        const fallbackRole =
          meta.role === "admin" || meta.role === "vendor" ? meta.role : "user";

        const { data: created } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            role: fallbackRole,
            full_name: meta.full_name ?? null,
            email: data.user.email ?? null,
          })
          .select("role")
          .maybeSingle();

        role = (created?.role as string | undefined) ?? "user";
      } else if (profile) {
        // Jika profil sudah ada tapi email belum tersimpan, backfill sekarang
        if (!profile.email && data.user.email) {
          await supabase
            .from("profiles")
            .update({ email: data.user.email })
            .eq("id", data.user.id);
        }
      }

      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/user");
      }

      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f7f4ef] text-[#31332c]">
      <div className="grid h-full lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left — Hero image panel */}
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src={LOGIN_IMAGE}
            alt="Kitchen set dan area dapur modern"
            fill
            priority
            sizes="55vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#191A17]/80 via-[#191A17]/30 to-transparent" />

          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="absolute left-8 top-7 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#31332c] shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md transition hover:-translate-x-0.5 hover:bg-white"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </Link>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 xl:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              VMatch Portal
            </p>

            <h1 className="mt-3 max-w-[580px] font-serif text-[38px] leading-[1] text-white xl:text-[48px]">
              Kelola proyek interior dalam satu tempat.
            </h1>

            <p className="mt-4 max-w-[480px] text-[14px] leading-6 text-white/70">
              Pantau brief, timeline, konsultasi, material, dan progres proyek
              dengan tampilan yang lebih rapi.
            </p>
          </div>
        </section>

        {/* Right — Login form */}
        <section className="flex h-full items-center justify-center px-5 sm:px-8 lg:px-12">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="font-serif text-[28px] italic leading-none text-[#31332c] transition hover:text-[#6b5b52]"
              >
                VMatch
              </Link>

              <Link
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#31332c] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-x-0.5 hover:bg-[#eee8df] lg:hidden"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft size={18} />
              </Link>
            </div>

            {/* Form card */}
            <div className="bg-white px-6 py-7 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:px-8 sm:py-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b8179]">
                Masuk Akun
              </p>

              <h2 className="mt-2 font-serif text-[30px] leading-tight text-[#31332c]">
                Selamat datang
              </h2>

              <p className="mt-2 text-[13px] leading-5 text-[#797c73]">
                Masuk untuk melanjutkan ke portal klien atau dashboard tim.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                {error && (
                  <div
                    role="alert"
                    className="border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52]"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#797c73]">
                      <Mail size={17} strokeWidth={1.75} />
                    </span>

                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      className="h-11 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-11 pr-4 text-[14px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c]"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b5b52]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#797c73]">
                      <Lock size={17} strokeWidth={1.75} />
                    </span>

                    <input
                      id="login-password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className="h-11 w-full border border-[#ded6ca] bg-[#fcfbf9] pl-11 pr-11 text-[14px] text-[#31332c] outline-none transition focus:border-[#31332c] focus:bg-white focus:ring-1 focus:ring-[#31332c] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                      placeholder="••••••"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((value) => !value)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#797c73] transition hover:text-[#31332c]"
                      aria-label={
                        isPasswordVisible
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {isPasswordVisible ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full bg-[#31332c] text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#191a17] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Masuk..." : "Masuk"}
                </button>
              </form>

              <p className="mt-4 text-center text-[12px] text-[#797c73]">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#6b5b52] underline-offset-4 hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 rounded-xl border border-[#ded6ca] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b8179]">
                Akun Demo
              </p>
              <div className="space-y-1 text-[11px] text-[#797c73]">
                <p>
                  <span className="font-semibold text-[#31332c]">Admin:</span>{" "}
                  admin@vmatch.id / admin123
                </p>
                <p>
                  <span className="font-semibold text-[#31332c]">Vendor:</span>{" "}
                  vendor@vmatch.id / vendor123
                </p>
                <p>
                  <span className="font-semibold text-[#31332c]">User:</span>{" "}
                  user@vmatch.id / user123
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
