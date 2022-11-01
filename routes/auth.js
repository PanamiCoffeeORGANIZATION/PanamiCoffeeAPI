const { Router } = require('express');
const { body, check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validationFields } = require('../middlewares/validationFields');

const router = Router();

router.post('/login', [
    body('email', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validationFields
],login );

module.exports = router;