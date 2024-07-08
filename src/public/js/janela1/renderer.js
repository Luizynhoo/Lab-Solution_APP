const { ipcRenderer, dialog } = require('electron')
const form = document.getElementById('trabalhando');

//enviar uma mensagem ao processo principal //
ipcRenderer.send('send-message', "Status do banco de dados:")


//Abrir novas janelas
function financeiro(){
  ipcRenderer.send("financeiro")
}

function Senha(){
  ipcRenderer.send("senha")
}

function createcadastroCliente(){
  ipcRenderer.send("createcadastroCliente")
}

function dash(){
  ipcRenderer.send("dash")
}

function servicos(){
  ipcRenderer.send("servicos")
}

function trabalhadores(){
  ipcRenderer.send("trabalhadores")
}

function verde(){
  ipcRenderer.send("verde")
}

function manutencao(){
  ipcRenderer.send("manutencao")
}

function software(){
  ipcRenderer.send("software")
}

function informatica(){
  ipcRenderer.send("informatica")
}

function PGclientes(){
  ipcRenderer.send("PGclientes")
}

function fechar() {
  window.close(); // Fecha a janela atual
}


//Recebendo dados
let formulario, nome, email, senha

formulario = document.querySelector("#frmTrabalhador")
nome = document.querySelector("#formNome")
email = document.querySelector("#formEmail")
senha = document.querySelector("#formSenha")

let arrayTrabalhador = [] 

let updateStatus = false 
let idTrabalhador 


//recebimento dos dados do formulário ao pressionar o botão salvar
formulario.addEventListener("submit", async (event) => {
    event.preventDefault() //(reiniciar o documento após envio do dados do formulário)
    console.log(nome.value, email.value, senha.value)
    
    //envio dos dados para o main
    const login = {
        nome: nome.value,
        email: email.value,
        senha: senha.value
    }

    //(Criando uma estrutura do tipo if else para reutilzação do formulário) e enviar para o main
    if (updateStatus === false) {
        ipcRenderer.send('new-task', login)
    } else {
        ipcRenderer.send('update-task', { ...login, idTrabalhador })
    }


    formulario.reset() //limpar o formulário após envio
})

//Corfirmar cadastro no banco de dados
ipcRenderer.on('new-task-created', (event, args) => {
    //atualizar  a lista automaticamente quando uma nova tarefa for adicionada ao banco
    const novoTrabalhador = JSON.parse(args)
    arrayTrabalhador.push(novoTrabalhador)
    renderizarTrabalhador(arrayTrabalhador)
})

// Tratar resposta de redefinição de senha
ipcRenderer.on('reset-password-response', (event, response) => {
  remote.dialog.showMessageBox({
      type: response.success ? 'info' : 'error',
      buttons: ['OK'],
      title: 'Redefinir Senha',
      message: response.message
  }).then(() => {
      if (response.success) {
          // Fechar a janela de redefinição de senha ou realizar outra ação
          const window = remote.getCurrentWindow();
          window.close();
      }
  });
});


//Mudar os alearts
document.getElementById('loginButton').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  ipcRenderer.send('login', { email, senha });
});

ipcRenderer.on('login-success', (event, message) => {
  ipcRenderer.send('show-dialog', {
      type: 'info',
      message: 'Login bem sucedido',
      detail: message,
      buttons: ['OK']
  });
  window.location.href = 'dashboard.html';
});

ipcRenderer.on('login-failed', (event, message) => {
  ipcRenderer.send('show-dialog', {
      type: 'error',
      message: 'Falha no login',
      detail: message,
      buttons: ['OK']
  });
});

ipcRenderer.on('login-error', (event, message) => {
  ipcRenderer.send('show-dialog', {
      type: 'error',
      message: 'Erro no login',
      detail: message,
      buttons: ['OK']
  });
});
