const { Router } = require('express');
const { body, check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController');
const { categoryByIdExists } = require('../helpers/validatorDB');
const {validateJWT, validationFields, isAdminRole} = require('../middlewares');

const router = Router();

// Get all categories - publico
router.get('/', getCategories )

// Get category by id - publico
router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( categoryByIdExists ),
    validationFields,
], getCategory )

// Create category - privado - cualquier persona con token valido
router.post('/', [
    validateJWT,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    validationFields
], createCategory )

// Update category - privado - cualquier persona con token valido
router.put('/:id', [
    validateJWT,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( categoryByIdExists ),
    validationFields
], updateCategory)

// Delete category - privado - token administrador
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom( categoryByIdExists ),
    validationFields
], deleteCategory )


module.exports = router;