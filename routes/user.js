
const { Router } = require('express');
const { body, check } = require('express-validator');
const { validationFields } = require('../middlewares/validationFields');

const { isValidRole, emailExists, userByIdExists } = require('../helpers/validatorDB'); 

const { getUsers,
        usuariosPut,
        registerUser,
        usuariosDelete,
        usuariosPatch } = require('../controllers/userController');

const router = Router();


router.get('/', getUsers );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validationFields
],usuariosPut );

router.post('/',[
    body('email', 'El correo no es válido').isEmail(),
    body('email').custom( emailExists ),
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    body('role').custom( isValidRole ),
    validationFields
],registerUser );

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validationFields
],usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;