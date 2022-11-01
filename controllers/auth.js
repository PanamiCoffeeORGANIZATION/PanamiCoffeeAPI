const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const login = async ( req, res = response ) => {

    const { email, password } = req.body;
    try {
        
        // Email exists
        const userExists = await User.findOne({ email });
        if ( !userExists ) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas',
                status: false
            })
        }
        
        // Password is correct
        const validPassword = bcryptjs.compareSync( password, userExists.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas',
                status: false
            })
        }

        // User is active
        if ( !userExists.state ) {
            return res.status(400).json({
                msg: 'El usuarios se encuentra inactivo',
                status: false
            })
        }

        // Generate JWT
        const token = await generarJWT( userExists.id );

        res.json({
            msg: 'Inicio exitoso',
            status: true,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            status: false
        })
        
    }

}

module.exports = {
    login
}