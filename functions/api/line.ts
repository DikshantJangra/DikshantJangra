import { cleanMessage, isOwner, json, MAX_MESSAGE, passNo, readSession, sameOrigin, telegram, type Env } from '../_lib.ts';

// Direct line: GitHub sign-in, a free numbered pass, then one private thread with me.
// Everything is keyed by GitHub's numeric user id, so a renamed or re-registered username can't take over a pass or thread.
// I answer from /line (owner inbox) or by replying to the forwarded message in Telegram.
type Member = { id: number; login: string; avatar: string; number: number; created_at: number };

const thread = (db: D1Database, id: number) =>
  db.prepare('SELECT id, from_dj, body, created_at, read_at FROM (SELECT * FROM messages WHERE member_id = ? ORDER BY id DESC LIMIT 300) ORDER BY id').bind(id).all().then((r) => r.results);
const member = (db: D1Database, id: number) => db.prepare('SELECT id, login, avatar, number, created_at FROM members WHERE id = ?').bind(id).first<Member>();
const markRead = (db: D1Database, id: number, fromDj: 0 | 1, now = Date.now()) =>
  db.prepare('UPDATE messages SET read_at = ? WHERE member_id = ? AND from_dj = ? AND read_at IS NULL').bind(now, id, fromDj).run();

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

  if (isOwner(me)) {
    const withId = Number(new URL(request.url).searchParams.get('thread'));
    if (withId) {
      await markRead(db, withId, 0);
      return json({ ...base, owner: true, member: await member(db, withId), messages: await thread(db, withId) });
    }
    const { results: threads } = await db.prepare(
      `SELECT m.id, m.login, m.avatar, m.number, l.body AS last, l.from_dj AS last_from_dj, l.created_at AS at,
         (SELECT COUNT(*) FROM messages u WHERE u.member_id = m.id AND u.from_dj = 0 AND u.read_at IS NULL) AS unread
       FROM members m JOIN messages l ON l.id = (SELECT MAX(id) FROM messages WHERE member_id = m.id)
       ORDER BY l.id DESC LIMIT 200`,
    ).all();
    return json({ ...base, owner: true, threads });
  }

  const pass = await member(db, me.id);
  if (!pass) return json({ ...base, pass: null, next: (await db.prepare('SELECT COALESCE(MAX(number), 0) + 1 AS n FROM members').first<number>('n')) ?? 1 });
  // Keep the shown name and avatar current if they changed them on GitHub.
  if (pass.login !== me.login || pass.avatar !== me.avatar) await db.prepare('UPDATE members SET login = ?, avatar = ? WHERE id = ?').bind(me.login, me.avatar, me.id).run();
  await markRead(db, me.id, 1);
  return json({ ...base, pass: { ...pass, login: me.login, avatar: me.avatar }, messages: await thread(db, me.id) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const db = env.DB;
  if (!db) return json({ error: 'The line is not open yet.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const me = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  if (!me) return json({ error: 'Sign in with GitHub first.' }, 401);
  const body = await request.json<{ action?: string; body?: unknown; to?: unknown }>().catch(() => null);

  if (body?.action === 'claim') {
    if (isOwner(me)) return json({ error: "You're the owner. Your inbox is right here." }, 400);
    // One statement, so two people claiming at once can't get the same number.
    await db.prepare('INSERT OR IGNORE INTO members (id, login, avatar, number, created_at) SELECT ?, ?, ?, COALESCE(MAX(number), 0) + 1, ? FROM members').bind(me.id, me.login, me.avatar, Date.now()).run();
    return json({ pass: await member(db, me.id) });
  }

  if (body?.action !== 'send') return json({ error: 'Unknown action.' }, 400);
  const text = cleanMessage(body.body);
  if (!text || text.length > MAX_MESSAGE) return json({ error: `Write something under ${MAX_MESSAGE} characters.` }, 400);
  const now = Date.now();

  if (isOwner(me)) {
    const to = Number(body.to);
    if (!to || !(await member(db, to))) return json({ error: 'No such member.' }, 404);
    await markRead(db, to, 0, now);
    await db.prepare('INSERT INTO messages (member_id, from_dj, body, created_at) VALUES (?, 1, ?, ?)').bind(to, text, now).run();
    return json({ ok: true });
  }

  const pass = await member(db, me.id);
  if (!pass) return json({ error: 'Claim your pass first.' }, 403);
  const recent = await db.prepare('SELECT COUNT(*) AS n, MAX(created_at) AS last FROM messages WHERE member_id = ? AND from_dj = 0 AND created_at > ?').bind(me.id, now - 3600e3).first<{ n: number; last: number | null }>();
  if (recent && (recent.n >= 30 || (recent.last && now - recent.last < 1000))) return json({ error: 'Slow down a little. I read everything, promise.' }, 429);

  const tg = await telegram(env, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, text: `${passNo(pass.number)} · @${me.login}\n\n${text}\n\n(reply to this message to answer)` });
  await db.prepare('INSERT INTO messages (member_id, from_dj, body, created_at, tg_id) VALUES (?, 0, ?, ?, ?)').bind(me.id, text, now, tg.result?.message_id ?? null).run();
  return json({ ok: true });
};
