// Shared helpers for Pages Functions. Underscore prefix = not a route.
import { site, now } from '../src/data.ts';

export interface Env {
  STATUS: KVNamespace;
  AI: Ai;
  TELEGRAM_SECRET: string; // webhook secret_token
  TELEGRAM_CHAT_ID: string; // only this chat may change the site
  DB: D1Database; // guestbook
  PRESENCE: DurableObjectNamespace; // bound from workers/presence
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  SESSION_SECRET: string; // signs the guestbook login cookie
}

export type Status = { available: boolean; pill: string; building: string };

export const DEFAULT_STATUS: Status = { available: site.available, pill: site.pill, building: now.building };

export async function getStatus(kv: KVNamespace): Promise<Status> {
  return { ...DEFAULT_STATUS, ...((await kv.get<Partial<Status>>('status', 'json')) ?? {}) };
}

export const HELP = `/status open [pill text]  — mark available
/status booked <month>   — "Booked till <month>"
/now <text>              — what you're building
/show                    — current status`;

// Telegram command → status patch. null = not a write command.
export function parseCommand(text: string): Partial<Status> | null {
  const [cmd, ...rest] = text.trim().split(/\s+/);
  const arg = rest.join(' ').slice(0, 80);
  if (cmd === '/now' && arg) return { building: arg };
  if (cmd !== '/status') return null;
  const [mode, ...more] = arg.split(' ');
  const extra = more.join(' ');
  if (mode === 'open') return { available: true, pill: extra || 'Available for projects' };
  if (mode === 'booked' && extra) return { available: false, pill: `Booked till ${extra}` };
  return null;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

// ponytail: KV counters aren't atomic and are eventually consistent, so caps can overshoot a little under bursts. Durable Object counter if that ever matters.
export const PER_IP_DAILY = 10;
export const GLOBAL_DAILY = 80;
export async function takeQuota(kv: KVNamespace, ip: string, day = new Date().toISOString().slice(0, 10), bucket = 'ask'): Promise<boolean> {
  const keys = [`${bucket}:${day}:${ip}`, `${bucket}:${day}:all`];
  const [mine, all] = await Promise.all(keys.map(async (k) => Number(await kv.get(k)) || 0));
  if (mine >= PER_IP_DAILY || all >= GLOBAL_DAILY) return false;
  await Promise.all([kv.put(keys[0], String(mine + 1), { expirationTtl: 172800 }), kv.put(keys[1], String(all + 1), { expirationTtl: 172800 })]);
  return true;
}

// Signed session cookie: base64url(json).base64url(hmac)
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const hmacKey = (secret: string) => crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

export type Session = { login: string; avatar: string; exp: number };

export async function signSession(s: Session, secret: string): Promise<string> {
  const body = b64(new TextEncoder().encode(JSON.stringify(s)));
  return `${body}.${b64(await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(body)))}`;
}

export async function readSession(cookieHeader: string | null, secret: string, now = Date.now()): Promise<Session | null> {
  const raw = cookieHeader?.match(/(?:^|;\s*)session=([^;]+)/)?.[1];
  if (!raw || !secret) return null;
  const [body, sig] = raw.split('.');
  try {
    if (!(await crypto.subtle.verify('HMAC', await hmacKey(secret), unb64(sig), new TextEncoder().encode(body)))) return null;
    const s = JSON.parse(new TextDecoder().decode(unb64(body))) as Session;
    return s.exp > now ? s : null;
  } catch {
    return null;
  }
}

export const cookie = (name: string, value: string, maxAge: number) => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

// Browser POSTs must come from our own origin (cookie-authed endpoints).
export const sameOrigin = (req: Request) => req.headers.get('origin') === new URL(req.url).origin;
