import { z } from 'zod';

export const comunaSchema = z.object({
  Nombre: z.string().max(100, "El nombre de la comuna no debe exceder los 100 caracteres"),
  ID_Region: z.number().int("ID_Region debe ser un número entero"),
});
