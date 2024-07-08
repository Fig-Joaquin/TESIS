import { Router } from 'express';
import { createRegistroPrecio, updateRegistroPrecio, getAllRegistroPrecios, getRegistroPrecioById, deleteRegistroPrecio } from '../../controllers/registroPreciosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para registro de precios
router.post('/crear-registro-precio', roleMiddleware(['jefe_inventario', 'inventarista']), createRegistroPrecio);
router.put('/actualizar-registro-precio/:id', roleMiddleware(['jefe_inventario', 'inventarista']), updateRegistroPrecio);
router.get('/registro-precios', roleMiddleware(['jefe_inventario', 'inventarista']), getAllRegistroPrecios);
router.get('/registro-precios/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getRegistroPrecioById);
router.delete('/eliminar-registro-precio/:id', roleMiddleware(['jefe_inventario']), deleteRegistroPrecio);

export default router;
