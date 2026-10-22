import assert from 'node:assert/strict';
import { parseCommand, takeQuota, signSession, readSession, PER_IP_DAILY, GLOBAL_DAILY } from './_lib.ts';
import { toCard } from './api/enrich.ts';

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
assert.equal(await takeQuota(kv, 'a', 'd', 'enrich'), true);

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

// Enrichment parsing: tolerates prose around JSON, clamps fields, rejects junk
const card = toCard('Sure! {"title":"Classmate Notebook","brand":"Classmate","category":"Paper & Notebooks","attributes":{"Pages":"172","Ruling":"Single line","x":""},"description":"A sturdy single-line notebook."} hope that helps');
assert.deepEqual(card?.attributes, { Pages: '172', Ruling: 'Single line' });
assert.equal(card?.brand, 'Classmate');
assert.equal(toCard('no json here'), null);
assert.equal(toCard('{"title":"","description":"x"}'), null);

console.log('ok');
