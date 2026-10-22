// Direct line client. Screens: offline, sign in, claim pass, chat (member), inbox + thread (me).
type Member = { id?: number; login: string; avatar: string; number: number; created_at?: number };
type Msg = { id: number; from_dj: number; body: string; created_at: number; read_at: number | null };
type Thread = Member & { id: number; last: string; last_from_dj: number; at: number; unread: number };
type Data = {
  open: boolean;
  count?: number;
  latest?: Member[];
  me?: { login: string; avatar: string } | null;
  owner?: boolean;
  pass?: Member | null;
  next?: number;
  member?: Member | null;
  messages?: Msg[];
  threads?: Thread[];
};

const app = document.getElementById('app')!;
const snack = document.getElementById('snackbar')!;
const MAX = 1000;
const passNo = (n: number) => `No. ${String(n).padStart(5, '0')}`;
const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });
const day = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const joined = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' });

const I = {
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  send: 'M3 20V4l19 8-19 8zm2-3 11.85-5L5 7v3.5l6 1.5-6 1.5V17z',
  github: 'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z',
  verified: 'M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z',
  lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z',
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & Record<string, unknown> = {}, ...kids: (Node | string | false | null | undefined)[]) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...(kids.filter(Boolean) as (Node | string)[]));
  return e;
}
function svg(d: string, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  if (cls) s.setAttribute('class', cls);
  s.innerHTML = `<path d="${d}"/>`;
  return s;
}
const icon = (d: string, label: string, onclick?: () => void, href?: string) =>
  href ? el('a', { className: 'icon', href, ariaLabel: label }, svg(d)) : el('button', { className: 'icon', type: 'button', ariaLabel: label, onclick }, svg(d));
const img = (src: string, cls: string) => el('img', { src, alt: '', className: cls, loading: 'lazy', referrerPolicy: 'no-referrer' });
const djAvatar = () => el('span', { className: 'avatar dj' }, 'DJ');

function toast(text: string) {
  snack.textContent = text;
  snack.hidden = false;
  clearTimeout((toast as unknown as { t: number }).t);
  (toast as unknown as { t: number }).t = window.setTimeout(() => (snack.hidden = true), 3200);
}

// Material ripple on anything pressable
document.addEventListener('pointerdown', (e) => {
  const host = (e.target as Element).closest<HTMLElement>('.btn, .icon, .send, .chip, .threads button');
  if (!host || (host as HTMLButtonElement).disabled) return;
  const r = host.getBoundingClientRect();
  const size = Math.hypot(r.width, r.height) * 2;
  host.append(el('span', { className: 'ripple', style: `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px` } as never));
  setTimeout(() => host.querySelector('.ripple')?.remove(), 520);
});

// Status bar clock (IST, like the rest of the site)
const clock = () => (document.getElementById('sb-time')!.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date()));
clock();
setInterval(clock, 15000);

async function api(path = '/api/line', body?: object): Promise<{ ok: boolean; data: any }> {
  const r = await fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' }).catch(() => null);
  if (!r) return { ok: false, data: { error: 'You look offline.' } };
  return { ok: r.ok, data: await r.json().catch(() => ({ error: 'Something broke. Try again.' })) };
}

function appbar(title: Node, actions: Node[] = [], lead?: Node) {
  return el('header', { className: 'appbar' }, lead ?? null, el('div', { className: lead ? 'title' : 'title only' }, title), ...actions);
}

function menuButton(items: [string, () => void][]) {
  const btn = icon(I.more, 'More options', () => {
    const open = app.querySelector('.menu');
    if (open) return open.remove();
    const m = el('div', { className: 'menu', role: 'menu' }, ...items.map(([t, fn]) => el('button', { type: 'button', role: 'menuitem', onclick: () => (m.remove(), fn()) }, t)));
    app.append(m);
    setTimeout(() => document.addEventListener('click', (e) => !m.contains(e.target as Node) && m.remove(), { once: true }));
  });
  return btn;
}

function passCard(p: { number: number; login?: string; avatar?: string; created_at?: number }, cls = '') {
  return el(
    'div',
    { className: `pass ${cls}` },
    el('div', { className: 'pass-top' }, el('span', { className: 'pass-mark' }, 'DJ'), el('span', {}, 'Member pass')),
    el('div', { className: 'pass-no' }, passNo(p.number)),
    el('div', { className: 'pass-who' }, p.avatar ? img(p.avatar, '') : null, el('div', {}, p.login ? `@${p.login}` : 'You?', el('br'), el('span', {}, p.created_at ? `Joined ${joined.format(p.created_at)}` : 'Free, forever'))),
  );
}

const signOut = () => (location.href = '/auth/logout?next=/line');
const signIn = () => el('a', { className: 'btn filled', href: '/auth/login?next=/line' }, svg(I.github), 'Continue with GitHub');

// ---------- screens ----------

let state: Data | null = null;
let view: { thread?: string } = {};
let poll = 0;

function renderMembers(d: Data) {
  const box = document.getElementById('members')!;
  if (!d.count || !d.latest?.length) return void (box.hidden = true);
  box.hidden = false;
  box.replaceChildren(
    el('div', { className: 'stack' }, ...d.latest.map((m) => img(m.avatar, ''))),
    el('span', {}, `${d.count} member${d.count === 1 ? '' : 's'} · latest @${d.latest[0].login}`),
  );
}

function offline() {
  app.replaceChildren(
    appbar(document.createTextNode('Direct line')),
    el('div', { className: 'center' }, svg(I.lock, 'verified'), el('h2', {}, 'The line opens soon.'), el('p', {}, 'Email hello@dikshantjangra.me in the meantime.'), el('a', { className: 'btn text', href: '/' }, 'Back to the site')),
  );
}

function gate(d: Data) {
  app.replaceChildren(
    appbar(document.createTextNode('Direct line'), [], icon(I.back, 'Back to the site', undefined, '/')),
    el(
      'div',
      { className: 'screen' },
      passCard({ number: (d.count ?? 0) + 1 }, 'pop shine'),
      el('h2', {}, 'The direct line is for members.'),
      el('p', {}, 'Claim your pass (free) with GitHub and you can message me here. Early people get lower numbers.'),
      signIn(),
      d.count ? el('p', { className: 'signout' }, `${d.count} already in`) : null,
    ),
  );
}

function claim(d: Data) {
  const me = d.me!;
  const btn = el('button', { className: 'btn filled', type: 'button' }, `Claim ${passNo(d.next ?? 1)}`);
  btn.onclick = async () => {
    btn.disabled = true;
    const r = await api('/api/line', { action: 'claim' });
    if (!r.ok) return (btn.disabled = false), toast(r.data.error);
    await load(true);
  };
  app.replaceChildren(
    appbar(document.createTextNode('Your pass'), [menuButton([['Sign out', signOut]])], icon(I.back, 'Back to the site', undefined, '/')),
    el(
      'div',
      { className: 'screen' },
      passCard({ number: d.next ?? 1, login: me.login, avatar: me.avatar }, 'pop shine'),
      el('h2', {}, `Hey @${me.login}.`),
      el('p', {}, "Your number is waiting. Claim it and the line opens. No emails, no newsletter unless you ask."),
      btn,
      el('button', { className: 'btn text', type: 'button', onclick: signOut }, 'Not you? Sign out'),
    ),
  );
}

function bubbles(list: HTMLElement, msgs: Msg[], mine: (m: Msg) => boolean) {
  let lastDay = '';
  msgs.forEach((m, i) => {
    const d = day.format(m.created_at);
    if (d !== lastDay) {
      lastDay = d;
      list.append(el('div', { className: 'chip-date' }, d === day.format(Date.now()) ? 'Today' : d));
    }
    const prev = msgs[i - 1];
    const next = msgs[i + 1];
    const same = (a?: Msg) => a && mine(a) === mine(m) && Math.abs(a.created_at - m.created_at) < 5 * 60e3 && day.format(a.created_at) === d;
    const out = mine(m);
    list.append(el('div', { className: `msg ${out ? 'out' : 'in'}${same(prev) ? ' cont-prev' : ' first'}${same(next) ? ' cont-next' : ''}` }, m.body));
    if (!same(next)) {
      const isLastOut = out && !msgs.slice(i + 1).some(mine);
      const status = isLastOut ? (m.read_at ? ` · Read` : ' · Sent') : '';
      list.append(el('div', { className: `meta ${out ? 'out' : ''}` }, time.format(m.created_at) + status));
    }
  });
}

function chat(opts: { title: Node; sub: string; lead: Node; avatar: Node; msgs: Msg[]; mine: (m: Msg) => boolean; to?: number; top?: Node; empty?: Node; menu: [string, () => void][] }) {
  const prevList = app.querySelector<HTMLElement>('.list');
  const nearBottom = !prevList || prevList.scrollHeight - prevList.scrollTop - prevList.clientHeight < 80;
  const draft = app.querySelector<HTMLTextAreaElement>('textarea');
  const keep = draft ? { value: draft.value, focus: document.activeElement === draft } : null;

  const list = el('div', { className: 'list' });
  if (opts.top) list.append(opts.top);
  if (opts.msgs.length) bubbles(list, opts.msgs, opts.mine);
  else if (opts.empty) list.append(opts.empty);

  const ta = el('textarea', { rows: 1, placeholder: 'Text message', maxLength: MAX, ariaLabel: 'Message' });
  const count = el('span', { className: 'count' });
  const send = el('button', { className: 'send', type: 'submit', ariaLabel: 'Send', disabled: true }, svg(I.send));
  const sync = () => {
    send.disabled = !ta.value.trim();
    count.textContent = ta.value.length > MAX - 100 ? String(MAX - ta.value.length) : '';
  };
  ta.oninput = sync;
  ta.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && matchMedia('(pointer: fine)').matches) {
      e.preventDefault();
      form.requestSubmit();
    }
  };
  const form = el('form', { className: 'composer' }, el('div', { className: 'field' }, ta), count, send);
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = ta.value.trim();
    if (!text) return;
    ta.value = '';
    sync();
    list.querySelector('.empty')?.remove();
    const bubble = el('div', { className: 'msg out first pending' }, text);
    const meta = el('div', { className: 'meta out' }, 'Sending…');
    list.append(bubble, meta);
    list.scrollTop = list.scrollHeight;
    const r = await api('/api/line', { action: 'send', body: text, to: opts.to });
    if (!r.ok) {
      bubble.classList.replace('pending', 'failed');
      meta.className = 'meta out err';
      meta.textContent = `Not sent. ${r.data.error ?? ''} Tap to retry.`;
      bubble.onclick = () => ((ta.value = text), sync(), bubble.remove(), meta.remove(), ta.focus());
      return;
    }
    await load(true);
  };

  const bar = appbar(
    el('span', { style: 'display:contents' } as never, opts.avatar, el('div', { className: 'who' }, opts.title, el('small', {}, opts.sub))),
    [menuButton(opts.menu)],
    opts.lead,
  );
  list.onscroll = () => bar.classList.toggle('scrolled', list.scrollTop > 4);
  app.replaceChildren(bar, list, form);

  if (keep) {
    ta.value = keep.value;
    sync();
    if (keep.focus) ta.focus();
  }
  if (nearBottom || !prevList) list.scrollTop = list.scrollHeight;
  else list.scrollTop = prevList.scrollTop;
  if (!keep && matchMedia('(pointer: fine)').matches) ta.focus();
}

function memberChat(d: Data) {
  const pass = d.pass!;
  const chips = ['Saw your work, want to talk?', "I'm hiring for an internship", 'Question about NewtonClaw', 'Just saying hi'];
  const empty = el(
    'div',
    { className: 'empty' },
    el('p', {}, 'Say anything. It lands on my phone and I reply here.'),
    el('div', { className: 'chips' }, ...chips.map((c) => el('button', { className: 'chip', type: 'button', onclick: () => {
      const ta = app.querySelector('textarea')!;
      ta.value = c;
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    } }, c))),
  );
  chat({
    title: el('b', {}, 'Dikshant Jangra', svg(I.verified, 'verified')),
    sub: 'Usually replies within a day',
    lead: icon(I.back, 'Back to the site', undefined, '/'),
    avatar: djAvatar(),
    msgs: d.messages ?? [],
    mine: (m) => !m.from_dj,
    top: el('div', { className: 'pinned' }, passCard({ ...pass }, 'mini'), el('p', { className: 'sys' }, `You're member ${passNo(pass.number)}. This thread is private: just you and me.`)),
    empty,
    menu: [
      ['Copy pass number', () => navigator.clipboard?.writeText(passNo(pass.number)).then(() => toast('Copied'))],
      ['Back to the site', () => (location.href = '/')],
      ['Sign out', signOut],
    ],
  });
}

function inbox(d: Data) {
  const threads = d.threads ?? [];
  const ago = (t: number) => (Date.now() - t < 864e5 && day.format(t) === day.format(Date.now()) ? time.format(t) : day.format(t));
  app.replaceChildren(
    appbar(el('span', {}, 'Inbox'), [menuButton([['Refresh', () => load(true)], ['Back to the site', () => (location.href = '/')], ['Sign out', signOut]])], icon(I.back, 'Back to the site', undefined, '/')),
    threads.length
      ? el(
          'ul',
          { className: 'threads' },
          ...threads.map((t) =>
            el(
              'li',
              { className: t.unread ? 'unread' : '' },
              el(
                'button',
                { type: 'button', onclick: () => open(t.id) },
                img(t.avatar, 'avatar'),
                el('div', { className: 't-main' }, el('div', { className: 't-top' }, el('b', {}, `@${t.login}`), el('small', {}, ago(t.at))), el('div', { className: 't-last' }, `${t.last_from_dj ? 'You: ' : ''}${t.last}`)),
                t.unread ? el('span', { className: 'badge' }, String(t.unread)) : null,
              ),
            ),
          ),
        )
      : el('div', { className: 'center' }, el('h2', {}, 'No messages yet.'), el('p', {}, `${d.count ?? 0} members so far. They'll show up here.`)),
  );
}

function ownerThread(d: Data) {
  const m = d.member;
  if (!m) return close();
  chat({
    title: el('b', {}, `@${m.login}`),
    sub: `${passNo(m.number)} · joined ${joined.format(m.created_at!)}`,
    lead: icon(I.back, 'Back to inbox', close),
    avatar: img(m.avatar, 'avatar'),
    msgs: d.messages ?? [],
    mine: (x) => !!x.from_dj,
    to: m.id,
    menu: [['Open GitHub profile', () => window.open(`https://github.com/${m.login}`, '_blank', 'noopener')], ['Back to inbox', close]],
  });
}

function open(id: number) {
  view = { thread: String(id) };
  history.pushState(view, '', `/line?thread=${id}`);
  app.replaceChildren(el('div', { className: 'center' }, el('span', { className: 'spinner' })));
  load(true);
}
function close() {
  view = {};
  history.pushState(view, '', '/line');
  load(true);
}
addEventListener('popstate', () => {
  view = { thread: new URL(location.href).searchParams.get('thread') ?? undefined };
  load(true);
});

let last = '';
async function load(force = false) {
  const r = await api(view.thread ? `/api/line?thread=${encodeURIComponent(view.thread)}` : '/api/line');
  if (!r.ok) {
    if (!state) offline();
    return;
  }
  const d: Data = r.data;
  const sig = JSON.stringify(d);
  if (!force && sig === last) return;
  last = sig;
  state = d;
  renderMembers(d);
  if (!d.open) return offline();
  if (!d.me) return gate(d);
  if (d.owner) return view.thread ? ownerThread(d) : inbox(d);
  if (!d.pass) return claim(d);
  memberChat(d);
}

view = { thread: new URL(location.href).searchParams.get('thread') ?? undefined };
load(true);

// Poll while the tab is visible; slower in the background.
function schedule() {
  clearTimeout(poll);
  poll = window.setTimeout(async () => {
    if (state?.me && (state.pass || state.owner)) await load();
    schedule();
  }, document.hidden ? 30000 : 4000);
}
schedule();
document.addEventListener('visibilitychange', () => !document.hidden && (load(), schedule()));
