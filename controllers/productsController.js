const { response, request } = require("express");
const Product = require("../models/product");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


// GET Products
const getProducts = async (req, res = response) => {

    const products = await Product.find({ state: true })
        .populate('category', 'name')
        .populate('user', 'name')
        .sort({ name: 1 })


    res.json({
        ok: true,
        products
    })

}

// GET Products Paginated
const getProductsByPage = async (req, res = response) => {

    const { from = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('category', 'name')
            .populate('user', 'name')
            .sort({ name: 1 })
            .limit(5)
            .skip(Number(from))
    ]);


    res.json({
        ok: true,
        products,
        total
    })
}

// GET Product
const getProduct = async (req, res = response) => {

    const { id } = req.params;
    const myProduct = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.json({
        ok: true,
        product: myProduct
    })

}

// UPDATE Product
const updateProduct = async (req, res = response) => {

    const { id } = req.params;

    const { state, user, ...data } = req.body;
    data.user = req.user._id;

    const myProduct = await Product.findById(id);

    // TODO _ VALIDAR QUE CUANDO SE ACTUALIZA UN PRODUCTO Y TRAE UNAIMAGEN, SE DEBE LIMINAR LA ANTERIOR DE CLOUDINARY
    if ( data.img ) {
        const nameArr = myProduct.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        await cloudinary.uploader.destroy( 'products/'+public_id );
    }

    await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
        ok: true,
        msg: "Producto actualizado con exito"
    })

}

// DELETE Product
const deleteProduct = async (req, res = response) => {

    const { id } = req.params;
    const productDeleted = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        ok: true,
        msg: 'Producto eliminado'
    });

}

// CREATE Product
const createProduct = async (req, res = response) => {

    const product = req.body;

    const productDB = await Product.findOne({ name: product.name });

    if (productDB) {
        return res.status(400).json({
            ok: false,
            msg: `El producto ${productDB.name}, ya existe`
        })
    }

    product.user = req.user._id;

    const myProduct = new Product(product);
    await myProduct.save();

    res.status(201).json({
        ok: true,
        msg: "Producto creado con éxito",
        product
    })

}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByPage,
}