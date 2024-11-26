import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post('/send/:chatId', sendMessage);

router.get('/get/:chatId', getMessages);

export default router;