"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColaService {
    constructor(escritorio) {
        this.cola = [];
        this.numTicket = 0;
        this.escritorio = escritorio;
    }
    dameEscritorio() {
        return this.escritorio;
    }
    generaTicket() {
        let texto = this.escritorio.nombre.substring(0, 2).toUpperCase();
        let num = (++this.numTicket).toString();
        var ticket = "";
        for (let i = num.length; i < 3; i++) {
            ticket += "0";
        }
        let newTicket = { id: texto + "-" + ticket + num, escritorio: this.escritorio.id };
        if (newTicket)
            this.agregarAcola(newTicket);
        return newTicket;
    }
    agregarAcola(ticket) {
        this.cola.push(ticket);
    }
    dameCola() {
        return this.cola;
    }
    quitarCola() {
        return this.cola.shift();
    }
}
exports.default = ColaService;
