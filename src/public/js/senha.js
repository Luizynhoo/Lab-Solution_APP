const { ipcRenderer } = require('electron');

document.getElementById('resetPasswordForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        ipcRenderer.send('show-dialog', {
            type: 'error',
            buttons: ['OK'],
            title: 'Erro',
            message: 'As senhas não coincidem!'
        });
        return;
    }

    ipcRenderer.send('reset-password', { email, newPassword });
});

ipcRenderer.on('reset-password-response', (event, response) => {
    ipcRenderer.send('show-dialog', {
        type: response.success ? 'info' : 'error',
        buttons: ['OK'],
        title: 'Redefinir Senha',
        message: response.message
    });
});
