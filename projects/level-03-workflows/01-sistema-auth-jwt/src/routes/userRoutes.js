import { Router } from 'express';
import { getProfile, createAdmin } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/me', getProfile);

// Solo un admin puede crear otros admins
router.post('/admin', authorize('admin'), createAdmin);

export default router;