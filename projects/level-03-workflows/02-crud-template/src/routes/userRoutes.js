import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

const router = Router();

router.post('/', validate(createUserSchema), userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;