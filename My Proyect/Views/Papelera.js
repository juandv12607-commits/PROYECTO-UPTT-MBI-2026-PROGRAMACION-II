
/*
// Abrir modal
abrirBtn.onclick = function() {
  modal.style.display = "flex";
}
*/
/*
// Cerrar con la X
cerrarSpan.onclick = function() {
  modal.style.display = "none";
}
*/
/*
// Cerrar haciendo clic fuera del contenido
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
*/

/*
      const button = document.createElement('button');button.textContent = '...';button.style.position = 'absolute';button.style.bottom = 0;button.style.right = 0;
      button.addEventListener('click',async () => {
        const prom = prompt('Ingresa');
        p.textContent = prom;
        //const query = `UPDATE libros SET column = ${prom} WHERE ID = ${prom};`;
        //const response = await fetch(url+'api/post',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
        //const res = await response.json();
      });
      */

/*
const del = document.getElementById('delete');

del.addEventListener('click',async () => {
  i = 0;
  ii = [];
  console.log(tbody.children[0].children[1].children[0].textContent);
  while(i < tbody.children.length){
    //console.log(tbody.children[i].firstChild.checked,tbody.children[i].firstChild,tbody.children[i]);
    if(tbody.children[i].firstChild.firstChild.checked === true){
      //console.log(tbody.children[i].children[1].textContent);
      ii.push(tbody.children[i].children[1].children[0].textContent);//numero de id de la fila
      tbody.removeChild(tbody.children[i]);
    }else{i += 1;}
  }
  const ids = ii;
  const query = 'DELETE FROM BIBLIOTECA WHERE id IN (?);';
  const response = await fetch(url+'api/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,ids})});
  const res = await response.json();
});
*/


/*
const nr = document.getElementById('new-row');

nr.addEventListener('click',async () => {
  const query = 'INSERT INTO ventas (fecha,producto_1,producto_2,producto_3,producto_4,producto_5,producto_6,producto_7) VALUES (?,0,0,0,0,0,0,0);';
  const response = await fetch(url+'api/postnew',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
  const res = await response.json();
});
*/

/*
app.post('/api/postnew', (req, res) => {
  const {query} = req.body;
const hoy = new Date();
const dia = String(hoy.getDate()).padStart(2, '0');
const mes = String(hoy.getMonth() + 1).padStart(2, '0');
const año = hoy.getFullYear();
const fechaActual = `${dia}/${mes}/${año}`;
  db.query(query,[fechaActual],(err, results, fields) => {
  });
});
*/

//const check = document.createElement('input');check.type = 'checkbox';
    //const tralalero = document.createElement('td');tralalero.appendChild(check);
    //tr.appendChild(tralalero);//checkboxes para seleccionar filar a eliminar

//<span class="cerrar" style="display: none;">&times;</span>

/*
<!-- Botón que abre el modal -->
<button id="abrirModal" style="display: none;">Abrir modal</button>
<button id="delete" style="display: none;">delete</button> <button id="new-row" style="display: none;">new row</button>
*/

/*
const abrirBtn = document.getElementById("abrirModal");
const cerrarSpan = document.querySelector(".cerrar");
*/

/*
.cerrar {
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
.cerrar:hover {
  color: red;
}
*/