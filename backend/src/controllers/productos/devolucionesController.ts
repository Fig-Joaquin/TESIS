import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Devoluciones } from '../../entities/productos/devolucionesEntity';
import { devolucionesSchema } from '../../schemas/productos/devolucionesSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(devolucionesSchema);

// ---------------- Crear una devolución ----------------
export const createDevolucion = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createDevolucion: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for devolución', errors: validationResult.errors });
  }

  const {
    ID_Producto,
    Cantidad_Unidades,
    Cantidad_Cajas,
    Fecha_Devolucion,
    Razon
  } = req.body;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const newDevolucion = devolucionesRepository.create({
      ID_Producto,
      Cantidad_Unidades,
      Cantidad_Cajas,
      Fecha_Devolucion,
      Razon
    });
    await devolucionesRepository.save(newDevolucion);
    logger.info('Devolución created: %o', newDevolucion);
    res.status(201).json(newDevolucion);
  } catch (err) {
    logger.error('Error creating devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todas las devoluciones ----------------
export const getAllDevoluciones = async (req: Request, res: Response) => {
  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const devoluciones = await devolucionesRepository.find();
    res.status(200).json(devoluciones);
  } catch (err) {
    logger.error('Error fetching devoluciones: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener una devolución por ID ----------------
export const getDevolucionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const devolucion = await devolucionesRepository.findOne({ where: { ID_Devolucion: Number(id) } });

    if (!devolucion) {
      logger.warn('Devolución not found for ID_Devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    res.status(200).json(devolucion);
  } catch (err) {
    logger.error('Error fetching devolución by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar una devolución ----------------
export const updateDevolucion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateDevolucion: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for devolución', errors: validationResult.errors });
  }

  const {
    ID_Producto,
    Cantidad_Unidades,
    Cantidad_Cajas,
    Fecha_Devolucion,
    Razon
  } = req.body;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);

    // Verificar si la devolución existe
    const devolucion = await devolucionesRepository.findOne({ where: { ID_Devolucion: Number(id) } });
    if (!devolucion) {
      logger.warn('Devolución not found for ID_Devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    // Actualizar la devolución
    devolucion.ID_Producto = ID_Producto;
    devolucion.Cantidad_Unidades = Cantidad_Unidades;
    devolucion.Cantidad_Cajas = Cantidad_Cajas;
    devolucion.Fecha_Devolucion = Fecha_Devolucion;
    devolucion.Razon = Razon;

    await devolucionesRepository.save(devolucion);
    logger.info('Devolución updated: %o', devolucion);
    res.status(200).json(devolucion);
  } catch (err) {
    logger.error('Error updating devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar una devolución ----------------
export const deleteDevolucion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);

    // Verificar si la devolución existe
    const devolucion = await devolucionesRepository.findOne({ where: { ID_Devolucion: Number(id) } });
    if (!devolucion) {
      logger.warn('Devolución not found for ID_Devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    await devolucionesRepository.remove(devolucion);
    logger.info('Devolución deleted: %o', devolucion);
    res.status(200).json({ message: 'Devolución deleted successfully' });
  } catch (err) {
    logger.error('Error deleting devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
