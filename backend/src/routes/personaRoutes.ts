import { Router } from 'express';
import { 
        createPersona, 
        updatePersona, 
        getAllPersonas, 
        getPersonaById, 
        searchPersonas, 
        countPersonas, 
        deletePersona 
    } from '../controllers/personaController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.post('/crear-persona', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), createPersona);
router.put('/actualizar-persona/:rut', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), updatePersona);
router.get('/mostrar-personas', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getAllPersonas);
router.delete('/eliminar-persona/:rut', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), deletePersona);
router.get('/buscarpersonas-criterios', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), searchPersonas);
router.get('/contar-personas', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), countPersonas);
router.get('/buscar-persona/:rut', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getPersonaById); // Replace 'getPersonaByRut' with 'getPersonaById'

export default router;
