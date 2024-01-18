const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true }, // Contenido del mensaje (se requiere)
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al remitente del mensaje
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al destinatario del mensaje
    timestamp: { type: Date, default: Date.now }, // Fecha y hora del mensaje
    // Otros campos que puedas necesitar
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
