// popularea tabelelor
const sequelize = require("./sequelize");

//modele - care au corespondent modele in baza de date
const Rol = require("./models/rol")
const Utilizator = require("./models/utilizator");
const Conferinta = require("./models/conferinta");
const ReviewerPeConferinta = require("./models/reviewer_pe_conferinta");
const Articol = require("./models/articol");
const VersiuneArticol = require("./models/versiune_articol");

async function seedRoluri() {
    try {
        // creez tabelele daca nu exista
        await sequelize.sync({ force: false });                // force: true sterge datele existente

        // lista roluri de inserat in tabel
        const roluri = [
            {name: "Organizator", descriere: "Poate gestiona evenimente si utilizatori"},
            {name: "Reviewer", descriere: "Poate evalua lucrari"},
            {name: "Autor", descriere: "Poate crea lucrari"}
        ];

        for(const rol of roluri) {
            await Rol.findOrCreate({
                where: { name: rol.name },
                defaults: rol
            });
        }

        console.log("Rolurile au fost incarcate cu succes!");
        // process.exit(0);
    } catch(err) {
        console.error("Eroare la populare tabela Roluri: ", err);
        // process.exit(1);
    }
} 

console.log("Generare baza de date si tabele");
(async () => await seedRoluri())();