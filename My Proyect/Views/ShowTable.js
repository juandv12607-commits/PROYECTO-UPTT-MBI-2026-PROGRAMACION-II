export async function Filas(tbody,Rows,ColumnsName,whether,table){//t.Rows=[{},{}]
  if(whether){await fetchete([`INSERT INTO ${table} VALUES ();`],url+'api/pass');const res = await fetchete([`SELECT * FROM ${table};`],url+'api/pass');Rows = [res[res.length-1]];}

  for(let i in Rows){//valor de cada fila
    const tr = document.createElement('tr');
    const check = document.createElement('input');check.type = 'checkbox';
    const td = document.createElement('td');
    td.appendChild(check);
    if(localStorage.getItem('rol')==='Admin'){tr.appendChild(td);/*checkboxes para seleccionar filas a eliminar*/}
    tbody.appendChild(tr);let iii = 0;
    for(let ii in Rows[i]){//valor de cada celda
      const p = document.createElement('p');p.className = 'pnr';p.textContent = `${Rows[i][ii]}`;
      const button = document.createElement('button');button.classList.add('botonE');button.textContent='✏️';
      button.id = `${Rows[i].id}`;button.column = ColumnsName[iii];button.tipo = typeof(Rows[i][ii]);iii += 1;
      button.addEventListener('click',async()=>{actions(button,p,table);});
      const td = document.createElement('td');
      td.appendChild(p);
      if(localStorage.getItem('rol')==='Admin'){
        if(button.column != 'id' && button.column != 'estado' && button.column != 'rol' && button.column != 'fecha_devolucion_estimada'){td.appendChild(button);}
      }else if(table==='usuarios'){if(button.column != 'id' && button.column != 'estado' && button.column != 'rol'){td.appendChild(button);}}
      tr.appendChild(td);
    }
  }
}

export function Columnas(thead_tr,ColumnsName){for(let i = 0;i < ColumnsName.length;i++){/*nombre de columnas*/const th = document.createElement('th');const p = document.createElement('p');p.textContent = ' ' + ColumnsName[i] + ' ';p.className = 'pnr';th.appendChild(p);thead_tr.appendChild(th);}}

export async function ShowTable(table,container,url){
  let query;
  if(localStorage.getItem('rol')==='Admin'){
    query = `SELECT * FROM ${table};`;
  }else{
    if(table==='categorias' || table==='libros'){
      query = `SELECT * FROM ${table};`;
    }else if(table==='prestamos'){
      query = `SELECT * FROM ${table} WHERE usuario_id = ${localStorage.getItem('session')};`;
    }else if(table==='usuarios'){
      query = `SELECT * FROM ${table} WHERE id = ${localStorage.getItem('session')};`;
    }else{
      query = `SELECT * FROM ${table};`;//puedo quitar esto al eliminar la tabla categoria_libro de la base de datos
    }
  }
  const response = await fetch(url+'api/post',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
  const res = await response.json();
  let t=res;
  t.TableName = table;
  t.SelectedTable = table;
  t.FileSelectedTable = t.ColumnsName[1];//aqui debe ir una condicion en caso que el array sea muy corto
  const table_container = document.createElement('div');//contenedor principal de la tabla
  const table_name = document.createElement('div');table_name.textContent = 'TABLA: ';//nombre de la tabla
  const ttable = document.createElement('table');//tabla
  const thead = document.createElement('thead');//thead para los nombres de la tabla
  const thead_tr = document.createElement('tr');thead.id = 'thead';//nombre de las columnas de la tabla
  const tbody = document.createElement('tbody');tbody.id = 'tbody';//tbody para las celdas de la tabla
  //Orden de nodos
  table_container.appendChild(table_name);table_container.appendChild(ttable);ttable.appendChild(thead);thead.appendChild(thead_tr);ttable.appendChild(tbody);container.appendChild(table_container);
  if(localStorage.getItem('rol')==='Admin'){
    const nr = document.createElement('button');nr.id = 'new-row';nr.textContent = '➕ Nueva Fila ➕';nr.className = 'nr-del';
    nr.addEventListener('click',async () => {Filas(tbody,[t.Rows[t.Rows.length-1]],t.ColumnsName,true,table);});
    table_name.appendChild(nr);//boton de nueva fila
  }
const del = document.createElement('button');del.id = 'delete';del.textContent = '❌ Eliminar Fila ❌';del.style.display = 'none';del.className = 'nr-del';
del.addEventListener('click',async () => {
  i = 0;ii = [];
  while(i < tbody.children.length){if(tbody.children[i].firstChild.firstChild.checked === true){ii.push(tbody.children[i].children[1].children[0].textContent);/*numero de id de la fila*/tbody.removeChild(tbody.children[i]);if(tbody.children.length > 0){iii = Number(tbody.children[tbody.children.length-1].children[1].textContent);}else{iii = 1;}}else{i += 1;}}
  del.style.display = 'none';
  const res = await fetchete([`SET FOREIGN_KEY_CHECKS = 0;`,`DELETE FROM ${table} WHERE id IN (${ii});`,`ALTER TABLE ${table} AUTO_INCREMENT = ${iii};`,`SET FOREIGN_KEY_CHECKS = 1;`,`SELECT * FROM ${table};`],url+'api/pass');
  t.Rows = res;
});
const nombre_tabla = document.createElement('p');nombre_tabla.textContent = t.TableName;nombre_tabla.style.display = 'inline-block';nombre_tabla.style.flexWrap = 'wrap';
table_name.appendChild(nombre_tabla);//nombre de la tabla
table_name.appendChild(del);//boton de eliminar fila
const select_delete = document.createElement('th');select_delete.textContent = 'SELECCIONAR PARA ELIMINAR';select_delete.className = 'pnr';
if(localStorage.getItem('rol')==='Admin')thead_tr.appendChild(select_delete);//columna de seleccion de filas a eliminar
Columnas(thead_tr,t.ColumnsName);//Imprimir columnas
Filas(tbody,t.Rows,t.ColumnsName,false,table);//Imprimir filas
window.addEventListener('click',()=>{
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {/*Filtramos cuáles están actualmente seleccionados*/const seleccionados = document.querySelectorAll('input[type="checkbox"]:checked');/*Extraemos sus valores*/const valores = Array.from(seleccionados).map(cb => cb.value);/*Accionamos el boton de eliminar filas*/if(valores.length > 0){document.getElementById('delete').style.display = 'inline-block';}else{document.getElementById('delete').style.display = 'none';}});});
});
}
