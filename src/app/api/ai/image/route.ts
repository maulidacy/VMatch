import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
// Image generation can take a while — give it room.
export const maxDuration = 60;

/**
 * Daftar model image yang dicoba secara berurutan.
 * Bisa di-override via env GEMINI_IMAGE_MODEL (didahulukan).
 * gemini-2.5-flash-image ("nano banana") adalah model image stabil & resmi.
 */
const MODEL_CANDIDATES = [
  process.env.GEMINI_IMAGE_MODEL,
  "gemini-2.5-flash-image",
  "gemini-2.0-flash-preview-image-generation",
].filter((m): m is string => Boolean(m));

type GeneratedImage = { dataUrl: string; mimeType: string };

function extractImage(response: unknown): GeneratedImage | null {
  // Struktur: response.candidates[0].content.parts[].inlineData { data, mimeType }
  const candidates = (response as { candidates?: unknown[] })?.candidates;
  if (!Array.isArray(candidates)) return null;

  for (const candidate of candidates) {
    const parts = (candidate as { content?: { parts?: unknown[] } })?.content?.parts;
    if (!Array.isArray(parts)) continue;

    for (const part of parts) {
      const inline = (part as { inlineData?: { data?: string; mimeType?: string } })?.inlineData;
      if (inline?.data) {
        const mimeType = inline.mimeType || "image/png";
        return { dataUrl: `data:${mimeType};base64,${inline.data}`, mimeType };
      }
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Bungkus prompt agar hasilnya konsisten: render interior fotorealistik.
    const fullPrompt = [
      "Generate a single photorealistic interior design visualization image.",
      "High quality architectural render, realistic lighting, natural materials, clean composition.",
      "Do not include any text, watermark, people, or logos in the image.",
      "",
      `Scene: ${prompt}`,
    ].join("\n");

    const errors: string[] = [];

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: fullPrompt,
          config: {
            // Minta output gambar (sebagian model mengembalikan teks + gambar).
            responseModalities: ["IMAGE", "TEXT"],
          },
        });

        const image = extractImage(response);
        if (image) {
          return NextResponse.json({
            image: image.dataUrl,
            mimeType: image.mimeType,
            model,
          });
        }

        errors.push(`${model}: no image part in response`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${model}: ${message}`);
        // Coba model berikutnya.
      }
    }

    console.error("Gemini image generation failed:", errors);
    return NextResponse.json(
      { error: "Image generation failed", details: errors },
      { status: 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Image API route error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
