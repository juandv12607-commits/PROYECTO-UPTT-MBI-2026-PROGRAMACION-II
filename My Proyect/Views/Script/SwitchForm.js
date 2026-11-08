export function switchForm(type) {
    const login = document.getElementById('loginForm');
    const register = document.getElementById('registerForm');
    if (type === 'login') { login.style.display='block'; register.style.display='none'; }
    else { login.style.display='none'; register.style.display='block'; }
}