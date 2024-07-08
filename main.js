const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const path = require("node:path");
const fs = require("fs");
const { conectar, desconectar } = require("./db.js");
const { error } = require("node:console");
const Login = require(`${__dirname}/src/models/Login`);
const Valor = require(`${__dirname}/src/models/Valor`);
const Cadastrocliente = require(`${__dirname}/src/models/Cadastrocliente`);
const Doacao = require(`${__dirname}/src/models/Doacao`);
const Servicos = require(`${__dirname}/src/models/Servicos`);
//pdf
const { jsPDF } = require("jspdf");

// Páginas
let Cadastro;
let Dashboard;
let financeiro;
let cadastroCliente;
let servicos;
let Trabalhadores;
let verde;
let Manutencao;
let Software;
let Informatica;
let Clientes;
let Senha;

// Função para criar a janela de cadastro/login
const createWindow = () => {
  Cadastro = new BrowserWindow({
    width: 800,
    height: 1000,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Cadastro.loadFile(`${__dirname}/src/views/index.html`);
};

// Função para criar a janela do dashboard
const createDashboard = () => {
  Dashboard = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Dashboard.loadFile(`${__dirname}/src/views/dashboard.html`);
  Dashboard.setFullScreen(true);
};

// Função para criar a janela lucro
const createFinanceiro = async () => {
  financeiro = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/dinheiro.png`,
  });
  await loadCurrentValue(); // Carrega o valor atual antes de abrir a janela
  financeiro.loadFile(`${__dirname}/src/views/financeiro.html`);
  financeiro.on("ready-to-show", () => {
    financeiro.webContents.send("update-display", currentValue); // Envia o valor atual para a janela
  });
};

// Função para criar a janela de cadastro clientes
const createcadastroCliente = () => {
  cadastroCliente = new BrowserWindow({
    width: 800,
    height: 1000,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  cadastroCliente.setFullScreen(true);
  cadastroCliente.loadFile(`${__dirname}/src/views/cadastroCliente.html`);
};

const createServicos = () => {
  servicos = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  servicos.loadFile(`${__dirname}/src/views/servicos.html`);
  servicos.setFullScreen(true);
};

const createTrabalhadores = () => {
  Trabalhadores = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Trabalhadores.loadFile(`${__dirname}/src/views/Trabalhadores.html`);
  Trabalhadores.setFullScreen(true);
};

const createVerde = () => {
  verde = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  verde.loadFile(`${__dirname}/src/views/Verde.html`);
  verde.setFullScreen(true);
};

const createSoftware = () => {
  Software = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Software.loadFile(`${__dirname}/src/views/Software.html`);
  Software.setFullScreen(true);
};

const createManutencao = () => {
  Manutencao = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Manutencao.loadFile(`${__dirname}/src/views/Manutencao.html`);
  Manutencao.setFullScreen(true);
};

const createClientes = () => {
  Clientes = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Clientes.loadFile(`${__dirname}/src/views/Clientes.html`);
  Clientes.setFullScreen(true);
};

const createInformatica = () => {
  Informatica = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Informatica.loadFile(`${__dirname}/src/views/Informatica.html`);
  Informatica.setFullScreen(true);
};

const createSenha = () => {
  Senha = new BrowserWindow({
    width: 600,
    height: 400,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Senha.loadFile(`${__dirname}/src/views/Senha.html`);
};

const createEditar = () => {
  Editar = new BrowserWindow({
    width: 1200,
    height: 1200,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/src/public/img/five_icon2.png`,
  });
  Editar.loadFile(`${__dirname}/src/views/Editar.html`);
};

ipcMain.on("dash", () => {
  createDashboard();
});

ipcMain.on("senha", () => {
  createSenha();
});

ipcMain.on("financeiro", () => {
  createFinanceiro();
});

ipcMain.on("createcadastroCliente", () => {
  createcadastroCliente();
});

ipcMain.on("servicos", () => {
  createServicos();
});

ipcMain.on("trabalhadores", () => {
  createTrabalhadores();
});

ipcMain.on("verde", () => {
  createVerde();
});

ipcMain.on("manutencao", () => {
  createManutencao();
});

ipcMain.on("software", () => {
  createSoftware();
});

ipcMain.on("informatica", () => {
  createInformatica();
});

ipcMain.on("PGclientes", () => {
  createClientes();
});

ipcMain.on("Editar", () =>{
  createEditar();
})

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Encerrar a conexão com o banco de dados antes do aplicativo ser fechado
app.on("before-quit", async () => {
  await saveCurrentValue();
  await desconectar();
});

// Correção de bug reload ícone status
ipcMain.on("send-message", (event, message) => {
  console.log("<<<", message);
  statusConexao();
});

// Status de conexão
const statusConexao = async () => {
  try {
    await conectar();
    Cadastro.webContents.send("db-status", "Banco de dados conectado");
  } catch (error) {
    Cadastro.webContents.send("db-status", `Erro de conexão: ${error.message}`);
  }
};

// CRUD Create
ipcMain.on("new-task", async (event, args) => {
  console.log(args); 
  if (args.nome === "") {
    dialog.showMessageBox(Cadastro, {
      type: "info",
      message: "Preencha o nome",
      buttons: ["OK"],
    });
  } else {
    // Salvar no banco de dados os dados do formulário
    const novoTrabalhador = new Login(args);
    await novoTrabalhador.save();
    event.reply("new-task-created", JSON.stringify(novoTrabalhador));
  }
});

// Adicionar o sistema de login
ipcMain.on("login", async (event, { email, senha }) => {
  try {
    await conectar();
    const user = await Login.findOne({ email, senha });
    if (user) {
      event.reply("login-success", "Seja bem-vindo(a)");
      createDashboard();
      Cadastro.close();
    } else {
      event.reply("login-failed", "Email ou senha incorretos");
    }
  } catch (error) {
    event.reply("login-error", `Error: ${error.message}`);
  }
});

// Lidar com a redefinição de senha
ipcMain.on("reset-password", async (event, { email, newPassword }) => {
  try {
    const user = await Login.findOne({ email });
    if (!user) {
      event.reply("reset-password-response", {
        success: false,
        message: "Usuário não encontrado!",
      });
      return;
    }

    user.senha = newPassword; 
    await user.save();

    event.reply("reset-password-response", {
      success: true,
      message: "Senha redefinida com sucesso!",
    });
  } catch (error) {
    event.reply("reset-password-response", {
      success: false,
      message: "Erro ao redefinir a senha.",
    });
  }
});

// Manipulador para exibir dialog
ipcMain.on("show-dialog", (event, options) => {
  dialog.showMessageBox(options);
});

// Atualização financeira
ipcMain.on("update-text", async (event, { action, value }) => {
  const numericValue = parseFloat(value);
  if (!isNaN(numericValue)) {
    if (action === "update") {
      currentValue = numericValue;
    } else if (action === "add") {
      currentValue += numericValue;
    }
    financeiro.webContents.send("update-display", currentValue);
    await saveCurrentValue(); // Salva o valor no banco de dados
  }
});

let currentValue = 0; 

async function loadCurrentValue() {
  await conectar();
  const doc = await Valor.findById("currentValue");
  if (doc) {
    currentValue = doc.value;
  } else {
    const newValue = new Valor({ _id: "currentValue", value: 0 });
    await newValue.save();
  }
}

// Função para salvar o valor atual no banco de dados
async function saveCurrentValue() {
  await conectar();
  await Valor.findByIdAndUpdate(
    "currentValue",
    { value: currentValue },
    { upsert: true }
  );
}

// Cadastros clientes
// CRUD Create
ipcMain.on("new-cliente", async (event, args) => {
  console.log(args); // Teste de recebimento

  if (args.nome === "") {
    dialog.showMessageBox(cadastroCliente, {
      type: "info",
      message: "Preencha o nome",
      buttons: ["OK"],
    });
  } else {
    // Salvar no banco de dados os dados do formulário
    const novoCliente = new Cadastrocliente(args);
    await novoCliente.save();
    event.reply("new-cliente-created", JSON.stringify(novoCliente));
  }
});

// Buscar cliente no banco de dados
ipcMain.on("search-cliente", async (event, nome) => {
  try {
    await conectar(); 
    const dadosCliente = await Cadastrocliente.findOne({
      nome: new RegExp(nome, "i"),
    });
    if (!dadosCliente) {
      dialog
        .showMessageBox(cadastroCliente, {
          type: "question",
          message: "Cliente não cadastrado.\nDeseja cadastrar este cliente?",
          buttons: ["Sim", "Não"],
        })
        .then((result) => {
          if (result.response === 0) {
            event.reply("set-name", nome);
          } else {
            event.reply("clear-search");
          }
        });
    } else {
      event.reply("cliente-data", JSON.stringify(dadosCliente));
    }
  } catch (error) {
    console.error(error);
    event.reply(
      "search-cliente-error",
      `Erro ao buscar cliente: ${error.message}`
    );
  }
});

//Editar Clientes
ipcMain.on('search-servico', async (event, ServicoNome) => {
  try {
    const servico = await Servicos.findOne({ ServicoNome });
    event.sender.send('servico-data', JSON.stringify(servico));
  } catch (err) {
    console.error('Erro ao pesquisar serviço:', err);
    event.sender.send('servico-data', null);
  }
});


ipcMain.on('update-servico', async (event, servicoAtualizado) => {
  try {
    const servico = await Servicos.findOne({ ServicoNome: servicoAtualizado.ServicoNome });
    if (!servico) {
      event.reply("update-servico-response", {
        success: false,
        message: "Serviço não encontrado!",
      });
      return;
    }

    // Atualize os campos com os novos valores
    servico.ServicoTelefone = servicoAtualizado.ServicoTelefone;
    servico.ServicoEmail = servicoAtualizado.ServicoEmail;
    servico.ServicoCpf = servicoAtualizado.ServicoCpf;
    servico.Tipo = servicoAtualizado.Tipo;
    servico.DataEntrada = new Date(servicoAtualizado.DataEntrada);
    servico.DataSaida = new Date(servicoAtualizado.DataSaida);
    servico.Responsavel = servicoAtualizado.Responsavel;
    servico.descricao = servicoAtualizado.descricao;

    await servico.save();

    event.reply("update-servico-response", {
      success: true,
      message: "Informações do serviço atualizadas com sucesso!",
    });
  } catch (error) {
    event.reply("update-servico-response", {
      success: false,
      message: "Erro ao atualizar as informações do serviço.",
    });
  }
});

ipcMain.on('show-dialog', (event, options) => {
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options);
});

//deletar
ipcMain.on('delete-servico', async (event, ServicoNome) => {
  try {
    const servico = await Servicos.findOneAndDelete({ ServicoNome });
    if (!servico) {
      event.reply("delete-servico-response", {
        success: false,
        message: "Serviço não encontrado!",
      });
      return;
    }

    event.reply("delete-servico-response", {
      success: true,
      message: "Serviço excluído com sucesso!",
    });

    // Envie uma mensagem para recarregar outra página
    event.reply('reload-page', 'Clientes.html');
  } catch (error) {
    event.reply("delete-servico-response", {
      success: false,
      message: "Erro ao excluir o serviço.",
    });
  }
});

// Salvar nova doação
// Verificar se a pasta "Doações" existe, caso contrário, criar
const doacoesDir = path.join(__dirname, "Doações");
if (!fs.existsSync(doacoesDir)) {
  fs.mkdirSync(doacoesDir);
}

// Salvar nova doação
ipcMain.on("new-doacao", async (event, args) => {
  console.log(args); // Log para depuração

  if (
    args.clienteNome === "" ||
    args.clienteCpf === "" ||
    args.doacao === "" ||
    args.descricao === ""
  ) {
    dialog.showMessageBox(cadastroCliente, {
      type: "info",
      message: "Preencha todos os campos obrigatórios",
      buttons: ["OK"],
    });
  } else {
    let imagePath = null;

    // Se houver uma imagem, salvar na pasta "Doações"
    if (args.imagePath) {
      const imageExt = path.extname(args.imagePath);
      const imageName = `${args.clienteNome.replace(
        / /g,
        "_"
      )}_${Date.now()}${imageExt}`;
      imagePath = path.join(doacoesDir, imageName);

      try {
        fs.copyFileSync(args.imagePath, imagePath);
      } catch (error) {
        console.error("Erro ao salvar a imagem:", error);
      }
    }

    // Salvar no banco de dados os dados do formulário
    const novaDoacao = new Doacao({
      clienteNome: args.clienteNome,
      clienteCpf: args.clienteCpf,
      doacao: args.doacao,
      descricao: args.descricao,
      imagePath: imagePath ? imagePath : null,
    });

    await novaDoacao.save();
    event.reply("new-doacao-created", JSON.stringify(novaDoacao));
  }
});

//------------------------Servico---------------------//
const servicoDir = path.join(__dirname, "Serviços");
if (!fs.existsSync(servicoDir)) {
  fs.mkdirSync(servicoDir);
}

ipcMain.on("new-servico", async (event, args) => {
  console.log(args);

  if (
    args.ServicoNome === "" ||
    args.ServicoCpf === "" ||
    args.ServicoEmail === "" ||
    args.ServicoTelefone === "" ||
    args.Responsavel === ""
  ) {
    dialog.showMessageBox(cadastroCliente, {
      type: "info",
      message: "Preencha todos os campos obrigatórios",
      buttons: ["OK"],
    });
  } else {
    let imagePath = null;

    if (args.imagePath) {
      const imageExt = path.extname(args.imagePath);
      const imageName = `${args.ServicoNome.replace(
        / /g,
        "_"
      )}_${Date.now()}${imageExt}`;
      imagePath = path.join(servicoDir, imageName);

      try {
        fs.copyFileSync(args.imagePath, imagePath);
      } catch (error) {
        console.error("Erro ao salvar a imagem:", error);
      }
    }

    // Salvar no banco de dados os dados do formulário
    const novoServicos = new Servicos({
      ServicoNome: args.ServicoNome,
      ServicoCpf: args.ServicoCpf,
      ServicoEmail: args.ServicoEmail,
      ServicoTelefone: args.ServicoTelefone,
      Tipo: args.Tipo,
      DataEntrada: args.DataEntrada,
      DataSaida: args.DataSaida,
      Responsavel: args.Responsavel,
      descricao: args.descricao,
    });

    await novoServicos.save();
    event.reply("new-servico-created", JSON.stringify(novoServicos));
  }
});

//Tabela
ipcMain.handle("fetch-servicos", async () => {
  try {
    const servicos = await Servicos.find();
    return servicos;
  } catch (error) {
    console.error("Erro ao buscar os serviços:", error);
    throw error;
  }
});


//Nota fiscal
ipcMain.on("pdf-gerado", (event, servico) => {
  const doc = new jsPDF();

  // Adicionando título
  doc.setFontSize(18);
  doc.text("Nota Fiscal", 105, 20, { align: "center" });

  // Adicionando informações da empresa
  doc.setFontSize(12);
  doc.text(`Empresa: Lab Solution`, 10, 30);
  doc.text(`CNPJ: 00.000.000/0000-00`, 10, 40);
  doc.text(`Endereço: R. Cel. Luís Americano, 130, São Paulo, SP`, 10, 50);
  doc.text(`Telefone: (00) 0000-0000`, 10, 60);
  doc.text(`E-mail: labsolutionproj@gmail.com`, 10, 70);

  // Adicionando informações do cliente
  doc.text(`Cliente: ${servico.ServicoNome}`, 10, 90);
  doc.text(`CPF: ${servico.ServicoCpf}`, 10, 100);
  doc.text(`Telefone: ${servico.ServicoTelefone}`, 10, 110);
  doc.text(`E-mail: ${servico.ServicoEmail}`, 10, 120);

  // Adicionando informações do serviço
  doc.text(`Tipo de serviço: ${servico.Tipo}`, 10, 140);
  doc.text(`Responsável pelo serviço: ${servico.Responsavel}`, 10, 150);
  doc.text(`Descrição: ${servico.descricao}`, 10, 160);

  // Adicionando informações adicionais
  doc.text(`Data de Emissão: ${new Date(servico.DataEntrada).toLocaleDateString()}`, 10, 180);
  doc.text(`Data de Saída: ${new Date(servico.DataSaida).toLocaleDateString()}`, 10, 190);

  doc.text(`Preço a decidir`, 10, 210); // Você pode alterar essa linha conforme a sua necessidade

  // Salvando o PDF
  doc.save("nota_fiscal.pdf");

  dialog.showMessageBox({
    type: "info",
    buttons: ["OK"],
    title: "PDF Gerado",
    message: "Nota Fiscal emitida com sucesso!",
  });
});

