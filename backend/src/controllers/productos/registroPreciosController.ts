import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Registro_Precios } from '../../entities/productos/registroPreciosEntity';
import { registroPreciosSchema } from '../../schemas/productos/registroPreciosSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(registroPreciosSchema);

// ---------------- Crear un registro de precios ----------------
export const createRegistroPrecios = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createRegistroPrecios: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for registro de precios', errors: validationResult.errors });
  }

  const {
    ID_Producto,
    Fecha_Fin,
    Fecha_Creacion,
    Precio_Neto,
    Precio_Venta
  } = req.body;

  try {
    const registroPreciosRepository = AppDataSource.getRepository(Registro_Precios);
    const newRegistroPrecios = registroPreciosRepository.create({
      ID_Producto,
      Fecha_Fin,
      Fecha_Creacion,
      Precio_Neto,
      Precio_Venta
    });
    await registroPreciosRepository.save(newRegistroPrecios);
    logger.info('Registro de precios created: %o', newRegistroPrecios);
    res.status(201).json(newRegistroPrecios);
  } catch (err) {
    logger.error('Error creating registro de precios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todos los registros de precios ----------------
export const getAllRegistroPrecios = async (req: Request, res: Response) => {
  try {
    const registroPreciosRepository = AppDataSource.getRepository(Registro_Precios);
    const registros = await registroPreciosRepository.find();
    res.status(200).json(registros);
  } catch (err) {
    logger.error('Error fetching registros de precios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener un registro de precios por ID ----------------
export const getRegistroPreciosById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const registroPreciosRepository = AppDataSource.getRepository(Registro_Precios);
    const registro = await registroPreciosRepository.findOne({ where: { ID_Registro: Number(id) } });

    if (!registro) {
      logger.warn('Registro de precios not found for ID_Registro: %s', id);
      return res.status(404).json({ message: 'Registro de precios not found' });
    }

    res.status(200).json(registro);
  } catch (err) {
    logger.error('Error fetching registro de precios by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar un registro de precios ----------------
export const updateRegistroPrecios = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateRegistroPrecios: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for registro de precios', errors: validationResult.errors });
  }

  const {
    ID_Producto,
    Fecha_Fin,
    Fecha_Creacion,
    Precio_Neto,
    Precio_Venta
  } = req.body;

  try {
    const registroPreciosRepository = AppDataSource.getRepository(Registro_Precios);

    // Verificar si el registro de precios existe
    const registro = await registroPreciosRepository.findOne({ where: { ID_Registro: Number(id) } });
    if (!registro) {
      logger.warn('Registro de precios not found for ID_Registro: %s', id);
      return res.status(404).json({ message: 'Registro de precios not found' });
    }

    // Actualizar el registro de precios
    registro.ID_Producto = ID_Producto;
    registro.Fecha_Fin = Fecha_Fin;
    registro.Fecha_Creacion = Fecha_Creacion;
    registro.Precio_Neto = Precio_Neto;
    registro.Precio_Venta = Precio_Venta;

    await registroPreciosRepository.save(registro);
    logger.info('Registro de precios updated: %o', registro);
    res.status(200).json(registro);
  } catch (err) {
    logger.error('Error updating registro de precios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar un registro de precios ----------------
export const deleteRegistroPrecios = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const registroPreciosRepository = AppDataSource.getRepository(Registro_Precios);

    // Verificar si el registro de precios existe
    const registro = await registroPreciosRepository.findOne({ where: { ID_Registro: Number(id) } });
    if (!registro) {
      logger.warn('Registro de precios not found for ID_Registro: %s', id);
      return res.status(404).json({ message: 'Registro de precios not found' });
    }

    await registroPreciosRepository.remove(registro);
    logger.info('Registro de precios deleted: %o', registro);
    res.status(200).json({ message: 'Registro de precios deleted successfully' });
  } catch (err) {
    logger.error('Error deleting registro de precios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
