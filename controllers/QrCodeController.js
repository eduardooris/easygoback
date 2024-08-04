// controllers/qrCodeController.js
const QRCode = require("../models/QrCodeSchema");
const Invite = require("../models/InviteSchema");

exports.getQrCodes = async (req, res) => {
  const { id } = req.params;
  try {
    const qrCodes = await QRCode.findOne({ _id: id });
    if (!qrCodes) {
      return res.status(404).json({ message: "QR Code não encontrado." });
    }

    return res.status(200).json(qrCodes.code);
  } catch (error) {
    console.error("Erro ao buscar QR Codes:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

// Função para verificar um QR Code na entrada da festa
exports.verifyQRCode = async (req, res) => {
  const { id } = req.body; // Código QR enviado pelo app móvel

  try {
    // Verifica se o QR Code existe
    const qrCode = await QRCode.findById({ _id: id });
    if (!qrCode) {
      return res
        .status(404)
        .json({ message: "QR Code inválido ou não encontrado." });
    }

    // // Verifica se o QR Code já foi escaneado
    if (qrCode.isScanned) {
      return res.status(400).json({ message: "QR Code já escaneado." });
    }

    // Marca o QR Code como escaneado
    qrCode.isScanned = true;
    await qrCode.save();

    // Atualiza o convite para usado
    const invite = await Invite.findById(qrCode.invite);
    invite.isUsed = true;
    await invite.save();

    return res
      .status(200)
      .json({ message: "QR Code verificado com sucesso. Entrada autorizada." });
  } catch (error) {
    console.error("Erro ao verificar QR Code:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};
