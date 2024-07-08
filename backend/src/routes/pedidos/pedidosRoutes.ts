import { Router } from 'express';
import { createPedido, updatePedido, getAllPedidos, getPedidoById, deletePedido, getPedidosByStatus } from '../../controllers/pedidosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para pedidos
router.post('/crear-pedido', roleMiddleware(['jefe_inventario', 'inventarista']), createPedido);
router.put('/actualizar-pedido/:id', roleMiddleware(['jefe_inventario', 'inventarista']), updatePedido);
router.get('/pedidos', roleMiddleware(['jefe_inventario', 'inventarista']), getAllPedidos);
router.get('/pedidos/:id', roleMiddleware(['jefe_inventario', 'inventarista']), getPedidoById);
router.delete('/eliminar-pedido/:id', roleMiddleware(['jefe_inventario']), deletePedido);
router.get('/pedidos-por-estado', roleMiddleware(['jefe_inventario', 'inventarista']), getPedidosByStatus);

export default router;

