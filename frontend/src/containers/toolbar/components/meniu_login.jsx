import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../../context/user_context.jsx";

function MeniuLogin() {
    const { user, onLogout } = useContext(UserContext)

    return(
        <div className="elementMeniu meniuLogin">
            { user.isAuthenticated ?
                (
                    <ul className="nav">
                        <li>
                            <a href="#">{user.nume}</a>
                            <ul>
                                <li>
                                    <Link to="/" onClick={(event => {
                                        //event.preventDefault();
                                        onLogout();
                                    })}>LogOut</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                ) : (
                    <Link to="/login" >LogIn</Link>
                )
            }
        </div>
    );
}
export default MeniuLogin;