const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const Review = require('../models/review');
const Articol = require('../models/articol');
const Utilizator = require('../models/utilizator');
const Conferinta = require('../models/conferinta');

// Submit review (Reviewer)
router.post("/", authenticateToken, checkRole(2), async (req, res) => {
  try {
    const { articolId, decizie, comentarii } = req.body;

    if (!articolId || !decizie || !comentarii) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
    }

    const existingReview = await Review.findOne({
      where: { articolId, reviewerId: req.user.id }
    });

    if (!existingReview) {
      return res.status(403).json({ error: "Nu ești alocat ca reviewer pentru acest articol" });
    }

    await existingReview.update({
      decizie, 
      comentarii,
      status: "completat",
      dataReview: new Date()
    });

    const allReviews = await Review.findAll({
      where: { articolId }
    });

    const allCompleted = allReviews.every(r => r.status === "completat");

    if (allCompleted) {
      const decisions = allReviews.map(r => r.decizie);
      
      let newStatus;
      if (decisions.includes("respins")) {
        newStatus = "respins";
      } else if (decisions.includes("revizuire")) {
        newStatus = "revizuire";
      } else {
        newStatus = "acceptat";
      }

      await Articol.update({ status: newStatus }, { where: { id: articolId } });
    }

    const result = await Review.findByPk(existingReview.id, {
      include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }]
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get articole pe care trebuie să le revieweze user-ul curent
router.get("/mele", authenticateToken, checkRole(2), async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewerId: req.user.id },
      include: [
        { 
          model: Articol, 
          include: [
            { model: Conferinta, attributes: ['id', 'titlu'] },
            { model: Utilizator, as: "autor", attributes: ['id', 'username'] }
          ]
        }
      ]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;