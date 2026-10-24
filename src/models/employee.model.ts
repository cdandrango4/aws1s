import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

export interface IEmployeeDocument extends Document {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const employeeSchema = new Schema<IEmployeeDocument>(
  {
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    departamento: { type: String, required: true, trim: true },
    sueldo: { type: Number, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const EmployeeModel = model<IEmployeeDocument>('Empleado', employeeSchema);
