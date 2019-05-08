'use strict'

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//carga rutas
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http

// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
/* se utilizo para probar que el servidor este funcionando
app.get('/prueba', (req, res)=>{
    res.status(200).send({message: 'Biemvenidos al curso'});
});*/
module.exports = app;