import { profileText } from '../data';

export const GET = () => new Response(profileText(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
