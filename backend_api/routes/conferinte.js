const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const Conferinta = require('../models/conferinta');
const Utilizator = require('../models/utilizator');
const Articol = require('../models/articol');
const VersiuneArticol = require('../models/versiune_articol');
const ReviewerPeConferinta = require('../models/reviewer_pe_conferinta');

// Get toate conferințele
router.get("/", async (req, res) => {
  try {
    const conferinte = await Conferinta.findAll({
      include: [
        { model: Utilizator, as: "organizator", attributes: ['id', 'username', 'email'] },
        { model: Utilizator, as: "revieweri", attributes: ['id', 'username', 'email'] }
      ]
    });
    res.json(conferinte);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get conferință by ID
router.get("/:id", async (req, res) => {
  try {
    const conferinta = await Conferinta.findByPk(req.params.id, {
      include: [
        { model: Utilizator, as: "organizator", attributes: ['id', 'username', 'email'] },
        { model: Utilizator, as: "revieweri", attributes: ['id', 'username', 'email'] },
        { 
          model: Articol, 
          include: [
            { model: Utilizator, as: "autor", attributes: ['id', 'username'] },
            { model: VersiuneArticol }
          ] 
        }
      ]
    });

    if (!conferinta) {
      return res.status(404).json({ error: "Conferință negăsită" });
    }

    res.json(conferinta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Creare conferință (doar Organizator)
router.post("/", authenticateToken, checkRole(1), async (req, res) => {
  try {
    const { titlu, descriere } = req.body;

    if (!titlu) {
      return res.status(400).json({ error: "Titlul este obligatoriu" });
    }
    
    const newConferinta = await Conferinta.create({
      titlu,
      descriere,
      organizatorId: req.user.id
    });

    const conferinta = await Conferinta.findByPk(newConferinta.id, {
      include: { model: Utilizator, as: "organizator", attributes: ['id', 'username'] }
    });

    res.status(201).json(conferinta);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: "Există deja o conferință cu acest titlu" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Alocare revieweri la conferință
router.post("/:id/revieweri", authenticateToken, checkRole(1), async (req, res) => {
  try {
    const { reviewerIds } = req.body; // array de ID-uri

    if (!Array.isArray(reviewerIds) || reviewerIds.length === 0) {
      return res.status(400).json({ error: "Trimite un array de reviewer IDs" });
    }

    const conferinta = await Conferinta.findByPk(req.params.id);
    if (!conferinta) {
      return res.status(404).json({ error: "Conferință negăsită" });
    }

    if (conferinta.organizatorId !== req.user.id) {
      return res.status(403).json({ error: "Nu ai permisiunea să aloci revieweri la această conferință" });
    }

    for (const reviewerId of reviewerIds) {
      await ReviewerPeConferinta.findOrCreate({
        where: { conferintaId: req.params.id, reviewerId }
      });
    }

    const updated = await Conferinta.findByPk(req.params.id, {
      include: { model: Utilizator, as: "revieweri", attributes: ['id', 'username', 'email'] }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;