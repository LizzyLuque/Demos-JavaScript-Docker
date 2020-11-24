"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cola_service_1 = __importDefault(require("./cola-service"));
class EscritorioService {
    constructor() {
        this.enAtencion = [];
        this.colas = [];
        this.actual = { id: "", escritorio: "" };
        // se podrian traer de BD, por fines practicos, están en código duro
        // se generan los escritorios de atención
        this.escritorios = [
            { id: "1", nombre: "Información" },
            { id: "2", nombre: "Pagos" },
            { id: "3", nombre: "Cobros" },
            { id: "4", nombre: "Quejas" }
        ];
        this.generaColas();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    //genera una cola por cada escritorio
    generaColas() {
        for (let i = 0; i < this.escritorios.length; i++) {
            this.colas.push(new cola_service_1.default(this.escritorios[i]));
        }
    }
    //retorna la lista de tickets que están siendo atendidos
    dameEnAtencion() {
        return this.enAtencion;
    }
    //retorna el ticket que actualmente está siendo llamado
    dameActual() {
        return this.actual.id !== "" ? this.actual : undefined;
    }
    //genera un ticket en la cola del escritorio solicitado
    generaTicket(id) {
        let index = this.colas.findIndex(x => x.dameEscritorio().id === id);
        return this.colas[index].generaTicket();
    }
    // quita los tickets del escritorio de la lista de atención y de actual
    cerrarTicketsEscritorio(id) {
        if (this.actual.escritorio === id)
            this.actual = { id: "", escritorio: "" };
        else
            this.enAtencion = this.enAtencion.filter(x => x.escritorio !== id);
    }
    // retorna el ticket asignado actualmente al escritorio
    ticketPorAtender(id) {
        let temp;
        if (this.actual.escritorio === id)
            temp = this.actual;
        else {
            let index = this.enAtencion.findIndex(x => x.escritorio === id);
            if (index >= 0)
                temp = this.enAtencion[index];
        }
        return temp;
    }
    // verifica si el escritorio tiene o no tickets asignados
    escritorioDisponible(id) {
        var status = true;
        if (this.actual.escritorio !== id) {
            let index = this.enAtencion.findIndex(x => x.escritorio === id);
            if (index >= 0)
                status = false;
        }
        else {
            status = false;
        }
        return status;
    }
    // quita el primer elemento de la cola del escritorio (parametro id)
    quitarCola(id) {
        // indice de la cola del escritorio solicitado
        let index = this.colas.findIndex(x => x.dameEscritorio().id === id);
        // saca ticket de la cola del escritorio solicitado     
        let ticket = this.colas[index].quitarCola();
        // si realmente habia un ticket en la cola
        if (ticket) {
            // si el actual ticket de atención no pertenece al escritorio solicitado
            if (this.actual.escritorio !== id && this.actual.escritorio !== "") {
                //se agrega a la lista de Atención
                this.enAtencion.unshift(this.actual);
            }
            // el ticket se marca como el que actualmente está siendo llamado
            this.actual = ticket;
        }
        return ticket;
    }
}
exports.default = EscritorioService;
