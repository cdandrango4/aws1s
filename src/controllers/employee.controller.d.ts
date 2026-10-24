import type { Request, Response, NextFunction } from 'express';
import type { IEmployeeRepository } from '../interfaces/employee-repository.interface';
export declare class EmployeeController {
    private readonly repository;
    constructor(repository: IEmployeeRepository);
    getAll: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=employee.controller.d.ts.map