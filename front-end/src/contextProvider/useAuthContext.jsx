import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth-user')) || null);
    const navigate = useNavigate();

    // Save authUser to localStorage or remove it when authUser is null
    useEffect(() => {
        if(!authUser) {
            localStorage.removeItem('auth-user');
        } else {
            localStorage.setItem('auth-user', JSON.stringify(authUser));
            navigate('/'); // Navigate to Home page
        }
    },[authUser]);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { useAuthContext, AuthProvider };