import {
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import type {
  BonusInfo,
  PaymentMilestone,
  ProgressLog,
  VendorMenuItem,
  VendorProfile,
  VendorProject,
  WorkBrief,
} from "./types";

export const vendorMenuItems: VendorMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "projects",
    label: "Proyek Saya",
    icon: FolderKanban,
  },
  {
    id: "brief",
    label: "Brief & Rencana Kerja",
    icon: ClipboardList,
  },
  {
    id: "progress-log",
    label: "Log Progress",
    icon: FileText,
  },
  {
    id: "payment-bonus",
    label: "Pembayaran & Bonus",
    icon: Wallet,
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: Settings,
  },
];

export const vendorProfile: VendorProfile = {
  name: "Andi Interior Partner",
  email: "vendor@email.com",
  phone: "0812-3456-7890",
  serviceArea: "Semarang dan sekitarnya",
  skill: "Furniture custom, wardrobe, kitchen set, storage built-in",
  bankName: "Bank Mandiri",
  bankAccount: "1234567890",
};

export const vendorProjects: VendorProject[] = [
  {
    id: "vp-1",
    name: "Wardrobe Kamar Utama",
    type: "Wardrobe Custom",
    location: "Semarang, Jawa Tengah",
    status: "Sedang Dikerjakan",
    progress: 68,
    deadline: "28 Juni 2026",
    startDate: "18 Juni 2026",
    customerBrief:
      "Customer membutuhkan wardrobe custom untuk kamar utama dengan konsep warm modern, hemat tempat, dan memiliki banyak ruang penyimpanan.",
    vmNotes:
      "Pastikan ukuran laci dan area gantungan sesuai brief. Jika ada perubahan material atau kendala lapangan, laporkan melalui Log Progress.",
    material: "Plywood + HPL matte neutral, soft close rail, hanging rod",
    nextTask: "Melanjutkan produksi kabinet dan persiapan finishing.",
    bonusStatus: "Berpotensi Aktif",
    fieldTeam: [
      {
        id: "team-1",
        name: "Budi",
        role: "Tukang kayu",
        phone: "0812-1111-2222",
      },
      {
        id: "team-2",
        name: "Rian",
        role: "Finishing",
        phone: "0812-3333-4444",
      },
      {
        id: "team-3",
        name: "Dimas",
        role: "Installer",
        phone: "0812-5555-6666",
      },
    ],
  },
  {
    id: "vp-2",
    name: "Kitchen Set Minimalis",
    type: "Kitchen Set",
    location: "Bandung, Jawa Barat",
    status: "Menunggu Brief",
    progress: 20,
    deadline: "10 Juli 2026",
    startDate: "Menunggu brief final",
    customerBrief:
      "Customer membutuhkan kitchen set minimalis dengan storage maksimal dan material yang mudah dibersihkan.",
    vmNotes:
      "Brief final masih disiapkan oleh VMatch. Vendor belum perlu memulai pengerjaan sebelum brief disetujui.",
    material: "Menunggu persetujuan material final",
    nextTask: "Menunggu brief dan rencana kerja dari VMatch.",
    bonusStatus: "Berpotensi Aktif",
    fieldTeam: [],
  },
  {
    id: "vp-3",
    name: "Storage & Rak Multifungsi",
    type: "Storage Built-in",
    location: "Semarang, Jawa Tengah",
    status: "Selesai",
    progress: 100,
    deadline: "30 Mei 2026",
    startDate: "10 Mei 2026",
    customerBrief:
      "Customer membutuhkan storage multifungsi untuk ruang keluarga dengan rak terbuka dan kabinet tertutup.",
    vmNotes:
      "Proyek selesai dan sudah lolos QC. Dokumentasi progress dan hasil akhir sudah tersimpan.",
    material: "Plywood + HPL, finishing neutral warm tone",
    nextTask: "Tidak ada tugas aktif.",
    bonusStatus: "Sudah Dibayarkan",
    fieldTeam: [
      {
        id: "team-4",
        name: "Seno",
        role: "Helper",
        phone: "0812-7777-8888",
      },
    ],
  },
];

export const workBriefs: WorkBrief[] = [
  {
    id: "brief-1",
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    scope: [
      "Membuat wardrobe custom sesuai ukuran ruangan.",
      "Menyediakan area gantungan baju, laci, rak lipat, dan storage barang kecil.",
      "Menggunakan finishing warm modern dengan warna netral.",
      "Melakukan instalasi dan pengecekan fungsi laci/engsel.",
    ],
    materialApproved: [
      "Plywood + HPL matte neutral",
      "Soft close rail",
      "Hanging rod",
      "Handle minimalis",
    ],
    timeline: [
      {
        label: "Survey & final ukuran",
        date: "18 Juni 2026",
      },
      {
        label: "Produksi kabinet",
        date: "20–25 Juni 2026",
      },
      {
        label: "Finishing",
        date: "25–26 Juni 2026",
      },
      {
        label: "Instalasi",
        date: "27 Juni 2026",
      },
      {
        label: "QC VMatch",
        date: "28 Juni 2026",
      },
    ],
    qcChecklist: [
      "Ukuran sesuai brief",
      "Material sesuai persetujuan",
      "Finishing rapi",
      "Fungsi laci dan engsel berjalan baik",
      "Area kerja bersih setelah instalasi",
    ],
    notes:
      "Jika ada kendala material, ukuran, atau timeline, vendor wajib melapor melalui Log Progress agar VMatch dapat menyesuaikan komunikasi ke customer.",
    status: "Sudah Dibaca",
  },
  {
    id: "brief-2",
    projectId: "vp-2",
    projectName: "Kitchen Set Minimalis",
    scope: [
      "Membuat kitchen set custom dengan layout minimalis.",
      "Maksimalkan storage kabinet bawah dan atas.",
      "Material mudah dibersihkan dan cocok untuk dapur harian.",
    ],
    materialApproved: [
      "Menunggu persetujuan HPL",
      "Menunggu persetujuan top table",
      "Menunggu detail handle",
    ],
    timeline: [
      {
        label: "Brief final",
        date: "Menunggu VMatch",
      },
      {
        label: "Produksi",
        date: "Belum dijadwalkan",
      },
      {
        label: "Instalasi",
        date: "Belum dijadwalkan",
      },
    ],
    qcChecklist: [
      "Kabinet terpasang presisi",
      "Finishing rapi",
      "Area dapur bersih setelah pengerjaan",
    ],
    notes:
      "Vendor belum perlu memulai pengerjaan sampai brief final dan material disetujui.",
    status: "Belum Dibaca",
  },
];

export const progressLogs: ProgressLog[] = [
  {
    id: "log-1",
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    date: "20 Juni 2026",
    status: "Sesuai Jadwal",
    progressPercent: 68,
    workSummary:
      "Pemotongan plywood selesai dan sebagian kabinet utama sudah mulai dirakit.",
    issue: "Tidak ada kendala.",
    nextPlan: "Melanjutkan perakitan kabinet dan persiapan finishing.",
    photoLabel: "Foto progress produksi kabinet",
  },
  {
    id: "log-2",
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    date: "19 Juni 2026",
    status: "Sesuai Jadwal",
    progressPercent: 45,
    workSummary:
      "Material sudah diterima dan proses marking ukuran mulai dilakukan.",
    issue: "Tidak ada kendala.",
    nextPlan: "Mulai pemotongan material utama.",
    photoLabel: "Foto material dan marking ukuran",
  },
  {
    id: "log-3",
    projectId: "vp-3",
    projectName: "Storage & Rak Multifungsi",
    date: "29 Mei 2026",
    status: "Sesuai Jadwal",
    progressPercent: 100,
    workSummary:
      "Pekerjaan selesai, area kerja dibersihkan, dan hasil akhir siap QC.",
    issue: "Tidak ada kendala.",
    nextPlan: "Menunggu QC dari VMatch.",
    photoLabel: "Foto hasil akhir storage",
  },
];

export const paymentMilestones: PaymentMilestone[] = [
  {
    id: "pay-1",
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    title: "Milestone Produksi",
    amount: "Rp6.000.000",
    status: "Menunggu Milestone",
    dueInfo: "Diproses setelah progress produksi disetujui VMatch.",
  },
  {
    id: "pay-2",
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    title: "Milestone Instalasi",
    amount: "Rp5.000.000",
    status: "Menunggu Milestone",
    dueInfo: "Diproses setelah instalasi selesai.",
  },
  {
    id: "pay-3",
    projectId: "vp-3",
    projectName: "Storage & Rak Multifungsi",
    title: "Payout Final",
    amount: "Rp7.500.000",
    status: "Dibayarkan",
    dueInfo: "Sudah dibayarkan setelah QC disetujui.",
  },
];

export const bonusInfos: BonusInfo[] = [
  {
    projectId: "vp-1",
    projectName: "Wardrobe Kamar Utama",
    status: "Berpotensi Aktif",
    amount: "Rp500.000",
    reason:
      "Progress masih sesuai timeline dan log progress sudah cukup lengkap.",
    requirements: [
      {
        label: "Progress sesuai timeline",
        completed: true,
      },
      {
        label: "Log progress terisi pada milestone penting",
        completed: true,
      },
      {
        label: "Kendala dilaporkan lebih awal jika ada",
        completed: true,
      },
      {
        label: "Hasil lolos QC VMatch",
        completed: false,
      },
      {
        label: "Tidak ada komplain besar dari customer",
        completed: true,
      },
    ],
  },
  {
    projectId: "vp-3",
    projectName: "Storage & Rak Multifungsi",
    status: "Sudah Dibayarkan",
    amount: "Rp350.000",
    reason:
      "Proyek selesai sesuai timeline, dokumentasi progress lengkap, dan hasil lolos QC.",
    requirements: [
      {
        label: "Progress sesuai timeline",
        completed: true,
      },
      {
        label: "Log progress terisi pada milestone penting",
        completed: true,
      },
      {
        label: "Hasil lolos QC VMatch",
        completed: true,
      },
      {
        label: "Tidak ada komplain besar dari customer",
        completed: true,
      },
    ],
  },
];

export const vendorUpdates = [
  {
    id: "update-1",
    title: "Brief wardrobe sudah dibaca",
    description:
      "Tim VMatch mencatat bahwa brief Wardrobe Kamar Utama sudah dipahami vendor.",
    time: "Hari ini",
  },
  {
    id: "update-2",
    title: "Log progress terakhir diterima",
    description:
      "Update progress produksi kabinet sudah masuk dan menunggu review VMatch.",
    time: "Kemarin",
  },
  {
    id: "update-3",
    title: "Bonus masih berpotensi aktif",
    description:
      "Vendor masih memenuhi syarat bonus selama progress sesuai timeline dan QC lolos.",
    time: "2 hari lalu",
  },
];