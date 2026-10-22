import { flags } from '../../src/data.ts';
import { json, readSession, sameOrigin, type Env } from '../_lib.ts';

const isOwner = (login?: string) => !!login && login.toLowerCase() === flags.githubLogin.toLowerCase();

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  const { results } = await env.DB.prepare('SELECT id, login, avatar, message, created_at FROM entries ORDER BY created_at DESC LIMIT 50').all();
  return json({ me: me && { login: me.login, avatar: me.avatar, owner: isOwner(me.login) }, entries: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  if (!me) return json({ error: 'Sign in with GitHub first.' }, 401);
  const body = await request.json<{ message?: unknown }>().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.replace(/\s+/g, ' ').trim() : '';
  if (!message || message.length > 280) return json({ error: 'Say something under 280 characters.' }, 400);

  const last = await env.DB.prepare('SELECT created_at FROM entries WHERE login = ? ORDER BY created_at DESC LIMIT 1').bind(me.login).first<number>('created_at');
  if (last && Date.now() - last < 60_000) return json({ error: 'One note a minute, please.' }, 429);

  await env.DB.prepare('INSERT INTO entries (login, avatar, message, created_at) VALUES (?, ?, ?, ?)').bind(me.login, me.avatar, message, Date.now()).run();
  return json({ ok: true }, 201);
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  if (!isOwner(me?.login)) return json({ error: 'Only DJ can delete notes.' }, 403);
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'Bad id.' }, 400);
  await env.DB.prepare('DELETE FROM entries WHERE id = ?').bind(id).run();
  return json({ ok: true });
};
