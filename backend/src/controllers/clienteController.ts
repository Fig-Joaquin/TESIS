import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Comuna } from '../entities/comunaEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { personaSchema, clienteSchema } from '../schemas';


// * Crear un cliente
export const createPersonaCliente = async (req: Request, res: Response) => {
  const personaAdapter = new ZodValidatorAdapter(personaSchema);
  const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

  const parsePersonaResult = personaAdapter.validateAndSanitize(req.body.persona);
  if (parsePersonaResult) {
    return res.status(400).json({ message: 'Invalid input for persona', errors: parsePersonaResult.errors });
  }

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body.cliente);
  if (parseClienteResult) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = req.body.persona;
  const { Direccion, Nombre_Local, Razon_Social, Giro, ID_Comuna } = req.body.cliente;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const comunaRepository = AppDataSource.getRepository(Comuna);

    const existingPersona = await personaRepository.findOne({ where: { Rut_Persona } });
    if (existingPersona) {
      return res.status(409).json({ message: 'Persona already exists' });
    }

    const existingCliente = await clienteRepository.findOne({ where: { persona: { Rut_Persona } } });
    if (existingCliente) {
      return res.status(409).json({ message: 'Cliente already exists' });
    }

    const existingComuna = await comunaRepository.findOne({ where: { ID_Comuna } });
    if (!existingComuna) {
      return res.status(404).json({ message: 'Comuna not found' });
    }

    const newPersona = personaRepository.create({ Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono });
    await personaRepository.save(newPersona);

    const newCliente = clienteRepository.create({
      persona: newPersona,
      comuna: existingComuna,
      Direccion,
      Nombre_Local,
      Razon_Social,
      Giro,
      Mora: false // Mora siempre se inicializa como false
    });
    await clienteRepository.save(newCliente);

    res.status(201).json({ persona: newPersona, cliente: newCliente });
  } catch (err) {
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
    const clientes = await clienteRepository.find({ relations: ["persona", "comuna"] });

    res.status(200).json(clientes);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Filtrar clientes
export const filterClientes = async (req: Request, res: Response) => {
  const { direccion, nombreLocal, razonSocial, giro, mora, idComuna } = req.query;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const queryBuilder = clienteRepository.createQueryBuilder("cliente")
      .leftJoinAndSelect("cliente.persona", "persona")
      .leftJoinAndSelect("cliente.comuna", "comuna");

    if (direccion) {
      queryBuilder.andWhere("cliente.Direccion LIKE :direccion", { direccion: `%${direccion}%` });
    }
    if (nombreLocal) {
      queryBuilder.andWhere("cliente.Nombre_Local LIKE :nombreLocal", { nombreLocal: `%${nombreLocal}%` });
    }
    if (razonSocial) {
      queryBuilder.andWhere("cliente.Razon_Social LIKE :razonSocial", { razonSocial: `%${razonSocial}%` });
    }
    if (giro) {
      queryBuilder.andWhere("cliente.Giro LIKE :giro", { giro: `%${giro}%` });
    }
    if (mora !== undefined) {
      queryBuilder.andWhere("cliente.Mora = :mora", { mora: mora === 'true' });
    }
    if (idComuna) {
      queryBuilder.andWhere("comuna.ID_Comuna = :idComuna", { idComuna });
    }

    const clientes = await queryBuilder.getMany();
    res.status(200).json(clientes);
  } catch (err) {
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

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({
      where: { persona: { Rut_Persona: rut.toLowerCase() } },
      relations: ["persona", "comuna"]
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }

    res.status(200).json(cliente);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar un cliente por su RUT
export const updateClienteByRut = async (req: Request, res: Response) => {
  const { rut } = req.params;
  const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body);
  if (parseClienteResult) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
  }

  const { Direccion, Nombre_Local, Razon_Social, Giro, Mora, ID_Comuna } = req.body;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { persona: { Rut_Persona: rut } } });

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
      cliente.comuna = existingComuna;
    }

    await clienteRepository.save(cliente);

    res.status(200).json(cliente);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un cliente por su RUT
export const deleteClienteByRut = async (req: Request, res: Response) => {
  const { rut } = req.params;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { persona: { Rut_Persona: rut } } });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }

    await clienteRepository.remove(cliente);

    res.status(200).json({ message: 'Cliente deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
