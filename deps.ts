export { configSync as dotEnvConfigSync } from 'https://deno.land/std@0.136.0/dotenv/mod.ts';
export { Application, Router } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
export type { RouterContext } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
export {
  Bson,
  MongoClient,
  ObjectId,
} from 'https://deno.land/x/mongo@v0.29.4/mod.ts';
export * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';
export * as djwt from 'https://deno.land/x/djwt@v2.4/mod.ts';

import { logStartupSequence, StartupSequence } from './utils/logger.ts';
logStartupSequence(StartupSequence.DEPENDENCIES_LOADED);
