import { Link } from "react-router-dom"

function LinieTabelUtilizator( {utilizator} ) {
    let jsx;
    if(utilizator) {
        console.log("utilizator:", utilizator["id"]);
        jsx = <tr key={utilizator.id}>
            <td>{utilizator.id}</td>
            <td>{utilizator.username}</td>
            <td>{utilizator.email}</td>
            <td>{utilizator.Rol.name}</td>
        </tr>
    } else {
        jsx = <tr key="0"><td>"Nu s-au putut citi utilizatorii"</td></tr>
    }

    return(
        jsx
    )
}
export default LinieTabelUtilizator;