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

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;
    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: "No se ha podido actualizar el usuario"});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }

    });
}

function uploadImage(req, res) { 
    
    let userId = req.params.id;
    //let file_name = 'no se ha subido';
    
    if(req.files){
        
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ex = ext_split[1];
        let file_ext = file_ex.toUpperCase();
        if(file_ext == 'PNG' || file_ext == 'JPG' || file_ext == 'GIT'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(404).send({massege: 'no se ha podido actualizar el Usuario'});
                }else{
                    res.status(200).send({user: userUpdated});  
                }
            })
        }
        console.log(file_path);
    }else{
        res.status(200).send({message: 'no ha subido nunguna imagen'});
    }
}

module.exports = {
    prueba,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
};