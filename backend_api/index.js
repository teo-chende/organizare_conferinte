require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

// Sequelize și modele
const sequelize = require("./sequelize");
const Rol = require("./models/rol");
const Utilizator = require("./models/utilizator");
const Conferinta = require("./models/conferinta");
const ReviewerPeConferinta = require("./models/reviewer_pe_conferinta");
const Articol = require("./models/articol");
const VersiuneArticol = require("./models/versiune_articol");
const Review = require("./models/review");

// Import Routes
const authRoutes = require('./routes/auth');
const utilizatoriRoutes = require('./routes/utilizatori');
const conferinteRoutes = require('./routes/conferinte');
const articoleRoutes = require('./routes/articole');
const reviewsRoutes = require('./routes/revieweri');


Rol.hasMany(Utilizator, { foreignKey: "rolId" });
Utilizator.belongsTo(Rol, { foreignKey: "rolId" });

Conferinta.belongsTo(Utilizator, { as: "organizator", foreignKey: "organizatorId" });
Utilizator.hasMany(Conferinta, { foreignKey: "organizatorId" });

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

Articol.belongsTo(Conferinta, { foreignKey: "conferintaId" });
Conferinta.hasMany(Articol, { foreignKey: "conferintaId" });

Articol.belongsTo(Utilizator, { as: "autor", foreignKey: "autorId" });
Utilizator.hasMany(Articol, { as: "articoleAutor", foreignKey: "autorId" });

VersiuneArticol.belongsTo(Articol, { foreignKey: "articolId" });
Articol.hasMany(VersiuneArticol, { foreignKey: "articolId" });

Review.belongsTo(Articol, { foreignKey: "articolId" });
Articol.hasMany(Review, { foreignKey: "articolId" });

Review.belongsTo(Utilizator, { as: "reviewer", foreignKey: "reviewerId" });
Utilizator.hasMany(Review, { as: "reviewuriDate", foreignKey: "reviewerId" });


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Homepage
app.get("/", (req, res) => {
  res.json({ 
    message: "🎓 API Organizare Conferințe - Funcțional!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
      utilizatori: "/api/utilizatori",
      conferinte: "/api/conferinte",
      articole: "/api/articole",
      reviews: "/api/reviews"
    },
    documentation: "https://github.com/teo-chende/organizare_conferinte"
  });
});

// Montare Rute
app.use('/api/auth', authRoutes);
app.use('/api/utilizatori', utilizatoriRoutes);
app.use('/api/conferinte', conferinteRoutes);
app.use('/api/articole', articoleRoutes);
// Pentru download, deoarece am definit ruta ca /download/:id in articole.js, 
// dar o vom accesa ca /api/versiuni/download/:id pentru claritate
app.use('/api/versiuni', articoleRoutes); 
app.use('/api/reviews', reviewsRoutes);


app.use((err, req, res, next) => {
  console.error("[ERROR]:", err);
  res.status(500).json({ message: "500 - Server Error", error: err.message });
});


app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexiune la baza de date reușită');
    console.log(`🚀 Server pornit pe http://localhost:${port}`);
  } catch (err) {
    console.error('❌ Eroare conexiune bază de date:', err);
  }
});