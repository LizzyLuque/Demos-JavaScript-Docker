"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dameListaUsuarios = exports.configurarUsuario = exports.mensaje = exports.desconectar = exports.conectarCliente = exports.mapaSockets = exports.colasSockets = void 0;
const escritorio_service_1 = __importDefault(require("../services/escritorio-service"));
const map_service_1 = require("../services/map-service");
const user_service_1 = __importDefault(require("../services/user-service"));
const user_1 = require("../models/user");
const usuariosConectados = user_service_1.default.instance;
const mapa = map_service_1.MapService.instance;
//
// sockets para colas
exports.colasSockets = (cliente, io) => {
    //Cuando la pantalla pública inicia, y pide los tickets
    cliente.on('tickets', () => {
        const colas = escritorio_service_1.default.instance;
        let ticketActual = colas.dameActual();
        let ticketsEnAtencion = colas.dameEnAtencion();
        const payload = {
            ticketActual,
            ticketsEnAtencion
        };
        io.emit('ticket-en-turno', payload);
    });
    //El escritorio se conecta para atender
    cliente.on('escritorio', (payload) => {
        const colas = escritorio_service_1.default.instance;
        let ticketActual = colas.ticketPorAtender(payload.escritorio);
        //solo retorna el tiket que ya le fue asignado (si hay) 
        if (ticketActual)
            io.emit('ticket-nuevo', ticketActual);
    });
};
// sockets para mapas 
exports.mapaSockets = (cliente, io) => {
    cliente.on('marcador-nuevo', (marcador) => {
        mapa.agregarMarcador(marcador);
        // con broadcast se emite a todos los clientes, menos a la onexión recien creada
        cliente.broadcast.emit('marcador-nuevo', marcador);
    });
    cliente.on('marcador-borrar', (id) => {
        mapa.borrarMarcador(id);
        cliente.broadcast.emit('marcador-borrar', id);
    });
    cliente.on('marcador-mover', (marcador) => {
        mapa.moverMarcador(marcador);
        cliente.broadcast.emit('marcador-mover', marcador);
    });
};
// crear usuario nuevo
exports.conectarCliente = (cliente, io) => {
    const usuario = new user_1.User(cliente.id);
    usuariosConectados.agregar(usuario);
};
//borrar usuario desconectado
exports.desconectar = (cliente, io) => {
    cliente.on('disconnect', () => {
        let usr = usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
};
//escuchar mensajes
exports.mensaje = (cliente, io) => {
    cliente.on('mensaje', (payload) => {
        io.emit('mensaje-nuevo', payload);
    });
};
//Configurar usuarios
exports.configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (payload, callback) => {
        usuariosConectados.actualizarNombre(cliente.id, payload);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: 'Usuario ' + payload.nombre + ' configurado',
            idUser: cliente.id
        });
    });
};
//escuchar solicitud de un cliente para saber que usuarios están conectados
exports.dameListaUsuarios = (cliente, io) => {
    cliente.on('lista-usuarios', () => {
        io.in(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
};
