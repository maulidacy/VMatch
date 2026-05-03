"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-[#FCFBF9] font-sans px-5">
      <div className="w-full max-w-md rounded-2xl border border-[#DED6CA] bg-white p-8 shadow-[0_8px_30px_rgb(49,51,44,0.06)] sm:p-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-[32px] font-medium italic leading-none text-[#31332C]">
            VMatch
          </h1>
          <p className="mt-3 text-[14px] text-[#797C73]">
            Masuk ke portal klien dan admin.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-[13px] text-red-600">
              {error}
            </div>
          )}
          
          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#31332C]">
              Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#DED6CA]">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-[#DED6CA] bg-white p-3 pl-11 text-[15px] outline-none transition-colors focus:border-[#6B5B52] focus:ring-1 focus:ring-[#6B5B52]"
                placeholder="admin atau user"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#31332C]">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#DED6CA]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#DED6CA] bg-white p-3 pl-11 text-[15px] outline-none transition-colors focus:border-[#6B5B52] focus:ring-1 focus:ring-[#6B5B52]"
                placeholder="123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#6B5B52] p-4 text-[14px] font-medium text-white transition-colors hover:bg-[#5b4c44]"
          >
            Masuk Sekarang
          </button>
        </form>

        <div className="mt-8 text-center text-[13px] text-[#797C73]">
          <p>Gunakan: admin/123 atau user/123</p>
        </div>
      </div>
    </div>
  );
}
