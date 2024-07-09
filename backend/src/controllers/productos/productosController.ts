import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Productos } from '../../entities/productos/productosEntity';
import { productoSchema } from '../../schemas/productos/productosSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(productoSchema);

// ---------------- Crear un producto ----------------
export const createProducto = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createProducto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for producto', errors: validationResult.errors });
  }

  const {
    ID_Proveedor,
    ID_Categoria,
    ID_Bodega,
    Nombre,
    Descripcion,
    Precio_Neto,
    Precio_Venta,
    Fecha_Ingreso,
    Unidad_Medida,
    Stock_Unidades,
    Stock_Cajas,
    Unidades_Por_Caja,
    SKU,
    Descuento,
  } = req.body;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const newProducto = productoRepository.create({
      ID_Proveedor,
      ID_Categoria,
      ID_Bodega,
      Nombre,
      Descripcion,
      Precio_Neto,
      Precio_Venta,
      Fecha_Ingreso,
      Unidad_Medida,
      Stock_Unidades,
      Stock_Cajas,
      Unidades_Por_Caja,
      SKU,
      Descuento,
    });
    await productoRepository.save(newProducto);
    logger.info('Producto created: %o', newProducto);
    res.status(201).json({
      message: 'Producto creado correctamente',
      producto: newProducto
    });
  } catch (err) {
    logger.error('Error creating Producto: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todos los productos ----------------
export const getAllProductos = async (req: Request, res: Response) => {
  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const productos = await productoRepository.find();
    res.status(200).json(productos);
  } catch (err) {
    logger.error('Error fetching productos: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener un producto por ID ----------------
export const getProductoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const producto = await productoRepository.findOne({ where: { ID_Producto: Number(id) } });

    if (!producto) {
      logger.warn('Producto not found for ID_Producto: %s', id);
      return res.status(404).json({ message: 'Producto not found' });
    }

    res.status(200).json(producto);
  } catch (err) {
    logger.error('Error fetching Producto by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar un producto ----------------
export const updateProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateProducto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for producto', errors: validationResult.errors });
  }

  const {
    ID_Proveedor,
    ID_Categoria,
    ID_Bodega,
    Nombre,
    Descripcion,
    Precio_Neto,
    Precio_Venta,
    Fecha_Ingreso,
    Unidad_Medida,
    Stock_Unidades,
    Stock_Cajas,
    Unidades_Por_Caja,
    SKU,
    Descuento,
  } = req.body;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);

    // Verificar si el producto existe
    const producto = await productoRepository.findOne({ where: { ID_Producto: Number(id) } });
    if (!producto) {
      logger.warn('Producto not found for ID_Producto: %s', id);
      return res.status(404).json({ message: 'Producto not found' });
    }

    // Actualizar el producto
    producto.ID_Proveedor = ID_Proveedor;
    producto.ID_Categoria = ID_Categoria;
    producto.ID_Bodega = ID_Bodega;
    producto.Nombre = Nombre;
    producto.Descripcion = Descripcion;
    producto.Precio_Neto = Precio_Neto;
    producto.Precio_Venta = Precio_Venta;
    producto.Fecha_Ingreso = Fecha_Ingreso;
    producto.Unidad_Medida = Unidad_Medida;
    producto.Stock_Unidades = Stock_Unidades;
    producto.Stock_Cajas = Stock_Cajas;
    producto.Unidades_Por_Caja = Unidades_Por_Caja;
    producto.SKU = SKU;
    producto.Descuento = Descuento;

    await productoRepository.save(producto);
    logger.info('Producto updated: %o', producto);
    res.status(200).json(producto);
  } catch (err) {
    logger.error('Error updating Producto: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar un producto ----------------
export const deleteProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);

    // Verificar si el producto existe
    const producto = await productoRepository.findOne({ where: { ID_Producto: Number(id) } });
    if (!producto) {
      logger.warn('Producto not found for ID_Producto: %s', id);
      return res.status(404).json({ message: 'Producto not found' });
    }

    await productoRepository.remove(producto);
    logger.info('Producto deleted: %o', producto);
    res.status(200).json({ message: 'Producto deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Producto: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
