import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

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
HANYA kembalikan JSON raw, tanpa format markdown backticks.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analisis deskripsi ini dan berikan output JSON: ${description}` }
    ];

    let content = "";

    try {
      // 1. Try Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          messages: aiMessages,
          temperature: 0.3,
          response_format: { type: "json_object" }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.choices[0]?.message?.content || "";
      } else {
        throw new Error(`Groq error: ${response.status}`);
      }
    } catch (error) {
      console.warn("Groq failed, attempting OpenRouter...", error);
      // 2. Fallback to OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Vmatch Brainstorm",
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: aiMessages,
          temperature: 0.3,
          response_format: { type: "json_object" }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.choices[0]?.message?.content || "";
      } else {
        return NextResponse.json({ error: `AI Provider Error: ${response.status}` }, { status: 502 });
      }
    }

    try {
      // Bersihkan jika model mengembalikan dengan backticks markdown
      let cleanContent = content.trim();
      if (cleanContent.startsWith("\`\`\`json")) {
        cleanContent = cleanContent.substring(7);
      }
      if (cleanContent.startsWith("\`\`\`")) {
        cleanContent = cleanContent.substring(3);
      }
      if (cleanContent.endsWith("\`\`\`")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      
      const parsedData = JSON.parse(cleanContent.trim());
      
      return NextResponse.json({
        data: parsedData
      });
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response", content);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

  } catch (error) {
    console.error("Brief API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
