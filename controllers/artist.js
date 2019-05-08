'use strict'

const path = require('path');
const fs = require('fs');
const momgoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
//const Album = require('../models/albun');
//const Song = require('../models/song');

function getArtist(req, res){
    let artisId = req.params.id;

    Artist.findById(artisId, (err, artist) => {
        if(err){
            res.ststus(500).send({message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artita no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
    res.status(200).send({message: 'Metodo getArtist del controlado'});
}
function saveArtist(req, res){
    let artist = new Artist();
    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err,artistStored) =>{
        if (err){
            res.status(500).send({message: 'Error al guardar el artita'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artrista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });
}
function getArtists(req, res){
    if(req.params.page){
        let page = req.params.page;
    }else{
        let page = 1;
    }
    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artist, total)=>{
        if (err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({message: 'no hay artitas'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artist
                });
            }
        }
    });
}
function updateArtist(req, res){
    let artisId =  req.params.id;
    let update = req.body;
    Artist.findByIdAndUpdate(artisId, update, (err, artistUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}
function deleteArtist(req, res){
    let artisId =  req.params.id;
    
    Artist.findByIdAndRemove(artisId, (err, artistRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al borrar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                Albun.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al borrar el album'});
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'El albun no ha sido eliminado'});
                        }else{
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                                 if(err){
                                            res.status(500).send({message: 'Error al borrar la cancion'});
                                }else{
                                    if(!songRemoved){
                                                res.status(404).send({message: 'La cancion no ha sido eliminada'});
                                    }else{
                                                res.status(200).send({artistRemoved});
                                    }       
                                }
                            });
                                    
                        }
                    }
                });
            }
        }
    });
}
function uploadImage(req, res){
    let artisId = req.params.id;
    let file_name = 'no subido...';
    if(req.files){
        
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ex = ext_split[1];
        let file_ext = file_ex.toUpperCase();
        if(file_ext == 'PNG' || file_ext == 'JPG' || file_ext == 'GIT'){
            User.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                //if(!artistId){
                if(!artistUpdated){
                    res.status(404).send({massege: 'no se ha podido actualizar el Usuario'});
                }else{
                    res.status(200).send({artist: artistUpdated});  
                }
            })
        }
        console.log(file_path);
    }else{
        res.status(200).send({message: 'no ha subido nunguna imagen'});
    }
};

function getImageFile(req, res){
    let imageFile = req.params.imageFile;
    let path_file = './uploads/artists/'+imageFile;
    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
};
module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile

}