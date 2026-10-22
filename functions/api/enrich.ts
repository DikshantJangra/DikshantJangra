import { takeQuota, json, type Env } from '../_lib.ts';

// Mini version of the KR Stationers enrichment step: product name in, structured catalog card out.
const MODEL = '@cf/meta/llama-3.2-3b-instruct';
const SYSTEM = `You enrich product listings for an Indian stationery and office-supplies store.
Given a raw product name, reply with ONLY a JSON object, no prose:
{"title": clean product title, "brand": brand or "Unbranded", "category": one of ["Writing","Paper & Notebooks","Art & Craft","Office","School","Other"],
 "attributes": object of 2-5 short key/value facts you can infer from the name (e.g. "Pack": "10 pcs"), "description": one 20-35 word sentence a shopper would read}
Do not invent prices, ratings or certifications.`;

export type Card = { title: string; brand: string; category: string; attributes: Record<string, string>; description: string };

export function toCard(raw: string): Card | null {
  try {
    const o = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
    const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const card: Card = {
      title: str(o.title, 100),
      brand: str(o.brand, 40) || 'Unbranded',
      category: str(o.category, 30) || 'Other',
      attributes: Object.fromEntries(Object.entries(o.attributes ?? {}).slice(0, 5).map(([k, v]) => [str(k, 24), str(String(v), 40)]).filter(([k, v]) => k && v)),
      description: str(o.description, 300),
    };
    return card.title && card.description ? card : null;
  } catch {
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json<{ name?: unknown }>().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 80) return json({ error: 'Type a product name under 80 characters.' }, 400);
  if (!(await takeQuota(env.STATUS, request.headers.get('cf-connecting-ip') ?? 'unknown', undefined, 'enrich'))) return json({ error: 'Demo limit reached for today. Try again tomorrow.' }, 429);
  try {
    const out = (await env.AI.run(MODEL, { messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: name }], max_tokens: 300 })) as { response?: unknown };
    const raw = typeof out.response === 'string' ? out.response : JSON.stringify(out.response ?? '');
    const card = toCard(raw);
    return card ? json(card) : json({ error: "Couldn't parse that one. Try a more specific name." }, 422);
  } catch {
    return json({ error: 'The pipeline is napping. Try again in a bit.' }, 502);
  }
};
