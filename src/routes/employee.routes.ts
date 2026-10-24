import { Router } from 'express';
import type { IEmployeeRepository } from '../interfaces/employee-repository.interface';
import { EmployeeController } from '../controllers/employee.controller';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository';
import { validateRequest } from '../middleware/validation.middleware';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdParamSchema
} from '../dto/employee.dto';

export const createEmployeeRouter = (
  repository: IEmployeeRepository = new MongoEmployeeRepository()
): Router => {
  const router = Router();
  const controller = new EmployeeController(repository);

  router.get('/', controller.getAll);

  router.get(
    '/:id',
    validateRequest(employeeIdParamSchema, 'params'),
    controller.getById
  );

  router.post(
    '/',
    validateRequest(createEmployeeSchema, 'body'),
    controller.create
  );

  router.put(
    '/:id',
    validateRequest(employeeIdParamSchema, 'params'),
    validateRequest(updateEmployeeSchema, 'body'),
    controller.update
  );

  router.delete(
    '/:id',
    validateRequest(employeeIdParamSchema, 'params'),
    controller.delete
  );

  return router;
};
