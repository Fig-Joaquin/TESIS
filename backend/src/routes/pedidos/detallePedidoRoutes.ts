import { Router } from 'express';
import { createDetallePedido, updateDetallePedido, getAllDetallePedidos, getDetallePedidoById, deleteDetallePedido } from '../../controllers/detallePedidoController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para detalle de pedidos
router.post('/crear-detalle-pedido', roleMiddleware(['jefe_inventario', 'inventarista']), createDetallePedido);
router.put('/actualizar-detalle-pedido/:id', roleMiddleware(['jefe_inventario', 'inventarista']), updateDetallePedido);
router.get('/detalle-pedidos', roleMiddleware(['jefe_inventario', 'inventarista']), getAllDetallePedidos);
router.get('/detalle-pedidos/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getDetallePedidoById);
router.delete('/eliminar-detalle-pedido/:id', roleMiddleware(['jefe_inventario']), deleteDetallePedido);

export default router;