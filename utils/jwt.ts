import { djwt } from '../deps.ts';
import { Env } from '../.env.ts';

const JWT_SECRET = Deno.env.get(Env.JWT_SECRET)!;
const key = await crypto.subtle.importKey(
  'jwk',
  JSON.parse(JWT_SECRET),
  { name: 'HMAC', hash: 'SHA-512' },
  true,
  ['sign', 'verify'],
);
const ISS = 'survey-app';

const { create, verify, decode } = djwt;

export const createJWT = (payload: object) => {
  const exp = new Date().getTime() + 60 * 60 * 1000;
  return create(
    { alg: 'HS512', typ: 'JWT' },
    { ...payload, exp, iss: ISS },
    key,
  );
};

export const verifyJWT = async (token: string) => {
  const data = await verify(token, key);
  if (data.iss !== ISS) throw new Error('Invalid issuer');
  if (data.exp! < new Date().getTime()) throw new Error('Expired token');
  return data;
};

export const decodeJWT = (token: string) => decode(token);
