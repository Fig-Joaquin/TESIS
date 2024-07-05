import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { RolUsuario } from '../entities/rolUsuarioEntity';
import { Usuario } from '../entities/usuarioEntity';
import { Roles } from '../entities/rolesEntity';
import logger from '../utils/logger';

// * Asignar un rol a un usuario
export const assignRoleToUser = async (req: Request, res: Response) => {
  const { ID_Usuario, ID_Rol } = req.body;

  try {
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const rolesRepository = AppDataSource.getRepository(Roles);

    const usuario = await usuarioRepository.findOne({ where: { ID_Usuario } });
    const rol = await rolesRepository.findOne({ where: { ID_Rol } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

    const existingRolUsuario = await rolUsuarioRepository.findOne({ where: { usuario, rol } });
    if (existingRolUsuario) {
      return res.status(409).json({ message: 'This user already has this role assigned' });
    }

    const newRolUsuario = rolUsuarioRepository.create({ usuario, rol });
    await rolUsuarioRepository.save(newRolUsuario);

    logger.info('Role assigned to user: %o', newRolUsuario);
    res.status(201).json(newRolUsuario);
  } catch (err) {
    logger.error('Error assigning role to user: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un rol de un usuario por ID
export const removeRoleFromUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);
    const rolUsuario = await rolUsuarioRepository.findOne({ where: { ID_Rol_Usuario: Number(id) } });

    if (!rolUsuario) {
      return res.status(404).json({ message: 'Rol_Usuario not found' });
    }

    await rolUsuarioRepository.remove(rolUsuario);

    logger.info('Rol_Usuario deleted: %o', rolUsuario);
    res.status(200).json({ message: 'Rol_Usuario deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Rol_Usuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los roles de un usuario
export const getRolesByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);
    const roles = await rolUsuarioRepository.find({ where: { usuario: { ID_Usuario: Number(id) } }, relations: ['rol'] });

    res.status(200).json(roles);
  } catch (err) {
    logger.error('Error fetching roles for user: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
