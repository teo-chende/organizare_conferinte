import { useContext, useState } from 'react'

import { 
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate
} from "react-router-dom";

import { useStorageState } from "react-storage-hooks";

import './App.css'

import UserContext from "./context/user_context.jsx";

import Toolbar from './containers/toolbar/toolbar.jsx';
import PaginaPrincipala from './components/pagina_principala.jsx'
import Roluri from './components/roluri.jsx'
import Utilizatori from './components/utilizatori.jsx'

import Login from './components/login.jsx'
import PaginaInexistenta from './components/pagina_inexistenta.jsx'

function App() {
  const [user, setUser] = useStorageState(localStorage, "stare-user", {})

  const onLogin = (nume, parola) => {
    console.log("onLogin - din APP. Informatii trimise:", nume, parola);

    let loading = true;
    //gasire utilizator si verificare nume si parola
    const url_api = `http://127.0.0.1:3001/login`;
    fetch(url_api,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/joson"
        },
        body: JSON.stringify({
          "user": nume,
          "pass": parola
        })
      }
    )
      .then(response => {
          if(response.ok) {
              console.log("fetch 1: response.ok:", response.ok)
              return response.json();
          } else {
              console.log("fetch 1 response.Nok:", response.ok)
              return Promise.reject(response)
              //throw new Error(`Status code ${response.status}`)
          }
      })
      .then(json_info => {
          console.log("fetch 2 (json) loading:", json_info)
          setUser({
            nume: json_info.nume,
            rol: json_info.rol,
            isAuthenticated: true
          })
      })
      .catch(e => {
          console.log("Eroare cerere login:", e)
      })
      .finally(() => {
          loading = false
          console.log("... Finaly ...")
      })

    if(nume == "utest" && parola == "ptest") {
      setUser({
        nume: nume,
        rol: "Organizator",
        isAuthenticated: true,
      });
      return 1;
    }
    console.error("Din App onLogin: User sau parola gresite!")
    return 0;
  }

  const onLogout = () => {
    setUser({ 
      nume: ``,
      rol: ``,
      isAuthenticatetd: false
    })
  }

  return (
    <Router>
      <h1>Organizare Conferinte</h1>
        <UserContext value={ {user, onLogout} }>
          <Toolbar />
          <div className="continut">
            <Routes>
              <Route path="/" element = {<PaginaPrincipala />} />
              <Route path="/roluri" element = { (user.isAuthenticated && user.rol==="Organizator") ? <Roluri /> : <PaginaInexistenta /> } />
              <Route path="/utilizatori" element = {(user.isAuthenticated && user.rol==="Organizator") ? <Utilizatori /> : <PaginaInexistenta />} />

              <Route path="/login" element = { !user.isAuthenticated ? <Login onLogin={onLogin}/> : <Navigate to="/"/>}/>

              <Route path="*" element={<PaginaInexistenta />} />
            </Routes>
          </div>
        </UserContext>
      </Router>

  )
}

export default App

/*
<Route path="/login" element={ !user.isAuthenticated ? <Login onLogin={onLogin}/> : <Navigate to="/" />}/>
*/