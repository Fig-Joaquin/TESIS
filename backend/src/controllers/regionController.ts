import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Region } from '../entities/regionEntity';
import { regionSchema } from '../schemas/regionSchema';

// * Crear una región
export const createRegion = async (req: Request, res: Response) => {
  // Validar los datos de la región
  const parseResult = regionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input for region', errors: parseResult.error.errors });
  }

  const { Nombre } = parseResult.data;

  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const newRegion = regionRepository.create({ Nombre });
    await regionRepository.save(newRegion);
    res.status(201).json(newRegion);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Similar functions for update, delete, and get regions
