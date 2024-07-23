import { Router } from 'express';
import { createCategoriaGasto, getAllCategoriasGasto } from '../controllers/categoriaGastoController';
import { createGasto, getAllGastos } from '../controllers/gastoController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/crear-categoria-gasto', authMiddleware, roleMiddleware(['admin']), createCategoriaGasto);
router.get('/categorias-gasto', authMiddleware, getAllCategoriasGasto);

router.post('/crear-gasto', authMiddleware, roleMiddleware(['admin']), createGasto);
router.get('/gastos', authMiddleware, getAllGastos);

export default router;
