import { Router } from 'express';
import { createRegistroPrecio, updateRegistroPrecio, getAllRegistroPrecios, getRegistroPrecioById, deleteRegistroPrecio } from '../../controllers/registroPreciosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para registro de precios
router.post('/crear-registro-precio', roleMiddleware(['gerente', 'jefe_inventarista']), createRegistroPrecio);
router.put('/actualizar-registro-precio/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateRegistroPrecio);
router.get('/registro-precios', roleMiddleware(['gerente', 'jefe_inventarista']), getAllRegistroPrecios);
router.get('/registro-precios/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getRegistroPrecioById);
router.delete('/eliminar-registro-precio/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteRegistroPrecio);

export default router;
