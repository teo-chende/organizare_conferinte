import { Link } from "react-router-dom"

function LinieTabelRol( {rol} ) {
    let jsx;
    if(rol) {
        console.log("rol:", rol["id"]);
        jsx = <tr key={rol.id}>
            <td>{rol.id}</td>
            <td>{rol.name}</td>
            <td>{rol.descriere}</td>
        </tr>
    } else {
        jsx = <tr key="0"><td>"Nu s-au putut citi utilizatorii"</td></tr>
    }

    return(
        jsx
    )
}
export default LinieTabelRol;