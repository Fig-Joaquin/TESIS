import { z } from 'zod';

// Función para validar el RUT chileno
const validateRut = (rut: string) => {
  const rutClean = rut.replace(/\./g, '').replace(/-/g, '');
  const rutBody = rutClean.slice(0, -1);
  const dv = rutClean.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = rutBody.length - 1; i >= 0; i--) {
    suma += parseInt(rutBody.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvValido = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvValido;
};

export const usuarioSchema = z.object({
  Rut_Persona: z.string()
    .min(1, 'El RUT es obligatorio')
    .regex(/^\d{1,8}-[0-9kK]{1}$/, 'Formato de RUT inválido')
    .refine(validateRut, 'RUT inválido'),
  Contrasenia: z.string().min(1, { message: "El campo no puede estar vacío" }),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
