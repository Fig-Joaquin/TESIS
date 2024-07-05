import { Router } from "express";

import {createComuna,
        updateComuna, 
        getAllComunas, 
        getComunaById}
    from "../controllers/comunaController"

import { authMiddleware, roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();    

// ! Eliminar JEFE ADMINISTRATIVO
router.get('/mostrar-comunas', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), getAllComunas);
router.post('/crear-comuna', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), createComuna);
router.get('/mostrar-comuna/:id', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), getComunaById);
router.put('/actualizar-comuna/:id', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo']), updateComuna);

export default router;
