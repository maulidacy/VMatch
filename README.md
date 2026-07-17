# VMatch Interior — End-to-End Project Management Platform

**VMatch Interior** adalah platform manajemen proyek interior *end-to-end* yang menghubungkan tiga pihak utama: **Customer (User)**, **Admin VMatch**, dan **Vendor Partner**. Platform ini dirancang untuk mendigitalkan seluruh siklus proyek interior — mulai dari pencarian inspirasi desain, pengajuan proyek, pencocokan vendor, pembuatan RAB, pelacakan progres pengerjaan, hingga quality control dan pembayaran — dalam satu ekosistem web yang terintegrasi.

Dengan pendekatan *managed marketplace*, VMatch bertindak sebagai penghubung profesional antara customer yang membutuhkan jasa interior dengan vendor yang menyediakan layanan tersebut. Admin VMatch berperan sebagai orchestrator yang memastikan kualitas, transparansi, dan kelancaran setiap proyek dari awal hingga akhir.

Secara sederhana alurnya: **User mengajukan proyek → Admin meninjau, menyusun RAB, dan menugaskan → Vendor mengeksekusi dan melaporkan progres → Admin mengontrol QC & Pembayaran → User melacak semuanya secara transparan.** Semua terintegrasi ke backend database tanpa variabel palsu.

---

## 🚀 Fitur Lengkap per Role

### 1. User Role (Customer Dashboard)

- **Inspirasi Desain**: Katalog visual bagi pengguna untuk mencari ide desain interior.
- **Ajukan Proyek**: Formulir lengkap untuk mengirimkan proyek baru beserta lampiran spesifikasinya.
- **Proyek Saya**: *Tracking* proyek secara komprehensif. Di dalamnya terdapat tab turunan:
  - **Ringkasan**: Detail proyek dan spesifikasi material.
  - **RAB & Estimasi**: Persetujuan dan rincian Rencana Anggaran Biaya.
  - **Progress**: *Timeline* masa pengerjaan dan foto *update*.
  - **Pembayaran**: Daftar invoice digital dan riwayat pelunasan (dengan nomor kuitansi dinamis).
  - **Dokumen**: Penyimpanan kesepakatan dan klaim garansi.
- **Konsultasi**: Penjadwalan pertemuan/diskusi.
- **VMatch AI**: Asisten obrolan cerdas (*AI Chat*) untuk membantu *brainstorming* konsep ruang.
- **Pengaturan**: Profil akun pengguna.
- **Notifikasi & Floating WhatsApp**: Panel lonceng notifikasi (terkoneksi database) dan widget chat langsung ke layanan pelanggan.

---

### 2. Admin Role (Operational Dashboard)

- **Dashboard Overview**: Menampilkan ringkasan analitik seperti jumlah *request* baru, proyek aktif, antrean QC, dan pembayaran, serta status Promo.
- **Promo & Campaign**: Fitur untuk menambah dan mengatur spanduk promo/kampanye yang tampil di *landing page*.
- **Request Proyek**: Menerima pengajuan baru dari User, membuat estimasi awal, dan menilaikan Vendor.
- **Proyek Aktif**: Memantau proyek yang berstatus produksi.
- **Brief & Dokumen**: Mengelola dokumen *timeline*, form spesifikasi material, dan penyusunan *check-list* QC.
- **Progress & QC**: Memantau laporan kerja harian/mingguan dari Vendor dan melakukan *Quality Control*.
- **Invoice & Pembayaran**: Manajemen penagihan dana ke User dan *payout* ke Vendor.
- **RAB Builder**: Antarmuka pembuat RAB interaktif untuk menghitung estimasi biaya proyek secara akurat.
- **Bonus Vendor**: Menentukan standar dan pencapaian insentif bagi vendor dengan kinerja baik.
- **Manajemen Relasi (Customer & Vendor)**: Halaman untuk melihat detail profil pelanggan dan mitra pemborong.
- **Konsultasi & Analytics**: Jadwal pertemuan lintas pihak dan metrik wawasan bisnis.

---

### 3. Vendor Role (Partner Dashboard)

- **Proyek Aktif**: Menerima penugasan (*assignment*) proyek dari Admin VMatch beserta status utamanya.
- **Brief & Work Plan**: Membaca dokumen *brief* pekerjaan, spesifikasi material, dan jadwal kerja yang sudah disusun oleh Tim Admin.
- **Progress Log**: Area bagi Vendor untuk mengunggah foto progres nyata dan menulis catatan pengerjaan (komponen foto siap produksi, tidak ada teks "Mock" lagi).
- **Pembayaran & Bonus**: Menelusuri keuangan vendor untuk melacak *payout* dari VMatch dan status bonus pencapaian QC.
- **Pengaturan & Notifikasi**: Manajemen akun vendor dan notifikasi status (*assignment* baru, status pencairan dana, dll.).

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.x |
| UI Library | React | 19.2.x |
| Bahasa | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Backend & Database | Supabase (PostgreSQL + Auth + Storage + RLS) | — |
| AI Chat & Brief | Groq API + OpenRouter (fallback) | — |
| Animasi | Framer Motion | 12.x |
| Ikon | Lucide React | 1.x |
| Notifikasi Toast | Sonner | 2.x |

---

## 📁 Struktur Folder Utama

```text
VMatch/
├── DATABASE/
│   ├── schema.sql                          # Skema lengkap PostgreSQL (17 tabel + RLS + trigger)
│   ├── fix_auth_profiles.sql               # Patch trigger handle_new_user() / sinkronisasi profiles
│   └── 2026-06-24_sync_project_requests_to_projects.sql  # Migrasi trigger request → projects
├── public/
│   ├── figma/                              # Aset gambar landing page (.webp)
│   ├── inspirations/                       # Aset galeri inspirasi per kategori (rumah, apartment, hotel, boarding)
│   └── testimonials/                       # Foto klien pada section testimoni
├── src/
│   ├── proxy.ts                            # Proxy Next.js 16 → updateSession() Supabase + proteksi rute per role
│   ├── app/
│   │   ├── page.tsx                        # Landing page utama
│   │   ├── layout.tsx                      # Root layout + metadata SEO
│   │   ├── globals.css                     # Stylesheet global (Tailwind 4)
│   │   ├── icon.webp / apple-icon.webp     # Favicon & ikon PWA
│   │   ├── login/ & register/              # Halaman otentikasi
│   │   ├── portfolio/
│   │   │   ├── page.tsx                    # Indeks portofolio publik
│   │   │   └── [slug]/page.tsx             # Detail satu proyek portofolio
│   │   ├── inspirasi/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                # Kategori inspirasi
│   │   │       └── [detailSlug]/page.tsx   # Detail item inspirasi
│   │   ├── api/
│   │   │   ├── chat/route.ts               # Endpoint VMatch AI Chat (streaming SSE)
│   │   │   ├── ai/brief/route.ts           # Endpoint AI Brief Generator
│   │   │   └── ai/image/route.ts           # Endpoint AI Image Generation
│   │   └── dashboard/
│   │       ├── layout.tsx                  # Layout bersama seluruh dashboard
│   │       ├── admin/                      # Modul Dashboard Admin — page.tsx, types.ts, mock-data.ts, components/ (21 komponen)
│   │       ├── user/                       # Modul Dashboard Customer — page.tsx, types.ts, components/ (16 komponen)
│   │       └── vendor/                     # Modul Dashboard Vendor — page.tsx, types.ts, mock-data.ts, components/ (10 komponen)
│   ├── components/
│   │   ├── home/                           # Komponen UI Landing Page (navbar, carousel, helper) + sections/ (15 section)
│   │   ├── shared/project-detail.tsx       # Viewer detail proyek lintas role
│   │   └── ui/text-shimmer.tsx             # Primitif UI generik
│   └── lib/
│       ├── home-content.ts                 # Sumber konten statis landing page, portofolio & inspirasi
│       ├── api/                            # Data Access Layer Supabase (index.ts sebagai barrel)
│       │   ├── projects.ts                 # Mutasi inti Request, Proyek, Brief, RAB, Invoice, QC, dll.
│       │   ├── chat.ts                     # Persistensi sesi & pesan AI chat
│       │   ├── storage.ts                  # Upload/URL aset ke Supabase Storage
│       │   └── consultations.ts, inspirations.ts, notifications.ts, profiles.ts, promos.ts
│       ├── auth/actions.ts                 # Server actions login, register, logout
│       ├── hooks/                          # use-auth.ts (sesi & role), use-query.ts (fetch state)
│       └── supabase/                       # client.ts, server.ts, middleware.ts, types.ts (tipe skema DB)
├── next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs
└── package.json
```

---

## 🗄️ Arsitektur Database (PostgreSQL)

Sistem VMatch menggunakan **17 tabel utama** dengan skema perlindungan *Row Level Security* (RLS) yang ketat untuk memastikan isolasi privasi data:

| No | Tabel | Fungsi |
|---|---|---|
| 1 | `profiles` | Profil tersinkronisasi (extends auth.users) — menyimpan role, relasi kontak, dll. |
| 2 | `project_requests` | Hulu pengajuan sebelum menjadi proyek (*Draft* / *Review*). |
| 3 | `projects` | Proyek inti operasional (di-*generate* via eksekusi trigger ketika vendor terpilih). |
| 4 | `briefs` | Spesifikasi instruksi kerja dari admin untuk vendor. |
| 5 | `brief_files` | Dokumen lampiran pada *brief*. |
| 6 | `vendor_estimates` | Dokumen penawaran harga & estimasi dari vendor. |
| 7 | `rab` | Harga kontrak mengikat yang diterbitkan sistem bagi pelanggan. |
| 8 | `consultations` | Tabel jadwal konsultasi rapat tiga pihak. |
| 9 | `invoices` | Distribusi tagihan kepada *customer*. |
| 10| `vendor_payouts`| Rincian *milestone* penarikan kas untuk modal vendor. |
| 11| `progress_logs` | Bukti kerja riil di lapangan beserta laporan foto logistik harian. |
| 12| `qc_checklists` | Penilaian parameter kendali mutu (*Quality Control*). |
| 13| `vendor_bonuses`| Tabel matriks bonus atas kepatuhan standar mutu. |
| 14| `notifications` | Sistem antrean notifikasi (lonceng) *multi-role*. |
| 15| `promos` | CMS publikasi promo pada halaman mendarat (*Landing Page*). |
| 16| `warranty_claims`| Data jaminan pemeliharaan purnajual proyek. |
| 17| `field_teams` | Identitas manajemen regu kerja vendor. |

### Fitur Database Lanjutan
- **Auto-create profile**: *Trigger* `handle_new_user()` yang langsung memetakan pendaftar baru dari sesi *Supabase Auth* menuju tabel entitas `profiles`.
- **Sync project_requests → projects**: *Trigger* `sync_project_request_to_projects()` mengotomasi perpindahan siklus dari tahap antrean (pengajuan) menjadi *proyek produksi* saat Admin memilih Vendor.
- **Row Level Security (RLS)**: Hak akses terkunci kuat (*Admin* mengakses 100%, *User/Vendor* diblokir dari tabel milik orang lain menggunakan verifikasi klaim UUID sesi).

---

## 🔄 Cara Kerja Aplikasi End-to-End

Berikut adalah penjelasan mendetail tentang alur kerja platform VMatch dari perspektif operasional menyeluruh:

### 🏠 Fase 1: Publik (Tanpa Login)
Pengunjung disambut oleh *Landing Page Profesional* dinamis yang menampilkan **Galeri Inspirasi**, Penjelasan Layanan, Showcase Portofolio, serta *Popup Promo* yang datanya ditarik langsung (aktif/non-aktif) oleh Admin.

### 👤 Fase 2: Registrasi & Login (Middleware Routing)
- **Registrasi**: Mendaftar membuat *instance* baru. Sistem *backend* memberikan *role* bawaan `user`.
- **Proteksi Akses**: Saat masuk, *proxy* Next.js (`src/proxy.ts`) mengarahkan pengguna ke *dashboard* yang sesuai (`/dashboard/user`, `/dashboard/admin`, atau `/dashboard/vendor`) dan menolak percobaan manipulasi URL antar-*role*.

### 🛋️ Fase 3: Flow Customer (User)
- Customer memanfaatkan **AI Brief Generator** untuk mempermudah spesifikasi desain hanya dengan mengetik deskripsi santai. AI menstrukturisasinya menjadi parameter proyek.
- Setelah *request* diajukan, Customer masuk ke layar monitor. Selama pengerjaan, Customer dapat melacak persentase progres, melihat unggahan foto dari Vendor secara *real-time*, membayar dokumen *Invoice*, hingga me-reviu hasil *QC Checklist* bila proyek rampung.

### ⚙️ Fase 4: Flow Admin (Operasional & Orkestrasi)
Admin menjadi 'otak' sistem:
- Meninjau *request* masuk `(Baru Masuk → Menunggu Review → Disetujui)`.
- **Assign Vendor**: Mengirim proyek ke *dashboard* Vendor mitra yang cocok.
- **Brief & RAB Builder**: Menyusun *Brief Kerja*, menerima estimasi harga dari Vendor, dan merangkumnya menjadi dokumen RAB final siap-bayar untuk dikirim ke Customer.
- Memantau log progres Vendor harian dan menilai standar kualitas (`QC`).

### 🔧 Fase 5: Flow Vendor (Pelaksana)
- Menerima pesanan (*assignment*) proyek.
- Menyepakati RAB dan tenggat waktu (*timeline*).
- Secara disiplin wajib menekan tombol **Update Progress Log**, mendeskripsikan ringkasan kerja hari itu, kendala, mengunggah foto aktual dari lokasi, dan melihat target `Payout` dari Admin.

### 🚀 Alur Eksekusi Utuh (Ringkasan Workflow)
```text
Customer (Request) ➔ AI Analysis ➔ [project_requests]
       ↓
Admin (Review & Assign) ➔ [Trigger DB = projects]
       ↓
Admin (Buat Brief) ➔ Vendor (Beri Estimasi Harga) ➔ Admin (RAB Builder)
       ↓
Customer (Setujui RAB) ➔ Admin (Buat Invoice) ➔ Customer (Bayar)
       ↓
Vendor (Produksi) ➔ (Kirim Progress Log & Foto Harian)
       ↓
Proyek Selesai ➔ Admin (QC Checklist) ➔ Customer (Approve QC)
       ↓
Admin (Cairkan Payout & Bonus Vendor) ➔ [Proyek Ditutup / Bergaransi]
```

---

## 🔐 Keamanan Data & Proteksi
- *Authentication* dikendalikan penuh oleh **Supabase Auth** berbasis enkripsi tingkat lanjut (*salt/hash*).
- Komunikasi interaktif lintas *role* (seperti *Chat AI*) dijaga melalui mekanisme *Server-Sent Events (SSE)* untuk mempertahankan *stateless secure socket*.
- Manipulasi URL di sisi *Client* secara ketat dicegah (Vendor mencoba membuka rute `/admin` akan otomatis di-lempar (*redirect*) keluar).

---

## 🤖 Integrasi AI (Kecerdasan Buatan)
Sistem memiliki integrasi dua mesin berbasis Groq API / OpenRouter (LLM):
1. **AI Brief Generator** (`/api/ai/brief`): *Natural Language Understanding* untuk membedah input keinginan ruang yang kasar menjadi parameter variabel *json* (Gaya, Target Biaya, Opsi Eksekusi, dan Validasi Kebutuhan).
2. **VMatch AI Consultant** (`/api/chat`): Asisten cerdas bergaya obrolan (chat) untuk memberi rekomendasi teoretis palet warna, ergonomi ruang, membandingkan bahan (*trade-off*), hingga kalkulasi *budget* virtual di *sidebar* layar pengguna.

---

## 🧪 Skrip Utilitas (Scripts)

| Perintah Terminal | Fungsi |
|---|---|
| `npm run dev` | Menjalankan *development server* lokal untuk *debugging* |
| `npm run build` | Mengompilasi aplikasi (SSR/SSG/Turbopack) untuk kesiapan produksi |
| `npm run start` | Menjalankan arsitektur penuh layaknya *host server* sungguhan |
| `npm run lint` | Eksekusi *Type Checking* (TS) dan ESLint validator |
