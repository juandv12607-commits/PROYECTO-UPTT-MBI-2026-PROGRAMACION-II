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
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    ssl: {
      ca: caCert,
      rejectUnauthorized: true // Permite la conexión segura sin validar el archivo local
    }
    
});

export default pool;