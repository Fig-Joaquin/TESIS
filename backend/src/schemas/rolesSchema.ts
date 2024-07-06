import { z } from 'zod';

export const rolesSchema = z.object({
  Rol: z.string()
    .min(1, 'El rol es obligatorio')
    .max(25, 'El rol debe tener menos de 50 caracteres')
    .regex(/^[a-zA-Z_]+$/, 'El nombre del rol solo puede contener letras y el guion bajo')
    .transform((val) => val.toLowerCase()),
});

export type RolesSchema = z.infer<typeof rolesSchema>;
