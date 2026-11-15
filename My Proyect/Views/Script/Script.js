import {closeModal} from './CloseModal.js';
import {ShowTable} from './ShowTable.js';
import {toggleSidebar} from './ToggleSideBar.js';
import {sendMessage} from './SendMessage.js';

/*
Siempre debe cambiarse ssl en Database
y url en Script al cambiar entre localhost y producción
*/

//export const url = 'http://localhost:3000/';
export const url = 'https://proyecto-uptt-mbi-2026-programacion-ii.onrender.com/';

const copy = document.getElementById('copyright');

const arr = document.getElementById('chat-toggle-2');
arr.addEventListener('click', function (evento) {
    // 1. Evita que la página recargue o salte arriba por el href="#"
    evento.preventDefault();

    // 2. Lee únicamente el ID guardado en data-destino
    //const idTitulo = i.id;
    const elementoDestino = document.getElementById('page-title');

    // 3. Desplaza la pantalla hacia ese título si existe
    if (elementoDestino) {
      elementoDestino.scrollIntoView({
        behavior: 'smooth', // Desplazamiento animado
        block: 'center'     // Alinea el título al centro de la pantalla
      });
    }
});

const page_title = document.getElementById("page-title");
const page_subtitle = document.getElementById("page-subtitle");

const menu_toggle = document.getElementById('menu-toggle');

// Variable global del módulo para el usuario
export let user = null;

// Helper para saber si hay sesión activa basada en localStorage
const isLoggedIn = () => !!localStorage.getItem('user');

// Cargar usuario desde localStorage al iniciar
try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
        user = userData;
        //console.log('Usuario cargado desde localStorage:', user);
    }
} catch(err) {
    console.log('No hay usuario en localStorage o el formato es inválido:', err);
}

function movil(){
// Verifica si la pantalla es de tamaño móvil o si el navegador es de teléfono
const esMovil = window.innerWidth <= 900 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);//768

if (esMovil && isLoggedIn()) {
    menu_toggle.style.display = 'flex';
}else{
    menu_toggle.style.display = 'none';
}

}

const session = async (table) => {
    document.getElementById('stats-grid').style.display = 'none';
    copy.style.display = 'none';
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    //const btnAgregarFila = document.getElementById('btnAgregarFila');
    const stats_grid = document.getElementById('stats-grid');
    const search_section = document.getElementById('search-section');
    
    if(table === 'libros'){
        page_title.textContent = 'Catálogo de Libros';
        page_subtitle.textContent = 'Aquí podras ver el catálogo completo de Libros disponibles en la Biblioteca de la Unidad Educativa "Nuestra Señora de Coromoto"';
    }else if(table === 'usuarios'){
        page_title.textContent = 'Información de Usuario';
        page_subtitle.textContent = 'Recopilación de tus datos de Usuario';
    }else if(table === 'prestamos'){
        page_title.textContent = 'Lista de Prestamos';
        page_subtitle.textContent = 'Lista de Prestamos que corresponden a tu usuario';
    }

    movil();

    if(isLoggedIn() && user.rol === 'Admin'){// && user.rol === 'Admin'
        document.getElementById('btnGuardarUsuario').style.display = 'flex';
        document.getElementById('btnAgregarFila').style.display = 'flex';
        document.getElementById('btnActualizarUsuario').style.display = 'flex';

        menu_toggle.style.display = 'flex';
    }else if(isLoggedIn() && user.rol !== 'Admin'){
        document.getElementById('btnGuardarUsuario').style.display = 'none';
        document.getElementById('btnAgregarFila').style.display = 'none';
        document.getElementById('btnActualizarUsuario').style.display = 'none';
    }else{
        document.getElementById('btnGuardarUsuario').style.display = 'none';
        document.getElementById('btnAgregarFila').style.display = 'none';
        document.getElementById('btnActualizarUsuario').style.display = 'none';
    }

    if(isLoggedIn()){
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';    
        
        tablaUsuarios.style.display = 'flex';
        ShowTable(table, user.rol);
        tablaUsuarios.table = `${table}`;
        //btnAgregarFila.style.display = 'block';
        stats_grid.style.display = 'none';
        
        nsc.style.display = 'none';
        search_section.style.display = 'block';
        search.value = '';
        
        while(0 < search_bar.children.length){search_bar.removeChild(search_bar.lastChild);}
    }else{
        tablaUsuarios.style.display = 'none';
        //btnAgregarFila.style.display = 'none';
        stats_grid.style.display = 'none';

        tablaUsuarios.table = 'libros';
        search_section.style.display = 'block';
        document.getElementById('sidebar').style.transform = 'translateX(-100%)';
        document.getElementById('main-content').style.marginLeft = 0;

        document.getElementById('logout').style.display = 'none';
        document.getElementById('btn_login').style.display = 'flex';
        document.getElementById('btn_register').style.display = 'flex';
    }
}

async function newFetchete(file){
    const formData = new FormData();
    formData.append('filete', file.files[0]);
    formData.append('id', file.id); 

    await fetch(url + 'upload', {
        method: 'POST',
        body: formData
    });
}

export async function subirAutomatico(file) {
    if (file.files.length > 0) {
        await newFetchete(file);
        window.location.reload();
    }
}

document.getElementById('tablaUsuarios').table = '';

export let table = '';

movil();

if(isLoggedIn()){
    document.getElementById('tablaUsuarios').table = '';
    document.getElementById('search-section').style.display = 'none';
    document.getElementById('logout').style.display = 'flex';
    document.getElementById('btn_login').style.display = 'none';
    document.getElementById('btn_register').style.display = 'none';
}else{
    document.getElementById('tablaUsuarios').table = 'libros';
    document.getElementById('search-section').style.display = 'block';
    document.getElementById('sidebar').style.transform = 'translateX(-100%)';
    document.getElementById('main-content').style.marginLeft = 0;
    document.getElementById('logout').style.display = 'none';
    document.getElementById('btn_login').style.display = 'flex';
    document.getElementById('btn_register').style.display = 'flex';
    document.getElementById('btnAgregarFila').style.display = 'none';
}

const search_bar = document.getElementById('container-search-bar');
const search = document.getElementById('search');
const nsc = document.getElementById('nsc');

document.getElementById('tablaUsuarios').style.display = 'none';
document.getElementById('btnAgregarFila').style.display = 'none';

const dashboard = document.getElementById('dashboard');
dashboard.addEventListener('click',() => {
    document.getElementById('stats-grid').style.display = 'none';
    copy.style.display = 'flex';
    page_title.textContent = 'Panel de Inicio';
    page_subtitle.textContent = 'Bienvenido a tu sistema de gestión bibliotecaria inteligente';
    if(isLoggedIn()){
        const tablaUsuarios = document.getElementById('tablaUsuarios');
        tablaUsuarios.style.display = 'none';
        document.getElementById('btnAgregarFila').style.display = 'none';
        document.getElementById('tablaUsuarios').table = '';
    }
    document.getElementById('search-section').style.display = 'none';
    nsc.style.display = 'block';
    while(0 < search_bar.children.length){
        search_bar.removeChild(search_bar.lastChild);
    }
    search.value = '';
});

const libros = document.getElementById('libros');
libros.addEventListener('click',()=>{
    session('libros');
    document.getElementById('btnAgregarFila').textContent = 'Guardar Libro';
    document.getElementById('btnActualizarUsuario').textContent = 'Actualizar Libro';
    document.getElementById('btnGuardarUsuario').textContent = 'Guardar Libro';
});

const usuarios = document.getElementById('usuarios');
usuarios.addEventListener('click',()=>{
    session('usuarios');
    document.getElementById('btnAgregarFila').textContent = 'Guardar Usuario';
    document.getElementById('btnActualizarUsuario').textContent = 'Actualizar Usuario';
    document.getElementById('btnGuardarUsuario').textContent = 'Guardar Usuario';
});

const prestamos = document.getElementById('prestamos');
prestamos.addEventListener('click',()=>{
    session('prestamos');
    document.getElementById('btnAgregarFila').textContent = 'Guardar Prestamo';
    document.getElementById('btnActualizarUsuario').textContent = 'Actualizar Prestamos';
    document.getElementById('btnGuardarUsuario').textContent = 'Guardar Prestamos';
});

const reportes = document.getElementById('reportes');
reportes.addEventListener('click', async ()=>{
    copy.style.display = 'flex';
    const response1 = await fetch(url + 'api/st_libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const res1 = await response1.json();
    if(res1){
        console.log(Object.values(res1[0])[0]);
        document.getElementById('v-l').textContent = Object.values(res1[0])[0];
    }else{
        document.getElementById('v-l').textContent = '...';
    }

    const response2 = await fetch(url + 'api/st_usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const res2 = await response2.json();
    if(res2){
        console.log(Object.values(res2[0])[0]);
        document.getElementById('v-u').textContent = Object.values(res2[0])[0];
    }else{
        document.getElementById('v-u').textContent = '...';
    }

    const response3 = await fetch(url + 'api/st_prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const res3 = await response3.json();
    if(res3){
        console.log(Object.values(res3[0])[0]);
        document.getElementById('v-p').textContent = Object.values(res3[0])[0];
    }else{
        document.getElementById('v-p').textContent = '...';
    }

    const response4 = await fetch(url + 'api/st_devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const res4 = await response4.json();
    if(res4){
        console.log(Object.values(res4[0])[0]);
        document.getElementById('v-d').textContent = Object.values(res4[0])[0];
    }else{
        document.getElementById('v-d').textContent = '...';
    }

    page_title.textContent = 'Panel de Estadisticas';
    page_subtitle.textContent = 'Cantidad Total de Datos registrados';
    if(isLoggedIn()){
        const tablaUsuarios = document.getElementById('tablaUsuarios');
        tablaUsuarios.style.display = 'none';
        document.getElementById('btnAgregarFila').style.display = 'none';
        document.getElementById('tablaUsuarios').table = '';
    }
    document.getElementById('search-section').style.display = 'none';
    nsc.style.display = 'none';
    while(0 < search_bar.children.length){
        search_bar.removeChild(search_bar.lastChild);
    }
    search.value = '';
    document.getElementById('stats-grid').style.display = 'flex';
});

search.addEventListener('input',()=>{
    while(0 < search_bar.children.length){
        search_bar.removeChild(search_bar.lastChild);
    }
    setTimeout(async ()=>{
        const text = `${search.value}%`;
        if(document.getElementById('tablaUsuarios').table !== '' && text !== '%'){
            const table = document.getElementById('tablaUsuarios').table;
            const response = await fetch(url + 'api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ table,text })
            });
            const res = await response.json();
            if(document.getElementById('tablaUsuarios').table === 'libros'){
                search_bar.style.height = '60vh';
                const libro_card = document.getElementById('libro-card');
                for(let i of res){
                    const article = libro_card.cloneNode(true);
                    article.style.display ='flex';
                    article.children[1].children[0].textContent = i.titulo;
                    article.children[1].children[1].children[0].children[1].textContent = i.titulo;
                    article.children[1].children[1].children[1].children[1].textContent = i.autor;
                    article.children[1].children[1].children[3].children[1].textContent = i.editorial;
                    article.children[1].children[1].children[2].children[1].textContent = i.año;
                    article.children[1].children[1].children[4].children[1].textContent = i.cantidad_total;
                    //article.children[1].children[1].children[5].children[1].textContent = i.disponibles;
article.children[1].children[1].children[5].style.display = 'flex';
article.children[1].children[1].children[5].href = '#';
article.children[1].children[1].children[5].addEventListener('click', function (evento) {
    // 1. Evita que la página recargue o salte arriba por el href="#"
    evento.preventDefault();

    // 2. Lee únicamente el ID guardado en data-destino
    //const idTitulo = i.id;
    const elementoDestino = document.getElementById(i.id);

    // 3. Desplaza la pantalla hacia ese título si existe
    if (elementoDestino) {
      elementoDestino.scrollIntoView({
        behavior: 'smooth', // Desplazamiento animado
        block: 'center'     // Alinea el título al centro de la pantalla
      });
    }

    const color_anterior = document.getElementById(i.id).style.borderColor;
    document.getElementById(i.id).style.borderColor = '#00d4ff';
    setTimeout(() => {document.getElementById(i.id).style.borderColor = color_anterior;}, 3000);     
});
article.children[1].children[1].children[6].style.display = 'flex';
article.children[1].children[1].children[6].href = i.url;

if(i.url){
article.children[1].children[2].children[2].children[0].src = i.url + '#toolbar=1&navpanes=1&view=FitH';
article.children[1].children[2].children[2].style.display = 'block';

article.children[1].children[1].children[6].style.display = 'flex';
article.children[1].children[1].children[6].href = i.url;
}else{
article.children[1].children[1].children[6].style.display = 'none';

article.children[1].children[1].children[5].style.display = 'none';
article.children[1].children[2].children[2].style.display = 'none';
}

                    search_bar.appendChild(article);
                }
            }else{
                search_bar.style.height = '60vh';
                for(let i of res){
                    const div = document.createElement('div');
                    div.style = 'text-align: center;width:100%;border:1px solid var(--secondary);background: var(--bg);padding:20px;margin-top: 20px;border-radius:5px;box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.15);';
                    for(let ii of Object.values(i)){
                        div.textContent += ii + ' _ ';
                    }
                    search_bar.appendChild(div);
                }
            }
        }else{
            search_bar.style.height = '10vh';
        }
    },1000);
});

const logout = document.getElementById('logout');
logout.addEventListener('click',async ()=> {
    // Limpiar localStorage y estado
    localStorage.removeItem('user');
    user = null;
    
    // Opcional: llamar al backend para limpiar cookie
    try {
        await fetch(url + 'api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
    } catch(e) { console.log('Error cerrando sesión en servidor:', e); }

    document.getElementById('logout').style.display = 'none';
    document.getElementById('btn_login').style.display = 'flex';
    document.getElementById('btn_register').style.display = 'flex';
    document.getElementById('tablaUsuarios').style.display = 'none';

    document.getElementById('sidebar').style.transform = 'translateX(-240px)';
    document.getElementById('main-content').style.marginLeft = '0';
    document.getElementById('search-section').style.display = 'block';
    document.getElementById('nsc').style.display = 'block';
    document.getElementById('btnAgregarFila').style.display = 'none';
    document.getElementById('tablaUsuarios').table = 'libros';

    movil();
    window.location.reload();
});

const login = document.getElementById('login');
login.addEventListener('click',async () => {
    const cedula = document.getElementById('cedula-l').value;
    const contraseña = document.getElementById('password-l').value;
    document.getElementById('cedula-l').value = '';
    document.getElementById('password-l').value = '';
    
    const response = await fetch(url + 'api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cedula,contraseña })
    });
    const res = await response.json();

    console.log('Respuesta del login:', res);
    console.log('Status HTTP:', response.status);

    if(res.ok){
        user = res.user;
        // Guardar usuario completo en localStorage como JSON
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log('Usuario guardado en localStorage:', localStorage.getItem('user'));
        
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';
        closeModal();
        
        document.getElementById('search-section').style.display = 'none'; 
        document.getElementById('sidebar').style.transform = 'translateX(0px)'; 
        document.getElementById('main-content').style.marginLeft = '240px';
        
        const tablaUsuarios = document.getElementById('tablaUsuarios');
        tablaUsuarios.style.display = 'none';
        document.getElementById('btnAgregarFila').style.display = 'none';
        document.getElementById('tablaUsuarios').table = '';
        
        document.getElementById('search-section').style.display = 'none';
        nsc.style.display = 'block';
        while(0 < search_bar.children.length){search_bar.removeChild(search_bar.lastChild);}
        search.value = '';

        movil();
        window.location.reload();
    }
});

const register = document.getElementById('register');
register.addEventListener('click',async () => {
    const name = document.getElementById('name-r').value;
    const cedula = document.getElementById('cedula-r').value;
    const password = document.getElementById('password-r').value;
    document.getElementById('name-r').value = '';
    document.getElementById('cedula-r').value = '';
    document.getElementById('password-r').value = '';
    
    const response = await fetch(url + 'api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name,cedula,password })
    });
    const res = await response.json();

    if(res.ok){
        user = res.user;
        // Guardar usuario completo en localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
        
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';
        closeModal();
        
        document.getElementById('search-section').style.display = 'none'; 
        document.getElementById('sidebar').style.transform = 'translateX(0px)'; 
        document.getElementById('main-content').style.marginLeft = '240px';

        movil();
        window.location.reload();
    }
});

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (window.innerWidth <= 900) toggleSidebar();
    });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && document.getElementById('chatWindow').classList.length > 1) sendMessage(); });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); cerrarModalUsuario(); }
});