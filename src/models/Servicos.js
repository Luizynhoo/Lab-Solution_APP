const { model, Schema } = require("mongoose");

const ServicosSchema = new Schema({
  ServicoNome: {
    type: String,
    required: true,
  },
  ServicoCpf: {
    type: String,
    required: true,
  },
  ServicoEmail: {
    type: String,
    required: true,
  },
  ServicoTelefone: {
    type: String,
    required: true,
  },
  Tipo: {
    type: String,
    required: true,
  },
  DataEntrada: {
    type: Date,
    required: true,
  },
  DataSaida: {
    type: Date,
    required: true,
  },
  Responsavel: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
});

module.exports = model("Servicos", ServicosSchema);
