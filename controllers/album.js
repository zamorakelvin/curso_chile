'use strict'

const path = require('path');
const fs = require('fs');
const momgoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res){
    let albumId = req.params.id;

    Album.findById(albumId.populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.ststus(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    }));
    res.status(200).send({message: 'Metodo getAlbum del controlado'});
}
function saveAlbum(req, res){
    let album = new Album();
    let params = req.body;
    album.name = params.name;
    album.description = params.description;
    album.year = params. year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err,AlbumStored) =>{
        if (err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'El album no ha sido guardado'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });
}
function getAlbums(req, res){
    let artistId = req.params.artist;
    if(!attistId){
        // sacar todos los albums de la bbdd
        let find = Album.find({}).sort('titel');
    }else{
        // sacar los albums de un artista contreto de la bbdd
        let find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums)=>{
        if (err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message: 'no hay albums'});
            }else{
                res.status(200).send({albums});
            }
        }
    });    
}
function updateAlbum(req, res){
    let albumId =  req.params.id;
    let update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'El album no ha sido actualizado'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}
function deleteAlbum(req, res){
    let albumId =  req.params.id;
    Album.find({artist: albumId}).remove((err, albumRemoved)=>{
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
                            res.status(200).send({album: albumRemoved});
                        }       
                    }
                });
                        
            }
        }
    });

}
function uploadImage(req, res){
    let albumId = req.params.id;
    let file_name = 'no subido...';
    if(req.files){
        
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ex = ext_split[1];
        let file_ext = file_ex.toUpperCase();
        if(file_ext == 'PNG' || file_ext == 'JPG' || file_ext == 'GIT'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                //if(!artistId){
                if(!albumUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el album'});
                }else{
                    res.status(200).send({album: albumUpdated});  
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
    let path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
};
module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}