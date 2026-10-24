import { z } from 'zod';
export const createEmployeeSchema = z.object({
    nombre: z
        .string({ required_error: 'El nombre es obligatorio' })
        .trim()
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        .max(100, { message: 'El nombre no puede exceder los 100 caracteres' }),
    cargo: z
        .string({ required_error: 'El cargo es obligatorio' })
        .trim()
        .min(3, { message: 'El cargo debe tener al menos 3 caracteres' })
        .max(100, { message: 'El cargo no puede exceder los 100 caracteres' }),
    departamento: z
        .string({ required_error: 'El departamento es obligatorio' })
        .trim()
        .min(3, { message: 'El departamento debe tener al menos 3 caracteres' })
        .max(100, { message: 'El departamento no puede exceder los 100 caracteres' }),
    sueldo: z
        .number({ required_error: 'El sueldo es obligatorio', invalid_type_error: 'El sueldo debe ser un número' })
        .positive({ message: 'El sueldo debe ser una cantidad positiva mayor a 0' })
});
export const updateEmployeeSchema = createEmployeeSchema.partial();
export const employeeIdParamSchema = z.object({
    id: z
        .string({ required_error: 'El identificador es obligatorio' })
        .regex(/^[0-9a-fA-F]{24}$/, {
        message: 'El identificador proporcionado no es un ObjectId de MongoDB válido'
    })
});
//# sourceMappingURL=employee.dto.js.map