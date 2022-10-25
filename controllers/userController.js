const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const { emailExists } = require('../helpers/validatorDB');


const getUsers = async (req = request, res = response) => {

    const { from = 0 } = req.query;
    const users = await User.find()
    .limit(5)
    .skip( Number(from) )

    res.json({
        users
    })

}

const registerUser = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // password encryption
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // save
    await user.save();

    res.json({
        msg: 'Registro Exitoso',
        user
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest )

    res.json({ user });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { state: false });
    
    res.json({
        user
    });
}




module.exports = {
    getUsers,
    registerUser,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}