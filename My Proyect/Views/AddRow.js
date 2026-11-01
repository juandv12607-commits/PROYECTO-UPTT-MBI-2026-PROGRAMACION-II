import {url} from './Script.js';
/* 
============================================================
   TABLA - MÉTODO: MODAL CON FORMULARIO
============================================================
*/
(function () {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const btnAgregar  = document.getElementById('btnAgregarFila');
    const modalUsuario = document.getElementById('modalUsuarioOverlay');
    const btnGuardar = document.getElementById('btnGuardarUsuario');
    const btnActualizar = document.getElementById('btnActualizarUsuario');
    const select1 = document.getElementById('select1');const s1 = document.getElementById('s1');
    const select2 = document.getElementById('select2');const s2 = document.getElementById('s2');
    const input1 = document.getElementById('input1');const i1 = document.getElementById('i1');
    const input2 = document.getElementById('input2');const i2 = document.getElementById('i2');
    const input3 = document.getElementById('input3');const i3 = document.getElementById('i3');
    const input4 = document.getElementById('input4');const i4 = document.getElementById('i4');
    const input5 = document.getElementById('input5');const i5 = document.getElementById('i5');
    const titulo_fila = document.getElementById('titulo_fila');
    const subtitulo_fila = document.getElementById('subtitulo_fila');
    const p = document.getElementById('p');

    if (!cuerpoTabla) return;

    // ELIMINAR
    cuerpoTabla.addEventListener('click',async function (e) {
        const btn = e.target.closest('.btn-delete');
        if (!btn) return;
        const fila = btn.closest('tr');
        if (!fila) return;
        fila.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        fila.style.opacity = '0';
        fila.style.transform = 'translateX(30px)';
        setTimeout(() => { fila.remove() }, 250);
        const id = Number(fila.firstChild.textContent);
        const table = document.getElementById('tablaUsuarios').table;
        const response = await fetch(url + 'api/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',   // ← ¡envía y recibe cookies!
            body: JSON.stringify({ id,table })
        });
        const res = await response.json();  
        window.location.reload(); 
    });

    // ABRIR MODAL
    btnAgregar.addEventListener('click', async function () {
        btnActualizar.style.display = 'none';
        btnGuardar.style.display = 'block';
        if(document.getElementById('tablaUsuarios').table === 'libros'){
            titulo_fila.textContent = 'Nuevo Libro';
            subtitulo_fila.textContent = 'Completa los datos para registrar un nuevo libro';
            select1.style.display = 'none';s1.style.display = 'none';
            select2.style.display = 'none';s2.style.display = 'none';
            input1.style.display = 'block';input1.value = '';i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'El Cuento';i1.textContent = 'Titulo';
            input2.style.display = 'block';input2.value = '';i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'Pepe';i2.textContent = 'Autor';
            input3.style.display = 'block';input3.value = '';i3.style.display = 'block';input3.type = 'text';input3.placeholder = 'Edit';i3.textContent = 'Editorial';
            input4.style.display = 'block';input4.value = '';i4.style.display = 'block';input4.type = 'text';input4.placeholder = '1984';i4.textContent = 'Año';
            input5.style.display = 'block';input5.value = '';i5.style.display = 'block';input5.type = 'number';input5.placeholder = '000';i5.textContent = 'Cantidad_Total (unidades)';
        }

        if(document.getElementById('tablaUsuarios').table === 'usuarios'){
            titulo_fila.textContent = 'Nuevo Usuario';
            subtitulo_fila.textContent = 'Completa los datos para registrar un nuevo usuario';
            select1.style.display = 'block';s1.style.display = 'block';
            select1.innerHTML = `
                <option value="Bibliotecario">Bibliotecario</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Investigador">Investigador</option>
            `;
            select2.style.display = 'none';s2.style.display = 'none';
            input1.style.display = 'block';input1.value = '';i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'Ej: Laura Martínez';i1.textContent = 'Nombre';
            input2.style.display = 'block';input2.value = '';i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'usuario@email.com';i2.textContent = 'Correo';
            input3.style.display = 'block';input3.value = '';i3.style.display = 'block';input3.type = 'text';input3.placeholder = '******';i3.textContent = 'Contraseña';
            input4.style.display = 'none';i4.style.display = 'none';
            input5.style.display = 'none';i5.style.display = 'none';
        }

        if(document.getElementById('tablaUsuarios').table === 'prestamos'){
            titulo_fila.textContent = 'Nuevo Prestamo';
            subtitulo_fila.textContent = 'Completa los datos para registrar un nuevo prestamo';
            const response1 = await fetch(url + 'api/id1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
            });
            const res1 = await response1.json();
            const response2 = await fetch(url + 'api/id2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
            });
            const res2 = await response2.json();
            select1.style.display = 'block';s1.style.display = 'block';s1.textContent = 'id usuario';while(0 < select1.children.length){select1.removeChild(select1.firstChild);}for(let i of res1){const option = document.createElement('option');option.value = i.id;option.textContent = i.titulo;select1.appendChild(option);}
            select2.style.display = 'block';s2.style.display = 'block';s2.textContent = 'id libros';while(0 < select2.children.length){select2.removeChild(select2.firstChild);}for(let i of res2){const option = document.createElement('option');option.value = i.id;option.textContent = i.nombre;select2.appendChild(option);}
            input1.style.display = 'block';i1.textContent = 'Fecha de prestamo';input1.type = 'date';input1.style.background = 'white';input1.style.color = 'black';input1.min="2026-01-01";input1.max="2030-12-31";
            input2.style.display = 'none';input2.value = '';i2.style.display = 'none';
            input3.style.display = 'none';input3.value = '';i3.style.display = 'none';
            input4.style.display = 'none';input4.value = '';i4.style.display = 'none';
            input5.style.display = 'none';input5.value = '';i5.style.display = 'none';
        }
        modalUsuario.classList.add('open');
        setTimeout(() => input1.focus(), 100);
    });

    // CERRAR MODAL
    window.cerrarModalUsuario = function () {
        modalUsuario.classList.remove('open');
    };

    //ACTUALIZAR    
    btnActualizar.addEventListener('click', async function () {
        if(document.getElementById('tablaUsuarios').table === 'libros'){
            const titulo = input1.value;
            const autor = input2.value;
            const editorial = input3.value;
            const año = input4.value;
            const cantidad_total = input5.value;
            if (!titulo) {input1.style.background = '#ff6b6b';input1.style.borderColor = '#ff6b6b';input1.focus();setTimeout(() => {input1.style.background = 'rgba(0,0,0,0.3)';input1.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!autor) {input2.style.background = '#ff6b6b';input2.style.borderColor = '#ff6b6b';input2.focus();setTimeout(() => {input2.style.background = 'rgba(0,0,0,0.3)';input2.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!editorial) {input3.style.background = '#ff6b6b';input3.style.borderColor = '#ff6b6b';input3.focus();setTimeout(() => {input3.style.background = 'rgba(0,0,0,0.3)';input3.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!año) {input4.style.background = '#ff6b6b';input4.style.borderColor = '#ff6b6b';input4.focus();setTimeout(() => {input4.style.background = 'rgba(0,0,0,0.3)';input4.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!cantidad_total) {input5.style.background = '#ff6b6b';input5.style.borderColor = '#ff6b6b';input5.focus();setTimeout(() => {input5.style.background = 'rgba(0,0,0,0.3)';input5.style.borderColor = '#00d4ff';}, 1200);return;}
            const fila = document.getElementById(p.textContent);
            fila.children[1].textContent = titulo;
            fila.children[2].textContent = autor;
            fila.children[3].textContent = editorial;
            fila.children[4].textContent = año;
            fila.children[5].textContent = cantidad_total;
            fila.children[6].textContent = cantidad_total;
            const id = Number(p.textContent);
            const cantidadtotal = Number(cantidad_total);
            const response = await fetch(url + 'api/ur_l', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ titulo,autor,editorial,año,cantidadtotal,id })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }

        if(document.getElementById('tablaUsuarios').table === 'usuarios'){
            const rol = select1.value;
            const nombre = input1.value;
            const correo = input2.value;
            const contraseña = input3.value;
            if (!nombre) {input1.style.background = '#ff6b6b';input1.style.borderColor = '#ff6b6b';input1.focus();setTimeout(() => {input1.style.background = 'rgba(0,0,0,0.3)';input1.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!correo || !correo.includes('@')) {input2.style.background = '#ff6b6b';input2.style.borderColor = '#ff6b6b';input2.focus();setTimeout(() => {input2.style.background = 'rgba(0,0,0,0.3)';input2.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!contraseña) {input3.style.background = '#ff6b6b';input3.style.borderColor = '#ff6b6b';input3.focus();setTimeout(() => {input3.style.background = 'rgba(0,0,0,0.3)';input3.style.borderColor = '#00d4ff';}, 1200);return;}
            const fila = document.getElementById(p.textContent);
            fila.children[1].textContent = nombre;
            fila.children[2].textContent = rol;
            fila.children[3].textContent = correo;
            fila.children[4].textContent = contraseña;
            const id = Number(p.textContent);
            const response = await fetch(url + 'api/ur_u', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ nombre,rol,correo,contraseña,id })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }

        if(document.getElementById('tablaUsuarios').table === 'prestamos'){
            const usuario_id = Number(select1.value);
            const libro_id = Number(select2.value);
            const fecha = input1.value;
            if (!fecha) {input1.style.background = '#ff6b6b';input1.style.borderColor = '#ff6b6b';input1.focus();setTimeout(() => {input1.style.background = 'rgba(0,0,0,0.3)';input1.style.borderColor = '#00d4ff';}, 1200);return;}
            const fila = document.getElementById(p.textContent);
            fila.children[3].textContent = fecha;
            const id = Number(p.textContent);
            const response = await fetch(url + 'api/ur_p', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ usuario_id,libro_id,fecha,id })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }
    });

    // GUARDAR
    btnGuardar.addEventListener('click', async function () {
        if(document.getElementById('tablaUsuarios').table === 'libros'){
            const titulo = input1.value;
            const autor = input2.value;
            const editorial = input3.value;
            const año = input4.value;
            const cantidad_total = input5.value;

            if (!titulo) {input1.style.background = '#ff6b6b';input1.style.borderColor = '#ff6b6b';input1.focus();setTimeout(() => {input1.style.background = 'rgba(0,0,0,0.3)';input1.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!autor) {input2.style.background = '#ff6b6b';input2.style.borderColor = '#ff6b6b';input2.focus();setTimeout(() => {input2.style.background = 'rgba(0,0,0,0.3)';input2.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!editorial) {input3.style.background = '#ff6b6b';input3.style.borderColor = '#ff6b6b';input3.focus();setTimeout(() => {input3.style.background = 'rgba(0,0,0,0.3)';input3.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!año) {input4.style.background = '#ff6b6b';input4.style.borderColor = '#ff6b6b';input4.focus();setTimeout(() => {input4.style.background = 'rgba(0,0,0,0.3)';input4.style.borderColor = '#00d4ff';}, 1200);return;}
            if (!cantidad_total) {input5.style.background = '#ff6b6b';input5.style.borderColor = '#ff6b6b';input5.focus();setTimeout(() => {input5.style.background = 'rgba(0,0,0,0.3)';input5.style.borderColor = '#00d4ff';}, 1200);return;}

            const numero = cuerpoTabla.rows.length + 1;
            const nuevaFila = document.createElement('tr');
            nuevaFila.style.opacity = '0';
            nuevaFila.style.transform = 'translateY(-10px)';
            nuevaFila.innerHTML = `
                <td>${numero}</td>
                <td>${escapeHtml(titulo)}</td>
                <td>${escapeHtml(autor)}</td>
                <td>${escapeHtml(editorial)}</td>
                <td>${escapeHtml(año)}</td>
                <td>${escapeHtml(cantidad_total)}</td>
                <td>${escapeHtml(cantidad_total)}</td>
                <td class="acciones">
                    <button class="btn-up" id="${numero}">✏️</button>
                    <label class="btn-up" for="mi-file">📤</label>
                    <button class="btn-delete" title="Eliminar">🗑️</button>
                </td>
                `;
            cuerpoTabla.appendChild(nuevaFila);
            requestAnimationFrame(() => {
                nuevaFila.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                nuevaFila.style.opacity = '1';
                nuevaFila.style.transform = 'translateY(0)';
            });
            const response = await fetch(url + 'api/nr_l', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ titulo,autor,editorial,año,cantidad_total })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }

        if(document.getElementById('tablaUsuarios').table === 'usuarios'){
            const rol = document.getElementById('select1').value;
            const nombre = document.getElementById('input1').value;
            const correo = document.getElementById('input2').value;
            const contraseña = document.getElementById('input3').value;

            if (!nombre) {
                document.getElementById('input1').style.background = '#ff6b6b';document.getElementById('input1').style.borderColor = '#ff6b6b';
                document.getElementById('input1').focus();
                setTimeout(() => {document.getElementById('input1').style.background = 'rgba(0,0,0,0.3)';document.getElementById('input1').style.borderColor = '#00d4ff';}, 1200);
                return;
            }

            if (!correo || !correo.includes('@')) {
                document.getElementById('input2').style.background = '#ff6b6b';document.getElementById('input2').style.borderColor = '#ff6b6b';
                document.getElementById('input2').focus();
                setTimeout(() => {document.getElementById('input2').style.background = 'rgba(0,0,0,0.3)';document.getElementById('input2').style.borderColor = '#00d4ff';}, 1200);
                return;
            }

            if (!contraseña) {
                document.getElementById('input3').style.background = '#ff6b6b';document.getElementById('input3').style.borderColor = '#ff6b6b';
                document.getElementById('input3').focus();
                setTimeout(() => {document.getElementById('input3').style.background = 'rgba(0,0,0,0.3)';document.getElementById('input3').style.borderColor = '#00d4ff';}, 1200);
                return;
            }

            const numero = cuerpoTabla.rows.length + 1;
            const nuevaFila = document.createElement('tr');
            const estado = 'Sesión Desactivada';
            nuevaFila.style.opacity = '0';
            nuevaFila.style.transform = 'translateY(-10px)';
            nuevaFila.innerHTML = `
                <td>${numero}</td>
                <td>${escapeHtml(nombre)}</td>
                <td>${escapeHtml(rol)}</td>
                <td>${escapeHtml(correo)}</td>
                <td>${escapeHtml(contraseña)}</td>
                <td>${escapeHtml(estado)}</td>
                <td class="acciones">
                    <button class="btn-up" id="${numero}">✏️</button>
                    <label class="btn-up" for="mi-file">📤</label>
                    <button class="btn-delete" title="Eliminar">🗑️</button>
                </td>
                `;
            cuerpoTabla.appendChild(nuevaFila);
            requestAnimationFrame(() => {
                nuevaFila.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                nuevaFila.style.opacity = '1';
                nuevaFila.style.transform = 'translateY(0)';
            });
            const response = await fetch(url + 'api/nr_u', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ nombre,rol,correo,contraseña,estado })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }

        if(document.getElementById('tablaUsuarios').table === 'prestamos'){
            const usuario_id = document.getElementById('select1').value;
            const libro_id = document.getElementById('select2').value;
            const fecha = document.getElementById('input1').value;

            if (!fecha) {
                document.getElementById('input1').style.background = '#ff6b6b';document.getElementById('input1').style.borderColor = '#ff6b6b';
                document.getElementById('input1').focus();
                setTimeout(() => {document.getElementById('input1').style.background = 'rgba(0,0,0,0.3)';document.getElementById('input1').style.borderColor = '#00d4ff';}, 1200);
                return;
            }

            const numero = cuerpoTabla.rows.length + 1;
            const nuevaFila = document.createElement('tr');
            nuevaFila.style.opacity = '0';
            nuevaFila.style.transform = 'translateY(-10px)';
            nuevaFila.innerHTML = `
                <td>${numero}</td>
                <td>${escapeHtml(usuario_id)}</td>
                <td>${escapeHtml(libro_id)}</td>
                <td>${escapeHtml(fecha)}</td>
                <td>${escapeHtml('...')}</td>
                <td>${escapeHtml('...')}</td>
                <td>${escapeHtml('...')}</td>
                <td class="acciones">
                    <button class="btn-up" id="${numero}">✏️</button>
                    <label class="btn-up" for="mi-file">📤</label>
                    <button class="btn-delete" title="Eliminar">🗑️</button>
                </td>
                `;
            cuerpoTabla.appendChild(nuevaFila);
            requestAnimationFrame(() => {
                nuevaFila.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                nuevaFila.style.opacity = '1';
                nuevaFila.style.transform = 'translateY(0)';
            });
            const response = await fetch(url + 'api/nr_p', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',   // ← ¡envía y recibe cookies!
                body: JSON.stringify({ usuario_id,libro_id,fecha })
            });
            const res = await response.json();
            cerrarModalUsuario();
        }
        cerrarModalUsuario();
        window.location.reload();
    });

    function escapeHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    }
})();
