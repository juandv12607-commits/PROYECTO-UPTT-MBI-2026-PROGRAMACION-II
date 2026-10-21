import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
/*
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'SCHOOL',//SCHOOL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
*/

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || 'mysql-2ed6ac4a-juandv12607-f7c9.e.aivencloud.com',
    user: process.env.DATABASE_USER || 'avnadmin',
    password: process.env.DATABASE_PASSWORD || 'AVNS_P9G8ADVuIFlXHwz9QMo',
    database: process.env.DATABASE_NAME || 'defaultdb',
    port: process.env.DATABASE_PORT || 17875,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
    rejectUnauthorized: false // Permite la conexión segura sin validar el archivo local
  }
});

export default pool;
//module.exports = pool;
