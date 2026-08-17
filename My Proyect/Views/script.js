import { fetchete } from './fetchete.js';
import { ShowTable,Filas,Columnas } from './ShowTable.js';

const ca = document.getElementById('c');ca.style.display='none';window.addEventListener('keydown',(ev)=>{if(ev.key === '/'){if(ca.style.display === 'none'){ca.style.display = 'flex';}else{ca.style.display = 'none';}}});
const tmain = document.getElementById('main');
const container = document.getElementById("container");
const nav = document.getElementById("nav");
const nav2 = document.getElementById("nav2");
const search = document.getElementById("search");
const ul = document.getElementById("ul");
export const url = 'http://localhost:3000/';
var t = {};//Objeto de Tabla Global

let currentResolve = null;
let currentReject = null;

//---------modal de la institución
const nsc = document.createElement('div');nsc.classList.add('nsc');//contenedor de la info del colegio
const dimg = document.createElement('div');dimg.classList.add('dimg');//contenedor de imagen del colegio
const img = document.createElement('img');img.classList.add('img');//imagen del colegio
img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYp97_amRVTjZLrnJ6N_pMh1qkl_oCBax6w8_QxtnWYSIt9RnbQmU7n3O&s=10';
const title = document.createElement('h1');title.classList.add('title');title.textContent='Titulo';//titulo de cuadro informativo
const txt = document.createElement('p');txt.classList.add('p');txt.textContent='Texto';//texto de cuadro informativo
title.textContent = 'Unidad Educativa "Nuestra Señora de Coromoto”';txt.textContent = 'El colegio promueve una Educación Integral de estudiantes de acuerdo a los valores cristianos, tomando en cuenta cuatro pilares: aprender a crear, aprender a convivir, aprender a valorar y reflexionar. Incentivando así la capacidad cristiana, hacia la valoración y crecimiento de la persona en búsqueda de su realización y superación en el progreso de la Educación Técnica Pedagógica. Ofrece ser una institución de vanguardia de reconocida trayectoria, que brinda una educación de calidad, basada en valores, brindando a los estudiantes una formación religiosa que permita la disposición de individuos íntegros, críticos y creativos, capaces de adaptarse a los retos de transformación de la sociedad, con participación activa de la familia como ente mediador en el aprendizaje de sus hijos.';
dimg.appendChild(img);
nsc.appendChild(dimg);
nsc.appendChild(title);
nsc.appendChild(txt);
//------------------

async function select(){//selector de tablas
  const res = await fetchete([`SHOW tables;`],url+'api/pass');
  select2();const div = document.createElement('div');
  for(let i=0;i<res.length;i++){
  const button = document.createElement('button');button.textContent = `${Object.values(res[i])}`;
  button.addEventListener('click',() => {
    container.classList.remove('mostrar');
    container.classList.add('ocultar');
    nav2.classList.remove('mostrar');
    nav2.classList.add('ocultar');
    setTimeout(()=>{
      container.classList.remove('ocultar');
      nav2.classList.remove('ocultar');
      if(container.children.length>0)container.removeChild(container.firstChild);
      while(ul.children.length>0){ul.removeChild(ul.firstChild);}//------------------------------------------------------------------
      ShowTable(button.textContent,container,url);
      for(let r=0;r<div.children.length;r++){div.children[r].style.border = 'none';}//
      button.style.border = '5px solid blue';//
      t.SelectedTable = button.textContent;//
      select2();search.value = '';while(ul.children.length>0){ul.removeChild(ul.firstChild);}//
      container.classList.add('mostrar');
      nav2.classList.add('mostrar');
    },500);
  });
  div.appendChild(button);
  }
  nav.appendChild(div);
}

async function select2(){//selector de columnas
  t.SelectedTable='libros';
  const res = await fetchete([`SHOW COLUMNS FROM ${t.SelectedTable};`],url+'api/pass');
  if(nav2.children.length>0)nav2.removeChild(nav2.firstChild);
  const div = document.createElement('div');
  for(let i=0;i<res.length;i++){
  const button = document.createElement('button');button.textContent = `${res[i].Field}`;//🔎
  button.addEventListener('click',() => {
    for(let r=0;r<div.children.length;r++){div.children[r].style.border = 'none';}
    button.style.border = '5px solid blue';t.FileSelectedTable = button.textContent;
    search.value = '';while(ul.children.length>0){ul.removeChild(ul.firstChild);}
  });
  div.appendChild(button);
  }
  nav2.appendChild(div);
}
async function funsearch(a){
  ul.classList.remove('mostrar');
  ul.classList.add('ocultar');
  const patron = /^[^']*$/;
  if(a != '' && patron.test(a)){
  const res = await fetchete([`SELECT * FROM ${t.SelectedTable} WHERE ${t.FileSelectedTable} LIKE '${a}%';`],url+'api/pass');
  setTimeout(()=>{
    while(ul.children.length>0){ul.removeChild(ul.firstChild);}
    Filas(ul,res,t.FileSelectedTable,false,t.SelectedTable,false);
    ul.classList.remove('ocultar');ul.classList.add('mostrar'); 
  },500);
  }else{
  setTimeout(()=>{
    while(ul.children.length>0){ul.removeChild(ul.firstChild);}
    ul.classList.remove('ocultar');
    ul.classList.add('mostrar');
  },500);
  }
} 
let temporizador;
search.addEventListener('input',()=>{
  clearTimeout(temporizador);
    temporizador = setTimeout(() => {
    funsearch(search.value);
  },500);
});
//solo cambia el estado del usuario
async function session(i){
  const res = await fetchete([`UPDATE usuarios SET estado = 'Sesión Activada' WHERE id = ${i.id};`],url+'api/pass');localStorage.setItem('session',i.id);localStorage.setItem('rol',i.rol);
}

export async function newprompt(option,p,column,table,id){
  const modal = document.createElement('div');modal.classList.add('modal');
  const modalc = document.createElement('div');modalc.classList.add('modalc');
  modal.appendChild(modalc);
  const prompt_titulo = document.createElement('h1');prompt_titulo.classList.add('prompt_titulo');
  prompt_titulo.textContent = option.titulo;modalc.appendChild(prompt_titulo);
  const prompt_parrafo = document.createElement('p');prompt_parrafo.classList.add('prompt_parrafo');
  prompt_parrafo.textContent = option.texto;modalc.appendChild(prompt_parrafo);
  const res = await fetchete([`SELECT id,nombre,rol,contraseña FROM usuarios;`],url+'api/pass');
  let ii = [];
  if(option.inputs){
    for(let i of option.inputs){
      const prompt_input = document.createElement('input');
      prompt_input.type = i.type;ii.push(prompt_input);

      if(i.type==='text' || i.type==='string' || i.type ==='number'){
        if(i.text !== undefined)prompt_input.placeholder = i.text;
        if(i.value)prompt_input.value = i.value;
      }

      if(i.type==='button'){
        prompt_input.value = i.text;
        prompt_input.onclick = () => {
          new Promise((resolve, reject) => {
            let op = ii.filter(input => input.type==='text' || input.type === 'number');
            let opt = {};
            for(let i of op){
              opt[i.placeholder]=i.value;
            }
            opt['fun']=i.fun;
            if(i.v)opt['v']=i.v;
            if(resolve){resolve(opt);}else if(reject){reject('Polvazo');}
          }).then(async (values) => {
            if(values.fun==='register'){
              let tt=false;
              for(let i of res){
                if(i.nombre.toUpperCase() === values.nombre.toUpperCase()){
                tt=true;
                break;
                }
              }
              if(tt){
                prompt_titulo.textContent = 'Registro Fallido';
                prompt_parrafo.textContent = 'Usuario ya existente';
              }else{
                await fetchete([`INSERT INTO usuarios (nombre,contraseña) VALUES ('${values.nombre}','${values.contraseña}');`],url+'api/pass');
                const ress = await fetchete([`SELECT id,nombre,rol,contraseña FROM usuarios WHERE nombre = '${values.nombre}';`],url+'api/pass');
                session(ress[0]);
                modal.classList.remove('mostrar');
                modal.classList.add('ocultar');
                setTimeout(()=>{
                  document.body.removeChild(modal);
                },500);
              }
            }else if(values.fun==='login'){
              let tt=false;
              for(let i of res){
                if(i.nombre.toUpperCase() === values.nombre.toUpperCase() && i.contraseña === values.contraseña){
                  session(i);
                  tt=true;
                  break;
                }
              }
              if(!tt){
                prompt_titulo.textContent = 'Inicio de Seción Fallido';
                prompt_parrafo.textContent = 'Nombre o Contraseña Incorrectos';
              }else{
                modal.classList.remove('mostrar');
                modal.classList.add('ocultar');
                setTimeout(()=>{
                  document.body.removeChild(modal);
                },500);
              }
            }else if(values.fun==='update'){
              modal.classList.remove('ocultar');
              modal.classList.add('mostrar');
              if(values.datos !== undefined)p.textContent = values.datos;
                modal.classList.remove('mostrar');
                modal.classList.add('ocultar');
                setTimeout(()=>{
                  document.body.removeChild(modal);
                },500);
              if(values.datos != null && values.datos != ''){
                await fetchete([`UPDATE ${table} SET ${column} = '${values.datos}' WHERE id = ${id};`],url+'api/pass');
              }
            }else if(values.fun==='ids'){
              modal.classList.remove('ocultar');
              modal.classList.add('mostrar');
              if(values.v !== undefined)p.textContent = values.v;
              modal.classList.remove('mostrar');
              modal.classList.add('ocultar');
                setTimeout(()=>{
                  document.body.removeChild(modal);
                },500);
              if(values.v != null && values.v != ''){
                await fetchete([`UPDATE ${table} SET ${column} = '${values.v}' WHERE id = ${id};`],url+'api/pass');
              }
            }
          });
        };
      }
      modalc.appendChild(prompt_input);
    } 
  }
  const prompt_footer = document.createElement('p');prompt_footer.classList.add('prompt_footer');
  prompt_footer.textContent = option.footer;modalc.appendChild(prompt_footer);
  document.body.appendChild(modal);
  modalc.classList.remove('ocultar');
  modalc.classList.add('mostrar');
}

async function init(www,ww){
  //ful();
  if(www){
    if(ww){
      newprompt({titulo:'Login',texto:'Introduce tus datos como usuario',inputs:[{type:'text',text:'nombre'},{type:'text',text:'contraseña'},{type:'button',text:'Login',fun:'login'}],footer:'Register'});
    }else{
      newprompt({titulo:'Register',texto:'Introduce tus datos como usuario',inputs:[{type:'text',text:'nombre'},{type:'text',text:'contraseña'},{type:'button',text:'Register',fun:'register'}],footer:'Login'});
    }
  }
  const res = await fetchete([`SHOW tables;`],url+'api/pass');
  
  ShowTable('libros',container,url,www);//res[2].Tables_in_school
  tmain.classList.add('mostrar');
  select();
}
init(true,true);//login
//init(true,false);//register
//init(false,false);

window.addEventListener('pagehide', (event) => {
  if (!event.persisted && localStorage.getItem('session') !== undefined) {
    const query = [`UPDATE usuarios SET estado = 'Sesión Desactivada' WHERE id = ${localStorage.getItem('session')};`];
    const blob = new Blob([JSON.stringify({query})],{type:'application/json'});localStorage.removeItem('session');
    navigator.sendBeacon(url+'api/pass',blob);
  }
});

