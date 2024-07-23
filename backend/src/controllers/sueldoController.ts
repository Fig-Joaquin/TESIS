import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Sueldo } from '../entities/sueldoEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { sueldoSchemaRegistro, sueldoSchemaActualizacion } from '../schemas/sueldoSchema';
import logger from '../utils/logger';

const sueldoRepository = AppDataSource.getRepository(Sueldo);
const transaccionRepository = AppDataSource.getRepository(Transaccion);

// Función para crear sueldos y la transacción asociada
export const createSueldo = async (req: Request, res: Response): Promise<Response> => {
  const adapter = new ZodValidatorAdapter(sueldoSchemaRegistro);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for createSueldo: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { Fecha, Tipo, Monto, DescripcionTransaccion, Tipo_Sueldo, Descripcion, ID_Persona } = validationResult.data;

  try {
    // Crear la transacción
    const nuevaTransaccion = transaccionRepository.create({
      Fecha,
      Tipo,
      Monto,
      Descripcion: DescripcionTransaccion
    });
    await transaccionRepository.save(nuevaTransaccion);

    // Crear el sueldo usando la transacción recién creada
    const nuevoSueldo = sueldoRepository.create({
      ID_Transaccion: nuevaTransaccion,
      Tipo_Sueldo,
      Descripcion,
    });
    await sueldoRepository.save(nuevoSueldo);

    logger.info('Sueldo y transacción creados: %o %o', nuevoSueldo, nuevaTransaccion);
    return res.status(201).json({ nuevoSueldo, nuevaTransaccion });
  } catch (error) {
    logger.error('Error al crear el sueldo y la transacción: %o', error);
    return res.status(500).json({ message: 'Error al crear el sueldo y la transacción' });
  }
};
// Función para actualizar sueldos
export const updateSueldo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const adapter = new ZodValidatorAdapter(sueldoSchemaActualizacion);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for updateSueldo: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  try {
    const sueldo = await sueldoRepository.findOneBy({ ID_Sueldo: parseInt(id) });
    if (!sueldo) {
      logger.warn('Sueldo no encontrado: %s', id);
      return res.status(404).json({ message: 'Sueldo no encontrado' });
    }

    if (validationResult.data.ID_Transaccion !== undefined) sueldo.ID_Transaccion = validationResult.data.ID_Transaccion;
    if (validationResult.data.Tipo_Sueldo !== undefined) sueldo.Tipo_Sueldo = validationResult.data.Tipo_Sueldo;
    if (validationResult.data.Descripcion !== undefined) sueldo.Descripcion = validationResult.data.Descripcion;
    await sueldoRepository.save(sueldo);
    logger.info('Sueldo actualizado: %o', sueldo);
    return res.status(200).json(sueldo);
  } catch (error) {
    logger.error('Error al actualizar el sueldo: %o', error);
    return res.status(500).json({ message: 'Error al actualizar el sueldo' });
  }
};

// Función para eliminar sueldos
export const deleteSueldo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const sueldo = await sueldoRepository.findOneBy({ ID_Sueldo: parseInt(id) });
    if (!sueldo) {
      logger.warn('Sueldo no encontrado: %s', id);
      return res.status(404).json({ message: 'Sueldo no encontrado' });
    }

    await sueldoRepository.remove(sueldo);
    logger.info('Sueldo eliminado: %o', sueldo);
    return res.status(200).json({ message: 'Sueldo eliminado correctamente' });
  } catch (error) {
    logger.error('Error al eliminar el sueldo: %o', error);
    return res.status(500).json({ message: 'Error al eliminar el sueldo' });
  }
};

// Función para mostrar todos los sueldos
export const getAllSueldos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sueldos = await sueldoRepository.find();
    logger.info('Sueldos obtenidos');
    return res.status(200).json(sueldos);
  } catch (error) {
    logger.error('Error al obtener los sueldos: %o', error);
    return res.status(500).json({ message: 'Error al obtener los sueldos' });
  }
};

// Función para filtrar sueldos por tipo y periodo // * Hay que arreglar
export const getSueldosByTipo = async (req: Request, res: Response): Promise<Response> => {
  const { tipo, periodo } = req.query;
console.log(tipo,periodo);
  try {
    let query = sueldoRepository.createQueryBuilder('sueldo')
      .leftJoinAndSelect('sueldo.ID_Transaccion', 'transaccion')
      .where('sueldo.Tipo_Sueldo = :tipo', { tipo });

    if (tipo === 'mensual') {
      query = query.andWhere('DATE_PART(\'month\', transaccion.Fecha) = :mes', { mes: periodo });
    } else if (tipo === 'semanal') {
      query = query.andWhere('DATE_PART(\'week\', transaccion.Fecha) = :semana', { semana: periodo });
    } else if (tipo === 'quincena') {
      query = query.andWhere('DATE_PART(\'month\', transaccion.Fecha) = :mes', { mes: periodo })
        .andWhere('EXTRACT(DAY FROM transaccion.Fecha) <= 15', { quincena: periodo });
    }

    const sueldos = await query.getMany();
    logger.info(`Sueldos filtrados por tipo ${tipo} y periodo ${periodo} obtenidos`);
    return res.status(200).json(sueldos);
  } catch (error) {
    logger.error(`Error al obtener los sueldos filtrados por tipo ${tipo} y periodo ${periodo}: %o`, error);
    return res.status(500).json({ message: `Error al obtener los sueldos filtrados por tipo ${tipo} y periodo ${periodo}` });
  }
};
