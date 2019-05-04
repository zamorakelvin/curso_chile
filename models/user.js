'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});
module.exports = mongoose.model('User', UserSchema);