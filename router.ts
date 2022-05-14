import { Router } from './deps.ts';
import { authController } from './controllers/AuthController.ts';
import { surveyController } from './controllers/SurveyController.ts';
import { authMiddleware } from './middleware/auth.ts';

export const router = new Router();

router
  .get('/test', (ctx) => {
    ctx.response.body = 'Hello World!';
  })
  .post('/api/login', authController.login)
  .post('/api/register', authController.register)
  .get('/api/surveys', authMiddleware, surveyController.getAllForUser)
  .get('/api/surveys/:id', authMiddleware, surveyController.getSingle)
  .post('/api/surveys', authMiddleware, surveyController.create)
  .put('/api/surveys/:id', authMiddleware, surveyController.update)
  .delete('/api/surveys/:id', authMiddleware, surveyController.delete);
