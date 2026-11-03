const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Conexión de las rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡DAYLIGHT está funcionando! ☀️');
});

// Prueba de conexión con MySQL
app.get('/api/test-db', async (req, res) => {
    try {
        const [result] = await db.query(
            'SELECT DATABASE() AS databaseName'
        );

        res.json({
            message: 'Conexión con MySQL exitosa',
            database: result[0].databaseName
        });

    } catch (error) {
        console.error('Error de conexión:', error.message);

        res.status(500).json({
            message: 'No se pudo conectar con MySQL'
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`DAYLIGHT funcionando en http://localhost:${PORT}`);
});