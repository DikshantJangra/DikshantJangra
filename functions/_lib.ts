// Shared helpers for Pages Functions. Underscore prefix = not a route.
import { site, now } from '../src/data.ts';

export interface Env {
  STATUS: KVNamespace;
  AI: Ai;
  TELEGRAM_SECRET: string; // webhook secret_token
  TELEGRAM_CHAT_ID: string; // only this chat may change the site
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
export async function takeQuota(kv: KVNamespace, ip: string, day = new Date().toISOString().slice(0, 10)): Promise<boolean> {
  const keys = [`ask:${day}:${ip}`, `ask:${day}:all`];
  const [mine, all] = await Promise.all(keys.map(async (k) => Number(await kv.get(k)) || 0));
  if (mine >= PER_IP_DAILY || all >= GLOBAL_DAILY) return false;
  await Promise.all([kv.put(keys[0], String(mine + 1), { expirationTtl: 172800 }), kv.put(keys[1], String(all + 1), { expirationTtl: 172800 })]);
  return true;
}
