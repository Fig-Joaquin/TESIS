import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { categoriaGastoSchema } from '../schemas/categoriaGastoSchema';
import logger from '../utils/logger';

export const createCategoriaGasto = async (req: Request, res: Response) => {
    const adapter = new ZodValidatorAdapter(categoriaGastoSchema);
    const validationResult = adapter.validateAndSanitize(req.body);

    if (validationResult.errors) {
        logger.error('Invalid input for createCategoriaGasto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
    }

    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);
        const newCategoriaGasto = categoriaGastoRepository.create(validationResult.data);
        await categoriaGastoRepository.save(newCategoriaGasto);
        logger.info('Categoría de gasto creada: %o', newCategoriaGasto);
        res.status(201).json(newCategoriaGasto);
    } catch (err) {
    logger.error('Error creating CategoriaGasto: %o', err);
    if (err instanceof Error) {
        res.status(401).json({ message: err.message });
        } else {
            res.status(401).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getAllCategoriasGasto = async (req: Request, res: Response) => {
    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);
        const categoriasGasto = await categoriaGastoRepository.find();
        res.status(200).json(categoriasGasto);
    } catch (err) {
    logger.error('Error fetching CategoriasGasto: %o', err);
    if (err instanceof Error) {
        res.status(401).json({ message: err.message });
        } else {
            res.status(401).json({ message: 'An unknown error occurred' });
        }
    }  
};
