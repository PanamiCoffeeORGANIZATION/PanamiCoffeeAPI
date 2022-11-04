const { Router } = require('express');
const { body, check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validationFields } = require('../middlewares/validationFields');

const router = Router();

router.post('/login', [
    body('email', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validationFields
],login );

router.post('/google', [
    body('id_token', 'El id_token es necesario').not().isEmpty(), 
    validationFields
],googleSignIn );

module.exports = router;