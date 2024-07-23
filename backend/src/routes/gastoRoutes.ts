import { Router } from 'express';
import { createCategoriaGasto, getAllCategoriasGasto } from '../controllers/categoriaGastoController';
import { createGastoConTransaccion, getAllGastos } from '../controllers/gastoController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/crear-categoria-gasto', authMiddleware, roleMiddleware(['gerente']), createCategoriaGasto);
router.get('/categorias-gasto', authMiddleware,roleMiddleware(['gerente']), getAllCategoriasGasto);

router.post('/crear-gasto', authMiddleware, roleMiddleware(['gerente']), createGastoConTransaccion);
router.get('/gastos', authMiddleware, getAllGastos);

export default router;
