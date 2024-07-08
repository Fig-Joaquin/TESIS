import { z } from 'zod';

export const pedidoSchema = z.object({
  ID_Cliente: z.number()
    .int('ID_Cliente debe ser un número entero')
    .positive('ID_Cliente debe ser un número positivo')
    .min(1, 'ID_Pedido es obligatorio'), //Falta validación para verificar que exista Cliente
  ID_Proveedor: z.number()
    .int('ID_Proveedor debe ser un número entero')
    .positive('ID_Proveedor debe ser un número positivo')
    .min(1, 'ID_Pedido es obligatorio'), //Falta validación para verificar que exista Proveedor
  Tipo_Pedido: z.string()
    .min(1, 'El tipo de pedido es obligatorio')
    .max(50, 'El tipo de pedido debe tener menos de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'), //*Definir valores fijos?
  Fecha_Pedido: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de pedido debe tener el formato YYYY-MM-DD'),
  Fecha_Entrega: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de entrega debe tener el formato YYYY-MM-DD'),
  Comentarios: z.string()
    .max(255, 'Los comentarios deben tener menos de 255 caracteres')
    .optional(),
  Estado: z.enum(['entregado', 'sin entregar', 'pendiente']).refine((val) => ['entregado', 'sin entregar', 'pendiente'].includes(val), { //validacion personalizada con .refine
    message: 'El estado debe ser "entregado", "sin entregar" o "pendiente"',
    }),
});

export type PedidoSchema = z.infer<typeof pedidoSchema>;
