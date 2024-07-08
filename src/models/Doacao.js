const mongoose = require("mongoose");

const DoacaoSchema = new mongoose.Schema({
    clienteNome: { 
        type: String, 
        required: true 
    },
    clienteCpf: { 
        type: String, 
        required: true 
    },
    doacao: { 
        type: String, 
        required: true 
    },
    descricao: { 
        type: String, 
        required: true 
    },
    imagePath: { 
        type: String 
    },
});

const Doacao = mongoose.model("Doacao", DoacaoSchema);
module.exports = Doacao;
