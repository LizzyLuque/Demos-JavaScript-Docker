"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_controller_1 = __importDefault(require("./server-controller"));
const escritorio_service_1 = __importDefault(require("../services/escritorio-service"));
class ColasController {
    constructor() {
        this.colas = escritorio_service_1.default.instance;
    }
    // método para generar y encolar ticket
    postTicket(req, res) {
        const server = server_controller_1.default.instance;
        const escritorio = req.body.escritorio;
        if (escritorio !== undefined) {
            //genero el ticket y se encola
            let ticket = this.colas.generaTicket(escritorio);
            //solicito el estatus del escritorio al que pertenece el ticket solicitado
            let status = this.colas.escritorioDisponible(escritorio);
            //si esta disponible el escritorio 
            if (status) {
                //solicito el siguiente ticket en el escritorio al que pertenece el ticket solicitado
                let ticketActual = this.colas.quitarCola(escritorio);
                if (ticketActual !== undefined) { // si existe un ticket por atender
                    //solicito los tickets en atención para respoder
                    let ticketsEnAtencion = this.colas.dameEnAtencion();
                    //armo el objeto de respuesta a la pantalla del público
                    const payload = {
                        ticketActual,
                        ticketsEnAtencion
                    };
                    // emito tickets a la pantalla del público
                    server.io.emit('ticket-en-turno', payload);
                    //  Y Emito ticket a escritorio
                    server.io.emit('ticket-nuevo', ticketActual);
                }
            }
            // Ticket para mostrar al usuario mediante API rest
            if (ticket) {
                res.json(ticket);
            }
            else {
                // En caso de error al generar el ticket respondo
                res.status(400).send({ message: 'Error al generar el ticket.' });
            }
        }
        else {
            // En caso de petición erronea
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
    // método para solicitar ticket a atender
    postTicketEnTurno(req, res) {
        const server = server_controller_1.default.instance;
        const escritorio = req.body.escritorio;
        if (escritorio !== undefined) {
            // cierro todos los tickets de este escritorio 
            this.colas.cerrarTicketsEscritorio(escritorio);
            // solicito ticket nuevo
            let ticketActual = this.colas.quitarCola(escritorio);
            // si existe un ticket por atender
            if (ticketActual !== undefined) {
                //solicito los tickets en atención para respoder
                let ticketsEnAtencion = this.colas.dameEnAtencion();
                //armo el objeto de respuesta a la pantalla del público
                const payload = {
                    ticketActual,
                    ticketsEnAtencion
                };
                // Emito ticket al público
                server.io.emit('ticket-en-turno', payload);
                //respondo a escritorio con el ticket mediante API Rest 
                res.json({
                    ok: true,
                    ticket: ticketActual
                });
            }
            else {
                //respondo a escritorio cuando no hay tickets mediante API Rest 
                res.status(200).send({ ok: false, message: 'Por el momento no hay tikets por atender' });
            }
        }
        else {
            // En caso de petición erronea
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
}
exports.default = ColasController;
