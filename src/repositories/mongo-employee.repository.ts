import type { IEmployeeRepository, EmployeeEntity, CreateEmployeeInput, UpdateEmployeeInput } from '../interfaces/employee-repository.interface';
import { EmployeeModel } from '../models/employee.model';
import type { IEmployeeDocument } from '../models/employee.model';

export class MongoEmployeeRepository implements IEmployeeRepository {
  private mapDocumentToEntity(doc: IEmployeeDocument): EmployeeEntity {
    return {
      _id: doc._id.toString(),
      nombre: doc.nombre,
      cargo: doc.cargo,
      departamento: doc.departamento,
      sueldo: doc.sueldo,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findAll(): Promise<EmployeeEntity[]> {
    const docs = await EmployeeModel.find().sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findById(id: string): Promise<EmployeeEntity | null> {
    const doc = await EmployeeModel.findById(id).exec();
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async create(data: CreateEmployeeInput): Promise<EmployeeEntity> {
    const newDoc = new EmployeeModel(data);
    const savedDoc = await newDoc.save();
    return this.mapDocumentToEntity(savedDoc);
  }

  async update(id: string, data: UpdateEmployeeInput): Promise<EmployeeEntity | null> {
    const updatedDoc = await EmployeeModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDoc) return null;
    return this.mapDocumentToEntity(updatedDoc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
