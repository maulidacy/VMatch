import { NextRequest } from "next/server";

const GROQ_API_KEY       = process.env.GROQ_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const APP_URL            = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const SYSTEM_PROMPT = `Kamu adalah VMatch AI - konsultan & perancang interior senior dari VMatch Interior. Kamu cerdas, berpengalaman puluhan proyek (rumah, apartemen, kos, hotel, kantor), dan bicara seperti partner brainstorming yang enak diajak diskusi, bukan bot template.

PERAN UTAMA
- Teman brainstorming: gali kebutuhan, gaya hidup, dan selera user. Tawarkan ide konkret, beberapa alternatif, dan trade-off-nya.
- Perencana budget: buat estimasi biaya yang realistis dalam Rupiah, lengkap dengan rincian per komponen (material, jasa, finishing) dan asumsi yang kamu pakai. Sesuaikan dengan konteks Indonesia.
- Perencana ruang & material: rekomendasi layout, material, palet warna, pencahayaan, dan timeline pengerjaan.
- Penyiap brief: bantu user merapikan kebutuhan supaya siap dibawa ke tim VMatch.

CARA BERPIKIR
- Jawab langsung dan substansial. JANGAN PERNAH menggunakan kalimat awalan/boilerplate AI seperti "Tentu, mari kita bahas", "Sebagai AI", atau "Saya siap membantu". Langsung masuk ke inti jawaban.
- Kasih angka kalau relevan (kisaran harga, dimensi, persentase budget). Hindari jawaban mengambang. Gunakan standar ukuran metrik (Meter/Centimeter) dan sebutkan material yang umum tersedia di pasaran Indonesia (misal HPL Taco, granit Roman) agar realistis.
- Adaptif: untuk pertanyaan ringan jawab ringkas; untuk perencanaan besar jawab terstruktur dan mendalam.
- Jika kamu merasa diskusi desain dan budget sudah cukup matang, arahkan user secara halus untuk menekan tombol "Simpan ke Brief" agar tim VMatch bisa segera memprosesnya.
- Bahasa Indonesia yang natural, hangat, dan profesional. Boleh sedikit santai, tapi tetap berisi.

FORMAT (output kamu dirender sebagai Markdown yang rapi)
- Gunakan **bold** untuk istilah/angka penting. Pastikan setiap ** selalu berpasangan (jangan ada ** menggantung).
- Gunakan list bernomor untuk langkah/opsi, dan bullet (- ) untuk spesifikasi.
- Untuk rincian biaya/RAB atau perbandingan, gunakan TABEL Markdown agar rapi, contoh:
  | Komponen | Material | Estimasi |
  | --- | --- | --- |
  | Kitchen set | HPL | Rp18-25 jt |
- Boleh pakai heading pendek (## Judul) untuk memisah bagian pada jawaban panjang.
- Jangan pakai emoji. Jangan pakai garis horizontal pemisah (--- yang berdiri sendiri di luar tabel).

VISUALISASI GAMBAR (PENTING)
- Kamu BISA membuat gambar visualisasi interior untuk user lewat penanda khusus. Tapi pakai ini dengan CERDAS — bukan di setiap jawaban.
- Buat gambar HANYA ketika visual benar-benar menambah nilai, misalnya: user minta "tunjukkan/gambarkan/lihat contohnya", user sedang membayangkan sebuah konsep/gaya, atau saat membandingkan tampilan desain.
- JANGAN buat gambar untuk pertanyaan murni budget, logistik, jadwal, atau pertanyaan faktual/teks. Kalau ragu, jangan buat gambar.
- Maksimal SATU gambar per jawaban.
- Saat memutuskan membuat gambar, tulis jawaban teks kamu seperti biasa, lalu di BARIS PALING AKHIR tambahkan penanda dengan format PERSIS:
[IMAGE: <deskripsi sangat detail dalam BAHASA INGGRIS> | <caption singkat Bahasa Indonesia>]
- Deskripsi Inggris harus kaya detail supaya hasilnya bagus: jenis ruangan, gaya desain, material utama, palet warna, pencahayaan, suasana, dan sudut pandang kamera. Contoh isi: "modern minimalist kitchen set, matte white HPL cabinets with light oak accents, white quartz countertop, subway tile backsplash, warm under-cabinet LED lighting, small apartment, photorealistic eye-level render".
- Penanda [IMAGE: ...] TIDAK akan terlihat user sebagai teks — sistem yang akan mengubahnya jadi gambar. Jadi jangan menyebut "lihat penanda di bawah".

CONTOH KEPUTUSAN
- "Berapa budget renovasi dapur 3x3?" -> jawab dengan rincian biaya, TANPA gambar.
- "Aku mau dapur minimalis warna putih, kira-kira kayak apa ya?" -> jawab + SATU penanda [IMAGE: ...].`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

// ---- Provider definitions ---------------------------------------------------

type Provider =
  | { type: "groq"; model: string }
  | { type: "openrouter"; model: string };

/**
 * Fallback chain — Groq (utama) → OpenRouter (fallback).
 */
const PROVIDER_CHAIN: Provider[] = [
  // ── Groq ─────────────────────────────────────────────────────────────────
  { type: "groq", model: "llama-3.3-70b-versatile" },
  // ── OpenRouter ───────────────────────────────────────────────────────────
  { type: "openrouter", model: "openai/gpt-oss-120b:free" },
];

// ---- HTTP helpers ----------------------------------------------------------

function buildBody(model: string, messages: ChatMessage[]) {
  return JSON.stringify({ model, messages, temperature: 0.7, stream: true });
}

function headersGroq(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GROQ_API_KEY}`,
  };
}

function headersOpenRouter(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": APP_URL,
    "X-Title": "VMatch AI Advisor",
  };
}

function endpointFor(provider: Provider): string {
  switch (provider.type) {
    case "groq":       return "https://api.groq.com/openai/v1/chat/completions";
    case "openrouter": return "https://openrouter.ai/api/v1/chat/completions";
  }
}

function headersFor(provider: Provider): Record<string, string> {
  switch (provider.type) {
    case "groq":       return headersGroq();
    case "openrouter": return headersOpenRouter();
  }
}

function isAvailable(provider: Provider): boolean {
  switch (provider.type) {
    case "groq":       return !!GROQ_API_KEY;
    case "openrouter": return !!OPENROUTER_API_KEY;
  }
}

async function callProvider(
  provider: Provider,
  messages: ChatMessage[],
): Promise<Response> {
  return fetch(endpointFor(provider), {
    method: "POST",
    headers: headersFor(provider),
    body: buildBody(provider.model, messages),
  });
}

// ---- Stream transformer ----------------------------------------------------

/**
 * Converts OpenAI-compatible SSE (choices[].delta.content) to
 * simplified `data: {"content": "..."}` stream for the frontend.
 */
function transformProviderStream(upstream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();

      const flushLine = (line: string) => {
        const trimmed = line.replace(/^data:\s?/, "").trim();
        if (!trimmed || trimmed === "[DONE]") {
          if (trimmed === "[DONE]") controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          return;
        }
        try {
          const json = JSON.parse(trimmed);
          const delta: string = json.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
          }
        } catch {
          // Abaikan baris yang bukan JSON valid.
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() ?? "";

          for (const block of blocks) {
            for (const line of block.split("\n")) {
              flushLine(line);
            }
          }
        }

        if (buffer.trim()) {
          for (const line of buffer.split("\n")) flushLine(line);
        }
      } catch (error) {
        console.error("Stream transform error:", error);
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        reader.releaseLock();
      }
    },
  });
}

// ---- Main handler ----------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let modeInstruction = "";
    if (mode === "reasoning") {
      modeInstruction =
        "INSTRUKSI MODE (REASONING): Sebelum menjawab, lakukan penalaran logis secara mendalam (Chain of Thought). WAJIB bagi jawabanmu ke dalam beberapa blok HEADING pendek (misalnya: ### 1. Analisis, ### 2. Pertimbangan, ### 3. Solusi/Rekomendasi). Pecah masalah menjadi langkah-langkah terstruktur, pertimbangkan pro dan kontra dari beberapa alternatif, dan berikan penjelasan rasional di balik setiap saran.";
    } else if (mode === "instant") {
      modeInstruction =
        "INSTRUKSI MODE (INSTANT): Jawab secepat mungkin, sangat ringkas, padat, dan langsung pada intinya tanpa basa-basi.";
    }

    const finalSystemPrompt = modeInstruction
      ? `${SYSTEM_PROMPT}\n\n${modeInstruction}`
      : SYSTEM_PROMPT;

    // Membatasi context memory agar tidak boros token (ambil maksimal 12 pesan terakhir)
    const recentMessages = messages.slice(-12);

    const aiMessages: ChatMessage[] = [
      { role: "system", content: finalSystemPrompt },
      ...recentMessages,
    ];

    // Kedua mode menggunakan chain yang sama: Groq → OpenRouter
    for (const provider of PROVIDER_CHAIN) {
      if (!isAvailable(provider)) continue;

      try {
        const res = await callProvider(provider, aiMessages);
        if (res.ok && res.body) {
          console.log(`[chat] Using ${provider.type}/${provider.model}`);
          const stream = transformProviderStream(res.body);
          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          });
        }
        console.warn(`[chat] ${provider.type}/${provider.model} returned ${res.status}, trying next.`);
      } catch (err) {
        console.warn(`[chat] ${provider.type}/${provider.model} threw:`, err);
      }
    }

    return new Response(
      JSON.stringify({ error: "All AI providers exhausted" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
