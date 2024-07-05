import { z } from 'zod';

export const rolUsuarioSchema = z.object({
  ID_Usuario: z.number().int('ID_Usuario debe ser un número entero'),
  ID_Rol: z.number().int('ID_Rol debe ser un número entero'),
});

export type RolUsuarioSchema = z.infer<typeof rolUsuarioSchema>;
