export async function fetchete(query,url){
  const response = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
  const res = await response.json();return res;
}
