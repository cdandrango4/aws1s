import type { IEmployeeRepository, EmployeeEntity, CreateEmployeeInput, UpdateEmployeeInput } from '../interfaces/employee-repository.interface';
export declare class MongoEmployeeRepository implements IEmployeeRepository {
    private mapDocumentToEntity;
    findAll(): Promise<EmployeeEntity[]>;
    findById(id: string): Promise<EmployeeEntity | null>;
    create(data: CreateEmployeeInput): Promise<EmployeeEntity>;
    update(id: string, data: UpdateEmployeeInput): Promise<EmployeeEntity | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=mongo-employee.repository.d.ts.map