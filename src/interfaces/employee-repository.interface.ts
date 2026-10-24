export interface EmployeeEntity {
  _id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type CreateEmployeeInput = Omit<EmployeeEntity, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;
  findById(id: string): Promise<EmployeeEntity | null>;
  create(data: CreateEmployeeInput): Promise<EmployeeEntity>;
  update(id: string, data: UpdateEmployeeInput): Promise<EmployeeEntity | null>;
  delete(id: string): Promise<boolean>;
}
