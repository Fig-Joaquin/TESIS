import { z } from 'zod';

export const clienteSchema = z.object({
    Direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }).optional(),
    Nombre_Local: z.string().min(3, { message: "El nombre del local debe tener al menos 3 caracteres" }).optional(),
    Razon_Social: z.string().min(3, { message: "La razón social debe tener al menos 3 caracteres" }).optional(),
    Giro: z.string().min(3, { message: "El giro debe tener al menos 3 caracteres" }).optional(),
    Mora: z.boolean().optional(),
    ID_Comuna: z.number().int(),  // Asegúrate de incluir el campo ID_Comuna aquí
});

export type Cliente = z.infer<typeof clienteSchema>;
