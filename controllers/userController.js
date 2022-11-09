const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const { emailExists } = require('../helpers/validatorDB');

// GET ALL
const getUsers = async (req = request, res = response) => {

    const { from = 0 } = req.query;
    const users = await User.find()
    .limit(5)
    .skip( Number(from) )

    res.json({
        users
    })

}

// GET ONE
const getUserByID = async ( req, res = response ) => {

    const { id } = req.params;
    const user = await User.findById(id);

    res.json({
        user
    })

}

// CREATE
const registerUser = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // password encryption
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // save
    await user.save();

    res.json({
        ok: true,
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

// ADD PURCHASES
const addPurchase = async ( req, res = response ) => {
    
    const { purchase } = await User.findById( req.user.id );
    const { cant, total, ...rest } = req.body;
    const uid = req.user._id;

    const purchaseID = `${uid}${purchase.length + 1}`;
    
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    
    const data = {
        id: purchaseID,
        cant,
        total,
        date: `${year}/${month}/${day}`
    }
    
    // Adding
    purchase.push( data );

    try {
        
        await User.findByIdAndUpdate( uid , { purchase: purchase })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Hubo un error al realizar la compra"
        })
    }

    res.json({
        ok: true,
        msg: "La compra ha sido exitosa",
        purchase
    })

}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { state: false });
    const authUser = req.user;
    
    res.json({
        user,
        authUser
    });
}




module.exports = {
    addPurchase,
    getUserByID,
    getUsers,
    registerUser,
    usuariosPut,
    usuariosDelete,
}