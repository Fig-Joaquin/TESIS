import { Router } from 'express';
import { createProducto, updateProducto, getAllProductos, getProductoById, deleteProducto } from '../../controllers/productosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para productos
router.post('/crear-producto', roleMiddleware(['jefe_inventario', 'inventarista']), createProducto);
router.put('/actualizar-producto/:id', roleMiddleware(['jefe_inventario', 'inventarista']), updateProducto);
router.get('/productos', roleMiddleware(['jefe_inventario', 'inventarista']), getAllProductos);
router.get('/productos/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getProductoById);
router.delete('/eliminar-producto/:id', roleMiddleware(['jefe_inventario']), deleteProducto);

export default router;
