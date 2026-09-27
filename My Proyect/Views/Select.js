import {fetchete} from './fetchete.js';
import {container,nav,nav2,t,search,url} from './script.js';
import {ShowTable} from './ShowTable.js';

export async function select(ss=true){//selector de tablas
  const res = await fetchete([`SHOW tables;`],url+'api/pass');
  const div = document.createElement('div');
  for(let i=0;i<res.length;i++){
  const button = document.createElement('button');button.textContent = `${Object.values(res[i])}`;
  button.addEventListener('click',() => {
    container.classList.remove('mostrar');container.classList.add('ocultar');nav2.classList.remove('mostrar');nav2.classList.add('ocultar');
    setTimeout(()=>{
      container.classList.remove('ocultar');nav2.classList.remove('ocultar');
      if(container.children.length>0)container.removeChild(container.firstChild);
      ShowTable(button.textContent,container,url);
      t.SelectedTable = button.textContent;//
      select2();search.value = '';
      container.classList.add('mostrar');nav2.classList.add('mostrar');
    },500);
  });
  div.appendChild(button);
  }
  nav.appendChild(div);
}

async function select2(){//selector de columnas
  const res = await fetchete([`SHOW COLUMNS FROM ${t.SelectedTable};`],url+'api/pass');
  if(nav2.children.length>0)nav2.removeChild(nav2.firstChild);
  const div = document.createElement('div');
  for(let i=0;i<res.length;i++){
  const button = document.createElement('button');button.textContent = `${res[i].Field}`;//🔎
  button.addEventListener('click',() => {
    t.FileSelectedTable = button.textContent;
    search.value = '';
  });
  div.appendChild(button);
  }
  nav2.appendChild(div);
}
export async function funsearch(a){
  if(t.FileSelectedTable){
    ul.classList.remove('mostrar');ul.classList.add('ocultar');const patron = /^[^']*$/;
    const res = await fetchete([`SELECT * FROM ${t.SelectedTable} WHERE ${t.FileSelectedTable} LIKE '${a}%';`],url+'api/pass');
    setTimeout(()=>{
      while(ul.children.length>0){ul.removeChild(ul.firstChild);}
      if(a != '' && patron.test(a)){Filas(ul,res,t.FileSelectedTable,false,t.SelectedTable,false);}
      ul.classList.remove('ocultar');ul.classList.add('mostrar');
    },500);
  }
}
