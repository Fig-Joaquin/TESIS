import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { personaSchemaRegistro, personaSchemaActualizacion} from '../schemas/personaSchema';
import logger from '../utils/logger';

// * Crear una persona
export const createPersona = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(personaSchemaRegistro);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createPersona: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = validationResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);

    // Verificar si el Rut_Persona ya existe
    const existingPersonaByRut = await personaRepository.findOne({ where: { Rut_Persona } });
    if (existingPersonaByRut) {
      logger.warn('Persona already exists with Rut_Persona: %s', Rut_Persona);
      return res.status(409).json({ message: 'Rut_Persona ya está registrado' });
    }

    // Verificar si el Email ya existe
    if (Email) {
      const existingPersonaByEmail = await personaRepository.findOne({ where: { Email } });
      if (existingPersonaByEmail) {
        logger.warn('Persona already exists with Email: %s', Email);
        return res.status(409).json({ message: 'Email ya está registrado' });
      }
    }

    const newPersona = personaRepository.create({ 
      Rut_Persona, 
      Nombre, 
      Primer_apellido, 
      Segundo_apellido: Segundo_apellido || '', 
      Email: Email || '', 
      Telefono 
    });
    await personaRepository.save(newPersona);

    logger.info('Persona created: %o', newPersona);
    res.status(201).json(newPersona);
  } catch (err) {
    logger.error('Error creating Persona: %o', err);
    if (err instanceof Error) {
      if (err.message.includes('duplicate key value violates unique constraint')) {
        if (err.message.includes('UQ_6c840ee74b24bf5e892082a5d60')) {
          logger.warn('Duplicate Rut_Persona error: %s', err.message);
          res.status(409).json({ message: 'Rut_Persona ya está registrado' });
        } else if (err.message.includes('Email')) {
          logger.warn('Duplicate Email error: %s', err.message);
          res.status(409).json({ message: 'Email ya está registrado' });
        } else {
          logger.error('Unknown duplicate key error: %o', err);
          res.status(409).json({ message: 'Duplicate key error' });
        }
      } else {
        logger.error('Error creating Persona: %o', err);
        res.status(500).json({ message: err.message });
      }
    } else {
      logger.error('Unknown error creating Persona: %o', err);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/*
  Se esperan recibir los siguientes valores:
      Nombre, 
      Primer_apellido, 
      Segundo_apellido, 
      Email, 
      Telefono 
*/

// * Actualizar una persona
export const updatePersona = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adapter = new ZodValidatorAdapter(personaSchemaActualizacion);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updatePersona: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = validationResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { ID_Persona: parseInt(id) } });

    if (!persona) {
      logger.warn('Persona not found: %s', id);
      return res.status(404).json({ message: 'Persona not found' });
    }

    if (Nombre) persona.Nombre = Nombre;
    if (Primer_apellido) persona.Primer_apellido = Primer_apellido;
    if (Segundo_apellido !== undefined) persona.Segundo_apellido = Segundo_apellido;
    if (Email !== undefined) persona.Email = Email;
    if (Telefono) persona.Telefono = Telefono;

    await personaRepository.save(persona);
    logger.info('Persona updated: %o', persona);
    res.status(200).json(persona);
  } catch (err) {
    logger.error('Error updating Persona: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todas las personas
/* Obtener todas las personas disponibles en la base de datos */
export const getAllPersonas = async (req: Request, res: Response) => {
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const personas = await personaRepository.find();
    logger.info('Fetched all personas');
    res.status(200).json(personas);
  } catch (err) {
    logger.error('Error fetching all personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener una persona por su ID
export const getPersonaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('ES EL AIDI',id)

  // Verificar si el id es un número válido
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    logger.warn('Invalid ID format: %s', id);
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { ID_Persona: parseInt(id) } });

    if (!persona) {
      logger.warn('Persona not found: %s', id);
      return res.status(404).json({ message: 'Persona not found' });
    }

    logger.info('Fetched persona by id: %s', id);
    res.status(200).json(persona);
  } catch (err) {
    logger.error('Error fetching persona by id: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Buscar personas por criterios
export const searchPersonas = async (req: Request, res: Response) => {
  const { nombre, apellido, email } = req.query;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const queryBuilder = personaRepository.createQueryBuilder('persona');

    if (typeof nombre === 'string') {
      queryBuilder.andWhere("unaccent(lower(persona.Nombre)) LIKE unaccent(lower(:nombre))", { nombre: `%${nombre}%` });
    }
    if (typeof apellido === 'string') {
      queryBuilder.andWhere(
        "unaccent(lower(persona.Primer_apellido)) LIKE unaccent(lower(:apellido)) OR unaccent(lower(persona.Segundo_apellido)) LIKE unaccent(lower(:apellido))", 
        { apellido: `%${apellido}%` }
      );
    }
    if (email) {
      queryBuilder.andWhere("unaccent(lower(persona.Email)) LIKE unaccent(lower(:email))", { email: `%${String(email).trim()}%` });
    }

    const personas = await queryBuilder.getMany();
    logger.info('Searched personas with criteria');
    res.status(200).json(personas);
  } catch (err) {
    logger.error('Error searching personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Contar el número total de personas
export const countPersonas = async (req: Request, res: Response) => {
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const count = await personaRepository.count();
    logger.info('Counted total personas: %d', count);
    res.status(200).json({ count });
  } catch (err) {
    logger.error('Error counting personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar una persona por su ID
/* Para acceder a esta función se debe de dar el ID por parámetro */
export const deletePersona = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id)
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    console.log(personaRepository)
    const persona = await personaRepository.findOne({ where: { ID_Persona: parseInt(id) } });
    console.log(persona)
    if (!persona) {
      logger.warn('Persona not found: %s', id);
      return res.status(404).json({ message: 'Persona not found' });
    }

    await personaRepository.remove(persona);
    logger.info('Persona deleted: %s', id);
    res.status(200).json({ message: 'Persona deleted successfully' });
  } catch (err) {
    logger.error('Error deleting persona: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
