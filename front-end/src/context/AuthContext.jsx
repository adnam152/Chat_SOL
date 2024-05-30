import { useContext, useState, createContext, useEffect } from "react";

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("auth-user")) || null);

    // Remove user data from local storage when user logs out
    useEffect(()=>{
        if(!authUser){
            localStorage.removeItem('auth-user');
        }
    },[authUser])
    
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider, useAuthContext };