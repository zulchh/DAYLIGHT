
const express = require('express');
const router = express.Router();

const {
    registrarUsuario,
    iniciarSesion
} = require('../controllers/authController');

// Ruta para registrar usuarios
router.post('/register', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

module.exports = router;
