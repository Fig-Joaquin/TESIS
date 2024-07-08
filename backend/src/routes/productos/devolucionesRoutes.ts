import { Router } from 'express';
import { createDevolucion, updateDevolucion, getAllDevoluciones, getDevolucionById, deleteDevolucion } from '../../controllers/devolucionesController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para devoluciones
router.post('/crear-devolucion', roleMiddleware(['jefe_inventario', 'inventarista']), createDevolucion);
router.put('/actualizar-devolucion/:id', roleMiddleware(['jefe_inventario', 'inventarista']), updateDevolucion);
router.get('/devoluciones', roleMiddleware(['jefe_inventario', 'inventarista']), getAllDevoluciones);
router.get('/devoluciones/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getDevolucionById);
router.delete('/eliminar-devolucion/:id', roleMiddleware(['jefe_inventario']), deleteDevolucion);

export default router;
