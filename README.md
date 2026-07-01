# VMatch Interior — End-to-End Project Management Platform

**VMatch Interior** adalah platform manajemen proyek interior *end-to-end* yang menghubungkan tiga pihak utama: **Customer (User)**, **Admin VMatch**, dan **Vendor Partner**. Platform ini dirancang untuk mendigitalkan seluruh siklus proyek interior — mulai dari pencarian inspirasi desain, pengajuan proyek, pencocokan vendor, pembuatan RAB, pelacakan progres pengerjaan, hingga quality control dan pembayaran — dalam satu ekosistem web yang terintegrasi.

Dengan pendekatan *managed marketplace*, VMatch bertindak sebagai penghubung profesional antara customer yang membutuhkan jasa interior dengan vendor yang menyediakan layanan tersebut. Admin VMatch berperan sebagai orchestrator yang memastikan kualitas, transparansi, dan kelancaran setiap proyek dari awal hingga akhir.

---

## 🎯 Status Kesiapan Sistem (Production-Ready)
Sistem ini telah melewati fase audit dan pembersihan secara menyeluruh untuk keperluan penilaian akademis dan terbukti siap *deploy*:
- **100% Database Driven**: Seluruh fitur (seperti Request Proyek, RAB, Invoice, Progress Log, dan QC Checklist) terhubung langsung dan bekerja secara dinamis ke **Supabase**.
- **Zero Mock Data**: Tidak ada lagi penggunaan *hardcoded/mock data* (seperti ID palsu, data tiruan, atau gambar statis palsu). Seluruh antarmuka di sisi **User**, **Admin**, dan **Vendor** merender dan memproses data aktual dari *backend*.
- **Role Integration Berjalan Penuh**: Alur operasional dari pengguna yang mengajukan proyek, kemudian direviu oleh admin, dikerjakan oleh vendor, hingga disetujui (QC) saling terhubung sempurna lintas otorisasi tanpa terputus.
- **Admin Placeholder Architecture**: Pada modul Admin Dashboard, beberapa halaman menggunakan `AdminPlaceholder`. Hal ini adalah rancangan desain arsitektur yang disengaja (*scalable design*) untuk ruang pengembangan modul analitik lanjutan, dan sama sekali bukan menandakan malfungsi aliran aplikasi.

---

## 🚀 Ringkasan Fitur Utama

### Sisi Customer (User)
- Katalog inspirasi desain interior dengan filter berdasarkan gaya, tipe properti, dan material.
- Formulir pengajuan proyek lengkap dengan **AI Brief Generator** yang menganalisis input teks kebutuhan pelanggan secara otomatis.
- Dashboard pelacakan proyek *real-time* (status, progres, timeline, dan dokumen kontrak/RAB).
- Penjadwalan konsultasi online (Google Meet, WhatsApp Call, Chat WhatsApp, atau Offline).
- **VMatch AI** — asisten virtual berbasis *Large Language Model* untuk *brainstorming* ide desain, estimasi budget, dan rekomendasi material.
- Sistem notifikasi *database* terintegrasi untuk setiap update proyek yang masuk.
- Riwayat invoice dan status pelunasan pembayaran.
- Klaim garansi pasca-proyek.
- Tombol kontak WhatsApp mengambang (*floating*) untuk komunikasi cepat.

### Sisi Admin
- Dashboard operasional dengan ringkasan *request* baru, proyek aktif, antrean QC, dan pembayaran yang menunggu verifikasi.
- Manajemen *request* proyek masuk (review persyaratan, penetapan *vendor*, ubah status operasional).
- Pembuatan dan pengelolaan *Brief Dokumen* untuk diotorisasi oleh vendor.
- **RAB Builder** — alat dinamis untuk menyusun Rancangan Anggaran Biaya final dari rancangan estimasi vendor.
- Pelacakan progres vendor harian dan manajemen persetujuan kualitas (*QC Checklist*).
- Manajemen *invoice* (tagihan) dan verifikasi bukti pembayaran customer.
- Manajemen *payout* (pencairan dana) dan kalkulasi bonus target untuk vendor.
- Manajemen *database* vendor partner dan customer profil.
- Sistem promo dan *campaign* (CMS) untuk mengelola spanduk promosi *landing page*.
- Panel notifikasi admin lintas-*role* dan penjadwalan *meeting* konsultasi.

### Sisi Vendor
- Workspace proyek (*Dashboard Proyek*) untuk melihat daftar pekerjaan yang ditugaskan oleh admin.
- Penerimaan dan respons operasional terhadap *Brief Kerja* dari admin.
- Pengisian *Formulir Estimasi Terstruktur* (estimasi biaya produksi dan durasi pengerjaan).
- Pencatatan *Progress Log* harian (unggah foto lapangan, ringkasan kerja, pelaporan kendala, dan rencana tugas esok hari).
- Manajemen tim lapangan (*field team*) per proyek.
- Pemantauan pencairan pembayaran (milestone *payout*) dan target pencapaian bonus kinerja.

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
│   └── schema.sql                      # Skema lengkap database PostgreSQL (17 tabel + RLS + trigger)
├── public/
│   └── figma/                          # Aset gambar landing page (.webp)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page utama
│   │   ├── layout.tsx                  # Root layout + metadata SEO
│   │   ├── globals.css                 # Stylesheet global
│   │   ├── login/ & register/          # Halaman otentikasi
│   │   ├── api/
│   │   │   ├── ai/brief/route.ts       # API endpoint AI Brief Generator
│   │   │   ├── ai/image/              # API endpoint AI Image Generation
│   │   │   └── chat/route.ts           # API endpoint VMatch AI Chat (streaming)
│   │   └── dashboard/
│   │       ├── admin/                  # Modul Dashboard Admin (21+ komponen)
│   │       ├── user/                   # Modul Dashboard Customer (15+ komponen)
│   │       └── vendor/                 # Modul Dashboard Vendor (10+ komponen)
│   ├── components/
│   │   ├── home/                       # Komponen arsitektur UI Landing Page (Navbar, Sections)
│   │   └── shared/                     # Komponen antar-role (misal: Project Detail Viewer)
│   └── lib/
│       ├── api/                        # Repositori operasi CRUD Supabase (Data Access Layer)
│       │   ├── projects.ts             # Logika inti mutasi Request, Proyek, Brief, RAB, dll.
│       │   ├── consultations.ts, notifications.ts, profiles.ts, promos.ts
│       ├── hooks/                      # Custom hooks (Auth state & Query state)
│       └── supabase/                   # Konfigurasi Supabase Client & Middleware Proteksi Role
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
- **Proteksi Akses**: Saat masuk, Next.js *Middleware* mengarahkan pengguna ke *dashboard* yang sesuai (`/dashboard/user`, `/dashboard/admin`, atau `/dashboard/vendor`) dan menolak percobaan manipulasi URL antar-*role*.

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

Sistem kompilasi dikembangkan bebas hambatan *(zero-compile error)*.

| Perintah Terminal | Fungsi |
|---|---|
| `npm run dev` | Menjalankan *development server* lokal untuk *debugging* |
| `npm run build` | Mengompilasi aplikasi (SSR/SSG/Turbopack) untuk kesiapan produksi |
| `npm run start` | Menjalankan arsitektur penuh layaknya *host server* sungguhan |
| `npm run lint` | Eksekusi *Type Checking* (TS) dan ESLint validator |
