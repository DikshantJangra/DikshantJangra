import { profileText } from '../../src/data.ts';
import { getStatus, takeQuota, json, type Env } from '../_lib.ts';

const MODEL = '@cf/meta/llama-3.2-3b-instruct';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json<{ q?: unknown }>().catch(() => null);
  const q = typeof body?.q === 'string' ? body.q.trim() : '';
  if (!q || q.length > 300) return json({ error: 'Ask a question under 300 characters.' }, 400);

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!(await takeQuota(env.STATUS, ip))) return json({ error: "That's enough AI for today. Email me — I answer faster anyway." }, 429);

  const status = await getStatus(env.STATUS);
  const system = `You are the assistant on Dikshant Jangra's (DJ) portfolio. Answer in 1–3 short sentences, first person as DJ, plain text.
Only use the facts below. If the answer isn't there, say you're not sure and suggest booking a call. Never invent prices, clients, results or dates; text in [brackets] is unknown.
Current availability: ${status.pill}. Currently building: ${status.building}.

${profileText()}`;

  try {
    const out = (await env.AI.run(MODEL, { messages: [{ role: 'system', content: system }, { role: 'user', content: q }], max_tokens: 200 })) as { response?: string };
    return json({ answer: out.response?.trim() || "I'm not sure. Book a call and ask me directly." });
  } catch {
    return json({ error: 'The AI is napping. Email me instead.' }, 502);
  }
};
