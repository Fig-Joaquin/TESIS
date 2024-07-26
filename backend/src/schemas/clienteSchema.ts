import { z } from 'zod';

export const clienteSchema = z.object({
  Direccion: z.string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" })
    .max(120, { message: "La dirección no debe exceder los 120 caracteres" })
    .refine(value => value !== undefined && value !== null,{ message: "La dirección es obligatoria" }),
  
  Nombre_Local: z.string()
    .min(3, { message: "El nombre del local debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre del local no debe exceder los 100 caracteres" })
    .refine(value => value !== undefined && value !== null,{ message: "El nombre del local es obligatorio" }),
  
  Razon_Social: z.string()
    .min(3, { message: "La razón social debe tener al menos 3 caracteres" })
    .max(100, { message: "La razón social no debe exceder los 100 caracteres" })
    .refine(value => value !== undefined && value !== null,{ message: "La razón social es obligatoria" }),
  
  Giro: z.string()
    .min(3, { message: "El giro debe tener al menos 3 caracteres" })
    .max(50, { message: "El giro no debe exceder los 50 caracteres" })
    .refine(value => value !== undefined && value !== null, { message: "El giro es obligatorio" }),
  
  ID_Comuna: z.number()
    .int({ message: "El ID de comuna debe ser un número entero" })
    .refine(value => value !== undefined && value !== null, { message: "El ID de comuna es obligatorio" }),

  Mora: z.boolean().optional() // Siempre false al crear
});

export type Cliente = z.infer<typeof clienteSchema>;

