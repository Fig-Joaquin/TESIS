import { z } from 'zod';

export const personaSchema = z.object({
  Rut_Persona: z.string().regex(/^\d+-[0-9kK]$/, 'Rut_Persona debe contener entre 1 y 9 dígitos seguidos de un guion y un dígito verificador (número o "k")'),
  Nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre debe tener menos de 100 caracteres'),
  Primer_apellido: z.string().min(1, 'El primer apellido es obligatorio').max(100, 'El primer apellido debe tener menos de 100 caracteres'),
  Segundo_apellido: z.string().min(1, 'El segundo apellido es obligatorio').max(100, 'El segundo apellido debe tener menos de 100 caracteres'),
  Email: z.string().email('Email inválido').max(100, 'El email debe tener menos de 100 caracteres'),
  Telefono: z.string().min(1, 'El teléfono es obligatorio').max(9, 'El teléfono debe tener menos de 20 caracteres')
});

export type PersonaSchema = z.infer<typeof personaSchema>;
