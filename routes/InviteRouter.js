// routes/inviteRoutes.js
const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/InviteController");
const authMiddleware = require("../middleware/auth");

// Rota para criação de convite
router.post("/:partyId/create", inviteController.createInvite);

// Rota para aprovação de convite
router.put(
  "/:inviteId/approve",
  authMiddleware,
  inviteController.approveInvite
);

router.delete(
  "/:inviteId/reject",
  authMiddleware,
  inviteController.rejectInvite
);

// Rota para listar convites de uma festa
router.get("/:partyId", authMiddleware, inviteController.getPartyInvites);

// Rota para buscar um convite
router.get("/:inviteId/invite", authMiddleware, inviteController.getInvite);

module.exports = router;
