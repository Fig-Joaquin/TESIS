import { z } from 'zod';

export const rolesSchema = z.object({
  Rol: z.string().min(1, 'El rol es obligatorio').max(50, 'El rol debe tener menos de 50 caracteres').transform((val) => val.toLowerCase()),
});

export type RolesSchema = z.infer<typeof rolesSchema>;
