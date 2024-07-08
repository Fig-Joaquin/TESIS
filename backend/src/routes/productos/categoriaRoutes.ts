import { Router } from 'express';
import { createCategoria, updateCategoria, getAllCategorias, getCategoriaById, deleteCategoria } from '../../controllers/categoriaController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para categorías
router.post('/crear-categoria', roleMiddleware(['jefe_inventario']), createCategoria);
router.put('/actualizar-categoria/:id', roleMiddleware(['jefe_inventario']), updateCategoria);
router.get('/categorias', roleMiddleware(['jefe_inventario', 'inventarista']), getAllCategorias);
router.get('/categorias/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getCategoriaById);
router.delete('/eliminar-categoria/:id', roleMiddleware(['jefe_inventario']), deleteCategoria);

export default router;
