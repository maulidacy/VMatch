# VMatch Platform — Redesign UX & Feature Spec (v2)

Dokumen ini adalah revisi total dari fitur.md sebelumnya berdasarkan masukan dosen.
Fokus: menjual fitur platform, UX yang realistis, dan flow bisnis yang masuk akal.

---

## 1. Role & Auth

### Role
- `client` — pemilik akun yang mengajukan proyek interior.
- `admin` — tim VMatch yang mengelola seluruh operasional.
- `vendor` — mitra produksi yang ditugaskan admin untuk mengerjakan proyek.

### Auth Flow
- Login via Google OAuth.
- Setelah login pertama kali → wajib isi profil (nama, no. WhatsApp, alamat).
- Role ditentukan saat registrasi atau di-assign admin.
- Redirect:
  - `client` → `/dashboard/user`
  - `admin` → `/dashboard/admin`
  - `vendor` → `/dashboard/vendor`
- Route protection middleware untuk semua dashboard.

---

## 2. Dashboard Client

### Sidebar Menu
- Dashboard (Overview)
- Ajukan Proyek
- Proyek Saya
- Konsultasi / Meeting
- Pembayaran
- Dokumen
- Katalog Desain
- VMatch AI Helper
- Pengaturan

### 2.1 Dashboard Overview
- Greeting + nama user
- Quick stats: proyek aktif, meeting mendatang, pembayaran pending
- Card proyek aktif (ringkasan status + progress bar)
- Notifikasi terbaru (meeting dikonfirmasi, invoice baru, progress update)

### 2.2 Ajukan Proyek (Form 1 Halaman Panjang)
Form single-page yang rapi, scroll ke bawah. Tidak ada step/wizard.

**Section A — Informasi Proyek**
- Nama proyek (text)
- Jenis proyek (Kitchen Set / Wardrobe / Living Room / Bedroom / Full Interior / Lainnya)
- Tipe properti (Rumah / Apartemen / Kantor / Kos / Hotel / Lainnya)
- Kota / Lokasi (text)
- Status properti (Sudah ditempati / Baru / Renovasi)

**Section B — Detail Ruangan**
- Ukuran ruangan (text, contoh: 3x4 meter)
- Tinggi plafon (text)
- Kondisi ruangan (Kosong / Ada furniture lama / Sebagian)
- Akses lokasi (Mudah / Sedang / Apartemen lift barang)
- Masalah yang ingin diselesaikan (textarea)

**Section C — Preferensi Desain**
- Gaya desain (Modern Minimalis / Japandi / Scandinavian / Industrial / Classic / Belum tahu)
- Material preferensi (HPL / Veneer / Solid wood / Kombinasi / Belum tahu)
- Warna dominan yang diinginkan (text, opsional)
- Prioritas utama (Harga / Kualitas / Desain unik / Kecepatan / Storage maksimal)

**Section D — Budget & Timeline**
- Estimasi budget (range dropdown: <30jt / 30-60jt / 60-100jt / 100-150jt / >150jt)
- Target mulai pengerjaan (Secepatnya / 1-2 minggu / 1 bulan / Fleksibel)
- Deadline selesai (Fleksibel / 1 bulan / 2 bulan / 3 bulan)

**Section E — Referensi Visual (Opsional)**
- Upload foto referensi (max 5 gambar)
- Catatan tambahan (textarea)

**Tombol:**
- `Simpan Draft` — simpan tanpa submit
- `Submit Proyek` — kirim ke admin, status jadi "Request Masuk"

### 2.3 Proyek Saya
- List semua proyek (card view)
- Filter: Semua / Aktif / Selesai / Draft
- Klik card → Detail Proyek

**Detail Proyek Client:**
- Info ringkasan (nama, lokasi, tipe, budget, status)
- Progress bar visual
- Timeline proyek (vertikal, progress-only, TANPA review/feedback di tiap step)
  - Request Diterima
  - Konsultasi & Penyesuaian
  - Estimasi & DP
  - Produksi
  - Instalasi
  - Selesai
- Catatan dari tim (read-only, diisi admin/vendor)
- File & dokumen terkait proyek
- Riwayat pembayaran proyek ini

### 2.4 Konsultasi / Meeting
- User bisa ajukan meeting KAPAN SAJA (sebelum atau sesudah buat proyek)
- Form ajukan meeting:
  - Pilih proyek terkait (opsional, bisa "Konsultasi Umum")
  - Pilih tanggal
  - Pilih waktu (slot WIB)
  - Catatan/agenda meeting (textarea)
- List meeting yang sudah diajukan:
  - Status: Menunggu Konfirmasi / Dikonfirmasi / Selesai / Dibatalkan
  - Jika dikonfirmasi → tampil link meeting (Google Meet)
  - Jika selesai → tampil catatan hasil meeting dari admin

### 2.5 Pembayaran
- List invoice dari admin
- Tiap invoice menampilkan:
  - Nama proyek
  - Deskripsi (misal: "DP 50% Kitchen Set Walnut")
  - Nominal
  - Status: Menunggu Pembayaran / Menunggu Verifikasi / Lunas / Ditolak
  - Tanggal jatuh tempo
- Aksi: Upload bukti pembayaran (foto)
- Setelah upload → status jadi "Menunggu Verifikasi"
- Admin verifikasi → status jadi "Lunas" atau "Ditolak" (dengan catatan)

**Flow Pembayaran yang Benar:**
1. User submit proyek
2. Admin review brief
3. Meeting/konsultasi (penyesuaian kebutuhan)
4. Admin edit brief sesuai hasil meeting
5. Admin buat estimasi biaya final
6. Admin kirim invoice DP ke user
7. User upload bukti bayar DP
8. Admin verifikasi → proyek masuk produksi
9. (Opsional) Invoice pelunasan di akhir sebelum instalasi

### 2.6 Dokumen
- List dokumen per proyek
- Tipe: Brief, RAB, Kontrak, Referensi, Progress Photo, Invoice
- Download file
- Dokumen di-upload oleh admin/vendor, visible ke client

### 2.7 Katalog Desain
- Browse inspirasi (sama seperti sekarang)
- Kategori: Rumah, Apartemen, Hotel, Kos
- Detail per area dengan gambar dan deskripsi

### 2.8 VMatch AI Helper
- Chat AI untuk konsultasi desain (sudah ada, pakai Ollama)
- Bisa rekomendasikan material, estimasi harga, gaya desain

### 2.9 Pengaturan
- Edit profil (nama, email, no. WA, alamat)
- Notifikasi preferences

---

## 3. Dashboard Admin

### Sidebar Menu
- Dashboard (Overview)
- Proyek
- Customer
- Vendor
- Invoice & Pembayaran
- Meeting
- Pengaturan

### 3.1 Dashboard Overview
- Stats: proyek aktif, request baru, meeting hari ini, invoice pending
- Recent activity feed
- Quick actions: Lihat request baru, Konfirmasi meeting

### 3.2 Proyek
- List semua proyek (table/card view)
- Filter: Request Masuk / Konsultasi / Estimasi / Produksi / Instalasi / Selesai
- Klik proyek → Detail Proyek Admin

**Detail Proyek Admin:**
- Info lengkap dari form user (semua field)
- **Tombol "Edit Brief"** — admin bisa mengubah SEMUA field form yang ditulis user
  - Biasanya dilakukan setelah meeting ada revisi
  - Perubahan tersimpan dengan audit trail (siapa, kapan, field apa yang berubah)
- Assign vendor (pilih dari list vendor terdaftar)
- Update status/stage proyek
- Timeline proyek (admin & vendor bisa tambah entry)
- Upload dokumen (RAB, kontrak, foto progress)
- Kirim invoice ke client
- Catatan internal (hanya visible admin & vendor)

**Admin Edit Brief:**
- Semua field dari form user bisa diedit
- Ada field "Catatan Revisi" (alasan perubahan, misal: "Sesuai hasil meeting 22 Mei")
- Simpan → revision history tercatat
- Client bisa lihat brief terbaru di detail proyek mereka

### 3.3 Customer
- List semua client terdaftar
- Info: nama, email, WA, lokasi, jumlah proyek, status
- Klik → lihat semua proyek client tersebut

### 3.4 Vendor
- List semua vendor terdaftar
- Info: nama, keahlian, lokasi, proyek aktif, rating
- Klik → detail vendor (profil, proyek yang di-assign, performa)
- Tombol "Tambah Vendor" (invite via email)

### 3.5 Invoice & Pembayaran
- List semua invoice yang sudah dikirim
- Filter: Menunggu / Verifikasi Pending / Lunas / Ditolak
- Buat invoice baru:
  - Pilih proyek
  - Deskripsi pembayaran
  - Nominal
  - Jatuh tempo
  - Rekening tujuan
- Verifikasi bukti bayar dari client:
  - Lihat foto bukti
  - Approve (status → Lunas) atau Reject (status → Ditolak + catatan)

### 3.6 Meeting
- List semua request meeting
- Filter: Menunggu / Dikonfirmasi / Selesai
- Aksi per meeting:
  - Konfirmasi (isi link Google Meet)
  - Reschedule (ubah tanggal/waktu, notif ke client)
  - Batalkan
  - Setelah meeting selesai → isi catatan hasil meeting
- Catatan hasil meeting visible di detail proyek (admin & client)

### 3.7 Pengaturan
- Profil admin
- Manage team members (jika multi-admin)

---

## 4. Dashboard Vendor

### Sidebar Menu
- Dashboard (Overview)
- Proyek Saya
- Tukang / Tim
- Absensi
- Pengaturan

### 4.1 Dashboard Overview
- Stats: proyek aktif yang di-assign, tukang terdaftar, absensi hari ini
- List proyek yang sedang dikerjakan
- Notifikasi dari admin (proyek baru di-assign, deadline reminder)

### 4.2 Proyek Saya (Vendor)
- List proyek yang di-assign oleh admin ke vendor ini
- Klik → Detail Proyek Vendor

**Detail Proyek Vendor:**
- Info proyek (dari brief yang sudah di-edit admin)
- Timeline/progress:
  - Vendor bisa tambah update progress (judul, deskripsi, foto)
  - Admin juga bisa tambah/edit
  - Keduanya bisa upload foto progress
  - Semua update sync ke client (client lihat di timeline mereka)
- Dokumen terkait (RAB, gambar kerja, spesifikasi)
- Catatan dari admin

**Siapa yang bisa edit progress:**
- Admin: bisa edit semua, bisa hapus
- Vendor: bisa tambah progress baru, bisa edit miliknya sendiri
- Client: read-only (lihat timeline + foto)

### 4.3 Tukang / Tim
- List tukang yang terdaftar di bawah vendor ini
- Info per tukang: nama, no. WA, keahlian, status (aktif/nonaktif)
- Tombol "Tambah Tukang":
  - Nama
  - No. WhatsApp
  - Keahlian (Kayu / Cat / Listrik / Plumbing / Umum)
  - Foto (opsional)
- Edit / Nonaktifkan tukang

### 4.4 Absensi
- Absensi harian tukang per proyek
- Vendor menandai kehadiran tukang tiap hari:
  - Pilih proyek
  - Pilih tanggal (default: hari ini)
  - Checklist tukang yang hadir
  - Catatan (opsional, misal: "Hujan, kerja setengah hari")
- **Visualisasi absensi:**
  - Calendar heatmap per bulan (hijau = hadir, merah = absen, abu = libur)
  - Summary: total hari kerja, rata-rata kehadiran
  - Per tukang: streak kehadiran, total hadir bulan ini
- Admin bisa lihat data absensi ini di detail proyek

### 4.5 Pengaturan
- Profil vendor (nama usaha, alamat, keahlian, portofolio)
- Manage akun

---

## 5. Flow Bisnis End-to-End (Revised)

### Flow Utama: Client → Admin → Vendor → Selesai

```
1. Client submit proyek (form 1 halaman)
   ↓
2. Admin terima request, review brief
   ↓
3. Meeting/konsultasi (bisa diajukan client kapan saja)
   - Admin konfirmasi jadwal
   - Meeting dilakukan (Google Meet)
   - Admin catat hasil meeting
   ↓
4. Admin edit brief sesuai hasil meeting (revision history)
   ↓
5. Admin buat estimasi biaya → kirim invoice DP ke client
   ↓
6. Client upload bukti bayar DP
   ↓
7. Admin verifikasi pembayaran
   ↓
8. Admin assign proyek ke vendor
   ↓
9. Vendor mulai produksi
   - Vendor update progress (foto, deskripsi)
   - Vendor absensi tukang harian
   - Admin monitor & bisa tambah update juga
   - Client lihat progress real-time
   ↓
10. Produksi selesai → Instalasi
    ↓
11. (Opsional) Invoice pelunasan → Client bayar sisa
    ↓
12. Proyek selesai
```

### Flow Meeting (Fleksibel)
- Client bisa ajukan meeting SEBELUM buat proyek (konsultasi umum)
- Client bisa ajukan meeting SESUDAH submit proyek (diskusi detail)
- Admin bisa juga yang inisiasi meeting (via notifikasi ke client)
- Setelah meeting → admin update brief / buat estimasi

### Flow Pembayaran
- TIDAK ada pembayaran otomatis saat submit
- Pembayaran HANYA terjadi setelah ada estimasi dari admin (post-meeting)
- Admin yang menentukan nominal DP (bisa 30%, 50%, atau custom)
- Client upload bukti transfer (foto)
- Admin verifikasi manual
- Bisa ada multiple invoice per proyek (DP + pelunasan + tambahan)

---

## 6. Project Stages (Revised)

### Stages (Admin Pipeline)
1. **Request Masuk** — brief baru dari client
2. **Konsultasi** — sedang/sudah meeting, penyesuaian brief
3. **Estimasi & DP** — admin sudah kirim invoice, menunggu pembayaran
4. **Produksi** — DP lunas, vendor mengerjakan
5. **Instalasi** — pemasangan di lokasi
6. **Selesai** — proyek complete

### Timeline Client (Simplified, No Review)
- Request Diterima ✓
- Konsultasi & Penyesuaian ✓
- Estimasi & Pembayaran DP ✓
- Produksi (dengan progress photo dari vendor/admin)
- Instalasi
- Selesai

---

## 7. Fitur Tambahan (UX Improvement)

### 7.1 Notifikasi Real-time
- Client: meeting dikonfirmasi, invoice baru, progress update, proyek selesai
- Admin: request baru, bukti bayar masuk, meeting request
- Vendor: proyek baru di-assign, deadline reminder

### 7.2 WhatsApp Integration
- Nomor WA wajib saat profil pertama kali
- Notifikasi penting juga dikirim via WA (opsional, fase lanjut)

### 7.3 Activity Log
- Semua perubahan penting tercatat:
  - Brief diubah (oleh siapa, kapan)
  - Status berubah
  - Invoice dikirim/dibayar
  - Meeting dijadwalkan/selesai
  - Progress ditambah

### 7.4 Dashboard Metrics
- Admin: conversion rate (request → deal), rata-rata durasi proyek, revenue bulanan
- Vendor: proyek selesai bulan ini, rata-rata kehadiran tukang, on-time delivery rate

### 7.5 File Management
- Organized per proyek
- Kategori: Brief, RAB, Kontrak, Referensi, Progress, Invoice
- Upload oleh admin & vendor
- Visible ke client (kecuali yang ditandai internal)

### 7.6 Rating & Review (Post-Project)
- Setelah proyek selesai, client bisa kasih rating (1-5 bintang)
- Review singkat tentang pengalaman
- Rating ini masuk ke profil vendor
- Ditampilkan di landing page sebagai testimonial (jika diizinkan)

### 7.7 Project Chat/Notes
- Thread diskusi per proyek (admin ↔ vendor)
- Catatan internal yang tidak terlihat client
- Berguna untuk koordinasi tanpa keluar platform

---

## 8. Database Entities (Revised)

### users
- id, google_id, email, name, avatar_url, phone (wajib)
- role: client / admin / vendor
- is_profile_complete: boolean
- created_at, updated_at

### vendor_profiles
- id, user_id
- business_name, address, city
- specializations (array: Kitchen Set, Wardrobe, dll)
- description, portfolio_url
- rating_avg, total_projects_completed
- status: active / inactive
- created_at, updated_at

### workers (tukang)
- id, vendor_id
- name, phone, specialization
- photo_url
- status: active / inactive
- created_at

### projects
- id, client_id, vendor_id (nullable, di-assign admin)
- title, property_type, location, city
- property_status, room_size, ceiling_height
- room_condition, location_access
- problem_description
- style_preference, material_preference
- dominant_color, priority
- budget_range, target_start, deadline
- additional_notes
- stage: request / consultation / estimation / production / installation / done
- status: draft / submitted / active / completed / cancelled
- submitted_at, created_at, updated_at

### project_brief_revisions
- id, project_id
- changed_by (user_id)
- changes_json (field → {old, new})
- revision_note
- created_at

### consultations
- id, project_id (nullable, bisa konsultasi umum)
- client_id, admin_id
- requested_by
- date, start_time, end_time, timezone
- agenda (text)
- meeting_url
- status: requested / confirmed / rescheduled / cancelled / done
- meeting_notes (diisi admin setelah meeting)
- created_at, updated_at

### invoices
- id, project_id, client_id
- created_by (admin_id)
- description
- amount
- bank_account_info
- due_date
- status: pending / awaiting_verification / paid / rejected
- payment_proof_url
- payment_date
- verified_by
- rejection_note
- created_at, updated_at

### project_progress
- id, project_id
- created_by (admin_id atau vendor user_id)
- title, description
- progress_date
- photos (array of urls)
- is_visible_to_client: boolean (default true)
- created_at, updated_at

### worker_attendance
- id, project_id, worker_id, vendor_id
- date
- is_present: boolean
- note
- marked_by (vendor user_id)
- created_at

### documents
- id, project_id
- title, file_url, file_type, file_size
- category: brief / rab / contract / reference / progress / invoice / other
- uploaded_by
- visibility: all / admin_vendor / admin_only
- created_at

### notifications
- id, user_id
- type: meeting_confirmed / invoice_new / progress_update / project_assigned / payment_received / etc
- title, message
- reference_type (project / invoice / consultation)
- reference_id
- is_read: boolean
- created_at

### project_notes (internal chat admin ↔ vendor)
- id, project_id
- author_id
- content
- created_at

### ratings
- id, project_id, client_id, vendor_id
- score (1-5)
- review_text
- is_public: boolean
- created_at

### activity_log
- id, user_id, project_id (nullable)
- action: brief_edited / status_changed / invoice_sent / meeting_scheduled / progress_added / etc
- details_json
- created_at

---

## 9. Enum & Status

### Project Stage (Admin Pipeline)
- request
- consultation
- estimation
- production
- installation
- done

### Project Status
- draft
- submitted
- active
- completed
- cancelled

### Invoice Status
- pending (belum dibayar)
- awaiting_verification (bukti sudah diupload)
- paid (admin verified)
- rejected (bukti ditolak)

### Consultation Status
- requested
- confirmed
- rescheduled
- cancelled
- done

### Worker Specialization
- Kayu
- Cat
- Listrik
- Plumbing
- Umum

### Document Category
- brief
- rab
- contract
- reference
- progress
- invoice
- other

### Notification Type
- meeting_confirmed
- meeting_requested
- invoice_new
- invoice_paid
- invoice_rejected
- progress_update
- project_assigned
- project_completed
- brief_revised

---

## 10. Perbedaan dari Versi Sebelumnya

| Aspek | Sebelumnya | Sekarang |
|-------|-----------|----------|
| Role | client + admin | client + admin + **vendor** |
| Form proyek | 4-step wizard | **1 halaman panjang** |
| Review di timeline | Ada di tiap step | **Dihapus** (timeline = progress only) |
| Meeting | Hanya setelah buat proyek | **Kapan saja** (sebelum/sesudah) |
| Pembayaran | Tidak ada flow | **Invoice dari admin → upload bukti → verifikasi** |
| Estimasi | Tidak ada | **Admin buat setelah meeting** |
| Vendor | Hanya list di admin | **Punya dashboard sendiri** |
| Progress update | Hanya admin | **Admin + vendor** bisa update |
| Absensi tukang | Tidak ada | **Vendor catat harian + visualisasi** |
| Brief editing | Admin bisa edit | Admin edit + **revision history + catatan** |
| Pipeline stages | 5 stages | **6 stages** (tambah Estimasi & DP) |

---

## 11. Prioritas Implementasi

### Phase 1 — Core Flow (MVP)
- [ ] Auth Google + role-based redirect
- [ ] Profil wajib (nama, WA) setelah login pertama
- [ ] Form proyek 1 halaman (client)
- [ ] List proyek + detail (client)
- [ ] Admin: list proyek, detail, edit brief
- [ ] Meeting request + konfirmasi
- [ ] Invoice + upload bukti bayar

### Phase 2 — Vendor & Progress
- [ ] Vendor dashboard
- [ ] Assign proyek ke vendor
- [ ] Progress update (admin + vendor)
- [ ] Tukang management
- [ ] Absensi harian + visualisasi

### Phase 3 — Polish & Extras
- [ ] Notifikasi real-time
- [ ] Activity log
- [ ] Rating post-project
- [ ] Project notes (internal)
- [ ] Dashboard metrics/analytics
- [ ] Katalog dinamis dari database

---

## 12. Catatan UI

- Semua dashboard pakai sidebar navigation (bukan tab horizontal)
- Palette tetap konsisten dengan landing page (warm neutral: #31332c, #6b5b52, #f7f4ef)
- Form 1 halaman: section diberi heading + spacing yang jelas, scroll smooth
- Timeline proyek: vertikal, clean, hanya progress (tidak ada input review dari client)
- Absensi: calendar heatmap (hijau/merah/abu)
- Invoice: card dengan status badge yang jelas
- Mobile: sidebar jadi hamburger menu
- Semua upload foto: preview sebelum submit
