import { AppDataSource } from '../config/data-source';
import { Usuario } from '../entities/usuarioEntity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

export const login = async (Rut_Persona: string, Password: string) => {
  const usuarioRepository = AppDataSource.getRepository(Usuario);
  const usuario = await usuarioRepository.findOne({ where: { persona: { Rut_Persona } }, relations: ['persona', 'roles', 'roles.rol'] });

  if (!usuario) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(Password, usuario.Contrasenia);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const userRoles = usuario.roles.map(rolUsuario => rolUsuario.rol.Rol);

  const token = jwt.sign({ ID_Usuario: usuario.ID_Usuario, roles: userRoles }, JWT_SECRET, { expiresIn: '5h' });

  return { token, usuario };
};
