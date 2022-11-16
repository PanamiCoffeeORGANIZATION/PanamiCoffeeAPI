const { response } = require("express");
const { UserRefreshClient } = require("google-auth-library");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");

const collectionsAllowed = [
    "users",
    "categories",
    "products",
    "productByCategory",
];

// USERS
const searchUsers = async (term = "", res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const user = await User.findById(term);

        return res.json({
            result: user ? [user] : [],
        });
    }

    const regex = new RegExp(term, "i");

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }],
    });

    res.json({
        result: users,
    });
};

// CATEGORIES
const searchCategory = async (term = "", res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const category = await Category.findById(term);

        return res.json({
            result: category ? [category] : [],
        });
    }

    const regex = new RegExp(term, "i");

    const category = await Category.find({
        name: regex,
        status: true,
    });

    res.json({
        result: category,
    });
};

// PRODUCTS
const searchProducts = async (term = "", res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const product = await Product.findById(term);

        return res.json({
            result: product ? [product] : [],
        });
    }

    const regex = new RegExp(term, "i");

    const product = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ state: true }],
    }).populate('category', 'name');

    res.json({
        result: product,
    });
};

// PRODUCTS BY CATEGORY
const searchProductsByCategory = async (word = '', res = response) => {

    const isMongoID = ObjectId.isValid(word)

    if (isMongoID) {
        const product = await Product.find({ category: ObjectId(word), state: true })
            .populate('category', 'name')

        return res.json({
            result: (product) ? [product] : []
        })
    }

    const regex = new RegExp(word, 'i')

    const categories = await Category.find({ name: regex, state: true })

    if ( !categories.length ) {
        return res.json({
            result: []
        })
    }

    const products = await Product.find({
        $or: [...categories.map(category => ({
            category: category._id
        }))],
        $and: [{ state: true }]
    }).populate('category', 'name')

    res.json({
        result:products
    })

}

// SEARCHER
const search = (req, res = response) => {
    const { collection, term } = req.params;

    if (!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            ok: false,
            msg: `Las colecciones permitidas son: ${collectionsAllowed}`,
        });
    }

    switch (collection) {
        case "users":
            searchUsers(term, res);
            break;
        case "categories":
            searchCategory(term, res);
            break;
        case "products":
            searchProducts(term, res);
            break;
        case "productByCategory":
            searchProductsByCategory(term, res);
            break;
        default:
            res.status(500).json({
                ok: false,
                msg: "Falta hacer una busqueda",
            });
    }
};

module.exports = {
    search,
};
