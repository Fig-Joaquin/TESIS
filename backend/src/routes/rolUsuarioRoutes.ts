import { Router } from 'express';
import { assignRoleToUser, removeRoleFromUserById, getRolesByUserId } from '../controllers/rolUsuarioController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/asignar-rol', assignRoleToUser);
router.delete('/remove-role/:id', authMiddleware, roleMiddleware(['gerente']), removeRoleFromUserById);
router.get('/roles/:id', authMiddleware, roleMiddleware(['gerente', 'administrativo']), getRolesByUserId);

export default router;
