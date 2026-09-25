const express = require('express');
const db = require('./DataBase.js');
const router = require('./Routes/Routes.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const app = express();

// 1. Leer el puerto dinámico asignado por Render (o usar 10000 por defecto)
const port = process.env.PORT || 10000;

// 2. Middlewares de procesamiento (CORS configurado para producción)
app.use(cors({
  origin: true, // Permite el origen dinámico de tu app
  credentials: true // Crucial para que funcionen las cookies de cookie-parser con JWT
})); 

app.use(express.json());
app.use(cookieParser()); 

// 3. Archivos estáticos
app.use(express.static(path.join(__dirname, 'Views')));

// 4. Rutas de la API
app.use('/api', router);

// 5. Escuchar en el puerto dinámico de la nube
app.use(express.static(path.join(__dirname, 'Views')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor de la Biblioteca corriendo exitosamente en el puerto ${port}`);
});
