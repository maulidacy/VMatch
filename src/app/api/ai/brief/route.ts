import { NextResponse } from "next/server";

const GROQ_API_KEY       = process.env.GROQ_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const SYSTEM_PROMPT = `Anda adalah VMatch Brief AI, seorang konsultan interior ahli. Tugas Anda adalah menganalisis deskripsi proyek dari pengguna dan menghasilkan struktur data JSON.
PENTING: JANGAN PERNAH MENGOSONGKAN FIELD ATAU ARRAY APAPUN. Jika informasi dari pengguna sangat minim, Anda HARUS memberikan rekomendasi cerdas dan tebakan terbaik untuk semua bagian (chips, recommendations, validations) agar semua data terisi lengkap.

Format JSON yang diharapkan HARUS sama persis dengan struktur ini:
{
  "chips": {
    "jenis": "string (wajib diisi, tebak ruangan apa jika tidak spesifik, misal: Kitchen Set, Kamar Tidur, Ruang Tamu)",
    "style": "string (WAJIB PILIH SALAH SATU: 'Modern minimalis', 'Japandi', 'Scandinavian', 'Industrial', atau 'Classic')",
    "budget": "string (WAJIB PILIH SALAH SATU: 'Di bawah Rp30 juta', 'Rp30–60 juta', 'Rp60–100 juta', 'Rp100–150 juta', atau 'Di atas Rp150 juta')",
    "timeline": "string (WAJIB PILIH SALAH SATU: 'Fleksibel', 'Secepatnya', 'Minggu depan', 'Bulan depan', atau '2–3 bulan')",
    "prioritas": "string (wajib diisi, contoh: Fungsi & Estetika, Storage maksimal, Durabilitas material, dsb)",
    "lokasi": "string (Tebak lokasi dari teks. Jika tidak disebutkan, tebak 'Belum ditentukan' atau kota umum)",
    "ukuran": "string (Tebak ukuran dari teks. Jika tidak disebutkan, BERIKAN ESTIMASI WAJAR sesuai ruangan, misal '3x4m' atau '4x5m', JANGAN isi '-')",
    "referensi": "string (Tebak referensi dari teks. Jika tidak disebutkan, BERIKAN SARAN REFERENSI UMUM, misal 'Katalog Pinterest' atau 'Portofolio VMatch', JANGAN isi '-')",
    "material": "string (Tebak material dari teks. Jika tidak disebutkan, BERIKAN SARAN MATERIAL WAJAR sesuai proyek, misal 'HPL & Multiplek' atau 'Kayu Solid', JANGAN isi '-')"
  },
  "summary": "string (Ringkasan proyek profesional dalam 2-3 kalimat)",
  "recommendations": ["string", "string", "string"] (wajib berikan minimal 3 rekomendasi fitur/material terbaik),
  "validations": ["Ukuran detail ruangan", "Lokasi proyek", "Pilihan material final", "Budget akhir", "Timeline pengerjaan"] (wajib berikan minimal 4-5 hal teknis yang perlu divalidasi)
}

PENTING: KEMBALIKAN HANYA RAW VALID JSON. Jangan tambahkan teks pembuka/penutup apapun, dan JANGAN gunakan markdown backticks (\`\`\`json). Langsung mulai dengan tanda { dan akhiri dengan }.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

type Provider =
  | { type: "groq"; model: string }
  | { type: "openrouter"; model: string };

/**
 * Fallback chain — Groq (utama) → OpenRouter (fallback).
 * Brief route menggunakan non-streaming JSON completion.
 */
const PROVIDER_CHAIN: Provider[] = [
  // ── Groq ───────────────────────────────────────────────────────────────
  { type: "groq", model: "llama-3.3-70b-versatile" },
  // ── OpenRouter ───────────────────────────────────────────────────────────
  { type: "openrouter", model: "openai/gpt-oss-120b:free" },
];

function endpointFor(provider: Provider): string {
  switch (provider.type) {
    case "groq":       return "https://api.groq.com/openai/v1/chat/completions";
    case "openrouter": return "https://openrouter.ai/api/v1/chat/completions";
  }
}

function headersFor(provider: Provider): Record<string, string> {
  switch (provider.type) {
    case "groq":
      return { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` };
    case "openrouter":
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": APP_URL,
        "X-Title": "Vmatch Brainstorm",
      };
  }
}

function isAvailable(provider: Provider): boolean {
  switch (provider.type) {
    case "groq":       return !!GROQ_API_KEY;
    case "openrouter": return !!OPENROUTER_API_KEY;
  }
}

/** Bersihkan markdown backticks dari respons model yang tidak patuh. */
function stripMarkdownFences(text: string): string {
  let clean = text.trim();
  if (clean.startsWith("```json")) clean = clean.slice(7);
  else if (clean.startsWith("```"))  clean = clean.slice(3);
  if (clean.endsWith("```")) clean = clean.slice(0, -3);
  return clean.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const aiMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analisis deskripsi ini dan berikan output JSON: ${description}` },
    ];

    let content = "";

    for (const provider of PROVIDER_CHAIN) {
      if (!isAvailable(provider)) continue;

      try {
        const res = await fetch(endpointFor(provider), {
          method: "POST",
          headers: headersFor(provider),
          body: JSON.stringify({
            model: provider.model,
            messages: aiMessages,
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content ?? "";
          if (raw) {
            content = raw;
            console.log(`[brief] Using ${provider.type}/${provider.model}`);
            break;
          }
        }
        console.warn(`[brief] ${provider.type}/${provider.model} returned ${res.status}`);
      } catch (err) {
        console.warn(`[brief] ${provider.type}/${provider.model} threw:`, err);
      }
    }

    if (!content) {
      return NextResponse.json({ error: "All AI providers failed" }, { status: 502 });
    }

    try {
      const parsedData = JSON.parse(stripMarkdownFences(content));
      return NextResponse.json({ data: parsedData });
    } catch {
      console.error("[brief] Failed to parse JSON from AI response:", content);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("[brief] Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
