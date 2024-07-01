import { Router } from 'express';
import { createPersona } from '../controllers/personaController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/crearpersona', authMiddleware, roleMiddleware(['gerente', 'jefe_administartivo', 'administrativo']), createPersona);

export default router;
