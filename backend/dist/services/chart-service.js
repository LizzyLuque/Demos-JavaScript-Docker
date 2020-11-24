"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChartService {
    constructor(charLabel, valoresFijos) {
        this.label = charLabel;
        this.valoresFijos = valoresFijos;
        this.valores = new Array(valoresFijos.length);
        //para fines de ejemplo (podria obtenerse de una BD)
        //construye la gráfica con valores aleatorios de acuerdo a la cantidad de valores fijos
        for (let i in this.valoresFijos) {
            this.valores[i] = 0; //Math.round(Math.random()*100);
        }
    }
    //se regresan los datos de la gráfica
    getChartData() {
        return [{ 'data': this.valores, 'label': this.label }];
    }
    //se regresan los datos de la gráfica
    getChartSimpleData() {
        return { 'data': this.valores, 'label': this.label };
    }
    //Se actualizan los datos 
    setChartValue(x, y) {
        x = x.toLowerCase().trim();
        y = Number(y);
        for (let i in this.valoresFijos) {
            if (this.valoresFijos[i] === x) {
                this.valores[i] += y;
            }
        }
    }
}
exports.default = ChartService;
