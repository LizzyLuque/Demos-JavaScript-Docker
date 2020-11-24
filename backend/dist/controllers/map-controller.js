"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_service_1 = require("../services/map-service");
class MapController {
    constructor() {
        this.mapa = map_service_1.MapService.instance;
    }
    getMapa(req, res) {
        res.json(this.mapa.getMarcadores());
    }
}
exports.default = MapController;
