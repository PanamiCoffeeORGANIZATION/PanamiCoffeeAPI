const express = require('express');
const cors = require('cors');
const { connectionDB } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            authPath:  '/api/auth',
            categoriesPath: '/api/categories',
            productsPath:  '/api/products',
            searchPath: '/api/search',
            usersPath:  '/api/users',
        }

        // Connection DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Application routes
        this.routes();
    }

    async connectDB() { 
        await connectionDB();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Read and parse to body
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.paths.authPath, require('../routes/auth'));
        this.app.use( this.paths.categoriesPath, require('../routes/categories'));
        this.app.use( this.paths.productsPath, require('../routes/products'));
        this.app.use( this.paths.searchPath, require('../routes/searcher'));
        this.app.use( this.paths.usersPath, require('../routes/user'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running http://localhost:'+ this.port );
        });
    }

}




module.exports = Server;
