import { useContext, useState, createContext } from "react";

const LoadingContext = createContext();

const useLoadingContext = () => {
    return useContext(LoadingContext);
}

const LoadingContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export { LoadingContextProvider, useLoadingContext}