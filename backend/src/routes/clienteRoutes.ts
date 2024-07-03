import { Router } from 'express';
import { createPersonaCliente, filterClientes, getClientes, getClienteByRut, deleteClienteByRut, updateClienteByRut} from '../controllers/clienteController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post(
    '/persona-cliente',
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo']),
    createPersonaCliente
);
router.get('/clientes',
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClientes
)

router.get('/rut-del-cliente/:rut',
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClienteByRut
)
router.get('/clientes/filter', 
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo']),
    filterClientes);

router.put('/clientes/:rut',
    authMiddleware, 
    roleMiddleware(['gerente', 'jefe_administrativo']),
    updateClienteByRut); // Cambiar de id a rut

router.delete('/clientes/:rut',
    authMiddleware,
    roleMiddleware(['gerente', 'jefe_administrativo']),
    deleteClienteByRut); // Cambiar de id a rut

export default router;
