import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { Usuario } from '../entities/usuarioEntity';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';

export const login = async (Rut_Persona: string, Password: string) => {
  Rut_Persona = Rut_Persona.toLowerCase();
  const usuarioRepository = AppDataSource.getRepository(Usuario);
  const usuario = await usuarioRepository.findOne({
    where: { persona: { Rut_Persona } },
    relations: ['persona'], // Asegúrate de cargar las relaciones necesarias
  });

  if (!usuario) {
    throw new Error('Rut no encontrado');
  }

 // console.log('Usuario encontrado:', usuario);

  const isPasswordValid = await bcrypt.compare(Password, usuario.Password_Hash);
  if (!isPasswordValid) {
    throw new Error('Contraseña Incorrecta');
  }

  console.log('Password válido:', isPasswordValid);

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido');
  }

  const tokenPayload = { id: usuario.ID_Usuario, rut: usuario.persona.Rut_Persona, rol: usuario.Rol_Usuario };
 // console.log('Token payload:', tokenPayload);

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
 // console.log('Token generado:', token);

  return { token, usuario };
};
