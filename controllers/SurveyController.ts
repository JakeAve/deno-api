import { RouterContext } from '../deps.ts';
import { Survey } from '../models/Survey.ts';
import {
  ApiErrorCodes,
  sendApiError,
  sendInternalServerError,
} from '../utils/sendApiError.ts';

export class SurveyController {
  async getAllForUser(ctx: RouterContext<any, any, any>) {
    try {
      const surveys = await Survey.findByUser(ctx.state.userId);

      ctx.response.status = 200;
      ctx.response.body = surveys.map((survey) => survey.toObject());
    } catch (err) {
      sendInternalServerError(ctx, err);
    }
  }

  async getSingle(ctx: RouterContext<any, any, any>) {
    try {
      const id = ctx.params.id;

      const survey = await Survey.findById(id);
      if (!survey) {
        return sendApiError(ctx, 404, {
          message: 'Survey not found',
          code: ApiErrorCodes.INVALID_SURVEY_ID,
        });
      }

      ctx.response.status = 200;
      ctx.response.body = survey.toObject();
    } catch (err) {
      sendInternalServerError(ctx, err);
    }
  }

  async create(ctx: RouterContext<any, any, any>) {
    try {
      const payload = await ctx.request.body().value;
      const { title, description } = payload;

      const survey = new Survey({
        title,
        description,
        creatorId: ctx.state.userId,
      });
      await survey.create();

      ctx.response.status = 201;
      ctx.response.body = survey.toObject();
    } catch (err) {
      sendInternalServerError(ctx, err);
    }
  }

  async update(ctx: RouterContext<any, any, any>) {
    try {
      const id = ctx.params.id;
      const payload = await ctx.request.body().value;
      const { title, description } = payload;

      const survey = await Survey.findById(id);
      if (!survey) {
        return sendApiError(ctx, 404, {
          message: 'Survey not found',
          code: ApiErrorCodes.INVALID_SURVEY_ID,
        });
      }

      await survey.update({ title, description });

      ctx.response.status = 200;
      ctx.response.body = survey.toObject();
    } catch (err) {
      sendInternalServerError(ctx, err);
    }
  }

  async delete(ctx: RouterContext<any, any, any>) {
    try {
      const id = ctx.params.id;

      const survey = await Survey.findById(id);
      if (!survey) {
        return sendApiError(ctx, 404, {
          message: 'Survey not found',
          code: ApiErrorCodes.INVALID_SURVEY_ID,
        });
      }

      await survey.delete();

      ctx.response.status = 204;
    } catch (err) {
      sendInternalServerError(ctx, err);
    }
  }
}

export const surveyController = new SurveyController();
