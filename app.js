'use strict'

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//carga rutas

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http

// rutas base
app.get('/prueba', (req, res)=>{
    res.status(200).send({message: 'Biemvenidos al curso'});
});
module.exports = app;