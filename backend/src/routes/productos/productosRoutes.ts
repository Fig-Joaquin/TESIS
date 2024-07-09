import { Router } from 'express';
import { createProducto, updateProducto, getAllProductos, getProductoById, deleteProducto } from '../../controllers/productos/productosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para productos
router.post('/crear-producto', roleMiddleware(['gerente', 'jefe_inventarista']), createProducto);
router.put('/actualizar-producto/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateProducto);
router.get('/productos', roleMiddleware(['gerente', 'jefe_inventarista']), getAllProductos);
router.get('/productos/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getProductoById);
router.delete('/eliminar-producto/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteProducto);

export default router;
