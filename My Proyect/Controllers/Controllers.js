const db = require('../DataBase.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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

//Crear el objeto tabla
db.query(`SELECT * FROM libros;`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
    table = new Table('libros',fields.map(field=>field.name),results,'libros','titulo');
    console.log('Se inicio Table');           
});


class controller{
    
    static logout(req, res){
        res.clearCookie('auth_token', { path: '/' });
        res.json({ ok: true });
    }

    static me(req,res){
        res.json({ ok: true });
    }

    static login(req,res){
        const {name,password} = req.body;

        db.query(`SELECT id,rol,nombre,contraseña FROM usuarios WHERE nombre = '${name}' AND contraseña = '${password}' AND estado = 'Sesión Desactivada';`, (err, results, fields) => {
            if(err){console.log(err);return;}
            if(results.length === 1){
                console.log(`User: ${results[0].nombre} ${results[0].contraseña}`);   
                // Crear JWT con datos mínimos (id, email, nombre...)
                const token = jwt.sign(
                    { id: results[0].id, rol: results[0].rol, name: name, password: password },
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
                res.json({ ok: true, user: { id: results[0].id, rol: results[0].rol, name: name, password: password } });
            }else{ 
                res.status(401).json({ ok: false, error: 'Credenciales inválidas o Sesión Activa en otro dispositivo' });
            }
        });
    }

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
    
    static funpass(req,res){
       const {query} = req.body;
       for(let q of query){
        db.query(q,(err, results, fields) => {
            if(err){console.log(err);return;}
            if(q===query[query.length-1])res.json(results);
        });
       }
    }
}
module.exports = controller;
