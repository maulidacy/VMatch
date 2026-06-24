"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const resolveProfile = async (user: User) => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (active) {
          setState({ user, profile: (profile as Profile) ?? null, isLoading: false });
        }
      } catch {
        // Jangan paksa logout kalau profil gagal dibaca — pertahankan sesi.
        if (active) setState({ user, profile: null, isLoading: false });
      }
    };

    // PENTING: callback ini TIDAK boleh async dan TIDAK boleh meng-await
    // panggilan Supabase lain secara langsung. Auth client menahan sebuah
    // lock saat callback berjalan; meng-await query di sini menyebabkan
    // deadlock yang membuat dashboard loading selamanya saat reload.
    // Karena itu pemanggilan DB ditunda dengan setTimeout(0).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      const user = session?.user ?? null;

      if (user) {
        setTimeout(() => {
          if (active) resolveProfile(user);
        }, 0);
      } else {
        setState({ user: null, profile: null, isLoading: false });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
