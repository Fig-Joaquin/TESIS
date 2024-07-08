import { z } from 'zod';

export const registroPreciosSchema = z.object({
  ID_Producto: z.number()
    .int('ID_Producto debe ser un número entero')
    .positive('ID_Producto debe ser un número positivo')
    .min(1, 'ID_Producto es obligatorio'),
  Fecha_Fin: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de fin debe tener el formato YYYY-MM-DD'),
    //.min(1, 'La fecha de fin es obligatoria'),                                         //No es obligatoria ya que si el precio es actual, aún no tiene fecha de fin
  Fecha_Creacion: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de creación debe tener el formato YYYY-MM-DD')
    .min(1, 'La fecha de creación es obligatoria'), //Validacion para que la fecha sea automatica
  Precio_Neto: z.number()
    .int('El precio neto debe ser un número entero')
    .positive('El precio neto debe ser un número positivo')
    .min(1, 'El precio neto es obligatorio'),
  Precio_Venta: z.number()
    .int('El precio de venta debe ser un número entero')
    .positive('El precio de venta debe ser un número positivo')
    .min(1, 'El precio de venta es obligatorio')
});

export type RegistroPreciosSchema = z.infer<typeof registroPreciosSchema>;