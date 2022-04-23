import { MongoClient } from "./deps.ts";
import { Env } from "./.env.ts";

const client = new MongoClient();
const uri = (await Deno.env.get(Env.MONGO_URI)) as string;
await client.connect(uri);

import { logStartupSequence, StartupSequence } from "./utils/logger.ts";
logStartupSequence(
  StartupSequence.DATABASE_CONNECTED,
  `at ${new URL(uri).host}`
);

const db = client.database("deno_survey");

export const usersCollection = db.collection("users");
