import { dotEnvConfigSync } from "./deps.ts";

dotEnvConfigSync({ export: true, safe: true });

import { logStartupSequence, StartupSequence } from "./utils/logger.ts";

logStartupSequence(StartupSequence.ENVIRONMENT_READY);

export enum Env {
  HOSTNAME = "HOSTNAME",
  MONGO_URI = "MONGO_URI",
  PORT = "PORT",
}
