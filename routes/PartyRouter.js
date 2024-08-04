// routes/partyRoutes.js
const express = require("express");
const router = express.Router();
const {
  createParty,
  getUserParties,
  getPartyById
} = require("../controllers/PartyController");
const authMiddleware = require("../middleware/auth");

// Rota para criação de festa
router.post("/", authMiddleware, createParty);

// Rota para listar festas de um usuário
router.get("/", authMiddleware, getUserParties);

router.get("/:id", getPartyById);
module.exports = router;
