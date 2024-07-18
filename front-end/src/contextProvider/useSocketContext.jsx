import { createContext, useContext, useState, useEffect } from "react";
import io from 'socket.io-client';
import { useAuthContext } from "./useAuthContext";

const SocketContext = createContext();

const useSocketContext = () => {
    return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // [userId1, userId2, ...
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("/", {
                query: {
                    userId: authUser._id
                }
            })
            setSocket(newSocket);

            // Get online users
            newSocket.on("getOnlineUsers", (usersId) => {
                const onlineUsers = usersId.filter((id) => id !== authUser._id);
                setOnlineUsers(onlineUsers);
            });

            // close socket
            return () => newSocket.close();
        }
        else if (socket) {
            socket.close();
            setSocket(null);
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}

export { useSocketContext, SocketProvider };