// popularea tabelelor
import { sequelize } from "./sequelize.js";

//modele - care au corespondent modele in baza de date
import Rol from "./models/rol.js"
import Utilizator from "./models/utilizator.js";
import Conferinta from "./models/conferinta.js";
import ReviewerPeConferinta from "./models/reviewer_pe_conferinta.js";
import Articol from "./models/articol.js";
import VersiuneArticol from "./models/versiune_articol.js";

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { promises } from "fs";

async function seedDatabase() {
    // creez tabelele daca nu exista
    await sequelize.sync({ force: false });                // force: true sterge datele existente

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

    const rolNumeId = {}

    try {
        // lista roluri de inserat in tabel
        const infoRoluri = [
            {name: "Organizator", descriere: "Poate gestiona evenimente si utilizatori"},
            {name: "Reviewer", descriere: "Poate evalua lucrari"},
            {name: "Autor", descriere: "Poate crea lucrari"}
        ];

        //const rolOrganizator = await Rol.findOrCreate({where: { name: "Organizator" }});
        const roluri = await Rol.bulkCreate(
            infoRoluri,
            { ignoreDuplicates: true, returning: true }
        )
        console.log("Rolurile au fost initializate cu succes!");

        roluri.forEach(r => rolNumeId[r.name] = r.id);
        console.log("rolNumeId:", rolNumeId);

        // process.exit(0);
    } catch(err) {
        console.error("Eroare initializare roluri: ", err);
        // process.exit(1);
    }

    try {
        const infoUtilizatori = [
            {username: "admin", email: "admin@conferinte.com", password: await hashPassword("admin")},
            {username: "reviewer1", email: "reviewer1@conferinte.com", password: await hashPassword("reviewer1")},
            {username: "reviewer2", email: "reviewer2@conferinte.com", password: await hashPassword("reviewer2")},
            {username: "reviewer3", email: "reviewer3@conferinte.com", password: await hashPassword("reviewer3")},
            {username: "autor1", email: "autor1@conferinte.com", password: await hashPassword("autor1")},
            {username: "autor2", email: "autor2@conferinte.com", password: await hashPassword("autor2")},
            {username: "autor2", email: "autor2@conferinte.com", password: await hashPassword("autor3")},
        ];
        console.log("infoUtilizatori:", infoUtilizatori);
        
        const utilizatori = await Utilizator.bulkCreate(
            infoUtilizatori, 
            {ignoreDuplicates: true, returning: true}
        )

        console.log("utilizatori[0]:", utilizatori[0])

        // setare roluri pentru utilizatori - Promise.all - daca sunt mai multi
        // pastrez linia de mai jos, chiar daca lista are doar o intrare
        // daca ar fi mai multe intrari ara avea sens din punct de vedere al functionalitatii
        // asa, doar pentru invatare.
        await Promise.all([ utilizatori[0].setRol(rolNumeId['Organizator'])]);

        // adaugare individuala - cu await, nu Promise.all
        
        // pentru fiecare utilizator reviewer - id rol
        let i = 0;
        for(i = 1; i <= 3; i++) {
            await utilizatori[i].setRol(rolNumeId['Reviewer'])
        }

        // pentru fiecare utilizator autor - rol Autor (ID-ul luat cu rolNumeId['<nume rol>'])
        for(i = 4; i <= 6; i++) {
            await utilizatori[i].setRol(rolNumeId['Autor'])
        }


    } catch (err) {
        console.error("Eroare initializare utilizatori: ", err);
    }
} 

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

console.log("Generare baza de date si tabele");
(async () => await seedDatabase())(); 