import { McpServer, createMcpHandler, originValidationResponse } from '@modelcontextprotocol/server';
import { site, links, work, lab, services, experience, education, awards, profileText } from '../src/data.ts';
import { getStatus, type Env } from './_lib.ts';

const text = (data: unknown) => ({ content: [{ type: 'text' as const, text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] });
const readOnly = { readOnlyHint: true, openWorldHint: false };

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  // Public, read-only server. Origin check per spec; non-browser clients send no Origin.
  const rejected = originValidationResponse(request, [new URL(site.url).hostname, 'localhost', '127.0.0.1']);
  if (rejected) return rejected;

  const handler = createMcpHandler(() => {
    const s = new McpServer({ name: 'dikshantjangra', version: '1.0.0' });
    s.registerTool('get_profile', { title: 'Profile', description: `Full profile of ${site.name} (DJ): bio, work, services, experience, contact.`, annotations: readOnly }, async () => text(profileText()));
    s.registerTool('list_projects', { title: 'Projects', description: 'Projects DJ has built or is building, with status tags and stack.', annotations: readOnly }, async () => text({ work, lab }));
    s.registerTool('get_services', { title: 'Focus areas', description: 'What DJ works on: AI agents, backends and product engineering.', annotations: readOnly }, async () => text({ services }));
    s.registerTool('get_experience', { title: 'Experience', description: 'Roles, education and awards.', annotations: readOnly }, async () => text({ experience, education, awards }));
    s.registerTool('how_to_hire', { title: 'Availability & contact', description: "DJ's live availability and how to book a call or reach DJ.", annotations: readOnly }, async () => {
      const st = await getStatus(env.STATUS);
      return text({ availability: st.pill, available: st.available, building: st.building, bookCall: links.cal, email: links.email, ...(links.whatsapp && { whatsapp: `https://wa.me/${links.whatsapp}` }) });
    });
    return s;
  });
  return handler.fetch(request);
};
