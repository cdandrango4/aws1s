import { z } from 'zod';
export declare const createEmployeeSchema: z.ZodObject<{
    nombre: z.ZodString;
    cargo: z.ZodString;
    departamento: z.ZodString;
    sueldo: z.ZodNumber;
}, z.core.$strip>;
export declare const updateEmployeeSchema: z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    cargo: z.ZodOptional<z.ZodString>;
    departamento: z.ZodOptional<z.ZodString>;
    sueldo: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const employeeIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type EmployeeIdParamDto = z.infer<typeof employeeIdParamSchema>;
//# sourceMappingURL=employee.dto.d.ts.map