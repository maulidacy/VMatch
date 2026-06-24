-- =============================================================
-- VMatch Database Schema
-- Generated: 2026-06-22
-- =============================================================

-- =============================================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
--    Stores role info and profile data for all users
-- =============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'vendor', 'user')),
  full_name     TEXT,
  phone         TEXT,
  address       TEXT,
  avatar_url    TEXT,
  -- Vendor-specific fields
  service_area  TEXT,
  skills        TEXT,
  bank_name     TEXT,
  bank_account  TEXT,
  -- Customer-specific fields
  source        TEXT,               -- how they found VMatch
  budget_range  TEXT,
  preferences   TEXT,
  -- Shared
  status        TEXT NOT NULL DEFAULT 'active',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 2. PROJECT_REQUESTS TABLE
--    Customer submits a project request (from NewProjectForm)
-- =============================================================
CREATE TABLE project_requests (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Form data from user
  project_name            TEXT NOT NULL,
  project_type            TEXT NOT NULL,
  design_style            TEXT,
  location                TEXT NOT NULL,
  room_size               TEXT,
  budget                  TEXT,
  material_preference     TEXT,
  material_package        TEXT,
  reference_name          TEXT,
  start_target            TEXT,
  finish_target           TEXT,
  notes                   TEXT,
  -- AI brief data
  ai_description          TEXT,
  ai_brief_summary        TEXT,
  ai_brief_recommendations TEXT,
  -- Inspiration reference
  inspiration_reference   TEXT,
  -- Admin review
  status                  TEXT NOT NULL DEFAULT 'Baru Masuk'
                          CHECK (status IN (
                            'Baru Masuk','Menunggu Review','Butuh Konsultasi',
                            'Disetujui','Menunggu Vendor','Menunggu Estimasi Vendor',
                            'Estimasi Dikirim Vendor','RAB Direview Admin',
                            'RAB Dikirim ke Customer','Menjadi Proyek Aktif','Ditolak'
                          )),
  admin_note              TEXT,
  brief_document_status   TEXT NOT NULL DEFAULT 'Belum Dibuat'
                          CHECK (brief_document_status IN (
                            'Belum Dibuat','Draft Brief','Brief Siap','Brief Dikirim'
                          )),
  selected_vendor_id      UUID REFERENCES profiles(id),
  sent_to_vendor_at       TIMESTAMPTZ,
  submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 3. PROJECTS TABLE
--    Active project (created when request becomes active)
-- =============================================================
CREATE TABLE projects (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id          UUID REFERENCES project_requests(id),
  customer_id         UUID NOT NULL REFERENCES profiles(id),
  vendor_id           UUID REFERENCES profiles(id),
  -- Project info
  title               TEXT NOT NULL,
  project_type        TEXT NOT NULL,
  location            TEXT,
  room_size           TEXT,
  design_style        TEXT,
  description         TEXT,
  solution            TEXT,
  -- Financial
  estimated_cost      TEXT,
  final_cost          TEXT,
  -- Schedule
  start_date          DATE,
  estimated_finish    DATE,
  actual_finish       DATE,
  -- Status — unified across all roles
  status              TEXT NOT NULL DEFAULT 'Berjalan'
                      CHECK (status IN (
                        'Berjalan','Butuh Review','QC','Selesai'
                      )),
  -- Progress
  progress            INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  current_stage       TEXT,
  next_task           TEXT,
  -- Admin notes
  admin_note          TEXT,
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 4. BRIEFS TABLE
--    Work brief created by admin and sent to vendor
-- =============================================================
CREATE TABLE briefs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID REFERENCES projects(id),
  request_id        UUID REFERENCES project_requests(id),
  customer_id       UUID NOT NULL REFERENCES profiles(id),
  vendor_id         UUID REFERENCES profiles(id),
  -- Brief content
  project_title     TEXT NOT NULL,
  project_type      TEXT,
  location          TEXT,
  room_size         TEXT,
  budget            TEXT,
  scope             TEXT,
  material_note     TEXT,
  admin_note        TEXT,
  vendor_note       TEXT,
  -- Vendor response
  vendor_response   TEXT,
  vendor_read_at    TIMESTAMPTZ,
  vendor_responded_at TIMESTAMPTZ,
  -- Arrays stored as JSONB
  materials         JSONB NOT NULL DEFAULT '[]',    -- string[]
  timeline          JSONB NOT NULL DEFAULT '[]',    -- {label, date}[]
  qc_checklist      JSONB NOT NULL DEFAULT '[]',    -- string[]
  checklist         JSONB NOT NULL DEFAULT '[]',    -- {id, label, completed}[]
  -- Status
  status            TEXT NOT NULL DEFAULT 'Draft'
                    CHECK (status IN (
                      'Draft','Siap Dikirim','Dikirim ke Vendor',
                      'Dibaca Vendor','Estimasi Dikirim','Revisi Brief'
                    )),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 5. BRIEF_FILES TABLE
--    Files attached to a brief
-- =============================================================
CREATE TABLE brief_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id      UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  file_type     TEXT,
  size          TEXT,
  storage_path  TEXT,
  uploaded_by   UUID NOT NULL REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 6. VENDOR_ESTIMATES TABLE
--    Vendor fills cost estimate after reading brief
-- =============================================================
CREATE TABLE vendor_estimates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id            UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  project_id          UUID REFERENCES projects(id),
  vendor_id           UUID NOT NULL REFERENCES profiles(id),
  -- Estimate fields
  estimated_cost      TEXT NOT NULL,
  estimated_duration  TEXT NOT NULL,
  suggested_material  TEXT,
  vendor_note         TEXT,
  -- Status
  status              TEXT NOT NULL DEFAULT 'Draft Estimasi'
                      CHECK (status IN (
                        'Belum Dibuat','Draft Estimasi','Estimasi Dikirim'
                      )),
  sent_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 7. RAB TABLE
--    Admin builds final RAB from vendor estimate
-- =============================================================
CREATE TABLE rab (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID REFERENCES projects(id),
  request_id          UUID REFERENCES project_requests(id),
  customer_id         UUID NOT NULL REFERENCES profiles(id),
  vendor_id           UUID REFERENCES profiles(id),
  estimate_id         UUID REFERENCES vendor_estimates(id),
  -- RAB content
  project_title       TEXT NOT NULL,
  project_type        TEXT,
  location            TEXT,
  grand_total         TEXT NOT NULL DEFAULT 'Rp0',
  vmatch_service_fee  TEXT NOT NULL DEFAULT 'Rp0',  -- internal only
  -- Notes
  admin_note          TEXT,
  customer_note       TEXT,
  revision_note       TEXT,
  -- Status
  status              TEXT NOT NULL DEFAULT 'Menunggu Estimasi Vendor'
                      CHECK (status IN (
                        'Menunggu Estimasi Vendor','Estimasi Dikirim Vendor',
                        'RAB Direview Admin','RAB Dikirim ke Customer',
                        'Revisi Diminta Customer','RAB Disetujui Customer'
                      )),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 8. CONSULTATIONS TABLE
--    Customer schedules, admin manages consultations
-- =============================================================
CREATE TABLE consultations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id           UUID NOT NULL REFERENCES profiles(id),
  project_id            UUID REFERENCES projects(id),
  request_id            UUID REFERENCES project_requests(id),
  -- Consultation details
  project_name          TEXT,
  topic                 TEXT,
  method                TEXT NOT NULL DEFAULT 'Google Meet'
                        CHECK (method IN (
                          'Google Meet','WhatsApp Call','Chat WhatsApp','Offline'
                        )),
  consultation_date     DATE,
  consultation_time     TEXT,
  meeting_link          TEXT,
  -- Notes
  customer_need         TEXT,
  customer_note         TEXT,
  admin_note            TEXT,
  result_note           TEXT,
  -- Source
  request_source        TEXT DEFAULT 'Customer Request',
  -- Status
  status                TEXT NOT NULL DEFAULT 'Menunggu Konfirmasi'
                        CHECK (status IN (
                          'Menunggu Konfirmasi','Terkonfirmasi',
                          'Dijadwalkan Ulang','Selesai','Dibatalkan'
                        )),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 9. INVOICES TABLE
--    Customer-facing invoices (created by admin after RAB approved)
-- =============================================================
CREATE TABLE invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID REFERENCES projects(id),
  customer_id         UUID NOT NULL REFERENCES profiles(id),
  invoice_number      TEXT UNIQUE NOT NULL,
  project_title       TEXT NOT NULL,
  payment_stage       TEXT,
  total_amount        TEXT NOT NULL,
  paid_amount         TEXT DEFAULT 'Rp0',
  remaining_amount    TEXT,
  payment_method      TEXT DEFAULT 'Transfer Bank',
  due_date            DATE,
  -- Notes
  admin_note          TEXT,
  customer_note       TEXT,
  -- Items stored as JSONB
  items               JSONB NOT NULL DEFAULT '[]',  -- {id, label, amount}[]
  -- Timeline stored as JSONB
  timeline            JSONB NOT NULL DEFAULT '[]',
  -- Status — unified with user view
  status              TEXT NOT NULL DEFAULT 'Menunggu Pembayaran'
                      CHECK (status IN (
                        'Draft','Menunggu Pembayaran','Terbayar','Lunas',
                        'Terlambat','Refund','Belum Tersedia'
                      )),
  issued_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 10. VENDOR_PAYOUTS TABLE
--    Vendor milestone payments (managed by admin)
-- =============================================================
CREATE TABLE vendor_payouts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID REFERENCES projects(id),
  vendor_id     UUID NOT NULL REFERENCES profiles(id),
  title         TEXT NOT NULL,
  amount        TEXT NOT NULL,
  due_info      TEXT,
  status        TEXT NOT NULL DEFAULT 'Menunggu Milestone'
                CHECK (status IN (
                  'Menunggu Milestone','Diproses','Dibayarkan','Ditahan Sementara'
                )),
  paid_at       TIMESTAMPTZ,
  admin_note    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 11. PROGRESS_LOGS TABLE
--    Vendor submits daily progress logs
-- =============================================================
CREATE TABLE progress_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id         UUID NOT NULL REFERENCES profiles(id),
  -- Log content
  log_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'Sesuai Jadwal'
                    CHECK (status IN (
                      'Sesuai Jadwal','Ada Kendala','Tidak Ada Pekerjaan Hari Ini'
                    )),
  progress_percent  INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  work_summary      TEXT NOT NULL,
  issue             TEXT,
  next_plan         TEXT,
  photo_label       TEXT,
  -- Photo stored as path
  photo_path        TEXT,
  -- Admin review
  admin_note        TEXT,
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 12. QC_CHECKLISTS TABLE
--    Admin QC results per project
-- =============================================================
CREATE TABLE qc_checklists (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  items         JSONB NOT NULL DEFAULT '[]',  -- {label, completed}[]
  admin_note    TEXT,
  customer_approved_at TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'Belum Mulai'
                CHECK (status IN (
                  'Belum Mulai','Sedang Dicek','Perlu Catatan','Disetujui'
                )),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 13. VENDOR_BONUSES TABLE
--    Performance bonus per project for vendor
-- =============================================================
CREATE TABLE vendor_bonuses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id       UUID NOT NULL REFERENCES profiles(id),
  amount          TEXT NOT NULL DEFAULT 'Rp0',
  reason          TEXT,
  requirements    JSONB NOT NULL DEFAULT '[]',  -- {label, completed}[]
  status          TEXT NOT NULL DEFAULT 'Belum Memenuhi Syarat'
                  CHECK (status IN (
                    'Berpotensi Aktif','Menunggu QC','Bonus Aktif',
                    'Belum Memenuhi Syarat','Sudah Dibayarkan'
                  )),
  approved_at     TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 14. NOTIFICATIONS TABLE
--    Notifications for all roles
-- =============================================================
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'Sistem'
                  CHECK (category IN (
                    'Proyek','Konsultasi','RAB','Pembayaran',
                    'Vendor','Customer','Promo','Sistem'
                  )),
  priority        TEXT NOT NULL DEFAULT 'Normal'
                  CHECK (priority IN ('Normal','Penting','Urgent')),
  deep_link_page  TEXT,
  deep_link_id    TEXT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 15. PROMOS TABLE
--    Landing page promo popup managed by admin
-- =============================================================
CREATE TABLE promos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  cta_label     TEXT DEFAULT 'Konsultasi Gratis',
  cta_url       TEXT,
  start_date    DATE,
  end_date      DATE,
  status        TEXT NOT NULL DEFAULT 'Draft'
                CHECK (status IN (
                  'Draft','Aktif','Dijadwalkan','Berakhir','Nonaktif'
                )),
  created_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 16. WARRANTY_CLAIMS TABLE
--    Post-project warranty claims from customers
-- =============================================================
CREATE TABLE warranty_claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES profiles(id),
  issue_type      TEXT NOT NULL,
  description     TEXT NOT NULL,
  incident_date   DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Klaim Diajukan'
                  CHECK (status IN (
                    'Klaim Diajukan','Klaim Diproses','Selesai'
                  )),
  admin_note      TEXT,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 17. FIELD_TEAMS TABLE
--    Vendor field team members per project
-- =============================================================
CREATE TABLE field_teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id   UUID NOT NULL REFERENCES profiles(id),
  name        TEXT NOT NULL,
  role        TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- INDEXES for performance
-- =============================================================
CREATE INDEX idx_project_requests_customer ON project_requests(customer_id);
CREATE INDEX idx_project_requests_status ON project_requests(status);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_vendor ON projects(vendor_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_briefs_project ON briefs(project_id);
CREATE INDEX idx_briefs_vendor ON briefs(vendor_id);
CREATE INDEX idx_consultations_customer ON consultations(customer_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_progress_logs_project ON progress_logs(project_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(recipient_id, is_read);

-- =============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_project_requests_updated_at
  BEFORE UPDATE ON project_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vendor_estimates_updated_at
  BEFORE UPDATE ON vendor_estimates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_rab_updated_at
  BEFORE UPDATE ON rab
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vendor_payouts_updated_at
  BEFORE UPDATE ON vendor_payouts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_qc_checklists_updated_at
  BEFORE UPDATE ON qc_checklists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vendor_bonuses_updated_at
  BEFORE UPDATE ON vendor_bonuses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_promos_updated_at
  BEFORE UPDATE ON promos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_warranty_claims_updated_at
  BEFORE UPDATE ON warranty_claims
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rab ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_teams ENABLE ROW LEVEL SECURITY;

-- Helper: get caller's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin can see all profiles
CREATE POLICY "Admin full access profiles"
  ON profiles FOR ALL
  USING (get_my_role() = 'admin');

-- Users can create their own profile (fallback / self-heal at login)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- =============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
--   Membuat baris profiles otomatis tiap user auth baru dibuat.
--   Tanpa ini, signUp berhasil tapi login gagal membaca role.
-- =============================================================
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PROJECT_REQUESTS policies
CREATE POLICY "Customer sees own requests"
  ON project_requests FOR SELECT
  USING (customer_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Customer can insert requests"
  ON project_requests FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admin manages requests"
  ON project_requests FOR ALL
  USING (get_my_role() = 'admin');

-- PROJECTS policies
CREATE POLICY "Customer sees own projects"
  ON projects FOR SELECT
  USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages projects"
  ON projects FOR ALL
  USING (get_my_role() = 'admin');

CREATE POLICY "Vendor can update own project progress"
  ON projects FOR UPDATE
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- BRIEFS policies
CREATE POLICY "Vendor sees briefs assigned to them"
  ON briefs FOR SELECT
  USING (vendor_id = auth.uid() OR customer_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages briefs"
  ON briefs FOR ALL
  USING (get_my_role() = 'admin');

CREATE POLICY "Vendor can respond to briefs"
  ON briefs FOR UPDATE
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- VENDOR_ESTIMATES policies
CREATE POLICY "Vendor manages own estimates"
  ON vendor_estimates FOR ALL
  USING (vendor_id = auth.uid() OR get_my_role() = 'admin');

-- RAB policies
CREATE POLICY "Customer sees own RAB"
  ON rab FOR SELECT
  USING (customer_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages RAB"
  ON rab FOR ALL
  USING (get_my_role() = 'admin');

-- CONSULTATIONS policies
CREATE POLICY "Customer sees own consultations"
  ON consultations FOR SELECT
  USING (customer_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Customer can create consultations"
  ON consultations FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admin manages consultations"
  ON consultations FOR ALL
  USING (get_my_role() = 'admin');

-- INVOICES policies
CREATE POLICY "Customer sees own invoices"
  ON invoices FOR SELECT
  USING (customer_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages invoices"
  ON invoices FOR ALL
  USING (get_my_role() = 'admin');

-- VENDOR_PAYOUTS policies
CREATE POLICY "Vendor sees own payouts"
  ON vendor_payouts FOR SELECT
  USING (vendor_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages payouts"
  ON vendor_payouts FOR ALL
  USING (get_my_role() = 'admin');

-- PROGRESS_LOGS policies
CREATE POLICY "Vendor manages own logs"
  ON progress_logs FOR ALL
  USING (vendor_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Customer sees project logs"
  ON progress_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = progress_logs.project_id
      AND p.customer_id = auth.uid()
    )
    OR get_my_role() = 'admin'
  );

-- NOTIFICATIONS policies
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Admin manages all notifications"
  ON notifications FOR ALL
  USING (get_my_role() = 'admin');

-- PROMOS policies
CREATE POLICY "Anyone can read active promos"
  ON promos FOR SELECT
  USING (status = 'Aktif' OR get_my_role() = 'admin');

CREATE POLICY "Admin manages promos"
  ON promos FOR ALL
  USING (get_my_role() = 'admin');

-- WARRANTY_CLAIMS policies
CREATE POLICY "Customer manages own claims"
  ON warranty_claims FOR ALL
  USING (customer_id = auth.uid() OR get_my_role() = 'admin');

-- QC_CHECKLISTS policies
CREATE POLICY "Project stakeholders see QC"
  ON qc_checklists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = qc_checklists.project_id
      AND (p.customer_id = auth.uid() OR p.vendor_id = auth.uid())
    )
    OR get_my_role() = 'admin'
  );

CREATE POLICY "Admin manages QC"
  ON qc_checklists FOR ALL
  USING (get_my_role() = 'admin');

-- VENDOR_BONUSES policies
CREATE POLICY "Vendor sees own bonuses"
  ON vendor_bonuses FOR SELECT
  USING (vendor_id = auth.uid() OR get_my_role() = 'admin');

CREATE POLICY "Admin manages bonuses"
  ON vendor_bonuses FOR ALL
  USING (get_my_role() = 'admin');

-- FIELD_TEAMS policies
CREATE POLICY "Vendor manages own field team"
  ON field_teams FOR ALL
  USING (vendor_id = auth.uid() OR get_my_role() = 'admin');

-- BRIEF_FILES policies
CREATE POLICY "Stakeholders see brief files"
  ON brief_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM briefs b
      WHERE b.id = brief_files.brief_id
      AND (b.vendor_id = auth.uid() OR b.customer_id = auth.uid())
    )
    OR get_my_role() = 'admin'
  );

CREATE POLICY "Admin manages brief files"
  ON brief_files FOR ALL
  USING (get_my_role() = 'admin');
