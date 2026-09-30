import { GEMINI_API_KEY, GEMINI_API_URL } from "../config";

export async function transcribeWithGemini(base64Audio, mimeType = "audio/m4a") {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Configura EXPO_PUBLIC_GEMINI_API_KEY en .env.local.\n" +
        "Obtén una gratis en: https://aistudio.google.com/app/apikey"
    );
  }

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Audio,
            },
          },
          {
            text: "Transcribe este audio en español, con puntuación correcta. Devuelve únicamente el texto transcrito, sin explicaciones.",
          },
        ],
      },
    ],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Error Gemini API (${response.status}): ${err?.error?.message ?? response.statusText}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini no devolvió transcripción.");
  return text.trim();
}
