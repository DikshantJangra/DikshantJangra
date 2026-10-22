// "N here now" + live cursors via the presence Durable Object.
const here = document.getElementById('here')!;
const fine = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const cursors = new Map<string, HTMLElement>();
let ws: WebSocket | undefined;
let retry = 1000;

const setCount = (n: number) => {
  here.hidden = n < 2;
  here.textContent = `${n} here now`;
};

function connect() {
  ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/presence`);
  ws.onopen = () => (retry = 1000);
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.type === 'count') setCount(m.here);
    if (m.type === 'leave') cursors.get(m.id)?.remove(), cursors.delete(m.id);
    if (m.type === 'cursor' && fine) {
      let c = cursors.get(m.id);
      if (!c) {
        c = Object.assign(document.createElement('span'), { className: 'cursor' });
        c.setAttribute('aria-hidden', 'true');
        document.body.append(c);
        cursors.set(m.id, c);
      }
      c.style.transform = `translate(${innerWidth / 2 + m.x}px, ${m.y}px)`;
    }
  };
  ws.onclose = () => {
    cursors.forEach((c) => c.remove());
    cursors.clear();
    if (document.visibilityState === 'visible') setTimeout(connect, (retry = Math.min(retry * 2, 30000)));
  };
}

if ('WebSocket' in window) {
  connect();
  let last = 0;
  if (fine)
    addEventListener('pointermove', (e) => {
      const t = performance.now();
      if (t - last < 50 || ws?.readyState !== 1) return;
      last = t;
      ws.send(JSON.stringify({ x: e.clientX - innerWidth / 2, y: e.pageY }));
    });
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && ws?.readyState === 3 && connect());
}

export {};
