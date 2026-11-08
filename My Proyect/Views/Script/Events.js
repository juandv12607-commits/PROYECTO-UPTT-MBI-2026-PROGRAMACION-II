import {switchForm} from './SwitchForm.js';
import {toggleChat} from './ToggleChat.js';
import {openModal} from './OpenModal.js';
import {closeModal} from './CloseModal.js';
import {toggleSidebar} from './ToggleSideBar.js';
import {sendMessage} from './SendMessage.js';

const btn_login = document.getElementById('btn_login');
btn_login.addEventListener('click',() => {
    openModal('login');
});

const btn_register = document.getElementById('btn_register');
btn_register.addEventListener('click',() => {
    openModal('register');
});

const modalOverlay = document.getElementById('modalOverlay');
modalOverlay.addEventListener('click',(event) => {
    if(event.target===this) closeModal();
});

const modalClose = document.getElementById('modal-close');
modalClose.addEventListener('click',() => {
    closeModal();
})

const modalSwitchL = document.getElementById('modal-switch-l');
modalSwitchL.addEventListener('click',() => {
    switchForm('register');
})

const modalSwitchR = document.getElementById('modal-switch-r');
modalSwitchR.addEventListener('click',() => {
    switchForm('login');
})

const chat_toggle = document.getElementById('chat-toggle');
chat_toggle.addEventListener('click',() => {
    toggleChat();
});

const chat_close = document.getElementById('chat-close');
chat_close.addEventListener('click',() => {
    toggleChat();
});

const send_Message = document.getElementById('sendMessage');
send_Message.addEventListener('click',() => {
    sendMessage();
});

const menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('click',()=>{
    toggleSidebar();
});