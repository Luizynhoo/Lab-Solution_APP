const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (email, senha) => ipcRenderer.send("login", { email, senha }),
  onLoginSuccess: (callback) => ipcRenderer.on("login-success", callback),
  onLoginFailed: (callback) => ipcRenderer.on("login-failed", callback),
});


window.addEventListener('DOMContentLoaded', () => {
  const dataAtual = document.getElementById('data').innerHTML = obterDataAtual()
})

function obterDataAtual() {
  const data = new Date ()
  const options = {
      weekday: 'long', 
      year: 'numeric',  
      month: 'long',  
      day: 'numeric'
  }
  return data.toLocaleDateString("pt-BR", options)
}

