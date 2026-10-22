import { flags } from '../../src/data.ts';
import { cookie, safeNext, signSession, type Env } from '../_lib.ts';

// Local-only sign-in for trying the guestbook and direct line without a GitHub OAuth app.
// Needs DEV_LOGIN=true in .dev.vars AND a localhost request; production has neither.
export const onRequestGet: PagesFunction<Env & { DEV_LOGIN?: string }> = async ({ request, env }) => {
  const url = new URL(request.url);
  if (env.DEV_LOGIN !== 'true' || !['localhost', '127.0.0.1'].includes(url.hostname)) return new Response('Not found', { status: 404 });
  const login = (url.searchParams.get('as') ?? 'visitor').replace(/[^\w-]/g, '').slice(0, 39) || 'visitor';
  // Fake but stable ids; your own login maps to your real id so the owner inbox works locally.
  const id = login.toLowerCase() === flags.githubLogin.toLowerCase() ? flags.githubId : [...login].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const session = await signSession({ id, login, avatar: `https://github.com/${login}.png`, exp: Date.now() + 864e5 }, env.SESSION_SECRET);
  return new Response(null, { status: 302, headers: { location: safeNext(url.searchParams.get('next') ?? '/line'), 'set-cookie': cookie('session', session, 86400).replace('; Secure', '') } });
};
