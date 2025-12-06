import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://github.com/teo-chende/organizare_conferinte" target="_blank">vezi pe github</a>
      </div>
      <h1>Organizator Conferinte</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Descriere
          Aplicația trebuie să permită înregistrarea organizarea unor conferințe științifice, cu trimiterea și aprobarea unor articole.
        </p>
        <p>
        Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive mobile sau tablete (considerând preferințele utilizatorului).
        Funcționalități (minime)
        </p>
        <p>
        Aplicația are trei tipuri de utilizatori, organizatori, revieweri și autori.
        Un organizator poate crea o conferință și aloca o serie de revieweri
        Un autor se poate înregistra la o conferință și poate face o propunere de articol
        La primirea articolului, se alocă automat 2 revieweri pentru articol
        Reviewer-i pot aproba articolul sau pot da feed-back autorului pentru modificarea lui
        Autorul poate încărca o nouă versiune a unui articol pe baza feed-back-ului primit
        Organizatorul poate monitoriza starea articolelor trimise
        </p>
      </div>
    </>
  )
}

export default App
