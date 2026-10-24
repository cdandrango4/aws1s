import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { MongoAuthRepository } from '../repositories/mongo-auth.repository';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { validateRequest } from '../../../middleware/validation.middleware';
import { LoginSchema } from '../dtos/auth.dto';

export const createAuthRouter = (
  repository: IAuthRepository = new MongoAuthRepository()
): Router => {
  const router = Router();
  const authController = new AuthController(repository);

  router.post('/login', validateRequest(LoginSchema), authController.login);

  return router;
};
