import { Router } from "./deps.ts";
import { authController } from "./controllers/AuthController.ts";

export const router = new Router();

router
  .get("/test", (ctx) => {
    ctx.response.body = "Hello World!";
  })
  .post("/api/login", authController.login)
  .post("/api/register", authController.register);
