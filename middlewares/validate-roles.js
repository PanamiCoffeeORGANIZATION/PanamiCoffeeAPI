const { response } = require("express");

const isAdminRole = ( req, res = response, next ) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar primero token",
            ok: false
        })

    }
    const { role } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: "Esta acción es propia del administrador",
            ok: false
        })
    }
    next();
}

const hasRole = ( ...roles ) => {

    return ( req, res = response, next ) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar primero token",
                ok: false
            })
        }

        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: "No puedes realizar esta acción, verifica tus credenciales",
                ok: false
            })
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}
