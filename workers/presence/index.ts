import { DurableObject } from 'cloudflare:workers';

const MAX = 100;

// One room for the whole site. Hibernating WebSockets: idle visitors cost nothing.
export class Presence extends DurableObject {
  private last = new WeakMap<WebSocket, number>(); // per-socket throttle; resets on hibernation, which is fine

  async fetch(req: Request): Promise<Response> {
    const open = this.ctx.getWebSockets();
    if (req.headers.get('upgrade') !== 'websocket') return Response.json({ here: open.length });
    if (open.length >= MAX) return new Response('room full', { status: 503 });

    const { 0: client, 1: server } = new WebSocketPair();
    const id = crypto.randomUUID().slice(0, 8);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id });
    server.send(JSON.stringify({ type: 'hello', id }));
    this.broadcast({ type: 'count', here: open.length + 1 });
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws: WebSocket, msg: string | ArrayBuffer) {
    if (typeof msg !== 'string' || msg.length > 100) return;
    const t = Date.now();
    if (t - (this.last.get(ws) ?? 0) < 40) return;
    this.last.set(ws, t);
    let m: { x?: unknown; y?: unknown };
    try {
      m = JSON.parse(msg);
    } catch {
      return;
    }
    const { x, y } = m;
    // x: px offset from page centre, y: px from document top
    if (typeof x !== 'number' || typeof y !== 'number' || Math.abs(x) > 4000 || y < 0 || y > 50000) return;
    const { id } = ws.deserializeAttachment() as { id: string };
    this.broadcast({ type: 'cursor', id, x: Math.round(x), y: Math.round(y) }, ws);
  }

  webSocketClose(ws: WebSocket, code: number) {
    const { id } = ws.deserializeAttachment() as { id: string };
    try {
      ws.close(code === 1005 ? 1000 : code);
    } catch {}
    this.broadcast({ type: 'leave', id }, ws);
    this.broadcast({ type: 'count', here: this.ctx.getWebSockets().filter((w) => w !== ws).length }, ws);
  }

  webSocketError(ws: WebSocket) {
    this.webSocketClose(ws, 1011);
  }

  private broadcast(data: object, except?: WebSocket) {
    const s = JSON.stringify(data);
    for (const w of this.ctx.getWebSockets()) if (w !== except) try { w.send(s); } catch {}
  }
}

export default { fetch: () => new Response('Presence lives behind dikshantjangra.me/api/presence', { status: 404 }) };
