import {getBotReply} from './GetBotReply.js';
export function sendMessage() {
    const input = document.getElementById('chatInput');
    const body  = document.getElementById('chatBody');
    const text  = input.value.trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user'; userMsg.textContent = text;
    body.appendChild(userMsg); input.value = '';
    body.scrollTop = body.scrollHeight;

    const intervalo = setInterval(() => {
        setTimeout(() => {document.getElementById('...').textContent = ' Cargando ';},250);
        setTimeout(() => {document.getElementById('...').textContent = ' Cargando .';},500);
        setTimeout(() => {document.getElementById('...').textContent = ' Cargando ..';},750);
        setTimeout(() => {document.getElementById('...').textContent = ' Cargando ...';},1000);
    }, 1000);

    getBotReply(text).then((res) => {
    clearInterval(intervalo);
    setTimeout(() => {
        document.getElementById('...').textContent = '';
    },1000);
    const botMsg = document.createElement('div'); 
    botMsg.className = 'msg bot'; 
    botMsg.textContent = res; 
    body.appendChild(botMsg); 
    body.scrollTop = body.scrollHeight;
}).catch((error) => {
    console.error("Hubo un error en la petición:", error);
});

}