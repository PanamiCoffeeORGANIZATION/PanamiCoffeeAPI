const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const Product = require('../models/product');

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

// Validate TOKEN
const validateToken = async ( req, res = response ) => {

    res.json({
        ok: true,
        msg: 'El token es válido',
        user: req.user
    })

}

// ADD PURCHASES
const addPurchase = async ( req, res = response ) => {
    
    const { purchase } = await User.findById( req.user.id );
    const { cant, total, products, ...rest } = req.body;

    const uid = req.user._id;

    const purchaseID = `${uid}${purchase.length + 1}`;
    
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    // Formating minutes-adding zero if it has one character
    const time = new Date();
    let minutes = time.getMinutes();
    minutes < 10 ? minutes = `0${minutes}` : minutes
    
    const data = {
        id: purchaseID,
        cant,
        total,
        products,
        time: `${time.getHours()}:${minutes}`,
        date: `${year}/${month}/${day}`
    }
    
    // Adding
    purchase.push( data );

    try {
        
        await User.findByIdAndUpdate( uid , { purchase: purchase });

        // Removing items from stock
        products.map( async product => {

            const { stock } = await Product.findById( product.id );
            await Product.findByIdAndUpdate( product.id, { stock : stock - product.amount } )

        })

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
    validateToken
}