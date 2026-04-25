import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/home-content";
import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/sections/footer";

function createSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const projectDetails = [
    {
        title: "Dapur Walnut Modern",
        category: "Kitchen Set",
        description:
            "Eksplorasi materialitas dan fungsi. Proyek ini mendefinisikan kembali jantung rumah dengan penggunaan material kayu walnut alami yang memberikan kehangatan organik di tengah estetika minimalis.",
        secondDescription:
            "Setiap garis dirancang untuk ketenangan visual, menyembunyikan kompleksitas teknis di balik panel kabinet yang mulus, menciptakan ruang yang bukan hanya untuk memasak, tapi juga untuk berkumpul.",
        material: "Walnut wood pilihan dengan serat lurus yang memberi tekstur premium dan durabilitas tinggi.",
        concept: "Minimalis modern yang mengutamakan kebersihan visual melalui integrasi kabinet tersembunyi.",
        advantage: "Layout ergonomis yang mengoptimalkan alur kerja dapur untuk efisiensi aktivitas harian.",
    },
    {
        title: "Loteng Nordik Hangat",
        category: "Living Space",
        description:
            "Ruang bergaya Nordik dengan nuansa hangat yang menyeimbangkan kenyamanan, pencahayaan alami, dan komposisi furniture yang ringan.",
        secondDescription:
            "Pemilihan warna netral, tekstur kayu, dan garis desain yang bersih menciptakan suasana hunian yang lapang, tenang, dan mudah digunakan setiap hari.",
        material: "Material kayu terang, fabric lembut, dan finishing matte untuk menciptakan kesan hangat.",
        concept: "Konsep Nordik sederhana dengan fokus pada fungsi, cahaya, dan kenyamanan visual.",
        advantage: "Ruang terasa lebih luas, rapi, dan fleksibel untuk kebutuhan santai maupun bekerja.",
    },
    {
        title: "Perpustakaan Senyap",
        category: "Storage & Rak",
        description:
            "Ruang baca dan display dengan atmosfer tenang melalui rak custom, pencahayaan hangat, serta detail panel yang rapi.",
        secondDescription:
            "Setiap ambalan dirancang untuk menonjolkan koleksi tanpa membuat ruang terasa penuh, menjaga keseimbangan antara fungsi penyimpanan dan estetika.",
        material: "Panel kayu hangat dengan lighting terintegrasi dan finishing halus.",
        concept: "Perpustakaan modern yang menyatukan fungsi display, penyimpanan, dan suasana relaks.",
        advantage: "Koleksi lebih tertata, mudah dijangkau, dan menjadi elemen dekoratif utama ruangan.",
    },
    {
        title: "Ruang Koleksi Hangat",
        category: "Display Cabinet",
        description:
            "Area display interior dengan kabinet custom, pencahayaan aksen, dan komposisi simetris untuk menghadirkan kesan elegan.",
        secondDescription:
            "Desain ini memadukan penyimpanan tertutup dan rak terbuka sehingga ruangan tetap terlihat rapi namun tetap memiliki karakter visual.",
        material: "Kayu finishing natural, kaca display, dan lampu aksen warm white.",
        concept: "Ruang koleksi modern dengan fokus pada komposisi visual dan atmosfer hangat.",
        advantage: "Barang koleksi tampil lebih premium tanpa mengorbankan fungsi penyimpanan.",
    },
];

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function PortfolioDetailPage({ params }: Props) {
    const { slug } = await params;

    const project = projects.find((item) => createSlug(item.title) === slug);

    if (!project) {
        notFound();
    }

    const detail =
        projectDetails.find((item) => item.title === project.title) ??
        projectDetails[0];

    const galleryImages = [
        project.image,
        project.image,
        project.image,
        project.image,
        project.image,
        project.image,
    ];

    return (
        <main className="bg-white text-[#31332c]">
            <section className="relative min-h-[720px] overflow-visible">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={project.image.src}
                        alt={project.image.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                </div>
                <header className="absolute left-0 right-0 top-0 z-20 px-4 pt-5 md:px-12 md:pt-8">
                    <Navbar active="portfolio" />
                </header>

                <div className="absolute inset-x-0 bottom-[-190px] z-10 px-4 sm:px-6 md:bottom-[-150px]">
                    <div className="mx-auto max-w-[880px] bg-[#6b5b52] px-6 py-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10 md:px-20 md:py-14">
                        <p className="animate-[fadeUp_700ms_ease-out_both] text-[15px] uppercase tracking-[0.35em] text-white/75">
                            Project Showcase
                        </p>

                        <h1 className="mt-5 animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[42px] leading-[0.95] sm:text-[52px] md:text-[68px]">
                            {project.title}
                        </h1>

                        <div className="my-8 h-px w-full bg-white/45" />

                        <div className="grid gap-6 sm:grid-cols-3 md:gap-8">
                            <InfoItem label="Category" value={detail.category} />
                            <InfoItem
                                label="Location"
                                value={project.location.split("-")[0].trim()}
                            />
                            <InfoItem
                                label="Year"
                                value={project.location.split("-")[1]?.trim() ?? "2024"}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-[1180px] items-center gap-14 px-6 pb-24 pt-72 sm:pt-60 md:grid-cols-[1fr_0.95fr] md:pt-64 lg:gap-20">
                <div className="relative mx-auto h-[430px] w-full max-w-[560px] md:h-[520px]">
                    <div className="absolute left-0 top-0 h-[72%] w-[68%] overflow-hidden bg-[#f3f3f3] shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
                        <Image
                            src={project.image.src}
                            alt={project.image.alt}
                            fill
                            sizes="(min-width: 768px) 360px, 70vw"
                            className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    <div className="absolute bottom-0 right-0 h-[76%] w-[72%] overflow-hidden bg-[#f3f3f3] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
                        <Image
                            src={project.image.src}
                            alt={project.image.alt}
                            fill
                            sizes="(min-width: 768px) 420px, 75vw"
                            className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    <div className="absolute -bottom-5 left-8 hidden h-24 w-24 border border-[#6b5b52]/20 md:block" />
                </div>

                <div className="max-w-[560px]">
                    <p className="animate-[fadeUp_700ms_ease-out_both] text-[15px] uppercase tracking-[0.35em] text-[#6b5b52]">
                        Tentang Proyek
                    </p>

                    <h2 className="mt-5 animate-[fadeUp_800ms_ease-out_120ms_both] font-serif text-[34px] leading-tight text-[#31332c] md:text-[44px]">
                        Detail yang dirancang untuk fungsi dan ketenangan visual.
                    </h2>

                    <div className="mt-7 h-px w-24 bg-[#6b5b52]/35" />

                    <p className="mt-8 text-[16px] leading-8 text-[#6f716b] md:text-[17px]">
                        {detail.description}
                    </p>

                    <p className="mt-6 text-[16px] leading-8 text-[#6f716b] md:text-[17px]">
                        {detail.secondDescription}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-[1180px] gap-6 px-6 pb-24 md:grid-cols-3">
                <DetailCard
                    title="Material Utama"
                    copy={detail.material}
                    icon="material"
                    index={0}
                />
                <DetailCard
                    title="Konsep Desain"
                    copy={detail.concept}
                    icon="concept"
                    index={1}
                />
                <DetailCard
                    title="Keunggulan"
                    copy={detail.advantage}
                    icon="advantage"
                    index={2}
                />
            </section>

            <section className="mx-auto max-w-[1180px] px-6 pb-28">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryImages.map((image, index) => {
                        const isWide = index === 0 || index === 4;

                        return (
                            <div
                                key={`${image.src}-${index}`}
                                className={`group relative overflow-hidden rounded-xl bg-[#f3f3f3] shadow-[0_10px_28px_rgba(0,0,0,0.08)] ${isWide
                                    ? "h-[260px] sm:col-span-2 lg:h-[290px]"
                                    : "h-[260px] lg:h-[290px]"
                                    }`}
                                style={{
                                    animation: `fadeUp 700ms ease-out ${index * 80}ms both`,
                                }}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes={
                                        isWide
                                            ? "(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw"
                                            : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                    }
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                            </div>
                        );
                    })}
                </div>
            </section>
            <section className="bg-white px-6 pb-20">
                <div className="mx-auto max-w-[1180px] bg-[#6b5b52] px-8 py-14 text-center text-white md:px-16 md:py-16">
                    <p className="text-[15px] uppercase tracking-[0.3em] text-white/70">
                        Mulai Proyek Anda
                    </p>

                    <h2 className="mx-auto mt-4 max-w-[720px] font-serif text-[36px] leading-tight md:text-[52px]">
                        Ingin membuat interior seperti proyek ini?
                    </h2>

                    <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-7 text-white/75">
                        Ceritakan kebutuhan ruang Anda, kami bantu susun konsep, material, dan alur pengerjaan yang lebih rapi.
                    </p>

                    <Link
                        href="/#kontak"
                        className="mt-8 inline-flex bg-white px-8 py-3 text-sm font-medium text-[#6b5b52] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f3eee9] active:scale-95"
                    >
                        Konsultasi Sekarang
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/65">
                {label}
            </p>
            <p className="mt-3 font-serif text-[18px] text-white">{value}</p>
        </div>
    );
}

function DetailCard({
    title,
    copy,
    icon,
    index,
}: {
    title: string;
    copy: string;
    icon: "material" | "concept" | "advantage";
    index: number;
}) {
    return (
        <article
            className="group relative overflow-hidden bg-[#f5f3ef] px-7 py-8 text-center shadow-[0_14px_35px_rgba(0,0,0,0.07)] transition-all duration-500 hover:-translate-y-2 hover:bg-[#6b5b52] hover:shadow-[0_24px_55px_rgba(0,0,0,0.16)] sm:px-9 sm:py-10"
            style={{
                animation: `fadeUp 700ms ease-out ${index * 120}ms both`,
            }}
        >
            <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#6b5b52]/25 text-[#6b5b52] transition-all duration-500 group-hover:border-white/30 group-hover:text-white">
                <DetailIcon type={icon} />
            </div>

            <h3 className="relative z-10 mt-8 font-serif text-[25px] leading-8 text-[#31332c] transition-colors duration-500 group-hover:text-white">
                {title}
            </h3>

            <p className="relative z-10 mt-5 max-w-[310px] text-[15px] leading-8 text-[#74776f] transition-colors duration-500 group-hover:text-white/78">
                {copy}
            </p>
        </article>
    );
}

function DetailIcon({
    type,
}: {
    type: "material" | "concept" | "advantage";
}) {
    if (type === "material") {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                    d="M7 4L4 20M13 4L10 20M19 4L16 20"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    if (type === "concept") {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                    d="M12 4v3M12 17v3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M4 12h3M17 12h3M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <rect
                x="5"
                y="5"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M8 12l2.5 2.5L16 9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}