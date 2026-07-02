import { NextResponse } from "next/server";

const IMAGE_API_KEYS = (process.env.ALIBABA_API_KEYS ?? "").split(",").filter(Boolean);

const DASHSCOPE_BASE = "https://dashscope-intl.aliyuncs.com/api/v1";

// Hanya model TEXT-TO-IMAGE yang benar-benar ada di katalog akun (GET /models).
// Model *-edit-* dikecualikan karena butuh gambar input, bukan t2i murni.
const IMAGE_MODELS: string[] = [
  "wan2.7-image-pro",
  "qwen-image-2.0-pro",
  "qwen-image-max",
  "qwen-image-2.0",
  "qwen-image-plus",
  "z-image-turbo",
  "wan2.7-image",
];

const INTERIOR_PREFIX =
  "Photorealistic interior design visualization. High quality architectural render, " +
  "realistic lighting, natural materials, clean composition. No text, watermark, people, or logos. Scene: ";

const POLL_INTERVAL_MS  = 2500;
const POLL_MAX_ATTEMPTS = 24;

class AuthError extends Error {}
/** Akun menunggak / billing belum aktif (DashScope code "Arrearage"). Sama untuk semua key → hentikan lebih awal. */
class BillingError extends Error {}

interface TaskResponse {
  output?: {
    task_id?: string;
    task_status?: string;
    results?: { url: string }[];
  };
  code?: string;
  message?: string;
}

async function submitTask(apiKey: string, modelId: string, prompt: string): Promise<string> {
  const isWan = modelId.startsWith("wan");
  const endpoint = isWan
    ? "/services/aigc/image-generation/generation"
    : "/services/aigc/text2image/image-synthesis";

  const input = isWan
    ? { messages: [{ role: "user", content: [{ text: INTERIOR_PREFIX + prompt }] }] }
    : { prompt: INTERIOR_PREFIX + prompt };

  const res = await fetch(`${DASHSCOPE_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-DashScope-Async": "enable",
    },
    body: JSON.stringify({
      model: modelId,
      input,
      parameters: { size: "1024*1024", n: 1 },
    }),
  });

  if (res.status === 401 || res.status === 403) {
    throw new AuthError(`Auth failed [${modelId}]: ${res.status}`);
  }

  const data = await res.json() as TaskResponse;

  // Arrearage = akun menunggak. Berlaku untuk SEMUA key, jadi percuma dirotasi/di-fallback.
  if (data.code === "Arrearage") {
    throw new BillingError(data.message ?? "Account arrearage / billing not active");
  }

  if (!res.ok || data.code) {
    throw new Error(`[${modelId}] Submit failed: ${data.message ?? data.code ?? "unknown"}`);
  }

  const taskId = data.output?.task_id;
  if (!taskId) throw new Error(`[${modelId}] No task ID returned`);
  return taskId;
}

async function pollTask(apiKey: string, taskId: string, modelId: string): Promise<string> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await fetch(`${DASHSCOPE_BASE}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await res.json() as TaskResponse;
    const status = data.output?.task_status;

    if (status === "SUCCEEDED") {
      const url = data.output?.results?.[0]?.url;
      if (!url) throw new Error(`[${modelId}] Task succeeded but no image URL`);
      return url;
    }

    if (status === "FAILED") {
      throw new Error(`[${modelId}] Task failed: ${data.message ?? "unknown"}`);
    }
  }
  throw new Error(`[${modelId}] Timed out after 60s`);
}

async function generateAsync(apiKey: string, modelId: string, prompt: string): Promise<string> {
  const taskId = await submitTask(apiKey, modelId, prompt);
  return pollTask(apiKey, taskId, modelId);
}

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    if (IMAGE_API_KEYS.length === 0) {
      return NextResponse.json(
        { error: "ALIBABA_API_KEYS not configured in environment" },
        { status: 500 },
      );
    }

    const cleanPrompt = prompt.trim();
    let lastError = "No attempts made";

    for (const apiKey of IMAGE_API_KEYS) {
      let skipKey = false;

      for (const model of IMAGE_MODELS) {
        try {
          const imageUrl = await generateAsync(apiKey, model, cleanPrompt);
          console.log(`[image] OK — model ${model}, key ...${apiKey.slice(-6)}`);
          return NextResponse.json({ imageUrl, model });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          lastError = msg;
          console.warn(`[image] key ...${apiKey.slice(-6)} / ${model}: ${msg}`);

          // Arrearage berlaku ke semua key → langsung berhenti, jangan buang-buang 20×8 percobaan.
          if (err instanceof BillingError) {
            return NextResponse.json(
              {
                error: "billing_inactive",
                message:
                  "QwenCloud/DashScope menolak request: akun dalam status menunggak (Arrearage). " +
                  "Aktifkan billing atau isi saldo di Model Studio; API key valid tapi belum bisa dipakai.",
                details: msg,
              },
              { status: 402 },
            );
          }

          if (err instanceof AuthError || msg.includes("AccessDenied") || msg.includes("DataCenterError")) {
            skipKey = true;
            break;
          }
        }
      }

      if (skipKey) continue;
    }

    return NextResponse.json(
      { error: "All image models failed", details: lastError },
      { status: 502 },
    );
  } catch (err) {
    console.error("[image] Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
