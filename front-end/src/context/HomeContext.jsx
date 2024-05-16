import { useContext, createContext, useState } from "react";

const HomeContext = createContext();

const useHomeContext = () => {
    return useContext(HomeContext);
}

const HomeContextProvider = ({ children }) => {
    const [isSelectedChat, setSelectedChat] = useState(false);
    return(
        <HomeContext.Provider value={{ isSelectedChat, setSelectedChat }}>
            {children}
        </HomeContext.Provider>
    )
}

export { HomeContextProvider, useHomeContext }