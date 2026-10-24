import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string({ error: 'El email es requerido' }).email('El email no es válido'),
  password: z
    .string({ error: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type LoginDto = z.infer<typeof LoginSchema>;
