const db = require('../DataBase.js');

const Table = require('../Models/Models.js');

db.query(`CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) DEFAULT 'usuario', 
    rol VARCHAR(50) DEFAULT 'estudiante', 
    email VARCHAR(50) DEFAULT '...@email.com', 
    contraseña VARCHAR(50) DEFAULT '****', 
    estado VARCHAR(50) DEFAULT '...'
);`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
});

db.query(`CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    titulo VARCHAR(50) DEFAULT '...', 
    autor VARCHAR(50) DEFAULT '...', 
    editorial VARCHAR(50)  DEFAULT '...', 
    año VARCHAR(50)  DEFAULT '...', 
    cantidad_total INT  DEFAULT 0, 
    disponibles INT  DEFAULT 0
);`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
});

db.query(`CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    usuario_id INT  DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id), 
    libro_id INT  DEFAULT 1,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    fecha_prestamo VARCHAR(50)  DEFAULT '...', 
    fecha_devolucion_estimada VARCHAR(50)  DEFAULT '...', 
    fecha_devolucion_real VARCHAR(50)  DEFAULT '...', 
    estado VARCHAR(50)  DEFAULT '...'
);`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
});

db.query(`CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50)  DEFAULT '...'
);`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
});

//Crear el objeto tabla
db.query(`SELECT * FROM libros;`, (err, results, fields) => {
    if(err){
        console.log(err);
        return;
    }
    //console.log(results);
    table = new Table('libros',fields.map(field=>field.name),results,'libros','titulo');           
});

class controller{
    
    static funpost(req,res){
        const {query} = req.body;
        db.query(query, (err, results, fields) => {
            if(err){
                console.log(err);
                return;
            }
        table.ColumnsName = fields.map(fields=>fields.name);
        table.Rows = results;
        res.json(table);
        });
    }
    static funpass(req,res){
       const {query} = req.body;
       for(let q of query){
        db.query(q,(err, results, fields) => {
            if(err){
                console.log(err)
                return;
            }
            //console.log(results);
            if(q===query[query.length-1])res.json(results);
        });
       }
    }
}
module.exports = controller;