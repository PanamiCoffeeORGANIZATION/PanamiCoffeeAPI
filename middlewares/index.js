const validateJwt = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validationFields = require('../middlewares/validationFields');

module.exports = {
    ...validateJwt,
    ...validateRoles,
    ...validationFields,
}

