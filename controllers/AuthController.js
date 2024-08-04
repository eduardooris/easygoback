const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const { username, email, password, name, lastname } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({
      username,
      name,
      lastname,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const tokens = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ tokens, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const tokens = generateTokens(user);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclui o campo de senha
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  const { username, email, name, lastname, pushToken } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: id },
      { username, email, name, lastname, pushToken }
    );
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

exports.updateTokenPush = async (req, res) => {
  const { id } = req.user;
  const { pushToken } = req.body;
  if (!pushToken) {
    return res.status(400).json({ message: "Token push is required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne({ _id: id }, { pushToken });
    res.status(200).json({ message: "Token push updated" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar token push" });
  }
};
