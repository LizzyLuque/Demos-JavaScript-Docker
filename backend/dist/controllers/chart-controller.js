"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chart_service_1 = __importDefault(require("../services/chart-service"));
const server_controller_1 = __importDefault(require("./server-controller"));
class ChartController {
    constructor() {
        this.lineChart = new chart_service_1.default('Ventas', ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']);
        this.barChartSi = new chart_service_1.default('Si', ['1', '2', '3', '4']);
        this.barChartNo = new chart_service_1.default('No', ['1', '2', '3', '4']);
    }
    // método que devuelve los valores de la gráfica solicitada
    getValores(req, res) {
        const chart = req.params.chart.trim();
        switch (chart) {
            case 'line': {
                res.json(this.lineChart.getChartData());
                break;
            }
            case 'bar': {
                res.json(this.dameValoresEncuesta());
                break;
            }
            default: {
                res.status(400).send({ message: 'Error en los datos: La grafica que buscas no existe' });
                break;
            }
        }
    }
    // método para actualizar los valores de la gráfica de barras
    postUpdateBarChart(req, res) {
        const opcion = req.body.opcion;
        const respuesta = req.body.respuesta;
        const server = server_controller_1.default.instance;
        //valida los datos
        if (this.updateBarChart(opcion, respuesta)) {
            let data = this.dameValoresEncuesta();
            //emite valores de la grafica (para que los clientes actualicen)
            server.io.emit('update-bar-data', data);
            //responde al cliente que lanzo esta petición con los datos actualizados
            res.json(data);
        }
        else {
            //reponde con error cuando los datos enviados por el cliente no son correctos
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
    dameValoresEncuesta() {
        let payload = [this.barChartSi.getChartSimpleData(), this.barChartNo.getChartSimpleData()];
        return payload;
    }
    updateBarChart(opcion, respuesta) {
        let result = false;
        //valida los datos
        if (opcion !== undefined && respuesta !== undefined) {
            //actualiza los valores en la grafica
            if (respuesta == 1)
                this.barChartSi.setChartValue(opcion, 1);
            else
                this.barChartNo.setChartValue(opcion, 1);
            result = true;
        }
        return result;
    }
    // método para actualizar los valores de la gráfica de linea
    postUpdate(req, res) {
        const mes = req.body.mes;
        const unidad = req.body.unidad;
        const server = server_controller_1.default.instance;
        //valida los datos 
        if (mes !== undefined && unidad !== undefined) {
            this.lineChart.setChartValue(mes, unidad);
            //emite valores de la grafica (para que los clientes actualicen)
            server.io.emit('update-data', this.lineChart.getChartData());
            //responde al cliente que lanzo esta petición con los datos actualizados
            res.json(this.lineChart.getChartData());
        }
        else {
            //reponde con error cuando los datos enviados por el cliente no son correctos
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
}
exports.default = ChartController;
