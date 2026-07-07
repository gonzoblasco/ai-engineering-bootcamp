import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchema.js';

const router = Router();

router.post('/', validate(createProductSchema), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', productController.remove);

export default router;