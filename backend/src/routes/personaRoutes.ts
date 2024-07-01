import { Router } from 'express';
import { createPersona } from '../controllers/personaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/crearpersona', authMiddleware, createPersona);

export default router;
