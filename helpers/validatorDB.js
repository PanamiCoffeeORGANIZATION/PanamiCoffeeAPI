const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

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

/** 
 * Categories validator
*/
const categoryByIdExists = async( id ) => {
    const category = await Category.findById(id);
    if ( !category ) {
        throw new Error(`El ID no existe ${id}`)
    }

}

const productByIdExists = async ( id ) => {

    const product = await Product.findById( id );
    if ( !product ) {
        throw new Error(`El ID no existe ${id}`)
    }

}

/**
 * Colection allowed
 */
const colectionsAllowed = ( colection = '', colections = [] ) => {

    const includes = colections.includes( colection );
    if ( !includes ) {
        throw new Error(`La colección ${colection} no es permitida, ${colections}`)
    }

    return true;

}

module.exports = {
    categoryByIdExists,
    colectionsAllowed,
    emailExists,
    isValidRole,
    productByIdExists,
    userByIdExists,
}