Customer mengajukan proyek, admin review request customer, admin membuat brief proyek, admin memilih vendor yang sesuai, admin mengirim brief ke vendor, vendor membaca brief, vendor mengisi biaya final proyek/penawaran biaya, vendor mengirim biaya ke admin (tdk perlu dibuat rinci kyk triplek 1 lembarnya berapa butuh berapa lembar, hpl butuh berapa harganya berapa ngga perlu gini yaa, langsung biaya final atau penawaran), admin review biaya vendor, admin menyetujui atau meminta revisi ke vendor (opsional bagian ini), jika sudah sesuai, admin membuat RAB Final VMatch, admin menambahkan biaya layanan VMatch/margin/promo jika ada, admin mengirim RAB final ke customer, customer menyetujui atau meminta revisi, jika disetujui, admin membuat invoice, proyek aktif

# rab

## 1. Tampilan Vendor: Penawaran Biaya Vendor

Vendor **tidak perlu isi RAB rinci material per lembar**. Vendor cukup mengisi biaya final dari sisi vendor.

Struktur tampilannya:

```
PENAWARAN BIAYA VENDOR

Informasi Brief
- Nama proyek
- Customer
- Lokasi
- Jenis properti
- Jenis pekerjaan
- Budget customer
- Style/referensi
- Catatan admin

Form Penawaran Biaya
- Ringkasan pekerjaan
- Total penawaran biaya vendor
- Estimasi durasi pengerjaan
- Catatan teknis vendor
- Upload file pendukung jika ada

Aksi
[ Simpan Draft ]
[ Kirim Penawaran ke Admin ]
```

Contoh isi:

```
Nama Proyek:
Kitchen Set Modern Minimalis

Total Penawaran Vendor:
Rp18.500.000

Estimasi Durasi:
14 hari kerja

Catatan Vendor:
Harga sudah termasuk produksi, finishing, dan pemasangan. Belum termasuk perubahan scope di luar brief.
```

Status vendor:

```
Brief Diterima
Draft Penawaran
Penawaran Dikirim
Perlu Revisi
Penawaran Disetujui
```

---

## 2. Tampilan Admin: Review Penawaran + RAB Final VMatch

Admin melihat biaya dari vendor, lalu menyusun harga final untuk customer.

Struktur tampilannya:

```
RAB FINAL VMATCH

Informasi Proyek
- Nama proyek
- Customer
- Vendor terpilih
- Lokasi
- Jenis pekerjaan
- Status RAB

Penawaran Vendor
- Total penawaran vendor
- Estimasi durasi vendor
- Catatan vendor
- File pendukung vendor

Review Admin
- Status review
- Catatan admin
- Tombol setujui/minta revisi

Perhitungan Final VMatch
- Biaya dari vendor
- Biaya layanan VMatch
- Margin/management fee
- Promo/diskon
- Biaya tambahan jika ada
- Total final untuk customer

Aksi
[ Minta Revisi Vendor ]
[ Setujui Penawaran ]
[ Simpan RAB Final ]
[ Kirim RAB ke Customer ]
```

Contoh perhitungan admin:

```
Biaya Vendor              Rp18.500.000
Biaya Layanan VMatch       Rp1.500.000
Promo/Diskon             Rp500.000 -

Total RAB Final            Rp19.500.000
```

Status admin:

```
Menunggu Penawaran Vendor
Penawaran Vendor Dikirim
Penawaran Direview Admin
Revisi Penawaran Vendor
Penawaran Vendor Disetujui
RAB Final VMatch Disusun
RAB Dikirim ke Customer
RAB Disetujui Customer
Invoice Dibuat
```

---

## 3. Tampilan Customer: RAB Final

Customer **tidak perlu melihat biaya mentah vendor**. Customer hanya melihat RAB final dari VMatch.

Struktur tampilannya:

```
RAB FINAL PROYEK

Ringkasan Proyek
- Nama proyek
- Jenis pekerjaan
- Lokasi
- Estimasi durasi
- Status RAB

Detail Biaya
- Paket pekerjaan
- Biaya proyek
- Biaya layanan VMatch jika ditampilkan
- Diskon/promo jika ada
- Total pembayaran

Catatan VMatch
- Scope pekerjaan
- Estimasi durasi
- Ketentuan revisi
- Catatan pembayaran

Aksi Customer
[ Setujui RAB ]
[ Minta Revisi ]
```

Contoh customer melihat:
Kitchen Set Modern Minimalis

Estimasi Durasi:
14 hari kerja

Total RAB Final:
Rp19.500.000

Catatan:
Harga final sudah mencakup pekerjaan sesuai brief, koordinasi proyek, dan proses monitoring VMatch.
