// Live mini-demo of the catalog enrichment pipeline.
const form = document.getElementById('demo-form') as HTMLFormElement;
const steps = document.getElementById('demo-steps')!;
const card = document.getElementById('demo-card')!;
const STEPS = ['Cleaning the name', 'Finding brand', 'Picking a category', 'Pulling attributes', 'Writing the description'];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

form.onsubmit = async (e) => {
  e.preventDefault();
  const name = (form.elements.namedItem('product') as HTMLInputElement).value.trim();
  const btn = form.querySelector('button')!;
  if (!name) return;
  btn.disabled = true;
  card.hidden = true;
  steps.replaceChildren();
  const req = fetch('/api/enrich', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) })
    .then((r) => r.json())
    .catch(() => ({ error: 'Network hiccup. Try again.' }));
  for (const s of STEPS) {
    steps.append(Object.assign(document.createElement('li'), { textContent: `✓ ${s}` }));
    if (!reduce) await new Promise((r) => setTimeout(r, 280));
  }
  const d = await req;
  btn.disabled = false;
  if (d.error) {
    steps.append(Object.assign(document.createElement('li'), { textContent: `× ${d.error}`, className: 'err' }));
    return;
  }
  card.replaceChildren();
  const h = Object.assign(document.createElement('h3'), { textContent: d.title });
  const meta = Object.assign(document.createElement('p'), { className: 'meta', textContent: `${d.brand} · ${d.category}` });
  const desc = Object.assign(document.createElement('p'), { textContent: d.description });
  const chips = Object.assign(document.createElement('div'), { className: 'chips' });
  Object.entries(d.attributes as Record<string, string>).forEach(([k, v]) => chips.append(Object.assign(document.createElement('span'), { className: 'chip', textContent: `${k}: ${v}` })));
  card.append(h, meta, desc, chips);
  card.hidden = false;
};

export {};
