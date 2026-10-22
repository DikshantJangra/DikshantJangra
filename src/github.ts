// GitHub contribution calendar, parsed from the public contributions page (no token needed).
// Used at build time for the first paint and by /api/github for fresh numbers.
export type Day = { date: string; level: number; count: number };
export type Activity = { total: number; days: Day[] };

export function parseContributions(html: string): Activity {
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) counts.set(id, parseInt(text.replace(/,/g, '')) || 0);
  const days: Day[] = [];
  for (const [tag] of html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const attr = (k: string) => tag.match(new RegExp(`\\b${k}="([^"]*)"`))?.[1] ?? '';
    days.push({ date: attr('data-date'), level: Number(attr('data-level')) || 0, count: counts.get(attr('id')) ?? 0 });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  const total = Number(html.replace(/\s+/g, ' ').match(/([\d,]+) contributions? in/)?.[1].replace(/,/g, '')) || days.reduce((n, d) => n + d.count, 0);
  return { total, days };
}

// Rolling year ending today, same window as the graph on a GitHub profile.
export async function fetchActivity(user: string, init?: RequestInit): Promise<Activity> {
  const res = await fetch(`https://github.com/users/${user}/contributions`, init);
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return parseContributions(await res.text());
}

const short = (date: string, opts: Intl.DateTimeFormatOptions) => new Date(`${date}T00:00Z`).toLocaleString('en', { ...opts, timeZone: 'UTC' });
const plural = (n: number) => `${n || 'No'} contribution${n === 1 ? '' : 's'}`;

// Grid markup, shared by the build (first paint) and the browser (fresh data). The last day is today.
export function gridHTML({ days }: Activity): string {
  if (!days.length) return '';
  const dow = new Date(`${days[0].date}T00:00Z`).getUTCDay();
  let lastMonthCol = -9;
  let html = `<span class="gh-dow"><b></b><b></b><b>Mon</b><b></b><b>Wed</b><b></b><b>Fri</b><b></b></span>`;
  days.forEach((d, i) => {
    const col = Math.floor((dow + i) / 7) + 2;
    const row = ((dow + i) % 7) + 2;
    if (d.date.endsWith('-01') && col - lastMonthCol > 2) {
      html += `<span class="gh-month" style="grid-column:${col} / span 4">${short(d.date, { month: 'short' })}</span>`;
      lastMonthCol = col;
    }
    const today = i === days.length - 1;
    html += `<i data-l="${d.level}"${today ? ' class="today"' : ''} title="${plural(d.count)} on ${short(d.date, { month: 'short', day: 'numeric' })}${today ? ' (today)' : ''}" style="grid-area:${row}/${col}"></i>`;
  });
  return html;
}

export const todayLine = ({ days }: Activity) => {
  const n = days.at(-1)?.count ?? 0;
  return n ? `Coded today<span class="gh-n"> · ${plural(n).toLowerCase()}</span>` : "Didn't code today";
};
