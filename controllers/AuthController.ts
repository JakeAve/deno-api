import { bcrypt, RouterContext } from '../deps.ts';
import { User, UserErrorCodes } from '../models/User.ts';
import {
  ApiErrorCodes,
  internalServerError,
  sendApiError,
} from '../utils/sendApiError.ts';
import { createJWT } from '../utils/jwt.ts';

export class AuthController {
  async login(ctx: RouterContext<any, any, any>) {
    try {
      const payload = await ctx.request.body().value;
      const { email, password } = payload;
      if (!email || !password) {
        return sendApiError(ctx, 400, {
          message: 'Email and password are required',
          code: ApiErrorCodes.EMAIL_AND_PASSWORD_REQUIRED,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return sendApiError(ctx, 400, {
          message: 'Invalid credentials',
          code: ApiErrorCodes.INVALID_CREDENTIALS,
        });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return sendApiError(ctx, 400, {
          message: 'Invalid credentials',
          code: ApiErrorCodes.INVALID_CREDENTIALS,
        });
      }

      const token = await createJWT(user.toObject());

      ctx.response.status = 200;
      ctx.response.body = {
        ...user.toObject(),
        token,
      };
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

      const token = await createJWT(user.toObject());

      ctx.response.status = 201;
      ctx.response.body = {
        ...user.toObject(),
        token,
      };
    } catch (err) {
      if (err.message.startsWith(UserErrorCodes.CREATE_USER_DUPLICATE_EMAIL)) {
        return sendApiError(ctx, 400, {
          message: 'Email is already registered',
          code: ApiErrorCodes.DUPLICATE_EMAIL_REGISTER,
        });
      }
      internalServerError(ctx, err);
    }
  }
}

export const authController = new AuthController();
