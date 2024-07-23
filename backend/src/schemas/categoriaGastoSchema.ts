import { z } from 'zod';

export const categoriaGastoSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio').max(45, 'El nombre no puede exceder 45 caracteres')
});

export type CategoriaGastoSchema = z.infer<typeof categoriaGastoSchema>;
