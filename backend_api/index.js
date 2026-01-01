// Express Initialisation
require('dotenv').config()
const express = require("express");
const cors = require("cors")
const app = express();
const port = 3001;

const multer = require('multer');

// stocare în memorie → req.file.buffer va conține fișierul
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Sequelize Initialisation
const sequelize = require("./sequelize");

const Rol = require("./models/rol")
const Utilizator = require("./models/utilizator");
const Conferinta = require("./models/conferinta");
const ReviewerPeConferinta = require("./models/reviewer_pe_conferinta");
const Articol = require("./models/articol");
const VersiuneArticol = require("./models/versiune_articol");
const Review = require("./models/review");
const { error } = require("console");
const { version } = require("os");

//Middleware
const {authenticateToken} = require("./middleware/auth");
const {checkRole} = require("./middleware/rolCheck");

// Define entities relationship
Rol.hasMany(Utilizator, { foreignKey: "rolId"});            // un rol poate sa fie asociat la mai multi utilizatori: tabel roluri parinte si utilizatori tabela copil
Utilizator.belongsTo(Rol, { foreignKey: "rolId"});          // fiecare utilizator apartine unui singur rol

Conferinta.belongsTo(Utilizator, { foreignKey: "organizatorId" });
Utilizator.hasMany(Conferinta, { foreignKey: "organizatorId" });

// Relatie many-to-many pt revieweri pe conf
Conferinta.belongsToMany(Utilizator, { 
  through: ReviewerPeConferinta, 
  as: 'revieweri',
  foreignKey: 'conferintaId'
});
Utilizator.belongsToMany(Conferinta, { 
  through: ReviewerPeConferinta, 
  as: 'conferinteReviewer',
  foreignKey: 'reviewerId'
});
//Conferinta.belongsToMany(Utilizator, {through: ReviewerPeConferinta, as: 'reviewers'});
//UserActivation.belongsToMany(Conferinta, {through: ReviewerPeConferinta, as: 'conferintaAtribuita'});

Articol.belongsTo(Conferinta, {foreignKey: "conferintaId"});
Conferinta.hasMany(Articol, {foreignKey: "conferintaId"})
Articol.belongsTo(Utilizator, {as: "autor", foreignKey: "autorId"});
Utilizator.hasMany(Articol, {foreignKey: "autorId"});

VersiuneArticol.belongsTo(Articol, {foreignKey: "articolId"});
Articol.hasMany(VersiuneArticol, {foreignKey: "articolId"});

Review.belongsTo(Articol, {foreignKey:"articolId"});
Articol.hasMany(Review,{foreignKey:"articolId"});
Review.belongsTo(Utilizator,{as:"reviewer", foreignKey:"reviewerId"});
Utilizator.hasMany(Review,{as:"reviewuriDate", foreignKey:"reviewerId"});

// Express middleware
app.use(cors())
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Kickstart the Express aplication
app.listen(port, async() => {
  try {
    await sequelize.authenticate();
    console.log('Conexiune la baza de date reușită');
    console.log(`Server pornit pe http://localhost:${port}`);
  } catch (err) {
    console.error('Eroare conexiune bază de date:', err);
  }
});

// Create a middleware to handle 500 status errors.
app.use((err, req, res, next) => {
  console.error("[ERROR]:" + err);
  res.status(500).json({ message: "500 - Server Error" });
});


// Pagina de start
app.get("/", (req, res) => {
  res.send("API-ul rulează corect!");
});


// GET -> Roluri
app.get("/roluri", async(req, res) => {
    try {
        const roluri = await Rol.findAll();

        console.log(roluri.every(rol => rol instanceof Rol)); // true
        console.log('Toate rolurile:', JSON.stringify(roluri, null, 2));
    
        res.json({
            Roluri: roluri
        })
    } catch(err) {
        console.error("Eroare la GET /roluri:", err);
        res.status(500).json({error: "Eroare la preluare roluri"});
    }
    
});

// GET -> Utilizatori
app.get("/utilizatori", async(req, res) => {
    try {
        const users = await Utilizator.findAll({
            include: Rol            // adaug si rolul fiecarui utilizator
        });

        console.log(users.every(user => user instanceof Utilizator)); // true
        console.log('All users:', JSON.stringify(users, null, 2));
    
        res.json({
            Utilizatori: users
        });

    } catch(err) {
        console.error("Eroare la GET /utilizatori:", err);
        res.status(500).json({error: "Eroare la preluare utilizatori"});
    }
});

// POST -> Utilizatori
app.post("/utilizatori", async(req, res) => {
    try {
            const newUser = await Utilizator.create(req.body);

            res.json(newUser);
        } catch(err) {
            res.status(500).json(err);
        }
});

// GET -> un utilizator dupa id
app.get("/utilizatori/:id", async(req, res) => {
    try {
        const user = await Utilizator.findByPk(req.params.id);

        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({error: `User with id: ${req.params.id} not found`})
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// PUT -> un utilizator dupa id
app.put("/utilizatori/:id", async(req, res) => {
    try {
        const user = await Utilizator.findByPk(req.params.id);

        if(user) {
            const updatedUser = await user.update(req.body);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({error: `User with id: ${req.params.id} not found`})
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// DELETE -> un utilizator dupa id
app.delete("/utilizatori/:id", async(req, res) => {
    try {
        const user = await Utilizator.findByPk(req.params.id);

        if(user) {
            const result = await user.destroy();
            res.status(200).json(`User with id ${req.params.id} is deleted`);
        } else {
            res.status(404).json({error: `User with id: ${req.params.id} not found`})
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET -> Conferinte
app.get("/conferinte", async(req, res) => {
    try {
        const conferinte = await Conferinta.findAll({
            include: Utilizator            
        });

        console.log(conferinte.every(conferinta => conferinta instanceof Conferinta));      // true
        console.log('Toate conferintele:', JSON.stringify(conferinte, null, 2));
    
        res.json({
            Conferinte: conferinte
        });

    } catch(err) {
        console.error("Eroare la GET /conferinte:", err);
        res.status(500).json({error: "Eroare la preluare conferinte"});
    }
});
// POST -> Conferinte
app.post("/conferinte", async(req, res) => {
    try {
            const newConferinta = await Conferinta.create(req.body);

            res.json(newConferinta);
        } catch(err) {
            res.status(500).json(err);
        }
});

// GET -> Articole
app.get("/articole", async(req, res) => {
    try {
        const articole = await Articol.findAll({
            include: [
                {model: Conferinta},
                {model: Utilizator, as: "autor"}                                 // daca relatia dintre tabele am facut o cu acest alias trebuie sa il specific si aici
            ]                                                  
        });

        console.log(articole.every(articol => articol instanceof Articol));      // true
        console.log('Toate articolele:', JSON.stringify(articole, null, 2));
    
        res.json({
            Articole: articole
        });

    } catch(err) {
        console.error("Eroare la GET /articole:", err);
        res.status(500).json({error: "Eroare la preluare articole"});
    }
});
// POST -> Articole
app.post("/articole", async(req, res) => {
    try {
            const newArticol = await Articol.create(req.body);

            res.json(newArticol);
        } catch(err) {
            res.status(500).json(err);
        }
});

// POST -> verisiune articol
app.post("/articole/:articolId/upload", upload.single("document"), async(req, res) => {
    try {
        const nrVersiuni = await VersiuneArticol.count({where: {articolId: req.params.articolId}});

        const versiune = await VersiuneArticol.create({
            articolId: req.params.articolId,
            nrVersiune: nrVersiuni + 1,
            document: req.file.buffer,
            mimeType: req.file.mimetype,
            comentariiAutor:req.body.comentariiAutor || ""
        });

        res.json(versiune);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});


// GET -> pt ultima versiune postata la un articol
app.get("/versiuni-articole/:id", async(req, res) => {
    try {
        const versiune = await VersiuneArticol.findByPk(req.params.id);
        if(!versiune) {
            return res.status(404).json({error: "nu s-a gasit versiune articol"});
        }

        // stabilire tip fisier
        res.setHeader("Content-Type", versiune.mimeType);

        // stabilire nume default fisier
        res.setHeader("Content-Disposition", `attachment; filename="paper-v${version.versionNumber}.pdf"`);

        // timit fisierul binar
        res.send(versiune.document);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

// Homepage
app.get("/api", (req, res) => {
  res.json({ 
    message: "API Organizare Conferințe - Funcțional!",
    endpoints: {
      auth: "api/auth/*",
      utilizatori: "api/utilizatori",
      conferinte: "api/conferinte",
      articole: "api/articole",
      reviews: "api/reviews"
    }
  });
});

// AUTH ROUTES 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_pentru_dev';

// Register
app.post("api/auth/register", async (req, res) => {
  try {
    const { username, email, password, rolId } = req.body;

    // Verificare utilizator existent
    const existingUser = await Utilizator.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email-ul există deja" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creare utilizator (rolId default = 3 (Autor) în model)
    const newUser = await Utilizator.create({
      username,
      email,
      password: hashedPassword,
      rolId: rolId || 3
    });

    // Include și rolul în răspuns
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
app.post("api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // Generare token JWT
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
        rol: user.Rol
      }
    });
  } catch (err) {
    console.error("Eroare login:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user info
app.get("api/auth/me", authenticateToken, async (req, res) => {
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

//UTILIZATORI ROUTES

app.get("api/utilizatori", authenticateToken, async (req, res) => {
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

app.get("api/utilizatori/:id", authenticateToken, async (req, res) => {
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

// Get revieweri disponibili pentru alocare
app.get("api/utilizatori/revieweri/disponibili", authenticateToken, async (req, res) => {
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

// CONFERINTE ROUTES

// Get toate conferințele
app.get("api/conferinte", async (req, res) => {
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
app.get("api/conferinte/:id", async (req, res) => {
  try {
    const conferinta = await Conferinta.findByPk(req.params.id, {
      include: [
        { model: Utilizator, as: "organizator", attributes: ['id', 'username', 'email'] },
        { model: Utilizator, as: "revieweri", attributes: ['id', 'username', 'email'] },
        { model: Articol, include: [{ model: Utilizator, as: "autor", attributes: ['id', 'username'] }] }
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
app.post("api/conferinte", authenticateToken, checkRole(1), async (req, res) => {
  try {
    const { titlu, descriere } = req.body;
    
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
    res.status(500).json({ error: err.message });
  }
});

// Alocare revieweri la conferință
app.post("api/conferinte/:id/revieweri", authenticateToken, checkRole(1), async (req, res) => {
  try {
    const { reviewerIds } = req.body; // array de ID-uri

    const conferinta = await Conferinta.findByPk(req.params.id);
    if (!conferinta) {
      return res.status(404).json({ error: "Conferință negăsită" });
    }

    // Verificare că user-ul curent e organizatorul
    if (conferinta.organizatorId !== req.user.id) {
      return res.status(403).json({ error: "Nu ai permisiunea să aloci revieweri la această conferință" });
    }

    // Adaugă revieweri
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

// ARTICOLE ROUTES

// Get toate articolele (cu filtre opționale)
app.get("api/articole", authenticateToken, async (req, res) => {
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
        { model: Review, include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] }
      ]
    });

    res.json(articole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get articol by ID
app.get("api/articole/:id", authenticateToken, async (req, res) => {
  try {
    const articol = await Articol.findByPk(req.params.id, {
      include: [
        { model: Conferinta },
        { model: Utilizator, as: "autor", attributes: ['id', 'username', 'email'] },
        { model: VersiuneArticol, order: [['nrVersiune', 'DESC']] },
        { model: Review, include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] }
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

// Submit articol (Autor)
app.post("api/articole", authenticateToken, checkRole(3), async (req, res) => {
  try {
    const { titlu, conferintaId } = req.body;

    // Creare articol
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
      // Selectează aleatoriu 2 revieweri din pool
      const shuffled = conferinta.revieweri.sort(() => 0.5 - Math.random());
      const selectedReviewers = shuffled.slice(0, 2);

      for (const reviewer of selectedReviewers) {
        await Review.create({
          articolId: articol.id,
          reviewerId: reviewer.id,
          status: "in_asteptare"
        });
      }

      // Actualizare status articol
      await articol.update({ status: "in_curs_de_evaluare" });
    }

    const result = await Articol.findByPk(articol.id, {
      include: [
        { model: Conferinta },
        { model: Utilizator, as: "autor", attributes: ['id', 'username'] },
        { model: Review, include: [{ model: Utilizator, as: "reviewer", attributes: ['id', 'username'] }] }
      ]
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload versiune articol
app.post("api/articole/:articolId/versiune", 
  authenticateToken, 
  checkRole(3), 
  upload.single("document"), 
  async (req, res) => {
    try {
      const articol = await Articol.findByPk(req.params.articolId);
      
      if (!articol) {
        return res.status(404).json({ error: "Articol negăsit" });
      }

      // Verificare că user-ul e autorul
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
app.get("api/versiuni/:id/download", authenticateToken, async (req, res) => {
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

// REVIEWS ROUTES

// Get reviews pentru un articol
app.get("api/articole/:articolId/reviews", authenticateToken, async (req, res) => {
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

// Submit review (Reviewer)
app.post("api/reviews", authenticateToken, checkRole(2), async (req, res) => {
  try {
    const { articolId, decizie, comentarii } = req.body;

    // Verificare că reviewer-ul e alocat la acest articol
    const existingReview = await Review.findOne({
      where: { articolId, reviewerId: req.user.id }
    });

    if (!existingReview) {
      return res.status(403).json({ error: "Nu ești alocat ca reviewer pentru acest articol" });
    }

    // Actualizare review
    await existingReview.update({
      decizie, // "acceptat", "revizuire", "respins"
      comentarii,
      status: "completat",
      dataReview: new Date()
    });

    // Verificare dacă ambii revieweri au finalizat
    const allReviews = await Review.findAll({
      where: { articolId }
    });

    const allCompleted = allReviews.every(r => r.status === "completat");

    if (allCompleted) {
      // Actualizare status articol bazat pe decizii
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
app.get("api/reviews/mele", authenticateToken, checkRole(2), async (req, res) => {
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

