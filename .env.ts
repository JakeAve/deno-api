import { dotEnvConfigSync } from './deps.ts';

dotEnvConfigSync({ export: true, safe: true });

import { logStartupSequence, StartupSequence } from './utils/logger.ts';

logStartupSequence(StartupSequence.ENVIRONMENT_READY);

export enum Env {
  HOSTNAME = 'HOSTNAME',
  JWT_SECRET = 'JWT_SECRET',
  MONGO_URI = 'MONGO_URI',
  PORT = 'PORT',
}
