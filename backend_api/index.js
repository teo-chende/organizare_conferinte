// Express Initialisation
const express = require("express");
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
const { error } = require("console");
const { version } = require("os");

// Define entities relationship
Rol.hasMany(Utilizator, { foreignKey: "rolId"});            // un rol poate sa fie asociat la mai multi utilizatori: tabel roluri parinte si utilizatori tabela copil
Utilizator.belongsTo(Rol, { foreignKey: "rolId"});          // fiecare utilizator apartine unui singur rol

Conferinta.belongsTo(Utilizator, { foreignKey: "organizatorId" });
Utilizator.hasMany(Conferinta, { foreignKey: "organizatorId" });


//Conferinta.belongsToMany(Utilizator, {through: ReviewerPeConferinta, as: 'reviewers'});
//UserActivation.belongsToMany(Conferinta, {through: ReviewerPeConferinta, as: 'conferintaAtribuita'});

Articol.belongsTo(Conferinta, {foreignKey: "conferintaId"});
Conferinta.hasMany(Articol, {foreignKey: "conferintaId"})
Articol.belongsTo(Utilizator, {as: "autor", foreignKey: "autorId"});
Utilizator.hasMany(Articol, {foreignKey: "autorId"});

VersiuneArticol.belongsTo(Articol, {foreignKey: "articolId"});
Articol.hasMany(VersiuneArticol, {foreignKey: "articolId"});

// Express middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Kickstart the Express aplication
app.listen(port, async() => {
  console.log("The server is running on http://localhost:" + port);
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
        const verisiune = await VersiuneArticol.findByPk(req.params.id);
        if(!verisiune) {
            return res.status(404).json({error: "nu s-a gasit versiune articol"});
        }

        // stabilire tip fisier
        res.setHeader("Content-Type", verisiune.mimeType);

        // stabilire nume default fisier
        res.setHeader("Content-Disposition", `attachment; filename="paper-v${version.versionNumber}.pdf"`);

        // timit fisierul binar
        res.send(version.document);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})