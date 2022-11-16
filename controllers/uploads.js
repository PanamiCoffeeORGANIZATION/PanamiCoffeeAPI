const { response } = require("express");
const path = require("path");
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile, findMyModel } = require("../helpers/upload-file");

const fileUpload = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ ok: false, msg: 'No hay archivos para cargar' });
        return;
    }

    let file;
    req.files ? file = req.files.file : res.json({ ok: false, msg: 'No has cargado una imagen' });

    try {
        const resp = await uploadFile(file, req.body.folder);
        return res.json({
            ...resp
        })

    } catch (error) {
        return res.status(400).json({ ...error });
    }

}

// CLOUDINARY IMAGES WAY
// const updateAnyImage = async (req, res = response) => {

//     const { id, collection } = req.params;

//     let model;
//     let file;
//     req.files ? file = req.files.file : res.json({ ok: false, msg: 'No has cargado una imagen' });

//     try {
//         // Get model by ID
//         model = await findMyModel(collection, id);
//         if (model.img) {
//             // Delete image from server
//             // fs allows to kwon if a pathImage exists or not
//             const pathImage = path.join(__dirname, '../uploads', collection, model.img);
//             if (fs.existsSync(pathImage)) {
//                 fs.unlinkSync(pathImage);
//             }
//         }
//     } catch (error) {
//         const { status, ...rest } = error;
//         return res.status(status).json({ ...rest })
//     }

//     try {

//         const { msg } = await uploadFile(file, collection);
//         model.img = msg;

//         await model.save();

//         res.json({
//             model
//         })
//     } catch (error) {
//         res.status(400).json({ ...error })
//     }

// }

// LOCAL IMAGES WAY
const updateAnyImage = async (req, res = response) => {

    const { id, collection } = req.params;
    const { tempFilePath } = req.files.file;

    let model;
    let file;
    req.files ? file = req.files.file : res.json({ ok: false, msg: 'No has cargado una imagen' });

    try {
        // Get model by ID
        model = await findMyModel(collection, id);

    } catch (error) {
        const { status, ...rest } = error;
        return res.status(status).json({ ...rest })
    }

    if ( model.img ) {
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        await cloudinary.uploader.destroy( collection+'/'+public_id );
    }

    const respCloudinary = await cloudinary.uploader.upload( tempFilePath,{folder:collection} );
    model.img = respCloudinary.secure_url;
    model.save();

    res.json({
        ok: true,
        msg: "Imagen actualizada"
    })

}

const showImage = async (req, res = response) => {

    const { id, collection } = req.params;
    let model;

    try {

        model = await findMyModel(collection, id);
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }

    } catch (error) {

        const { status, ...rest } = error;
        return res.status(status).json({ ...rest })

    }

    const pathImageDefault = path.join(__dirname, '../assets/images/sloth.jpg');

    res.sendFile(
        pathImageDefault
    );



}

module.exports = {
    fileUpload,
    showImage,
    updateAnyImage,
}