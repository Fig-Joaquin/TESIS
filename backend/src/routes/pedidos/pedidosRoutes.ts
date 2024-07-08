import { Router } from 'express';
import { createPedido, updatePedido, getAllPedidos, getPedidoById, deletePedido, getPedidosByStatus } from '../../controllers/pedidosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para pedidos
router.post('/crear-pedido', roleMiddleware(['gerente', 'jefe_inventarista']), createPedido);
router.put('/actualizar-pedido/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updatePedido);
router.get('/pedidos', roleMiddleware(['gerente', 'jefe_inventarista']), getAllPedidos);
router.get('/pedidos/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getPedidoById);
router.delete('/eliminar-pedido/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deletePedido);
router.get('/pedidos-por-estado', roleMiddleware(['gerente', 'jefe_inventarista']), getPedidosByStatus);

export default router;

