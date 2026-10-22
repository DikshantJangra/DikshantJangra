type Entry = { id: number; login: string; avatar: string; message: string; created_at: number };
type Data = { me: { login: string; avatar: string; owner: boolean } | null; entries: Entry[] };

const list = document.getElementById('gb-list')!;
const form = document.getElementById('gb-form') as HTMLFormElement;
const auth = document.getElementById('gb-auth')!;
const err = document.getElementById('gb-err')!;
const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids);
  return e;
}

async function load() {
  const r = await fetch('/api/guestbook').catch(() => null);
  if (!r?.ok) return void (list.replaceChildren(el('li', { className: 'muted' }, 'Guestbook is offline right now.')));
  const d: Data = await r.json();
  auth.replaceChildren(
    d.me
      ? el('span', { className: 'meta' }, `Signed in as @${d.me.login} · `, el('a', { href: '/auth/logout' }, 'sign out'))
      : el('a', { className: 'btn btn-secondary', href: '/auth/login' }, 'Sign in with GitHub to sign'),
  );
  form.hidden = !d.me;
  list.replaceChildren(
    ...(d.entries.length
      ? d.entries.map((e) => {
          const li = el(
            'li',
            {},
            el('img', { src: `${e.avatar}${e.avatar.includes('?') ? '&' : '?'}s=48`, alt: '', width: 24, height: 24, loading: 'lazy' }),
            el('div', {}, el('p', {}, e.message), el('p', { className: 'meta' }, el('a', { href: `https://github.com/${e.login}` }, `@${e.login}`), ` · ${date.format(e.created_at)}`)),
          );
          if (d.me?.owner) {
            const del = el('button', { className: 'useless', type: 'button', textContent: 'delete' });
            del.onclick = async () => (await fetch(`/api/guestbook?id=${e.id}`, { method: 'DELETE' }), load());
            li.append(del);
          }
          return li;
        })
      : [el('li', { className: 'muted' }, 'No notes yet. Be the first.')]),
  );
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const input = form.elements.namedItem('message') as HTMLInputElement;
  err.textContent = '';
  const r = await fetch('/api/guestbook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: input.value }) });
  if (r.ok) {
    input.value = '';
    load();
  } else err.textContent = (await r.json().catch(() => ({}))).error ?? 'Could not save that.';
};

// Load when the section scrolls near, not on page load.
new IntersectionObserver(([e], o) => e.isIntersecting && (o.disconnect(), load()), { rootMargin: '400px' }).observe(list);

export {};
