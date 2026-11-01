import {closeModal} from './CloseModal.js';
import {ShowTable} from './ShowTable.js';
import {toggleSidebar} from './ToggleSideBar.js';
import {sendMessage} from './SendMessage.js';

export const url = 'http://localhost:3000/';

const id123 = Number(localStorage.getItem('user'));

const response = await fetch(url + 'api/my', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ← ¡envía y recibe cookies!
      body: JSON.stringify({ id123 })
    });
const res123 = await response.json();

let user = res123[0];

console.log(user);

const session = async (table) => {
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const btnAgregarFila = document.getElementById('btnAgregarFila');
    const stats_grid = document.getElementById('stats-grid');
    const search_section = document.getElementById('search-section');
    if(document.cookie){
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';    
        if(user.rol === 'Admin'){
            console.log('Es Admin');
            tablaUsuarios.style.display = 'flex';
            ShowTable(`SELECT * FROM ${table};`);
            tablaUsuarios.table = `${table}`;
            btnAgregarFila.style.display = 'block';
            stats_grid.style.display = 'none';
            
            nsc.style.display = 'none';
            search_section.style.display = 'block';
            search.value = '';

            while(0 < search_bar.children.length){search_bar.removeChild(search_bar.lastChild);}
        }else{
            console.log('No es Admin');
            /*
            tablaUsuarios.style.display = 'flex';
            if(table === 'libros'){
                ShowTable(`SELECT * FROM ${table};`);
            }else if(table === 'usuarios'){
                ShowTable(`SELECT * FROM ${table} WHERE nombre = ${name};`);
            }else if(table === 'prestamos'){
                ShowTable(`SELECT * FROM ${table} WHERE ${usuario_id};`);
            }
            tablaUsuarios.table = `${table}`;
            btnAgregarFila.style.display = 'block';
            stats_grid.style.display = 'none';

            nsc.style.display = 'none';
            search_section.style.display = 'block';
            search.value = '';

            while(0 < search_bar.children.length){search_bar.removeChild(search_bar.lastChild);}
            */
        }
    }else{
        tablaUsuarios.style.display = 'none';
        btnAgregarFila.style.display = 'none';
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
    // 1. Añadimos el archivo
    formData.append('filete', file.files[0]);
    // 2. Añadimos el ID directamente al formData
    formData.append('id', file.id); 

    await fetch(url + 'upload', {
        method: 'POST',
        body: formData // Enviamos el formData DIRECTAMENTE como cuerpo
    });
}

export async function subirAutomatico(file) {
    // Verifica que el usuario sí haya seleccionado un archivo
    if (file.files.length > 0) {
        //console.log(file.files[0]);
        await newFetchete(file);
        window.location.reload();
    }
}

document.getElementById('tablaUsuarios').table = '';

export let table = '';

if(document.cookie){
    document.getElementById('tablaUsuarios').table = '';
    document.getElementById('search-section').style.display = 'none';
    //document.getElementById('sidebar').style.display = 'flex';
    //document.getElementById('main-content').style.marginLeft = 0;
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
}


const search_bar = document.getElementById('container-search-bar');
const search = document.getElementById('search');

const nsc = document.createElement('div');nsc.classList.add('nsc');//contenedor de la info del colegio
const dimg = document.createElement('div');dimg.classList.add('dimg');//contenedor de imagen del colegio
const img = document.createElement('img');img.classList.add('img');//imagen del colegio
img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYp97_amRVTjZLrnJ6N_pMh1qkl_oCBax6w8_QxtnWYSIt9RnbQmU7n3O&s=10';
const title = document.createElement('h1');title.classList.add('title');title.textContent='Titulo';//titulo de cuadro informativo
const txt = document.createElement('p');txt.classList.add('txt');txt.textContent='Texto';//texto de cuadro informativo
title.textContent = 'Unidad Educativa "Nuestra Señora de Coromoto”';txt.textContent = 'El colegio promueve una Educación Integral de estudiantes de acuerdo a los valores cristianos, tomando en cuenta cuatro pilares: aprender a crear, aprender a convivir, aprender a valorar y reflexionar. Incentivando así la capacidad cristiana, hacia la valoración y crecimiento de la persona en búsqueda de su realización y superación en el progreso de la Educación Técnica Pedagógica. Ofrece ser una institución de vanguardia de reconocida trayectoria, que brinda una educación de calidad, basada en valores, brindando a los estudiantes una formación religiosa que permita la disposición de individuos íntegros, críticos y creativos, capaces de adaptarse a los retos de transformación de la sociedad, con participación activa de la familia como ente mediador en el aprendizaje de sus hijos.';
dimg.appendChild(img);
nsc.appendChild(dimg);
nsc.appendChild(title);
nsc.appendChild(txt);
document.getElementById('nsc').appendChild(nsc);

document.getElementById('tablaUsuarios').style.display = 'none';
document.getElementById('btnAgregarFila').style.display = 'none';

const dashboard = document.getElementById('dashboard');
dashboard.addEventListener('click',() => {
    
    if(document.cookie){
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    tablaUsuarios.style.display = 'none';
    document.getElementById('btnAgregarFila').style.display = 'none';
    //document.getElementById('stats-grid').style.display = 'grid';
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
});

const usuarios = document.getElementById('usuarios');
usuarios.addEventListener('click',()=>{
    session('usuarios');
});

const prestamos = document.getElementById('prestamos');
prestamos.addEventListener('click',()=>{
    session('prestamos');
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
      credentials: 'include',   // ← ¡envía y recibe cookies!
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
            article.children[1].children[1].children[2].children[1].textContent = i.editorial;
            article.children[1].children[1].children[3].children[1].textContent = i.año;
            article.children[1].children[1].children[4].children[1].textContent = i.cantidad_total;
            article.children[1].children[1].children[5].children[1].textContent = i.disponibles;
            article.children[1].children[2].children[0].href = i.url;
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
    const id = user.id;
    const response = await fetch(url + 'api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ← ¡envía y recibe cookies!
      body: JSON.stringify({ id })
    });
    const res = await response.json();
    if(res){
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
        user = null;localStorage.removeItem('user');
    }
});

const login = document.getElementById('login');
login.addEventListener('click',async () => {
    const correo = document.getElementById('email-l').value;
    const contraseña = document.getElementById('password-l').value;
    document.getElementById('email-l').value = '';
    document.getElementById('password-l').value = '';
    const response = await fetch(url + 'api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ← ¡envía y recibe cookies!
      body: JSON.stringify({ correo,contraseña })
    });
    const res = await response.json();

    if(res.ok){
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';
        closeModal();
        if(document.cookie){
            document.getElementById('search-section').style.display = 'none'; 
            document.getElementById('sidebar').style.transform = 'translateX(0px)'; 
            document.getElementById('main-content').style.marginLeft = '240px';
            user = res.user;localStorage.setItem('user',`${res.user.id}`);
        }
    }
});

const register = document.getElementById('register');
register.addEventListener('click',async () => {
    /*
    const correo = document.getElementById('email-l').value;
    const contraseña = document.getElementById('password-l').value;
    document.getElementById('email-l').value = '';
    document.getElementById('password-l').value = '';
    const response = await fetch(url + 'api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ← ¡envía y recibe cookies!
      body: JSON.stringify({ correo,contraseña })
    });
    const res = await response.json();

    if(res.ok){
        document.getElementById('logout').style.display = 'flex';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_register').style.display = 'none';
        closeModal();
        if(document.cookie){
            document.getElementById('search-section').style.display = 'none'; 
            document.getElementById('sidebar').style.transform = 'translateX(0px)'; 
            document.getElementById('main-content').style.marginLeft = '240px';
            user = res.user;localStorage.setItem('user',`${res.user.id}`);
        }
    }
    */
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