"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = __importDefault(require("../controllers/article-controller"));
const chart_controller_1 = __importDefault(require("../controllers/chart-controller"));
const map_controller_1 = __importDefault(require("../controllers/map-controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth-controller"));
const authenticateJWT_1 = require("../middlewares/authenticateJWT");
const chat_controller_1 = __importDefault(require("../controllers/chat-controller"));
const colas_controller_1 = __importDefault(require("../controllers/colas.controller"));
const image_controller_1 = __importDefault(require("../controllers/image-controller"));
const router = express_1.Router();
//Chat
const chat = new chat_controller_1.default();
// gráficas
const charts = new chart_controller_1.default();
// mapas
const mapa = new map_controller_1.default();
// Colas
const colas = new colas_controller_1.default();
//CRUD
const article = new article_controller_1.default();
var multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/articles' });
//CRUD images
const image = new image_controller_1.default();
//Login
const auth = new auth_controller_1.default();
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Rutas MAPAS /////////////////
// Api REST para los marcadores existentes
router.get('/mapa', (req, res) => { mapa.getMapa(req, res); });
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
////////////  Rutas GRAFICAS ////////////////
// Api REST para obtener los valores de la gráfica 
router.get('/valores/:chart', (req, res) => { charts.getValores(req, res); });
// Api REST para actualizar los valores de la gráfica de barras
router.post('/updateBarChart', (req, res) => { charts.postUpdateBarChart(req, res); });
// Api REST para actualizar los valores de la gráfica de linea
router.post('/update', (req, res) => { charts.postUpdate(req, res); });
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Rutas CHAT //////////////////
// Api REST mensajes (PING)
router.get('/mensajes', (req, res) => { chat.getMensajes(req, res); });
// Api REST para obtener los ids de los usuarios
router.get('/usuarios', (req, res) => { chat.getUsuarios(req, res); });
// Api REST para obtener los usuarios conectados
router.get('/usuarios-detalle', (req, res) => { chat.getUsuariosDetalle(req, res); });
// Api REST para enviar mensajes globales
router.post('/mensajes', (req, res) => { chat.postMensajes(req, res); });
// Api REST para enviar mensajes privados
router.post('/mensajes/:id', (req, res) => { chat.postMensajePrivado(req, res); });
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//////////////  Routas CRUD /////////////////
//API para guardar un artículo 
router.post('/save', (req, res) => { article.save(req, res); });
//API para obtener los artículos de la base de datos | los ultimos 5 si el paramétro las está poblado
router.get('/articles/:last?', authenticateJWT_1.authenticateJWT, (req, res) => { article.getArticles(req, res); });
//API para obtener el artículo con _id igual al parámetro id
router.get('/article/:id', authenticateJWT_1.authenticateJWT, (req, res) => { article.getArticle(req, res); });
//API para actualizar el artículo con _id igual al parámetro id
router.put('/article/:id', (req, res) => { article.update(req, res); });
//API para borrar el artículo con _id igual al parámetro id
router.delete('/article/:id', authenticateJWT_1.authenticateJWT, (req, res) => { article.delete(req, res); });
//API para retornar la imagen con nombre igual al parámetro image
router.get('/get-image/:image', (req, res) => { image.getImage(req, res); });
//API para subir una imagen al servidor y asociarla al artículo con _id igual al parámetro id
router.post('/upload-image/:id', md_upload, (req, res) => { image.upload(req, res); });
//API para borrar una imagen del servidor utilizando el parámetro image como nombre del fichero
router.delete('/delete-image/:image', (req, res) => { image.deleteImage(req, res); });
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////// INICIO RUTAS COLAS //////////////
// Api REST generar y encolar ticket
router.post('/ticket', (req, res) => { colas.postTicket(req, res); });
// Api REST para solicitar ticket a atender
router.post('/ticket-en-turno', (req, res) => { colas.postTicketEnTurno(req, res); });
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////  Routas LOGIN  ////////////////
// API para iniciar sesión
router.post('/login', (req, res) => { auth.login(req, res); });
//API para registrarse e iniciar sesión
router.post('/register', (req, res) => { auth.register(req, res); });
exports.default = router;
