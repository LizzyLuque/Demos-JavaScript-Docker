"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_service_1 = __importDefault(require("../services/image-service"));
class ImageController {
    constructor() {
        this._imgService = new image_service_1.default();
    }
    //metodo para recuperar una imagen mediante API rest
    getImage(req, res) {
        let file = req.params.image;
        // solicito la imagen
        let file_to_return = this._imgService.getImage(file);
        //si no existe una imagen
        if (file_to_return === undefined) {
            //respondo con el error
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        }
        else {
            //envio la imagen
            return res.sendFile(file_to_return);
        }
    }
    //metodo para borrar una imagen mediante API rest
    deleteImage(req, res) {
        let file = req.params.image;
        // solicito borrar la imagen
        if (this._imgService.deleteImage(file)) {
            //respondo con success si fue borrada
            return res.status(200).send({
                status: 'success',
                message: 'La imagen fue borrada correctamente!!!'
            });
        }
        else {
            //respondo con error si no pudo ser borrada
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        }
    }
    upload(req, res) {
        var file_name = 'Imagen no subida...';
        // si no tenemos el objeto correcto
        if (!req.files) {
            //respondemos con error
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        // Conseguir nombre y la extensión del archivo
        let file_path = req.files.image.path;
        //NOTA: en el fromt el nombre del input debe ser image
        //conseguimos el ID del artículo con el que esta relacionada
        let articleId = req.params.id;
        // invocamos el metodo para cargar y actualizar el artículo relacionado con la imagen
        let result = this._imgService.upload(file_path, articleId);
        //respodemos el el resultado
        return res.status(200).send(result);
    }
}
exports.default = ImageController;
