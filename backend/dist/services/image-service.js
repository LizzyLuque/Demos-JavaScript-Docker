"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enviroment_1 = require("../config/enviroment");
var Article = require('../models/article');
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ImageService {
    // metodo para retornar una imagen mediante nombre de archivo
    getImage(file) {
        //contruye ruta de la imagen
        let file_path = enviroment_1.IMAGE_PATH + file;
        let result = true;
        try {
            // se verifica que exista
            var stats = fs_1.default.statSync(file_path);
        }
        catch (err) {
            result = false;
            console.log('El archivo ' + file_path + ' no existe ');
        }
        // si nexiste se retorna el archivo
        if (result)
            return path_1.default.resolve(file_path);
        // si no existe se retorna undefined
        else
            return undefined;
    }
    // metodo para borrar una imagen mediante nombre de archivo
    deleteImage(file) {
        //contruye ruta de la imagen
        let path_file = enviroment_1.IMAGE_PATH + file;
        let result = true;
        try {
            // se verifica que exista
            var stats = fs_1.default.statSync(path_file);
        }
        catch (err) {
            result = false;
            console.log('El archivo ' + path_file + ' no existe ');
        }
        try {
            // se borra el archivo
            fs_1.default.unlinkSync(path_file);
        }
        catch (err) {
            console.error('Error al borrar el archivo: ' + path_file, err);
            result = false;
        }
        // si todo fue ben retornaremos true
        return result;
    }
    upload(file_path, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            let messageJSON = {};
            // * ADVERTENCIA * EN WINDOWS
            //var file_split = file_path.split('\\');
            // * ADVERTENCIA * EN LINUX O MAC
            var file_split = file_path.split('/');
            // Nombre del archivo
            var file_name = file_split[2];
            // Extensión del fichero
            var extension_split = file_name.split('\.');
            var file_ext = extension_split[1];
            //extensiones permitidas
            const extensions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF'];
            // Comprobar la extension, solo imagenes, si es valida borrar el fichero
            if (!extensions.includes(file_ext)) {
                try {
                    fs_1.default.unlinkSync(file_path);
                }
                catch (err) {
                    console.error('Error al borrar el archivo: ' + file_path, err);
                }
                // asignar error de extensión al JSON
                messageJSON = {
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                };
            }
            else {
                // Si todo es valido, sacando id de la url
                if (articleId) {
                    // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                    try {
                        let articleUpdated = yield Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true });
                        if (articleUpdated) {
                            // asignar respuesta correcta al JSON
                            messageJSON = {
                                status: 'success',
                                article: articleUpdated
                            };
                        }
                        else {
                            // asignar error de guadado del nombre de la imagen en el articulo en el JSON
                            messageJSON = {
                                status: 'error',
                                message: 'Error al actualizar el articulo con el nombre de la imagen !!!'
                            };
                        }
                    }
                    catch (error) {
                        // asignar error de guardado al JSON
                        messageJSON = {
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        };
                    }
                }
                else {
                    // asignar respuesta correcta, pero sin actualizar el artículo al JSON
                    messageJSON = {
                        status: 'success',
                        image: file_name
                    };
                }
            }
            return messageJSON;
        });
    }
}
exports.default = ImageService;
