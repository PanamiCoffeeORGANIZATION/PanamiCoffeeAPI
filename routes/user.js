
const { Router } = require('express');
const { body } = require('express-validator');
const { validationFields } = require('../middlewares/validationFields')

const { getUsers,
        usuariosPut,
        registerUser,
        usuariosDelete,
        usuariosPatch } = require('../controllers/userController');

const router = Router();


router.get('/', getUsers );

router.put('/:id', usuariosPut );

router.post('/',[
    body('email', 'El correo no es válido').isEmail(),
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    body('role', 'Este no es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE','TRABAJADOR_ROLE']),
    validationFields
],registerUser );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;