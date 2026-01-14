const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const Utilizator = require('../models/utilizator');
const Rol = require('../models/rol');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_pentru_dev';

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, rolId } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
    }

    const existingUser = await Utilizator.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email-ul există deja" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Utilizator.create({
      username,
      email,
      password: hashedPassword,
      rolId: rolId || 3
    });

    const userWithRole = await Utilizator.findByPk(newUser.id, {
      include: Rol,
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({ 
      message: "Utilizator creat cu succes",
      user: userWithRole
    });
  } catch (err) {
    console.error("Eroare register:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email și parolă obligatorii" });
    }

    const user = await Utilizator.findOne({ 
      where: { email },
      include: Rol
    });

    if (!user) {
      return res.status(401).json({ error: "Credențiale invalide" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credențiale invalide" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rolId: user.rolId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        rolId: user.rolId,
        Rol: user.Rol
      }
    });
  } catch (err) {
    console.error("Eroare login:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await Utilizator.findByPk(req.user.id, {
      include: Rol,
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: "Utilizator negăsit" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;