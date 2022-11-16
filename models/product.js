const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name : {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    state : {
        type: Boolean,
        default : true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Falta agregar una categoría']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    },
    description: { type: String },
    stock: { 
        type: Number,
        required: true,
        default: 0
    },
    img : {
        type: String,
        default: 'https://res.cloudinary.com/samuelrm5/image/upload/v1668624007/products/sloth_vtsksu.jpg'
    },
});

ProductSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();

    // Replace from _id to uid
    product.id = _id;
    
    return product;
}

module.exports = model( 'Product', ProductSchema );