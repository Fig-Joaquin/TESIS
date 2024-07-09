import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Categoria } from '../../entities/productos/categoriaEntity';
import { categoriaSchema } from '../../schemas/productos/categoriaSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(categoriaSchema);

// ---------------- Crear una categoria ----------------
export const createCategoria = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createCategoria: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for categoria', errors: validationResult.errors });
  }

  const { Tipo } = req.body;

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const newCategoria = categoriaRepository.create({ Tipo });
    await categoriaRepository.save(newCategoria);
    logger.info('Categoria created: %o', newCategoria);
    res.status(201).json(newCategoria);
  } catch (err) {
    logger.error('Error creating Categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todas las categorias ----------------
export const getAllCategorias = async (req: Request, res: Response) => {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categorias = await categoriaRepository.find();
    res.status(200).json(categorias);
  } catch (err) {
    logger.error('Error fetching categorias: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener una categoria por ID ----------------
export const getCategoriaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categoria = await categoriaRepository.findOne({ where: { ID_Categoria: Number(id) } });

    if (!categoria) {
      logger.warn('Categoria not found for ID_Categoria: %s', id);
      return res.status(404).json({ message: 'Categoria not found' });
    }

    res.status(200).json(categoria);
  } catch (err) {
    logger.error('Error fetching Categoria by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar una categoria ----------------
export const updateCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateCategoria: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for categoria', errors: validationResult.errors });
  }

  const { Tipo } = req.body;

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    // Verificar si la categoria existe
    const categoria = await categoriaRepository.findOne({ where: { ID_Categoria: Number(id) } });
    if (!categoria) {
      logger.warn('Categoria not found for ID_Categoria: %s', id);
      return res.status(404).json({ message: 'Categoria not found' });
    }

    // Actualizar la categoria
    categoria.Tipo = Tipo;

    await categoriaRepository.save(categoria);
    logger.info('Categoria updated: %o', categoria);
    res.status(200).json(categoria);
  } catch (err) {
    logger.error('Error updating Categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar una categoria ----------------
export const deleteCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    // Verificar si la categoria existe
    const categoria = await categoriaRepository.findOne({ where: { ID_Categoria: Number(id) } });
    if (!categoria) {
      logger.warn('Categoria not found for ID_Categoria: %s', id);
      return res.status(404).json({ message: 'Categoria not found' });
    }

    await categoriaRepository.remove(categoria);
    logger.info('Categoria deleted: %o', categoria);
    res.status(200).json({ message: 'Categoria deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
