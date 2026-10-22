import { site, links, work, lab, services, now } from '../data';
import { toggleSound } from './sound';

const dlg = document.getElementById('term') as HTMLDialogElement;
const out = document.getElementById('term-out')!;
const input = document.getElementById('term-in') as HTMLInputElement;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const commands: Record<string, (arg: string) => string> = {
  help: () => 'whoami  ls [projects|lab]  cat <project>  focus  now  contact  hire dj  sound  theme  clear  exit',
  whoami: () => `${site.name} (${site.short}), ${site.age}, ${site.location}.\n${site.oneLiner}`,
  ls: (a) => (a === 'lab' ? lab : work).map((p) => slug(p.name)).join('  '),
  cat: (a) => {
    const p = [...work, ...lab].find((x) => slug(x.name) === slug(a));
    if (!p) return `cat: ${a || '<project>'}: No such project. Try: ls`;
    return 'detail' in p ? `${p.name} [${p.tags.join(', ')}]\n${p.oneLiner}\n${p.detail}\nstack: ${p.stack.join(', ')}` : `${p.name} [${p.tag}]\n${p.text}`;
  },
  focus: () => services.map((s) => `- ${s.name}`).join('\n'),
  now: () => `building: ${document.getElementById('now-building')?.textContent ?? now.building}`,
  contact: () => `email  ${links.email}\ncall   ${links.cal}\ngithub ${links.github}`,
  hire: (a) => (a === 'dj' ? (setTimeout(() => (location.href = links.resume), 600), 'Opening resume… good choice.') : 'hire: who? Try: hire dj'),
  sound: () => `sounds ${toggleSound() ? 'on' : 'off'}`,
  theme: () => (document.getElementById('theme')?.click(), 'theme toggled'),
  sudo: () => 'Nice try.',
  clear: () => ((out.textContent = ''), ''),
  exit: () => (dlg.close(), ''),
};

const print = (s: string) => {
  out.textContent += s + '\n';
  out.scrollTop = out.scrollHeight;
};

export function openTerminal() {
  if (!out.textContent) print(`DJ shell. Type 'help'.`);
  dlg.showModal();
  input.focus();
}

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const line = input.value.trim();
  input.value = '';
  print(`$ ${line}`);
  if (!line) return;
  const [cmd, ...rest] = line.split(/\s+/);
  const fn = commands[cmd.toLowerCase()];
  const res = fn ? fn(rest.join(' ')) : `${cmd}: command not found. Try 'help'.`;
  if (res) print(res);
});

addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement;
  if (e.key === '`' && !dlg.open && !t.closest('input, textarea, [contenteditable]')) {
    e.preventDefault();
    openTerminal();
  }
});
dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
