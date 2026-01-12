import { ReactFragment, useContext } from "react";
import imagineConferinta from "/public/videoconference.png";
//import UserContext from "../context/UserContext.jsx";

function PaginaPrincipala() {
    //const { user } = useContext(UserContext);

    return(
        <div style={{display: "flex"}}>
            <div style={{display:"block", padding:"20px", verticalAlign: "center"}}>
            <h1>Bine ati venit!!!</h1>
            <ul>
                <li>Organizam conferinte</li>
                <li>Autorii pot adauga documentul pentru conferinta</li>
                <li>Documentele sunt analizate de moderatorii (reviewers)</li>
                <li>Pe baza comentariilor de la moderatori se pot adauga noi versiuni ale documentului</li>
                <li>Odata ce documentele sunt acceptate, se planifica conferinta</li>
            </ul>
            </div>
            <img src={imagineConferinta} style={{width:"300px"}}></img>
            <p>
            {/*user.isAuthenticated ? (
                <>Utilizatorul autentificat: {user.nume}</>
            ) : (
            <>Neautentificat</>
            )*/}
            </p>
        </div>
    );
}

export default PaginaPrincipala;