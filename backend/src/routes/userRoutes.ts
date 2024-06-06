import { Router } from 'express';
import { getUsers, saveUser } from '../controller/UserController';

const router = Router();

router.get('/users', getUsers);
router.post('/users', saveUser);

export default router;
