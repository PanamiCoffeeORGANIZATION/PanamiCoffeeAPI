const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name : {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required : [true, 'El correo es obligatorio'],
        unique : true
    },
    password : {
        type: String,
        required : [true, 'La contraseña es obligatoria'],
    },
    img : {
        type: String,
        default: "https://img.freepik.com/vector-gratis/lindo-buho-bebiendo-cafe-dibujos-animados-vector-icono-ilustracion-animal-bebida-icono-concepto-aislado-plano_138676-4573.jpg?w=740&t=st=1667919443~exp=1667920043~hmac=1f5ed6d05d63d99d30f7915274a640775938f0484d2f65653b5a3eeaa5041f9d"
    },
    role : {
        type: String,
        required : true,
        enum : [ "ADMIN_ROLE" , "USER_ROLE", "TRABAJADOR_ROLE" ]
    },
    state : {
        type: Boolean,
        default : true
    },
    google : {
        type: Boolean,
        default : false
    },
    purchase : {
        type: Array,
        default: []
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();

    // Replace from _id to uid
    user.uid = _id;
    
    return user;
}

module.exports = model( 'User', UserSchema );