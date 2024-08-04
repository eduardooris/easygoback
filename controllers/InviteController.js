const sendPush = require("../helpers/sendPush");
const Invite = require("../models/InviteSchema");
const Party = require("../models/PartySchema");
const QRCode = require("../models/QrCodeSchema");
const QRCodeGenerator = require("qrcode"); // Biblioteca para gerar QR Codes
const UserSchema = require("../models/UserSchema");
// Função para criar um novo convite
exports.createInvite = async (req, res) => {
  const { guestName, guestSurname, guestPhoto, email, phoneNumber } = req.body;
  const { partyId } = req.params; // ID da festa

  try {
    // Verifica se a festa existe
    const party = await Party.findById(partyId);
    const founderParty = await UserSchema.findById(party.createdBy._id);
    if (!party) {
      return res.status(404).json({ message: "Festa não encontrada." });
    }

    // Cria um novo convite
    const newInvite = new Invite({
      guestName,
      guestSurname,
      guestPhoto,
      email,
      phoneNumber,
      party: partyId,
    });

    // Salva o convite no banco de dados
    await newInvite.save();
    // Associa o convite à festa
    party.invites.push(newInvite);
    await party.save();

    // Envia uma notificação para o fundador da festa

    sendPush.sendPush(
      founderParty.pushToken,
      "Novo convidado",
      `Seu convidado ${guestName} ${guestSurname} precisa ser autorizado para a festa: ${party.name}.`
    );

    return res
      .status(201)
      .json({ message: "Convite criado com sucesso.", invite: newInvite });
  } catch (error) {
    console.error("Erro ao criar convite:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

// Função para aprovar um convite e gerar um QR Code
exports.approveInvite = async (req, res) => {
  const { inviteId } = req.params;

  try {
    // Verifica se o convite existe
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Convite não encontrado." });
    }

    // Verifica se o convite já foi aprovado
    if (invite.isApproved) {
      return res.status(400).json({ message: "Convite já aprovado." });
    }

    // Gera o QR Code
    const qrCodeData = `${invite._id}`; // Dados a serem codificados
    const qrCodeUrl = await QRCodeGenerator.toDataURL(qrCodeData);

    // Cria um novo QR Code
    const qrCode = new QRCode({
      code: qrCodeUrl,
      invite: inviteId,
    });

    // Salva o QR Code no banco de dados
    await qrCode.save();

    // Atualiza o convite para aprovado
    invite.isApproved = true;
    invite.qrCode = qrCode._id;
    await invite.save();

    return res
      .status(200)
      .json({ message: "Convite aprovado com sucesso.", qrCodeUrl });
  } catch (error) {
    console.error("Erro ao aprovar convite:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

// Função para listar todos os convites de uma festa
exports.getPartyInvites = async (req, res) => {
  const { partyId } = req.params;
  try {
    const invites = await Invite.find({ party: partyId }).populate("qrCode");

    return res.status(200).json(invites);
  } catch (error) {
    console.error("Erro ao obter convites:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.rejectInvite = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Convite não encontrado." });
    }

    if (invite.isApproved) {
      return res.status(400).json({ message: "Convite já aprovado." });
    }

    await invite.deleteOne({ _id: inviteId });

    return res.status(200).json({ message: "Convite rejeitado com sucesso." });
  } catch (error) {
    console.error("Erro ao rejeitar convite:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.getInvite = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Convite não encontrado." });
    }

    return res.status(200).json(invite);
  } catch (error) {
    console.error("Erro ao buscar convite:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};
