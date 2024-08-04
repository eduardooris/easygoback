// controllers/partyController.js
const Party = require("../models/PartySchema");
const User = require("../models/UserSchema");

// Função para criar uma nova festa
exports.createParty = async (req, res) => {
  const { name, date, location, description } = req.body;
  const userId = req.user.id; // Supondo que o ID do usuário esteja disponível no token JWT

  try {
    // Cria uma nova festa
    const newParty = new Party({
      name,
      date,
      location,
      description,
      createdBy: userId,
    });

    // Salva a festa no banco de dados
    await newParty.save();

    // Associa a festa ao usuário
    const user = await User.findById(userId);
    user.parties.push(newParty);
    await user.save();

    return res
      .status(201)
      .json({ message: "Festa criada com sucesso.", party: newParty });
  } catch (error) {
    console.error("Erro ao criar festa:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

// Função para listar todas as festas de um usuário
exports.getUserParties = async (req, res) => {
  const userId = req.user.id;

  try {
    const parties = await Party.find({ createdBy: userId }).populate("invites");

    return res.status(200).json(parties);
  } catch (error) {
    console.error("Erro ao obter festas:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.getPartyById = async (req, res) => {
  const { id } = req.params;

  try {
    const party = await Party.findById(id);

    if (!party) {
      return res.status(404).json({ message: "Festa não encontrada." });
    }

    return res.status(200).json(party);
  } catch (error) {
    console.error("Erro ao buscar festa:", error.message);
    return res
      .status(500)
      .json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
};
