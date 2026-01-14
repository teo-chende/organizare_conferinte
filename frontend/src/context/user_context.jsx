import { createContext } from "react";

const UserContext = createContext({
    nume: ``,
    isAuthenticated: false
});

export default UserContext;