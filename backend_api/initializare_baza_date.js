const sequelize = require("./sequelize");

// Import toate modelele
const Rol = require("./models/rol");
const Utilizator = require("./models/utilizator");
const Conferinta = require("./models/conferinta");
const ReviewerPeConferinta = require("./models/reviewer_pe_conferinta");
const Articol = require("./models/articol");
const VersiuneArticol = require("./models/versiune_articol");
const Review = require("./models/review");

const bcrypt = require('bcryptjs');

/**
 * Populează baza de date cu roluri și utilizatori de test
 */
async function initializeDatabase() {
  try {
    console.log("Sincronizare bază de date...");
    
    // Creează tabelele (force: true șterge datele existente)
    await sequelize.sync({ force: true });
    
    console.log("Tabele create cu succes!");

    // Populare Roluri
    console.log(" Creare roluri...");
    const roluri = [
      { id: 1, name: "Organizator", descriere: "Poate gestiona conferințe și aloca revieweri" },
      { id: 2, name: "Reviewer", descriere: "Poate evalua articolele" },
      { id: 3, name: "Autor", descriere: "Poate submite articole" }
    ];

    for (const rol of roluri) {
      await Rol.create(rol);
    }

    console.log("Roluri create!");

    // Creare utilizatori de test
    console.log("Creare utilizatori de test...");
    
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Organizatori
    await Utilizator.create({
      username: "organizator1",
      email: "org1@conferinte.ro",
      password: hashedPassword,
      rolId: 1
    });

    await Utilizator.create({
      username: "organizator2",
      email: "org2@conferinte.ro",
      password: hashedPassword,
      rolId: 1
    });

    // Revieweri
    for (let i = 1; i <= 5; i++) {
      await Utilizator.create({
        username: `reviewer${i}`,
        email: `reviewer${i}@conferinte.ro`,
        password: hashedPassword,
        rolId: 2
      });
    }

    // Autori
    for (let i = 1; i <= 3; i++) {
      await Utilizator.create({
        username: `autor${i}`,
        email: `autor${i}@conferinte.ro`,
        password: hashedPassword,
        rolId: 3
      });
    }

    console.log("Utilizatori de test creați!");
    console.log("\n═══════════════════════════════════════════");
    console.log("CREDENȚIALE DE TEST:");
    console.log("═══════════════════════════════════════════");
    console.log("Organizator: org1@conferinte.ro / password123");
    console.log("Reviewer:    reviewer1@conferinte.ro / password123");
    console.log("Autor:       autor1@conferinte.ro / password123");
    console.log("═══════════════════════════════════════════\n");

    console.log("Baza de date inițializată cu succes!");
    
    process.exit(0);
  } catch (err) {
    console.error("Eroare la inițializare:", err);
    process.exit(1);
  }
}

initializeDatabase();
