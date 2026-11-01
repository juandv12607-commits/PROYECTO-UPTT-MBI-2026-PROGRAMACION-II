import {url} from './Script.js';

export function getBotReply(text) {

    const prompt = text.toLowerCase();
    
    // Al usar 'return fetch', la función automáticamente devuelve una Promesa
    return fetch(url + 'api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // ← ¡envía y recibe cookies!
        body: JSON.stringify({ prompt })
    })
    .then(response => {
        // Validamos si la respuesta del servidor es correcta (status 200-299)
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }
        return response.json(); // Convierte la respuesta a JSON y la pasa al siguiente .then
    })
    .then(res => {
        // Retornamos el campo específico. Este valor será el que reciba el 'await' de afuera
        return res.respuesta; 
    })
    .catch(error => {
        // Si hay un error de red o de JSON, lo propagamos para que lo atrape tu try...catch principal
        console.error("Error dentro de getBotReply:", error);
        throw error; 
    });
    
    /*
    if (t.includes('libro')) return '📚 Puedes buscar libros en la barra superior.';
    if (t.includes('usuario')) return '👥 En "Gestión de Usuarios" puedes administrar cuentas.';
    if (t.includes('hola')) return '¡Hola! 😊 ¿En qué te ayudo?';
    return 'Entiendo 🤔. ¿Necesitas algo más?';
    */
}