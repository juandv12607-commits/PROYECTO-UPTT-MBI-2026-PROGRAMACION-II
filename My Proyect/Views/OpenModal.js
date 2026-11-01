import {switchForm} from './SwitchForm.js';
export function openModal(type) {
    document.getElementById('modalOverlay').classList.add('open');
    switchForm(type);
}