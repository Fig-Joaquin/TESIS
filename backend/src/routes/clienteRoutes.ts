import { Router } from 'express';
import { createPersonaCliente, filterClientes, getClientes, getClienteByRut,/* deleteClienteByRut*/ updateClienteByRut,getClienteById} from '../controllers/clienteController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.post(
    '/persona-cliente',
    roleMiddleware(['gerente', 'jefe_administrativo']),
    createPersonaCliente); // Checked
router.get('/clientes',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClientes) // Checked

router.get('/rut-del-cliente/:rut',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClienteByRut) // Checked
router.get('/rut-cliente/:id',
    roleMiddleware(['gerente', 'jefe_administrativo','administrativo']),
    getClienteById)  // Checked

router.get('/clientes/filter', 
    roleMiddleware(['gerente', 'jefe_administrativo']),
    filterClientes); // Checked

router.put('/clientes/:rut',
    roleMiddleware(['gerente', 'jefe_administrativo']),
    updateClienteByRut); // Cambiar de id a rut  //! NO Checked

// router.delete('/clientes/:rut',
//     authMiddleware,
//     roleMiddleware(['gerente', 'jefe_administrativo']),
//     deleteClienteByRut); // Cambiar de id a rut

export default router;
