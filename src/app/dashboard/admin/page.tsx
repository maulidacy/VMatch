"use client";

import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Star,
  UserRound,
  Users2,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type PageId =
  | "dashboard"
  | "requests"
  | "solutions"
  | "projects"
  | "timeline"
  | "revisions"
  | "vendors"
  | "files"
  | "customers"
  | "portfolio"
  | "reviews"
  | "settings";

type MenuItem = {
  id: PageId;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Request Proyek", icon: ClipboardList },
  { id: "solutions", label: "Solusi Proyek", icon: FileText },
  { id: "projects", label: "Proyek Aktif", icon: BriefcaseBusiness },
  { id: "timeline", label: "Timeline Progress", icon: CalendarDays },
  { id: "revisions", label: "Revisi Customer", icon: MessageSquareText },
  { id: "vendors", label: "Vendor Partner", icon: Wrench },
  { id: "files", label: "File Proyek", icon: FolderOpen },
  { id: "customers", label: "Customer", icon: Users2 },
  { id: "portfolio", label: "Inspirasi/Portfolio", icon: ImageIcon },
  { id: "reviews", label: "Review", icon: Star },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

const stats = [
  {
    label: "Total Request",
    value: "128",
    note: "+12 bulan ini",
    icon: ClipboardList,
  },
  {
    label: "Proyek Aktif",
    value: "24",
    note: "8 tahap produksi",
    icon: BriefcaseBusiness,
  },
  {
    label: "Menunggu Solusi",
    value: "9",
    note: "Perlu analisis",
    icon: FileText,
  },
  {
    label: "Revisi Masuk",
    value: "6",
    note: "3 prioritas",
    icon: MessageSquareText,
  },
];

const requests = [
  {
    customer: "Nadya P.",
    project: "Kitchen Set",
    location: "Jakarta Selatan",
    budget: "Rp100–140 jt",
    date: "15 Mei 2026",
    status: "Request Masuk",
  },
  {
    customer: "Kevin A.",
    project: "Wardrobe",
    location: "Tangerang",
    budget: "Rp180–230 jt",
    date: "14 Mei 2026",
    status: "Sedang Dianalisis",
  },
  {
    customer: "PT Ruang Karya",
    project: "Office Interior",
    location: "Jakarta Pusat",
    budget: "Rp320–410 jt",
    date: "13 Mei 2026",
    status: "Menunggu Solusi",
  },
  {
    customer: "Mira H.",
    project: "Backdrop TV",
    location: "Bandung",
    budget: "Rp85–115 jt",
    date: "12 Mei 2026",
    status: "Disetujui",
  },
];

const activeProjects = [
  {
    name: "Kitchen Set Walnut",
    customer: "Mira H.",
    type: "Kitchen Set",
    location: "Bandung",
    budget: "Rp95 jt",
    start: "Mei 2026",
    end: "Juli 2026",
    status: "Produksi",
    progress: 68,
  },
  {
    name: "Office Clean Layout",
    customer: "PT Ruang Karya",
    type: "Office",
    location: "Jakarta Pusat",
    budget: "Rp360 jt",
    start: "Juli 2026",
    end: "Nov 2026",
    status: "Koordinasi Vendor",
    progress: 42,
  },
  {
    name: "Japandi Living Room",
    customer: "Nadya P.",
    type: "Living Room",
    location: "Jakarta Selatan",
    budget: "Rp125 jt",
    start: "Mei 2026",
    end: "Agustus 2026",
    status: "Perencanaan",
    progress: 24,
  },
];

const timeline = [
  {
    title: "Brief customer diterima",
    date: "15 Mei 2026",
    status: "Selesai",
    note: "Ukuran ruang, referensi desain, dan preferensi material sudah masuk.",
  },
  {
    title: "Analisis kebutuhan ruang",
    date: "16 Mei 2026",
    status: "Berjalan",
    note: "Admin menyusun kebutuhan utama dan batasan budget customer.",
  },
  {
    title: "Koordinasi vendor partner",
    date: "18 Mei 2026",
    status: "Menunggu",
    note: "Tim akan memilih partner internal yang sesuai spesialisasi proyek.",
  },
];

const vendors = [
  {
    name: "Aruna Woodwork",
    skill: "Kitchen Set",
    location: "Semarang",
    status: "Aktif",
    project: "2 proyek",
    rating: "4.8",
  },
  {
    name: "Karya Panel Studio",
    skill: "Wardrobe",
    location: "Bandung",
    status: "Sedang Mengerjakan",
    project: "1 proyek",
    rating: "4.7",
  },
  {
    name: "Linea Interior",
    skill: "Backdrop TV",
    location: "Jakarta",
    status: "Aktif",
    project: "3 proyek",
    rating: "4.9",
  },
];

const files = [
  {
    name: "RAB Kitchen Set Walnut.pdf",
    type: "RAB",
    project: "Kitchen Set Walnut",
    date: "15 Mei 2026",
  },
  {
    name: "Referensi Japandi Living.png",
    type: "Referensi",
    project: "Japandi Living Room",
    date: "14 Mei 2026",
  },
  {
    name: "Invoice DP Office Layout.pdf",
    type: "Invoice",
    project: "Office Clean Layout",
    date: "13 Mei 2026",
  },
];

const customers = [
  {
    name: "Nadya P.",
    email: "nadya@email.com",
    phone: "0812xxxx",
    location: "Jakarta Selatan",
    request: 2,
    status: "Aktif",
  },
  {
    name: "Kevin A.",
    email: "kevin@email.com",
    phone: "0857xxxx",
    location: "Tangerang",
    request: 1,
    status: "Aktif",
  },
  {
    name: "Mira H.",
    email: "mira@email.com",
    phone: "0821xxxx",
    location: "Bandung",
    request: 3,
    status: "Prioritas",
  },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeMenu = useMemo(
    () => menuItems.find((item) => item.id === activePage) ?? menuItems[0],
    [activePage],
  );

  const changePage = (page: PageId) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  return (
    <main className="min-h-[100dvh] bg-white text-[#31332c]">
      <Sidebar
        activePage={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangePage={changePage}
      />

      <section className="min-h-[100dvh] lg:pl-[290px]">
        <Header
          title={activeMenu.label}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />

        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {activePage === "dashboard" && <DashboardOverview />}
          {activePage === "requests" && <RequestsPage />}
          {activePage === "solutions" && <SolutionsPage />}
          {activePage === "projects" && <ActiveProjectsPage />}
          {activePage === "timeline" && <TimelinePage />}
          {activePage === "revisions" && <RevisionsPage />}
          {activePage === "vendors" && <VendorsPage />}
          {activePage === "files" && <FilesPage />}
          {activePage === "customers" && <CustomersPage />}
          {activePage === "portfolio" && <PortfolioContentPage />}
          {activePage === "reviews" && <ReviewsPage />}
          {activePage === "settings" && <SettingsPage />}
        </div>
      </section>
    </main>
  );
}

function Sidebar({
  activePage,
  isOpen,
  onClose,
  onChangePage,
}: {
  activePage: PageId;
  isOpen: boolean;
  onClose: () => void;
  onChangePage: (page: PageId) => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[290px] flex-col bg-[#6B5B52] text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            className="font-serif text-[32px] italic leading-none text-white"
          >
            VMatch
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Admin Panel
          </p>
          <p className="mt-2 text-[13px] leading-6 text-white/70">
            Kelola request, solusi, vendor partner, dan progres proyek.
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePage(item.id)}
                className={`flex h-12 w-full items-center justify-between px-4 text-left text-[13px] font-medium transition ${active
                    ? "bg-white text-[#6B5B52]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {item.label}
                </span>
                {active && <ChevronRight size={15} />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#ded6ca] p-4">
          <Link
            href="/login"
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#F5F1EC] text-[13px] font-semibold text-[#6b5b52] transition hover:bg-[#31332c] hover:text-white"
          >
            <LogOut size={16} />
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}

function Header({
  title,
  onOpenMenu,
}: {
  title: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DED4] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-10 w-10 place-items-center border border-[#ded6ca] bg-white text-[#6B5B52] transition hover:bg-[#f7f4ef] lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8b8179]">
            Dashboard / {title}
          </p>
        </div>

        <button
          className="grid h-10 w-10 place-items-center border border-[#ded6ca] bg-white text-[#6b5b52] transition hover:bg-[#f7f4ef]"
          aria-label="Notifikasi"
        >
          <Bell size={18} />
        </button>

        <div className="hidden h-10 items-center gap-3 border border-[#ded6ca] bg-white pl-1 pr-4 sm:flex">
          <div className="grid h-8 w-8 place-items-center bg-[#31332c] text-white">
            <UserRound size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none text-[#31332c]">
              Admin
            </p>
            <p className="mt-1 text-[11px] leading-none text-[#797c73]">
              VMatch Team
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-[0_14px_35px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] text-[#797c73]">{item.label}</p>
                  <h2 className="mt-3 font-serif text-[38px] leading-none">
                    {item.value}
                  </h2>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4f1ed] text-[#6b5b52]">
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-5 text-[12px] font-medium text-[#6b5b52]">
                {item.note}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Card title="Request terbaru">
          <ProcessFlow
            items={["Customer Request", "Admin Analisis", "Buat Solusi"]}
          />

          <ResponsiveTable
            headers={["Customer", "Proyek", "Lokasi", "Budget", "Status"]}
            rows={requests
              .slice(0, 4)
              .map((item) => [
                item.customer,
                item.project,
                item.location,
                item.budget,
                <StatusBadge key={item.customer} status={item.status} />,
              ])}
          />
        </Card>

        <Card title="Aktivitas admin" subtitle="Update internal terbaru">
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.title} className="bg-[#f7f4ef] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.title}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-[12px] text-[#797c73]">{item.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function RequestsPage() {
  return (
    <Card
      title="Request proyek"
      subtitle="Daftar kebutuhan proyek yang masuk dari customer"
    >
      <FilterBar placeholder="Cari customer atau jenis proyek..." />

      <ResponsiveTable
        headers={[
          "Customer",
          "Jenis Proyek",
          "Lokasi",
          "Budget",
          "Tanggal",
          "Status",
          "Aksi",
        ]}
        rows={requests.map((item) => [
          item.customer,
          item.project,
          item.location,
          item.budget,
          item.date,
          <StatusBadge key={item.customer} status={item.status} />,
          <ActionButton key={`btn-${item.customer}`}>Detail</ActionButton>,
        ])}
      />
    </Card>
  );
}

function SolutionsPage() {
  return (
    <Card
      title="Solusi proyek"
      subtitle="Susun proposal solusi sebelum dikirim ke customer"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          "Ringkasan kebutuhan customer",
          "Rekomendasi konsep desain",
          "Estimasi budget",
          "Estimasi waktu pengerjaan",
          "Rekomendasi material",
          "Catatan admin",
        ].map((label) => (
          <label key={label} className="grid gap-2">
            <span className="text-[12px] font-semibold text-[#6b5b52]">
              {label}
            </span>
            <textarea
              className="min-h-28 border border-[#ded6ca] bg-[#f7f4ef] p-4 text-[14px] outline-none focus:border-[#31332c]"
              placeholder={`Isi ${label.toLowerCase()}...`}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <ActionButton>Simpan Draft</ActionButton>
        <button className="h-11 rounded-full bg-[#31332c] px-6 text-[13px] font-semibold text-white">
          Kirim ke Customer
        </button>
      </div>
    </Card>
  );
}

function ActiveProjectsPage() {
  return (
    <Card
      title="Proyek aktif"
      subtitle="Monitoring proyek setelah solusi disetujui customer"
    >
      <ResponsiveTable
        headers={[
          "Proyek",
          "Customer",
          "Jenis",
          "Lokasi",
          "Budget",
          "Status",
          "Progress",
        ]}
        rows={activeProjects.map((item) => [
          item.name,
          item.customer,
          item.type,
          item.location,
          item.budget,
          <StatusBadge key={item.name} status={item.status} />,
          <ProgressBar key={`progress-${item.name}`} value={item.progress} />,
        ])}
      />
    </Card>
  );
}

function TimelinePage() {
  return (
    <Card
      title="Timeline progress"
      subtitle="Tracking progress proyek seperti paket"
    >
      <div className="space-y-0">
        {timeline.map((item, index) => (
          <div key={item.title} className="grid grid-cols-[28px_1fr] gap-4">
            <div className="relative flex justify-center">
              <span className="mt-1.5 h-4 w-4 rounded-full bg-[#31332c]" />
              {index < timeline.length - 1 && (
                <span className="absolute top-7 h-[calc(100%-8px)] w-px bg-[#ded6ca]" />
              )}
            </div>
            <div className="pb-7">
              <div className="rounded-lg border border-[#ded6ca] bg-[#f7f4ef] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-serif text-[24px]">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-[12px] font-medium text-[#6b5b52]">
                  {item.date}
                </p>
                <p className="mt-3 text-[14px] leading-6 text-[#797c73]">
                  {item.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RevisionsPage() {
  return (
    <Card
      title="Revisi customer"
      subtitle="Kelola masukan dan revisi dari customer"
    >
      <ResponsiveTable
        headers={[
          "Customer",
          "Proyek",
          "Isi Revisi",
          "Tanggal",
          "Status",
          "Aksi",
        ]}
        rows={[
          [
            "Nadya P.",
            "Japandi Living Room",
            "Warna storage dibuat lebih terang",
            "15 Mei 2026",
            <StatusBadge key="rev1" status="Masuk" />,
            <ActionButton key="act1">Lihat</ActionButton>,
          ],
          [
            "Mira H.",
            "Kitchen Set Walnut",
            "Handle kabinet diganti model hidden",
            "14 Mei 2026",
            <StatusBadge key="rev2" status="Sedang Diproses" />,
            <ActionButton key="act2">Lihat</ActionButton>,
          ],
        ]}
      />
    </Card>
  );
}

function VendorsPage() {
  return (
    <Card
      title="Vendor partner"
      subtitle="Vendor dikelola admin sebagai partner internal VMatch"
    >
      <ResponsiveTable
        headers={[
          "Nama Vendor",
          "Spesialisasi",
          "Lokasi",
          "Status",
          "Project",
          "Rating",
        ]}
        rows={vendors.map((item) => [
          item.name,
          item.skill,
          item.location,
          <StatusBadge key={item.name} status={item.status} />,
          item.project,
          item.rating,
        ])}
      />
    </Card>
  );
}

function FilesPage() {
  return (
    <Card
      title="File/aset proyek"
      subtitle="Referensi desain, RAB, invoice, progress, dan dokumen final"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <article
            key={file.name}
            className="rounded-lg border border-[#ded6ca] bg-[#f7f4ef] p-5"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#6b5b52]">
              <FileText size={20} />
            </div>
            <h3 className="mt-4 font-medium">{file.name}</h3>
            <p className="mt-2 text-[13px] text-[#797c73]">{file.project}</p>
            <div className="mt-4 flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#6b5b52]">{file.type}</span>
              <span className="text-[#797c73]">{file.date}</span>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CustomersPage() {
  return (
    <Card title="Customer" subtitle="Data customer dan riwayat request">
      <ResponsiveTable
        headers={[
          "Nama",
          "Email",
          "Nomor HP",
          "Lokasi",
          "Jumlah Request",
          "Status",
        ]}
        rows={customers.map((item) => [
          item.name,
          item.email,
          item.phone,
          item.location,
          item.request,
          <StatusBadge key={item.name} status={item.status} />,
        ])}
      />
    </Card>
  );
}

function PortfolioContentPage() {
  return (
    <Card title="Inspirasi/Portfolio" subtitle="Kelola konten landing page">
      <ResponsiveTable
        headers={["Judul", "Kategori", "Deskripsi", "Status", "Aksi"]}
        rows={[
          [
            "Kitchen Set Walnut",
            "Kitchen Set",
            "Dapur modern dengan finishing walnut",
            <StatusBadge key="p1" status="Publish" />,
            <ActionButton key="e1">Edit</ActionButton>,
          ],
          [
            "Wardrobe Minimalis",
            "Wardrobe",
            "Lemari custom modern dan rapi",
            <StatusBadge key="p2" status="Draft" />,
            <ActionButton key="e2">Edit</ActionButton>,
          ],
        ]}
      />
    </Card>
  );
}

function ReviewsPage() {
  return (
    <Card
      title="Review/Feedback"
      subtitle="Kelola feedback setelah proyek selesai"
    >
      <ResponsiveTable
        headers={[
          "Customer",
          "Proyek",
          "Rating",
          "Komentar",
          "Tanggal",
          "Status",
        ]}
        rows={[
          [
            "Mira H.",
            "Kitchen Set Walnut",
            "5.0",
            "Hasil rapi dan update progress jelas.",
            "15 Mei 2026",
            <StatusBadge key="r1" status="Tampil" />,
          ],
          [
            "Kevin A.",
            "Wardrobe",
            "4.8",
            "Material sesuai dan komunikasi mudah.",
            "14 Mei 2026",
            <StatusBadge key="r2" status="Tampil" />,
          ],
        ]}
      />
    </Card>
  );
}

function SettingsPage() {
  return (
    <Card
      title="Pengaturan"
      subtitle="Pengaturan tampilan dan preferensi admin"
    >
      <div className="rounded-lg border border-dashed border-[#ded6ca] bg-[#f7f4ef] p-8 text-center">
        <Settings className="mx-auto text-[#6b5b52]" />
        <h3 className="mt-4 font-serif text-[28px]">Pengaturan admin</h3>
        <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-6 text-[#797c73]">
          Area ini bisa digunakan untuk pengaturan profil admin, notifikasi,
          role, dan preferensi dashboard.
        </p>
      </div>
    </Card>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-7">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5b52]">
          VMatch Admin
        </p>

        <h2 className="mt-3 font-serif text-[42px] leading-tight text-[#31332c] sm:text-[52px]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#797c73]">
            {subtitle}
          </p>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
}

function ProcessFlow({ items }: { items: string[] }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          <span className="border border-[#ded6ca] bg-[#f7f4ef] px-3 py-2 text-[12px] font-medium text-[#6b5b52]">
            {item}
          </span>

          {index < items.length - 1 && (
            <ArrowRight size={15} className="text-[#8b8179]" />
          )}
        </div>
      ))}
    </div>
  );
}

function FilterBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#ded6ca] bg-[#f7f4ef] px-4">
        <Search size={16} className="text-[#8b8179]" />
        <input
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
        />
      </div>
      <div className="relative">
        <select className="h-12 w-full appearance-none border border-[#ded6ca] bg-[#f7f4ef] px-5 pr-12 text-[14px] outline-none">
          <option>Semua Status</option>
          <option>Request Masuk</option>
          <option>Sedang Dianalisis</option>
          <option>Disetujui</option>
        </select>

        <ChevronRight
          size={16}
          className="pointer-events-none absolute right-5 top-1/2 rotate-90 -translate-y-1/2 text-[#6b5b52]"
        />
      </div>
      <ActionButton>Filter</ActionButton>
    </div>
  );
}

function ResponsiveTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden border border-[#ded6ca] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse bg-white text-left text-[14px]">
          <thead className="bg-[#f7f4ef] text-[11px] uppercase tracking-[0.14em] text-[#6b5b52]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap px-4 py-4 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[#ded6ca]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-4 align-middle text-[#31332c]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 bg-[#f7f4ef] p-3 lg:hidden">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="rounded-md bg-white p-4">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="flex justify-between gap-4 border-b border-[#f0ebe4] py-2 last:border-b-0"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b8179]">
                  {headers[cellIndex]}
                </span>
                <span className="text-right text-[13px] text-[#31332c]">
                  {cell}
                </span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status.includes("Selesai") ||
      status.includes("Disetujui") ||
      status.includes("Aktif") ||
      status.includes("Publish") ||
      status.includes("Tampil")
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status.includes("Menunggu") || status.includes("Draft")
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : status.includes("Dibatalkan") || status.includes("Ditolak")
          ? "bg-red-50 text-red-700 border-red-100"
          : "bg-[#f4f1ed] text-[#6b5b52] border-[#ded6ca]";

  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1 text-[11px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="min-w-[150px]">
      <div className="h-2 overflow-hidden rounded-full bg-[#eee8df]">
        <div
          className="h-full rounded-full bg-[#31332c]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] font-medium text-[#6b5b52]">
        {value}% selesai
      </p>
    </div>
  );
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-11 bg-[#31332c] px-5 text-[12px] font-semibold text-white transition hover:bg-[#191a17]">
      {children}
    </button>
  );
}
