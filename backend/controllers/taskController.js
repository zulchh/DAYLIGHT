
const db = require('../config/database');

// OBTENER TAREAS DEL USUARIO
const obtenerTareas = async (req, res) => {
    try {
        const [tareas] = await db.query(
            'SELECT * FROM tareas WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
            [req.usuario.id_usuario]
        );

        res.json(tareas);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las tareas'
        });
    }
};

// CREAR UNA TAREA
const crearTarea = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            fecha_vencimiento,
            prioridad
        } = req.body;

        if (!titulo) {
            return res.status(400).json({
                message: 'El título es obligatorio'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO tareas
            (id_usuario, titulo, descripcion, fecha_vencimiento, prioridad)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.usuario.id_usuario,
                titulo,
                descripcion || null,
                fecha_vencimiento || null,
                prioridad || 'Media'
            ]
        );

        res.status(201).json({
            message: 'Tarea creada correctamente',
            id_tarea: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear la tarea'
        });
    }
};

// ACTUALIZAR UNA TAREA
const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            titulo,
            descripcion,
            fecha_vencimiento,
            prioridad,
            estado
        } = req.body;

        const [resultado] = await db.query(
            `UPDATE tareas
             SET titulo = ?, descripcion = ?, fecha_vencimiento = ?,
                 prioridad = ?, estado = ?
             WHERE id_tarea = ? AND id_usuario = ?`,
            [
                titulo,
                descripcion || null,
                fecha_vencimiento || null,
                prioridad,
                estado,
                id,
                req.usuario.id_usuario
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            message: 'Tarea actualizada correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar la tarea'
        });
    }
};

// ELIMINAR UNA TAREA
const eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM tareas WHERE id_tarea = ? AND id_usuario = ?',
            [id, req.usuario.id_usuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            message: 'Tarea eliminada correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar la tarea'
        });
    }
};

module.exports = {
    obtenerTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};
