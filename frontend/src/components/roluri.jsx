import { useContext, useState, useEffect } from "react";
import LinieTabelRol from './micro_components/linie_tabel_rol.jsx'
//import UserContext from "../context/UserContext.jsx";

function Roluri() {
    //const { user } = useContext(UserContext);
    const [jsonRoluri, setJsonRoluri] = useState([]);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(true)


    const url_api = `http://127.0.0.1:3001/roluri`;

    //pentru metoda POST - apelul fetch include si dictionarul cu metoda si corpul
    //cererii (gol in acest caz)
    //fetch(url_api_test_post, {method: "POST"})

    useEffect(() => {
        const controller = new AbortController();
        fetch(url_api, { signal: controller.signal})
        .then(response => {
            if(response.ok) {
                console.log(response.ok)
                return response.json();
            } else {
                console.log("response.ok:", response.ok)
                //return Promise.reject(response)
                return Promise.reject(response)
                //throw new Error(`Status code ${response.status}`)
            }
        })
        .then(json_info => {
            console.log(json_info.Roluri)
            setJsonRoluri(json_info.Roluri)
            setError(null)
            setLoading("fetched")
        })
        .catch(e => {
            setJsonRoluri([e.status, e.statusText, " - Eroare acces URL:", e.url])
            console.log(e.status, e.statusText, " - Eroare acces URL:", e.url)
            //setError(e)
            setError(e.status + " " +  e.statusText + ". Eroare acces URL: " + e.url)
        })
        .finally(() => {
            setLoading(false)
            console.log("... Finaly ...")
        })

        return () => {
            controller.abort()
        }
    }, []);

    return(
        <>
            <h2>Roluri</h2>
            {   
                error ? (
                    jsonRoluri.join(" ")
                ) : (
                    <table className="articoleBazaDate" key="0">
                        <tbody>
                            {jsonRoluri.map(rol => <LinieTabelRol rol={rol}/>)}
                        </tbody>
                    </table>
                )
            }
            {
            /*user.isAuthenticated ? (
                <>Utilizatorul autentificat: {user.nume}</>
            ) : (
            <>Neautentificat</>
            )*/}
            {/* JSON.stringify(jsonRoluri, 3, 2) */}
            
        </>
    );
}

export default Roluri;