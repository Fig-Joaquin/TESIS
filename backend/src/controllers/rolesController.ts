import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Roles } from '../entities/rolesEntity';
import { rolesSchema } from '../schemas/rolesSchema';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import logger from '../utils/logger';

// * Crear un rol
export const createRol = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(rolesSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult) {
    logger.error('Invalid input for createRol: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { Rol } = req.body;

  try {
    const rolesRepository = AppDataSource.getRepository(Roles);

    // Verificar si el rol ya existe
    const existingRol = await rolesRepository.findOne({ where: { Rol: Rol.toLowerCase() } });
    if (existingRol) {
      logger.error('Rol already exists: %s', Rol);
      return res.status(409).json({ message: 'Rol already exists' });
    }

    const newRol = rolesRepository.create({ Rol: Rol.toLowerCase() });
    await rolesRepository.save(newRol);

    logger.info('Rol created: %o', newRol);
    res.status(201).json(newRol);
  } catch (err) {
    logger.error('Error creating Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const rolesRepository = AppDataSource.getRepository(Roles);
    const roles = await rolesRepository.find();
    res.status(200).json(roles);
  } catch (err) {
    logger.error('Error fetching Roles: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un rol por su ID
export const deleteRolById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rolesRepository = AppDataSource.getRepository(Roles);
    const rol = await rolesRepository.findOne({ where: { ID_Rol: Number(id) } });

    if (!rol) {
      logger.error('Rol not found: %s', id);
      return res.status(404).json({ message: 'Rol not found' });
    }

    await rolesRepository.remove(rol);
    logger.info('Rol deleted: %o', rol);
    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un rol por su nombre
export const deleteRolByName = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const rolesRepository = AppDataSource.getRepository(Roles);
    const rol = await rolesRepository.findOne({ where: { Rol: name.toLowerCase() } });

    if (!rol) {
      logger.error('Rol not found: %s', name);
      return res.status(404).json({ message: 'Rol not found' });
    }

    await rolesRepository.remove(rol);
    logger.info('Rol deleted: %o', rol);
    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar un rol
export const updateRol = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { Rol } = req.body;

  if (!Rol) {
    logger.error('Invalid input for updateRol: Rol is required');
    return res.status(400).json({ message: 'Rol is required' });
  }

  try {
    const rolesRepository = AppDataSource.getRepository(Roles);

    // Verificar si el nuevo nombre del rol ya existe
    const existingRol = await rolesRepository.findOne({ where: { Rol: Rol.toLowerCase() } });
    if (existingRol) {
      logger.error('Rol already exists: %s', Rol);
      return res.status(409).json({ message: 'Rol already exists' });
    }

    const rol = await rolesRepository.findOne({ where: { ID_Rol: Number(id) } });
    if (!rol) {
      logger.error('Rol not found: %s', id);
      return res.status(404).json({ message: 'Rol not found' });
    }

    rol.Rol = Rol.toLowerCase();
    await rolesRepository.save(rol);

    logger.info('Rol updated: %o', rol);
    res.status(200).json(rol);
  } catch (err) {
    logger.error('Error updating Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
