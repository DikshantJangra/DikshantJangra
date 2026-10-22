import { cookie } from '../_lib.ts';

export const onRequestGet: PagesFunction = () => new Response(null, { status: 302, headers: { location: '/#guestbook', 'set-cookie': cookie('session', '', 0) } });
