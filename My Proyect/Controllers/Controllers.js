import db from '../DataBase.js';
//import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.IA_KEY});

//const JWT_SECRET = process.env.JWT_SECRET || 'super-secreto-no-hardcode-en-produccion';

class controller{    
    static books(req, res) {
    const { tabla, idUsuario, role } = req.body;
    
    // Validar tabla permitida
    const tablasPermitidas = ['libros', 'usuarios', 'prestamos'];
    if (!tablasPermitidas.includes(tabla)) {
        return res.status(400).json({ error: 'Tabla no válida' });
    }

    let q = `SELECT * FROM ${tabla}`;
    let params = [];

    // Si no es Admin, aplicamos restricciones según la tabla
    if (role !== 'Admin') {
        if (tabla === 'usuarios') {
            q += ` WHERE id = ?`;
            params.push(idUsuario);
        } else if (tabla === 'prestamos') {
            q += ` WHERE usuario_id = ?`;
            params.push(idUsuario);
        }
        // Si es 'libros', no lleva WHERE, cualquier usuario puede verlos todos.
    }

    q += `;`;

    db.query(q, params, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
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
        const {usuario_id,libro_id,fecha,fecha2,id} = req.body;
        db.query(`UPDATE prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ?, fecha_devolucion = ? WHERE id = ?;`,[libro_id,usuario_id,fecha,fecha2,id],(err, results, fields) => {
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
        db.query(`INSERT INTO libros (titulo,autor,editorial,año,cantidad_total) VALUES (?,?,?,?,?,?)`,[titulo,autor,editorial,año,cantidad_total],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_l(req,res){
        const {titulo,autor,editorial,año,cantidadtotal,id} = req.body;
        db.query(`UPDATE libros SET titulo = ?, autor = ?, editorial = ?, año = ?, cantidad_total = ? WHERE id = ?;`,[titulo,autor,editorial,año,cantidadtotal,id],(err, results, fields) => {
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

        async function consultarIAConModelo(prompt, indiceModelo) {
            if (indiceModelo >= MODELOS_DISPONIBLES.length) {
                return Promise.reject(new Error("Ningún modelo de Gemini se encuentra disponible en este momento."));
            }
            const infoContexto = fs.readFileSync(path.join(__dirname, '..', 'gemini_no_opina.txt'), 'utf-8');

            const modeloActual = MODELOS_DISPONIBLES[indiceModelo];
            console.log(`Intentando conectar con el modelo: ${modeloActual}`);

            const [libros] = await db.promise().query('SELECT * FROM libros;');
            const listaLibrosString = libros.map((libro) => `${libro.titulo}`).join('\n');

            //console.log(listaLibrosString);

            return ai.models.generateContent({
                model: modeloActual,
                config: {
                    systemInstruction: `
                Eres un asistente de soporte estricto. Tu única fuente de conocimiento es el TEXTO DE REFERENCIA proporcionado abajo.
                
                Reglas obligatorias:
                1. Responde a la pregunta del usuario utilizando ÚNICAMENTE la información del TEXTO DE REFERENCIA y la lista de libros.
                2. Siempre que describas las acciones que se pueden hacer en el sitio, debes diferenciar las del Administrador de las
                de cualquier otro tipo de usuario.
                3. Si la respuesta no se encuentra explícitamente en el texto y no se trata de un libro de la lista, debes responder exactamente: "Lo siento, no encuentro
                esa información en la documentación autorizada."
                4. No uses tu conocimiento previo ni inventes datos externos, más alla de buscar similitudes con el TEXTO DE REFERENCIA y la lista de libros.
                
                Aquí tienes el catálogo de libros de la biblioteca:\n${listaLibrosString}\n\nResponde a la consulta del usuario basándote en estos datos.

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
                
                /* JWT sin contraseña (seguridad)
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
                */
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
                    /*
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
                    */
                    res.json({ ok: true, user: { id: nuevoId, rol: 'Estudiante', nombre: name } });
                });
            }else{
                res.status(401).json({ ok: false, error: 'Usuario ya existente' });
            }
        });
    }

    static st_libros(req,res){
        db.query(`SELECT COUNT(*) FROM libros;`,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static st_usuarios(req,res){
        db.query(`SELECT COUNT(*) FROM usuarios;`,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static st_prestamos(req,res){
        db.query(`SELECT COUNT(*) FROM prestamos;`,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static st_devoluciones(req,res){
        db.query(`SELECT COUNT(*) FROM prestamos WHERE STR_TO_DATE(fecha_devolucion, '%Y-%m-%d');`,(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }
}

export default controller;