import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Comuna } from '../entities/comunaEntity';
import { comunaSchema } from '../schemas/comunaSchema';

// * Crear una comuna
export const createComuna = async (req: Request, res: Response) => {
  // Validar los datos de la comuna
  const parseResult = comunaSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input for comuna', errors: parseResult.error.errors });
  }

  const { Nombre, ID_Region } = parseResult.data;

  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);
    const newComuna = comunaRepository.create({ Nombre, region: { ID_Region } });
    await comunaRepository.save(newComuna);
    res.status(201).json(newComuna);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Similar functions for update, delete, and get comunas
