import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Detalle_Pedido } from '../../entities/pedidos/detallePedidoEntity';
import { detallePedidoSchema } from '../../schemas/pedidos/detallePedidoSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(detallePedidoSchema);

// ---------------- Crear un detalle de pedido ----------------
export const createDetallePedido = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createDetallePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for detalle de pedido', errors: validationResult.errors });
  }

  const {
    ID_Pedido,
    ID_Productos,
    Cantidad,
    Precio_Total,
    Descuento
  } = req.body;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(Detalle_Pedido);
    const newDetallePedido = detallePedidoRepository.create({
      ID_Pedido,
      ID_Producto: ID_Productos,
      Cantidad,
      Precio_Total,
      Descuento
    });
    await detallePedidoRepository.save(newDetallePedido);
    logger.info('Detalle de pedido created: %o', newDetallePedido);
    res.status(201).json(newDetallePedido);
  } catch (err) {
    logger.error('Error creating detalle de pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todos los detalles de pedidos ----------------
export const getAllDetallePedidos = async (req: Request, res: Response) => {
  try {
    const detallePedidoRepository = AppDataSource.getRepository(Detalle_Pedido);
    const detalles = await detallePedidoRepository.find();
    res.status(200).json(detalles);
  } catch (err) {
    logger.error('Error fetching detalles de pedidos: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener un detalle de pedido por ID ----------------
export const getDetallePedidoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(Detalle_Pedido);
    const detalle = await detallePedidoRepository.findOne({ where: { ID_Detalle: Number(id) } });

    if (!detalle) {
      logger.warn('Detalle de pedido not found for ID_Detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    res.status(200).json(detalle);
  } catch (err) {
    logger.error('Error fetching detalle de pedido by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar un detalle de pedido ----------------
export const updateDetallePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateDetallePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for detalle de pedido', errors: validationResult.errors });
  }

  const {
    ID_Pedido,
    ID_Productos,
    Cantidad,
    Precio_Total,
    Descuento
  } = req.body;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(Detalle_Pedido);

    // Verificar si el detalle de pedido existe
    const detalle = await detallePedidoRepository.findOne({ where: { ID_Detalle: Number(id) } });
    if (!detalle) {
      logger.warn('Detalle de pedido not found for ID_Detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    // Actualizar el detalle de pedido
    detalle.ID_Pedido = ID_Pedido;
    detalle.ID_Producto = ID_Productos;
    detalle.Cantidad = Cantidad;
    detalle.Precio_Total = Precio_Total;
    detalle.Descuento = Descuento;

    await detallePedidoRepository.save(detalle);
    logger.info('Detalle de pedido updated: %o', detalle);
    res.status(200).json(detalle);
  } catch (err) {
    logger.error('Error updating detalle de pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar un detalle de pedido ----------------
export const deleteDetallePedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(Detalle_Pedido);

    // Verificar si el detalle de pedido existe
    const detalle = await detallePedidoRepository.findOne({ where: { ID_Detalle: Number(id) } });
    if (!detalle) {
      logger.warn('Detalle de pedido not found for ID_Detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    await detallePedidoRepository.remove(detalle);
    logger.info('Detalle de pedido deleted: %o', detalle);
    res.status(200).json({ message: 'Detalle de pedido deleted successfully' });
  } catch (err) {
    logger.error('Error deleting detalle de pedido: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
