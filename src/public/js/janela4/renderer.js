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
  window.close(); 
}


//------------------------------------DOAÇÃO-----------------------------------------//
//Pesquisar cliente
function pesquisarCliente() {
    let nome = document.getElementById("inputSearch").value;
    if (nome === "") {
      ipcRenderer.send("search-alert");
    } else {
      ipcRenderer.send("search-cliente", nome);
    }
  }
  
  ipcRenderer.on("search-focus", () => {
    document.getElementById("inputSearch").focus();
  });
  
  ipcRenderer.on("cliente-data", (event, dadosCliente) => {
    const cliente = JSON.parse(dadosCliente);
    if (cliente) {
      document.getElementById("formNome").value = cliente.nome;
      document.getElementById("formCpf").value = cliente.cpf;
      document.getElementById("formTelefone").value = cliente.telefone;
      document.getElementById("formEmail").value = cliente.email;
      document.getElementById("inputSearch").value = "";
    } else {
      alert("Cliente não encontrado");
    }
  });
  
  ipcRenderer.on("clear-search", () => {
    console.log("daawf")
    document.getElementById("inputSearch").value = "";
  });

  document.getElementById('btnSalvar').addEventListener('click', (event) => { 
    event.preventDefault();
  
    const clienteNome = document.getElementById('formNome').value;
    const clienteCpf = document.getElementById('formCpf').value;
    const doacao = document.getElementById('doacao').value;
    const descricao = document.getElementById('descricao').value;
    const imageFile = document.getElementById('image').files[0];
  
    const formData = {
      clienteNome,
      clienteCpf,
      doacao,
      descricao,
      imagePath: imageFile ? imageFile.path : null
    };
  
    ipcRenderer.send('new-doacao', formData);
  });
  
  ipcRenderer.on('new-doacao-created', (event, response) => {
    const doacao = JSON.parse(response);
    alert(`Doação de ${doacao.clienteNome} salva com sucesso!`);
  });
  
