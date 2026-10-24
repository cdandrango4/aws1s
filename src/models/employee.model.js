import { Schema, model } from 'mongoose';
const employeeSchema = new Schema({
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    departamento: { type: String, required: true, trim: true },
    sueldo: { type: Number, required: true }
}, {
    timestamps: true,
    versionKey: false
});
export const EmployeeModel = model('Empleado', employeeSchema);
//# sourceMappingURL=employee.model.js.map