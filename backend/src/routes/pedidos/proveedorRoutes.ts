import { Router } from 'express';
import { createProveedor, updateProveedor, getAllProveedores, getProveedorById, deleteProveedor } from '../../controllers/proveedorController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para proveedores
router.post('/crear-proveedor', roleMiddleware(['jefe_inventario']), createProveedor);
router.put('/actualizar-proveedor/:id', roleMiddleware(['jefe_inventario']), updateProveedor);
router.get('/proveedores', roleMiddleware(['jefe_inventario', 'inventarista']), getAllProveedores);
router.get('/proveedores/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getProveedorById);
router.delete('/eliminar-proveedor/:id', roleMiddleware(['jefe_inventario']), deleteProveedor);

export default router;
