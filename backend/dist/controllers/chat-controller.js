"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_controller_1 = __importDefault(require("./server-controller"));
const user_service_1 = __importDefault(require("../services/user-service"));
class ChatController {
    constructor() { }
    // metodo para hacer (PING) desde una petición REST
    getMensajes(req, res) {
        res.json({
            ok: true,
            mensaje: 'Todo está bien'
        });
    }
    // metodo para obtener los ids de los usuarios conectados desde una petición REST
    getUsuarios(req, res) {
        const server = server_controller_1.default.instance;
        server.io.clients((err, clientes) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                clientes: clientes
            });
        });
    }
    // metodo para obtener los usuarios conectados desde una petición REST
    getUsuariosDetalle(req, res) {
        const usuariosConectados = user_service_1.default.instance;
        res.json({
            ok: true,
            clientes: usuariosConectados.getLista()
        });
    }
    // metodo para enviar mensajes globales desde una petición REST
    postMensajes(req, res) {
        const cuerpo = req.body.cuerpo;
        const de = req.body.de;
        const server = server_controller_1.default.instance;
        const payload = {
            de,
            cuerpo
        };
        if (de !== undefined && cuerpo !== undefined) {
            server.io.emit('mensaje-nuevo', payload);
            res.json({
                ok: true,
                cuerpo,
                de
            });
        }
        else {
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
    // método para enviar mensajes privados desde una petición REST
    postMensajePrivado(req, res) {
        const cuerpo = req.body.cuerpo;
        const de = req.body.de;
        const color = req.body.color;
        const id = req.params.id;
        const server = server_controller_1.default.instance;
        const payload = {
            de,
            cuerpo,
            color
        };
        if (de !== undefined && cuerpo !== undefined && id !== undefined) {
            server.io.in(id).emit('mensaje-privado', payload);
            res.json({
                ok: true,
                cuerpo,
                de,
                color,
                id
            });
        }
        else {
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
}
exports.default = ChatController;
