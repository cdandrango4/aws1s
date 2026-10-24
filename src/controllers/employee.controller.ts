import type { Request, Response, NextFunction } from 'express';
import type { IEmployeeRepository } from '../interfaces/employee-repository.interface';
import { ApiResponseHelper } from '../shared/api-response';
import { AppError } from '../middleware/error-handler.middleware';

export class EmployeeController {
  constructor(private readonly repository: IEmployeeRepository) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employees = await this.repository.findAll();
      res.status(200).json(
        ApiResponseHelper.success(employees, 'Lista de empleados recuperada correctamente')
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employee = await this.repository.findById(id!);
      if (!employee) {
        throw new AppError(`No se encontró el empleado con identificador: ${id}`, 404, 'EMPLOYEE_NOT_FOUND');
      }
      res.status(200).json(
        ApiResponseHelper.success(employee, 'Empleado recuperado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newEmployee = await this.repository.create(req.body);
      res.status(201).json(
        ApiResponseHelper.success(newEmployee, 'Empleado registrado correctamente')
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.repository.update(id!, req.body);
      if (!updated) {
        throw new AppError(`No se encontró el empleado para actualizar con identificador: ${id}`, 404, 'EMPLOYEE_NOT_FOUND');
      }
      res.status(200).json(
        ApiResponseHelper.success(updated, 'Empleado actualizado correctamente')
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.repository.delete(id!);
      if (!deleted) {
        throw new AppError(`No se encontró el empleado para eliminar con identificador: ${id}`, 404, 'EMPLOYEE_NOT_FOUND');
      }
      res.status(200).json(
        ApiResponseHelper.success({ id }, 'Empleado eliminado correctamente')
      );
    } catch (error) {
      next(error);
    }
  };
}
