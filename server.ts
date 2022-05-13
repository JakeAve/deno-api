import { Application } from "./deps.ts";
import { router } from "./router.ts";
import { Env } from "./.env.ts";
import { logStartupSequence, StartupSequence } from "./utils/logger.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  logStartupSequence(
    StartupSequence.LISTENING_FOR_REQUESTS,
    `on ${secure ? "https://" : "http://"}${hostname || "localhost"}:${port}`
  );
});

const port = Number(Deno.env.get(Env.PORT))!;
const hostname = Deno.env.get(Env.HOSTNAME)!;

await app.listen({ port, hostname });
