import './toolbar.css';
import MeniuPaginaPrincipala from './components/meniu_pagina_principala.jsx';
import MeniuRoluri from './components/meniu_roluri.jsx';

import MeniuUtilizatori from './components/meniu_utilizatori.jsx';
//import MeniuTestAPI from './components/meniu_testapi.jsx'

import MeniuLogin from './components/meniu_login.jsx'

import { useContext } from "react";
import UserContext from "../../context/user_context.jsx";

function Toolbar() {
    const { user } = useContext(UserContext)

    return(
        <div className="toolbar">
            <div className="grupPrincipal">
                <MeniuPaginaPrincipala />
                {
                    user.isAuthenticated && user.rol==="Organizator"
                    ?
                    <>
                        <MeniuRoluri />
                        <MeniuUtilizatori />
                    </> 
                    : 
                    <></>
                }
            </div>
            <MeniuLogin />
        </div>
    );
}

export default Toolbar;
