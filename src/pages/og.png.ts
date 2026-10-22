// Build-time OG image from src/data.ts (satori → SVG → PNG). Rebuilds whenever the data or avatar changes.
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../data';

const font = (w: number) => readFileSync(`node_modules/@fontsource/geist/files/geist-latin-${w}-normal.woff`);
const avatar = `data:image/jpeg;base64,${readFileSync('public/avatar.jpg').toString('base64')}`;
const h = (type: string, style: object, children?: unknown) => ({ type, props: { style, children } });

export async function GET() {
  const svg = await satori(
    h('div', { width: 1200, height: 630, display: 'flex', alignItems: 'center', gap: 56, padding: '0 96px', background: '#FBFBFA', color: '#111', fontFamily: 'Geist', position: 'relative' }, [
      { type: 'img', props: { src: avatar, width: 220, height: 220, style: { borderRadius: 999, objectFit: 'cover' } } },
      h('div', { display: 'flex', flexDirection: 'column', flex: 1 }, [
        h('div', { fontSize: 64, fontWeight: 600, letterSpacing: -1.5 }, site.name),
        h('div', { fontSize: 34, color: '#6B6B6B', marginTop: 16, lineHeight: 1.3 }, site.oneLiner),
      ]),
      h('div', { position: 'absolute', left: 96, bottom: 48, fontSize: 22, letterSpacing: 2, color: '#FF5A1F' }, new URL(site.url).hostname.toUpperCase()),
    ]),
    { width: 1200, height: 630, fonts: [{ name: 'Geist', data: font(400), weight: 400 }, { name: 'Geist', data: font(600), weight: 600 }] },
  );
  return new Response(new Uint8Array(new Resvg(svg).render().asPng()), { headers: { 'content-type': 'image/png' } });
}
