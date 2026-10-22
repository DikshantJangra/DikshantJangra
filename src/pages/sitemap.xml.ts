import { site } from '../data';

export const GET = () =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}/</loc></url><url><loc>${site.url}/resume</loc></url><url><loc>${site.url}/line</loc></url></urlset>`, { headers: { 'content-type': 'application/xml' } });
