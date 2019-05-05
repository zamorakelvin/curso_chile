'use strict'

const express = require('express');
const UserController = require('../controllers/user');

let api = express.Router();

api.get('/probando-controlador', UserController.prueba);
api.post('/register', UserController.saveUser);

module.exports = api;