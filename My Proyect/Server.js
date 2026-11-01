import express from 'express';
import router from './Routes/Routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 
import {createClient} from '@supabase/supabase-js';
const TU_SUPABASE_URL = process.env.TU_SUPABASE_URL || "https://cvdxxfmzerqedmxxfsrs.supabase.co";
const TU_SUPABASE_ANON_KEY = process.env.TU_SUPABASE_ANON_KEY || 'sb_publishable_rpBA493YCHwRcU6Z7ZKhBA_Epgp6JLt';
const supabase = createClient(TU_SUPABASE_URL, TU_SUPABASE_ANON_KEY);
import {upload} from './Storage.js';
import db from './DataBase.js';
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

// SOLUCIÓN AL 404: Ruta explícita para la raíz
app.get('/', (req, res) => {
  // IMPORTANTE: Cambia 'index.html' por el nombre EXACTO de tu archivo (ej: 'login.html')
  // Asegúrate también de que 'Views' coincida en mayúsculas/minúsculas con tu carpeta en GitHub
  res.sendFile(path.join(__dirname, 'Views', 'Vista de mi Proyecto.html')); 
});

app.post('/upload', upload.single('filete'), (req, res) => {
  // Verificación de seguridad por si no llega el archivo o el ID
  if (!req.file || !req.body.id) {
    return res.status(400).send('Faltan archivos o ID en la petición.');
  }

  // 1. Obtener y sanitizar el ID
  const idu = req.body.id; 
  const id = idu.replace(/\D/g, ""); 

  // 2. PRIMER PASO: Consultar si ya existe un archivo registrado para este ID
  const queryBuscar = `SELECT url FROM libros WHERE id = ${id};`;

  db.query(queryBuscar, async (err, results) => {
    if (err) {
      console.log('Error al buscar URL existente: ' + err);
      return res.status(500).send('Error en la base de datos al verificar archivo previo');
    }

    if (results && results.length > 0 && results[0].url) {
      const urlVieja = results[0].url;

      try {
        // Extraer el nombre del archivo desde la URL de Supabase
        const partesUrl = urlVieja.split('/');
        let nombreArchivoViejo = partesUrl[partesUrl.length - 1];
        nombreArchivoViejo = decodeURIComponent(nombreArchivoViejo);

        if (nombreArchivoViejo) {
          console.log('Detectado archivo previo en BD. Intentando borrar de Supabase:', nombreArchivoViejo);
          
          // Borrar el archivo viejo de Supabase Storage
          const { data: delData, error: delError } = await supabase
            .storage
            .from('files')
            .remove([nombreArchivoViejo]);

          if (delError) {
            console.error('Supabase no pudo borrar el archivo anterior:', delError.message);
          } else {
            console.log('Respuesta de borrado Supabase:', delData); // Ahora deberá devolver el archivo borrado
          }
        }
      } catch (errorBorrado) {
        console.error('Excepción al intentar borrar el archivo viejo:', errorBorrado);
      }
    }

    // 3. SEGUNDO PASO: Registrar la URL que Multer ya generó de forma limpia
    const nuevaUrl = req.file.path; // Multer ya guardó aquí la URL pública en storage.js
    console.log('Nueva URL Recibida de Multer:', nuevaUrl);

    // Actualizar la base de datos con la nueva URL pública
    const queryActualizar = `UPDATE libros SET url = '${nuevaUrl}' WHERE id = ${id};`;
    
    db.query(queryActualizar, (err, results, fields) => {
      if (err) {
        console.log('JD BBDD ERROR: ' + err);
        return res.status(500).send('Error al actualizar la nueva URL en la base de datos');
      }
      
      // Responder exitosamente al cliente
      res.status(200).json({ success: true, url: nuevaUrl });
    });
  });
});

// 5. Escuchar en el puerto dinámico de la nube
//app.use(express.static(path.join(__dirname, 'Views')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor de la Biblioteca corriendo exitosamente en el puerto ${port}`);
});