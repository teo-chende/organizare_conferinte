import './toolbar.css';
import MeniuPaginaPrincipala from './components/meniu_pagina_principala.jsx';
import MeniuRoluri from './components/meniu_roluri.jsx';

import MeniuUtilizatori from './components/meniu_utilizatori.jsx';
//import MeniuTestAPI from './components/meniu_testapi.jsx'

import MeniuLogin from './components/meniu_login.jsx'

import { useContext } from "react";
//import UserContext from "../../context/UserContext.jsx";

function Toolbar() {
    //const { user } = useContext(UserContext)

    return(
        <div className="toolbar">
            <div className="grupPrincipal">
                <MeniuPaginaPrincipala />
                <MeniuRoluri />
                <MeniuUtilizatori />
            </div>
            <MeniuLogin />
        </div>
    );
}

export default Toolbar;

              /*{user.isAuthenticated ? (
                    <>
                    <MeniuRoluri />
                    <MeniuUtilizatori />
                    </>
                ) : (<></>)
                }*/