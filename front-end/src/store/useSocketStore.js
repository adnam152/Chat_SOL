import { create } from 'zustand';
import io from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
    socket: null,

    // onlineUsers: [], // Danh sách người dùng đang online

    connectSocket: (userId) => {
        const existingSocket = get().socket;

        if (!existingSocket) {
            const newSocket = io("http://localhost:5000", { query: { userId } });
            set({ socket: newSocket });

            newSocket.on("disconnect", () => {
                set({ socket: null });
            });
        }
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    },
}));
