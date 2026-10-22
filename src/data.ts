// Single source of truth: the page, /llms.txt, JSON-LD, the MCP server and Ask DJ all read this.
// Anything in [brackets] or an empty '' is a TODO from plan.md "What you fill in".

export const site = {
  url: 'https://dikshantjangra.com',
  name: 'Dikshant Jangra',
  short: 'DJ',
  age: 21,
  location: 'Hisar, India',
  oneLiner: 'I build the software small businesses run on.',
  title: 'Dikshant Jangra (DJ) — I build software small businesses run on',
  description:
    'Dikshant Jangra (DJ), 21, developer from Hisar, India. I build inventory, ordering and admin software for small businesses, and help people get found on Google.',
  updated: 'Oct 2026',
  // Live values (pill, building) come from /api/status (KV, set via Telegram); these are the fallbacks.
  available: true,
  pill: 'Taking 2 projects for Nov–Dec',
  coords: { lat: 29.1492, lon: 75.7217 },
};

export const links = {
  cal: 'https://cal.com/dikshantjangra',
  email: 'hello@dikshantjangra.com', // TODO: set up Cloudflare Email Routing for this address
  whatsapp: '', // TODO: digits only with country code, e.g. 919876543210
  resume: '', // TODO: drop resume.pdf in public/ and set '/resume.pdf'
  github: 'https://github.com/DikshantJangra',
  linkedin: 'https://www.linkedin.com/in/dikshantjangra/',
  x: '', // TODO
  instagram: '', // TODO
  dhivio: '', // TODO
  newtonclaw: '', // TODO: repo or demo
  wikidata: '', // TODO: your Wikidata item URL
  lanyardDiscordId: '', // TODO: join discord.gg/lanyard, paste your Discord user ID for "now playing"
};

export const proof = [
  '1st place — Newton School MCP Challenge',
  '24,000-product inventory on ~70 MB RAM',
  'Client work for businesses in India and abroad',
];

export type Tag = 'Building' | 'Client' | 'Live' | 'Open source' | 'Award';

export const work: { name: string; url: string; oneLiner: string; detail: string; tags: Tag[]; stack: string[] }[] = [
  {
    name: 'KR Stationers', // TODO: written OK from KR Stationers before launch
    url: '',
    oneLiner: 'Took a 24,000-item stationery catalog online.',
    detail: 'Self-hosted pipeline that fills in product details and images without paid APIs — runs in about 70 MB of RAM.',
    tags: ['Client', 'Live'],
    stack: ['FastAPI', 'Python', 'Vercel', 'Cloudflare'],
  },
  {
    name: 'BlazeEats',
    url: '',
    oneLiner: 'A student-first food brand with its own tech.',
    detail: 'Ordering app, branch ops, HQ admin and delivery on one inventory engine that tracks every ingredient from raw stock to plated dish.',
    tags: ['Building'],
    stack: ['[your stack]'],
  },
  {
    name: 'NewtonClaw',
    url: links.newtonclaw,
    oneLiner: '1st place, Newton School MCP Challenge.',
    detail: '[One line: what it does and for whom.]',
    tags: ['Award'],
    stack: ['MCP', 'Claude'],
  },
  {
    name: 'Chatter',
    url: '', // TODO: repo link
    oneLiner: 'Move WhatsApp chats between Android and iPhone.',
    detail: 'Open-source Python tool for two-way migration. Built it when I switched phones and nothing free worked.',
    tags: ['Open source'],
    stack: ['Python', 'libimobiledevice'],
  },
];

export const lab: { name: string; text: string; tag: Tag }[] = [
  { name: 'India SaaS Starter', text: 'A boilerplate with Razorpay, WhatsApp OTP and GST invoices built in.', tag: 'Building' },
  { name: 'BLUE GATE AI', text: 'Smart-money-concepts indicator and Expert Advisor for MetaTrader 5.', tag: 'Client' },
];

export const services = [
  {
    name: 'Business software',
    text: 'Inventory, ordering, admin panels and internal dashboards. For when your business has outgrown Excel and WhatsApp.',
    chips: ['Web app', 'Mobile app', 'Admin panel', 'Razorpay / WhatsApp / GST integrations'],
  },
  {
    name: 'Websites that bring in leads',
    text: 'Fast, clean sites and landing pages for founders and local brands. Built to load in under 2 seconds and turn visits into enquiries.',
    chips: ['Landing pages', 'Business sites', 'SEO setup'],
  },
  {
    name: 'Get found on Google',
    text: 'Knowledge Panels and structured data, so a search for your name shows your photo, bio and links in the box on the right. Google decides when a panel appears; I set up everything it looks for.',
    chips: ['Wikidata', 'Schema markup', 'Entity SEO'],
  },
];
// TODO: prices
export const prices = ['Software projects from ₹[X]', 'Websites from ₹[X]', 'Knowledge Panel setup from $[X]'];

export const chat: { who: 'you' | 'dj'; step?: string; text: string }[] = [
  { who: 'you', step: '01', text: "Here's the problem — we still track stock on paper." },
  { who: 'dj', text: 'Got it. Plan and a fixed quote within 24 hours.' },
  { who: 'dj', step: '02 · week 1', text: 'First working screens are live. Try them.' },
  { who: 'you', step: '03', text: 'Can the bill print on our thermal printer?' },
  { who: 'dj', text: 'Done. Pushed tonight.' },
  { who: 'dj', step: '04', text: 'Shipped. The code, the data and the logins are yours.' },
];

export const compare: [string, string][] = [
  ['You talk to sales; someone else builds it.', 'You talk to the person writing the code.'],
  ['Weeks of calls before a single screen.', 'Working screens in week one.'],
  ['Retainers and surprise invoices.', 'Fixed scope, fixed price, paid by milestone.'],
  ['Paid tools you rent forever.', 'Lean, open-source stack. Low monthly bills.'],
  ['Code and data stay with them.', 'You own the code, the data and the accounts.'],
];

export const experience = [
  { role: 'Founder', org: 'Dhivio', note: 'Development & digital studio', dates: '[20XX]–Present', chips: ['Next.js', 'Node', 'PostgreSQL', 'Python'] },
  { role: 'Freelance developer & digital marketer', org: 'Clients in India and abroad', note: '', dates: '[20XX]–Present', chips: ['Web apps', 'SEO', 'Knowledge Panels'] },
];

export const education = [
  // TODO: confirm; inferred from your old site (NST / Rishihood email, 2024 batch)
  { role: 'B.Tech, Computer Science & AI', org: 'Newton School of Technology, Rishihood University', dates: '2024–2028' },
];

export const awards = [{ role: '1st place — Newton School MCP Challenge', org: 'NewtonClaw', dates: '[month year]' }];

export const internshipLine = 'Open to internships from [month] 2027.';

export const now = {
  building: '[what you are working on this month, one line]',
  lastShipped: '[project] · [date]',
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

## Services
${l(services.map((s) => `${s.name}: ${s.text}`))}
Pricing: ${prices.join('; ')}.

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
