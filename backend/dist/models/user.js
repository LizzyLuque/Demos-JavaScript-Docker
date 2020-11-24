"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
//Modelo para los usuarios del chat
class User {
    constructor(_id) {
        this._id = _id;
        this.nombre = 'usuario-anónimo';
        this.sala = "sin-sala";
        this.color = "";
    }
}
exports.User = User;
