/**
 * Reglas de validación de input para Tasks usando express-validator.
 *
 * Se exportan como arrays de middlewares que se insertan directamente en
 * las rutas. Si alguna validación falla, el middleware `validateResult`
 * (más abajo) recolecta los errores y responde 400.
 */
import { body } from 'express-validator';

/** Reglas para crear una tarea: el título es obligatorio y no vacío. */
export const createTaskRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El campo "title" es obligatorio')
    .isLength({ max: 200 })
    .withMessage('El título no puede superar los 200 caracteres'),

  body('done')
    .optional()
    .isBoolean()
    .withMessage('El campo "done" debe ser booleano (true/false)'),
];

/** Reglas para actualizar una tarea: todos los campos son opcionales. */
export const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El campo "title" no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('El título no puede superar los 200 caracteres'),

  body('done')
    .optional()
    .isBoolean()
    .withMessage('El campo "done" debe ser booleano (true/false)'),
];