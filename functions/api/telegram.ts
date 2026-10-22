import { getStatus, parseCommand, HELP, json, type Env } from '../_lib.ts';

// Telegram webhook. Replies go back in the webhook response body, so no bot token is needed here.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.TELEGRAM_SECRET || request.headers.get('x-telegram-bot-api-secret-token') !== env.TELEGRAM_SECRET) return new Response('forbidden', { status: 403 });
  const update = await request.json<{ message?: { chat: { id: number }; text?: string } }>().catch(() => null);
  const msg = update?.message;
  if (!msg?.text || String(msg.chat.id) !== env.TELEGRAM_CHAT_ID) return new Response(null, { status: 200 });

  const reply = (text: string) => json({ method: 'sendMessage', chat_id: msg.chat.id, text });
  const patch = parseCommand(msg.text);
  if (patch) {
    const next = { ...(await getStatus(env.STATUS)), ...patch };
    if (!env.STATUS) return reply('KV not bound yet.');
    await env.STATUS.put('status', JSON.stringify(next));
    return reply(`Updated.\n${JSON.stringify(next, null, 2)}`);
  }
  if (msg.text.startsWith('/show')) return reply(JSON.stringify(await getStatus(env.STATUS), null, 2));
  return reply(HELP);
};
