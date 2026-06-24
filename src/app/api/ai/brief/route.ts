import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

const SYSTEM_PROMPT = `Anda adalah VMatch Brief AI. Tugas Anda adalah menganalisis deskripsi proyek interior dari pengguna dan menghasilkan struktur data JSON yang valid.
Format JSON yang diharapkan HARUS sama persis dengan struktur ini:
{
  "chips": {
    "jenis": "string (contoh: Kitchen Set, Kamar Tidur Utama, dsb)",
    "style": "string (contoh: Japandi, Modern minimalis, Industrial, dsb)",
    "budget": "string (contoh: Di bawah Rp30 juta, Rp30-60 juta, dsb)",
    "timeline": "string (contoh: Fleksibel, Secepatnya, dsb)",
    "prioritas": "string (contoh: Fungsi & Estetika, Storage maksimal, Durabilitas material, dsb)"
  },
  "summary": "string (Ringkasan proyek profesional dalam 2-3 kalimat)",
  "recommendations": ["string", "string", "string"],
  "validations": ["Ukuran detail ruangan", "Lokasi proyek", "Pilihan material final", "Budget akhir", "Timeline pengerjaan"]
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
          model: "openai/gpt-oss-120b", 
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
          model: "openai/gpt-oss-120b:free",
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
