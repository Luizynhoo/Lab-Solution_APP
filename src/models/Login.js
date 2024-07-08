const { model, Schema } = require("mongoose");

//vamos criar um obejto -> modelo para coleção
//Importante:
const loginSchema = new Schema({
    nome: {
        type: String,
    },
    email: {
        type: String,
    },
    senha: {
        type: String,
    },
});

//exportar o Schema -> main
module.exports = model("Login", loginSchema);
