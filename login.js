document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const VALID_USERNAME = 'user@';
    const VALID_PASSWORD = 'password';

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        if (enteredUsername === VALID_USERNAME && enteredPassword === VALID_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            // CHANGE THIS LINE: Redirect to 'to do list.html'
            window.location.href = 'to-do-list.html';
        } else {
            loginError.style.display = 'block';
            passwordInput.value = '';
            usernameInput.focus();
        }
    });

    // CHANGE THIS LINE: Redirect to 'to do list.html' if already logged in
    // if (localStorage.getItem('isLoggedIn') === 'true') {
    //     window.location.href = 'to do list.html';
    // }
});