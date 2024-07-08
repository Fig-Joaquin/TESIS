import { z } from 'zod';

export const detallePedidoSchema = z.object({
  ID_Pedido: z.number()
    .int('ID_Pedido debe ser un número entero')
    .positive('ID_Pedido debe ser un número positivo') //Estrictamente mayor a 0
    .min(1, 'ID_Pedido es obligatorio'), //Falta validacion para verificar que exista Pedido
  ID_Productos: z.number()
    .int('ID_Productos debe ser un número entero')
    .positive('ID_Productos debe ser un número positivo')
    .min(1, 'ID_Productos es obligatorio'), //Falta validacion para verificar que exista Producto
  Cantidad: z.number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser un número positivo')
    .min(1, 'Cantidad es obligatorio'),
  Precio_Total: z.number()
    .positive('El precio total debe ser un número positivo')
    .min(1, 'Precio_Total es obligatorio'), // Precio mínimo mayor a 0
  Descuento: z.number()
    .min(0, 'El descuento no puede ser negativo') //mayor o igual a 0
    .max(100, 'El descuento no puede ser mayor a 100')
});

export type DetallePedidoSchema = z.infer<typeof detallePedidoSchema>;
