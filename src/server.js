const path = require('path');

const ambiente = process.env.APP_ENV || 'development';

const archivoEnv = ambiente === 'testing'
    ? '.env.testing'
    : '.env';

require('dotenv').config({
    path: path.resolve(__dirname, '..', archivoEnv)
});

const express = require('express');
const db = require('./database');

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/contactos', (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios.'
        });
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo)) {
        return res.status(400).json({
            success: false,
            message: 'Ingresa un correo electrónico válido.'
        });
    }

    const sql = `
        INSERT INTO contactos (nombre, correo, asunto, mensaje)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            nombre.trim(),
            correo.trim(),
            asunto.trim(),
            mensaje.trim()
        ],
        function (error) {
            if (error) {
                console.error(
                    'Error al guardar contacto:',
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message: 'No fue posible procesar el formulario.'
                });
            }

            if (NODE_ENV === 'development' || NODE_ENV === 'testing') {
                console.log(
                    `Contacto registrado con ID: ${this.lastID}`
                );
            }

            res.status(201).json({
                success: true,
                message: '¡Mensaje enviado correctamente!'
            });
        }
    );
});

app.get('/api/contactos', (req, res) => {
    db.all(
        'SELECT * FROM contactos ORDER BY fecha_creacion DESC',
        [],
        (error, rows) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar los contactos.'
                });
            }

            res.json({
                success: true,
                contactos: rows
            });
        }
    );
});
app.listen(PORT, '0.0.0.0', () => {
    console.log('======================================');
    console.log('Formulario de Contacto La Salle');
    console.log(`Ambiente: ${NODE_ENV}`);
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log('======================================');
});