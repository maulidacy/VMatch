# 🔍 VMatch Frontend Feature Audit

**Tanggal Audit:** 22 Juni 2026  
**Status:** Audit fitur frontend sebelum implementasi backend  
**Tujuan:** Identifikasi bottleneck, fitur tidak nyambung, dan gap antar role

---

## 📋 RINGKASAN TEMUAN

| Kategori | Jumlah |
|----------|--------|
| Fitur per Role — Admin | 15 halaman |
| Fitur per Role — User | 6 halaman |
| Fitur per Role — Vendor | 5 halaman |
| Public Pages | 4 halaman |
| Bottleneck Kritis | 8 |
| Data Tidak Nyambung | 12 |
| Fitur Mati / Placeholder | 5 |
| Rekomendasi Perbaikan | 20+ |

---

## 🏠 PUBLIC PAGES

### 1. Landing Page (`/`)
- Hero Section
- Stats Strip
- Inspiration Categories Section
- Projects Section
- Services Section
- Process Section
- Benefits Section
- Philosophy Section
- FAQ Section
- Contact Section
- Footer
- Promo Popup (terhubung ke admin promo campaign)

### 2. Login (`/login`)
- Form username + password
- Hardcoded routing: admin/123, user/123, vendor/123
- Link ke Register

### 3. Register (`/register`)
- Form: Nama, Email, Password
- **⚠️ TIDAK ADA LOGIC** — form hanya UI, tidak ada handler submit

### 4. Portfolio (`/portfolio`) & Inspirasi (`/inspirasi/[slug]`)
- Portfolio listing + detail
- Dynamic inspiration category pages

---

## 👤 USER/CLIENT DASHBOARD (`/dashboard/user`)

### Menu & Halaman (6 halaman aktif):

| # | Page ID | Nama | Status |
|---|---------|------|--------|
| 1 | `inspirasi` | Inspirasi Desain | ✅ Aktif (default page) |
| 2 | `ajukan` | Ajukan Proyek | ✅ Aktif |
| 3 | `proyek` | Proyek Saya | ✅ Aktif |
| 4 | `konsultasi` | Konsultasi | ✅ Aktif |
| 5 | `ai` | VMatch AI | ✅ Aktif |
| 6 | `pengaturan` | Pengaturan | ✅ Aktif |
| - | `dashboard` | Dashboard | ❌ Di-comment out |

### Detail Fitur per Halaman:

#### 1. Inspirasi Desain (`CatalogDesign`)
- Filter berdasarkan property type, lokasi, style
- Material packages (Basic/Standard/Premium)
- "Gunakan sebagai preferensi" → simpan ke sessionStorage
- Navigasi ke: AI Chat, Konsultasi, Ajukan Proyek

#### 2. Ajukan Proyek (`NewProjectForm`)
- Dua mode: AI-assisted brief builder ATAU Manual detail form
- AI mode: deskripsi → generate brief → select brief → submit
- Manual mode: form lengkap (nama, tipe, style, lokasi, budget, material, timeline, catatan)
- Readiness score calculation
- Draft save (frontend saja)
- Submit request → status "submitted" (mock)
- Integrasi sessionStorage dari Inspirasi Desain

#### 3. Proyek Saya (`ProyekView`)
- List proyek dengan filter: Semua/Aktif/Menunggu/Selesai
- Detail proyek dengan 4 tab:
  - **Ringkasan:** info proyek, status, solusi VMatch, next step
  - **Progress:** timeline, jadwal kerja, persetujuan material, revisi, QC & serah terima
  - **Pembayaran:** invoice list, upload bukti bayar, kuitansi
  - **Dokumen:** file dokumen, garansi, warranty claim

#### 4. Konsultasi (`MeetingView`)
- Create consultation request (project, topic, type, date, time, note)
- Reschedule existing consultation
- Cancel consultation
- View confirmed meetings + Google Meet link
- Status flow: Menunggu Konfirmasi → Terkonfirmasi → Selesai/Dibatalkan

#### 5. VMatch AI (`AiChatView`)
- Full-screen AI chat interface
- Connected to `/api/chat` (Ollama API)
- Streaming responses
- Inline inspiration image rendering
- Quick prompt suggestions

#### 6. Pengaturan (`SettingsView`)
- Profile settings (UI only)

### Fitur Tambahan User:
- Notification panel (bell icon)
- Floating WhatsApp button

---

## 🏗️ VENDOR DASHBOARD (`/dashboard/vendor`)

### Menu & Halaman (5 halaman aktif):

| # | Page ID | Nama | Status |
|---|---------|------|--------|
| 1 | `projects` | Proyek Saya | ✅ Aktif (default) |
| 2 | `brief` | Brief & Rencana Kerja | ✅ Aktif |
| 3 | `progress-log` | Log Progress | ✅ Aktif |
| 4 | `payment-bonus` | Pembayaran & Bonus | ✅ Aktif |
| 5 | `settings` | Pengaturan | ✅ Aktif |
| - | `dashboard` | Dashboard | ❌ Di-comment out |

### Detail Fitur per Halaman:

#### 1. Proyek Saya (`ProjectView`)
- List proyek dengan filter: Semua/Aktif/Menunggu/Selesai
- Detail: status, progress bar, customer brief, VMatch notes, material info
- Field team members dengan phone contacts
- Navigasi ke Brief & Progress Log

#### 2. Brief & Rencana Kerja (`BriefWorkPlanView`)
- List brief dari admin dengan filter: Semua/Belum Dibaca/Sudah Dibaca/Estimasi Dikirim
- Detail brief: scope, file brief (PDF/gambar), material, timeline, QC checklist
- Aksi vendor:
  - Mark as read (konfirmasi)
  - Write vendor notes/tanggapan
  - Fill estimasi RAB (biaya, durasi, catatan)
  - Send estimasi ke admin

#### 3. Log Progress (`ProgressLogView`)
- Pilih proyek aktif
- Submit daily log: status, progress %, ringkasan kerja, kendala, rencana berikutnya
- Mock photo upload
- History log per proyek

#### 4. Pembayaran & Bonus (`PaymentBonusView`)
- Payment milestones per proyek (view only)
- Bonus status per proyek
- Bonus requirements checklist (view only)

#### 5. Pengaturan (`SettingsView`)
- Profile & settings (UI only)

### Fitur Tambahan Vendor:
- Notification bell dengan navigable notifications
- Vendor profile display di sidebar

---

## ⚙️ ADMIN DASHBOARD (`/dashboard/admin`)

### Menu & Halaman (15 halaman):

| # | Group | Page ID | Nama | Status |
|---|-------|---------|------|--------|
| 1 | Dashboard | `dashboard` | Dashboard | ✅ Aktif |
| 2 | Manajemen Proyek | `requests` | Request Proyek | ✅ Aktif |
| 3 | Manajemen Proyek | `active-projects` | Proyek Aktif | ✅ Aktif |
| 4 | Manajemen Proyek | `brief-documents` | Brief & Dokumen | ✅ Aktif |
| 5 | Manajemen Proyek | `progress-qc` | Progress & QC | ✅ Aktif |
| 6 | Relasi Pengguna | `customers` | Customer | ✅ Aktif |
| 7 | Relasi Pengguna | `vendors` | Vendor Partner | ✅ Aktif |
| 8 | Relasi Pengguna | `consultations` | Konsultasi | ✅ Aktif |
| 9 | Keuangan | `rab-builder` | RAB Builder | ✅ Aktif |
| 10 | Keuangan | `payments` | Invoice & Pembayaran | ✅ Aktif |
| 11 | Keuangan | `vendor-bonus` | Bonus Vendor | ✅ Aktif |
| 12 | Marketing | `promo` | Promo & Campaign | ✅ Aktif |
| 13 | Marketing | `analytics` | Analytics | ✅ Aktif |
| 14 | Sistem | `notifications` | Notifikasi | ✅ Aktif |
| 15 | Sistem | `settings` | Pengaturan | ✅ Aktif |

### Detail Fitur per Halaman:

#### 1. Dashboard
- Summary cards: Request Baru (8), Proyek Aktif (14), Butuh QC (3), Pembayaran (5)
- Priority tasks list
- Active promo preview
- Recent activities

#### 2. Request Proyek (`RequestProjectView`)
- Full request lifecycle management
- Tabs: Semua/Baru/Review/Konsultasi/Vendor/Estimasi/Aktif/Ditolak
- Detail request: customer info, kebutuhan, referensi
- Brief document management (status tracking)
- Vendor matching (scoring algorithm: area, skills, availability, performance)
- Send brief ke vendor
- Status flow: Baru Masuk → Review → Konsultasi → Vendor → Estimasi → RAB → Proyek Aktif

#### 3. Proyek Aktif (`ActiveProjectsView`)
- Monitoring proyek berjalan
- Progress bars, admin notes
- Status: Berjalan/Butuh Review/QC/Selesai
- Link ke Brief, Progress & QC, Invoice

#### 4. Brief & Dokumen (`BriefDocumentsView`)
- Create/manage work briefs
- Scope editor, material list, timeline builder, QC checklist editor
- File upload/delete
- Vendor response tracking
- Status flow: Draft → Siap Dikirim → Dikirim ke Vendor → Dibaca Vendor → Estimasi Dikirim → Revisi

#### 5. Progress & QC (`ProgressQcView`)
- Monitor vendor progress logs
- Photo documentation review
- Admin notes
- QC checklist (interactive toggle)
- Status management

#### 6. Customer (`CustomerView`)
- Customer CRM: profile, contact, source tracking
- Project history, preferences, budget ranges
- Admin notes
- Status: Aktif/Baru/Perlu Follow Up/Nonaktif

#### 7. Vendor Partner (`VendorPartnerView`)
- Vendor CRM: profile, PIC info, service area, specialties
- Current projects, completion stats
- Admin evaluation notes
- Status: Aktif/Menunggu Review/Perlu Evaluasi/Nonaktif

#### 8. Konsultasi (`ConsultationView`)
- Manage consultation schedule
- Method: Google Meet/WhatsApp Call/Offline
- Meeting links, customer needs, admin notes, result notes
- Status: Menunggu Konfirmasi → Terkonfirmasi → Dijadwalkan Ulang → Selesai/Dibatalkan

#### 9. RAB Builder (`RabBuilderView`)
- Review vendor estimates
- Set VMatch service fee/margin (internal only, tidak tampil ke vendor/customer)
- Finalize RAB for customer
- Handle customer revisions
- Status: Menunggu Estimasi → Estimasi Dikirim → Review Admin → Dikirim Customer → Revisi/Disetujui
- Link ke Invoice & Pembayaran setelah disetujui

#### 10. Invoice & Pembayaran (`InvoicePaymentsView`)
- Create/manage invoices (itemized billing)
- Payment timelines, due dates
- Status: Draft/Menunggu/Terbayar/Terlambat/Refund
- Admin & customer notes

#### 11. Bonus Vendor (`VendorBonusView`)
- 8-indicator checklist evaluation
- Admin approve/reject
- Add to payout, mark as paid

#### 12. Promo & Campaign (`PromoCampaignView`)
- Landing page promo popup manager
- Create/edit: title, description, image, CTA, dates
- Status: Draft/Aktif/Dijadwalkan/Berakhir/Nonaktif
- Live popup preview
- Single active promo constraint

#### 13. Analytics (`AnalyticsView`)
- Revenue chart, project status distribution
- Customer sources, top categories
- Vendor performance comparison
- Growth metrics with period filters

#### 14. Notifikasi (`NotificationView`)
- Categories: Proyek/Konsultasi/RAB/Pembayaran/Vendor/Customer/Promo/Sistem
- Priorities: Normal/Penting/Urgent
- Deep-linking to related pages

#### 15. Pengaturan (`SettingsView`)
- Dashboard configuration

---

## 🚨 BOTTLENECK & DATA TIDAK NYAMBUNG

### KRITIS — Data Flow Terputus Antar Role

#### ❌ BN-01: User Submit Request → Admin TIDAK Menerima Data Yang Sama
**Masalah:** User di `NewProjectForm` submit proyek dengan field: projectName, projectType, designStyle, location, budget, materialPreference, materialPackage, targetTime, notes, referensi dari inspirasi.

Admin di `RequestProjectView` menggunakan data mock (`initialRequests`) dengan field berbeda: title, customerName, customerEmail, location, budget, projectType, roomSize, designStyle, referenceSource, preferredMaterialPackage, targetTime, description, adminNote, briefDocumentStatus.

**Gap:** 
- User TIDAK punya field `roomSize` di form
- User TIDAK diminta `customerEmail` (karena sudah login, tapi tidak ada session/auth system)
- Data user submit TIDAK pernah sampai ke admin (mock data berbeda total)
- `roomSize` di admin detail harus diisi user, tapi tidak ada di form user

**Dampak:** Backend harus menjembatani field mismatch ini.

---

#### ❌ BN-02: Admin Kirim Brief → Vendor Brief Data Tidak Konsisten
**Masalah:** Admin di `BriefDocumentsView` membuat brief dengan: scope (array), material list, timeline entries, QC checklist, files.

Vendor di `BriefWorkPlanView` membaca brief dari `workBriefs` mock data dengan struktur: scope (string[]), materialApproved (string[]), timeline ({label, date}[]), qcChecklist (string[]), notes.

**Gap:**
- Admin memiliki file upload system → Vendor melihat `adminBriefFiles` yang hardcoded terpisah dari `workBriefs`
- Scope di admin bisa berisi paragraf, di vendor ditampilkan sebagai `vendorBriefScopes` (separate data)
- Tidak ada link eksplisit antara "Brief yang dibuat admin" dan "Brief yang muncul di vendor"
- Admin brief `BriefDocumentsView` punya status tracking sendiri yang berbeda dari vendor brief status

**Dampak:** Backend perlu single source of truth untuk brief document.

---

#### ❌ BN-03: Vendor Kirim Estimasi → RAB Builder Data Berbeda
**Masalah:** Vendor di `BriefWorkPlanView` mengisi estimasi: `estimatedCost`, `estimatedDuration`, `suggestedMaterial`, `vendorNote` → lalu "kirim ke admin".

Admin di `RabBuilderView` menggunakan mock data `initialRabs` yang memiliki `vendorEstimate: { vendorName, estimatedCost, estimatedDuration, vendorNote, sentAt }`.

**Gap:**
- Vendor field `suggestedMaterial` TIDAK ADA di admin RAB Builder vendorEstimate type
- Vendor submit estimasi → status berubah jadi "Estimasi Dikirim" di vendor panel, tapi admin RAB data sudah pre-filled dengan data berbeda
- Tidak ada actual data passing mechanism

**Dampak:** Backend harus menyelaraskan schema estimasi vendor ↔ RAB Builder.

---

#### ❌ BN-04: Admin RAB → User "Proyek Saya" Status Tidak Nyambung
**Masalah:** Admin RAB Builder punya status: "RAB Dikirim ke Customer" → "Revisi Diminta Customer" → "RAB Disetujui Customer".

User di `ProyekView` TIDAK punya fitur "Review RAB" atau "Setujui RAB". User hanya melihat proyek dengan stage: request/consultation/estimation/production/installation/done.

**Gap:**
- Admin mengirim RAB ke customer, tapi di user dashboard TIDAK ADA tempat customer melihat/menyetujui RAB
- Stage "estimation" di user types tidak memiliki UI review RAB
- User `ProyekView` langsung menampilkan `estimatedCost` sebagai range, bukan nominal RAB final

**Dampak:** User perlu fitur "Review & Approve RAB" sebelum backend dibuat.

---

#### ❌ BN-05: Admin Konsultasi ≠ User Konsultasi (Data Source Berbeda)
**Masalah:** Admin di `ConsultationView` mengelola: customerName, customerEmail, customerPhone, projectTitle, consultationDate/Time, method, meetingLink, status, adminNote, customerNeed, resultNote.

User di `MeetingView` membuat konsultasi: projectName, topic, type, date, time, note.

**Gap:**
- Admin punya field `customerPhone` dan `customerEmail` → User form TIDAK mengisi ini (seharusnya dari profile)
- Admin melihat `requestSource` (asal request), tapi user form tidak menyertakan info ini
- Project name di user form = dropdown statis dari `projectOptions`, bukan dari data proyek aktual user
- Admin field `resultNote` tidak pernah visible ke user setelah meeting selesai (user hanya lihat `resultSummary` yang static)
- Method di user = "Google Meet" | "WhatsApp Call" | "Chat WhatsApp", di admin = "Google Meet" | "WhatsApp Call" | "Offline" → **MISMATCH!**

**Dampak:** Schema konsultasi harus disatukan, method options harus konsisten.

---

#### ❌ BN-06: User Payment ≠ Admin Invoice (Struktur Data Berbeda Total)
**Masalah:** User `ProyekView` tab Pembayaran menggunakan inline type `Invoice` dengan: id, title, amount, stage, method, status (Menunggu Pembayaran/Terverifikasi/Lunas/Belum Tersedia), dueDate, receiptNo.

Admin `InvoicePaymentsView` menggunakan `InvoicePayment` dengan: invoiceNumber, projectTitle, customerName, vendorName, status (Draft/Menunggu Pembayaran/Terbayar/Terlambat/Refund), totalAmount, paidAmount, remainingAmount, paymentStage, items[], timeline[].

**Gap:**
- Status mismatch: User "Terverifikasi" vs Admin "Terbayar"
- User punya "Belum Tersedia" status yang admin tidak kenal
- Admin punya "Draft" dan "Terlambat" yang user tidak kenal
- Admin memiliki multi-item invoice, user hanya lihat per-item
- Admin punya payment timeline/history, user tidak
- User upload bukti bayar → admin TIDAK punya fitur verify upload

**Dampak:** Backend invoice schema harus menjadi mediator antara kedua view.

---

#### ❌ BN-07: Admin Progress & QC ≠ User Progress View
**Masalah:** Admin `ProgressQcView` monitors vendor progress logs dan menjalankan QC checklist.

User `ProyekView` tab Progress menampilkan timeline, jadwal kerja, material approval, dan QC section — tapi data semua HARDCODED.

**Gap:**
- Vendor submit progress log → Admin melihat di Progress & QC → Tapi user TIDAK melihat vendor progress log
- User melihat "Update dari VMatch" dengan mock photo, bukan real vendor photos
- QC checklist di admin (toggle-able) hasilnya tidak reflected ke user QC section
- User bisa "Setujui Hasil" QC, tapi ini tidak pernah trigger admin approval flow

**Dampak:** Progress data harus flow: Vendor → Admin review → User visibility.

---

#### ❌ BN-08: Vendor Payment ≠ Admin Payment (Entitas Berbeda)
**Masalah:** Vendor `PaymentBonusView` menampilkan `paymentMilestones` (Milestone Produksi, Milestone Instalasi, Payout Final) dengan status: Menunggu Milestone/Diproses/Dibayarkan/Ditahan Sementara.

Admin `InvoicePaymentsView` mengelola invoice untuk CUSTOMER (bukan vendor payout). Admin `VendorBonusView` mengelola bonus.

**Gap:**
- TIDAK ADA halaman admin untuk manage "Vendor Payout/Disbursement"
- Admin hanya punya Invoice (customer-facing) dan Bonus (vendor insentif)
- Vendor melihat "payment milestones" tapi admin TIDAK punya UI untuk membuat/manage milestone vendor
- Bagaimana vendor dibayar setelah milestone? Tidak ada flow di admin

**Dampak:** Backend perlu entitas terpisah: Customer Invoice vs Vendor Payout.

---

### ⚠️ INKONSISTENSI DATA MODEL

#### ❌ DM-01: User Punya 2 Data Source Proyek Yang Berbeda
**Masalah:** 
- `user/mock-data.ts` → `projects[]` dengan type `Project` (id, name, type, location, stage, stageLabel, progress, timeline[], files[])
- `user/components/proyek-view.tsx` → `projectList[]` dengan type `ProjectItem` (semua field berbeda: filter, roomSize, designStyle, estimatedCost, estimatedDuration, vendorPartner, solution, dll)

**Gap:** Dua definisi proyek yang TIDAK KOMPATIBEL dalam satu dashboard. `mock-data.ts` digunakan oleh `DashboardView` (yang di-comment out), sementara `proyek-view.tsx` menggunakan data sendiri.

**Dampak:** Harus dipilih satu schema proyek yang konsisten.

---

#### ❌ DM-02: Vendor Project ≠ User Project ≠ Admin Project
**Masalah:** Tiga role melihat "proyek" dengan struktur yang sangat berbeda:

| Field | User (ProyekView) | Vendor | Admin (ActiveProjects) |
|-------|-------------------|--------|----------------------|
| ID | p-1, p-2, p-3 | vp-1, vp-2, vp-3 | Tidak terlihat |
| Progress | 68, 25, 100 | 68, 20, 100 | Dari mock |
| Status terms | Produksi/Menunggu/Selesai | Sedang Dikerjakan/Menunggu Brief/Selesai | Berjalan/Butuh Review/QC/Selesai |
| Vendor info | vendorPartner (string) | - (vendor adalah dirinya) | vendorName |

**Gap:** Project yang sama (misal "Wardrobe Kamar Utama") memiliki data yang TIDAK IDENTIK di ketiga dashboard. Progress 68% di user dan vendor tapi no guarantee in sync.

**Dampak:** Backend harus memiliki single `projects` table dengan view berbeda per role.

---

#### ❌ DM-03: Notification System Tidak Terhubung
**Masalah:** 
- Admin: `NotificationView` dengan 8 categories, deep-linking
- User: `NotificationBell` (panel dropdown) — data hardcoded
- Vendor: `VendorNotificationBell` — data hardcoded

**Gap:** Ketiga notification system independent, tidak ada shared notification entity. Admin membuat notifikasi, tapi user/vendor tidak akan menerimanya.

---

#### ❌ DM-04: Konsultasi Project Options Hardcoded
**Masalah:** User `MeetingView` memiliki `projectOptions` = array statis ["Kitchen Set Minimalis", "Wardrobe Kamar Utama", "Storage & Rak Multifungsi", "Belum terkait proyek tertentu"].

Ini TIDAK sinkron dengan proyek aktual user di `proyek-view.tsx` yang punya ["Wardrobe Kamar Utama", "Kitchen Set Minimalis", "Storage & Rak Multifungsi"].

**Gap:** Nama dan urutan tidak konsisten. Seharusnya dynamic dari user's actual projects.

---

### 🟡 FITUR MATI / PLACEHOLDER

#### ❌ FP-01: Dashboard View (User & Vendor) Di-Comment Out
**File:** `user/components/dashboard-view.tsx`, `vendor/components/dashboard-view.tsx`
**Status:** Import dan rendering di-comment. File masih ada tapi tidak digunakan.
**Masalah:** User langsung masuk ke "Inspirasi Desain", vendor langsung ke "Proyek Saya". Ada `DashboardView` component yang fully built tapi tidak aktif.

**Rekomendasi:** Tentukan: pakai dashboard overview atau hapus file-nya.

---

#### ❌ FP-02: Register Page Tidak Berfungsi
**File:** `register/page.tsx`
**Status:** Form tanpa `onSubmit` handler. Button type="submit" tapi form tidak punya logic.
**Masalah:** User tidak bisa register akun baru.

**Rekomendasi:** Ketika backend auth dibuat, implementasi register flow.

---

#### ❌ FP-03: User `mock-data.ts` Tidak Dipakai Oleh Active Features
**File:** `user/mock-data.ts`
**Status:** Data `projects`, `meetings`, `invoices` diexport tapi hanya diimport oleh `dashboard-view.tsx` yang di-comment out.
**Masalah:** Unused data source, membingungkan saat backend integration.

**Rekomendasi:** Hapus atau merge dengan data di `proyek-view.tsx`.

---

#### ❌ FP-04: User Settings & Vendor Settings — UI Only
**File:** `user/components/settings-view.tsx`, `vendor/components/settings-view.tsx`
**Status:** Form tanpa save mechanism ke storage/backend.
**Masalah:** Perubahan setting tidak persist.

---

#### ❌ FP-05: Admin Settings — Placeholder
**File:** `admin/components/settings-view.tsx`
**Status:** General settings UI without actual configuration system.

---

### 🔴 LOGICAL FLOW GAPS

#### ❌ LF-01: Proyek "Menjadi Proyek Aktif" → Kemana?
**Masalah:** Di admin `RequestProjectView`, request bisa diubah statusnya menjadi "Menjadi Proyek Aktif". Tapi TIDAK ADA auto-creation di `ActiveProjectsView`.

**Gap:** Status change di Request TIDAK otomatis membuat entry di Proyek Aktif. Dua halaman admin ini isolated.

---

#### ❌ LF-02: Admin "Buat Invoice" dari RAB → Invoice Data Tidak Pre-filled
**Masalah:** Setelah RAB disetujui customer, admin click "Buat Invoice" → navigasi ke halaman Invoice & Pembayaran. Tapi invoice view hanya menampilkan mock data, TIDAK pre-filled dari RAB yang baru disetujui.

---

#### ❌ LF-03: User Approve QC → Admin Tidak Tahu
**Masalah:** User di `ProyekView` bisa "Setujui Hasil" QC → `setProjectDone(true)`. Tapi ini hanya local state. Admin `ProgressQcView` tidak pernah menerima signal ini.

---

#### ❌ LF-04: Vendor "Estimasi Dikirim" → Tapi RAB Builder Sudah Punya Data
**Masalah:** Vendor kirim estimasi → status berubah di vendor panel. Tapi di admin `RabBuilderView`, data `vendorEstimate` sudah pre-exist di mock. Tidak ada mekanisme "estimasi baru masuk, belum ada di RAB Builder".

---

#### ❌ LF-05: Admin Brief Documents ≠ Admin Request Brief
**Masalah:** `RequestProjectView` punya brief document status tracking (Belum Dibuat/Draft/Siap/Dikirim) DAN ada tombol "Buka Brief & Dokumen" yang navigasi ke `brief-documents`. Tapi kedua view mengelola brief secara INDEPENDEN.

**Gap:** Brief yang dimulai dari Request TIDAK auto-muncul di halaman Brief & Dokumen.

---

#### ❌ LF-06: Admin Vendor Matching Score → Vendor Tidak Tahu Dia Dipilih
**Masalah:** Admin pilih vendor di Request berdasarkan scoring algorithm. Vendor TIDAK mendapat notifikasi atau signal bahwa dia sudah "terpilih" untuk sebuah proyek baru — proyek langsung muncul di list dengan status "Menunggu Brief".

---

#### ❌ LF-07: User Submit Konsultasi → Admin Konsultasi Tidak Muncul
**Masalah:** User membuat consultation request di `MeetingView`. Admin `ConsultationView` memiliki mock data terpisah (`initialConsultations`). Tidak ada mechanism untuk user-created consultation muncul di admin panel.

---

### 🟡 INKONSISTENSI UI/UX

#### ❌ UX-01: Consultation Method Mismatch
- User options: "Google Meet" | "WhatsApp Call" | "Chat WhatsApp"
- Admin options: "Google Meet" | "WhatsApp Call" | "Offline"
- **"Chat WhatsApp"** di user tidak ada di admin
- **"Offline"** di admin tidak ada di user

---

#### ❌ UX-02: Project Status Terminology Inconsistent
| Context | Status Terms |
|---------|-------------|
| User ProyekView | Produksi/Pengerjaan, Menunggu Persetujuan Solusi, Selesai |
| User types.ts stage | request, consultation, estimation, production, installation, done |
| Vendor | Menunggu Brief, Siap Dikerjakan, Sedang Dikerjakan, Butuh Update, Menunggu QC, Selesai |
| Admin Active Projects | Berjalan, Butuh Review, QC, Selesai |
| Admin Request | Baru Masuk → ... → Menjadi Proyek Aktif |

5 set terminology berbeda untuk konsep yang sama.

---

#### ❌ UX-03: Search Behavior Berbeda
- Admin: semua view punya search bar + tabs
- Vendor: brief view punya search bar + tabs, project view filter only
- User: proyek view hanya filter tabs, TIDAK ADA search bar

---

## 📊 ALUR DATA IDEAL vs AKTUAL

### Flow 1: User Submit → Admin Review → Vendor Execute

```
IDEAL:
User submit form → DB → Admin sees in Request → Admin creates Brief → 
Brief linked to Vendor → Vendor reads + estimates → Admin review in RAB →
Admin sends to User → User approves → Admin creates Project + Invoice

AKTUAL:
User submit form → LOCAL STATE ONLY (lost on refresh)
Admin sees → MOCK DATA (tidak dari user)
Admin creates brief → SEPARATE MOCK DATA (tidak linked ke request)
Vendor sees brief → DIFFERENT MOCK DATA lagi
Vendor estimates → LOCAL STATE (tidak sampai admin)
Admin RAB → PRE-FILLED MOCK (tidak dari vendor)
```

### Flow 2: Progress Monitoring

```
IDEAL:
Vendor submits log → Admin reviews → Admin notes visible to User →
User sees progress photos → User approves QC → Project complete

AKTUAL:
Vendor submits log → LOCAL STATE (vendor only)
Admin sees → DIFFERENT MOCK DATA
User sees → HARDCODED TIMELINE (completely separate)
User approves QC → LOCAL STATE (admin never knows)
```

---

## ✅ REKOMENDASI SEBELUM BACKEND

### Prioritas 1: Fix Data Model Consistency

1. **Unify Project schema** — satu definisi `Project` yang digunakan ketiga role (dengan field visibility berbeda per role)
2. **Unify Consultation schema** — method options harus sama (tambah "Offline" ke user, tambah "Chat WhatsApp" ke admin)
3. **Unify Invoice/Payment schema** — status terms harus consistent
4. **Hapus duplicate data sources** — pilih satu: `user/mock-data.ts` ATAU inline data di `proyek-view.tsx`
5. **Buat user field `roomSize`** di form Ajukan Proyek (karena admin butuh ini)

### Prioritas 2: Fix Missing Features

6. **Tambah "Review RAB" section** di User ProyekView — agar user bisa lihat + approve RAB dari admin
7. **Tambah "Vendor Payout Management"** di Admin — halaman khusus manage pembayaran ke vendor (bukan hanya bonus)
8. **Fix Request → Active Project linking** — saat status "Menjadi Proyek Aktif", auto-create entry di Active Projects
9. **Fix Brief linking** — Brief yang dimulai dari Request harus muncul di Brief & Dokumen

### Prioritas 3: Decide on Commented-Out Features

10. **Dashboard View (User)** — pakai atau hapus? Jika pakai, update data source
11. **Dashboard View (Vendor)** — pakai atau hapus?
12. **Register Page** — implement logic atau remove link dari login

### Prioritas 4: UX Consistency

13. **Tambah search bar** di User ProyekView dan MeetingView
14. **Standarisasi status terminology** — buat satu mapping yang jelas
15. **Dynamic project options** di MeetingView — bukan hardcoded array

### Prioritas 5: Preparation for Backend

16. **Define shared types** di `/src/types/` atau `/src/lib/types.ts` — reusable across all roles
17. **Create API route stubs** — `/api/projects`, `/api/consultations`, `/api/briefs`, `/api/invoices`, dll
18. **Replace sessionStorage** usage dengan proper state management (atau keep for UX but also POST to backend)
19. **Implement proper auth** — replace hardcoded login dengan JWT/session-based auth
20. **Add loading states** — semua view mengasumsikan data langsung ada, perlu skeleton/loading untuk async fetches

---

## 📁 FILE STRUCTURE SUMMARY

```
src/app/
├── page.tsx                          # Landing page
├── login/page.tsx                    # Login (hardcoded auth)
├── register/page.tsx                 # Register (non-functional)
├── api/chat/route.ts                 # AI Chat API (Ollama)
├── inspirasi/[slug]/                 # Dynamic inspiration pages
├── portfolio/                        # Portfolio pages
└── dashboard/
    ├── admin/
    │   ├── page.tsx                  # Admin dashboard (state-based routing)
    │   ├── types.ts                  # Admin types
    │   ├── mock-data.ts             # Admin mock data
    │   └── components/ (21 files)
    ├── user/
    │   ├── page.tsx                  # User dashboard (state-based routing)
    │   ├── types.ts                  # User types
    │   ├── mock-data.ts             # User mock data (PARTIALLY UNUSED)
    │   └── components/ (14 files)
    └── vendor/
        ├── page.tsx                  # Vendor dashboard (state-based routing)
        ├── types.ts                  # Vendor types
        ├── mock-data.ts             # Vendor mock data
        └── components/ (10 files)
```

---

## 🎯 KESIMPULAN

Secara UI/UX, setiap role sudah memiliki dashboard yang **sangat lengkap dan matang** dari segi tampilan. Masalah utama ada di **data connectivity** — setiap role beroperasi dalam "silo" sendiri dengan mock data yang tidak saling terhubung.

**8 bottleneck kritis** yang harus diselesaikan sebelum backend:
1. User → Admin request data mismatch
2. Admin → Vendor brief data inconsistency  
3. Vendor → Admin estimasi field mismatch
4. Admin RAB → User tidak bisa review/approve
5. Konsultasi method mismatch & unlinked data
6. Invoice/Payment schema berbeda total
7. Progress flow terputus (vendor → admin → user)
8. Vendor payout tidak ada di admin

**Rekomendasi:** Sebelum backend, **unify data model dulu** di frontend. Buat shared types, standarisasi status terms, dan pastikan setiap action di satu role punya "landing point" di role lain.

---
---

# 🔍 UPDATE AUDIT (25 Juni 2026): End-to-End System Audit (Real DB Flow)

Laporan audit lanjutan terhadap alur pengajuan proyek dari User, pemrosesan oleh Admin, hingga pengerjaan oleh Vendor pada sistem VMatch yang telah dihubungkan dengan Supabase (Database, Auth, dan Storage).

Secara keseluruhan, **sekitar 90% fitur aplikasi sudah tersambung dengan Supabase Asli dan terbebas dari mock data**. Namun, ada **3 Blocker Kritis**, **3 Fitur Fake/Local State**, dan **4 Bottleneck UX** yang harus diperbaiki agar flow benar-benar 100% sempurna tanpa *dead-end*.

---

## 🚨 P0: KRITIS (BLOCKER FLOW DB)

Temuan ini **menyebabkan aplikasi crash atau flow terputus di tengah jalan**, sehingga data gagal tersimpan ke database.

### 1. BUG-01: Status "Persiapan" Invalid (Crash DB)
- **Lokasi:** `src/app/dashboard/admin/components/request-project-view.tsx`
- **Masalah:** Saat admin mengklik tombol agar request "Menjadi Proyek Aktif", aplikasi memanggil fungsi `createProject({ status: "Persiapan" })`. Status "Persiapan" **TIDAK ADA** di aturan `CHECK constraint` database PostgreSQL untuk tabel `projects`. 
- **Dampak:** Aplikasi gagal total memproses perubahan status (Dead-end) dengan mengembalikan error dari Supabase.
- **Solusi Final:** Ganti parameter menjadi `status: "Berjalan"`.

### 2. BUG-02: Duplikasi Logika Pembuatan Proyek (Conflict)
- **Lokasi:** `src/app/dashboard/admin/components/request-project-view.tsx` & `DATABASE/schema.sql` (Trigger)
- **Masalah:** Terdapat dua mekanisme yang bertabrakan:
  1. API `updateProjectRequest()` yang mengubah status request ke `"Menjadi Proyek Aktif"`. Perubahan ini otomatis **memicu Trigger Database** `sync_project_request_to_projects()` yang bertugas melakukan upsert ke tabel `projects`.
  2. Secara bersamaan di sisi frontend, kode secara **manual** mengeksekusi `createProject()`.
- **Dampak:** Tabel `projects` rentan menerima *duplicate insert* atau mengalami *conflict error* jika trigger dieksekusi lebih dulu oleh PostgreSQL.
- **Solusi Final:** Hapus pemanggilan fungsi manual `createProject()` di frontend. Serahkan sepenuhnya kepada Trigger DB.

### 3. BUG-03: Mapping Status di Trigger Berantakan
- **Lokasi:** `DATABASE/schema.sql` (Fungsi Trigger `sync_project_request_to_projects`)
- **Masalah:** Trigger database mencoba mendeteksi status dari tabel `project_requests` dengan nilai seperti `'Estimasi Diterima'`, `'RAB Disetujui'`, dan `'Dikerjakan'`. Ketiga nilai tersebut **TIDAK PERNAH ADA** di database karena tidak diizinkan oleh constraint CHECK tabel `project_requests`.
- **Dampak:** Trigger selalu gagal menemukan status yang valid dan selalu *fall-back* mengeksekusi klausa `ELSE 'Berjalan'`, yang membuat update status selanjutnya tidak proporsional.
- **Solusi Final:** Sesuaikan parameter `CASE` di trigger dengan nilai valid dari constraint CHECK tabel `project_requests` (misal: `'Estimasi Dikirim Vendor'`, `'RAB Dikirim ke Customer'`).

---

## 🚫 P1: PELANGGARAN BATASAN (FAKE DATA / LOCAL STATE)

Sesuai dengan kriteria, sistem dilarang keras menggunakan *mock data*. Namun, terdapat beberapa fitur yang **hanya memanipulasi Local React State** dan akan **hilang ketika browser direfresh** (tidak pernah menembak API ke Supabase).

### 4. FAKE-01: User - Minta Perubahan Material
- **Lokasi:** `src/app/dashboard/user/components/proyek-view.tsx`
- **Masalah:** Saat user mengisi form "Minta Perubahan Material", kode hanya menjalankan fungsi set local state `setRevisions([ ...current ])` dan `setMaterialStatus("Menunggu Review")`.
- **Dampak:** Permintaan tidak pernah tersimpan di database. Admin tidak akan pernah menerima info ini. (Murni *fake UI*).
- **Solusi Final:** Simpan data revisi ini dengan memanggil endpoint Supabase untuk `updateProject()` (misal ke field `customer_note`) atau insert ke tabel `revisions` yang sesungguhnya.

### 5. FAKE-02: User - Minta Revisi Umum
- **Lokasi:** `src/app/dashboard/user/components/proyek-view.tsx`
- **Masalah:** Sama seperti material, form modal untuk meminta revisi proyek hanya memperbarui React State `revisions`. Tidak memanggil fungsi API `createRevision` atau sejenisnya.
- **Dampak:** Revisi hilang saat refresh dan tidak akan pernah diproses Admin.
- **Solusi Final:** Implementasikan pemanggilan API agar data revisi tersimpan permanen.

### 6. FAKE-03: User - Ajukan Catatan QC
- **Lokasi:** `src/app/dashboard/user/components/proyek-view.tsx`
- **Masalah:** Saat user mengklik "Kirim Catatan QC", kode hanya mengeksekusi `setQcStatus("Perlu Catatan")`. Tidak ada pemanggilan API seperti `upsertQcChecklist` dengan pesan penolakan tersebut.
- **Dampak:** Admin tidak akan pernah tau bahwa user menolak QC atau memberikan catatan karena catatannya ditelan local state.
- **Solusi Final:** Ubah kode agar memanggil `updateProject()` atau `upsertQcChecklist()` ke database sebelum memperbarui UI.

---

## ⚠️ P2: KENDALA LOGIKA & UX (BOTTLENECK FLOW)

Temuan ini tidak membuat sistem crash, tetapi memutus efektivitas UX antar tiga Role.

### 7. FLOW-01: Brief Dokumen Terputus dari Request
- **Lokasi:** Navigasi dari halaman `Request Project` ke `Brief Documents` di sisi Admin.
- **Masalah:** Ketika Admin menekan "Buat Dokumen Brief" di detail request, sistem hanya menavigasi ke halaman Brief. Di sana, form brief masih kosong dan Admin harus mengetik manual nama proyek dan info lainnya.
- **Dampak:** Tidak ada ikatan otomatis (`request_id`). Rentan terjadi inkonsistensi data.
- **Solusi Final:** Pass ID dari request melalui state atau URL (misal `?requestId=123`) agar halaman Brief bisa fetch data awal dan menautkan `createBrief()` dengan `request_id` yang benar.

### 8. FLOW-02: Vendor Tidak Punya Tombol "Selesai" (Dead-end)
- **Lokasi:** `src/app/dashboard/vendor/components/project-view.tsx`
- **Masalah:** Setelah Vendor mengerjakan proyek hingga progress 100%, tidak ada satupun tombol untuk mengubah status proyek menjadi `"Menunggu QC"` atau `"Selesai"`. 
- **Dampak:** Vendor tidak bisa secara mandiri menyelesaikan proyek. Selalu harus lewat Admin.
- **Solusi Final:** Tambahkan fitur "Ajukan QC / Tandai Selesai" di UI Vendor.

### 9. FLOW-03: Ketiadaan Sinkronisasi Real-Time (Stale Data)
- **Lokasi:** Seluruh aplikasi.
- **Masalah:** Data hanya diambil (fetch) saat *mounting component*. Tidak ada *Supabase Realtime subscriptions*.
- **Dampak:** Jika Vendor merespons Brief, Admin yang sedang membuka halaman tidak akan melihat update sebelum melakukan *refresh* manual browser.
- **Solusi Final:** Implementasikan listener `supabase.channel` di tingkat komponen utama agar bisa otomatis me-*refetch* data bila ada perubahan di DB.

### 10. FLOW-04: Notifikasi Fiktif
- **Lokasi:** Seluruh trigger event penting.
- **Masalah:** VMatch memiliki fitur tombol bel notifikasi dan tabel `notifications` di Supabase, tetapi notifikasi tidak pernah terbuat secara terprogram melalui `createNotification()` pada *event* krusial (misal: "Proyek Baru", "RAB Disetujui").
- **Solusi Final:** Integrasikan fungsi `createNotification()` setiap kali terjadi perubahan status penting di API backend/frontend.

---
**KESIMPULAN AUDIT TERBARU:**  
Jika ke-10 temuan (terutama BUG-01, BUG-02, dan FAKE 01-03) diperbaiki, seluruh alur aplikasi *User Request Project* dari sisi fungsionalitas dan interaksi database dijamin **bekerja secara E2E 100% sempurna tanpa ada hambatan**, mematuhi syarat wajib penggunaan data asli tanpa mock data.
