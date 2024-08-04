const express = require("express");
const {
  register,
  refreshToken,
  login,
  getUserProfile,
  updateUser,
  updateTokenPush,
} = require("../controllers/AuthController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/refresh-token", refreshToken);
router.patch("/", authMiddleware, updateUser);
router.put("/", authMiddleware, updateTokenPush);
module.exports = router;
