import { useContext, useState, createContext } from "react";

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("auth-user")) || null);
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider, useAuthContext };