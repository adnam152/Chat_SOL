import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import protectRoute from './middleware/protectRoute.js';

import connectMongo from './mongoDb/connect.js';

const server = express();
// Load Environment Variables
dotenv.config();
const PORT = process.env.PORT || 5000;
// Middleware
server.use(cors());
server.use(express.json());
server.use(cookieParser());

server.use('/api/auth', authRoutes);
server.use('/api/message', protectRoute, messageRoutes);
server.use('/api/user', protectRoute, userRoutes);

server.listen(PORT, ()=> {
    connectMongo();
    console.log(`Server log: Server Running on Port ${PORT}`)
});