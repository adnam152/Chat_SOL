import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

const useSocketContext = () => {
    return useContext(SocketContext);
}

const SoketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [online, setOnline] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if(authUser){
            const newSocket = io("http://localhost:5000",{
                query: {
                    userId: authUser._id
                }
            })
            setSocket(newSocket);

            // Get online users
            newSocket.on("getOnlineUsers", (usersId) => {
                const onlineUsers = usersId.filter((id) => id !== authUser._id);
                setOnline(onlineUsers);
            });

            // close socket
            return () => newSocket.close();
        }
        else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[authUser]);

    return (
        <SocketContext.Provider value={{socket, online}}>
            {children}
        </SocketContext.Provider>
    )
}

export { SoketContextProvider, useSocketContext }