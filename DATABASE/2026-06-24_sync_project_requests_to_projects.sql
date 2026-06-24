-- =============================================================================
-- Migration: sync_project_requests_to_projects
-- Date: 2026-06-24
--
-- Problem:
--   Dashboard user ("Proyek Saya") dan dashboard vendor ("Projects") sama-sama
--   membaca dari tabel `projects`. Saat admin assign vendor ke
--   `project_requests` (selected_vendor_id), tidak ada sinkronisasi ke
--   `projects` — sehingga proyek tidak muncul di kedua sisi.
--   Ditambah RLS policy `project_requests` belum mengizinkan vendor melihat
--   request yang di-assign ke mereka.
--
-- Fix:
--   1. Unique index pada projects.request_id (untuk ON CONFLICT upsert).
--   2. Trigger function sync_project_request_to_projects() yang upsert
--      baris ke projects setiap kali project_requests di-insert/update.
--      Jika vendor di-unassign (NULL), baris projects dihapus.
--   3. Trigger AFTER INSERT OR UPDATE pada project_requests.
--   4. RLS policy baru:
--        - "Vendor sees assigned requests"  (project_requests)
--        - "Vendor sees own RAB"            (rab)
--   5. Backfill: UPDATE project_requests SET updated_at = NOW()
--      WHERE selected_vendor_id IS NOT NULL;
-- =============================================================================

-- 1. Unique index
CREATE UNIQUE INDEX IF NOT EXISTS projects_request_id_key
  ON projects (request_id) WHERE request_id IS NOT NULL;

-- 2. Trigger function
CREATE OR REPLACE FUNCTION sync_project_request_to_projects()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status text;
  v_next_task text;
  v_solution text;
BEGIN
  IF NEW.selected_vendor_id IS NULL THEN
    DELETE FROM public.projects WHERE request_id = NEW.id;
    RETURN NEW;
  END IF;

  v_status := CASE NEW.status
    WHEN 'Menunggu Vendor'           THEN 'Butuh Review'
    WHEN 'Menunggu Estimasi Vendor'  THEN 'Berjalan'
    WHEN 'Estimasi Diterima'         THEN 'Berjalan'
    WHEN 'RAB Disetujui'             THEN 'Berjalan'
    WHEN 'Dikerjakan'                THEN 'Berjalan'
    WHEN 'QC'                        THEN 'QC'
    WHEN 'Selesai'                   THEN 'Selesai'
    ELSE 'Berjalan'
  END;

  v_next_task := CASE NEW.status
    WHEN 'Menunggu Vendor'           THEN 'Menunggu peninjauan vendor.'
    WHEN 'Menunggu Estimasi Vendor'  THEN 'Vendor sedang menyiapkan estimasi dan RAB.'
    WHEN 'Estimasi Diterima'         THEN 'Menunggu persetujuan RAB dari customer.'
    WHEN 'RAB Disetujui'             THEN 'Tim vendor akan memulai pengerjaan.'
    ELSE 'Menunggu update dari tim VMatch.'
  END;

  v_solution := COALESCE(
    NULLIF(NEW.ai_brief_summary, ''),
    NULLIF(NEW.ai_description, ''),
    NEW.project_name
  );

  INSERT INTO public.projects (
    request_id, customer_id, vendor_id, title, project_type,
    location, room_size, design_style, description, solution,
    estimated_cost, status, progress, next_task, admin_note,
    created_at, updated_at
  )
  VALUES (
    NEW.id, NEW.customer_id, NEW.selected_vendor_id, NEW.project_name,
    COALESCE(NULLIF(NEW.project_type, ''), 'Interior'),
    NULLIF(NEW.location, ''), NEW.room_size, NEW.design_style,
    v_solution, v_solution, NEW.budget, v_status, 0,
    v_next_task, NEW.admin_note, NOW(), NOW()
  )
  ON CONFLICT (request_id) WHERE request_id IS NOT NULL
  DO UPDATE SET
    customer_id    = EXCLUDED.customer_id,
    vendor_id      = EXCLUDED.vendor_id,
    title          = EXCLUDED.title,
    project_type   = EXCLUDED.project_type,
    location       = EXCLUDED.location,
    room_size      = EXCLUDED.room_size,
    design_style   = EXCLUDED.design_style,
    description    = EXCLUDED.description,
    solution       = EXCLUDED.solution,
    estimated_cost = EXCLUDED.estimated_cost,
    status         = EXCLUDED.status,
    next_task      = EXCLUDED.next_task,
    admin_note     = EXCLUDED.admin_note,
    updated_at     = NOW();

  RETURN NEW;
END;
$$;

-- 3. Attach trigger
DROP TRIGGER IF EXISTS trg_sync_project_request_to_projects ON project_requests;
CREATE TRIGGER trg_sync_project_request_to_projects
  AFTER INSERT OR UPDATE ON project_requests
  FOR EACH ROW
  EXECUTE FUNCTION sync_project_request_to_projects();

-- 4. RLS: vendor can see project_requests assigned to them
DROP POLICY IF EXISTS "Vendor sees assigned requests" ON project_requests;
CREATE POLICY "Vendor sees assigned requests"
  ON project_requests
  FOR SELECT
  TO public
  USING (
    selected_vendor_id = auth.uid()
    OR get_my_role() = 'admin'::text
    OR customer_id = auth.uid()
  );

-- 5. RLS: vendor can see RAB linked via request_id they are assigned to
DROP POLICY IF EXISTS "Vendor sees own RAB" ON rab;
CREATE POLICY "Vendor sees own RAB"
  ON rab
  FOR SELECT
  TO public
  USING (
    vendor_id = auth.uid()
    OR get_my_role() = 'admin'::text
    OR customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM project_requests pr
      WHERE pr.id = rab.request_id
        AND pr.selected_vendor_id = auth.uid()
    )
  );

-- 6. Backfill existing project_requests with selected_vendor_id
UPDATE project_requests SET updated_at = NOW()
  WHERE selected_vendor_id IS NOT NULL;
