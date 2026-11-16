// Single source of truth: the page, /llms.txt, JSON-LD, the MCP server and Ask DJ all read this.
// Anything in [brackets] or an empty '' is a TODO from plan.md "What you fill in".

export const site = {
  url: 'https://dikshantjangra.me',
  name: 'Dikshant Jangra',
  short: 'DJ',
  age: 21,
  location: 'Haryana, India',
  oneLiner: 'Builds production software end to end: AI agents, backends and the apps on top.',
  title: 'Dikshant Jangra (DJ) — Software engineer building AI agents and production systems',
  description:
    'Dikshant Jangra (DJ), 21, software engineer from Haryana, India. 1st place at the Newton School MCP Challenge across 3 campuses and Best Use of Gemma 4 at Hacktoberfest Hack Day 2026. Qualified for the Smart India Hackathon in 2024, 2025 and 2026. Builds AI agents, multi-tenant backends and the apps that run on them, in production.',
  updated: 'Oct 2026',
  // Live values (pill, building) come from /api/status (KV, set via Telegram); these are the fallbacks.
  available: true,
  pill: 'Open to SDE & AI internships',
  coords: { lat: 29.1492, lon: 75.7217 },
};

export const links = {
  cal: 'https://cal.com/dikshantjangra',
  email: 'hello@dikshantjangra.me', // TODO: forward hello@ (MX is Namecheap email forwarding)
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
  githubLogin: 'DikshantJangra', // for public GitHub data (contribution graph)
  githubId: 76596000, // owner check uses GitHub's numeric id: usernames can be renamed and re-registered
};

export const proof = [
  '1st place, MCP Challenge across 3 campuses',
  'Best Use of Gemma 4, #1 at Hacktoberfest Hack Day 2026',
  'Hundreds of orders a day in production',
  '24,000-product catalog on ~70 MB RAM',
];

// Homepage stat strip: n = the figure, t = what it measures.
export const stats = [
  { n: '1st', t: 'Newton School MCP Challenge, 3 campuses' },
  { n: '#1', t: 'Hacktoberfest Hack Day, Best Use of Gemma 4' },
  { n: '100s', t: 'of orders a day in production' },
  { n: '24,000', t: 'products on ~70 MB of RAM' },
];

export type Tag = 'Building' | 'Client' | 'Live' | 'Open source' | 'Award' | 'Hackathon';

export const work: { name: string; url: string; icon?: string; oneLiner: string; detail: string; bullets?: string[]; tags: Tag[]; stack: string[] }[] = [
  {
    name: 'MyRxSetu',
    url: 'https://myrxsetu.com',
    oneLiner: 'Pharmacy management software for India: POS, stock, GST and an online store in one system.',
    detail: 'Counter POS, owner dashboard, admin console, storefront and a desktop shell on one Hono API. Each pharmacy gets its own libSQL database, with batch and expiry tracking, a GST tax engine, Razorpay, WhatsApp, and fast medicine search on Typesense. Self-hosted on Coolify.',
    bullets: [
      'Built multi-tenant pharmacy software for India (POS, stock, GST, online store) on one Hono API, giving each pharmacy its own libSQL database',
      'Shipped five surfaces on that API: counter POS, owner dashboard, admin console, online storefront and a desktop shell',
      'Added batch and expiry tracking, a GST tax engine, Razorpay, WhatsApp and Typesense medicine search; self-hosted on Coolify',
    ],
    tags: ['Live'],
    stack: ['Next.js', 'Hono', 'Drizzle', 'libSQL', 'BullMQ', 'Typesense', 'Razorpay'],
  },
  {
    name: 'Jinn',
    url: 'https://github.com/DikshantJangra/Jinn',
    oneLiner: 'A private, offline AI assistant built on Google Gemma: a floating macOS agent and a Python CLI.',
    detail: 'Zero-egress local AI companion. A macOS HUD opened with ⌥+Space, with voice dictation, local semantic memory, Accessibility control and Chrome automation, plus a Python CLI for task planning and repo AST audits. Gemma runs on-device via Ollama, behind three-tier command approvals.',
    bullets: [
      'Built a zero-egress assistant running Gemma locally via Ollama: a macOS voice HUD with Chrome automation and a Python CLI for repo audits, gated by three-tier command approvals',
      'Won Best Use of Gemma 4 at Hacktoberfest Hack Day 2026, scoring 46 points to the next team’s 32',
    ],
    tags: ['Hackathon', 'Open source'],
    stack: ['Gemma', 'Ollama', 'Python', 'Swift', 'Three.js', 'GitHub Actions'],
  },
  {
    name: 'BlazeEats',
    url: 'https://blazeeats.in',
    icon: '/logos/blazeeats.png',
    oneLiner: 'The full tech stack behind a food brand. Hundreds of people order on it every day.',
    detail: 'Storefront, kitchen, rider and HQ apps on one multi-tenant Postgres backend. Tenant isolation with row-level security, money in integer paise, GST invoicing, Razorpay webhooks with reconciliation, and an outbox for durable jobs.',
    bullets: [
      'Built the full stack behind a food brand taking hundreds of orders a day: storefront, kitchen, rider and HQ apps on one multi-tenant Postgres backend',
      'Enforced tenant isolation with row-level security and kept all money in integer paise',
      'Built GST invoicing and made Razorpay webhooks idempotent, with reconciliation and an outbox for durable jobs',
    ],
    tags: ['Live'],
    stack: ['Next.js 16', 'React 19', 'Hono', 'Drizzle', 'PostgreSQL', 'Tailwind v4', 'Razorpay'],
  },
  {
    name: 'KR Stationers',
    url: 'https://krstationers.com/in',
    oneLiner: 'Took a 24,000-SKU retail catalog online.',
    detail: 'A self-hosted enrichment pipeline that fills in product data and images for the whole catalog without paid APIs, in about 70 MB of RAM.',
    bullets: [
      'Took a 24,000-SKU retail catalog online with a self-hosted enrichment pipeline that fills product data and images using no paid APIs, in ~70 MB of RAM',
    ],
    tags: ['Client', 'Live'],
    stack: ['FastAPI', 'Python', 'Medusa', 'Next.js', 'Cloudflare'],
  },
  {
    name: 'NewtonClaw',
    url: links.newtonclaw,
    oneLiner: 'Took 1st place at the Newton School MCP Challenge across 3 campuses and won a year of Claude Pro.',
    detail: 'A local-first AI agent for students. One agent loop, built as ports and adapters, serves both a terminal CLI and a Telegram bot, calls tools over MCP and runs on OpenAI, Claude, Gemini or fully offline on Ollama. Ships with npx newtonclaw.',
    bullets: [
      'Built one agent loop serving a CLI and Telegram bot over MCP, on OpenAI, Claude, Gemini or offline Ollama; shipped as npx newtonclaw',
      'Won 1st place at the Newton School MCP Challenge across 3 campuses, earning a year of Claude Pro',
    ],
    tags: ['Award', 'Open source'],
    stack: ['MCP', 'TypeScript', 'Telegraf', 'OpenAI / Ollama', 'Chrome extension'],
  },
  {
    name: 'ResolvHome',
    url: 'https://resolvhome.netlify.app',
    icon: '/logos/resolvhome.svg',
    oneLiner: 'Home-services booking platform with an operator console.',
    detail: 'Customer app and admin panel in one Turborepo, sharing a design system and an API client generated from the backend’s OpenAPI spec, so the two can’t drift apart.',
    bullets: [
      'Built a home-services booking platform: a customer app and an operator console in one Turborepo',
      'Shared one design system and an API client generated from the backend’s OpenAPI spec, so the two apps cannot drift apart',
    ],
    tags: ['Client', 'Live'],
    stack: ['Next.js', 'React 19', 'Tailwind v4', 'TanStack Query', 'Zustand'],
  },
  {
    name: 'BlazeResolver',
    url: 'https://github.com/DikshantJangra/BlazeResolver',
    oneLiner: 'Customer bug reports in. Reviewed pull requests out.',
    detail: 'An open-source agent harness that turns a customer’s bug report into a reviewed pull request. It runs on your own GitHub Actions, with no server to host, and is published on npm.',
    bullets: [
      'Built an open-source agent harness that turns a customer’s bug report into a reviewed pull request',
      'Runs on your own GitHub Actions with no server to host; published on npm',
    ],
    tags: ['Open source'],
    stack: ['TypeScript', 'GitHub Actions', 'LLM agents'],
  },
  {
    name: 'Chatter',
    url: '', // TODO: repo link
    oneLiner: 'Move WhatsApp chats between Android and iPhone.',
    detail: 'Open-source, two-way migration of WhatsApp history by patching Android and iOS device backups. Built it because nothing free worked.',
    bullets: [
      'Built open-source, two-way migration of WhatsApp history between Android and iPhone by patching device backups',
      'Built it because no free alternative worked',
    ],
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

// Focus areas. The page, the MCP server and Ask DJ read this.
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

export const experience: { role: string; org: string; note: string; dates: string; url?: string; icon?: string; bullets?: string[]; chips: string[] }[] = [
  {
    role: 'Team lead, SDE intern',
    org: 'AgroEdge',
    note: 'Led the team building an agri-tech platform before launch, remote',
    bullets: [
      'Led a team of 8 to build and deploy an agri-tech platform end to end in 5 months, working remotely',
      'Shipped three full-stack apps (farmer, manager and admin) in React, TypeScript and Supabase',
    ],
    dates: 'Apr 2025–Aug 2025',
    url: 'https://www.agroedge.in',
    icon: '/logos/agroedge.png',
    chips: ['React', 'TypeScript', 'Supabase'],
  },
];

export const education: { role: string; org: string; dates: string; cgpa?: string }[] = [
  // TODO: confirm; inferred from your old site (NST / Rishihood email, 2024 batch)
  { role: 'B.Tech, Computer Science & AI', org: 'Newton School of Technology, Rishihood University', dates: '2024–2028', cgpa: '8.04/10' },
];

export const awards = [
  { role: 'Best Use of Gemma 4 — Hacktoberfest Hack Day', org: 'Jinn', note: 'Sonipat x Rishihood University · #1 on campus, 46 points to the next best 32', dates: 'Oct 2026', url: 'https://github.com/DikshantJangra/Jinn' },
  { role: '1st place — Newton School MCP Challenge', org: 'NewtonClaw', note: '1st of 3 winners, 3 campuses · won a year of Claude Pro', dates: 'Apr 2026', url: links.newtonclaw },
  { role: 'Qualifier — Smart India Hackathon', org: '', note: 'Qualified in 2024, 2025 and 2026', dates: '2024–2026', url: 'https://www.sih.gov.in' },
];

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

## Focus areas
${l(services.map((s) => `${s.name}: ${s.text}`))}

## Experience
${l(experience.map((e) => `${e.role}, ${e.org} (${e.dates})`))}

## Education
${l(education.map((e) => `${e.role}, ${e.org} (${e.dates})`))}

## Awards
${l(awards.map((a) => `${[a.role, a.org].filter(Boolean).join(' — ')}. ${a.note}.`))}

## Contact
${l([`Book a call: ${links.cal}`, `Email: ${links.email}`, `GitHub: ${links.github}`, `LinkedIn: ${links.linkedin}`, `MCP server: ${site.url}/mcp`])}
`;
}
