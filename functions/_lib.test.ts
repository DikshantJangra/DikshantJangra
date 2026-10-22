import assert from 'node:assert/strict';
import { parseCommand, takeQuota, PER_IP_DAILY, GLOBAL_DAILY } from './_lib.ts';

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
for (let ip = 0; ip < GLOBAL_DAILY; ip++) await takeQuota(kv, `ip${ip}`, 'd');
assert.equal(Number(store.get('ask:d:all')), GLOBAL_DAILY, 'global cap');

console.log('ok');
