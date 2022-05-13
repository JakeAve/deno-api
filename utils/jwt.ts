import { djwt } from "../deps.ts";
import { Env } from "../.env.ts";

const JWT_SECRET = Deno.env.get(Env.JWT_SECRET)!;
const key = await crypto.subtle.importKey(
  "jwk",
  JSON.parse(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);
const ISS = "survey-app";

const { create, verify, decode } = djwt;

export const createJWT = (payload: object) => {
  const exp = new Date().getTime() + 60 * 60 * 1000;
  return create(
    { alg: "HS512", typ: "JWT" },
    { ...payload, exp, iss: ISS },
    key
  );
};

export const verifyJWT = (token: string) => {
  return verify(token, key);
};

export const decodeJWT = (token: string) => decode(token);
