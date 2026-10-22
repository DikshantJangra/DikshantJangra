import assert from 'node:assert/strict';
import { parseContributions } from '../src/github.ts';
import { parseCommand, takeQuota, signSession, readSession, safeNext, cleanMessage, passNo, PER_IP_DAILY, GLOBAL_DAILY } from './_lib.ts';

assert.deepEqual(parseCommand('/status booked January'), { available: false, pill: 'Booked till January' });
assert.deepEqual(parseCommand('/status open Taking 1 project for Jan'), { available: true, pill: 'Taking 1 project for Jan' });
assert.deepEqual(parseCommand('/status open'), { available: true, pill: 'Available for projects' });
assert.deepEqual(parseCommand('/now   BlazeEats kitchen screens'), { building: 'BlazeEats kitchen screens' });
assert.equal(parseCommand('/status booked'), null);
assert.equal(parseCommand('/now'), null);
assert.equal(parseCommand('hello'), null);

const store = new Map<string, string>();
const kv = { get: async (k: string) => store.get(k) ?? null, put: async (k: string, v: string) => void store.set(k, v) } as unknown as KVNamespace;
for (let i = 0; i < PER_IP_DAILY; i++) assert.equal(await takeQuota(kv, 'a', 'd'), true);
assert.equal(await takeQuota(kv, 'a', 'd'), false, 'per-IP cap');
assert.equal(await takeQuota(undefined, 'a', 'd'), false, 'no KV fails closed');
for (let ip = 0; ip < GLOBAL_DAILY; ip++) await takeQuota(kv, `ip${ip}`, 'd');
assert.equal(Number(store.get('ask:d:all')), GLOBAL_DAILY, 'global cap');

// Separate buckets don't share quota
assert.equal(await takeQuota(kv, 'a', 'd', 'other'), true);

// Session cookie: round-trips, rejects tampering, wrong secret and expiry
const tok = await signSession({ login: 'dj', avatar: 'x', exp: 2000 }, 's3cret');
assert.equal((await readSession(`foo=1; session=${tok}`, 's3cret', 1000))?.login, 'dj');
assert.equal(await readSession(`session=${tok}`, 'other', 1000), null);
assert.equal(await readSession(`session=${tok}`, 's3cret', 3000), null, 'expired');
const [body, sig] = tok.split('.');
const forged = btoa(JSON.stringify({ login: 'DikshantJangra', avatar: 'x', exp: 2000 })).replace(/=+$/, '');
assert.equal(await readSession(`session=${forged}.${sig}`, 's3cret', 1000), null, 'forged body');
assert.equal(await readSession(`session=${body}`, 's3cret', 1000), null, 'no sig');
assert.equal(await readSession(null, 's3cret'), null);

// GitHub calendar: counts come from tooltips matched by id, days sorted by date
const gh = parseContributions(`<h2>
  1,234 contributions
  in 2026</h2><td data-date="2026-01-02" id="d1" data-level="2" class="ContributionCalendar-day"></td><td data-date="2026-01-01" id="d0" data-level="0"></td>
<tool-tip for="d1" class="sr-only">12 contributions on January 2nd.</tool-tip><tool-tip for="d0">No contributions on January 1st.</tool-tip>`);
assert.equal(gh.total, 1234);
assert.deepEqual(gh.days, [{ date: '2026-01-01', level: 0, count: 0 }, { date: '2026-01-02', level: 2, count: 12 }]);

// Sign-in return path: same-site paths only
assert.equal(safeNext('/line'), '/line');
assert.equal(safeNext('//evil.com'), '/#guestbook');
assert.equal(safeNext('/\\evil.com'), '/#guestbook');
assert.equal(safeNext('https://evil.com'), '/#guestbook');
assert.equal(safeNext(null), '/#guestbook');
assert.equal(safeNext('/\t/evil.com'), '/#guestbook');
assert.equal(safeNext('/line?thread=a#x'), '/line?thread=a#x');

// Direct line messages and passes
assert.equal(cleanMessage('  hi\r\n\n\n\nthere  '), 'hi\n\nthere');
assert.equal(cleanMessage('   '), '');
assert.equal(cleanMessage(42), '');
assert.equal(passNo(4), 'No. 00004');

console.log('ok');
