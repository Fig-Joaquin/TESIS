import { z } from 'zod';

export const usuarioSchema = z.object({
  Rut_Persona: z.string().min(1, 'El RUT es obligatorio'),
  Contrasenia: z.string().min(1, { message: "El campo no puede estar vacío" }),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
