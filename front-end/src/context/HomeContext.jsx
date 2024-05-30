import { useContext, createContext, useState } from "react";

const HomeContext = createContext();

const useHomeContext = () => {
    return useContext(HomeContext);
}

const HomeContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    return(
        <HomeContext.Provider value={{ selectedChat, setSelectedChat }}>
            {children}
        </HomeContext.Provider>
    )
}

export { HomeContextProvider, useHomeContext }