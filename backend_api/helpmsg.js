const help_msg = `
Navigati in directorul proiectului:
    
    cd [cale]/organizare_conferinte/backend_api

INSTALARE:
    npm install

    Comanda va instala dependintele specificate in package.json la categoria dependinte.

RULARE:
    Din directorul proiectului (unde se gaseste fisierul package.json) executati:

    npm run + una din comenzile de mai jos:

        help:       Afiseaza acest mesaj.
        apiserver:  Pornire server backend.
        init-db:    Creare baza de date si tabele pe baza modelelor.
        dev:        Porneste clientul - partea de frontend.

`;

console.log(help_msg)