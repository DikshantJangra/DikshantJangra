import { flags } from '../../src/data.ts';
import { fetchActivity } from '../../src/github.ts';
import { json, type Env } from '../_lib.ts';

// Fresh contribution calendar for the page. GitHub's response is edge-cached for an hour.
export const onRequestGet: PagesFunction<Env> = async () => {
  try {
    const data = await fetchActivity(flags.githubLogin, { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit);
    const res = json(data);
    res.headers.set('cache-control', 'public, max-age=600');
    return res;
  } catch {
    return json({ error: 'GitHub is unreachable.' }, 502);
  }
};
