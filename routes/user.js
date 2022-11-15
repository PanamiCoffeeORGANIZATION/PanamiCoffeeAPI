
const { Router } = require('express');
const { body, check } = require('express-validator');

// Custom middlewares
const {validateJWT, validationFields, isAdminRole, hasRole } = require('../middlewares');

const { getUsers, getPurchases, usuariosPut, registerUser, usuariosDelete, usuariosPatch, addPurchase, getUserByID, validateToken } = require('../controllers/userController');
const { emailExists, isValidRole, userByIdExists } = require('../helpers/validatorDB');

const router = Router();

// GET ALL
router.get('/', getUsers );

// GET PURCHASES
router.get('/purchases', getPurchases );

// GET ONE
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validationFields
], getUserByID );

// UPDATE
router.put('/update/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validateJWT,
    hasRole('USER_ROLE', 'ADMIN_ROLE'),
    validationFields
],usuariosPut );

// CREATE
router.post('/',[
    body('email', 'El correo no es válido').isEmail(),
    body('email').custom( emailExists ),
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    body('role').custom( isValidRole ),
    validationFields
],registerUser );

// DELETE
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validationFields
],usuariosDelete );

// ADD SALE - private - users
router.put('/purchase', [
    validateJWT,
    hasRole('USER_ROLE'),
    body('cant', 'La cantidad es obligatoria').not().isEmpty(),
    body('products', 'Los productos son requeridos').not().isEmpty(),
    body('total', 'El total de la compra es obligatorio').not().isEmpty(),
    body('cant', 'La cantidad debe ser numérica').isNumeric(),
    body('total', 'El total debe ser numérico').isNumeric(),
    validationFields
], addPurchase )

// VALIDATE TOKEN
router.get('/token/validateToken', [
    validateJWT,
    hasRole('USER_ROLE','ADMIN_ROLE','EMPLOYEE_ROLE'),
], validateToken )





module.exports = router;