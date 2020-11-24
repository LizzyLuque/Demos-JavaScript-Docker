"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor() {
        this.lista = [];
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    ///agregar usuario
    agregar(usuario) {
        this.lista.push(usuario);
        return usuario;
    }
    ///actualizar nombre de un usuario
    actualizarNombre(_id, user) {
        for (let usr of this.lista) {
            if (usr._id == _id) {
                usr.nombre = user.nombre;
                usr.color = user.color;
                usr.sala = user.sala;
                break;
            }
        }
    }
    ///obtener lista de usuarios
    getLista() {
        return this.lista.filter(usr => usr.nombre !== 'usuario-anónimo');
    }
    ///obtener un usuario
    getUsuario(id) {
        return this.lista.find(usuario => usuario._id === id);
    }
    ///obtener lista de usuarios en sala
    getUsuariosEnSala(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }
    /// borra un usuario
    borrarUsuario(id) {
        const tempUsr = this.getUsuario(id);
        this.lista = this.lista.filter(usr => usr._id !== id);
        return tempUsr;
    }
}
exports.default = UserService;
