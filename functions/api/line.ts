import { flags } from '../../src/data.ts';
import { cleanMessage, json, MAX_MESSAGE, passNo, readSession, sameOrigin, telegram, type Env } from '../_lib.ts';

// Direct line: GitHub sign-in, a free numbered pass, then one private thread with me.
// I answer from /line (owner inbox) or by replying to the forwarded message in Telegram.
type Member = { login: string; avatar: string; number: number; created_at: number };

const isOwner = (login?: string) => !!login && login.toLowerCase() === flags.githubLogin.toLowerCase();
const thread = (db: D1Database, login: string) =>
  db.prepare('SELECT id, from_dj, body, created_at, read_at FROM (SELECT * FROM messages WHERE login = ? ORDER BY id DESC LIMIT 300) ORDER BY id').bind(login).all().then((r) => r.results);
const member = (db: D1Database, login: string) => db.prepare('SELECT login, avatar, number, created_at FROM members WHERE login = ?').bind(login).first<Member>();

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const db = env.DB;
  if (!db) return json({ open: false });
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  const [count, latest] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM members').first<number>('n'),
    db.prepare('SELECT login, avatar, number FROM members ORDER BY number DESC LIMIT 5').all().then((r) => r.results),
  ]);
  const base = { open: true, count, latest, me: me && { login: me.login, avatar: me.avatar } };
  if (!me) return json(base);

  if (isOwner(me.login)) {
    const with_ = new URL(request.url).searchParams.get('thread');
    if (with_) {
      await db.prepare('UPDATE messages SET read_at = ? WHERE login = ? AND from_dj = 0 AND read_at IS NULL').bind(Date.now(), with_).run();
      return json({ ...base, owner: true, member: await member(db, with_), messages: await thread(db, with_) });
    }
    const { results: threads } = await db.prepare(
      `SELECT m.login, m.avatar, m.number, l.body AS last, l.from_dj AS last_from_dj, l.created_at AS at,
         (SELECT COUNT(*) FROM messages u WHERE u.login = m.login AND u.from_dj = 0 AND u.read_at IS NULL) AS unread
       FROM members m JOIN messages l ON l.id = (SELECT MAX(id) FROM messages WHERE login = m.login)
       ORDER BY l.id DESC LIMIT 200`,
    ).all();
    return json({ ...base, owner: true, threads });
  }

  const pass = await member(db, me.login);
  if (!pass) return json({ ...base, pass: null, next: (await db.prepare('SELECT COALESCE(MAX(number), 0) + 1 AS n FROM members').first<number>('n')) ?? 1 });
  await db.prepare('UPDATE messages SET read_at = ? WHERE login = ? AND from_dj = 1 AND read_at IS NULL').bind(Date.now(), me.login).run();
  return json({ ...base, pass, messages: await thread(db, me.login) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const db = env.DB;
  if (!db) return json({ error: 'The line is not open yet.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  if (!me) return json({ error: 'Sign in with GitHub first.' }, 401);
  const body = await request.json<{ action?: string; body?: unknown; to?: string }>().catch(() => null);

  if (body?.action === 'claim') {
    // One statement, so two people claiming at once can't get the same number.
    await db.prepare('INSERT OR IGNORE INTO members (login, avatar, number, created_at) SELECT ?, ?, COALESCE(MAX(number), 0) + 1, ? FROM members').bind(me.login, me.avatar, Date.now()).run();
    return json({ pass: await member(db, me.login) });
  }

  if (body?.action !== 'send') return json({ error: 'Unknown action.' }, 400);
  const text = cleanMessage(body.body);
  if (!text || text.length > MAX_MESSAGE) return json({ error: `Write something under ${MAX_MESSAGE} characters.` }, 400);
  const now = Date.now();

  if (isOwner(me.login)) {
    if (!body.to || !(await member(db, body.to))) return json({ error: 'No such member.' }, 404);
    await db.prepare('UPDATE messages SET read_at = ? WHERE login = ? AND from_dj = 0 AND read_at IS NULL').bind(now, body.to).run();
    await db.prepare('INSERT INTO messages (login, from_dj, body, created_at) VALUES (?, 1, ?, ?)').bind(body.to, text, now).run();
    return json({ ok: true });
  }

  const pass = await member(db, me.login);
  if (!pass) return json({ error: 'Claim your pass first.' }, 403);
  const recent = await db.prepare('SELECT COUNT(*) AS n, MAX(created_at) AS last FROM messages WHERE login = ? AND from_dj = 0 AND created_at > ?').bind(me.login, now - 3600e3).first<{ n: number; last: number | null }>();
  if (recent && (recent.n >= 30 || (recent.last && now - recent.last < 1000))) return json({ error: 'Slow down a little. I read everything, promise.' }, 429);

  const tg = await telegram(env, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, text: `${passNo(pass.number)} · @${me.login}\n\n${text}\n\n(reply to this message to answer)` });
  await db.prepare('INSERT INTO messages (login, from_dj, body, created_at, tg_id) VALUES (?, 0, ?, ?, ?)').bind(me.login, text, now, tg.result?.message_id ?? null).run();
  return json({ ok: true });
};
