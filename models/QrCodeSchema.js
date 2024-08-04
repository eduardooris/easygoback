const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Garante que cada código QR é único
  },
  invite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invite',
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  isScanned: {
    type: Boolean,
    default: false, // Indica se o código foi escaneado na festa
  },
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
