import { z } from 'zod';

export const productoSchema = z.object({
  ID_Proveedor: z.number()
    .int('ID_Proveedor debe ser un número entero')
    .positive('ID_Proveedor debe ser un número positivo')
    .min(1, 'ID_Proveedor es obligatorio'), //Falta validación para verificar que exista Proveedor
  ID_Categoria: z.number()
    .int('ID_Categoria debe ser un número entero')
    .positive('ID_Categoria debe ser un número positivo')
    .min(1, 'ID_Categoria es obligatorio'), //Falta validación para verificar que exista Categoria
  ID_Bodega: z.number()
    .int('ID_Bodega debe ser un número entero')
    .positive('ID_Bodega debe ser un número positivo')
    .min(1, 'ID_Bodega es obligatorio'), //Falta validación para verificar que exista Bodega
  Nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  Descripcion: z.string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción debe tener menos de 500 caracteres')
    .regex(/^[a-zA-Z0-9-\s]+$/, 'La descripcion solo puede contener letras, números, guiones y espacios'),
  Precio_Neto: z.number()
    .int('El precio neto debe ser un número entero')
    .positive('El precio neto debe ser un número positivo')
    .min(1, 'El precio neto es obligatorio'),
  Precio_Venta: z.number()
    .int('El precio de venta debe ser un número entero')
    .positive('El precio de venta debe ser un número positivo')
    .min(1, 'El precio de venta es obligatorio'),
  Fecha_Ingreso: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 
        'La fecha de ingreso debe tener el formato YYYY-MM-DD'),
  Unidad_Medida: z.enum(['Kg', 'L']).refine((val) => ['Kg', 'L'].includes(val), { //con .refine se agrega una validación personalizada
    message: 'La unidad de medida debe ser "Kg" o "L"',
  }),
  Stock_Unidades: z.number()
    .int('El stock de unidades debe ser un número entero')
    .min(0, 'Stock_unidades es obligatorio'), //Porque puede ser mayor o igual a 0
  Stock_Cajas: z.number()
    .int('El stock de cajas debe ser un número entero')
    .min(0, 'Stock_Cajas es obligatorio'),
  Unidades_Por_Caja: z.number()
    .int('Las unidades por caja deben ser un número entero')
    .positive('Las unidades por caja deben ser un número positivo'), //positive porque en una caja no pueden venir 0 unidades
  SKU: z.string()
    .min(1, 'El SKU es obligatorio')
    .max(50, 'El SKU debe tener menos de 50 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'El SKU solo puede contener letras, números y guiones'),
  Descuento: z.number()
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede ser mayor a 100')
    .int('El descuento debe ser un número entero')
});

export type ProductoSchema = z.infer<typeof productoSchema>;
