import { useState, useContext } from "react";
import UserContext from "../context/user_context.jsx";

function Login( props ) {
    //const { user } = useContext(UserContext);
    const [nume, setNume] = useState("");
    const [parola, setParola] = useState("");
    const [infoform, setInfoForm] = useState(""); // pt msg informare

    //const { user } = useContext(UserContext); //prin context fac disponibila variabila user si in componenta Login

    const { onLogin } = props;

    const handlePostForm = (event) => {
        event.preventDefault()
        console.log("Apel handlePostForm din Login. nume =", nume)
        setInfoForm(" nume:"+nume+", parola:"+parola)
        setNume("");
        setParola("")
    }

    const handleLogin = event => {
        event.preventDefault();
        console.log("Apel handleLogin din Login.")
        //setInfoForm(" nume:"+nume+", parola:"+parola)
        setNume("");
        setParola("")
        if(!onLogin(nume, parola)) {
            setInfoForm("nume sau parola gresite")
        }
    }


    return(
        <>
            <p>
            {/*user.isAuthenticated ? (
                <>Utilizatorul autentificat: {user.nume}</>
            ) : (
            <>Neautentificat</>
            )*/}
            </p>
          
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{display:"block"}}>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <label htmlFor="id_nume">Nume</label>
                        </td>
                        <td>
                            <input type="text" name="nume" id="id_nume" value={nume}
                                onChange={event => setNume(event.target.value)}
                            />
                        </td>
                    </tr>
                
                    <tr>
                        <td>
                            <label htmlFor="id_pass">Parola</label>
                        </td>
                        <td>
                            <input type="password" name="password" id="id_pass" value={parola}
                                onChange={event => setParola(event.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input value="Trimite" type="submit" disabled={!nume || !parola}/></td>
                    </tr>
                    </tbody>
                </table>
            </form>
            {infoform}
        </>
    );
}

export default Login;