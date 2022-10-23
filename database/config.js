const mongoose = require('mongoose');

const connectionDB = async() => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN );
        console.log("Success connection to DB");

    } catch (error) {
        throw new Error('Error while executing DB')
    }
};

module.exports = {
    connectionDB
};