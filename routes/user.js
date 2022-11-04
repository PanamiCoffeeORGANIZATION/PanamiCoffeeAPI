
const { Router } = require('express');
const { body, check } = require('express-validator');

// Custom middlewares
const {validateJWT, validationFields, isAdminRole, hasRole } = require('../middlewares');

const { getUsers, usuariosPut, registerUser, usuariosDelete, usuariosPatch, addPurchase } = require('../controllers/userController');
const { emailExists, isValidRole, userByIdExists } = require('../helpers/validatorDB');

const router = Router();


router.get('/', getUsers );


// UPDATE
router.put('/update/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
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
    body('total', 'El total de la compra es obligatorio').not().isEmpty(),
    body('cant', 'La cantidad debe ser numérica').isNumeric(),
    body('total', 'El total debe ser numérico').isNumeric(),
    validationFields
], addPurchase )





module.exports = router;