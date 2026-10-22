import { cookie, safeNext, signSession, type Env } from '../_lib.ts';

const back = (request: Request, extra: string[] = []) => {
  const next = request.headers.get('cookie')?.match(/(?:^|;\s*)oauth_next=([^;]+)/)?.[1];
  const h = new Headers({ location: safeNext(next && decodeURIComponent(next)) });
  [cookie('oauth_state', '', 0), cookie('oauth_next', '', 0), ...extra].forEach((c) => h.append('set-cookie', c));
  return new Response(null, { status: 302, headers: h });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = request.headers.get('cookie')?.match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1];
  if (!code || !state || state !== expected) return back(request);

  const tok = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: new URL('/auth/callback', request.url).href }),
  }).then((r) => r.json<{ access_token?: string }>());
  if (!tok.access_token) return back(request);

  const user = await fetch('https://api.github.com/user', { headers: { authorization: `Bearer ${tok.access_token}`, 'user-agent': 'dikshantjangra.me' } }).then((r) => r.json<{ login?: string; avatar_url?: string }>());
  if (!user.login) return back(request);

  const session = await signSession({ login: user.login, avatar: user.avatar_url ?? '', exp: Date.now() + 30 * 864e5 }, env.SESSION_SECRET);
  return back(request, [cookie('session', session, 30 * 86400)]);
};
