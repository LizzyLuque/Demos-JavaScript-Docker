"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
var Article = require('../models/article');
class ArticlesController {
    getArticles(req, res) {
        //crear el query
        var query = Article.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        // ejecutar la búsqueda
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                // responder con el error
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }
            if (!articles) {
                // responder con el error
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }
            // Responder con la lista de los artículos
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }
    getArticle(req, res) {
        // Recoger el id de la url
        var articleId = req.params.id;
        // Comprobar que existe
        if (!articleId || articleId == null) {
            // responder con el error
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo !!!'
            });
        }
        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                // responder con el error
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }
            // Responder con el artículo 
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    }
    update(req, res) {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;
        // Recoger los datos que llegan por put
        var params = req.body;
        // Validar datos
        try {
            var validate_title = !validator_1.default.isEmpty(params.title);
            var validate_content = !validator_1.default.isEmpty(params.content);
        }
        catch (err) {
            // responder con el error
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
        if (validate_title && validate_content) {
            // Encontrar el artículo y actualizarlo
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }
                if (!articleUpdated) {
                    // responder con el error
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }
                // responder cuando todo es correcto
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
        else {
            // responder con el error
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
    }
    delete(req, res) {
        // Recoger el id de la url
        var articleId = req.params.id;
        // Encontrar el artículo y borrarlo
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                // responder con el error
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }
            if (!articleRemoved) {
                // responder con el error
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }
            // responder cuando hubo exito al borrar
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    }
    save(req, res) {
        // Recoger parametros por post
        var params = req.body;
        // Validar datos (validator)
        try {
            var validate_title = !validator_1.default.isEmpty(params.title);
            var validate_content = !validator_1.default.isEmpty(params.content);
        }
        catch (err) {
            // responder con el error
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
        if (validate_title && validate_content) {
            //Crear el objeto a guardar
            var article = new Article();
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            if (params.image)
                article.image = params.image;
            else
                article.image = null;
            // Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    // responder con el error
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }
                // Devolver una respuesta correcta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        }
        else {
            // responder codigo 200 con error que maneja el cliente
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }
    }
}
exports.default = ArticlesController;
