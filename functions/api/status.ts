import { getStatus, json, type Env } from '../_lib.ts';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const res = json(await getStatus(env.STATUS));
  res.headers.set('cache-control', 'public, max-age=30');
  return res;
};
