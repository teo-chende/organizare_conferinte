import { useState } from 'react'

import { 
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate
} from "react-router-dom";

import './App.css'

import Toolbar from './containers/toolbar/toolbar.jsx';
import PaginaPrincipala from './components/pagina_principala.jsx'
import Roluri from './components/roluri.jsx'
import Utilizatori from './components/utilizatori.jsx'

import Login from './components/login.jsx'
import PaginaInexistenta from './components/pagina_inexistenta.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <h1>Organizare Conferinte</h1>

      <Toolbar />
        <div className="continut">
          <Routes>
            <Route path="/" element = {<PaginaPrincipala />} />
            <Route path="/roluri" element = {<Roluri />} />
            <Route path="/utilizatori" element = {<Utilizatori />} />

            <Route path="/login" element = {<Login />}/>

            <Route path="*" element={<PaginaInexistenta />} />
          </Routes>
        </div>
      </Router>

  )
}

export default App

/*
<Route path="/login" element={ !user.isAuthenticated ? <Login onLogin={onLogin}/> : <Navigate to="/" />}/>
*/