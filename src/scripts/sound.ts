// UI sounds + haptics. Off by default; toggled from the palette / terminal.
let ctx: AudioContext | undefined;
export const soundOn = () => localStorage.getItem('sound') === 'on';

export function toggleSound(): boolean {
  const on = !soundOn();
  localStorage.setItem('sound', on ? 'on' : 'off');
  if (on) blip(880);
  return on;
}

export function blip(freq = 660, ms = 40) {
  if (!soundOn()) return;
  navigator.vibrate?.(8);
  ctx ??= new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + ms / 1000);
}

document.addEventListener('click', (e) => (e.target as Element).closest('a, button') && blip());
