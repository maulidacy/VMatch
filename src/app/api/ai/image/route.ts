import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImageRequestBody = {
  prompt?: string;
  caption?: string;
};

export async function POST(req: Request) {
  try {
    const { prompt, caption } = (await req.json()) as ImageRequestBody;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt gambar wajib diisi." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY belum diset di environment." },
        { status: 500 },
      );
    }

    const model = process.env.OPENROUTER_IMAGE_MODEL || "openai/gpt-image-1";

    const finalPrompt = [
      "Photorealistic interior design visualization.",
      "High quality architectural render, realistic lighting, natural materials, clean composition.",
      "No text, no watermark, no people, no logos.",
      `Scene: ${prompt}`,
    ].join(" ");

    const response = await fetch("https://openrouter.ai/api/v1/images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000",
        "X-Title": "VMatch AI Advisor",
      },
      body: JSON.stringify({
        model,
        prompt: finalPrompt,
        aspect_ratio: "4:3",
        resolution: "1K",
        output_format: "png",
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gagal generate gambar dari OpenRouter.",
          detail: result,
        },
        { status: response.status },
      );
    }

    const image = result?.data?.[0];

    if (!image?.b64_json) {
      return NextResponse.json(
        {
          error: "Response gambar tidak valid.",
          detail: result,
        },
        { status: 500 },
      );
    }

    const mediaType = image.media_type || "image/png";
    const imageUrl = `data:${mediaType};base64,${image.b64_json}`;

    return NextResponse.json({
      imageUrl,
      caption: caption || "Visualisasi VMatch AI",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat generate gambar.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}