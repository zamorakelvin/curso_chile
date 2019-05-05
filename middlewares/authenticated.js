'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
let secret = 'clave_secreta_curso';

exports.ensureAuth = (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autentificación'});
    }
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        let payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'});   
        }
    }catch(ex){
        console.log(ex);
        return res.status(404).send({message: 'Token no valido'});
    }

    req.user = payload;
    next();
}