import { useContext, useState, useEffect } from "react";
import LinieTabelUtilizator from './micro_components/linie_tabel_utilizator.jsx'
//import UserContext from "../context/UserContext.jsx";

function Utilizatori() {
    //const { user } = useContext(UserContext);
        //const { user } = useContext(UserContext);
    const [dateJson, setJson] = useState([])
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(true)

    const url_api = `http://127.0.0.1:3001/utilizatori`;

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
            console.log(json_info.Utilizatori)
            setJson(json_info.Utilizatori)
            setError(null)
            setLoading("fetched")
        })
        .catch(e => {
            setJson([e.status, e.statusText, " - Eroare acces URL:", e.url])
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
            <h2>Utilizatori</h2>
            {   
                error ? (
                    dateJson.join(" ")
                ) : (
                    <table className="articoleBazaDate" key="0">
                        <tbody>
                            {dateJson.map(u => <LinieTabelUtilizator utilizator={u}/>)}
                        </tbody>
                    </table>
                )
            }
            {/*user.isAuthenticated ? (
                <>Utilizatorul autentificat: {user.nume}</>
            ) : (
            <>Neautentificat</>
            )*/}
            
            {/* JSON.stringify(jsonUtilizatori, 3, 2) */}
        </>
    );
}

export default Utilizatori;