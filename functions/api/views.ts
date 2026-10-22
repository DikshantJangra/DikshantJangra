import { json, sameOrigin, type Env } from '../_lib.ts';

// Unique visitors. A browser counts once (1-year cookie); clearing cookies doesn't recount the same IP + browser (hashed fingerprint).
// ponytail: people behind one IP with the identical browser build count as one. Undercounts, never double counts.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|playwright|puppeteer|python|curl|wget|httpclient|monitor/i;

const sha256 = async (s: string) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');

const count = (db: D1Database) => db.prepare('SELECT COUNT(*) AS n FROM visitors').first<number>('n');

export const onRequestGet: PagesFunction<Env> = async ({ env }) => (env.DB ? json({ views: await count(env.DB) }) : json({ views: null }));

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ views: null });
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const ua = request.headers.get('user-agent') ?? '';
  const seen = /(?:^|;\s*)seen=1/.test(request.headers.get('cookie') ?? '');
  if (!seen && ua && !BOT.test(ua)) {
    const fp = await sha256(`${env.SESSION_SECRET}|${request.headers.get('cf-connecting-ip') ?? ''}|${ua}`);
    await env.DB.prepare('INSERT OR IGNORE INTO visitors (fp, created_at) VALUES (?, ?)').bind(fp, Date.now()).run();
  }
  const res = json({ views: await count(env.DB) });
  if (!seen) res.headers.set('set-cookie', 'seen=1; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Lax');
  return res;
};
