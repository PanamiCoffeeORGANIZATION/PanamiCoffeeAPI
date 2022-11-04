const { response, request } = require("express");
const Category = require("../models/category");


// GET Categories
const getCategories = async ( req, res = response ) => {

    const { from = 0 } = req.query;
    const categories = await Category.find()
    .populate('user', 'name')
    .limit(5)
    .skip( Number(from) )

    res.json({
        ok: true,
        categories
    })

}

// GET Category
const getCategory = async ( req, res = response ) => {

    const { id } = req.params;
    const myCategory = await Category.findById( id ).populate('user', 'name');

    res.json({
        ok: true,
        myCategory
    })

}

// UPDATE Category
const updateCategory = async ( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true });

    res.json({
        ok: true,
        msg: "Categoria actualizada con éxito"
    })

} 

// DELETE Category
const deleteCategory = async ( req, res = response ) => {

    const { id } = req.params;
    const categoryDeleted = await Category.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json({
        ok: true,
        msg: 'Categoria eliminada'
    });

}

// CREATE Categories
const createCategory = async ( req, res = response ) => {

    const nameCategory = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name: nameCategory });

    if ( categoryDB ) {
        return res.status(400).json({
            ok: false,
            msg: `La categoria ${ categoryDB.name }, ya existe`
        })
    }

    const data = {
        name: nameCategory,
        user: req.user._id
    }

    const category = new Category( data );
    await category.save();

    res.status(201).json({
        ok: true,
        category
    })

}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}