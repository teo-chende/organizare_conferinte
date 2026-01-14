const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Utilizator = require('../models/utilizator');
const Rol = require('../models/rol');

// Get toți utilizatorii
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await Utilizator.findAll({
      include: Rol,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get revieweri disponibili pentru alocare
router.get("/revieweri/disponibili", authenticateToken, async (req, res) => {
  try {
    const revieweri = await Utilizator.findAll({
      where: { rolId: 2 }, // Rol Reviewer
      include: Rol,
      attributes: { exclude: ['password'] }
    });
    res.json(revieweri);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get utilizator by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await Utilizator.findByPk(req.params.id, {
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