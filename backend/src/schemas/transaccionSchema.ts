import { z } from 'zod';
import { TipoTransaccion } from '../entities/transaccionEntity';

// Validador de fecha en formato dd-mm-yyyy
const fechaSchema = z.string().refine((val) => {
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!regex.test(val)) return false;
  const [day, month, year] = val.split('-').map(Number);
  const date = new Date(`${year}-${month}-${day}`);
  return !isNaN(date.getTime()) && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
}, {
  message: 'Fecha inválida. Debe ser una fecha válida en formato dd-mm-yyyy.'
});

// Validador de descripción, permitiendo nulo
const descripcionSchema = z.string()
  .min(1, 'La descripción es obligatoria')
  .max(255, 'La descripción no puede exceder 255 caracteres')
  .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.!? ]*$/, 'La descripción contiene caracteres inválidos')
  .nullable();

export const transaccionSchemaRegistro = z.object({
  Fecha: fechaSchema,
  Tipo: z.nativeEnum(TipoTransaccion),
  Monto: z.number().positive('El monto debe ser positivo').refine((val) => Number.isFinite(val), {
    message: 'El monto debe ser un número finito.'
  }),
  Descripcion: descripcionSchema.optional() // Permite nulo
});

export type TransaccionRegistroSchema = z.infer<typeof transaccionSchemaRegistro>;
export const transaccionSchemaActualizacion = transaccionSchemaRegistro.partial();
