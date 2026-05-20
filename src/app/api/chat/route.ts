import { NextRequest } from "next/server";

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY ?? "";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "https://ollama.com/api";

// Katalog gambar inspirasi lokal yang bisa di-retrieve AI
const IMAGE_CATALOG = [
  { keywords: ["dapur", "kitchen", "kitchen set"], src: "/inspirations/rumah-dapur.webp", label: "Kitchen Set Modern" },
  { keywords: ["dapur", "kitchen", "apartment"], src: "/inspirations/apartment-kitchen-set.webp", label: "Kitchen Set Apartemen" },
  { keywords: ["kamar tidur", "bedroom", "tidur"], src: "/inspirations/rumah-kamar-tidur.webp", label: "Kamar Tidur" },
  { keywords: ["kamar tidur", "bedroom", "apartment"], src: "/inspirations/apartment-bedroom.webp", label: "Bedroom Apartemen" },
  { keywords: ["kamar mandi", "bathroom", "vanity"], src: "/inspirations/rumah-kamar-mandi.webp", label: "Kamar Mandi" },
  { keywords: ["kamar mandi", "bathroom", "hotel"], src: "/inspirations/hotel-bathroom-vanity.webp", label: "Bathroom Vanity Hotel" },
  { keywords: ["ruang tamu", "living", "tamu"], src: "/inspirations/rumah-ruang-tamu.webp", label: "Ruang Tamu" },
  { keywords: ["ruang keluarga", "living", "keluarga", "family"], src: "/inspirations/rumah-ruang-keluarga.webp", label: "Ruang Keluarga" },
  { keywords: ["living", "apartment", "ruang"], src: "/inspirations/apartment-living-area.webp", label: "Living Area Apartemen" },
  { keywords: ["wardrobe", "lemari", "pakaian"], src: "/inspirations/rumah-wardrobe.webp", label: "Wardrobe" },
  { keywords: ["storage", "penyimpanan", "rak"], src: "/inspirations/apartment-storage.webp", label: "Storage Apartemen" },
  { keywords: ["laundry", "cuci"], src: "/inspirations/apartment-laundry.webp", label: "Laundry Area" },
  { keywords: ["hotel", "lobby"], src: "/inspirations/hotel-lobby.webp", label: "Hotel Lobby" },
  { keywords: ["hotel", "room", "kamar hotel"], src: "/inspirations/hotel-room.webp", label: "Hotel Room" },
  { keywords: ["hotel", "restaurant", "restoran"], src: "/inspirations/hotel-restaurant.webp", label: "Hotel Restaurant" },
  { keywords: ["hotel", "reception", "resepsionis"], src: "/inspirations/hotel-reception.webp", label: "Hotel Reception" },
  { keywords: ["hotel", "corridor", "koridor"], src: "/inspirations/hotel-corridor.webp", label: "Hotel Corridor" },
  { keywords: ["kos", "boarding", "kost"], src: "/inspirations/boarding-hero.webp", label: "Kos-kosan" },
  { keywords: ["kos", "boarding", "room", "kamar kos"], src: "/inspirations/boarding-room.webp", label: "Kamar Kos" },
  { keywords: ["kos", "boarding", "pantry", "dapur kos"], src: "/inspirations/boarding-pantry.webp", label: "Pantry Kos" },
  { keywords: ["studio", "apartment", "apartemen kecil"], src: "/inspirations/apartment-studio-layout.webp", label: "Studio Apartemen" },
];

function findRelevantImages(text: string): { src: string; label: string }[] {
  const lower = text.toLowerCase();
  const matches = IMAGE_CATALOG.filter((img) =>
    img.keywords.some((kw) => lower.includes(kw))
  );
  // Return max 3 images
  return matches.slice(0, 3).map(({ src, label }) => ({ src, label }));
}

const SYSTEM_PROMPT = `Kamu adalah VMatch Helper — konsultan interior senior dari VMatch Interior.

ATURAN WAJIB:
1. JANGAN PERNAH hanya bertanya balik tanpa memberikan jawaban. Selalu berikan informasi dulu, baru boleh tanya di akhir jika perlu.
2. Langsung jawab dengan detail: estimasi harga, rekomendasi material, gaya desain, tips.
3. Berikan jawaban lengkap berdasarkan asumsi wajar jika user tidak menyebutkan detail (asumsi ukuran standar, budget menengah).
4. Hanya boleh tanya balik MAKSIMAL 1 pertanyaan di akhir jawaban, dan itu pun opsional.

FORMAT:
- Jangan pakai heading (###), garis (---), atau emoji.
- Gunakan **bold** untuk penekanan.
- Gunakan numbered list untuk langkah/opsi.
- Gunakan bullet (- item) untuk spesifikasi.

GAMBAR INSPIRASI:
- Format: [IMG:/path|Label]
- Tampilkan 1-2 gambar yang relevan.
- Gambar tersedia:
${IMAGE_CATALOG.map((img) => `${img.src} (${img.label}): ${img.keywords.join(", ")}`).join("\n")}

CONTOH JAWABAN IDEAL untuk "kitchen set minimalis":
"Untuk kitchen set minimalis, berikut rekomendasinya:

**Material:** HPL warna putih/kayu muda untuk kabinet, quartz untuk countertop.
**Estimasi harga:** Rp18-30 juta (per meter lari Rp4-6 juta).
**Layout:** I-shape atau L-shape untuk efisiensi.

Tips:
1. Gunakan handle hidden (push-to-open) untuk tampilan clean
2. Pasang LED strip di bawah kabinet atas
3. Pilih backsplash subway tile putih

[IMG:/inspirations/rumah-dapur.webp|Kitchen Set Minimalis]

Kalau mau lebih detail, kasih tahu ukuran dapurnya."

GAYA: Bahasa Indonesia natural, hangat, informatif. Seperti konsultan yang langsung kasih solusi.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ollamaMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen3-next:80b",
        messages: ollamaMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Ollama error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response back
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: json.message.content })}\n\n`)
                  );
                }
                if (json.done) {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              } catch {
                // Skip malformed lines
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim()) {
            try {
              const json = JSON.parse(buffer);
              if (json.message?.content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: json.message.content })}\n\n`)
                );
              }
            } catch {
              // Skip
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
