# VMatch Interior

**VMatch Interior** adalah platform manajemen proyek interior end-to-end yang menghubungkan tiga pihak utama: **Customer (User)**, **Admin VMatch**, dan **Vendor Partner**. Platform ini dirancang untuk mendigitalkan seluruh siklus proyek interior — mulai dari pencarian inspirasi desain, pengajuan proyek, pencocokan vendor, pembuatan RAB, pelacakan progres pengerjaan, hingga quality control dan pembayaran — dalam satu ekosistem web yang terintegrasi.

Dengan pendekatan *managed marketplace*, VMatch bertindak sebagai penghubung profesional antara customer yang membutuhkan jasa interior dengan vendor yang menyediakan layanan tersebut. Admin VMatch berperan sebagai orchestrator yang memastikan kualitas, transparansi, dan kelancaran setiap proyek dari awal hingga akhir.

---

## Ringkasan Fitur Utama

### Sisi Customer (User)
- Katalog inspirasi desain interior dengan filter berdasarkan gaya, tipe properti, dan material
- Formulir pengajuan proyek lengkap dengan AI Brief Generator yang menganalisis kebutuhan secara otomatis
- Dashboard pelacakan proyek real-time (status, progres, timeline, dan dokumen)
- Penjadwalan konsultasi online (Google Meet, WhatsApp Call, Chat WhatsApp, atau Offline)
- VMatch AI — asisten virtual berbasis AI untuk brainstorming ide desain, estimasi budget, dan rekomendasi material
- Sistem notifikasi terintegrasi untuk setiap update proyek
- Riwayat invoice dan pembayaran
- Klaim garansi pasca-proyek
- Tombol kontak WhatsApp mengambang untuk komunikasi cepat

### Sisi Admin
- Dashboard operasional dengan ringkasan request baru, proyek aktif, QC, dan pembayaran
- Manajemen request proyek masuk (review, assign vendor, ubah status)
- Pembuatan dan pengelolaan Brief Dokumen untuk vendor
- RAB Builder — tools untuk menyusun Rancangan Anggaran Biaya dari estimasi vendor
- Pelacakan progres dan quality control (QC Checklist)
- Manajemen invoice dan verifikasi pembayaran customer
- Manajemen payout dan bonus untuk vendor
- Manajemen vendor partner dan customer
- Sistem promo dan campaign untuk landing page
- Sistem notifikasi untuk semua role
- Analytics dan laporan operasional
- Manajemen konsultasi dan jadwal meeting

### Sisi Vendor
- Dashboard proyek yang di-assign oleh admin
- Penerimaan dan respon terhadap Brief kerja
- Pengisian estimasi biaya dan durasi pengerjaan
- Pencatatan progress log harian (ringkasan kerja, kendala, foto, dan rencana esok)
- Manajemen tim lapangan (field team) per proyek
- Pelacakan pembayaran milestone dan bonus kinerja
- Sistem notifikasi untuk update proyek

---

## Tech Stack

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

## Struktur Folder

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
│   │   ├── login/page.tsx              # Halaman login
│   │   ├── register/page.tsx           # Halaman registrasi
│   │   ├── inspirasi/[slug]/           # Halaman detail inspirasi (public)
│   │   ├── portfolio/[slug]/           # Halaman portfolio proyek (public)
│   │   ├── api/
│   │   │   ├── ai/brief/route.ts       # API endpoint AI Brief Generator
│   │   │   ├── ai/image/              # API endpoint AI Image Generation
│   │   │   └── chat/route.ts           # API endpoint VMatch AI Chat (streaming)
│   │   └── dashboard/
│   │       ├── layout.tsx              # Layout wrapper dashboard
│   │       ├── admin/                  # Dashboard Admin
│   │       │   ├── page.tsx            # Halaman utama admin
│   │       │   ├── types.ts            # Type definitions admin
│   │       │   ├── mock-data.ts        # Data menu sidebar admin
│   │       │   └── components/         # 21 komponen view admin
│   │       ├── user/                   # Dashboard Customer
│   │       │   ├── page.tsx            # Halaman utama user
│   │       │   ├── types.ts            # Type definitions user
│   │       │   ├── mock-data.ts        # Data navigasi user
│   │       │   └── components/         # 15 komponen view user
│   │       └── vendor/                 # Dashboard Vendor
│   │           ├── page.tsx            # Halaman utama vendor
│   │           ├── types.ts            # Type definitions vendor
│   │           ├── mock-data.ts        # Data navigasi + mock vendor
│   │           └── components/         # 10 komponen view vendor
│   ├── components/
│   │   ├── home/                       # Komponen landing page
│   │   │   ├── navbar.tsx              # Navigasi utama
│   │   │   ├── sections/              # 16 section landing page
│   │   │   └── ...                     # Komponen pendukung (animasi, carousel, dsb.)
│   │   ├── shared/
│   │   │   └── project-detail.tsx      # Komponen detail proyek (dipakai lintas role)
│   │   └── ui/
│   │       └── text-shimmer.tsx        # Komponen UI efek shimmer
│   └── lib/
│       ├── api/                        # Data access layer (Supabase queries)
│       │   ├── projects.ts             # CRUD project requests, projects, briefs, RAB, dsb.
│       │   ├── consultations.ts        # CRUD konsultasi
│       │   ├── notifications.ts        # CRUD notifikasi
│       │   ├── profiles.ts             # CRUD profil user
│       │   ├── promos.ts               # CRUD promo
│       │   ├── inspirations.ts         # CRUD inspirasi desain
│       │   ├── chat.ts                 # CRUD sesi chat AI
│       │   └── storage.ts             # Upload file ke Supabase Storage
│       ├── auth/
│       │   └── actions.ts              # Server action untuk auth
│       ├── hooks/
│       │   ├── use-auth.ts             # Hook autentikasi & profil
│       │   └── use-query.ts            # Hook data fetching
│       ├── supabase/
│       │   ├── client.ts               # Supabase client (browser)
│       │   ├── server.ts               # Supabase client (server)
│       │   ├── middleware.ts           # Middleware proteksi route
│       │   └── types.ts               # Type definitions seluruh tabel database
│       └── home-content.ts            # Konten statis landing page
└── package.json
```

---

## Arsitektur Database

Sistem VMatch menggunakan **17 tabel utama** di PostgreSQL (melalui Supabase) dengan Row Level Security (RLS) yang ketat untuk memastikan setiap role hanya dapat mengakses data yang relevan:

| No | Tabel | Fungsi |
|---|---|---|
| 1 | `profiles` | Profil pengguna (extends auth.users) — menyimpan role, nama, kontak, dan field khusus vendor/customer |
| 2 | `project_requests` | Pengajuan proyek dari customer sebelum menjadi proyek aktif |
| 3 | `projects` | Proyek aktif yang sedang berjalan (dibuat otomatis via trigger saat vendor di-assign) |
| 4 | `briefs` | Dokumen brief kerja yang dibuat admin dan dikirim ke vendor |
| 5 | `brief_files` | File lampiran yang dilampirkan ke brief |
| 6 | `vendor_estimates` | Estimasi biaya dan durasi dari vendor setelah membaca brief |
| 7 | `rab` | Rancangan Anggaran Biaya final yang disusun admin dari estimasi vendor |
| 8 | `consultations` | Jadwal konsultasi antara customer dan tim VMatch |
| 9 | `invoices` | Invoice pembayaran untuk customer |
| 10 | `vendor_payouts` | Pembayaran milestone untuk vendor |
| 11 | `progress_logs` | Catatan progres harian dari vendor (termasuk foto) |
| 12 | `qc_checklists` | Checklist quality control per proyek |
| 13 | `vendor_bonuses` | Bonus kinerja vendor berdasarkan syarat tertentu |
| 14 | `notifications` | Notifikasi untuk semua role (proyek, konsultasi, RAB, pembayaran, dll.) |
| 15 | `promos` | Promo dan campaign yang tampil di landing page |
| 16 | `warranty_claims` | Klaim garansi pasca-proyek dari customer |
| 17 | `field_teams` | Anggota tim lapangan vendor per proyek |

### Fitur Database Penting
- **Auto-create profile on signup**: Trigger `handle_new_user()` otomatis membuat baris `profiles` saat user baru mendaftar via Supabase Auth.
- **Sync project_requests → projects**: Trigger `sync_project_request_to_projects()` otomatis membuat/update baris di tabel `projects` saat admin meng-assign vendor ke sebuah request.
- **Row Level Security (RLS)**: Setiap tabel dilindungi RLS yang membatasi akses berdasarkan role (admin bisa akses semua, user/vendor hanya data miliknya).

---

## Cara Kerja Aplikasi End-to-End

Berikut adalah penjelasan mendetail tentang alur kerja platform VMatch dari perspektif masing-masing role — mulai dari pertama kali mengakses website hingga proyek selesai.

### 🏠 Fase 1: Landing Page (Publik — Tanpa Login)

Saat pertama kali mengunjungi website VMatch, pengunjung akan melihat **landing page profesional** yang terdiri dari beberapa section:

1. **Promo Popup** — Jika ada promo aktif yang dibuat oleh admin, popup promo otomatis muncul saat halaman dimuat. Popup ini menampilkan judul promo, deskripsi, dan tombol CTA (misalnya "Konsultasi Gratis").
2. **Hero Section** — Banner utama dengan tagline VMatch dan tombol ajakan bertindak untuk mulai menggunakan layanan.
3. **Stats Strip** — Menampilkan angka-angka pencapaian VMatch (jumlah proyek, customer, dll.).
4. **Inspirasi Desain** — Galeri kategori desain interior (berdasarkan gaya dan tipe ruangan) yang bisa ditelusuri pengunjung untuk mendapat ide.
5. **Proyek Unggulan** — Showcase proyek-proyek interior terbaik yang pernah dikerjakan VMatch.
6. **Layanan** — Penjelasan jenis layanan interior yang ditawarkan.
7. **Proses Kerja** — Langkah-langkah bagaimana VMatch menangani proyek dari awal hingga selesai.
8. **Keunggulan** — Alasan mengapa memilih VMatch dibanding kompetitor.
9. **Filosofi** — Nilai dan prinsip yang dipegang VMatch dalam setiap proyek.
10. **FAQ** — Pertanyaan yang sering diajukan beserta jawabannya.
11. **Kontak** — Form atau informasi kontak untuk menghubungi tim VMatch.
12. **Footer** — Navigasi tambahan, link sosial media, dan informasi legal.

Dari landing page, pengunjung juga dapat mengakses halaman **Inspirasi** dan **Portfolio** secara publik tanpa perlu login.

---

### 👤 Fase 2: Registrasi & Login

#### Registrasi (Customer Baru)
1. Pengunjung mengklik tombol "Daftar" dan diarahkan ke halaman `/register`.
2. Mengisi formulir: **Nama Lengkap**, **Email**, dan **Password** (minimal 6 karakter).
3. Sistem membuat akun di Supabase Auth dengan role default `user`.
4. Trigger database `handle_new_user()` otomatis membuat baris profil di tabel `profiles` dengan role yang sesuai.
5. Jika email confirmation aktif, customer diminta mengecek inbox untuk verifikasi.

#### Login
1. Customer/Admin/Vendor mengakses halaman `/login`.
2. Memasukkan email dan password.
3. Setelah berhasil login, sistem membaca role dari tabel `profiles`:
   - **Role `user`** → diarahkan ke `/dashboard/user`
   - **Role `admin`** → diarahkan ke `/dashboard/admin`
   - **Role `vendor`** → diarahkan ke `/dashboard/vendor`
4. Middleware Next.js memproteksi seluruh route `/dashboard/*` — jika belum login, otomatis redirect ke `/login`.

---

### 🛋️ Fase 3: Customer (User) — Dashboard & Pengajuan Proyek

Setelah login, customer masuk ke dashboard user yang memiliki **6 menu utama**:

#### 3.1 Inspirasi Desain
- Customer dapat menelusuri **katalog desain interior** yang dikategorikan berdasarkan gaya (Japandi, Modern, Industrial, dll.), tipe properti, dan material.
- Setiap item inspirasi memiliki gambar, deskripsi, dan tag.
- Customer bisa melihat detail inspirasi dan menggunakannya sebagai referensi saat mengajukan proyek.
- Terdapat fitur untuk langsung menuju halaman pengajuan proyek atau konsultasi AI dari katalog.

#### 3.2 Ajukan Proyek (Form Pengajuan)
Ini adalah fitur inti dari sisi customer. Formulir pengajuan proyek terdiri dari langkah-langkah berikut:

1. **Isi Data Proyek** — Customer mengisi informasi:
   - Nama proyek
   - Tipe proyek (Kitchen Set, Kamar Tidur, Ruang Tamu, dll.)
   - Gaya desain yang diinginkan
   - Lokasi proyek
   - Ukuran ruangan
   - Budget yang disiapkan
   - Preferensi material dan paket material
   - Target waktu mulai dan selesai
   - Catatan tambahan
   - Referensi inspirasi (dari katalog inspirasi)

2. **AI Brief Generator** — Setelah customer mendeskripsikan kebutuhan dalam bentuk teks bebas, sistem memanggil AI (melalui Groq API / OpenRouter) yang akan menganalisis deskripsi tersebut dan menghasilkan:
   - **Chips ringkasan**: jenis proyek, gaya, budget, timeline, dan prioritas
   - **Summary**: ringkasan proyek profesional
   - **Rekomendasi**: saran-saran dari AI untuk proyek tersebut
   - **Validasi**: hal-hal yang perlu dikonfirmasi lebih lanjut

3. **Submit Request** — Data dikirim ke tabel `project_requests` dengan status awal **"Baru Masuk"**.

#### 3.3 Proyek Saya
- Menampilkan **daftar semua proyek** milik customer — baik yang masih dalam tahap request maupun yang sudah aktif.
- Setiap proyek menunjukkan: status terkini, progress (persentase), tipe proyek, lokasi, dan langkah selanjutnya.
- Customer dapat melihat **detail proyek** yang mencakup:
  - Timeline proyek dan milestone
  - Dokumen terkait (brief, RAB)
  - Progress log dari vendor (ringkasan harian, foto progres)
  - Invoice dan status pembayaran
  - QC Checklist — customer bisa melihat dan menyetujui hasil QC
  - Warranty Claims — customer bisa mengajukan klaim garansi pasca-proyek

#### 3.4 Konsultasi
- Customer dapat **menjadwalkan konsultasi** dengan tim VMatch.
- Memilih metode konsultasi: **Google Meet**, **WhatsApp Call**, **Chat WhatsApp**, atau **Offline**.
- Mengisi tanggal, waktu, topik, dan kebutuhan yang ingin dibahas.
- Setelah diajukan, status konsultasi akan berubah sesuai alur:
  - `Menunggu Konfirmasi` → `Terkonfirmasi` → `Selesai`
  - Atau bisa `Dijadwalkan Ulang` / `Dibatalkan`
- Terdapat link meeting yang diberikan admin setelah konsultasi dikonfirmasi.

#### 3.5 VMatch AI
- Fitur chatbot AI yang memungkinkan customer **berdiskusi secara interaktif** tentang ide desain interior.
- AI berperan sebagai konsultan interior senior yang bisa:
  - Memberikan estimasi budget realistis dalam Rupiah
  - Merekomendasikan layout, material, palet warna, dan pencahayaan
  - Membandingkan opsi desain dengan trade-off
  - Menghasilkan **visualisasi gambar AI** dari konsep yang dibahas
- Chat menggunakan streaming (Server-Sent Events) untuk pengalaman real-time.
- Riwayat chat disimpan per sesi dan bisa diakses kembali.

#### 3.6 Pengaturan
- Customer dapat mengedit profil: nama, nomor telepon, alamat, preferensi, dan range budget.
- Mengubah password akun.

#### Fitur Tambahan Customer
- **Notification Panel** — Bell notifikasi di header yang menampilkan update terbaru (proyek, konsultasi, pembayaran, dll.) dan bisa langsung navigate ke halaman terkait.
- **Floating WhatsApp** — Tombol WhatsApp mengambang di sudut layar untuk komunikasi cepat dengan tim VMatch.

---

### ⚙️ Fase 4: Admin — Manajemen Operasional

Admin adalah **pusat kendali operasional** VMatch. Dashboard admin memiliki **15 halaman** yang dikelompokkan menjadi beberapa grup menu:

#### 4.1 Dashboard Operasional
- Menampilkan **4 kartu ringkasan**: Request Baru, Proyek Aktif, Butuh QC, dan Pembayaran menunggu verifikasi.
- Menampilkan **aktivitas terbaru** dari notifikasi (request masuk, update proyek, pembayaran, dll.).
- Menampilkan status **promo aktif** yang sedang berjalan di landing page.
- Tombol cepat untuk review request dan kelola promo.

#### 4.2 Promo & Campaign
- Admin membuat, mengedit, dan mengatur promo yang tampil sebagai popup di landing page.
- Setiap promo memiliki: judul, deskripsi, gambar, label CTA, URL CTA, tanggal mulai-selesai, dan status.
- Status promo: `Draft` → `Dijadwalkan` → `Aktif` → `Berakhir` / `Nonaktif`.
- Hanya promo dengan status `Aktif` yang tampil di landing page (diatur oleh RLS).

#### 4.3 Request Proyek
Ini adalah alur kerja utama admin. Saat customer mengajukan proyek:

1. **Request masuk** dengan status `Baru Masuk` → Admin mereview detail request.
2. Admin dapat mengubah status menjadi:
   - `Menunggu Review` — sedang dalam proses review internal
   - `Butuh Konsultasi` — customer perlu konsultasi dulu sebelum lanjut
   - `Disetujui` — request disetujui, siap assign vendor
   - `Ditolak` — request tidak dapat dilanjutkan
3. **Assign Vendor** — Admin memilih vendor yang sesuai dari daftar vendor partner.
   - Saat vendor di-assign (`selected_vendor_id` terisi), trigger database `sync_project_request_to_projects()` otomatis membuat baris di tabel `projects` sehingga proyek muncul di dashboard vendor dan customer.
4. Status request berlanjut menjadi:
   - `Menunggu Vendor` → `Menunggu Estimasi Vendor` → `Estimasi Dikirim Vendor` → `RAB Direview Admin` → `RAB Dikirim ke Customer` → `Menjadi Proyek Aktif`
5. Admin bisa menambahkan **catatan admin** di setiap tahap untuk komunikasi internal.

#### 4.4 Proyek Aktif
- Menampilkan semua proyek yang sudah berjalan (memiliki vendor yang di-assign).
- Admin bisa melihat detail proyek, progress, dan mengubah status proyek:
  - `Berjalan` → `Butuh Review` → `QC` → `Selesai`
- Admin bisa mengupdate progress persentase, current stage, dan next task.

#### 4.5 Brief & Dokumen
- Admin membuat **dokumen brief kerja** untuk vendor yang berisi:
  - Informasi proyek (judul, tipe, lokasi, ukuran ruangan, budget)
  - Scope pekerjaan
  - Catatan material
  - Daftar material yang disetujui
  - Timeline pengerjaan (label + tanggal per tahap)
  - QC Checklist
  - Catatan admin dan catatan vendor
  - File lampiran (upload ke Supabase Storage)
- Status brief: `Draft` → `Siap Dikirim` → `Dikirim ke Vendor` → `Dibaca Vendor` → `Estimasi Dikirim` / `Revisi Brief`

#### 4.6 RAB Builder
- Setelah vendor mengirim estimasi, admin menyusun **Rancangan Anggaran Biaya (RAB)** final.
- RAB mencakup: judul proyek, tipe, lokasi, grand total, service fee VMatch (internal), catatan admin, catatan customer, dan catatan revisi.
- Status RAB:
  - `Menunggu Estimasi Vendor` → `Estimasi Dikirim Vendor` → `RAB Direview Admin` → `RAB Dikirim ke Customer` → `Revisi Diminta Customer` / `RAB Disetujui Customer`

#### 4.7 Progress & QC
- Admin memantau **progress log harian** yang dikirim vendor.
- Setiap log berisi: tanggal, status (Sesuai Jadwal / Ada Kendala / Tidak Ada Pekerjaan), persentase progress, ringkasan kerja, kendala, rencana esok, dan foto.
- Admin bisa menambahkan catatan review pada setiap log.
- Admin mengelola **QC Checklist** per proyek — menandai item yang sudah dicek dan memberikan catatan.
- Status QC: `Belum Mulai` → `Sedang Dicek` → `Perlu Catatan` → `Disetujui`

#### 4.8 Invoice & Pembayaran
- Admin membuat invoice untuk customer berdasarkan RAB yang sudah disetujui.
- Setiap invoice berisi: nomor invoice, judul proyek, tahapan pembayaran, total amount, item rincian (JSONB), metode pembayaran, tanggal jatuh tempo, dan timeline.
- Status invoice: `Draft` → `Menunggu Pembayaran` → `Terbayar` → `Lunas` / `Terlambat` / `Refund`
- Admin memverifikasi pembayaran dan mengupdate status.

#### 4.9 Bonus Vendor
- Admin mengelola **bonus kinerja** untuk vendor per proyek.
- Setiap bonus memiliki: jumlah bonus, alasan, dan daftar requirement (checklist yang harus dipenuhi).
- Status bonus: `Belum Memenuhi Syarat` → `Berpotensi Aktif` → `Menunggu QC` → `Bonus Aktif` → `Sudah Dibayarkan`

#### 4.10 Konsultasi
- Admin melihat semua jadwal konsultasi yang diajukan customer.
- Mengkonfirmasi, menjadwalkan ulang, atau membatalkan konsultasi.
- Menambahkan meeting link, catatan admin, dan catatan hasil konsultasi.

#### 4.11 Vendor Partner
- Mengelola daftar vendor partner VMatch.
- Melihat profil vendor: nama, email, telepon, area layanan, keahlian, dan informasi bank.
- Admin yang mendaftarkan vendor ke sistem (vendor tidak self-register).

#### 4.12 Customer
- Mengelola daftar customer VMatch.
- Melihat profil customer: nama, email, telepon, alamat, sumber referral, budget range, dan preferensi.

#### 4.13 Analytics
- Dashboard analytics dengan ringkasan performa operasional.

#### 4.14 Notifikasi
- Admin membuat dan mengirim notifikasi ke user/vendor tertentu.
- Notifikasi memiliki: judul, deskripsi, kategori (Proyek, Konsultasi, RAB, Pembayaran, Vendor, Customer, Promo, Sistem), prioritas (Normal, Penting, Urgent), dan deep link ke halaman terkait.

#### 4.15 Pengaturan
- Pengaturan profil admin dan konfigurasi sistem.

---

### 🔧 Fase 5: Vendor — Pengerjaan Proyek

Vendor adalah **pelaksana proyek** di lapangan. Dashboard vendor memiliki **5 menu utama**:

#### 5.1 Proyek Saya (Projects)
- Menampilkan daftar proyek yang di-assign oleh admin ke vendor tersebut.
- Setiap proyek menunjukkan: nama, tipe, lokasi, status, progress, deadline, dan bonus status.
- Status proyek dari perspektif vendor:
  - `Menunggu Brief` → `Siap Dikerjakan` → `Sedang Dikerjakan` → `Butuh Update` → `Menunggu QC` → `Selesai`
- Vendor bisa melihat detail proyek termasuk: customer brief, catatan VMatch, material yang disetujui, dan tugas selanjutnya.
- Vendor bisa mengelola **tim lapangan (Field Team)**: menambah/menghapus anggota tim dengan nama, role, dan nomor telepon.

#### 5.2 Brief & Rencana Kerja
- Vendor menerima **brief kerja** dari admin yang berisi scope pekerjaan, material, timeline, dan QC checklist.
- Status brief dari perspektif vendor:
  - `Belum Dibaca` → `Sudah Dibaca` → `Butuh Diskusi` / `Estimasi Disiapkan` → `Estimasi Dikirim`
- Setelah membaca brief, vendor mengisi **Estimasi**:
  - Estimasi biaya (dalam Rupiah)
  - Estimasi durasi pengerjaan
  - Saran material
  - Catatan vendor
- Status estimasi: `Belum Dibuat` → `Draft Estimasi` → `Estimasi Dikirim`
- Estimasi yang dikirim akan diterima admin untuk disusun menjadi RAB.

#### 5.3 Progress Log
- Vendor wajib mengisi **laporan progres harian** untuk setiap proyek aktif.
- Setiap log harian berisi:
  - Tanggal
  - Status hari itu: `Sesuai Jadwal`, `Ada Kendala`, atau `Tidak Ada Pekerjaan Hari Ini`
  - Persentase progress (0-100%)
  - Ringkasan pekerjaan yang dilakukan
  - Kendala yang dihadapi (jika ada)
  - Rencana kerja esok hari
  - Label foto dan upload foto progres
- Log ini langsung terlihat oleh admin untuk direview dan oleh customer untuk dipantau.

#### 5.4 Pembayaran & Bonus
**Pembayaran Milestone:**
- Vendor melihat daftar milestone pembayaran per proyek.
- Status payout: `Menunggu Milestone` → `Diproses` → `Dibayarkan` / `Ditahan Sementara`
- Setiap milestone memiliki: judul, jumlah, dan informasi jatuh tempo.

**Bonus Kinerja:**
- Vendor melihat potensi bonus untuk setiap proyek.
- Terdapat daftar persyaratan (requirement checklist) yang harus dipenuhi.
- Status bonus: `Belum Memenuhi Syarat` → `Berpotensi Aktif` → `Menunggu QC` → `Bonus Aktif` → `Sudah Dibayarkan`

#### 5.5 Pengaturan
- Vendor mengedit profil: nama, nomor telepon, area layanan, keahlian, nama bank, dan nomor rekening.
- Mengubah password akun.

#### Fitur Tambahan Vendor
- **Notification Bell** — Bell notifikasi di header dengan daftar update terbaru dan navigasi cepat ke halaman terkait.

---

### 🔄 Fase 6: Alur Proyek End-to-End (Ringkasan)

Berikut adalah ringkasan alur lengkap satu proyek dari awal hingga selesai:

```
Customer mengajukan proyek (NewProjectForm)
    │
    ▼
project_requests: status = "Baru Masuk"
    │
    ▼
Admin review request → Ubah status → Assign vendor
    │
    ▼
[TRIGGER] sync_project_request_to_projects()
→ Otomatis buat baris di tabel projects
→ Proyek muncul di dashboard customer & vendor
    │
    ▼
Admin buat Brief Dokumen → Kirim ke vendor
    │
    ▼
Vendor baca brief → Isi estimasi biaya & durasi → Kirim estimasi
    │
    ▼
Admin review estimasi → Susun RAB → Kirim RAB ke customer
    │
    ▼
Customer review RAB → Setujui / Minta revisi
    │
    ▼
Admin buat Invoice → Customer bayar (bertahap per milestone)
    │
    ▼
Vendor mulai mengerjakan proyek
    │
    ├─→ Vendor kirim progress log harian
    ├─→ Admin review progress & catatan
    └─→ Customer pantau progress real-time
    │
    ▼
Proyek selesai → Admin jalankan QC Checklist
    │
    ▼
Customer approve hasil QC
    │
    ▼
Admin proses pembayaran milestone ke vendor
    │
    ▼
Admin evaluasi & cairkan bonus vendor (jika memenuhi syarat)
    │
    ▼
Proyek status = "Selesai"
    │
    ▼
[PASCA-PROYEK] Customer bisa ajukan Warranty Claim jika ada masalah
```

---

### 🔐 Keamanan & Akses Data

Platform VMatch menerapkan **Row Level Security (RLS)** di seluruh tabel database untuk memastikan:

- **Customer** hanya bisa melihat dan mengakses data miliknya sendiri (proyek, invoice, konsultasi, notifikasi).
- **Vendor** hanya bisa melihat proyek yang di-assign kepadanya, brief yang dikirim untuknya, dan pembayaran/bonus miliknya.
- **Admin** memiliki akses penuh ke seluruh data untuk keperluan operasional.
- **Pengunjung publik** hanya bisa melihat promo yang berstatus `Aktif` dan halaman landing page.

Autentikasi menggunakan **Supabase Auth** dengan email & password. Session dikelola via cookie dan di-refresh otomatis melalui middleware Next.js di setiap request.

---

### 🤖 Integrasi AI

VMatch mengintegrasikan AI dalam dua fitur utama:

1. **AI Brief Generator** (`/api/ai/brief`)
   - Menganalisis deskripsi proyek dari customer dan menghasilkan ringkasan terstruktur (tipe, gaya, budget, timeline, prioritas, rekomendasi).
   - Menggunakan Groq API sebagai provider utama dengan OpenRouter sebagai fallback.
   - Output berupa JSON terstruktur yang langsung ditampilkan di form pengajuan proyek.

2. **VMatch AI Chat** (`/api/chat`)
   - Chatbot interaktif berbasis streaming (SSE) yang berperan sebagai konsultan interior.
   - Bisa memberikan estimasi budget, rekomendasi material, layout, dan bahkan menghasilkan **visualisasi gambar AI** dari konsep yang dibahas.
   - Riwayat chat disimpan di database dan bisa diakses kembali.

---

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server lokal |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kode |
