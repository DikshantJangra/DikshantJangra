import { site } from '../../src/data.ts';
import { json, type Env } from '../_lib.ts';

const okHost = (h: string) => [new URL(site.url).hostname, 'localhost', '127.0.0.1', 'dikshantjangra.pages.dev'].includes(h) || h.endsWith('.dikshantjangra.pages.dev');

// WebSocket + count both live in one Durable Object (workers/presence).
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('origin');
  if (origin && !okHost(URL.canParse(origin) ? new URL(origin).hostname : '')) return new Response('forbidden', { status: 403 });
  if (!env.PRESENCE) return json({ here: 1 });
  return env.PRESENCE.get(env.PRESENCE.idFromName('site')).fetch(request);
};
