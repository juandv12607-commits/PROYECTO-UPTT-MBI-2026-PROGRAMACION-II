CREATE DATABASE IF NOT EXISTS SCHOOL;
USE SCHOOL;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, 
<<<<<<< HEAD
    nombre VARCHAR(50) DEFAULT 'usuario', 
    rol VARCHAR(50) DEFAULT 'estudiante', 
    email VARCHAR(50) DEFAULT '...@email.com', 
    contraseña VARCHAR(50) DEFAULT '****', 
    estado VARCHAR(50) DEFAULT '...'
=======
    nombre VARCHAR(50), 
    rol VARCHAR(50), 
    email VARCHAR(50), 
    contraseña VARCHAR(50), 
    estado VARCHAR(50)
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
);

CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY, 
<<<<<<< HEAD
    titulo VARCHAR(50) DEFAULT '...', 
    autor VARCHAR(50) DEFAULT '...', 
    editorial VARCHAR(50)  DEFAULT '...', 
    año VARCHAR(50)  DEFAULT '...', 
    cantidad_total INT  DEFAULT 0, 
    disponibles INT  DEFAULT 0
=======
    titulo VARCHAR(50), 
    autor VARCHAR(50), 
    editorial VARCHAR(50), 
    año VARCHAR(50), 
    cantidad_total INT, 
    disponibles VARCHAR(50)
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
);

CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY, 
<<<<<<< HEAD
    usuario_id INT  DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id), 
    libro_id INT  DEFAULT 1,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    fecha_prestamo VARCHAR(50)  DEFAULT '...', 
    fecha_devolucion_estimada VARCHAR(50)  DEFAULT '...', 
    fecha_devolucion_real VARCHAR(50)  DEFAULT '...', 
    estado VARCHAR(50)  DEFAULT '...'
=======
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id), 
    libro_id INT,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    fecha_prestamo VARCHAR(50), 
    fecha_devolucion_estimada VARCHAR(50), 
    fecha_devolucion_real VARCHAR(50), 
    estado VARCHAR(50)
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY, 
<<<<<<< HEAD
    nombre VARCHAR(50)  DEFAULT '...'
);

CREATE TABLE IF NOT EXISTS libro_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT  DEFAULT 1,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    categoria_id INT  DEFAULT 1,
=======
    nombre VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS libro_categoria (
    libro_id INT,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    categoria_id INT,
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);