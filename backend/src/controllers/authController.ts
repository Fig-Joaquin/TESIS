import { Request, Response } from 'express';
import { login } from '../services/authService';

export const loginController = async (req: Request, res: Response) => {
  const { Rut_Persona, Password } = req.body;

  try {
    const { token, usuario } = await login(Rut_Persona, Password);
    res.json({ token, usuario });
  } catch (err) {
    console.error('Error during login:', err);
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
    } else {
      res.status(401).json({ message: 'An unknown error occurred' });
    }
  }
};
