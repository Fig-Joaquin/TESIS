import { Router } from 'express';
import { createBodega, updateBodega, getAllBodegas, getBodegaById, deleteBodega } from '../../controllers/bodegasController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para bodegas
router.post('/crear-bodega', roleMiddleware(['jefe_inventario']), createBodega);
router.put('/actualizar-bodega/:id', roleMiddleware(['jefe_inventario']), updateBodega);
router.get('/bodegas', roleMiddleware(['jefe_inventario', 'inventarista']), getAllBodegas);
router.get('/bodegas/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getBodegaById);
router.delete('/eliminar-bodega/:id', roleMiddleware(['jefe_inventario']), deleteBodega);

export default router;
