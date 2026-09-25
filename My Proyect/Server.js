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
/*
// ... Tus rutas de la API anteriores
app.use('/api', router);
*/
// SOLUCIÓN AL 404: Ruta explícita para la raíz
app.get('/', (req, res) => {
  // IMPORTANTE: Cambia 'index.html' por el nombre EXACTO de tu archivo (ej: 'login.html')
  // Asegúrate también de que 'Views' coincida en mayúsculas/minúsculas con tu carpeta en GitHub
  res.sendFile(path.join(__dirname, 'Views', 'Index.html')); 
});

// 5. Escuchar en el puerto dinámico de la nube
app.use(express.static(path.join(__dirname, 'Views')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor de la Biblioteca corriendo exitosamente en el puerto ${port}`);
});
