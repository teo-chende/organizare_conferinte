const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const Articol = require('../models/articol');
const Conferinta = require('../models/conferinta');
const Utilizator = require('../models/utilizator');
const VersiuneArticol = require('../models/versiune_articol');
const Review = require('../models/review');

// Configurare Multer pentru upload în memorie
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get toate articolele (cu filtre opționale)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { conferintaId, autorId, status } = req.query;
    
    let where = {};
    if (conferintaId) where.conferintaId = conferintaId;
    if (autorId) where.autorId = autorId;
    if (status) where.status = status;

    const articole = await Articol.findAll({
      where,
      include: [
        { model: Conferinta, attributes: ['id', 'titlu'] },
        { model: Utilizator, as: "autor", attributes: ['id', 'username', 'email'] },
        { model: VersiuneArticol },
        { 
          model: Review, 
          include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] 
        }
      ]
    });

    res.json(articole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get articol by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const articol = await Articol.findByPk(req.params.id, {
      include: [
        { model: Conferinta },
        { model: Utilizator, as: "autor", attributes: ['id', 'username', 'email'] },
        { model: VersiuneArticol, order: [['nrVersiune', 'DESC']] },
        { 
          model: Review, 
          include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] 
        }
      ]
    });

    if (!articol) {
      return res.status(404).json({ error: "Articol negăsit" });
    }

    res.json(articol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit articol (Autor) - ALOCĂ AUTOMAT 2 REVIEWERI
router.post("/", authenticateToken, checkRole(3), async (req, res) => {
  try {
    const { titlu, conferintaId } = req.body;

    if (!titlu || !conferintaId) {
      return res.status(400).json({ error: "Titlu și conferință sunt obligatorii" });
    }

    const articol = await Articol.create({
      titlu,
      conferintaId,
      autorId: req.user.id,
      status: "submitted"
    });

    // ALOCARE AUTOMATĂ de 2 REVIEWERI
    const conferinta = await Conferinta.findByPk(conferintaId, {
      include: { model: Utilizator, as: "revieweri" }
    });

    if (conferinta && conferinta.revieweri.length >= 2) {
      const shuffled = conferinta.revieweri.sort(() => 0.5 - Math.random());
      const selectedReviewers = shuffled.slice(0, 2);

      for (const reviewer of selectedReviewers) {
        await Review.create({
          articolId: articol.id,
          reviewerId: reviewer.id,
          status: "in_asteptare"
        });
      }

      await articol.update({ status: "in_curs_de_evaluare" });
    }

    const result = await Articol.findByPk(articol.id, {
      include: [
        { model: Conferinta },
        { model: Utilizator, as: "autor", attributes: ['id', 'username'] },
        { 
          model: Review, 
          include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] 
        }
      ]
    });

    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: "Există deja un articol cu acest titlu" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Upload versiune articol
router.post("/:articolId/versiune", 
  authenticateToken, 
  checkRole(3), 
  upload.single("document"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Niciun fișier încărcat" });
      }

      const articol = await Articol.findByPk(req.params.articolId);
      
      if (!articol) {
        return res.status(404).json({ error: "Articol negăsit" });
      }

      if (articol.autorId !== req.user.id) {
        return res.status(403).json({ error: "Nu ai permisiunea să încarci versiuni la acest articol" });
      }

      const nrVersiuni = await VersiuneArticol.count({ 
        where: { articolId: req.params.articolId } 
      });

      const versiune = await VersiuneArticol.create({
        articolId: req.params.articolId,
        nrVersiune: nrVersiuni + 1,
        document: req.file.buffer,
        mimeType: req.file.mimetype,
        comentariiAutor: req.body.comentariiAutor || ""
      });

      res.status(201).json({
        id: versiune.id,
        nrVersiune: versiune.nrVersiune,
        dataIncarcare: versiune.dataIncarcare,
        comentariiAutor: versiune.comentariiAutor
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Download versiune articol
// Observație: Această rută va fi montată la /api/versiuni, nu /api/articole, in index.js
router.get("/download/:id", authenticateToken, async (req, res) => {
  try {
    const versiune = await VersiuneArticol.findByPk(req.params.id);
    
    if (!versiune) {
      return res.status(404).json({ error: "Versiune negăsită" });
    }

    res.setHeader("Content-Type", versiune.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="paper-v${versiune.nrVersiune}.pdf"`);
    res.send(versiune.document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews pentru un articol
router.get("/:articolId/reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { articolId: req.params.articolId },
      include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username', 'email'] }]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;