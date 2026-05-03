"use client";

import { Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LOGIN_IMAGE = "/figma/hero-kitchen.webp";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123") {
      router.push("/dashboard/admin");
    } else if (username === "user" && password === "123") {
      router.push("/dashboard/user");
    } else {
      setError("Username atau password salah.");
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden bg-[#FCFBF9] font-sans text-[#31332C] supports-[min-height:100svh]:min-h-[100svh] lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <div className="relative h-[min(36vh,320px)] w-full max-w-full shrink-0 sm:h-[min(32vh,300px)] lg:h-full lg:min-h-0 lg:w-1/2">
        <Image
          src={LOGIN_IMAGE}
          alt="Kitchen set dan area dapur modern referensi desain interior"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#191A17]/30 lg:bg-[#191A17]/20" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-[#191A17]/55 p-3 text-white sm:p-6 lg:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE5]/80">VMatch · Interior dan kitchen</p>
          <p className="mt-2 font-serif text-[20px] leading-snug sm:mt-3 sm:text-[26px] lg:text-[30px]">
            Dapur dan ruang hidup yang rapi, fungsional, dan sesuai gaya hidupmu.
          </p>
          <p className="mt-3 max-w-[480px] text-[13px] leading-relaxed text-[#F5EFE5]/92">
            Lewat portal ini, klien mengikuti brief, jadwal konsultasi, hingga progres pengerjaan. Tim internal merapikan pipeline
            proyek dari request hingga instalasi—tanpa komunikasi yang berantakan.
          </p>
          <p className="mt-2 max-w-[480px] text-[12px] leading-relaxed text-[#F5EFE5]/78">
            Masuk untuk lanjut mengurus proyek: kurasi material, timeline, dan dokumentasi di satu tempat.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain border-[#DED6CA] px-4 py-6 sm:px-8 sm:py-8 lg:w-1/2 lg:border-l lg:px-12 lg:py-10">
        <div className="mx-auto w-full min-w-0 max-w-[400px]">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-block min-w-0 font-serif text-[26px] font-medium italic leading-none text-[#31332C] transition-colors hover:text-[#6B5B52] sm:text-[32px]"
            >
              VMatch
            </Link>
            <p className="mt-3 text-[14px] leading-relaxed text-[#797C73]">Masuk ke portal klien dan tim.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700" role="alert">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-username" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#797C73]">
                  <User size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="h-12 w-full min-w-0 border border-[#DED6CA] bg-white pl-11 pr-3 text-base text-[#31332C] outline-none transition-colors focus:border-[#31332C] focus:ring-1 focus:ring-[#31332C] sm:text-[15px]"
                  placeholder="admin atau user"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B5B52]">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#797C73]">
                  <Lock size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-12 w-full min-w-0 border border-[#DED6CA] bg-white pl-11 pr-3 text-base text-[#31332C] outline-none transition-colors focus:border-[#31332C] focus:ring-1 focus:ring-[#31332C] sm:text-[15px]"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-12 w-full bg-[#31332C] text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F5EFE5] transition-colors hover:bg-[#191A17]"
            >
              Masuk
            </button>
          </form>

          <p className="mt-8 border-t border-[#DED6CA] pt-6 text-center text-[12px] leading-relaxed text-[#797C73]">
            Demo: <span className="text-[#31332C]">admin</span> / <span className="text-[#31332C]">123</span>
            <span className="mx-1 text-[#DED6CA]">·</span>
            <span className="text-[#31332C]">user</span> / <span className="text-[#31332C]">123</span>
          </p>

          <p className="mt-4 text-center">
            <Link href="/" className="text-[12px] font-medium text-[#6B5B52] underline-offset-4 hover:underline">
              Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
