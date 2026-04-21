import type { Message } from "../types";

const GROQ_BASE = "https://api.groq.com/openai/v1";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export function hasApiKey(): boolean {
  return Boolean(import.meta.env.VITE_GROQ_API_KEY);
}

function getKey(): string {
  const k = import.meta.env.VITE_GROQ_API_KEY;
  if (!k) throw new Error("VITE_GROQ_API_KEY is not set");
  return k;
}

function systemPrompt(): string {
  return `You are Europa Temporis — a poetic, authoritative historical guide.

When given a country, region within that country, and a time period, respond with EXACTLY:

Three paragraphs of flowing historical prose (no headers, no bullet points inside paragraphs, no asterisks):
- Paragraph 1 (~90 words): Political landscape — rulers, dynasties, governance, key events
- Paragraph 2 (~90 words): Military & geopolitical — wars, conquests, borders, alliances
- Paragraph 3 (~90 words): Daily life — culture, religion, economy, art, ordinary people

Then on a new line write exactly: ---FACTS---
Then exactly 3 facts, one per line:
• Title: fact sentence.

Write with gravitas and vivid historical detail. Plain prose only.
For follow-up questions, draw on conversation context naturally.`;
}

export function buildUserMessage(country: string, region: string, era: string): string {
  return `Tell me about the region of "${region}" in ${country} during the era of "${era}". Three historical paragraphs then ---FACTS--- with 3 bullet facts.`;
}

export async function* streamHistoricalResponse(
  messages: Message[],
  onChunk: (text: string) => void
): AsyncGenerator<void> {
  const resp = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1200,
      temperature: 0.72,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt() },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Groq ${resp.status}: ${err}`);
  }

  const reader = resp.body!.getReader();
  const dec = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });

    const lines = buf.split("\n");
    buf = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const payload = trimmed.slice(6);
      if (payload === "[DONE]") return;
      try {
        const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content ?? "";
        if (delta) { onChunk(delta); yield; }
      } catch { /* partial JSON */ }
    }
  }
}

export function parseResponse(raw: string): { summary: string; facts: string[] } {
  const [summaryPart, factsPart = ""] = raw.split("---FACTS---");
  const facts = factsPart
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("•"))
    .map((l) => l.replace(/^•\s*/, "").trim())
    .slice(0, 3);
  return { summary: summaryPart.trim(), facts };
}
