const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
  },
  guestSurname: {
    type: String,
    required: true,
  },
  guestPhoto: {
    type: String, // URL ou base64 da imagem
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  qrCode: {
    type: String, // Armazena o código QR em base64 ou URL para a imagem gerada
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
});

module.exports = mongoose.model('Invite', inviteSchema);
