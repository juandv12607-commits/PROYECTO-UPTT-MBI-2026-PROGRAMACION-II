const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'SCHOOL',//SCHOOL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/*
const pool = mysql.createPool({
    host: 'mysql-2ed6ac4a-juandv12607-f7c9.e.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_P9G8ADVuIFlXHwz9QMo',
    database: 'defaultdb',//SCHOOL
    port:'17875',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
    rejectUnauthorized: false // Permite la conexión segura sin validar el archivo local
  }
});
*/

module.exports = pool;

/*
Recordatorio: Al Cambiar de Base de Datos
1) Las tablas deben que tener Valores por defecto
*/
