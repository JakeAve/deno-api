import { RouterContext, bcrypt } from "../deps.ts";
import { User, UserErrorCodes } from "../models/User.ts";
import {
  sendApiError,
  ApiErrorCodes,
  internalServerError,
} from "../utils/sendApiError.ts";

export class AuthController {
  async login(ctx: RouterContext<any, any, any>) {
    try {
      const payload = await ctx.request.body().value;
      const { email, password } = payload;
      if (!email || !password)
        return sendApiError(ctx, 400, {
          message: "Email and password are required",
          code: ApiErrorCodes.EMAIL_AND_PASSWORD_REQUIRED,
        });

      const user = await User.findOne({ email });
      if (!user)
        return sendApiError(ctx, 400, {
          message: "Invalid credentials",
          code: ApiErrorCodes.INVALID_CREDENTIALS,
        });

      const isValid = await bcrypt.compare(password, user.password);
      console.table({
        isValid,
        email,
        password,
        user,
        toObject: user.toObject(),
      });
      if (!isValid)
        return sendApiError(ctx, 400, {
          message: "Invalid credentials",
          code: ApiErrorCodes.INVALID_CREDENTIALS,
        });

      ctx.response.status = 200;
      ctx.response.body = user.toObject();
    } catch (err) {
      internalServerError(ctx, err);
    }
  }
  async register(ctx: RouterContext<any, any, any>) {
    try {
      const payload = await ctx.request.body().value;

      const password = await bcrypt.hash(payload.password);
      const user = new User({ ...payload, password });
      await user.create();

      ctx.response.status = 201;
      ctx.response.body = user.toObject();
    } catch (err) {
      if (err.message.startsWith(UserErrorCodes.CREATE_USER_DUPLICATE_EMAIL)) {
        sendApiError(ctx, 400, {
          message: "Email is already registered",
          code: ApiErrorCodes.DUPLICATE_EMAIL_REGISTER,
        });
        return;
      }
      internalServerError(ctx, err);
    }
  }
}

export const authController = new AuthController();
