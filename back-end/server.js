import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { app, server } from './socket/socket.js';
import authRoutes, { checkLogin } from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import protectRoute from './middleware/protectRoute.js';

import connectMongo from './mongoDb/connect.js';

const __dirname = path.resolve();
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/message', protectRoute, messageRoutes);
app.use('/api/conversation', protectRoute, conversationRoutes);

// route to check if user is logged in
app.post('/api/check', protectRoute, checkLogin);

// Serve static assets if in production
app.use(express.static(path.join(__dirname, '/front-end/dist')));

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'front-end', 'dist', 'index.html'));
})


server.listen(PORT, () => {
    connectMongo();
    console.log(`Server log: Server Running on Port ${PORT}`)
});