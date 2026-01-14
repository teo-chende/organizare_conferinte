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
        setLoading(true)
        setError(undefined)
        const controller = new AbortController();
        fetch(url_api, { signal: controller.signal})
        .then(response => {
            if(response.ok) {
                console.log("fetch 1: response.ok:", response.ok)
                console.log("fetch 1 (response) loading:", loading)
                return response.json();
            } else {
                console.log("fetch 1 response.ok:", response.ok)
                //return Promise.reject(response)
                return Promise.reject(response)
                //throw new Error(`Status code ${response.status}`)
            }
        })
        .then(json_info => {
            console.log("fetch 2 (json) loading:", loading)
            console.log("fetch 2 - json", json_info.Roluri)
            setJsonRoluri(json_info.Roluri)
            //setError(undefined)
            //setLoading(false)
        })
        .catch(e => {
            if(e?.name === "AbortError") {
                console.log("AbortError - to prevent double fetch, via controller.signal.")
            } else {
                setJsonRoluri([e.status, e.statusText, " - Eroare acces URL:", e.url])
                console.log(e.status, e.statusText, " - Eroare acces URL:", e.url)
                //setError(e.status + " " +  e.statusText + ". Eroare acces URL: " + e.url)
                setError(e)
            }
            //setLoading(false)
        })
        .finally(() => {
            console.log("fetch 3 (finally) loading:", loading)
            setLoading(false)
            console.log("... Finaly ...")
        })
        

        return () => {
            controller.abort()
        }
    }, []);


    let jsx;

    if(loading) {
        jsx = "Loading ... - se incarca informatiile de pe server!"
        console.log("JSX loading ...", jsx)
    } else if(error != undefined) {
        console.log(" --- error:", error, "error.name =", error.name)
        jsx = jsonRoluri.join(" ")
        console.log("JSX error:", error)
    } else {
        console.log("JSX loading COMPLETED!")
        jsx = <table className="articoleBazaDate" key="0">
                <tbody>
                    {jsonRoluri.map(rol => <LinieTabelRol rol={rol}/>)}
                </tbody>
            </table>
    }


    return(
        <>
            <h2>Roluri</h2>
            {jsx}
            {/*
                error ? (
                    jsonRoluri.join(" ")
                ) : (
                    <table className="articoleBazaDate" key="0">
                        <tbody>
                            {jsonRoluri.map(rol => <LinieTabelRol rol={rol}/>)}
                        </tbody>
                    </table>
                )
            */}
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