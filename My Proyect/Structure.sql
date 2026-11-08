CREATE DATABASE IF NOT EXISTS SCHOOL;
USE SCHOOL;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) DEFAULT 'usuario', 
    rol VARCHAR(50) DEFAULT 'estudiante', 
    cedula VARCHAR(50) DEFAULT '000000000', 
    contraseña VARCHAR(50) DEFAULT '****'
);

CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    titulo VARCHAR(50) DEFAULT '...', 
    autor VARCHAR(50) DEFAULT '...', 
    editorial VARCHAR(50)  DEFAULT '...', 
    año VARCHAR(50)  DEFAULT '...', 
    cantidad_total INT  DEFAULT 0, 
    disponibles INT  DEFAULT 0
);

CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    usuario_id INT  DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id), 
    libro_id INT  DEFAULT 1,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    fecha_prestamo VARCHAR(50)  DEFAULT '...',  
    fecha_devolucion VARCHAR(50)  DEFAULT '...'
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50)  DEFAULT '...'
);

CREATE TABLE IF NOT EXISTS libro_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT  DEFAULT 1,
    FOREIGN KEY (libro_id) REFERENCES libros(id), 
    categoria_id INT  DEFAULT 1,
);