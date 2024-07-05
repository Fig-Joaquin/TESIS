import {Router} from 'express';
import {createRegion} from '../controllers/regionController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

// ! Eliminar JEFE ADMINISTRATIVO
router.post('/crear-region', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), createRegion);

export default router;
