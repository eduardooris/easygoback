// routes/qrCodeRoutes.js
const express = require("express");
const router = express.Router();
const qrCodeController = require("../controllers/QrCodeController");
const authMiddleware = require("../middleware/auth");
// Rota para verificar QR Code
router.post("/verify", authMiddleware, qrCodeController.verifyQRCode);
router.get('/:id', qrCodeController.getQrCodes);
router.post('/', qrCodeController.connectWpp);
module.exports = router;
