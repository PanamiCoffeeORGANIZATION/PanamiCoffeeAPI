
const { Router } = require('express');
const { body, check } = require('express-validator');
const { fileUpload, updateAnyImage, showImage } = require('../controllers/uploads');
const { colectionsAllowed } = require('../helpers/validatorDB');

// Custom middlewares
const {validateJWT, validationFields, isAdminRole, hasRole } = require('../middlewares');

const router = Router();

router.post('/', fileUpload);

router.put('/:collection/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('collection').custom( c => colectionsAllowed( c, ['users','products'])),
    validationFields
], updateAnyImage);

router.get('/:collection/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('collection').custom( c => colectionsAllowed( c, ['users','products'])),
    validationFields
], showImage);

module.exports = router;