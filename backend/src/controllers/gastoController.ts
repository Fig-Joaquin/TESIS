import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Gasto } from '../entities/gastoEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { gastoSchema } from '../schemas/gastoSchema';
import logger from '../utils/logger';

export const createGasto = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(gastoSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for createGasto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  try {
    const gastoRepository = AppDataSource.getRepository(Gasto);
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);

    const transaccion = await transaccionRepository.findOne({ where: { ID_Transaccion: validationResult.data.ID_Transaccion } });
    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    const categoriaGasto = await categoriaGastoRepository.findOne({ where: { ID_Categoria_Gasto: validationResult.data.ID_Categoria_Gasto } });
    if (!categoriaGasto) {
      return res.status(404).json({ message: 'Categoría de gasto no encontrada' });
    }

    const newGasto = gastoRepository.create({
      Transaccion: transaccion,
      Nombre_Gasto: validationResult.data.Nombre_Gasto,
      CategoriaGasto: categoriaGasto
    });
    await gastoRepository.save(newGasto);
    logger.info('Gasto creado: %o', newGasto);
    res.status(201).json(newGasto);
  } catch (err) {
    logger.error('Error creating Gasto: %o', err);
    if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      } else {
        res.status(401).json({ message: 'An unknown error occurred' });
      }
  }
};

export const getAllGastos = async (req: Request, res: Response) => {
  try {
    const gastoRepository = AppDataSource.getRepository(Gasto);
    const gastos = await gastoRepository.find({ relations: ['Transaccion', 'CategoriaGasto'] });
    res.status(200).json(gastos);
  } catch (err) {
    logger.error('Error fetching Gastos: %o', err);
    if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      } else {
        res.status(401).json({ message: 'An unknown error occurred' });
      }
  }
};
