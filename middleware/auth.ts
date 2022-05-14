import { RouterContext } from '../deps.ts';
import { User } from '../models/User.ts';
import { verifyJWT } from '../utils/jwt.ts';
import { invalidJWT } from '../utils/sendApiError.ts';

export const authMiddleware = async (
  ctx: RouterContext<any, any, any>,
  next: Function,
) => {
  const headers = ctx.request.headers;

  const authHeader = headers.get('Authorization');
  if (!authHeader) {
    return invalidJWT(ctx, new Error('Missing Authorization header'));
  }

  const jwt = authHeader.split(' ')[1];
  if (!jwt) return invalidJWT(ctx, new Error('Missing token'));

  try {
    const data = await verifyJWT(jwt);
    const user = await User.findOne({ email: data.email });
    ctx.state.user = user;
    ctx.state.userId = user?.id?.toString();
    await next();
  } catch {
    return invalidJWT(ctx, new Error('Invalid token'));
  }
};
