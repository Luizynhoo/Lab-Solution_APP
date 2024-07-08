const mongoose = require('mongoose');

const valorSchema = new mongoose.Schema({
    _id: { type: String, default: 'currentValue' },
    value: { type: Number, required: true }
});

module.exports = mongoose.model('Valor', valorSchema);