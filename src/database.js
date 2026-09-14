const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = process.env.DB_FILE || './database/development.db';

const databasePath = path.resolve(dbFile);

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error('Error al conectar con SQLite:', error.message);
    } else {
        console.log(`Base de datos conectada: ${databasePath}`);
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT NOT NULL,
            asunto TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (error) => {
        if (error) {
            console.error('Error al crear la tabla:', error.message);
        } else {
            console.log('Tabla contactos disponible.');
        }
    });
});

module.exports = db;