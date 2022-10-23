const { response, request } = require('express');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs')
const User = require('../models/user');


const getUsers = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page, 
        limit
    });
}

const registerUser = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // check if mail exists
    const emailExists = await User.findOne({ email });
    if ( emailExists ) {
        return res.json({
            msg : 'Este correo ya se encuentra registrado',
        })
    };

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

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}




module.exports = {
    getUsers,
    registerUser,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}