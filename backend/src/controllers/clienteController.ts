import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Comuna } from '../entities/comunaEntity';
import { ZodValidatorAdapter } from '../plugins/zod-cliente-plugin';
import { personaSchemaRegistro, clienteSchema } from '../schemas';
import logger from '../utils/logger';

// * Crear un cliente
export const createPersonaCliente = async (req: Request, res: Response) => {
  const personaAdapter = new ZodValidatorAdapter(personaSchemaRegistro);
  const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

  const parsePersonaResult = personaAdapter.validateAndSanitize(req.body.persona);
  if (!parsePersonaResult.success) {
    return res.status(400).json({ message: 'Invalid input for persona', errors: parsePersonaResult.errors });
  }

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body.cliente);
  if (!parseClienteResult.success) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = parsePersonaResult.data;
  const { Direccion, Nombre_Local, Razon_Social, Giro, ID_Comuna } = parseClienteResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const comunaRepository = AppDataSource.getRepository(Comuna);

    const existingPersona = await personaRepository.findOne({ where: { Rut_Persona } });
    if (existingPersona) {
      return res.status(409).json({ message: 'Persona already exists' });
    }

    const existingCliente = await clienteRepository.findOne({ where: { Persona: { Rut_Persona } } });
    if (existingCliente) {
      return res.status(409).json({ message: 'Cliente already exists' });
    }

    const existingComuna = await comunaRepository.findOne({ where: { ID_Comuna } });
    if (!existingComuna) {
      return res.status(404).json({ message: 'Comuna not found' });
    }

    const newPersona = personaRepository.create({ Rut_Persona, Nombre, Primer_apellido, Segundo_apellido: Segundo_apellido || '',Email: Email || '', Telefono });
    await personaRepository.save(newPersona);

    const newCliente = clienteRepository.create({
      Persona: newPersona,
      Comuna: existingComuna,
      Direccion,
      Nombre_Local,
      Razon_Social,
      Giro,
      Mora: false
    });
    await clienteRepository.save(newCliente);

    res.status(201).json({ persona: newPersona, cliente: newCliente });
  } catch (err) {
    logger.error('Error creating PersonaCliente: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const clientes = await clienteRepository.find({ relations: ["Persona", "Comuna"] });

    res.status(200).json(clientes);
  } catch (err) {
    logger.error('Error fetching Clientes: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};



export const filterClientes = async (req: Request, res: Response) => {
  const { Direccion, Nombre_Local, Razon_Social, Giro, Mora, ID_Comuna } = req.query;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const queryBuilder = clienteRepository.createQueryBuilder("cliente")
      .leftJoinAndSelect("cliente.Persona", "persona")
      .leftJoinAndSelect("cliente.Comuna", "comuna");

    if (Direccion) {
      queryBuilder.andWhere("cliente.Direccion LIKE :Direccion", { Direccion: `%${Direccion}%` });
    }
    if (Nombre_Local) {
      queryBuilder.andWhere("cliente.Nombre_Local LIKE :Nombre_Local", { Nombre_Local: `%${Nombre_Local}%` });
    }
    if (Razon_Social) {
      queryBuilder.andWhere("cliente.Razon_Social LIKE :Razon_Social", { Razon_Social: `%${Razon_Social}%` });
    }
    if (Giro) {
      queryBuilder.andWhere("cliente.Giro LIKE :Giro", { Giro: `%${Giro}%` });
    }
    if (Mora !== undefined) {
      queryBuilder.andWhere("cliente.Mora = :Mora", { Mora: Mora === 'true' });
    }
    if (ID_Comuna) {
      queryBuilder.andWhere("comuna.ID_Comuna = :ID_Comuna", { ID_Comuna });
    }

    const clientes = await queryBuilder.getMany();
    res.status(200).json(clientes);
  } catch (err) {
    logger.error('Error filtering Clientes: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};



// * Obtener un cliente por su RUT
export const getClienteByRut = async (req: Request, res: Response) => {
  const { rut } = req.params;
  console.log(rut)
  if (!rut) {
    logger.error('RUT is missing from the request parameters');
    return res.status(400).json({ message: 'RUT is required' });
  }

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({
      where: { Persona: { Rut_Persona: rut.toLowerCase() } },
      relations: ["Persona", "Comuna"]
    });

    if (!cliente) {
      logger.warn('Cliente not found for RUT: %s', rut);
      return res.status(404).json({ message: 'Cliente not found' });
    }

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error fetching Cliente by RUT: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// * Obtener un cliente por su ID
export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.error('ID is missing from the request parameters');
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({
      where: { ID_Cliente: Number(id) },
      relations: ["Persona", "Comuna"]
    });

    if (!cliente) {
      logger.warn('Cliente not found for ID: %s', id);
      return res.status(404).json({ message: 'Cliente not found' });
    }

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error fetching Cliente by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


export const updateClienteByRut = async (req: Request, res: Response) => {
  const { Rut } = req.params;
  const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body);
  if (!parseClienteResult || parseClienteResult.errors) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult?.errors });
  }

  const { Direccion, Nombre_Local, Razon_Social, Giro, Mora, ID_Comuna } = parseClienteResult.data;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { Persona: { Rut_Persona: Rut } } });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }

    if (Direccion) cliente.Direccion = Direccion;
    if (Nombre_Local) cliente.Nombre_Local = Nombre_Local;
    if (Razon_Social) cliente.Razon_Social = Razon_Social;
    if (Giro) cliente.Giro = Giro;
    if (Mora !== undefined) cliente.Mora = Mora;

    if (ID_Comuna) {
      const comunaRepository = AppDataSource.getRepository(Comuna);
      const existingComuna = await comunaRepository.findOne({ where: { ID_Comuna } });
      if (!existingComuna) {
        return res.status(404).json({ message: 'Comuna not found' });
      }
      cliente.Comuna = existingComuna;
    }

    await clienteRepository.save(cliente);

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error updating Cliente: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

