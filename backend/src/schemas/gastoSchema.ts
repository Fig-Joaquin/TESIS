import { z } from 'zod';
import { TipoTransaccion } from '../entities/transaccionEntity';

export const transaccionSchema = z.object({
  Fecha: z.string().refine((val) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!regex.test(val)) return false;
    const [day, month, year] = val.split('-').map(Number);
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime()) && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
  }, {
    message: 'Fecha inválida. Debe ser una fecha válida en formato dd-mm-yyyy.'
  }),
  Tipo: z.nativeEnum(TipoTransaccion),
  Monto: z.number().positive('El monto debe ser positivo').refine((val) => Number.isFinite(val), {
    message: 'El monto debe ser un número finito.'
  }),
  Descripcion: z.string()
  .max(255, 'La descripción no puede exceder 255 caracteres')
});

export const gastoSchema = z.object({
  Nombre_Gasto: z.string()
    .min(1, 'El nombre del gasto es obligatorio')
    .max(100, 'El nombre del gasto debe tener menos de 100 caracteres'),
  ID_Categoria_Gasto: z.number().positive('El ID de la categoría de gasto debe ser positivo')
});

export const gastoConTransaccionSchema = z.object({
  Fecha: transaccionSchema.shape.Fecha,
  Tipo: transaccionSchema.shape.Tipo,
  Monto: transaccionSchema.shape.Monto,
  Descripcion: transaccionSchema.shape.Descripcion,
  Nombre_Gasto: gastoSchema.shape.Nombre_Gasto,
  ID_Categoria_Gasto: gastoSchema.shape.ID_Categoria_Gasto
});
export const gastoSchemaActualizacion = z.object({
  Nombre_Gasto: gastoSchema.shape.Nombre_Gasto.optional(),
  ID_Categoria_Gasto: gastoSchema.shape.ID_Categoria_Gasto.optional(),
  Fecha: transaccionSchema.shape.Fecha.optional(),
  Tipo: transaccionSchema.shape.Tipo.optional(),
  Monto: transaccionSchema.shape.Monto.optional(),
  Descripcion: transaccionSchema.shape.Descripcion.optional()
}).describe("Esquema de validación para la actualización parcial de un gasto.");


export type GastoConTransaccionSchema = z.infer<typeof gastoConTransaccionSchema>;

