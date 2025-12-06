# organizare_conferinte
Proiect tehnologii web - Aplicatie pentru organizare de conferinte

# APLICAŢIE WEB PENTRU ORGANIZAREA DE CONFERINŢE

# Cuprins

1. [Instructiuni rulare aplicatie](#1-instructiuni-rulare-aplicatie)
1. [Scopul aplicatiei](#2-scopul-aplicației)
1. [Tipuri de utilizatori](#3-tipuri-de-utilizatori)

## 1. Instructiuni rulare aplicatie

## 2. Scopul aplicației
Aplicația web are ca scop gestionarea completă a procesului de organizare a unei conferințe științifice: de la înscrierea autorilor și trimiterea articolelor, până la evaluarea de către revieweri și aprobarea finală de către organizator. Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive mobile sau tablete (considerând preferințele utilizatorului).

Se urmărește automatizarea proceselor de:  înscriere la conferință, trimitere și evaluare articole, comunicare între autori și evaluatori, monitorizare a statusului articolelor de către organizatori.

## 3. Tipuri de utilizatori
[Cuprins](#cuprins)

- Organizator
  - creează conferințe;
  - alocă revieweri;
  - aprobă articole finale;
  - monitorizează starea fiecărui articol.
- Autor
  - se înregistrează la o conferință;
  - trimite articole pentru evaluare;
  - primește feedback;
  - poate retrimite o versiune revizuită.
- Reviewer
  - primește automat articole alocate;
  - oferă feedback și decide dacă un articol este aprobat sau nu.

## 4. Funcționalități principale

| Categoria	| Funcționalitate	| Descriere |
|-----------|------------------|-----------|
| Autentificare	| Login/Logout/Register |	Gestionare conturi utilizatori |
| Organizator   | Creare conferință	    | Setează titlu, dată, tematică, deadline |
| Autor	        | Trimitere articol     |	Upload fișier PDF și metadate |
| Reviewer	      | Evaluare articol	    | Feedback text + scor |
| Sistem        |	Alocare automată revieweri |	2 revieweri per articol |
| Vizualizare	  | Listă articole și stări	| Afișează articole trimise și progresul |

## 5. Cerințe funcționale
- CRUD pentru conferințe, articole, utilizatori.
- Upload de fișiere (PDF-uri).
- Login bazat pe token JWT.
- API REST care gestionează toate operațiile (Node.js + Express).
- Persistență în bază de date relațională (PostgreSQL / MySQL) prin ORM.
- Frontend SPA realizat în React.

## 6. Cerințe non-funcționale
- Răspunsurile API sub 300ms pentru cererile simple.
- Design responsive (desktop, mobil, tabletă).
- Securizarea parolelor prin hashing .
- Date persistente și validate (nu se acceptă câmpuri goale sau fișiere non-PDF).
________________________________________
# PLAN DE PROIECT (pe etape)
| Etapă	| Descriere activitate	| Rezultat final |
|-------|-----------------------|----------------|
|1. Analiză și specificații |	Identificarea cerințelor aplicației, definirea arhitecturii generale și a modelelor de date |	Documentația de cerințe + schema bazei de date |
|2. Proiectare	| Proiectarea arhitecturii (front-end, back-end, DB), design-ul interfeței |	Prototip interfață + diagrama API |
|3. Implementare backend	| Creare API REST în Node.js + Express, conectare la baza de date	| Server funcțional + endpoints testate cu Postman |
|4. Implementare frontend	| Dezvoltarea componentelor React (login, dashboard, pagină articole etc.)	| Aplicație SPA funcțională |
|5. Integrare & testare	| Conectarea front-endului cu back-endul, validare inputuri, testare cu date reale |	Aplicație complet funcțională |
|6. Deploy & documentare |	Publicarea aplicației pe un server gratuit (Render, Vercel, sau Railway) + completarea README	 | Link public + documentație finală |
|7. Prezentare finală    |	Demonstrarea aplicației și codului pe GitHub	| Predare finală |


