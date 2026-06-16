import type { Invoice, Meeting, Project } from "./types";

export const projects: Project[] = [
  {
    id: "1",
    name: "Kitchen Set Walnut",
    type: "Kitchen Set",
    location: "Bandung",
    stage: "production",
    stageLabel: "Produksi",
    progress: 68,
    lastUpdate: "Modul utama sedang diproduksi",
    nextStep: "Review progress produksi minggu ini",
    timeline: [
      {
        title: "Request diterima",
        date: "15 Mei 2026",
        description: "Tim VMatch sudah menerima brief kamu.",
        done: true,
      },
      {
        title: "Konsultasi selesai",
        date: "18 Mei 2026",
        description: "Brief disesuaikan berdasarkan hasil konsultasi.",
        done: true,
      },
      {
        title: "Produksi",
        date: "24 Mei 2026",
        description: "Modul utama sedang diproduksi oleh partner internal.",
        done: false,
      },
    ],
    files: [
      { name: "RAB Kitchen Set Walnut.pdf", type: "RAB", date: "20 Mei 2026" },
      { name: "Foto Progress Minggu 1.jpg", type: "Progress", date: "26 Mei 2026" },
    ],
  },
  {
    id: "2",
    name: "Wardrobe Minimalis",
    type: "Wardrobe",
    location: "Semarang",
    stage: "consultation",
    stageLabel: "Konsultasi",
    progress: 20,
    lastUpdate: "Menunggu jadwal konsultasi",
    nextStep: "Konfirmasi jadwal dengan tim VMatch",
    timeline: [
      {
        title: "Request diterima",
        date: "12 Mei 2026",
        description: "Brief awal sudah masuk.",
        done: true,
      },
      {
        title: "Konsultasi",
        date: "Menunggu",
        description: "Jadwal konsultasi sedang diatur.",
        done: false,
      },
    ],
    files: [{ name: "Referensi Wardrobe.png", type: "Referensi", date: "12 Mei 2026" }],
  },
  {
    id: "3",
    name: "Backdrop TV Modern",
    type: "Backdrop TV",
    location: "Jakarta",
    stage: "done",
    stageLabel: "Selesai",
    progress: 100,
    lastUpdate: "Proyek selesai dan QC disetujui",
    nextStep: "Garansi aktif",
    timeline: [
      {
        title: "Proyek selesai",
        date: "15 Mar 2026",
        description: "QC disetujui dan garansi aktif.",
        done: true,
      },
    ],
    files: [{ name: "Invoice Final.pdf", type: "Invoice", date: "20 Mar 2026" }],
  },
];

export const meetings: Meeting[] = [
  {
    id: "1",
    projectName: "Kitchen Set Walnut",
    date: "22 Mei 2026",
    time: "13:00 WIB",
    agenda: "Review progress produksi minggu ke-2",
    status: "confirmed",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    projectName: "Wardrobe Minimalis",
    date: "28 Mei 2026",
    time: "10:00 WIB",
    agenda: "Diskusi kebutuhan dan preferensi material",
    status: "requested",
  },
];

export const invoices: Invoice[] = [
  {
    id: "1",
    projectName: "Kitchen Set Walnut",
    description: "Pelunasan 50% Kitchen Set Walnut",
    amount: "Rp47.500.000",
    status: "pending",
    dueDate: "15 Jul 2026",
  },
  {
    id: "2",
    projectName: "Backdrop TV Modern",
    description: "Full Payment Backdrop TV",
    amount: "Rp28.000.000",
    status: "paid",
    dueDate: "5 Mar 2026",
  },
];