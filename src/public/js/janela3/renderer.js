const { ipcRenderer } = require("electron");
const { jsPDF } = require('jspdf');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const servicos = await ipcRenderer.invoke("fetch-servicos");
    renderizarCadastros(servicos);
  } catch (error) {
    console.error("Erro ao buscar os serviços:", error);
  }

  document.getElementById("btnSalvando").addEventListener("click", (event) => {
    event.preventDefault();

    const ServicoNome = document.getElementById("formNome").value;
    const ServicoCpf = document.getElementById("formCpf").value;
    const ServicoEmail = document.getElementById("formEmail").value;
    const ServicoTelefone = document.getElementById("formTelefone").value;
    const Tipo = document.getElementById("formTipo").value;
    const DataEntrada = document.getElementById("formEntrada").value;
    const DataSaida = document.getElementById("formSaida").value;
    const Responsavel = document.getElementById("formResponsavel").value;
    const descricao = document.getElementById("formDescricao").value;

    const formServico = {
      ServicoNome,
      ServicoCpf,
      ServicoEmail,
      ServicoTelefone,
      Tipo,
      DataEntrada,
      DataSaida,
      Responsavel,
      descricao,
    };

    ipcRenderer.send("new-servico", formServico);
  });

  ipcRenderer.on("new-servico-created", (event, response) => {
    const servico = JSON.parse(response);
    alert(`Serviço de ${servico.ServicoNome} agendado com sucesso!`);
    // Re-fetch the services after creating a new one
    ipcRenderer.invoke("fetch-servicos").then((servicos) => {
      renderizarCadastros(servicos);
    });
  });
});

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

function manutencao() {
  ipcRenderer.send("manutencao");
}

function software() {
  ipcRenderer.send("software");
}

function informatica() {
  ipcRenderer.send("informatica");
}

function cliente() {
  ipcRenderer.send("PGclientes");
}

function Editar() {
  ipcRenderer.send("Editar");
}

function fechar() {
  window.close();
}

function fechar() {
  window.close(); // Fecha a janela atual
}

//------------------------------------Servicos-----------------------------------------//
let arrayClientes = [];

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

function pesquisarClient() {
  let ServicoNome = document.getElementById("inputSearc").value;
  if (ServicoNome === "") {
    ipcRenderer.send("search-alert");
  } else {
    ipcRenderer.send("search-servico", ServicoNome);
  }
}


function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

ipcRenderer.on("servico-data", (event, dadosServico) => {
  const servico = JSON.parse(dadosServico);
  if (servico) {
    
    document.getElementById("formNome").value = servico.ServicoNome;
    document.getElementById("formTelefone").value = servico.ServicoTelefone;
    document.getElementById("formEmail").value = servico.ServicoEmail;
    document.getElementById("formCpf").value = servico.ServicoCpf;
    document.getElementById("formTipo").value = servico.Tipo;
    document.getElementById("formEntrada").value = formatDate(servico.DataEntrada);
    document.getElementById("formSaida").value = formatDate(servico.DataSaida);
    document.getElementById("formResponsavel").value = servico.Responsavel;
    document.getElementById("formDescricao").value = servico.descricao;
    document.getElementById("inputSearch").value = "";
  } else {
    alert("O Cliente não existe");
  }
});

//editar
function atualizarCliente() {
  const servico = {
    ServicoNome: document.getElementById("formNome").value,
    ServicoTelefone: document.getElementById("formTelefone").value,
    ServicoEmail: document.getElementById("formEmail").value,
    ServicoCpf: document.getElementById("formCpf").value,
    Tipo: document.getElementById("formTipo").value,
    DataEntrada: document.getElementById("formEntrada").value,
    DataSaida: document.getElementById("formSaida").value,
    Responsavel: document.getElementById("formResponsavel").value,
    descricao: document.getElementById("formDescricao").value
  };
  ipcRenderer.send("update-servico", servico);
}

// Manipulador de resposta para atualização do cliente
ipcRenderer.on("update-servico-response", (event, response) => {
  ipcRenderer.send("show-dialog", {
    type: response.success ? "info" : "error",
    message: response.success ? "Informações do cliente atualizadas com sucesso!" : "Erro ao atualizar as informações do cliente: " + response.message,
    buttons: ["OK"]
  });
});


ipcRenderer.on("clear-search", () => {
  document.getElementById("inputSearch").value = "";
});

function renderizarCadastros(servicos) {
  console.log("Servicos recebidos:", servicos); 
  let lista = document.querySelector("#tabelaClientes");
  lista.innerHTML = '';

  servicos.forEach((t) => {
    const servico = t._doc; 
    lista.innerHTML += `
      <tr>    
        <td>${servico.ServicoNome}</td>
        <td>${servico.ServicoCpf}</td>
        <td>${servico.ServicoEmail}</td>
        <td>${servico.ServicoTelefone}</td>
        <td>${servico.Tipo}</td>
        <td>${new Date(servico.DataEntrada).toLocaleDateString()}</td>
        <td>${new Date(servico.DataSaida).toLocaleDateString()}</td>
        <td>${servico.Responsavel}</td>
        <td>${servico.descricao}</td>
        <td>
          <button class="edit-button" onclick="Editar()">Editar</button>
      </tr>
    `;
  });
}


//Excluir 
// Função para excluir o cliente
function excluirCliente() {
  const ServicoNome = document.getElementById("formNome").value;
  if (ServicoNome === "") {
    ipcRenderer.send("show-dialog", {
      type: "warning",
      message: "Por favor, pesquise e selecione um cliente para excluir.",
      buttons: ["OK"]
    });
  } else {
    ipcRenderer.send("delete-servico", ServicoNome);
  }
}

// Manipulador de resposta para exclusão do cliente
ipcRenderer.on("delete-servico-response", (event, response) => {
  ipcRenderer.send("show-dialog", {
    type: response.success ? "info" : "error",
    message: response.success ? "Cliente excluído com sucesso!" : "Erro ao excluir o cliente: " + response.message,
    buttons: ["OK"]
  });
  if (response.success) {
    document.getElementById("formNome").value = "";
    document.getElementById("formTelefone").value = "";
    document.getElementById("formEmail").value = "";
    document.getElementById("formCpf").value = "";
    document.getElementById("formTipo").value = "";
    document.getElementById("formEntrada").value = "";
    document.getElementById("formSaida").value = "";
    document.getElementById("formResponsavel").value = "";
    document.getElementById("formDescricao").value = "";
    ipcRenderer.send("refresh-page");
  }
});


//pdf
document.getElementById('notaFiscal').addEventListener('click', () => {
  const servico = {
    ServicoNome: document.getElementById('formNome').value,
    ServicoCpf: document.getElementById('formCpf').value,
    ServicoEmail: document.getElementById('formEmail').value,
    ServicoTelefone: document.getElementById('formTelefone').value,
    Tipo: document.getElementById('formTipo').value,
    DataEntrada: document.getElementById('formEntrada').value,
    DataSaida: document.getElementById('formSaida').value,
    Responsavel: document.getElementById('formResponsavel').value,
    descricao: document.getElementById('formDescricao').value,
  };
  ipcRenderer.send('pdf-gerado', servico)
});

