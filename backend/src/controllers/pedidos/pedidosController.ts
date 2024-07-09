import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Pedidos } from '../../entities/pedidos/pedidosEntity';
import { pedidoSchema } from '../../schemas/pedidos/pedidosSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(pedidoSchema);

// ---------------- Crear un pedido ----------------
export const createPedido = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createPedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for pedido', errors: validationResult.errors });
  }

  const {
    ID_Cliente,
    ID_Proveedor,
    Tipo_Pedido,
    Fecha_Pedido,
    Fecha_Entrega,
    Comentarios,
    Estado
  } = req.body;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const newPedido = pedidoRepository.create({
      Cliente: { ID_Cliente },
      Proveedor: { ID_Proveedor },
      Tipo_Pedido,
      Fecha_Pedido,
      Fecha_Entrega,
      Comentarios,
      Estado
    });
    await pedidoRepository.save(newPedido);
    logger.info('Pedido created: %o', newPedido);
    res.status(201).json({message: "Pedido created succesfully",newPedido});
  } catch (err) {
    logger.error('Error creating Pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todos los pedidos ----------------
export const getAllPedidos = async (req: Request, res: Response) => {
  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const pedidos = await pedidoRepository.find();
    res.status(200).json(pedidos);
  } catch (err) {
    logger.error('Error fetching pedidos: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener un pedido por ID ----------------
export const getPedidoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const pedido = await pedidoRepository.findOne({ where: { ID_Pedido: Number(id) } });

    if (!pedido) {
      logger.warn('Pedido not found for ID_Pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    res.status(200).json(pedido);
  } catch (err) {
    logger.error('Error fetching Pedido by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar un pedido ----------------
export const updatePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updatePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for pedido', errors: validationResult.errors });
  }

  const {
    ID_Cliente,
    ID_Proveedor,
    Tipo_Pedido,
    Fecha_Pedido,
    Fecha_Entrega,
    Comentarios,
    Estado
  } = req.body;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);

    // Verificar si el pedido existe
    const pedido = await pedidoRepository.findOne({ where: { ID_Pedido: Number(id) } });
    if (!pedido) {
      logger.warn('Pedido not found for ID_Pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    // Actualizar el pedido
    pedido.Cliente = ID_Cliente;
    pedido.Proveedor = ID_Proveedor;
    pedido.Tipo_Pedido = Tipo_Pedido;
    pedido.Fecha_Pedido = Fecha_Pedido;
    pedido.Fecha_Entrega = Fecha_Entrega;
    pedido.Comentarios = Comentarios;
    pedido.Estado = Estado;

    await pedidoRepository.save(pedido);
    logger.info('Pedido updated: %o', pedido);
    res.status(200).json(pedido);
  } catch (err) {
    logger.error('Error updating Pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar un pedido ----------------
export const deletePedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);

    // Verificar si el pedido existe
    const pedido = await pedidoRepository.findOne({ where: { ID_Pedido: Number(id) } });
    if (!pedido) {
      logger.warn('Pedido not found for ID_Pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    await pedidoRepository.remove(pedido);
    logger.info('Pedido deleted: %o', pedido);
    res.status(200).json({ message: 'Pedido deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
