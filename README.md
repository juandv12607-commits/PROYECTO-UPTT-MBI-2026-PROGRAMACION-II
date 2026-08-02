# PROYECTO-UPTT-MBI-2026-PROGRAMACION-II AUTOMATIZACIÓN DE PROCESOS EN LA BIBLIOTECA DE LA UNIDAD EDUCATIVA “NUESTRA SEÑORA DE COROMOTO”.

---

## **Lógica de Negocio – Sistema de Gestión de Biblioteca Escolar**

### **1. Nombre del sistema (propuesto)**
**BibliotecaTech U.E. Coromoto**

---

### **2. Propósito del sistema**
Optimizar y automatizar los procesos administrativos y de consulta de la biblioteca escolar, permitiendo un control eficiente de préstamos, devoluciones, inventario de libros y usuarios, todo mediante una plataforma web conectada a una base de datos centralizada.

---

### **3. Usuarios del sistema**

| Rol | Descripción |
|------|-------------|
| **Administrador** | Personal de biblioteca o coordinador académico con acceso total al sistema (gestión de libros, usuarios, reportes, respaldos). |
| **Docente** | Puede consultar disponibilidad, solicitar préstamos grupales, reservar materiales. |
| **Estudiante** | Consulta catálogo, ve su historial de préstamos, renueva o reserva libros. |
| **Invitado** | Solo consulta pública del catálogo sin necesidad de autenticación. |

---

### **4. Funcionalidades principales**

#### **Módulo de autenticación y roles**
- Registro y login seguro.
- Control de acceso según rol.

#### **Módulo de gestión de libros**
- Registro de libros: título, autor, editorial, año, ejemplares, ubicación.
- Edición y eliminación.
- Búsqueda avanzada por categoría, autor, disponibilidad.

#### **Módulo de gestión de usuarios**
- Registro de estudiantes y docentes.
- Historial de préstamos por usuario.
- Restricción de préstamo por demora.

#### **Módulo de préstamos y devoluciones**
- Registro de préstamo con fechas automáticas.
- Cálculo de fechas de devolución.
- Registro de devolución.

#### **Módulo de reportes**
- Reporte de libros más prestados.
- Reporte de usuarios con demora.
- Reporte de inventario actual.

#### **Módulo de respaldo y seguridad**
- Respaldo automático de base de datos.
- Registro de actividades del sistema (logs).

---

### **5. Base de datos propuesta (estructura lógica)**

**Entidades principales:**
- `usuarios` (id, nombre, rol, email, contraseña, estado)
- `libros` (id, titulo, autor, editorial, año, cantidad_total, disponibles)
<<<<<<< HEAD
- `prestamos` (id, usuario_id, libro_id, fecha_prestamo, fecha_devolucion_estimada, fecha_devolucion_real, estado, multa)
=======
- `prestamos` (id, usuario_id, libro_id, fecha_prestamo, fecha_devolucion_estimada, fecha_devolucion_real, estado)
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
- `categorias` (id, nombre)
- `libro_categoria` (libro_id, categoria_id)

**Relaciones clave:**
- Un usuario puede tener muchos préstamos.
- Un libro puede estar en muchos préstamos.
- Un libro puede tener muchas categorías.

---

### **6. Lógica de negocio (reglas del sistema)**

1. **Un usuario no puede tener más de 3 préstamos activos al mismo tiempo** (excepto docentes, que pueden tener hasta 5).
2. **Si un libro tiene 0 ejemplares disponibles, no puede ser prestado**.
<<<<<<< HEAD
3. **Al registrar una devolución después de la fecha estimada**, el sistema calcula automáticamente una multa (ej: 0.10$ por día de retraso).
=======
3. **Al registrar una devolución después de la fecha estimada**.
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
4. **Los usuarios con multa pendiente no pueden solicitar nuevos préstamos**.
5. **El sistema debe impedir eliminar un libro si tiene préstamos activos asociados**.
6. **Cada préstamo debe estar asociado a un usuario registrado** (no anónimo).
7. **El sistema debe registrar la fecha real de devolución y actualizar la disponibilidad del libro automáticamente**.

---

### **7. Beneficios esperados (basados en el documento original)**

- **Eficiencia administrativa:** Reducción del tiempo en registro manual de préstamos.
- **Disponibilidad de información:** Acceso rápido al catálogo desde cualquier computadora de la institución.
- **Control y trazabilidad:** Historial completo de movimientos de cada libro y usuario.
- **Sostenibilidad tecnológica:** El sistema puede mantenerse con bajo recurso técnico, alineado al plan de mantenimiento preventivo del proyecto original.
- **Capacitación:** El personal administrativo puede ser capacitado en el uso del sistema, tal como se propuso en los talleres del documento.

---

### **8. Alineación con el proyecto original**

- **Línea de investigación PNF en Informática:** Sistemas de información y modelado de datos.
- **Justificación técnica:** Uso de herramientas libres y mantenimiento posible por los propios estudiantes o personal capacitado.
- **Justificación comunitaria:** Solución tecnológica real, escalable y con impacto directo en la comunidad educativa.
<<<<<<< HEAD
- **Factibilidad operativa:** El sistema puede ser instalado en los equipos ya mantenidos durante el proyecto.
=======
- **Factibilidad operativa:** El sistema puede ser instalado en los equipos ya mantenidos durante el proyecto.
>>>>>>> 38fd8269775dc548c726f70efc0c332c9fcca154
