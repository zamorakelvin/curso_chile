'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

let secret = 'clave_secreta_curso';

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        name: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};