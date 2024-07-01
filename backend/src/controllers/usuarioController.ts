import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Usuario } from '../entities/usuarioEntity';
import { Persona } from '../entities/personaEntity';
import bcrypt from 'bcryptjs';
import { usuarioSchema } from '../schemas/usuarioSchema';

export const createUsuario = async (req: Request, res: Response) => {
  // Transformar Rut_Persona a minúsculas
  const rutPersona = req.body.Rut_Persona.toLowerCase();
  const { Rol_Usuario, Password } = req.body;

  // Validar los datos
  const parseResult = usuarioSchema.safeParse({ Rut_Persona: rutPersona, Rol_Usuario, Password });

  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.errors });
  }

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { Rut_Persona: rutPersona } });

    if (!persona) {
      return res.status(404).json({ message: 'Persona not found' });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUsuario = usuarioRepository.create({ persona, Rol_Usuario, Password_Hash: hashedPassword });
    await usuarioRepository.save(newUsuario);
    res.status(201).json(newUsuario);
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
    } else {
      res.status(401).json({ message: 'Ha ocurrido un error' });
    }
  }
};

export const deleteUsuarioByRutPersona = async (req: Request, res: Response) => {
  // Transformar Rut_Persona a minúsculas
  const rutPersona = req.body.Rut_Persona.toLowerCase();

  if (!rutPersona) {
    return res.status(400).json({ message: 'Rut_Persona is required' });
  }

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({
      where: { persona: { Rut_Persona: rutPersona } },
      relations: ['persona'], // Asegúrate de cargar las relaciones necesarias
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }

    await usuarioRepository.remove(usuario);
    res.status(200).json({ message: 'Usuario deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
};
