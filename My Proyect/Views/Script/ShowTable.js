import {url,subirAutomatico} from './Script.js';

export async function ShowTable(table,rol){
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    tablaUsuarios.style.display = 'flex';
    
    // Obtener ID del usuario desde localStorage
    let idUsuario1 = null;
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        idUsuario1 = userData ? userData.id : null;
    } catch(e) { console.error('Error leyendo usuario:', e); }

    //console.log(idUsuario);

    /*
    if(rol === 'Admin'){
        q = `SELECT * FROM ${table};`;
    }else{
        if(table === 'libros'){
            q = `SELECT * FROM ${table};`;
        }else if(table === 'usuarios'){
            q = `SELECT * FROM ${table} WHERE id = ${idUsuario};`;
        }else{
            q = `SELECT * FROM ${table} WHERE usuario_id = ${idUsuario};`;
        }
    }
    */
    
    //const query = q;
    const role = rol
    const tabla = table;
    const idUsuario = idUsuario1;
    const response = await fetch(url + 'api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tabla,idUsuario,role })
    });
    const res = await response.json();

    const titulosTabla = document.getElementById('titulosTabla');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    
    while(0 < titulosTabla.children.length){
        titulosTabla.removeChild(titulosTabla.firstChild);
    }

    while(0 < cuerpoTabla.children.length){
        cuerpoTabla.removeChild(cuerpoTabla.firstChild);
    }
    
    if(res.length){
        for(let i of Object.keys(res[0])){
            const th = document.createElement('th');
            th.textContent = i;
            titulosTabla.appendChild(th);
        }

        if(rol === 'Admin' || table === 'usuarios'){
            const th = document.createElement('th');
            th.textContent = 'Acciones';
            titulosTabla.appendChild(th);
        }

        for(let i of res){
            const tr = document.createElement('tr');tr.id = i.id;
            for(let ii of Object.values(i)){
                const td = document.createElement('td');
                td.textContent = ii;
                //if(ii === res[0].id)td.id = ii,console.log(ii);
                tr.appendChild(td);
            }

            const cuerpoTabla = document.getElementById('cuerpoTabla');
            const modalUsuario = document.getElementById('modalUsuarioOverlay');
            const select1 = document.getElementById('select1');const s1 = document.getElementById('s1');
            const select2 = document.getElementById('select2');const s2 = document.getElementById('s2');
            const input1 = document.getElementById('input1');const i1 = document.getElementById('i1');
            const input2 = document.getElementById('input2');const i2 = document.getElementById('i2');
            const input3 = document.getElementById('input3');const i3 = document.getElementById('i3');
            const input4 = document.getElementById('input4');const i4 = document.getElementById('i4');
            const input5 = document.getElementById('input5');const i5 = document.getElementById('i5');
            const titulo_fila = document.getElementById('titulo_fila');
            const subtitulo_fila = document.getElementById('subtitulo_fila');
            const btnGuardar = document.getElementById('btnGuardarUsuario');
            const btnActualizar = document.getElementById('btnActualizarUsuario');
            
            const update = document.createElement('button');
            update.className = 'btn-up';
            update.textContent = '✏️';
            update.id = i.id;
            update.addEventListener('click', async () => {
                btnActualizar.style.display = 'block';
                btnGuardar.style.display = 'none';
                if(document.getElementById('tablaUsuarios').table === 'libros'){
                    const fila = document.getElementById(i.id);
                    document.getElementById('p').textContent = i.id;
                    modalUsuario.classList.add('open');
                    titulo_fila.textContent = 'Actualizar Libro';
                    subtitulo_fila.textContent = 'Completa los datos para actualizar un libro';
                    select1.style.display = 'none';s1.style.display = 'none';
                    select2.style.display = 'none';s2.style.display = 'none';
                    input1.style.display = 'block';input1.value = fila.children[1].textContent;i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'El Cuento';i1.textContent = 'Titulo';
                    input2.style.display = 'block';input2.value = fila.children[2].textContent;i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'Pepe';i2.textContent = 'Autor';
                    input3.style.display = 'block';input3.value = fila.children[3].textContent;i3.style.display = 'block';input3.type = 'text';input3.placeholder = 'Edit';i3.textContent = 'Editorial';
                    input4.style.display = 'block';input4.value = fila.children[4].textContent;i4.style.display = 'block';input4.type = 'text';input4.placeholder = '1984';i4.textContent = 'Año';
                    input5.style.display = 'block';input5.value = fila.children[5].textContent;i5.style.display = 'block';input5.type = 'number';input5.placeholder = '000';i5.textContent = 'Cantidad_Total (unidades)';
                }

                if(document.getElementById('tablaUsuarios').table === 'usuarios'){
                    const fila = document.getElementById(i.id);
                    document.getElementById('p').textContent = i.id;
                    modalUsuario.classList.add('open');
                    titulo_fila.textContent = 'Actualizar Usuario';
                    subtitulo_fila.textContent = 'Completa los datos para actualizar un usuario';
                    select1.style.display = 'block';s1.style.display = 'block';
                    select1.innerHTML = `
                        <option value="Bibliotecario">Bibliotecario</option>
                        <option value="Estudiante">Estudiante</option>
                        <option value="Docente">Docente</option>
                        <option value="Investigador">Investigador</option>
                    `;
                    select2.style.display = 'none';s2.style.display = 'none';
                    input1.style.display = 'block';input1.value = fila.children[1].textContent;i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'Ej: Laura Martínez';i1.textContent = 'Nombre';
                    input2.style.display = 'block';input2.value = fila.children[3].textContent;i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'V-000000000';i2.textContent = 'Cedula';
                    input3.style.display = 'block';input3.value = fila.children[4].textContent;i3.style.display = 'block';input3.type = 'text';input3.placeholder = '******';i3.textContent = 'Contraseña';
                    input4.style.display = 'none';i4.style.display = 'none';
                    input5.style.display = 'none';i5.style.display = 'none';
                }

                if(document.getElementById('tablaUsuarios').table === 'prestamos'){
                    const fila = document.getElementById(i.id);
                    document.getElementById('p').textContent = i.id;
                    modalUsuario.classList.add('open');
                    titulo_fila.textContent = 'Actualizar Prestamo';
                    subtitulo_fila.textContent = 'Completa los datos para actualizar un prestamo';
                    const response1 = await fetch(url + 'api/id1', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    const res1 = await response1.json();
                    const response2 = await fetch(url + 'api/id2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    const res2 = await response2.json();
                    
                    select1.style.display = 'block';s1.style.display = 'block';s1.textContent = 'id usuario';while(0 < select1.children.length){select1.removeChild(select1.firstChild);}for(let i of res1){const option = document.createElement('option');option.value = i.id;option.textContent = i.titulo;select1.appendChild(option);}
                    select2.style.display = 'block';s2.style.display = 'block';s2.textContent = 'id libros';while(0 < select2.children.length){select2.removeChild(select2.firstChild);}for(let i of res2){const option = document.createElement('option');option.value = i.id;option.textContent = i.nombre;select2.appendChild(option);}
                    input1.style.display = 'block';i1.textContent = 'Fecha de prestamo';input1.type = 'date';input1.style.background = 'white';input1.style.color = 'black';input1.min="2026-01-01";input1.max="2030-12-31";
                    input2.style.display = 'block';i2.textContent = 'Fecha de devolución';input2.type = 'date';input2.style.background = 'white';input2.style.color = 'black';input2.min="2026-01-01";input2.max="2030-12-31";
                    input3.style.display = 'none';input3.value = '';i3.style.display = 'none';
                    input4.style.display = 'none';input4.value = '';i4.style.display = 'none';
                    input5.style.display = 'none';input5.value = '';i5.style.display = 'none';
                }
            });

            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.id = i.id  + 'u';
            input.addEventListener('change',() => {
                subirAutomatico(input);
            });
            
            const upload = document.createElement('label');
            upload.className = 'btn-up';
            upload.textContent = '📤';
            upload.htmlFor = i.id + 'u';

            const eliminate = document.createElement('button');
            eliminate.className = 'btn-delete';
            eliminate.textContent = '🗑️';

            const td = document.createElement('td');
            td.className = 'acciones';
            if(rol === 'Admin'){
                td.appendChild(update);
                td.appendChild(input);
                if(table === 'libros')td.appendChild(upload);
                td.appendChild(eliminate);
                tr.appendChild(td);
            }else{
                if(table === 'usuarios'){
                    td.appendChild(update);
                    tr.appendChild(td);
                }
            }
            cuerpoTabla.appendChild(tr);
        }
    }
}
/*
import {url,subirAutomatico} from './Script.js';

export async function ShowTable(table,rol){
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    tablaUsuarios.style.display = 'flex';
    let q;
    if(rol === 'Admin'){
        q = `SELECT * FROM ${table};`;
    }else{
        if(table === 'libros'){
            q = `SELECT * FROM ${table};`;
        }else if(table === 'usuarios'){
            q = `SELECT * FROM ${table} WHERE id = ${Number(localStorage.getItem('user'))};`;
        }else{
            q = `SELECT * FROM ${table} WHERE usuario_id = ${Number(localStorage.getItem('user'))};`;
        }
    }
    const query = q;
    const response = await fetch(url + 'api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ← ¡envía y recibe cookies!
      body: JSON.stringify({ query })
    });
    const res = await response.json();

    const titulosTabla = document.getElementById('titulosTabla');
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    
    while(0 < titulosTabla.children.length){
        titulosTabla.removeChild(titulosTabla.firstChild);
    }

    while(0 < cuerpoTabla.children.length){
        cuerpoTabla.removeChild(cuerpoTabla.firstChild);
    }

    //console.log(res);
    
    if(res.length){

    for(let i of Object.keys(res[0])){
        const th = document.createElement('th');
        th.textContent = i;
        titulosTabla.appendChild(th);
    }

    if(rol === 'Admin'){
        const th = document.createElement('th');
        th.textContent = 'Acciones';
        titulosTabla.appendChild(th);
    }else{
        if(table === 'usuarios'){
            const th = document.createElement('th');
            th.textContent = 'Acciones';
            titulosTabla.appendChild(th);
        }
    }

    for(let i of res){
        const tr = document.createElement('tr');tr.id = i.id;
        for(let ii of Object.values(i)){
                const td = document.createElement('td');
                td.textContent = ii;
                tr.appendChild(td);
        }

        const cuerpoTabla = document.getElementById('cuerpoTabla');
        const modalUsuario = document.getElementById('modalUsuarioOverlay');
        const select1 = document.getElementById('select1');const s1 = document.getElementById('s1');
        const select2 = document.getElementById('select2');const s2 = document.getElementById('s2');
        const input1 = document.getElementById('input1');const i1 = document.getElementById('i1');
        const input2 = document.getElementById('input2');const i2 = document.getElementById('i2');
        const input3 = document.getElementById('input3');const i3 = document.getElementById('i3');
        const input4 = document.getElementById('input4');const i4 = document.getElementById('i4');
        const input5 = document.getElementById('input5');const i5 = document.getElementById('i5');
        const titulo_fila = document.getElementById('titulo_fila');
        const subtitulo_fila = document.getElementById('subtitulo_fila');
        const btnGuardar = document.getElementById('btnGuardarUsuario');
        const btnActualizar = document.getElementById('btnActualizarUsuario');
        
        const update = document.createElement('button');
        update.className = 'btn-up';
        update.textContent = '✏️';
        update.id = i.id;
        update.addEventListener('click', async () => {
            btnActualizar.style.display = 'block';
            btnGuardar.style.display = 'none';
            if(document.getElementById('tablaUsuarios').table === 'libros'){
                const fila = document.getElementById(i.id);
                document.getElementById('p').textContent = i.id;
                modalUsuario.classList.add('open');
                titulo_fila.textContent = 'Actualizar Libro';
                subtitulo_fila.textContent = 'Completa los datos para actualizar un libro';
                select1.style.display = 'none';s1.style.display = 'none';
                select2.style.display = 'none';s2.style.display = 'none';
                input1.style.display = 'block';input1.value = fila.children[1].textContent;i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'El Cuento';i1.textContent = 'Titulo';
                input2.style.display = 'block';input2.value = fila.children[2].textContent;i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'Pepe';i2.textContent = 'Autor';
                input3.style.display = 'block';input3.value = fila.children[3].textContent;i3.style.display = 'block';input3.type = 'text';input3.placeholder = 'Edit';i3.textContent = 'Editorial';
                input4.style.display = 'block';input4.value = fila.children[4].textContent;i4.style.display = 'block';input4.type = 'text';input4.placeholder = '1984';i4.textContent = 'Año';
                input5.style.display = 'block';input5.value = fila.children[5].textContent;i5.style.display = 'block';input5.type = 'number';input5.placeholder = '000';i5.textContent = 'Cantidad_Total (unidades)';
            }

            if(document.getElementById('tablaUsuarios').table === 'usuarios'){
                const fila = document.getElementById(i.id);
                document.getElementById('p').textContent = i.id;
                modalUsuario.classList.add('open');
                titulo_fila.textContent = 'Actualizar Usuario';
                subtitulo_fila.textContent = 'Completa los datos para actualizar un usuario';
                select1.style.display = 'block';s1.style.display = 'block';
                select1.innerHTML = `
                    <option value="Bibliotecario">Bibliotecario</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                    <option value="Investigador">Investigador</option>
                `;
                select2.style.display = 'none';s2.style.display = 'none';
                input1.style.display = 'block';input1.value = fila.children[1].textContent;i1.style.display = 'block';input1.type = 'text';input1.placeholder = 'Ej: Laura Martínez';i1.textContent = 'Nombre';
                input2.style.display = 'block';input2.value = fila.children[3].textContent;i2.style.display = 'block';input2.type = 'text';input2.placeholder = 'V-000000000';i2.textContent = 'Cedula';
                input3.style.display = 'block';input3.value = fila.children[4].textContent;i3.style.display = 'block';input3.type = 'text';input3.placeholder = '******';i3.textContent = 'Contraseña';
                input4.style.display = 'none';i4.style.display = 'none';
                input5.style.display = 'none';i5.style.display = 'none';
            }

            if(document.getElementById('tablaUsuarios').table === 'prestamos'){
                const fila = document.getElementById(i.id);
                document.getElementById('p').textContent = i.id;
                modalUsuario.classList.add('open');
                titulo_fila.textContent = 'Actualizar Prestamo';
                subtitulo_fila.textContent = 'Completa los datos para actualizar un prestamo';
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
                
                //para obtener fecha del prestamo
                select1.style.display = 'block';s1.style.display = 'block';s1.textContent = 'id usuario';while(0 < select1.children.length){select1.removeChild(select1.firstChild);}for(let i of res1){const option = document.createElement('option');option.value = i.id;option.textContent = i.titulo;select1.appendChild(option);}
                select2.style.display = 'block';s2.style.display = 'block';s2.textContent = 'id libros';while(0 < select2.children.length){select2.removeChild(select2.firstChild);}for(let i of res2){const option = document.createElement('option');option.value = i.id;option.textContent = i.nombre;select2.appendChild(option);}
                input1.style.display = 'block';i1.textContent = 'Fecha de prestamo';input1.type = 'date';input1.style.background = 'white';input1.style.color = 'black';input1.min="2026-01-01";input1.max="2030-12-31";
                input2.style.display = 'block';i2.textContent = 'Fecha de devolución';input2.type = 'date';input2.style.background = 'white';input2.style.color = 'black';input2.min="2026-01-01";input2.max="2030-12-31";
                //input2.style.display = 'none';input2.value = '';i2.style.display = 'none';
                input3.style.display = 'none';input3.value = '';i3.style.display = 'none';
                input4.style.display = 'none';input4.value = '';i4.style.display = 'none';
                input5.style.display = 'none';input5.value = '';i5.style.display = 'none';
            }
        });

        //<input style="display:none;" type="file" id="mi-file"/>
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.id = i.id  + 'u';
        input.addEventListener('change',() => {
            subirAutomatico(input);
        });
        //console.log(input.id);
        const upload = document.createElement('label');
        upload.className = 'btn-up';
        upload.textContent = '📤';
        upload.htmlFor = i.id + 'u';//mi-file

        const eliminate = document.createElement('button');
        eliminate.className = 'btn-delete';
        eliminate.textContent = '🗑️';

        const td = document.createElement('td');
        td.className = 'acciones';
        if(rol === 'Admin'){
            td.appendChild(update);
            td.appendChild(input);
            if(table === 'libros')td.appendChild(upload);
            td.appendChild(eliminate);
            tr.appendChild(td);
        }else{
            if(table === 'usuarios'){
                td.appendChild(update);
                tr.appendChild(td);
            }
        }
        cuerpoTabla.appendChild(tr);
    }

    }
}
*/