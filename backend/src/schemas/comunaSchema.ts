import { z } from 'zod';

export const comunaSchema = z.object({
  Nombre: z.string()
    .min(1, "El nombre de la comuna es obligatorio")
    .max(100, "El nombre de la comuna no debe exceder los 100 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios"), // Solo letras y espacios
  ID_Region: z.number()
    .int("ID_Region debe ser un número entero")
    .positive("ID_Region debe ser un número positivo"),
});

export type ComunaSchema = z.infer<typeof comunaSchema>;
