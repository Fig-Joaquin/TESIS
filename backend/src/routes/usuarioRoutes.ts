import { Router } from 'express';
import {
  createUsuario,
  updateUsuario,
  getAllUsuarios,
  getUsuarioById,
  deleteUsuario,
  resetUsuarioPassword,
} from '../controllers/usuarioController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

// Ruta para crear un nuevo usuario
router.post(
  '/crearusuario',
  authMiddleware,
  roleMiddleware(['gerente', 'jefe_administrativo']),
  createUsuario
);

// Ruta para actualizar un usuario
router.put(
  '/:id',
//   authMiddleware,
//   roleMiddleware(['gerente', 'jefe_administrativo']),
  updateUsuario
);

// Ruta para obtener todos los usuarios
router.get(
  '/',
//   authMiddleware,
//   roleMiddleware(['gerente', 'jefe_administrativo']),
  getAllUsuarios
);

// Ruta para obtener un usuario por su ID
router.get(
  '/:id',
//   authMiddleware,
//   roleMiddleware(['gerente', 'jefe_administrativo']),
  getUsuarioById
);

// Ruta para eliminar un usuario por su ID
router.delete(
  '/:id',
//   authMiddleware,
//   roleMiddleware(['gerente', 'jefe_administrativo']),
  deleteUsuario
);

// Ruta para restablecer la contraseña de un usuario
router.post(
  '/reset-password',
//   authMiddleware,
//   roleMiddleware(['gerente', 'jefe_administrativo']),
  resetUsuarioPassword
);

export default router;
