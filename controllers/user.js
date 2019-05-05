'use strict'
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');


function prueba(req, res){
    res.status(200).send({
        message: 'probando una accion del controlador de usuarios del api rest'
    });
}

function saveUser(req, res){
    let user = new User();
    let params = req.body;
    
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE ADMIN';
    user.image = 'null';

    if(params.password){
        // Encripta contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                // Guarda el usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar el Usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el Usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Rellene todos los campos, por favor'});
            }
        });
    }else{
        res.status(200).send({message: 'introduce la contraseña, por favor'});
    }
};

function loginUser(req, res){
    let params = req.body;
    let email = params.email;
    let password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if(err){
            res.status(500).send({message: 'Error en la Petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'Lo siento, El usuario no existe'});
            }else{
                // Comprobar contraseña
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        //devolver los datos del usuario logueado
                        if(params.gethash){
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'Contraseña incorrecta, intente de nuevo'});
                    }
                });
            }
        }
    });
}
module.exports = {
    prueba,
    saveUser,
    loginUser
};