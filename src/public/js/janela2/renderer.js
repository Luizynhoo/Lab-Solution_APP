const { ipcRenderer } = require("electron");

//Abrir novas janelas
function financeiro() {
  ipcRenderer.send("financeiro");
}

function createcadastroCliente() {
  ipcRenderer.send("createcadastroCliente");
}

function dash() {
  ipcRenderer.send("dash");
}

function servicos() {
  ipcRenderer.send("servicos");
}

function trabalhadores() {
  ipcRenderer.send("trabalhadores");
}

function verde() {
  ipcRenderer.send("verde");
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
let formulario, nome, telefone, cpf, email, lista;

formulario = document.querySelector("#frmCadastro");
nome = document.querySelector("#formNome");
telefone = document.querySelector("#formTelefone");
email = document.querySelector("#formEmail");
cpf = document.querySelector("#formCpf");


let arrayCliente = [];

let updateStatus = false;
let idCliente;

//recebimento dos dados do formulário ao pressionar o botão salvar
formulario.addEventListener("submit", async (event) => {
  event.preventDefault(); //(reiniciar o documento após envio do dados do formulário)
  console.log(nome.value, telefone.value, email.value, cpf.value);
  //envio dos dados para o main
  const cadastro = {
    nome: nome.value,
    telefone: telefone.value,
    email: email.value,
    cpf: cpf.value,
  };

  //(Criando uma estrutura do tipo if else para reutilzação do formulário) e enviar para o main
  if (updateStatus === false) {
    ipcRenderer.send("new-cliente", cadastro);
  } else {
    ipcRenderer.send("update-cliente", { ...cadastro, idCliente });
  }

  formulario.reset(); //limpar o formulário após envio
});

//Corfirmar cadastro no banco de dados
ipcRenderer.on("new-cliente-created", (event, args) => {
  //atualizar  a lista automaticamente quando uma nova tarefa for adicionada ao banco
  const novoCliente = JSON.parse(args);
  arrayCliente.push(novoCliente);
  renderizarCliente(arrayCliente);
});
