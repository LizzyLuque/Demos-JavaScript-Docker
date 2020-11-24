"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enviroment_1 = require("../config/enviroment");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require("../models/user-login");
class AuthController {
    login(req, res) {
        let body = req.body;
        Usuario.findOne({ email: body.email }, (err, usuarioStored) => {
            if (err) {
                //responder con el error
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            // Verifica que exista un usuario con el email escrita por el usuario.
            if (!usuarioStored) {
                // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    message: "Usuario o contraseña incorrectos"
                });
            }
            // Valida que la contraseña escrita por el usuario, sea la almacenada en la db   
            if (!bcrypt.compareSync(body.password, usuarioStored.password)) {
                // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    message: "Usuario o contraseña incorrectos"
                });
            }
            // Genera el token de autenticación    
            let token = jwt.sign({ usuario: usuarioStored }, // era: usuario: usuarioStored,
            enviroment_1.SEED_AUTENTICACION, { expiresIn: enviroment_1.CADUCIDAD_TOKEN });
            // responder con el usuario almacenado y el token de inicio de sesión
            res.json({
                ok: true,
                usuario: usuarioStored,
                token,
            });
        });
    }
    register(req, res) {
        let body = req.body;
        // recuperar los datos desde el body
        let { nombre, email, password } = body;
        //Crear el objeto a almacenar
        let usuario = new Usuario({
            nombre,
            email,
            password: bcrypt.hashSync(password, 10)
        });
        //Guardar el usuario en la base de datos
        usuario.save((err, usuarioStored) => {
            if (err) {
                // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    err,
                });
            }
            // Genera el token de autenticación    
            let token = jwt.sign({ usuario: usuarioStored }, enviroment_1.SEED_AUTENTICACION, { expiresIn: enviroment_1.CADUCIDAD_TOKEN });
            // responder con el usuario creado correctamente y el token de inicio de sesión
            res.json({
                ok: true,
                usuario: usuarioStored,
                token,
            });
        });
    }
}
exports.default = AuthController;
