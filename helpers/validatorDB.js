const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`El rol <${role}> no es correcto`)
    }
};

// check if mail exists
const emailExists = async ( email = '' ) => {
    const validationEmail = await User.findOne({ email });
    if ( validationEmail ) {
        throw new Error(`El correo ya se encuentra registrado`)
    }
};

const userByIdExists = async( id ) => {
    const userExists = await User.findById(id);
    if ( !userExists ) {
        throw new Error(`El ID no existe ${id}`)
    }

}

module.exports = {
    isValidRole,
    emailExists,
    userByIdExists
}