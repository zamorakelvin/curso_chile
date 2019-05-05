'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3978;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_chile', (err,res) => {
    if (err){
        throw err;
    }else{
        console.log("la conexión a la base de datos esta corriendo perfectamente......");
        app.listen(port, ()=>{
            console.log("Servior del API Rest Escuchando en http://localhost:"+port);
        });
    }
});