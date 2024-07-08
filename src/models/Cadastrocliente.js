const { model, Schema } = require("mongoose");

//vamos criar um obejto -> modelo para coleção
//Importante:
const CadastroclienteSchema = new Schema({
    nome: {
        type: String,
    },
    telefone:{
        type: String,
    },
    email: {
        type: String,
    },
    cpf: {
        type: String,
    },
});

//exportar o Schema -> main
module.exports = model("Cadastrocliente", CadastroclienteSchema);