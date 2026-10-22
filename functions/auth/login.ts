import { cookie, type Env } from '../_lib.ts';

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => {
  if (!env.GITHUB_CLIENT_ID) return new Response('Guestbook login is not configured yet.', { status: 503 });
  const state = crypto.randomUUID();
  const u = new URL('https://github.com/login/oauth/authorize');
  u.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  u.searchParams.set('redirect_uri', new URL('/auth/callback', request.url).href);
  u.searchParams.set('state', state);
  u.searchParams.set('allow_signup', 'false');
  return new Response(null, { status: 302, headers: { location: u.href, 'set-cookie': cookie('oauth_state', state, 600) } });
};
