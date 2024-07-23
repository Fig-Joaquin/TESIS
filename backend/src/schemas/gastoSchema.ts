import { z } from 'zod';

export const gastoSchema = z.object({
  ID_Transaccion: z.number().int().positive('El ID de la transacción debe ser un número positivo'),
  Nombre_Gasto: z.string().min(1, 'El nombre del gasto es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  ID_Categoria_Gasto: z.number().int().positive('El ID de la categoría del gasto debe ser un número positivo')
});

export type GastoSchema = z.infer<typeof gastoSchema>;
