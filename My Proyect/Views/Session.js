//solo cambia el estado del usuario
export async function session(i,ii){//ii es true para guardar el rol del usuario y false para borrarlo
  if(ii){
    await fetchete([`UPDATE usuarios SET estado = 'Sesión Activada' WHERE id = ${i.id};`],url+'api/pass');localStorage.setItem('session',i.id);localStorage.setItem('rol',i.rol);
  }else{
    await fetchete([`UPDATE usuarios SET estado = 'Sesión Desactivada' WHERE id = ${localStorage.getItem('session')};`],url+'api/pass');localStorage.removeItem('session');localStorage.removeItem('rol');
  }
}