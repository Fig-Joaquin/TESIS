import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Comuna } from '../entities/comunaEntity';
import { personaSchema, clienteSchema } from '../schemas';

// * Crear un cliente
export const createPersonaCliente = async (req: Request, res: Response) => {
  // Validar los datos de la persona
  const parsePersonaResult = personaSchema.safeParse(req.body.persona);
  if (!parsePersonaResult.success) {
    return res.status(400).json({ message: 'Invalid input for persona', errors: parsePersonaResult.error.errors });
  }

  const { Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono } = parsePersonaResult.data;

  // Validar los datos del cliente
  const parseClienteResult = clienteSchema.safeParse(req.body.cliente);
  if (!parseClienteResult.success) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.error.errors });
  }

  const { Direccion, Nombre_Local, Razon_Social, Giro, Mora, ID_Comuna } = parseClienteResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const comunaRepository = AppDataSource.getRepository(Comuna);

    // Verificar si la persona ya existe
    const existingPersona = await personaRepository.findOne({ where: { Rut_Persona } });
    if (existingPersona) {
      return res.status(409).json({ message: 'Persona already exists' });
    }

    // Verificar si el cliente ya existe
    const existingCliente = await clienteRepository.findOne({ where: { persona: { Rut_Persona } } });
    if (existingCliente) {
      return res.status(409).json({ message: 'Cliente already exists' });
    }

    // Verificar si la comuna existe
    const existingComuna = await comunaRepository.findOne({ where: { ID_Comuna } });
    if (!existingComuna) {
      return res.status(404).json({ message: 'Comuna not found' });
    }

    // Crear y guardar la persona
    const newPersona = personaRepository.create({ Rut_Persona, Nombre, Primer_apellido, Segundo_apellido, Email, Telefono });
    await personaRepository.save(newPersona);

    // Crear y guardar el cliente utilizando la relación con la nueva persona y la comuna
    const newCliente = clienteRepository.create({
      persona: newPersona,
      comuna: existingComuna,
      Direccion,
      Nombre_Local,
      Razon_Social,
      Giro,
      Mora
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

  export const filterClientes = async (req: Request, res: Response) => {
    const { direccion, nombreLocal, razonSocial, giro, mora, idComuna } = req.query;
  
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const queryBuilder = clienteRepository.createQueryBuilder("cliente").leftJoinAndSelect("cliente.persona", "persona").leftJoinAndSelect("cliente.comuna", "comuna");
  
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
      if (mora) {
        queryBuilder.andWhere("cliente.Mora = :mora", { mora: mora === 'true' });
      }
      if (idComuna) {
        queryBuilder.andWhere("cliente.ID_Comuna = :idComuna", { idComuna });
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

  export const getClienteByRut = async (req: Request, res: Response) => {
    const { rut } = req.params;
  
    console.log(`Buscando cliente con RUT: ${rut}`);
  
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const cliente = await clienteRepository.findOne({
        where: { persona: { Rut_Persona: rut.toLowerCase() } },
        relations: ["persona", "comuna"]
      });
  
      if (!cliente) {
        console.log(`Cliente con RUT ${rut} no encontrado.`);
        return res.status(404).json({ message: 'Cliente not found' });
      }
  
      console.log(`Cliente encontrado: ${JSON.stringify(cliente)}`);
      res.status(200).json(cliente);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error al buscar el cliente: ${err.message}`);
        res.status(500).json({ message: err.message });
      } else {
        console.error('Error desconocido al buscar el cliente');
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };
  
  export const updateClienteByRut = async (req: Request, res: Response) => {
    const { rut } = req.params;
    const { Direccion, Nombre_Local, Razon_Social, Giro, Mora, ID_Comuna } = req.body;
  
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const cliente = await clienteRepository.findOne({ where: { persona: { Rut_Persona: rut } } });
  
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente not found' });
      }
  
      // Actualizar los campos del cliente
      if (Direccion) cliente.Direccion = Direccion;
      if (Nombre_Local) cliente.Nombre_Local = Nombre_Local;
      if (Razon_Social) cliente.Razon_Social = Razon_Social;
      if (Giro) cliente.Giro = Giro;
      if (Mora !== undefined) cliente.Mora = Mora;
  
      // Actualizar la comuna
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
  