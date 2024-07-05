import { Router } from 'express';
import { createRol, getAllRoles, deleteRolById, deleteRolByName, updateRol } from '../controllers/rolesController';

const router = Router();

router.post('/roles', createRol);
router.get('/roles', getAllRoles);
router.delete('/roles/:id', deleteRolById);
router.delete('/roles/name/:name', deleteRolByName);
router.put('/roles/:id', updateRol);

export default router;
