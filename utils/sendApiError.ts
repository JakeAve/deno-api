import { RouterContext } from "../deps.ts";

export enum ApiErrorCodes {
  DUPLICATE_EMAIL_REGISTER = "1",
  INTERNAL_SERVER_ERROR = "2",
  EMAIL_AND_PASSWORD_REQUIRED = "3",
  INVALID_CREDENTIALS = "4",
  INVALID_JWT = "5",
}

interface ApiErrorMessage {
  message: string;
  code: ApiErrorCodes;
}

export const sendApiError = (
  ctx: RouterContext<any, any, any>,
  status: number,
  message: ApiErrorMessage
) => {
  ctx.response.status = status;
  ctx.response.body = message;
};

export const sendInternalServerError = (
  ctx: RouterContext<any, any, any>,
  error: Error
) => {
  console.error(error);
  sendApiError(ctx, 500, {
    message: "Internal server error",
    code: ApiErrorCodes.INTERNAL_SERVER_ERROR,
  });
};

export const invalidJWT = (ctx: RouterContext<any, any, any>, error: Error) => {
  console.error(error);
  sendApiError(ctx, 401, {
    message: "Unauthorized",
    code: ApiErrorCodes.INVALID_JWT,
  });
};
