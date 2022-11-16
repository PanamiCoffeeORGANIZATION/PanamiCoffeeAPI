const { v4: uuidv4 } = require('uuid');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');

const uploadFile = (file, folder) => {

    return new Promise((resolve, reject) => {

        const cutName = file.name.split('.');
        const extend = cutName[cutName.length - 1];


        // Validate extends
        const validExtents = ['png', 'jpg', 'jpeg'];
        if (!validExtents.includes(extend)) {
            return reject({
                ok: false,
                msg: `La extensión ${extend}, no es permitida (${validExtents})`
            })
        }

        const tempName = uuidv4() + '.' + extend;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject({ ok: false, msg: err });
            }

            resolve({ ok: true, msg: tempName });
        });

    });

}

const findMyModel = async (collection, id) => {

    return new Promise( async (resolve, reject) => {

        let model;

        switch (collection) {
            case 'users':
                model = await User.findById(id);
                if (!model) {
                    return reject({
                        ok: false,
                        msg: 'No existe un usuario con este ID',
                        status: 400
                    })
                }
                break;

            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return reject({
                        ok: false,
                        msg: 'No existe un producto con este ID',
                        status: 400
                    })
                }
                break;
            default:
                return reject({ ok: false, msg: 'Se me olvidó validar esto', status: 500 });
        }

        return resolve(model);

    })

}

module.exports = {
    uploadFile,
    findMyModel
}