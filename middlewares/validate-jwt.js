const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const validarJWT = ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            status:false,
            msg:'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETOPRIVATEKEY );
        req.uid = uid;

        next()
    } catch (error) {
        res.status(401).json({
            status: false,
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}