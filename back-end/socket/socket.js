import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
// Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Map to store user and socket id 

const userSocketMap = {};

// Socket Connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    
    if(userId != 'undefined') {
        // Store user and socket id
        userSocketMap[userId] = socket.id;
        // console.log("Users connected: ", userSocketMap);
    }

    // Send online users to client
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Disconnect
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Get Socket Id
const getSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

export { app, server, getSocketId, io };