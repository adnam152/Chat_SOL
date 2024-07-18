import express from "express";
import { getConversationForSideBar, getConversationByUsername, setReadLastMessage } from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", getConversationForSideBar);

router.get("/search/:username", getConversationByUsername);

router.put("/read/:conversationId", setReadLastMessage);

export default router;