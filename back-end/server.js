import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { app, server } from './socket/socket.js';
import authRoutes, { checkLogin } from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import chatRoutes from './routes/chat.routes.js';
import betRoutes from './routes/bet.routes.js';
import gameRoutes from './routes/game.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import authMiddleware from './middleware/authMiddleware.js';

import connectMongo from './mongoDb/connect.js';

const __dirname = path.resolve();

// Load Environment Variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ["*"],
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/message', authMiddleware, messageRoutes);
app.use('/api/game', authMiddleware, gameRoutes);
app.use('/api/bet', authMiddleware, betRoutes);

// route to check if user is logged in
app.post('/api/check', authMiddleware, checkLogin);

// Transaction routes
app.use('/api/transaction', authMiddleware, transactionRoutes);


// DEPLOY
// Serve static assets if in production
app.use(express.static(path.join(__dirname, '/front-end/dist')));

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'front-end', 'dist', 'index.html'));
})


server.listen(PORT, () => {
    connectMongo();
    console.log(`Server log: Server Running on Port ${PORT}`)
});