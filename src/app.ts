import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createEmployeeRouter } from './routes/employee.routes';
import { errorHandler, AppError } from './middleware/error-handler.middleware';

export const createApp = (): Application => {
  const app = express();

  // Middlewares globales
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // Rutas de salud
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Rutas de Empleados (API v1 y alias)
  const employeeRouter = createEmployeeRouter();
  app.use('/api/v1/employees', employeeRouter);
  app.use('/api/employees', employeeRouter);
  app.use('/api/v1/empleados', employeeRouter);
  app.use('/api/empleados', employeeRouter);

  // Manejo de rutas inexistentes (404)
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
  });

  // Middleware global interceptor de errores (Response Wrapper)
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;