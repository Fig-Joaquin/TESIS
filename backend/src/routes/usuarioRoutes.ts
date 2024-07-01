import { Router } from 'express';
import { createUsuario, deleteUsuarioByRutPersona } from '../controllers/usuarioController';
import { authMiddleware} from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/crearusuario', authMiddleware, roleMiddleware('gerente'), createUsuario);
router.delete('/eliminarusuario', authMiddleware, roleMiddleware('gerente'), deleteUsuarioByRutPersona); // Nueva ruta para eliminar un usuario

export default router;
