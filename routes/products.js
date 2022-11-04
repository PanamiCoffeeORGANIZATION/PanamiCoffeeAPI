
const { Router } = require('express');
const { body, check } = require('express-validator');

// Custom middlewares
const {validateJWT, validationFields, isAdminRole } = require('../middlewares');

const { userByIdExists, categoryByIdExists, productByIdExists } = require('../helpers/validatorDB');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productsController');

const router = Router();


router.get('/', getProducts );

// Get Product by id - publico
router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( productByIdExists ),
    validationFields,
], getProduct )

// CREATE Product - private - Admin
router.post('/',[
    validateJWT,
    isAdminRole,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('price', 'El precio es obligatorio').not().isEmpty(),
    body('category').isMongoId(),
    body('category').custom( categoryByIdExists ),
    body('stock', 'El stock es obligatorio').not().isEmpty(),
    validationFields
], createProduct  );

// UPDATE Product - private - Admin
router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productByIdExists ),
    body('category', "El ID de la categoría no es válido").isMongoId(),
    body('category').custom( categoryByIdExists ),
    validationFields
], updateProduct );

// DELETE Product - private - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productByIdExists ),
    validationFields
], deleteProduct  );


module.exports = router;