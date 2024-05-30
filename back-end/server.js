import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { app, server } from './socket/socket.js';
import authRoutes, { checkLogin } from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import protectRoute from './middleware/protectRoute.js';

import connectMongo from './mongoDb/connect.js';

// const server = express();
// Load Environment Variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', protectRoute, messageRoutes);
app.use('/api/conversation', protectRoute, conversationRoutes);

// route to check if user is logged in
app.use('/api/check', protectRoute, checkLogin);

server.listen(PORT, () => {
    connectMongo();
    console.log(`Server log: Server Running on Port ${PORT}`)
});