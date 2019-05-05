'use strict'
let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');

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

module.exports = {
    prueba,
    saveUser
};