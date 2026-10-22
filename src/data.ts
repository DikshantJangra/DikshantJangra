// Single source of truth: the page, /llms.txt, JSON-LD, the MCP server and Ask DJ all read this.
// Anything in [brackets] or an empty '' is a TODO from plan.md "What you fill in".

export const site = {
  url: 'https://dikshantjangra.com',
  name: 'Dikshant Jangra',
  short: 'DJ',
  age: 21,
  location: 'Haryana, India',
  oneLiner: 'I build production software end to end: AI agents, backends and the apps on top.',
  title: 'Dikshant Jangra (DJ) — Software engineer building AI agents and production systems',
  description:
    'Dikshant Jangra (DJ), 21, software engineer from Haryana, India. 1st place at the Newton School MCP Challenge. Builds AI agents, multi-tenant backends and the apps that run on them, in production.',
  updated: 'Oct 2026',
  // Live values (pill, building) come from /api/status (KV, set via Telegram); these are the fallbacks.
  available: true,
  pill: 'Open to SDE & AI internships',
  coords: { lat: 29.1492, lon: 75.7217 },
};

export const links = {
  cal: 'https://cal.com/dikshantjangra',
  email: 'hello@dikshantjangra.com', // TODO: set up Cloudflare Email Routing for this address
  whatsapp: '', // TODO: digits only with country code, e.g. 919876543210
  resume: '/resume', // printable page built from this file; swap for '/resume.pdf' if you prefer a PDF
  github: 'https://github.com/DikshantJangra',
  linkedin: 'https://www.linkedin.com/in/dikshantjangra/',
  x: '', // TODO
  instagram: '', // TODO
  dhivio: '', // TODO
  newtonclaw: 'https://github.com/DikshantJangra/NewtonClaw',
  wikidata: '', // TODO: your Wikidata item URL
  lanyardDiscordId: '', // TODO: join discord.gg/lanyard, paste your Discord user ID for "now playing"
  analyticsToken: '', // TODO: Cloudflare Web Analytics beacon token
};

export const flags = {
  panelLive: false, // flip when your own Knowledge Panel is live
  githubLogin: 'DikshantJangra', // this GitHub user can delete guestbook entries
};

export const proof = [
  '1st place — Newton School MCP Challenge',
  '100s of orders a day in production',
  '24,000-SKU catalog enriched on ~70 MB RAM',
  '2 open-source agent tools on npm',
];

export type Tag = 'Building' | 'Client' | 'Live' | 'Open source' | 'Award';

export const work: { name: string; url: string; oneLiner: string; detail: string; tags: Tag[]; stack: string[] }[] = [
  {
    name: 'NewtonClaw',
    url: links.newtonclaw,
    oneLiner: 'Won 1st place at the Newton School MCP Challenge.',
    detail: 'A local-first AI agent for students. One agent loop, built as ports and adapters, serves both a terminal CLI and a Telegram bot, calls tools over MCP and runs on OpenAI, Claude, Gemini or fully offline on Ollama. Ships with npx newtonclaw.',
    tags: ['Award', 'Open source'],
    stack: ['MCP', 'TypeScript', 'Telegraf', 'OpenAI / Ollama', 'Chrome extension'],
  },
  {
    name: 'BlazeEats',
    url: 'https://blazeeats.in',
    oneLiner: 'The full tech stack behind a food brand. Hundreds of people order on it every day.',
    detail: 'Storefront, kitchen, rider and HQ apps on one multi-tenant Postgres backend. Tenant isolation with row-level security, money in integer paise, GST invoicing, Razorpay webhooks with reconciliation, and an outbox for durable jobs.',
    tags: ['Live'],
    stack: ['Next.js 16', 'React 19', 'Hono', 'Drizzle', 'PostgreSQL', 'Tailwind v4', 'Razorpay'],
  },
  {
    name: 'KR Stationers', // TODO: written OK from KR Stationers before launch
    url: '',
    oneLiner: 'Took a 24,000-SKU retail catalog online.',
    detail: 'A self-hosted enrichment pipeline that fills in product data and images for the whole catalog without paid APIs, in about 70 MB of RAM.',
    tags: ['Client', 'Live'],
    stack: ['FastAPI', 'Python', 'Medusa', 'Next.js', 'Cloudflare'],
  },
  {
    name: 'Resolve Home',
    url: 'https://resolve-home.vercel.app',
    oneLiner: 'Home-services booking platform with an operator console.',
    detail: 'Customer app and admin panel in one Turborepo, sharing a design system and an API client generated from the backend’s OpenAPI spec, so the two can’t drift apart.',
    tags: ['Live'],
    stack: ['Next.js', 'React 19', 'Tailwind v4', 'TanStack Query', 'Zustand'],
  },
  {
    name: 'BlazeResolver',
    url: 'https://github.com/DikshantJangra/BlazeResolver',
    oneLiner: 'Customer bug reports in. Reviewed pull requests out.',
    detail: 'An open-source agent harness that turns a customer’s bug report into a reviewed pull request. It runs on your own GitHub Actions, with no server to host, and is published on npm.',
    tags: ['Open source'],
    stack: ['TypeScript', 'GitHub Actions', 'LLM agents'],
  },
  {
    name: 'Chatter',
    url: '', // TODO: repo link
    oneLiner: 'Move WhatsApp chats between Android and iPhone.',
    detail: 'Open-source, two-way migration of WhatsApp history by patching Android and iOS device backups. Built it because nothing free worked.',
    tags: ['Open source'],
    stack: ['Python', 'libimobiledevice'],
  },
];

export const lab: { name: string; text: string; tag: Tag }[] = [
  { name: 'BlazeBill', text: 'Offline-first restaurant billing and POS with open pricing. Every outlet is one toggle away from BlazeEats orders.', tag: 'Building' },
  { name: 'HopeRxPharma', text: 'Pharmacy software: stock by batch and expiry, GST billing, suppliers and prescriptions.', tag: 'Client' },
  { name: 'India SaaS Starter', text: 'A boilerplate with Razorpay, WhatsApp OTP and GST invoices built in.', tag: 'Building' },
  { name: 'BLUE GATE AI', text: 'Smart-money-concepts indicator and Expert Advisor for MetaTrader 5.', tag: 'Client' },
];

// What I work on. The page, the MCP server and Ask DJ read this.
export const services = [
  {
    name: 'AI agents and MCP',
    text: 'Agents that take real actions: tool calling over MCP, one agent core behind several interfaces, evals, and fallback to local models when privacy or cost matter.',
    chips: ['MCP', 'Claude / OpenAI / Gemini', 'Ollama', 'Workers AI'],
  },
  {
    name: 'Backends that handle money and stock',
    text: 'Multi-tenant Postgres with row-level security, idempotent payment webhooks, ledgers, invoicing and background jobs that survive restarts.',
    chips: ['PostgreSQL', 'Hono / FastAPI', 'Drizzle', 'Razorpay'],
  },
  {
    name: 'Product engineering, end to end',
    text: 'Web and native apps on top: fast, accessible and found on Google, deployed on the edge, with CI that blocks regressions.',
    chips: ['Next.js / React', 'React Native', 'Cloudflare', 'Playwright'],
  },
];

export const experience = [
  { role: 'Founder', org: 'Dhivio', note: 'Software studio', dates: 'May 2026–Present', chips: ['Next.js', 'Node', 'PostgreSQL', 'Python'] },
  { role: 'Freelance software engineer', org: 'Clients in India and abroad', note: '', dates: '2025–Present', chips: ['Full-stack apps', 'Payments', 'Technical SEO'] },
];

export const education = [
  // TODO: confirm; inferred from your old site (NST / Rishihood email, 2024 batch)
  { role: 'B.Tech, Computer Science & AI', org: 'Newton School of Technology, Rishihood University', dates: '2024–2028' },
];

export const awards = [{ role: '1st place — Newton School MCP Challenge', org: 'NewtonClaw', dates: 'Apr 2026' }];

export const internshipLine = 'Open to SDE and AI engineering internships from January 2027.';

export const now = {
  building: 'BlazeBill, an offline-first restaurant POS wired into BlazeEats',
  lastShipped: 'BlazeEats · Oct 2026',
};

// Plain-text profile for /llms.txt, Ask DJ and the MCP server.
export function profileText(): string {
  const l = (s: string[]) => s.map((x) => `- ${x}`).join('\n');
  return `# ${site.name} (${site.short})

> ${site.oneLiner} ${site.age}, ${site.location}.

${site.description}

## Work
${l(work.map((w) => `${w.name} [${w.tags.join(', ')}]: ${w.oneLiner} ${w.detail} Stack: ${w.stack.join(', ')}.`))}

## Lab
${l(lab.map((p) => `${p.name} [${p.tag}]: ${p.text}`))}

## What I work on
${l(services.map((s) => `${s.name}: ${s.text}`))}

## Experience
${l(experience.map((e) => `${e.role}, ${e.org} (${e.dates})`))}

## Education
${l(education.map((e) => `${e.role}, ${e.org} (${e.dates})`))}

## Awards
${l(awards.map((a) => `${a.role} — ${a.org}`))}

## Contact
${l([`Book a call: ${links.cal}`, `Email: ${links.email}`, `GitHub: ${links.github}`, `LinkedIn: ${links.linkedin}`, `MCP server: ${site.url}/mcp`])}
`;
}
