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
        default: "https://img.freepik.com/vector-gratis/espuma-amor-cafe-frijoles-icono-dibujos-animados-ilustracion_138676-2575.jpg?w=740&t=st=1667508177~exp=1667508777~hmac=c360eb0dc116570d04bbbeacca3097b99a280aa72034751514c7078b69569e84"
    },
});

ProductSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();

    // Replace from _id to uid
    product.id = _id;
    
    return product;
}

module.exports = model( 'Product', ProductSchema );