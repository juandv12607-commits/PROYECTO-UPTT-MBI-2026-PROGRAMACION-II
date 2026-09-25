const express = require('express');
const db = require('./DataBase.js');
const router = require('./Routes/Routes.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Puedes quitarlo si no vas a usar otros puertos
const app = express();
const port = 10000;

// 1. Deshabilitar o simplificar CORS ya que todo corre en localhost:3000
app.use(cors()); 

// 2. Middlewares de procesamiento (SIEMPRE PRIMERO)
app.use(express.json());
app.use(cookieParser()); // 👈 MOVIDO ARRIBA: Ahora procesará las cookies de cualquier petición entrante inmediatamente

// 3. Archivos estáticos
app.use(express.static(path.join(__dirname, 'Views')));

// 4. Rutas de la API
app.use('/api', router);

app.listen(port,'0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
