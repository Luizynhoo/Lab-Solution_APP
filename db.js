const mongoose = require('mongoose');

let url = "mongodb+srv://LabTeste:123%40senac@cluster0.siocadm.mongodb.net/login";

const conectar = async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB conectado");
    } catch (error) {
        console.log("Problema detectado: ", error.message);
        throw error;
    }
}

const desconectar = async () => {
    try {
        await mongoose.disconnect();
        console.log("Desconectado do MongoDB.");
    } catch (error) {
        console.log("Problema detectado ao desconectar do banco: ", error.message);
        throw error;
    }
}

module.exports = { conectar, desconectar };
