import { Request, Response } from 'express';
import { login } from '../services/authService';
import logger from '../utils/logger';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { z } from 'zod';

// Definir el esquema de validación de Zod para los datos de inicio de sesión
const loginSchema = z.object({
  Rut_Persona: z.string().min(1, 'El RUT es obligatorio'),
  Password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const loginController = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(loginSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult) {
    logger.error('Invalid input for login: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { Rut_Persona, Password } = req.body;

  try {
    const { token, usuario } = await login(Rut_Persona, Password);
    res.json({ token, usuario });
  } catch (err) {
    logger.error('Error during login: %o', err);
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
    } else {
      res.status(401).json({ message: 'An unknown error occurred' });
    }
  }
};
