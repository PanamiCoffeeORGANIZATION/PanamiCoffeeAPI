const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg:'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETOPRIVATEKEY );

        const user = await User.findById( uid );
        
        // User active
        if (!user) return res.status(400).json({
            ok: false,
            msg: "Token no válido | El usuario no existe"
        })

        // User active
        if (!user.state) return res.status(400).json({
            ok: false,
            msg: "Token no válido | El usuario se encuentra inactivo"
        })

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validateJWT
}