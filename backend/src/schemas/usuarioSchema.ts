import { z } from 'zod';

export const usuarioSchema = z.object({
    ID_Usuario: z.number().optional(),
    Rut_Persona: z.string(),
    Rol_Usuario: z.enum(['gerente', 'administrativo', 'jefe_administrativo', 'jefe_inventario', 'inventarista']),
    Password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type Usuario = z.infer<typeof usuarioSchema>;
