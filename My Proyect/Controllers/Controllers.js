import db from '../DataBase.js';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.IA_KEY});

const JWT_SECRET = 'super-secreto-no-hardcode-en-produccion';

class Table {
  constructor(TableName,ColumnsName,Rows,SelectedTable,FileSelectedTable){
    this.TableName = TableName;
    this.ColumnsName = ColumnsName;
    this.Rows = Rows;
    this.SelectedTable = SelectedTable;
    this.FileSelectedTable = FileSelectedTable;
  }
}

class controller{
    static funpost(req,res){
        const {query} = req.body;
        db.query(query, (err, results, fields) => {
            if(err){console.log(err);return;}
            table.ColumnsName = fields.map(fields=>fields.name);
            table.Rows = results;
            res.json(table);
            console.log('Se uso Table');
        });
    }
    
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
        db.query(`UPDATE prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ? WHERE id = ?;`,[usuario_id,libro_id,fecha,id],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_p(req,res){
        const {usuario_id,libro_id,fecha} = req.body;
        db.query(`INSERT INTO prestamos (usuario_id,libro_id,fecha_prestamo,fecha_devolucion_estimada,fecha_devolucion_real,estado) VALUES (?,?,?,'automatico','...','estado')`,[usuario_id,libro_id,fecha],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static nr_u(req,res){
        const {nombre,rol,correo,contraseña,estado} = req.body;
        db.query(`INSERT INTO usuarios (nombre,rol,email,contraseña,estado) VALUES (?,?,?,?,?)`,[nombre,rol,correo,contraseña,estado],(err, results, fields) => {
            if(err){console.log(err);return;}
            res.json(results);
        });
    }

    static ur_u(req,res){
        const {nombre,rol,correo,contraseña,id} = req.body;
        db.query(`UPDATE usuarios SET nombre = ?, rol = ?, email = ?, contraseña = ? WHERE id = ?;`,[nombre,rol,correo,contraseña,id],(err, results, fields) => {
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
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash'
];

// Función que maneja los intentos de forma secuencial mediante Promesas
function consultarIAConModelo(prompt, indiceModelo) {
    // Si ya recorrimos todos los modelos y ninguno funcionó, lanzamos un error
    if (indiceModelo >= MODELOS_DISPONIBLES.length) {
        return Promise.reject(new Error("Ningún modelo de Gemini se encuentra disponible en este momento."));
    }

    const modeloActual = MODELOS_DISPONIBLES[indiceModelo];
    console.log(`Intentando conectar con el modelo: ${modeloActual}`);

    // Asumiendo que ai.models.generateContent devuelve una Promesa nativa
    return ai.models.generateContent({
        model: modeloActual,
        config: {
            // 📌 Aquí aíslas el tema de forma estricta
            systemInstruction: "Eres un tutor experto exclusivamente en JavaScript. Tu único propósito es responder dudas sobre este lenguaje. Si el usuario te pregunta sobre cualquier otro tema (cocina, deportes, otros lenguajes de programación como Python o Java, etc.), debes rechazar la pregunta amablemente diciendo: 'Lo siento, solo puedo ayudarte con temas relacionados con JavaScript.'",
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

    static logout(req, res){
        const {id} = req.body;
        db.query(`UPDATE usuarios SET estado = 'Sesión Desactivada' WHERE id = ?;`,[id], (err, results, fields) => {
            ;            
        });
        res.clearCookie('auth_token', { path: '/' });
        res.json({ ok: true });
        console.log('LogOut');
    }

    static login(req,res){
        const {correo,contraseña} = req.body;
        db.query(`UPDATE usuarios SET estado = 'Sesión Activada' WHERE email = ?;`,[correo], (err, results, fields) => {
            //console.log(results);            
        });
        db.query(`SELECT id,nombre,rol,email,contraseña FROM usuarios WHERE email = ? AND contraseña = ? AND estado = 'Sesión Desactivada';`,[correo,contraseña], (err, results, fields) => {
            if(err){console.log(err);return;}
            if(results.length === 1){
                console.log(`User: ${results[0].nombre} ${results[0].email} ${results[0].contraseña}`);   
                // Crear JWT con datos mínimos (id, email, nombre...)
                const token = jwt.sign(
                    { id: results[0].id, nombre: results[0].nombre, rol: results[0].rol, contraseña: results[0].contraseña },
                    JWT_SECRET,
                    { expiresIn: '1d' }//1d
                );

                // Guardar token en cookie HttpOnly
                res.cookie('auth_token', token, {
                    httpOnly: false,        // JavaScript no puede leerla
                    secure: false,         // true en producción con HTTPS
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
        const {name,password} = req.body;

        db.query(`SELECT nombre,contraseña FROM usuarios WHERE nombre = '${name}' AND contraseña = '${password}';`, (err, results, fields) => {

        if(results){

        db.query(`INSERT INTO usuarios (rol,nombre,contraseña,estado) VALUES ('Estudiante',${name},${password},'Sesión Activada');`, (err, results, fields) => {
            if(err){console.log(err);return;}
            if(results.length === 1){
                console.log(`User: ${name} ${password}`);   
                // Crear JWT con datos mínimos (id, email, nombre...)
                const token = jwt.sign(
                    { rol: 'Estudiante', name: name, password: password },
                    JWT_SECRET,
                    { expiresIn: '1d' }//1d
                );

                // Guardar token en cookie HttpOnly
                res.cookie('auth_token', token, {
                    httpOnly: false,        // JavaScript no puede leerla
                    secure: true,         // true en producción con HTTPS
                    sameSite: 'lax',       // protección CSRF
                    maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000 = 1 día
                    path: '/'
                });

                // No enviamos el token en el body, solo confirmación
                res.json({ ok: true, user: { rol: 'Estudiante', name: name, password: password } });
            }else{ 
                res.status(401).json({ ok: false, error: 'Error de Registro. Intentar de nuevo más tarde' });
            }
        });

        }else{
            res.status(401).json({ ok: false, error: 'Usuario ya existente' });
        }

        });
    }
}

export default controller;