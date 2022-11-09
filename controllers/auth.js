const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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
                ok: false
            })
        }
        
        // Password is correct
        const validPassword = bcryptjs.compareSync( password, userExists.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Las credenciales no son correctas',
                ok: false
            })
        }

        // User is active
        if ( !userExists.state ) {
            return res.status(400).json({
                msg: 'El usuarios se encuentra inactivo',
                ok: false
            })
        }

        // Generate JWT
        const token = await generarJWT( userExists.id );

        res.json({
            msg: 'Inicio exitoso',
            ok: true,
            user: userExists,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            ok: false
        })
        
    }

}

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { email, name, img } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {
            
            // Creating user
            const data = {
                name,
                email,
                password: ':<3',
                img,
                google: true,
                role: 'USER_ROLE'
            };

            user = new User( data );
            await user.save();
        }

        // User blocked
        if ( !user.state ) {
            return res.status(401).json({
                ok: false,
                msg: 'El usuario se encuentra bloqueado'
            })
        }

        const token = await generarJWT( user.id );
        
        res.json({
            msg: 'Todo nice',
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}