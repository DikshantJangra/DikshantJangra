import { cookie, safeNext } from '../_lib.ts';

export const onRequestGet: PagesFunction = ({ request }) =>
  new Response(null, { status: 302, headers: { location: safeNext(new URL(request.url).searchParams.get('next')), 'set-cookie': cookie('session', '', 0) } });
