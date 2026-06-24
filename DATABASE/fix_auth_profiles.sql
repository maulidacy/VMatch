-- =============================================================
-- VMatch — FIX: Auto-create profile on signup
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor.
-- Aman dijalankan ulang (idempotent).
--
-- Masalah yang diperbaiki:
--   Saat user mendaftar (auth.signUp), baris di tabel `profiles`
--   tidak pernah dibuat, sehingga login gagal membaca role.
-- =============================================================

-- 1) Fungsi pembuat profil otomatis.
--    SECURITY DEFINER agar bisa menembus RLS saat insert.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    -- ambil role dari metadata signup, default 'user', tolak nilai tak valid
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('admin', 'vendor', 'user')
        THEN NEW.raw_user_meta_data->>'role'
      ELSE 'user'
    END,
    NULLIF(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2) Trigger: jalankan fungsi di atas setiap kali user auth baru dibuat.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Izinkan user membuat profilnya sendiri (fallback / self-heal di login).
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- 4) (Opsional) Backfill: buat profil untuk user lama yang terlanjur
--    terdaftar tanpa profil. Default role 'user'.
INSERT INTO public.profiles (id, role, full_name)
SELECT
  u.id,
  CASE
    WHEN u.raw_user_meta_data->>'role' IN ('admin', 'vendor', 'user')
      THEN u.raw_user_meta_data->>'role'
    ELSE 'user'
  END,
  NULLIF(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
