import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Gasto } from '../entities/gastoEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { gastoSchema, gastoSchemaActualizacion, gastoConTransaccionSchema } from '../schemas/gastoSchema';
import logger from '../utils/logger';

// Crear gasto con transacción en una única solicitud
export const createGastoConTransaccion = async (req: Request, res: Response) => {
    const adapter = new ZodValidatorAdapter(gastoConTransaccionSchema);
    const validationResult = adapter.validateAndSanitize(req.body);
  
    if (validationResult.errors) {
      logger.error('Invalid input for createGastoConTransaccion: %o', validationResult.errors);
      return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
    }
  
    try {
      const gastoRepository = AppDataSource.getRepository(Gasto);
      const transaccionRepository = AppDataSource.getRepository(Transaccion);
      const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);
  
      const categoriaGasto = await categoriaGastoRepository.findOne({ where: { ID_Categoria_Gasto: validationResult.data.ID_Categoria_Gasto } });
      if (!categoriaGasto) {
        return res.status(404).json({ message: 'Categoría de gasto no encontrada' });
      }
  
      // Transformar la fecha de dd-mm-yyyy a yyyy-mm-dd
      const [day, month, year] = validationResult.data.Fecha.split('-');
      const formattedDate = `${year}-${month}-${day}`;
  
      const nuevaTransaccion = transaccionRepository.create({
        Fecha: formattedDate,
        Tipo: validationResult.data.Tipo,
        Monto: validationResult.data.Monto,
        Descripcion: validationResult.data.Descripcion
      });
      await transaccionRepository.save(nuevaTransaccion);
  
      const newGasto = gastoRepository.create({
        Transaccion: nuevaTransaccion,
        Nombre_Gasto: validationResult.data.Nombre_Gasto,
        CategoriaGasto: categoriaGasto
      });
      await gastoRepository.save(newGasto);
      logger.info('Gasto con transacción creado: %o', newGasto);
      res.status(201).json(newGasto);
    } catch (err) {
      logger.error('Error creating Gasto con Transacción: %o', err);
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };
// Obtener todos los gastos
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

// Actualizar gasto
export const updateGasto = async (req: Request, res: Response) => {
  const { id } = req.params;

  const adapter = new ZodValidatorAdapter(gastoSchemaActualizacion);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for updateGasto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  try {
    const gastoRepository = AppDataSource.getRepository(Gasto);
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);

    const gasto = await gastoRepository.findOne({ where: { ID_Gasto: Number(id) }, relations: ['Transaccion', 'CategoriaGasto'] });

    if (!gasto) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    if (validationResult.data.Nombre_Gasto !== undefined) {
      gasto.Nombre_Gasto = validationResult.data.Nombre_Gasto;
    }

    if (validationResult.data.ID_Categoria_Gasto !== undefined) {
      const categoriaGasto = await categoriaGastoRepository.findOne({ where: { ID_Categoria_Gasto: validationResult.data.ID_Categoria_Gasto } });
      if (!categoriaGasto) {
        return res.status(404).json({ message: 'Categoría de gasto no encontrada' });
      }
      gasto.CategoriaGasto = categoriaGasto;
    }

    const transaccion = gasto.Transaccion;

    if (validationResult.data.Fecha !== undefined) {
      const [day, month, year] = validationResult.data.Fecha.split('-');
      transaccion.Fecha = new Date(`${year}-${month}-${day}`);
    }

    if (validationResult.data.Tipo !== undefined) {
      transaccion.Tipo = validationResult.data.Tipo;
    }

    if (validationResult.data.Monto !== undefined) {
      transaccion.Monto = validationResult.data.Monto;
    }

    if (validationResult.data.Descripcion !== undefined) {
      transaccion.Descripcion = validationResult.data.Descripcion;
    }

    await transaccionRepository.save(transaccion);
    await gastoRepository.save(gasto);

    logger.info('Gasto actualizado: %o', gasto);
    return res.status(200).json(gasto);
  } catch (err) {
    logger.error('Error al actualizar el gasto: %o', err);
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Eliminar gasto
export const deleteGasto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const gastoRepository = AppDataSource.getRepository(Gasto);

    const gasto = await gastoRepository.findOne({ where: { ID_Gasto: Number(id) }, relations: ['Transaccion'] });

    if (!gasto) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    await gastoRepository.remove(gasto);

    logger.info('Gasto eliminado: %o', gasto);
    return res.status(200).json({ message: 'Gasto eliminado exitosamente' });
  } catch (err) {
    logger.error('Error al eliminar el gasto: %o', err);
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

