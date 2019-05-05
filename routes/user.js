'use strict'

const express = require('express');
const UserController = require('../controllers/user');

let api = express.Router();
let md_auth = require('../middlewares/authenticated');

api.get('/probando-controlador',md_auth.ensureAuth, UserController.prueba);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;