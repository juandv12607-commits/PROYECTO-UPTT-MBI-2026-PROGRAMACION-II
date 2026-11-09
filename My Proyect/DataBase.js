import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el certificado CA descargado de Aiven
const caCert = fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8');

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
      ca: caCert,
      rejectUnauthorized: true // Permite la conexión segura sin validar el archivo local
  }
});

export default pool;
//module.exports = pool;
