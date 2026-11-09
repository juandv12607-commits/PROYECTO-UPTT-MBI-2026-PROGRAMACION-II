import db from '../DataBase.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.IA_KEY});

const JWT_SECRET = process.env.JWT_SECRET || 'super-secreto-no-hardcode-en-produccion';

class controller{    
    static books(req,res){
       const {query} = req.body;
       // ⚠️ ADVERTENCIA: Este endpoint es inseguro (Inyección SQL). 
       // Se mantiene por compatibilidad, pero debe ser refactorizado.
       db.query(query,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static search(req,res){
        const {table,text} = req.body;
        // Validar tabla permitida para evitar inyección
        const tablasPermitidas = ['libros', 'usuarios', 'prestamos'];
        if (!tablasPermitidas.includes(table)) {
            return res.status(400).json({ error: 'Tabla no válida' });
        }
        
        db.query(`SHOW COLUMNS FROM ${table};`, async (err, results, fields) => {
            if(err) { console.log(err); return res.status(500).json({error: 'Error en BD'}); }
            
            let ready = [];
            const promesas = results.map(i => {
                return new Promise((resolve) => {
                    db.query(`SELECT * FROM ${table} WHERE ?? LIKE ?;`, [i.Field, text], (err, selectResults) => {
                        if (!err && selectResults && selectResults.length > 0) {
                            for(let ii of selectResults){
                                ready.push(ii);
                            }
                        }
                        resolve();
                    });
                });
            });

            await Promise.all(promesas);
            res.json(ready);
        });
    }

    static id1(req,res){
       db.query('SELECT id,titulo FROM libros',(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static id2(req,res){
       db.query('SELECT id,nombre FROM usuarios',(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_p(req,res){
        const {usuario_id,libro_id,fecha,id} = req.body;
        db.query(`UPDATE prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ? WHERE id = ?;`,[libro_id,usuario_id,fecha,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_p(req,res){
        const {usuario_id,libro_id,fecha} = req.body;
        // CORRECCIÓN: El orden de los parámetros era incorrecto
        db.query(`INSERT INTO prestamos (libro_id,usuario_id,fecha_prestamo,fecha_devolucion) VALUES (?,?,?,'...')`,[libro_id,usuario_id,fecha],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_u(req,res){
        const {nombre,rol,cedula,contraseña} = req.body;
        db.query(`INSERT INTO usuarios (nombre,rol,cedula,contraseña) VALUES (?,?,?,?)`,[nombre,rol,cedula,contraseña],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_u(req,res){
        const {nombre,rol,cedula,contraseña,id} = req.body;
        db.query(`UPDATE usuarios SET nombre = ?, rol = ?, cedula = ?, contraseña = ? WHERE id = ?;`,[nombre,rol,cedula,contraseña,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_l(req,res){
        const {titulo,autor,editorial,año,cantidad_total} = req.body;
        db.query(`INSERT INTO libros (titulo,autor,editorial,año,cantidad_total,disponibles) VALUES (?,?,?,?,?,?)`,[titulo,autor,editorial,año,cantidad_total,cantidad_total],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_l(req,res){
        const {titulo,autor,editorial,año,cantidadtotal,id} = req.body;
        db.query(`UPDATE libros SET titulo = ?, autor = ?, editorial = ?, año = ?, cantidad_total = ?, disponibles = ? WHERE id = ?;`,[titulo,autor,editorial,año,cantidadtotal,cantidadtotal,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static delete(req,res){
        const {id,table} = req.body;
        const tablasPermitidas = ['libros', 'usuarios', 'prestamos'];
        if (!tablasPermitidas.includes(table)) {
            return res.status(400).json({ error: 'Tabla no válida' });
        }
        db.query(`DELETE FROM ${table} WHERE id = ?;`,[id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ia(req,res){
        const { prompt } = req.body;

        const MODELOS_DISPONIBLES = [
            'gemini-3.5-flash-lite',
            'gemini-3.6-flash',
            'gemini-3.8-flash'
        ];

        function consultarIAConModelo(prompt, indiceModelo) {
            if (indiceModelo >= MODELOS_DISPONIBLES.length) {
                return Promise.reject(new Error("Ningún modelo de Gemini se encuentra disponible en este momento."));
            }
            const infoContexto = fs.readFileSync(path.join(__dirname, '..', 'gemini_no_opina.txt'), 'utf-8');

            const modeloActual = MODELOS_DISPONIBLES[indiceModelo];
            console.log(`Intentando conectar con el modelo: ${modeloActual}`);

            return ai.models.generateContent({
                model: modeloActual,
                config: {
                    systemInstruction: `
                Eres un asistente de soporte estricto. Tu única fuente de conocimiento es el TEXTO DE REFERENCIA proporcionado abajo.
                
                Reglas obligatorias:
                1. Responde a la pregunta del usuario utilizando ÚNICAMENTE la información del TEXTO DE REFERENCIA.
                2. Siempre que describas las acciones que se pueden hacer en el sitio, debes diferenciar las del Administrador de las
                de cualquier otro tipo de usuario.
                3. Si la respuesta no se encuentra explícitamente en el texto, debes responder exactamente: "Lo siento, no encuentro
                esa información en la documentación autorizada."
                4. No uses tu conocimiento previo ni inventes datos externos.

                TEXTO DE REFERENCIA:
                ${infoContexto}
              `,
                    temperature: 0.1, 
                },
                contents: prompt
            })
            .then(response => {
                return response.text;
            })
            .catch(error => {
                console.warn(`El modelo ${modeloActual} falló debido a: ${error.message}`);
                return consultarIAConModelo(prompt, indiceModelo + 1);
            });
        }

        consultarIAConModelo(prompt, 0)
            .then(respuesta => {
                res.json({ respuesta: respuesta });
            })
            .catch(error => {
                console.error("Error definitivo en los modelos:", error);
                res.status(500).json({ error: error.message });
            });
    }

    static my(req, res){
        const {id123} = req.body;
        db.query(`SELECT * FROM usuarios WHERE id = ?;`,[id123], (err, results, fields) => {
            res.json(results);            
        });
    }

    static my2(req, res){
        const {id123} = req.body;
        db.query(`SELECT * FROM prestamos WHERE id_usuario = ?;`,[id123], (err, results, fields) => {
            res.json(results);            
        });
    }

    static logout(req, res){
        res.clearCookie('auth_token', { path: '/' });
        res.json({ ok: true });
        console.log('LogOut');
    }

    static login(req,res){
        const {cedula,contraseña} = req.body;
        db.query(`SELECT id,nombre,rol,cedula,contraseña FROM usuarios WHERE cedula = ? AND contraseña = ?;`,[cedula,contraseña], (err, results, fields) => {
            if(err){console.log(err);return;}
            if(results.length === 1){
                console.log(`User: ${results[0].nombre} ${results[0].cedula} ${results[0].contraseña}`);   
                
                // JWT sin contraseña (seguridad)
                const token = jwt.sign(
                    { id: results[0].id, nombre: results[0].nombre, rol: results[0].rol },
                    JWT_SECRET,
                    { expiresIn: '1d' }
                );

                res.cookie('auth_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000,
                    path: '/'
                });

                // No enviamos la contraseña en la respuesta
                res.json({ ok: true, user: { id: results[0].id, nombre: results[0].nombre, rol: results[0].rol } });
            }else{ 
                res.status(401).json({ ok: false, error: 'Credenciales inválidas o Sesión Activa en otro dispositivo' });
            }
        });
    }

    static register(req,res){
        const {name,cedula,password} = req.body;

        db.query(`SELECT nombre,cedula,contraseña FROM usuarios WHERE cedula = ? AND contraseña = ?;`,[cedula,password],(err, results, fields) => {
            if(err){console.log(err);return;}
            console.log(results);

            if(results.length === 0){
                db.query(`INSERT INTO usuarios (nombre,cedula,contraseña) VALUES (?,?,?);`,[name,cedula,password],(err, insertResults, fields) => {
                    if(err){console.log(err);return;}
                    
                    // CORRECCIÓN: Usar insertId en lugar de consultar toda la tabla
                    const nuevoId = insertResults.insertId;
                    
                    console.log(`User: ${name} ${password}`);   
                    const token = jwt.sign(
                        { id: nuevoId, rol: 'Estudiante', nombre: name },
                        JWT_SECRET,
                        { expiresIn: '1d' }
                    );

                    res.cookie('auth_token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000,
                        path: '/'
                    });

                    res.json({ ok: true, user: { id: nuevoId, rol: 'Estudiante', nombre: name } });
                });
            }else{
                res.status(401).json({ ok: false, error: 'Usuario ya existente' });
            }
        });
    }
}

export default controller;
/*
import db from '../DataBase.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.IA_KEY});

const JWT_SECRET = 'super-secreto-no-hardcode-en-produccion';

class controller{    
    static books(req,res){
       const {query} = req.body;
       db.query(query,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static search(req,res){
        const {table,text} = req.body;
        // 1. Agregamos "async" antes del callback de SHOW COLUMNS
db.query(`SHOW COLUMNS FROM ${table};`, async (err, results, fields) => {
    if(err) { console.log(err); return; }
    
    let ready = [];
    
    // 2. Mapeamos cada columna a una Promesa individual
    const promesas = results.map(i => {
        return new Promise((resolve) => {
            //`SELECT ${i.Field} FROM ${modem} WHERE ${i.Field} LIKE ?;`
            //`SELECT      *     FROM ${modem} WHERE ${i.Field} LIKE ?;`
            db.query(`SELECT * FROM ${table} WHERE ${i.Field} LIKE ?;`, [text], (err, selectResults) => {
                // Si hubo un error o no hay datos, igual resolvemos para no trabar el flujo
                if (!err && selectResults && selectResults.length > 0) {
                    for(let ii of selectResults){
                        ready.push(ii);
                    }
                }
                resolve(); // Le avisa a Node que ESTA columna ya terminó
            });
        });
    });

    // 3. Esperamos a que TODAS las promesas terminen
    await Promise.all(promesas);

    // 🚀 ¡AQUÍ SÍ TENDRÁ LOS DATOS!
    //console.log(ready); 
    
    // Aquí ya puedes enviar la respuesta al cliente de forma segura:
    res.json(ready);
});

    }

    static id1(req,res){
       db.query('SELECT id,titulo FROM libros',(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static id2(req,res){
       db.query('SELECT id,nombre FROM usuarios',(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_p(req,res){
        const {usuario_id,libro_id,fecha,id} = req.body;
        db.query(`UPDATE prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ? WHERE id = ?;`,[libro_id,usuario_id,fecha,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_p(req,res){
        const {usuario_id,libro_id,fecha} = req.body;
        db.query(`INSERT INTO prestamos (libro_id,usuario_id,fecha_prestamo,fecha_devolucion) VALUES (?,?,?,'...')`,[usuario_id,libro_id,fecha],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_u(req,res){
        const {nombre,rol,cedula,contraseña} = req.body;
        db.query(`INSERT INTO usuarios (nombre,rol,cedula,contraseña) VALUES (?,?,?,?)`,[nombre,rol,cedula,contraseña],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_u(req,res){
        const {nombre,rol,cedula,contraseña,id} = req.body;
        db.query(`UPDATE usuarios SET nombre = ?, rol = ?, cedula = ?, contraseña = ? WHERE id = ?;`,[nombre,rol,cedula,contraseña,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_l(req,res){
        const {titulo,autor,editorial,año,cantidad_total} = req.body;
        db.query(`INSERT INTO libros (titulo,autor,editorial,año,cantidad_total,disponibles) VALUES (?,?,?,?,?,?)`,[titulo,autor,editorial,año,cantidad_total,cantidad_total],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_l(req,res){
        const {titulo,autor,editorial,año,cantidadtotal,id} = req.body;

        db.query(`UPDATE libros SET titulo = ?, autor = ?, editorial = ?, año = ?, cantidad_total = ?, disponibles = ? WHERE id = ?;`,[titulo,autor,editorial,año,cantidadtotal,cantidadtotal,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static delete(req,res){
        const {id,table} = req.body;
        db.query(`DELETE FROM ${table} WHERE id = ?;`,[id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ia(req,res){

        const { prompt } = req.body;

// Lista de modelos ordenados por prioridad de uso
const MODELOS_DISPONIBLES = [
    //'gemini-2.5-flash-lite',
    //'gemini-2.5-pro',
    //'gemini-4-argon',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.8-flash'
];

// Función que maneja los intentos de forma secuencial mediante Promesas
function consultarIAConModelo(prompt, indiceModelo) {
    // Si ya recorrimos todos los modelos y ninguno funcionó, lanzamos un error
    if (indiceModelo >= MODELOS_DISPONIBLES.length) {
        return Promise.reject(new Error("Ningún modelo de Gemini se encuentra disponible en este momento."));
    }
    // Sube un nivel desde Controllers/ hasta la raíz
    const infoContexto = fs.readFileSync(path.join(__dirname, '..', 'gemini_no_opina.txt'), 'utf-8');


    const modeloActual = MODELOS_DISPONIBLES[indiceModelo];
    console.log(`Intentando conectar con el modelo: ${modeloActual}`);

    // Asumiendo que ai.models.generateContent devuelve una Promesa nativa
    return ai.models.generateContent({
        model: modeloActual,
        config: {
            // 📌 Aquí aíslas el tema de forma estricta
            //"Eres un tutor experto exclusivamente en JavaScript. Tu único propósito es responder dudas sobre este lenguaje. Si el usuario te pregunta sobre cualquier otro tema (cocina, deportes, otros lenguajes de programación como Python o Java, etc.), debes rechazar la pregunta amablemente diciendo: 'Lo siento, solo puedo ayudarte con temas relacionados con JavaScript.'",
            systemInstruction: `
        Eres un asistente de soporte estricto. Tu única fuente de conocimiento es el TEXTO DE REFERENCIA proporcionado abajo.
        
        Reglas obligatorias:
        1. Responde a la pregunta del usuario utilizando ÚNICAMENTE la información del TEXTO DE REFERENCIA.
        2. Siempre que describas las acciones que se pueden hacer en el sitio, debes diferenciar las del Administrador de las
        de cualquier otro tipo de usuario.
        3. Si la respuesta no se encuentra explícitamente en el texto, debes responder exactamente: "Lo siento, no encuentro
        esa información en la documentación autorizada."
        4. No uses tu conocimiento previo ni inventes datos externos.

        TEXTO DE REFERENCIA:
        ${infoContexto}
      `,
            // Opcional: bajar la temperatura reduce la creatividad y hace que siga mejor las reglas
            temperature: 0.1, 
        },
        contents: prompt
    })
    .then(response => {
        // Si tiene éxito, imprimimos y retornamos el texto directamente
        //console.log(response.text);
        return response.text;
    })
    .catch(error => {
        console.warn(`El modelo ${modeloActual} falló debido a: ${error.message}`);
        // RECURSIVIDAD: Si falla, pasa al siguiente índice de la lista de modelos
        return consultarIAConModelo(prompt, indiceModelo + 1);
    });
}

// LLAMADA PRINCIPAL: Iniciamos el intento con el modelo en el índice 0
consultarIAConModelo(prompt, 0)
    .then(respuesta => {
        // Cuando la promesa se resuelve con éxito, enviamos el JSON correcto al frontend
        res.json({ respuesta: respuesta });
    })
    .catch(error => {
        // Si todos los modelos fallaron, atrapamos el error final aquí
        console.error("Error definitivo en los modelos:", error);
        res.status(500).json({ error: error.message });
    });

    }

    static my(req, res){
        const {id123} = req.body;
        db.query(`SELECT * FROM usuarios WHERE id = ?;`,[id123], (err, results, fields) => {
            res.json(results);            
        });
    }

    static my2(req, res){
        const {id123} = req.body;
        db.query(`SELECT * FROM prestamos WHERE id_usuario = ?;`,[id123], (err, results, fields) => {
            res.json(results);            
        });
    }

    static logout(req, res){
        res.clearCookie('auth_token', { path: '/' });
        res.json({ ok: true });
        console.log('LogOut');
    }

    static login(req,res){//insert into (nombre,rol,cedula,contraseña) values ('Juan','Admin',32007670,'****');
        const {cedula,contraseña} = req.body;
        db.query(`SELECT id,nombre,rol,cedula,contraseña FROM usuarios WHERE cedula = ? AND contraseña = ?;`,[cedula,contraseña], (err, results, fields) => {
            if(err){console.log(err);return;}
            if(results.length === 1){
                console.log(`User: ${results[0].nombre} ${results[0].cedula} ${results[0].contraseña}`);   
                // Crear JWT con datos mínimos (id, email, nombre...)
                const token = jwt.sign(
                    { id: results[0].id, nombre: results[0].nombre, rol: results[0].rol, contraseña: results[0].contraseña },
                    JWT_SECRET,
                    { expiresIn: '1d' }//1d
                );

                // Guardar token en cookie HttpOnly
                res.cookie('auth_token', token, {
                    httpOnly: true,        // JavaScript no puede leerla
                    secure: process.env.NODE_ENV === 'production', // true en producción con HTTPS
                    sameSite: 'lax',       // protección CSRF
                    maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000 = 1 día
                    path: '/'
                });

                // No enviamos el token en el body, solo confirmación
                res.json({ ok: true, user: { id: results[0].id, nombre: results[0].nombre, rol: results[0].rol, contraseña: results[0].contraseña } });
            }else{ 
                res.status(401).json({ ok: false, error: 'Credenciales inválidas o Sesión Activa en otro dispositivo' });
            }
        });
    }

    static register(req,res){
        const {name,cedula,password} = req.body;

        db.query(`SELECT nombre,cedula,contraseña FROM usuarios WHERE cedula = ? AND contraseña = ?;`,[cedula,password],(err, results, fields) => {
            if(err){console.log(err);return;}
            console.log(results);

            if(results.length === 0){
                db.query(`INSERT INTO usuarios (nombre,cedula,contraseña) VALUES (?,?,?);`,[name,cedula,password],(err, results, fields) => {
                    if(err){console.log(err);return;}
                });

                console.log(`User: ${name} ${password}`);   
                // Crear JWT con datos mínimos (id, email, nombre...)
                const token = jwt.sign(
                    { rol: 'Estudiante', name: name, password: password },
                    JWT_SECRET,
                    { expiresIn: '1d' }//1d
                );

                // Guardar token en cookie HttpOnly
                res.cookie('auth_token', token, {
                    httpOnly: true,        // JavaScript no puede leerla
                    secure: process.env.TLS || true, // true en producción con HTTPS
                    sameSite: 'lax',       // protección CSRF
                    maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000 = 1 día
                    path: '/'
                });

                db.query(`SELECT * FROM usuarios;`,(err, results, fields) => {
                    let id = results[results.length - 1].id + 1;
                    //console.log(id,typeof(id));
                    res.json({ ok: true, user: { id: id, rol: 'Estudiante', name: name, password: password } });
                });
            }else{
                res.status(401).json({ ok: false, error: 'Usuario ya existente' });
            }

        });
    }
}

export default controller;
*/