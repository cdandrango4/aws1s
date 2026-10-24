import type { Document } from 'mongoose';
export interface IEmployeeDocument extends Document {
    nombre: string;
    cargo: string;
    departamento: string;
    sueldo: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const EmployeeModel: import("mongoose").Model<IEmployeeDocument, {}, {}, {}, Document<unknown, {}, IEmployeeDocument, {}, import("mongoose").DefaultSchemaOptions> & IEmployeeDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEmployeeDocument>;
//# sourceMappingURL=employee.model.d.ts.map