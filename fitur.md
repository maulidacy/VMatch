# Audit Fitur VMatch

Dokumen ini mencatat flow fitur yang sudah ada di UI saat ini dan kebutuhan data saat nanti dibuat database, auth Google, storage, dan backend. Tujuannya agar tidak ada flow yang tertinggal saat mock React state diganti menjadi sistem penuh.

## 1. Role dan Auth

### Role
- `client`: pemilik akun yang mengajukan proyek interior.
- `admin`: tim VMatch yang mengelola request, brief, jadwal meet, pipeline, dan progress proyek.

### Auth Saat Ini
- Halaman: `/login`.
- Masih mock manual:
  - `admin / 123` masuk ke `/dashboard/admin`.
  - `user / 123` masuk ke `/dashboard/user`.

### Auth Database Nanti
- Login Google wajib disiapkan.
- Setelah login Google, sistem perlu membuat atau mengambil profil user.
- Setiap user harus punya `role`.
- Redirect setelah login:
  - `role = admin` ke `/dashboard/admin`.
  - `role = client` ke `/dashboard/user`.
- Perlu proteksi route dashboard agar tidak bisa dibuka tanpa sesi login.
- Perlu logout yang benar, bukan hanya link balik ke `/login`.

### Data Minimal Auth
- `users.id`
- `users.google_id`
- `users.email`
- `users.name`
- `users.avatar_url`
- `users.role`
- `users.created_at`
- `users.updated_at`

## 2. Landing Page

### Halaman
- Route: `/`.
- Sections:
  - Hero
  - Stats strip
  - Philosophy
  - Inspiration
  - Projects
  - Process
  - Benefits
  - Testimonials
  - Contact
  - Footer

### Navigasi
- Navbar anchor:
  - Beranda
  - Inspirasi
  - Cara Kerja
  - Tentang
  - Kontak
- CTA:
  - Login
  - Konsultasi, sekarang menuju `/login`.

### Data Konten
- Sumber saat ini: `src/lib/home-content.ts`.
- Konten yang bisa dibuat dinamis nanti:
  - statistik landing
  - featured projects
  - kategori inspirasi
  - testimonial
  - informasi kontak
  - section process dan benefit

## 3. Inspirasi dan Katalog Publik

### Halaman Detail Inspirasi
- Route: `/inspirasi/[slug]`.
- Slug saat ini:
  - `rumah`
  - `apartment`
  - `hotel`
  - `kos-boarding-house`
- Tiap kategori punya:
  - title
  - slug
  - copy
  - hero image
  - daftar area ruang
  - deskripsi area
  - daftar layanan per area
  - image per area

### Kebutuhan Database
- `catalog_categories`
- `catalog_items`
- `catalog_item_services`
- `media_assets`
- kategori harus bisa dipakai ulang untuk landing, dashboard client, dan halaman detail publik.

## 4. Dashboard Client

### Route
- `/dashboard/user`.

### Layout
- Header dashboard dark rounded.
- Tab:
  - Overview
  - Ajukan Proyek
  - Konsultasi
  - AI Ide
  - Dokumen
  - Katalog

### Overview: Project Hub
- Tampilan awal client adalah project hub, bukan langsung detail proyek.
- Isi:
  - card project berbentuk kotak
  - status sekarang
  - ringkasan brief: properti, lokasi, budget, start-end project
  - jadwal meet jika sudah ada
  - tombol `+ Tambah project`
  - tombol `+ Tambah jadwal meet`
  - tombol `Lihat detail`
- Klik card membuka detail project.
- Back dari detail project kembali ke project hub.

### Ajukan Proyek
- Form brief awal tanpa upload foto.
- Field saat ini:
  - tipe properti
  - lokasi proyek
  - estimasi budget
  - start project
  - end project
  - estimasi durasi
  - kebutuhan desain dan referensi tone
- Tombol:
  - `Submit permintaan`
  - `Simpan draft`
- Saat ini submit membuat project mock di React state.
- Database nanti harus menyimpan:
  - draft
  - submitted brief
  - riwayat revisi brief
  - status project awal `Request Projek` atau `Brief baru`.

### Detail Project Client
- Menampilkan:
  - nama project
  - lokasi
  - tipe properti
  - estimasi biaya
  - status
  - rentang project
  - durasi proyek
  - tombol project baru
  - project timeline
  - catatan tim
  - info konsultasi
- Project timeline:
  - horizontal scroll di dalam card timeline
  - saat detail dibuka, otomatis scroll ke current progress
  - step saat ini:
    - Brief diterima
    - Kurasi vendor
    - Konsultasi
    - RAB & jadwal
    - Produksi
    - Instalasi
    - Selesai
- Database nanti harus membuat timeline berdasarkan activity/progress asli dari admin, bukan array statis.

### Konsultasi Client
- Tab `Konsultasi`.
- UI sekarang:
  - pilih tanggal
  - pilih waktu WIB
  - tombol `Kunci jadwal`
  - info project yang dipilih
- Belum tersimpan ke backend.
- Database nanti harus menyimpan:
  - project id
  - requested_by user id
  - tanggal
  - jam mulai
  - jam selesai
  - timezone
  - meeting provider
  - meeting link Google Meet
  - status jadwal: requested, confirmed, rescheduled, cancelled, done

### AI Ide
- Tab `AI Ide`.
- Layout:
  - sidebar kecil untuk history percakapan
  - panel chat penuh di kanan
  - yang scroll adalah isi chat
- Saat ini percakapan masih mock.
- Database nanti:
  - conversation per user/project
  - message role: user, assistant, system
  - message content
  - timestamp
  - metadata model jika memakai AI sungguhan
- Perlu diputuskan apakah AI chat terkait project tertentu atau bisa global per user.

### Dokumen Client
- Tab `Dokumen`.
- Menampilkan mock:
  - Brief proyek
  - Estimasi RAB awal
  - Referensi material
- Tombol download visual.
- Database/storage nanti:
  - dokumen terkait project
  - file url
  - file type
  - uploaded_by
  - visibility client/admin
  - created_at

### Katalog Client
- Tab `Katalog`.
- Tampilan awal kategori memanjang ke bawah:
  - Apartemen
  - Rumah
  - Hotel
  - Kos / Boarding
  - Project Featured
- Klik kategori membuka detail katalog.
- Detail katalog menampilkan grid gambar, nama area/project, dan deskripsi.
- Sumber saat ini:
  - `inspirations`
  - `featuredProjects`
- Database nanti harus memakai data katalog publik yang sama agar tidak dobel maintenance.

## 5. Dashboard Admin

### Route
- `/dashboard/admin`.

### Layout
- Header sama style dengan client, label `Team`.
- Tab:
  - Proyek Aktif
  - Task List
  - Client Database

### Proyek Aktif: Pipeline Jira/Kanban
- Board drag and drop.
- Stage saat ini:
  - Request Projek
  - Review Brief
  - Konsultasi
  - Progres Pengerjaan
  - Selesai
- Card project bisa di-drag ke kanan/kiri antar stage.
- Klik `Buka detail` membuka/menampilkan detail pelanggan.
- Metrics:
  - jumlah proyek
  - jumlah meeting
  - jumlah selesai
- Saat stage dipindah ke `Selesai`, semua activity mock ikut ditandai selesai.

### Detail Pelanggan Admin
- Menampilkan:
  - nama client
  - stage
  - properti
  - status aktif/selesai
  - hasil form user
  - jadwal meet
  - progress terbaru
  - history progress timeline
- Jika tidak ada meet, tampil `User belum mengajukan meet`.

### Edit Brief Admin
- Admin bisa klik `Edit brief`.
- Field yang bisa diedit:
  - tipe properti
  - lokasi
  - budget
  - gaya
  - start project
  - end project
  - durasi
  - catatan brief
- Tombol `Simpan perubahan`.
- Database nanti perlu menyimpan perubahan brief dan audit trail:
  - siapa admin yang mengubah
  - field lama
  - field baru
  - alasan/perubahan setelah meet jika diperlukan
  - timestamp

### Jadwal Meet Admin
- Detail pelanggan menampilkan jadwal meet.
- Tombol `Update` sudah ada secara UI, belum punya logic.
- Database nanti:
  - admin bisa confirm/reschedule/cancel
  - admin bisa mengisi link Google Meet
  - client melihat update di project hub/detail project

### Progress Timeline Admin
- Admin bisa klik `+ Kegiatan`.
- Form kegiatan:
  - judul kegiatan
  - tanggal
  - deskripsi progress
  - upload foto
- Upload foto sekarang hanya preview lokal via `URL.createObjectURL`.
- Tombol `Simpan` menambah activity mock.
- Setiap activity punya tombol `Selesai`.
- History progress di bawah memakai timeline titik-titik.
- Database/storage nanti:
  - activity per project
  - title
  - description
  - date
  - status
  - image/file attachment
  - created_by admin id
  - created_at
  - completed_at

### Task List Admin
- Tab `Task List`.
- Saat ini masih mock:
  - Kirim recap konsultasi
  - Cek ulang ukuran kitchen set
  - Konfirmasi slot meeting
  - Update database vendor
- Tombol `Tandai selesai` masih visual.
- Database nanti:
  - task id
  - assigned_to
  - project id optional
  - due date
  - status
  - priority

### Client Database Admin
- Tab `Client Database`.
- Saat ini list mock client dan project.
- Ada input cari client visual.
- Database nanti:
  - list semua client
  - filter/search
  - project count per client
  - status project terbaru
  - detail profil client

## 6. Entitas Database yang Disarankan

### users
- id
- google_id
- email
- name
- avatar_url
- role
- created_at
- updated_at

### client_profiles
- id
- user_id
- phone
- address
- company_name optional
- created_at
- updated_at

### projects
- id
- client_id
- title
- property_type
- location
- budget_estimate
- project_start
- project_end
- duration_text
- style_preference
- status
- stage
- submitted_at
- created_at
- updated_at

### project_briefs
- id
- project_id
- property_type
- location
- budget_estimate
- project_start
- project_end
- duration_text
- design_needs
- style_preference
- status: draft/submitted/revised
- created_by
- updated_by
- created_at
- updated_at

### project_brief_revisions
- id
- brief_id
- changed_by
- before_json
- after_json
- note
- created_at

### consultations
- id
- project_id
- client_id
- requested_by
- confirmed_by
- date
- start_time
- end_time
- timezone
- meeting_url
- status
- notes
- created_at
- updated_at

### project_activities
- id
- project_id
- title
- description
- activity_date
- status
- created_by
- completed_by
- completed_at
- created_at
- updated_at

### project_activity_media
- id
- activity_id
- media_id
- created_at

### documents
- id
- project_id
- title
- file_url
- file_type
- file_size
- visibility
- uploaded_by
- created_at

### ai_conversations
- id
- user_id
- project_id nullable
- title
- created_at
- updated_at

### ai_messages
- id
- conversation_id
- role
- content
- model
- token_usage_json nullable
- created_at

### catalog_categories
- id
- slug
- title
- description
- hero_media_id
- sort_order
- is_active

### catalog_items
- id
- category_id
- title
- description
- image_media_id
- location nullable
- item_type: inspiration/project
- sort_order
- is_active

### catalog_item_services
- id
- catalog_item_id
- service_name

### tasks
- id
- project_id nullable
- title
- description
- assigned_to
- due_date
- status
- priority
- created_by
- created_at
- updated_at

### media_assets
- id
- owner_id nullable
- url
- path
- mime_type
- size
- width nullable
- height nullable
- alt_text nullable
- created_at

## 7. Status dan Enum Penting

### Project Stage
- Request Projek
- Review Brief
- Konsultasi
- Progres Pengerjaan
- Selesai

### Project Status Client
- Brief baru
- Konsultasi desain
- RAB disiapkan
- Produksi
- Instalasi
- Selesai

### Activity Status
- Berjalan
- Selesai

### Consultation Status
- requested
- confirmed
- rescheduled
- cancelled
- done

### Document Visibility
- admin_only
- client_visible

## 8. Flow End-to-End yang Harus Dijaga

### Client Membuat Project Baru
1. Client login Google.
2. Client masuk `/dashboard/user`.
3. Client melihat project hub.
4. Client klik `Tambah project`.
5. Client isi brief.
6. Client bisa `Simpan draft` atau `Submit permintaan`.
7. Jika submit, project masuk stage `Request Projek`.
8. Project muncul sebagai card di project hub client.
9. Project juga muncul di pipeline admin.

### Client Membuka Project
1. Client klik card project.
2. Client melihat dashboard detail project.
3. Timeline otomatis fokus ke current progress.
4. Client bisa buka dokumen, jadwal konsultasi, AI, dan katalog.

### Client Mengajukan Konsultasi
1. Client memilih project.
2. Client buka tab konsultasi.
3. Client pilih tanggal dan jam.
4. Sistem membuat request consultation.
5. Admin melihat request di detail pelanggan.
6. Admin confirm atau update jadwal.
7. Client melihat jadwal meet di project hub dan detail project.

### Admin Mengelola Pipeline
1. Admin login Google.
2. Admin masuk `/dashboard/admin`.
3. Admin melihat board pipeline.
4. Admin drag card antar stage.
5. Stage tersimpan ke database.
6. Perubahan stage terlihat oleh client.

### Admin Review dan Edit Brief
1. Admin buka detail pelanggan.
2. Admin membaca hasil form user.
3. Setelah konsultasi, admin bisa klik `Edit brief`.
4. Admin mengubah field brief.
5. Sistem menyimpan versi terbaru dan revision history.
6. Client melihat update project jika field relevan ditampilkan.

### Admin Update Progress
1. Admin buka detail pelanggan.
2. Admin klik `+ Kegiatan`.
3. Admin isi judul, tanggal, deskripsi.
4. Admin upload foto progress.
5. Activity tersimpan dan muncul di progress terbaru.
6. Activity juga muncul di history timeline.
7. Admin bisa menandai activity sebagai `Selesai`.
8. Client timeline/progress ikut ter-update.

### Admin Menyelesaikan Project
1. Admin menyelesaikan semua activity penting.
2. Admin drag project ke stage `Selesai` atau set status selesai.
3. Project client tampil selesai.
4. Dokumen final tetap bisa diakses client.

## 9. Fitur yang Masih Mock dan Harus Dibackend

- Login Google dan session.
- Role-based access control.
- Persist project client.
- Persist draft brief.
- Persist submitted brief.
- Edit brief oleh admin dengan revision history.
- Drag/drop pipeline tersimpan.
- Jadwal konsultasi tersimpan.
- Generate/simpan Google Meet link.
- Upload foto progress ke storage.
- Upload/download dokumen project.
- AI conversation dan message history.
- Search katalog/client/task.
- Task admin.
- Notification untuk client/admin.
- Status sync antara admin stage dan client timeline.

## 10. Checklist Implementasi Database

- [ ] Tambahkan Google OAuth.
- [ ] Tambahkan middleware proteksi `/dashboard/user` dan `/dashboard/admin`.
- [ ] Tambahkan tabel `users` dan role.
- [ ] Migrasi mock `ClientProject` ke `projects` dan `project_briefs`.
- [ ] Migrasi mock admin `ProjectCardData` ke `projects`, `consultations`, dan `project_activities`.
- [ ] Buat storage bucket untuk progress photo dan dokumen.
- [ ] Hubungkan `Submit permintaan` ke create project + brief.
- [ ] Hubungkan `Simpan draft` ke draft brief.
- [ ] Hubungkan admin `Edit brief` ke update brief + revision history.
- [ ] Hubungkan drag/drop kanban ke update `projects.stage`.
- [ ] Hubungkan `+ Kegiatan` ke create activity + upload media.
- [ ] Hubungkan `Selesai` activity ke update status activity.
- [ ] Hubungkan consultation scheduling ke tabel `consultations`.
- [ ] Hubungkan dokumen ke tabel `documents`.
- [ ] Hubungkan AI history ke tabel `ai_conversations` dan `ai_messages`.
- [ ] Jadikan katalog/inspirasi dinamis dari database.
- [ ] Tambahkan audit log untuk perubahan admin penting.
- [ ] Tambahkan seed data awal dari `src/lib/home-content.ts`.

## 11. Catatan UI dan Responsif

- Dashboard boleh scroll vertikal, tetapi tidak boleh ada overlap.
- Project hub client harus berupa card kotak.
- Admin pipeline card harus compact agar tidak keluar dari kolom.
- Timeline client harus scroll horizontal di dalam card timeline, bukan membuat seluruh halaman melebar.
- AI tab harus full page: sidebar history kecil kiri, chat kanan, yang scroll hanya area chat.
- Katalog boleh memanjang ke bawah di kategori awal.
- Palette dashboard tetap mengikuti landing page.


- user harus input nomer wa wajib ketika data dia belum ada di database ( habis login) 