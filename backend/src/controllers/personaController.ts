import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { personaSchema } from '../schemas/personaSchema';

export const createPersona = async (req: Request, res: Response) => {
  const parseResult = personaSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = parseResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const newPersona = personaRepository.create({ Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono });
    await personaRepository.save(newPersona);
    res.status(201).json(newPersona);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updatePersona = async (req: Request, res: Response) => {
  const parseResult = personaSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parseResult.error.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = parseResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { Rut_Persona } });

    if (!persona) {
      return res.status(404).json({ message: 'Persona not found' });
    }

    persona.Nombre = Nombre;
    persona.Primer_apellido = Primer_apellido;
    persona.Segundo_apellido = Segundo_apellido;
    persona.Email = Email;
    persona.Telefono = Telefono;

    await personaRepository.save(persona);
    res.status(200).json(persona);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};