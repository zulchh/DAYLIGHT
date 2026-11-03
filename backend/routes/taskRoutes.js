
const express = require('express');
const router = express.Router();
console.log('¡ARCHIVO taskRoutes CARGADO!');

const verificarToken = require('../middleware/authMiddleware');

const {
    obtenerTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
} = require('../controllers/taskController');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todas las tareas
router.get('/', obtenerTareas);

// Crear una tarea
router.post('/', crearTarea);

// Actualizar una tarea
router.put('/:id', actualizarTarea);

// Eliminar una tarea
router.delete('/:id', eliminarTarea);

module.exports = router;
